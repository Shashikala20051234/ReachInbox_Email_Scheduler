import { Router } from "express";
import { prisma } from "../lib/prisma";
import { emailQueue } from "../queue/emailQueue";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      recipient,
      subject,
      body,
      scheduledAt,
      campaignId,
    } = req.body;

    if (!recipient || !subject || !body || !scheduledAt || !campaignId) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const scheduledDate = new Date(scheduledAt);

    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({
        message: "Invalid scheduledAt date",
      });
    }

    // 1. Save scheduled email in PostgreSQL
    const scheduledEmail = await prisma.scheduledEmail.create({
      data: {
        recipient,
        subject,
        body,
        scheduledAt: scheduledDate,
        campaignId: Number(campaignId),
      },
    });

    // 2. Calculate delay until scheduled time
    const delay = Math.max(
      scheduledDate.getTime() - Date.now(),
      0
    );

    // 3. Add email job to BullMQ
    await emailQueue.add(
      "send-email",
      {
        scheduledEmailId: scheduledEmail.id,
      },
      {
        delay,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    res.status(201).json({
      message: "Email scheduled successfully",
      scheduledEmail,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to schedule email",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const emails = await prisma.scheduledEmail.findMany({
      include: {
        campaign: true,
      },
    });

    res.json(emails);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch scheduled emails",
    });
  }
});

export default router;