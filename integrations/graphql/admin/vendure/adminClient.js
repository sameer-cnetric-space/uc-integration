const createApolloClient = require("../../../../api/apollo/apolloClient");
const redisService = require("../../../../services/redis");

async function getVendureClient(workspaceId) {
  // Retrieve the 'env' data from Redis for the specified workspace
  const envData = await redisService.getEnv(workspaceId);

  if (!envData) {
    throw new Error(
      `Environment variables for workspace ${workspaceId} not found in Redis`
    );
  }

  // Parse the environment data
  const { commerce, baseUrl, adminAuth } = envData;

  // Check if the workspace is of type "vendure"
  if (commerce !== "vendure") {
    throw new Error(`Workspace ${workspaceId} is not a Vendure workspace`);
  }

  // Validate baseUrl and adminAuth
  if (!baseUrl || !adminAuth) {
    throw new Error(`Incomplete environment data for workspace ${workspaceId}`);
  }

  // Create and return the Vendure Apollo Client
  return createApolloClient(`${baseUrl}/admin-api`, {
    Authorization: `Bearer ${adminAuth}`,
  });
}

module.exports = getVendureClient;
