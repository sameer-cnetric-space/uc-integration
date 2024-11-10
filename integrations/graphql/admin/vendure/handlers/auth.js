const getVendureClient = require("../adminClient");
const adminAuth = require("../queries/auth");
const redisService = require("../../../../../services/redis");

class AuthHandler {
  constructor(workspaceId) {
    this.workspaceId = workspaceId;
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
      await redisService.setEnv(this.workspaceId, envData);

      return token;
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error("Failed to authenticate with Vendure");
    }
  }

  // Get workspace environment details from Redis
  async getWorkspaceEnv() {
    const envData = await redisService.getEnv(this.workspaceId);

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

  // Make an authenticated request with automatic retry on `FORBIDDEN` error
  async makeAuthenticatedRequest(query, variables = {}) {
    let client = await getVendureClient(this.workspaceId);

    try {
      const response = await client.query({ query, variables });
      return response.data;
    } catch (error) {
      // Check if the error is a `FORBIDDEN` error
      if (
        error.networkError?.result?.errors?.[0]?.extensions?.code ===
        "FORBIDDEN"
      ) {
        console.log("Token expired, re-authenticating...");

        // Re-authenticate and update the token in Redis
        await this.login();

        // Create a new client with the updated token
        client = await getVendureClient(this.workspaceId);

        // Retry the request with the new client
        const retryResponse = await client.query({ query, variables });
        return retryResponse.data;
      } else {
        throw error; // Propagate other errors
      }
    }
  }
}

module.exports = AuthHandler;
