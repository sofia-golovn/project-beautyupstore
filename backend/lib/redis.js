import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    maxRetriesPerRequest: null, 
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on("error", (err) => {
    console.error("[ioredis] Error Redis:", err.message);
});

redis.on("connect", () => {
    console.log("Successfully connected to Redis");
});