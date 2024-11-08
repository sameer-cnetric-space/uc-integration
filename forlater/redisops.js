// services/workspaceService.js

const redisClient = require("../config/redisClient");
const db = require("../config/db"); // Assuming a database client is set up to fetch workspace data

// Function to set environment variables for a workspace
async function setWorkspaceEnv(workspaceId) {
  const workspace = await db.Workspace.findByPk(workspaceId); // Fetch from DB
  if (workspace) {
    const env = JSON.stringify(workspace.env);
    await redisClient.set(`workspace:${workspaceId}:env`, env, { EX: 3600 }); // Set expiration to 1 hour
  }
}

// Function to get environment variables from Redis or refresh from DB if expired
async function getWorkspaceEnv(workspaceId) {
  const envData = await redisClient.get(`workspace:${workspaceId}:env`);

  if (envData) {
    return JSON.parse(envData); // Return cached env data
  } else {
    await setWorkspaceEnv(workspaceId); // Refresh from DB
    return JSON.parse(await redisClient.get(`workspace:${workspaceId}:env`));
  }
}

// Function to cache a list with a 60-second expiration
async function cacheList(workspaceId, listType, data) {
  const key = `workspace:${workspaceId}:${listType}`;
  await redisClient.set(key, JSON.stringify(data), { EX: 60 }); // Cache for 60 seconds
}

// Function to get a cached list or refresh if expired
async function getCachedList(workspaceId, listType, fetchFunction) {
  const key = `workspace:${workspaceId}:${listType}`;
  const cachedData = await redisClient.get(key);

  if (cachedData) {
    return JSON.parse(cachedData); // Return cached data
  } else {
    // Fetch data if not cached
    const data = await fetchFunction(workspaceId);
    await cacheList(workspaceId, listType, data); // Cache the fetched data
    return data;
  }
}

// Example: Functions to fetch lists from the database
async function fetchProductsList(workspaceId) {
  // Replace with actual DB or API call to get products list for the workspace
  const products = await db.Products.findAll({ where: { workspaceId } });
  return products;
}

async function fetchOrdersList(workspaceId) {
  // Replace with actual DB or API call to get orders list for the workspace
  const orders = await db.Orders.findAll({ where: { workspaceId } });
  return orders;
}

async function fetchCustomersList(workspaceId) {
  // Replace with actual DB or API call to get customers list for the workspace
  const customers = await db.Customers.findAll({ where: { workspaceId } });
  return customers;
}

// Wrapper functions for getting cached lists
async function getProductsList(workspaceId) {
  return getCachedList(workspaceId, "productsList", fetchProductsList);
}

async function getOrdersList(workspaceId) {
  return getCachedList(workspaceId, "ordersList", fetchOrdersList);
}

async function getCustomersList(workspaceId) {
  return getCachedList(workspaceId, "customersList", fetchCustomersList);
}

module.exports = {
  setWorkspaceEnv,
  getWorkspaceEnv,
  getProductsList,
  getOrdersList,
  getCustomersList,
};

//////////////////////////////////////

const workspaceService = require("./services/workspaceService");

async function exampleUsage(workspaceId) {
  // Get workspace environment variables
  const env = await workspaceService.getWorkspaceEnv(workspaceId);
  console.log("Workspace Environment:", env);

  // Get cached products list
  const productsList = await workspaceService.getProductsList(workspaceId);
  console.log("Products List:", productsList);

  // Get cached orders list
  const ordersList = await workspaceService.getOrdersList(workspaceId);
  console.log("Orders List:", ordersList);

  // Get cached customers list
  const customersList = await workspaceService.getCustomersList(workspaceId);
  console.log("Customers List:", customersList);
}

exampleUsage(1).catch(console.error);
