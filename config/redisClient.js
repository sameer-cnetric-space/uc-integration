const redis = require("redis");

// Create and configure the Redis client
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // Adjust as needed
  socket: {
    reconnectStrategy: (retries) => {
      if (retries >= 5) {
        console.error("Max retries reached. Exiting...");
        return new Error("Max retries reached. Exiting...");
      }
      console.warn(`Redis retry attempt: ${retries}`);
      return Math.min(retries * 100, 3000); // Exponential backoff, max 3 seconds
    },
    connectTimeout: 10000, // Set timeout for connection attempt to 10 seconds
  },
});

client.on("error", (err) => console.error("Redis Client Error", err));
client.on("ready", () => console.log("Redis Client Connected Successfully"));
client.on("reconnecting", (delay) =>
  console.log(`Redis Client reconnecting in ${delay}ms`)
);

// Connect to Redis with error handling
(async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

module.exports = client;
