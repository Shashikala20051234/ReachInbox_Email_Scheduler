import { Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// Create email account
router.post("/", async (req, res) => {
  try {
    const {
      email,
      displayName,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
      userId,
    } = req.body;

    if (
      !email ||
      !smtpHost ||
      !smtpPort ||
      !smtpUser ||
      !smtpPassword ||
      !userId
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const account = await prisma.emailAccount.create({
      data: {
        email,
        displayName,
        smtpHost,
        smtpPort: Number(smtpPort),
        smtpUser,
        smtpPassword,
        userId: Number(userId),
      },
    });

    res.status(201).json(account);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create email account",
    });
  }
});

// Get all email accounts
router.get("/", async (req, res) => {
  try {
    const accounts = await prisma.emailAccount.findMany();

    res.json(accounts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch email accounts",
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      displayName,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPassword,
    } = req.body;

    const account = await prisma.emailAccount.update({
      where: {
        id: Number(id),
      },
      data: {
        email,
        displayName,
        smtpHost,
        smtpPort: Number(smtpPort),
        smtpUser,
        smtpPassword,
      },
    });

    res.json({
      message: "Email account updated successfully",
      account,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update email account",
    });
  }
});
export default router;