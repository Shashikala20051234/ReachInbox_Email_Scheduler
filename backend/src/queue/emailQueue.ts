import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "172.26.4.207",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue("emailQueue", {
  connection,
});

