const productHandler = require("./handlers/products");
const customerHandler = require("./handlers/customers");
const orderHandler = require("./handlers/orders");

class Integrator {
  constructor() {
    this.handlers = {
      products: productHandler,
      customers: customerHandler,
      orders: orderHandler,
    };
  }

  // Get the handler for a specific entity (e.g., products, customers, orders)
  getHandler(entity) {
    const handler = this.handlers[entity];
    if (!handler) {
      throw new Error(`Handler for entity "${entity}" not found.`);
    }
    return handler;
  }

  // Example method to call a handler function dynamically
  async execute(entity, action, ...args) {
    const handler = this.getHandler(entity);
    if (typeof handler[action] !== "function") {
      throw new Error(
        `Action "${action}" not found on handler for "${entity}"`
      );
    }
    return await handler[action](...args);
  }
}

module.exports = new Integrator();
