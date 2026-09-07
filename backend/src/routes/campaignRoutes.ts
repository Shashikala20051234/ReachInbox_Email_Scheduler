import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Create campaign
router.post("/", async (req, res) => {
  try {
    const {
      name,
      subject,
      body,
      scheduledAt,
      userId,
      emailAccountId,
    } = req.body;

    if (!name || !subject || !body || !userId || !emailAccountId) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        subject,
        body,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        userId: Number(userId),
        emailAccountId: Number(emailAccountId),
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create campaign",
    });
  }
});

// Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        user: true,
        emailAccount: true,
        emails: true,
      },
    });

    res.json(campaigns);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch campaigns",
    });
  }
});

export default router;