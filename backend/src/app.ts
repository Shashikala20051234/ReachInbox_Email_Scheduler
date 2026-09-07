import { emailQueue } from "./queue/emailQueue";
import campaignRoutes from "./routes/campaignRoutes";
import emailAccountRoutes from "./routes/emailAccountRoutes";
import scheduledEmailRoutes from "./routes/scheduledEmailRoutes";

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ReachInbox Email Scheduler API is running",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/email-accounts", emailAccountRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/scheduled-emails", scheduledEmailRoutes);
export default app;