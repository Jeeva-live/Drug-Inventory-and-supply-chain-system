const express = require("express");
const router = express.Router();

const {
  getAlerts,
  createAlert,
  markAlertRead
} = require("../controllers/alerts.controller");

const { protect, allowRoles } = require("../middlewares/auth.middleware");

// Get all alerts
router.get("/", protect, getAlerts);

// Create new alert
router.post("/", protect, allowRoles("admin", "warehouse_manager"), createAlert);

// Mark alert as read
router.put("/:id/read", protect, markAlertRead);

module.exports = router;
