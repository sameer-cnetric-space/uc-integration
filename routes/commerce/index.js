// routes/commerce/index.js
const express = require("express");
const adminRoutes = require("./admin");

const router = express.Router();

// Use admin routes under /admin path
router.use("/admin", adminRoutes);

module.exports = router;
