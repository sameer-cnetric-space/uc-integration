const express = require("express");
const commerceRoutes = require("./routes/commerce");

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware for parsing URL-encoded and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Register commerce routes with /api/commerce base route
app.use("/api/commerce", commerceRoutes);

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware for server errors
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
