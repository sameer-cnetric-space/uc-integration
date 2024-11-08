const {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} = require("@apollo/client/core");
const fetch = require("cross-fetch"); // Needed to make HTTP requests in Node.js

// Function to create an Apollo Client instance
function createApolloClient(baseURL, headers = {}) {
  return new ApolloClient({
    link: new HttpLink({
      uri: baseURL, // The GraphQL endpoint
      headers, // Headers for authorization, etc.
      fetch,
    }),
    cache: new InMemoryCache(), // Set up in-memory caching
  });
}

module.exports = createApolloClient;
