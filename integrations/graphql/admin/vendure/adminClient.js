// const createApolloClient = require("../../../../api/apollo/apolloClient");
// const env = require("../../../../static/workspaces");

// // Function to create and configure Vendure Apollo Client
// function getVendureClient() {
//   return createApolloClient(`${env.baseUrl}/admin-api`, {
//     Authorization: `Bearer ${env.adminAuth}`,
//   });
// }

// module.exports = getVendureClient;

const createApolloClient = require("../../../../api/apollo/apolloClient");
const redisClient = require("../../../../config/redisClient");

async function getVendureClient(workspaceId) {
  // Retrieve the 'env' data from the Redis key for the specified workspace
  const envData = await redisClient.get(`workspace:${workspaceId}:env`);

  if (!envData) {
    throw new Error(
      `Environment variables for workspace ${workspaceId} not found in Redis`
    );
  }

  // Parse the environment data
  const parsedEnvData = JSON.parse(envData);
  const { commerce, baseUrl, adminAuth } = parsedEnvData;

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
