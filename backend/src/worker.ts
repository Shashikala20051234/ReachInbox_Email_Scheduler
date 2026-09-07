import IORedis from "ioredis";
import "./worker/emailWorker";

const connection = new IORedis({
  host: "172.26.4.207",
  port: 6379,
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("✅ Worker connected to Redis");
});

connection.on("ready", () => {
  console.log("🚀 Worker Redis connection ready");
});

connection.on("error", (error) => {
  console.error("❌ Worker Redis error:", error.message);
});