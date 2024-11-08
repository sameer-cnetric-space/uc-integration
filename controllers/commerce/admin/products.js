const { getProducts } = require("../services/commerceService");

// Controller function to get products for a specific workspace and commerce
async function getProductsByCommerce(req, res) {
  const { workspaceId } = req.params;

  try {
    // Fetch products based on workspaceId and comName
    const products = await getProducts(workspaceId);

    // Return standardized products
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
}

module.exports = {
  getProductsByCommerce,
};
