// integrations/graphql/admin/vendure/handlers/authHandler.js
const createApolloClient = require("../../../../../api/apollo/apolloClient");
const adminAuth = require("../queries/auth");
const redisClient = require("../../../../../config/redisClient");

class AuthHandler {
  constructor(workspaceId) {
    this.workspaceId = workspaceId;
    this.envKey = `workspace:${workspaceId}:env`;
  }

  // Perform login and retrieve token from response headers
  async login() {
    try {
      const envData = await this.getWorkspaceEnv();
      const client = createApolloClient(envData.baseUrl);

      // Execute the login mutation and capture headers
      const response = await client.mutate({
        mutation: adminAuth.LOGIN_MUTATION,
        variables: {
          username: envData.username,
          password: envData.password,
          rememberMe: true,
        },
        context: {
          fetchOptions: {
            method: "POST",
          },
        },
      });

      // Retrieve the token from response headers
      const token = response.context.response.headers.get("vendure-auth-token");
      if (!token) {
        throw new Error("Authentication token not found in headers");
      }

      // Update the `adminAuth` field with the new token and store it in Redis
      envData.adminAuth = token;
      await redisClient.set(this.envKey, JSON.stringify(envData));

      return token;
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error("Failed to authenticate with Vendure");
    }
  }

  // Get workspace environment details from Redis
  async getWorkspaceEnv() {
    const envDataString = await redisClient.get(this.envKey);
    const envData = JSON.parse(envDataString);

    // Ensure necessary fields are available
    if (
      !envData ||
      envData.commerce !== "vendure" ||
      !envData.username ||
      !envData.password ||
      !envData.baseUrl
    ) {
      throw new Error(
        `Incomplete or invalid Vendure credentials for workspace ${this.workspaceId}`
      );
    }

    return envData;
  }

  // Get token from Redis or trigger login if it doesn't exist
  async getToken() {
    const envData = await this.getWorkspaceEnv();

    // Check if `adminAuth` token exists
    if (envData.adminAuth) {
      return envData.adminAuth;
    }

    // Token is missing, perform login to retrieve a new one
    return await this.login();
  }
}

module.exports = AuthHandler;
