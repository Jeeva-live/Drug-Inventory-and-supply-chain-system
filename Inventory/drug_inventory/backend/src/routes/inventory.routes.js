const express = require("express");
const router = express.Router();

const {
  createInventory,
  getInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  createBatch,
  getBatches,
  updateBatchStatus
} = require("../controllers/inventory.controller");

const { protect, allowRoles } = require("../middlewares/auth.middleware");

// Batch Management (Manufacturer)
router.post("/batch", protect, allowRoles("admin", "manufacturer"), createBatch);
router.get("/batch", protect, allowRoles("admin", "manufacturer"), getBatches);
router.put("/batch/:id", protect, allowRoles("admin", "manufacturer"), updateBatchStatus);

// General Inventory
router.post("/", protect, allowRoles("admin", "warehouse_manager"), createInventory);
router.get("/", protect, getInventory);
router.get("/:id", protect, getInventoryById);
router.put("/:id", protect, allowRoles("admin", "warehouse_manager", "pharmacist"), updateInventory);
router.delete("/:id", protect, allowRoles("admin"), deleteInventory);

module.exports = router;
