// routes/commerce/admin/index.js
const express = require("express");
const commerceController = require("../../../controllers/commerce/admin/index");

const router = express.Router();

// Define routes for products
router.get(
  "/workspaces/:workspaceId/products",
  commerceController.getProductsList
);
router.get(
  "/workspaces/:workspaceId/products/:productId",
  commerceController.getProductById
);

// Define routes for customers
router.get(
  "/workspaces/:workspaceId/customers",
  commerceController.getCustomersList
);
router.get(
  "/workspaces/:workspaceId/customers/:customerId",
  commerceController.getCustomerById
);

// Define routes for orders
router.get("/workspaces/:workspaceId/orders", commerceController.getOrdersList);
router.get(
  "/workspaces/:workspaceId/orders/:orderId",
  commerceController.getOrderById
);

module.exports = router;
