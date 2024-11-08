const { loadCredentials } = require("../../config/credentialsManager");
const redisClient = require("../../config/redis");
const vendureStrategy = require("./strategies/vendureStrategy");
const shopifyStrategy = require("./strategies/shopifyStrategy");

const strategies = {
  vendure: vendureStrategy,
  shopify: shopifyStrategy,
};

class TokenManager {
  constructor(service) {
    this.service = service;
    this.strategy = strategies[service];

    if (!this.strategy) {
      throw new Error(`No token strategy found for service: ${service}`);
    }

    this.credentials = null;
  }

  // Load credentials for the specific service
  async loadCredentials() {
    if (!this.credentials) {
      const allCredentials = loadCredentials();
      this.credentials = allCredentials[this.service];

      if (!this.credentials) {
        throw new Error(
          `Credentials for ${this.service} not found in the credentials file.`
        );
      }
    }
    return this.credentials;
  }

  // Retrieve the token from Redis
  async getStoredToken() {
    const token = await redisClient.get(`${this.service}_token`);
    const expiration = await redisClient.ttl(`${this.service}_token`); // TTL in seconds

    if (token && expiration > 0) {
      return { token, expiration };
    }
    return null;
  }

  // Save the token in Redis with expiration
  async storeToken(token, expiresIn) {
    const redisKey = `${this.service}_token`;

    await redisClient.set(redisKey, token, {
      EX: expiresIn, // Set expiration in seconds
    });
  }

  // Check if the token exists and is not expired
  async isTokenExpired() {
    const storedToken = await this.getStoredToken();
    return !storedToken || storedToken.expiration <= 0;
  }

  // Generate a new token using the service-specific strategy
  async generateNewToken() {
    const credentials = await this.loadCredentials();
    const { token, expiresIn } = await this.strategy.getToken(credentials);

    if (expiresIn) {
      await this.storeToken(token, expiresIn); // Store with expiration
    } else {
      await this.storeToken(token, 365 * 24 * 60 * 60); // Store without expiration (e.g., 1 year)
    }

    return token;
  }

  // Retrieve the token, generating a new one if expired
  async getToken() {
    if (await this.isTokenExpired()) {
      return await this.generateNewToken();
    }

    const { token } = await this.getStoredToken();
    return token;
  }
}

module.exports = TokenManager;
