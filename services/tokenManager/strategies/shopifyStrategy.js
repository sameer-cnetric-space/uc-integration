module.exports = {
  async getToken(credentials) {
    const { apiKey } = credentials;
    return {
      token: apiKey,
      expiresIn: null, // Shopify API keys typically don’t expire
    };
  },
};
