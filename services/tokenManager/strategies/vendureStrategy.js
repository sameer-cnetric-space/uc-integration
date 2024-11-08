const axios = require("axios");

module.exports = {
  async getToken(credentials) {
    const { username, password } = credentials;

    const query = `
      mutation {
        login(username: "${username}", password: "${password}", rememberMe: true) {
          __typename
          ... on NativeAuthenticationResult {
            token
          }
          ... on InvalidCredentialsError {
            message
          }
        }
      }
    `;

    const response = await axios.post(
      process.env.VENDURE_API_URL,
      { query },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data.data;
    if (data.login.__typename === "InvalidCredentialsError") {
      throw new Error(`Vendure authentication failed: ${data.login.message}`);
    }

    return {
      token: data.login.token,
      expiresIn: 365 * 24 * 60 * 60, // Expiry time (1 year in seconds)
    };
  },
};
