const integrator = require("../../integrations/graphql/admin/vendure/integrator");

class CommerceService {
  constructor() {
    this.integrator = integrator;
  }

  // Fetches products list with caching via the products handler
  async getProductsList(workspaceId) {
    try {
      const productsList = await this.integrator.execute(
        "products",
        "getProducts",
        workspaceId
      );
      return productsList;
    } catch (error) {
      console.error("Error in getProductsList:", error);
      throw new Error("Failed to fetch products list");
    }
  }

  // Fetches a single product by ID via the products handler
  async getProductById(workspaceId, productId) {
    try {
      const product = await this.integrator.execute(
        "products",
        "getProductById",
        workspaceId,
        productId
      );
      return product;
    } catch (error) {
      console.error("Error in getProductById:", error);
      throw new Error("Failed to fetch product by ID");
    }
  }

  // Fetches customers list via the customers handler
  async getCustomersList(workspaceId) {
    try {
      const customersList = await this.integrator.execute(
        "customers",
        "getCustomers",
        workspaceId
      );
      return customersList;
    } catch (error) {
      console.error("Error in getCustomersList:", error);
      throw new Error("Failed to fetch customers list");
    }
  }

  // Fetches a single customer by ID via the customers handler
  async getCustomerById(workspaceId, customerId) {
    try {
      const customer = await this.integrator.execute(
        "customers",
        "getCustomerById",
        workspaceId,
        customerId
      );
      return customer;
    } catch (error) {
      console.error("Error in getCustomerById:", error);
      throw new Error("Failed to fetch customer by ID");
    }
  }

  // Fetches orders list via the orders handler
  async getOrdersList(workspaceId) {
    try {
      const ordersList = await this.integrator.execute(
        "orders",
        "getOrders",
        workspaceId
      );
      return ordersList;
    } catch (error) {
      console.error("Error in getOrdersList:", error);
      throw new Error("Failed to fetch orders list");
    }
  }

  // Fetches a single order by ID via the orders handler
  async getOrderById(workspaceId, orderId) {
    try {
      const order = await this.integrator.execute(
        "orders",
        "getOrderById",
        workspaceId,
        orderId
      );
      return order;
    } catch (error) {
      console.error("Error in getOrderById:", error);
      throw new Error("Failed to fetch order by ID");
    }
  }
}

module.exports = new CommerceService();
