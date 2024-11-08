const axios = require("axios");

// Create a base Axios instance
const axiosInstance = axios.create({
  timeout: 10000, // Set a default timeout of 10 seconds
});

// Centralized error handling function
function handleError(error) {
  console.error("API Error:", error);

  if (error.response) {
    // The request was made, and the server responded with a status code that is out of the 2xx range
    throw new Error(
      `Server error ${error.response.status}: ${
        error.response.data.message || error.message
      }`
    );
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error("No response received from the server");
  } else {
    // Something happened in setting up the request
    throw new Error(`Request setup failed: ${error.message}`);
  }
}

// Main function to make REST API requests
async function requestREST({
  method = "GET",
  url,
  data = {},
  params = {},
  baseURL = process.env.API_BASE_URL, // Default base URL from environment
  headers = {},
}) {
  try {
    const response = await axiosInstance.request({
      method,
      url,
      data,
      params,
      baseURL,
      headers,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

module.exports = requestREST;
