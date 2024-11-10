// services/RedisService.js
const redisClient = require("../config/redisClient");

class RedisService {
  constructor() {
    this.client = redisClient;
  }

  // Store environment data as a JSON string
  async setEnv(workspaceId, envData) {
    const key = `workspace:${workspaceId}:env`;
    await this.client.set(key, JSON.stringify(envData));
  }

  // Retrieve environment data and parse as JSON
  async getEnv(workspaceId) {
    const key = `workspace:${workspaceId}:env`;
    const envDataString = await this.client.get(key);
    return envDataString ? JSON.parse(envDataString) : null;
  }

  // Store cached data with optional TTL
  async setCache(key, value, ttl = null) {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.client.set(key, stringValue, { EX: ttl });
    } else {
      await this.client.set(key, stringValue);
    }
  }

  // Retrieve cached data and parse as JSON
  async getCache(key) {
    const cachedDataString = await this.client.get(key);
    return cachedDataString ? JSON.parse(cachedDataString) : null;
  }

  // Clear specific cache key
  async clearCache(key) {
    await this.client.del(key);
  }
}

module.exports = new RedisService();
