const { createClient } = require("redis");

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379
    }
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error);
});

const connectRedis = async () => {
    await redisClient.connect();

    console.log("Redis connected successfully");
};

module.exports = {
    redisClient,
    connectRedis
};