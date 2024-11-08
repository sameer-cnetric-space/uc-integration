const getVendureClient = require("../adminClient");
const adminProductsQuery = require("../queries/products");
const redisClient = require("../../../../../config/redisClient");

// Function to fetch and standardize product data with caching for productsList in a separate key with 60-second TTL
async function getProducts(workspaceId) {
  const productsCacheKey = `workspace:${workspaceId}:productsList`; // Separate key for productsList with TTL

  try {
    // Try to retrieve products list from Redis cache
    const cachedData = await redisClient.get(productsCacheKey);
    if (cachedData) {
      console.log("Cache hit for productsList:", productsCacheKey);
      return JSON.parse(cachedData); // Return cached data if available
    }
    console.log("Cache miss for productsList:", productsCacheKey);

    const client = await getVendureClient(workspaceId);

    // Execute the query with the Apollo Client
    const { data } = await client.query({
      query: adminProductsQuery.GET_PRODUCTS_QUERY,
    });

    // Standardize the product data format based on the updated query structure
    const standardizedProducts = data.products.items.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      enabled: item.enabled,
      imageUrl: item.featuredAsset ? item.featuredAsset.preview : null,
      variantCount: item.variantList ? item.variantList.totalItems : 0,
    }));

    // Cache the standardized products list in a separate Redis key for 60 seconds
    await redisClient.set(
      productsCacheKey,
      JSON.stringify(standardizedProducts),
      {
        EX: 300, // Set expiration to 60 seconds for productsList only
      }
    );

    console.log("Cached productsList successfully:", productsCacheKey);
    return standardizedProducts;
  } catch (error) {
    console.error("Error in getProducts:", error);
    throw new Error("Failed to fetch products");
  }
}

// Function to fetch and standardize data for a specific product by ID without caching
async function getProductById(workspaceId, productId) {
  const client = await getVendureClient(workspaceId);

  try {
    // Execute the query with the Apollo Client
    const { data } = await client.query({
      query: adminProductsQuery.GET_PRODUCT_BY_ID_QUERY,
      variables: { productId },
    });

    // Standardize the product data format
    const product = data.product;
    const standardizedProduct = {
      id: product.id,
      name: product.name,
      updatedAt: product.updatedAt,
      slug: product.slug,
      description: product.description,
      collections: product.collections.map((collection) => collection.name),
      featuredImageUrl: product.featuredAsset
        ? product.featuredAsset.preview
        : null,
      variantCount: product.variantList ? product.variantList.totalItems : 0,
      variants: product.variantList.items.map((variant) => ({
        sku: variant.sku,
        stockLevel: variant.stockLevel,
        price: variant.prices.length > 0 ? variant.prices[0].price : null,
        currencyCode:
          variant.prices.length > 0 ? variant.prices[0].currencyCode : null,
        previewImage: variant.featuredAsset
          ? variant.featuredAsset.preview
          : null,
      })),
      options: product.variants.map((variant) => ({
        optionId: variant.options[0].id,
        optionName: variant.options[0].name,
      })),
    };

    console.log("Fetched product from API:", standardizedProduct);
    return standardizedProduct;
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw new Error("Failed to fetch product by ID");
  }
}

getProducts(2);

module.exports = {
  getProducts,
  getProductById,
};
