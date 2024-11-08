// src/controllers/commerceController.js
const commerceService = require("../../../services/admin/commerce");

class CommerceController {
  // Controller method to get products list
  async getProductsList(req, res) {
    try {
      const workspaceId = req.params.workspaceId;
      const productsList = await commerceService.getProductsList(workspaceId);
      res.status(200).json({ products: productsList });
    } catch (error) {
      console.error("Error in getProductsList controller:", error);
      res.status(500).json({ error: "Failed to fetch products list" });
    }
  }

  // Controller method to get a single product by ID
  async getProductById(req, res) {
    try {
      const { workspaceId, productId } = req.params;
      const product = await commerceService.getProductById(
        workspaceId,
        productId
      );
      res.status(200).json({ product: product });
    } catch (error) {
      console.error("Error in getProductById controller:", error);
      res.status(500).json({ error: "Failed to fetch product by ID" });
    }
  }

  // Controller method to get customers list
  async getCustomersList(req, res) {
    try {
      const workspaceId = req.params.workspaceId;
      const customersList = await commerceService.getCustomersList(workspaceId);
      res.status(200).json({ customers: customersList });
    } catch (error) {
      console.error("Error in getCustomersList controller:", error);
      res.status(500).json({ error: "Failed to fetch customers list" });
    }
  }

  // Controller method to get a single customer by ID
  async getCustomerById(req, res) {
    try {
      const { workspaceId, customerId } = req.params;
      const customer = await commerceService.getCustomerById(
        workspaceId,
        customerId
      );
      res.status(200).json(customer);
    } catch (error) {
      console.error("Error in getCustomerById controller:", error);
      res.status(500).json({ error: "Failed to fetch customer by ID" });
    }
  }

  // Controller method to get orders list
  async getOrdersList(req, res) {
    try {
      const workspaceId = req.params.workspaceId;
      const ordersList = await commerceService.getOrdersList(workspaceId);
      res.status(200).json(ordersList);
    } catch (error) {
      console.error("Error in getOrdersList controller:", error);
      res.status(500).json({ error: "Failed to fetch orders list" });
    }
  }

  // Controller method to get a single order by ID
  async getOrderById(req, res) {
    try {
      const { workspaceId, orderId } = req.params;
      const order = await commerceService.getOrderById(workspaceId, orderId);
      res.status(200).json(order);
    } catch (error) {
      console.error("Error in getOrderById controller:", error);
      res.status(500).json({ error: "Failed to fetch order by ID" });
    }
  }
}

module.exports = new CommerceController();
