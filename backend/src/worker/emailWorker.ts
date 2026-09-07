import { Worker } from "bullmq";
import IORedis from "ioredis";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma";

const connection = new IORedis({
  host: "172.26.4.207",
  port: 6379,
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("✅ Email worker connected to Redis");
});

connection.on("ready", () => {
  console.log("🚀 Email worker Redis connection ready");
});

connection.on("error", (error) => {
  console.error("❌ Email worker Redis error:", error.message);
});

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log(`Processing email job: ${job.id}`);

    const { scheduledEmailId } = job.data;

    const scheduledEmail = await prisma.scheduledEmail.findUnique({
      where: {
        id: Number(scheduledEmailId),
      },
      include: {
        campaign: {
          include: {
            emailAccount: true,
          },
        },
      },
    });

    if (!scheduledEmail) {
      throw new Error("Scheduled email not found");
    }

    const emailAccount = scheduledEmail.campaign.emailAccount;

    console.log("From:", emailAccount.email);
    console.log("To:", scheduledEmail.recipient);
    console.log("Subject:", scheduledEmail.subject);

    const transporter = nodemailer.createTransport({
      host: emailAccount.smtpHost,
      port: emailAccount.smtpPort,
      secure: emailAccount.smtpPort === 465,
      auth: {
        user: emailAccount.smtpUser,
        pass: emailAccount.smtpPassword,
      },
    });

    try {
      // Send email
      await transporter.sendMail({
        from: `"${emailAccount.displayName || emailAccount.email}" <${emailAccount.email}>`,
        to: scheduledEmail.recipient,
        subject: scheduledEmail.subject,
        text: scheduledEmail.body,
      });

      // Mark email as SENT
      await prisma.scheduledEmail.update({
        where: {
          id: scheduledEmail.id,
        },
        data: {
          status: "SENT",
          sentAt: new Date(),
          errorMessage: null,
        },
      });

      console.log(`📨 Email sent to ${scheduledEmail.recipient}`);

      // Check whether all emails in this campaign are sent
      const remainingEmails = await prisma.scheduledEmail.count({
        where: {
          campaignId: scheduledEmail.campaignId,
          status: {
            not: "SENT",
          },
        },
      });

      // If no emails remain, mark campaign as COMPLETED
      if (remainingEmails === 0) {
        await prisma.campaign.update({
          where: {
            id: scheduledEmail.campaignId,
          },
          data: {
            status: "COMPLETED",
          },
        });

        console.log(
          `🎯 Campaign ${scheduledEmail.campaignId} completed`
        );
      }

      return {
        success: true,
        recipient: scheduledEmail.recipient,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown email error";

      // Only mark FAILED after the final retry
      const isFinalAttempt =
        job.attemptsMade >= (job.opts.attempts || 1) - 1;

      if (isFinalAttempt) {
        await prisma.scheduledEmail.update({
          where: {
            id: scheduledEmail.id,
          },
          data: {
            status: "FAILED",
            errorMessage,
          },
        });

        console.error(
          `❌ Email permanently failed: ${errorMessage}`
        );
      } else {
        console.warn(
          `⚠️ Email attempt ${job.attemptsMade + 1} failed. Retrying...`
        );
      }

      throw error;
    }
  },
  {
    connection,
    concurrency: Number(process.env.WORKER_CONCURRENCY) || 5,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(
    `❌ Email job ${job?.id} failed:`,
    error.message
  );
});

console.log("📧 Email worker is running...");