const getVendureClient = require("../adminClient");
const adminCustomersQuery = require("../queries/customers");
const redisClient = require("../../../../../config/redisClient");

async function getCustomers(workspaceId) {
  const customersCacheKey = `workspace:${workspaceId}:customersList`;

  try {
    // Try to retrieve customers list from Redis cache
    const cachedData = await redisClient.get(customersCacheKey);
    if (cachedData) {
      return JSON.parse(cachedData); // Return cached data if available
    }

    // Create Vendure client and execute the query
    const client = await getVendureClient(workspaceId);
    const { data } = await client.query({
      query: adminCustomersQuery.GET_CUSTOMERS_QUERY,
    });

    // Standardize the customer data format
    const standardizedCustomers = data.customers.items.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      emailAddress: item.emailAddress,
      phoneNumber: item.phoneNumber,
    }));

    // Cache the standardized customers list in Redis for 60 seconds
    await redisClient.set(
      customersCacheKey,
      JSON.stringify(standardizedCustomers),
      {
        EX: 300,
      }
    );

    return standardizedCustomers;
  } catch (error) {
    console.error("Error in getCustomers:", error);
    throw new Error("Failed to fetch customers list");
  }
}

module.exports = {
  getCustomers,
};
