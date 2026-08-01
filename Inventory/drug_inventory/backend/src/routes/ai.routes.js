const express = require("express");
const router = express.Router();

const {
  predictDemand,
  getForecastData
} = require("../controllers/ai.controller");

const { protect, allowRoles } = require("../middlewares/auth.middleware");

// AI prediction endpoint
router.post("/predict", protect, allowRoles("admin", "warehouse_manager"), predictDemand);
router.get("/forecast", protect, allowRoles("admin", "manufacturer"), getForecastData);

module.exports = router;
