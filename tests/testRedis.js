const productService = require("../services/workspaces");

async function exampleUsage() {
  const workspaceId = 1;

  // Fetch products
  try {
    const products = await productService.getProducts(workspaceId);
    console.log("Products:", products);
  } catch (error) {
    console.error(error.message);
  }

  // Fetch a product by ID
  try {
    const productId = "58"; // Replace with actual product ID
    const product = await productService.getProductById(workspaceId, productId);
    console.log("Product by ID:", product);
  } catch (error) {
    console.error(error.message);
  }
}

exampleUsage();
