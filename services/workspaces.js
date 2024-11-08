const redisClient = require("../config/redisClient");
const fs = require("fs");
const path = require("path");

// Helper function to load mock workspace data from the static JSON file
function loadMockWorkspaces() {
  const dataPath = path.resolve(__dirname, "../static/workspaces.json");
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData);
}

// Function to find a workspace by ID from the mock data
function findWorkspaceById(workspaceId) {
  const workspaces = loadMockWorkspaces();
  return workspaces.find((workspace) => workspace.id === workspaceId);
}

// Function to set environment variables for a workspace
async function setWorkspaceEnv(workspaceId) {
  const workspace = findWorkspaceById(workspaceId);
  if (workspace) {
    const env = JSON.stringify(workspace.env);
    await redisClient.set(`workspace:${workspaceId}:env`, env, { EX: 3600 }); // Set expiration to 1 hour
  }
}

// Function to get environment variables from Redis or refresh from static data if expired
async function getWorkspaceEnv(workspaceId) {
  const envData = await redisClient.get(`workspace:${workspaceId}:env`);

  if (envData) {
    return JSON.parse(envData); // Return cached env data
  } else {
    await setWorkspaceEnv(workspaceId); // Refresh from static data
    return JSON.parse(await redisClient.get(`workspace:${workspaceId}:env`));
  }
}

// Sample static data for products, orders, and customers
const staticData = {
  products: [
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
  ],
  orders: [
    { id: 1, status: "completed" },
    { id: 2, status: "pending" },
  ],
  customers: [
    { id: 1, name: "Customer X" },
    { id: 2, name: "Customer Y" },
  ],
};

// Function to cache a list with a 60-second expiration
async function cacheList(workspaceId, listType, data) {
  const key = `workspace:${workspaceId}:${listType}`;
  await redisClient.set(key, JSON.stringify(data), { EX: 60 }); // Cache for 60 seconds
}

// Function to get a cached list or use static data if not available
async function getCachedList(workspaceId, listType) {
  const key = `workspace:${workspaceId}:${listType}`;
  const cachedData = await redisClient.get(key);

  if (cachedData) {
    return JSON.parse(cachedData); // Return cached data
  } else {
    // Use static data if not cached
    const data = staticData[listType];
    await cacheList(workspaceId, listType, data); // Cache the static data
    return data;
  }
}

// Wrapper functions for getting cached lists with static data
async function getProductsList(workspaceId) {
  return getCachedList(workspaceId, "products");
}

async function getOrdersList(workspaceId) {
  return getCachedList(workspaceId, "orders");
}

async function getCustomersList(workspaceId) {
  return getCachedList(workspaceId, "customers");
}

module.exports = {
  setWorkspaceEnv,
  getWorkspaceEnv,
  getProductsList,
  getOrdersList,
  getCustomersList,
};
