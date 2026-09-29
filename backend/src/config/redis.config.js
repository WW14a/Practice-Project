import { createClient } from "redis";

const redis = createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export const connectRedis = async () => {
  await redis.connect();
  console.log("Connected to Redis");
};

export default redis;
