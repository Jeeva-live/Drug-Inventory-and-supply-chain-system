const express = require("express");
const router = express.Router();

const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor
} = require("../controllers/vendors.controller");

const { protect, allowRoles } = require("../middlewares/auth.middleware");

router.post("/", protect, allowRoles("admin"), createVendor);
router.get("/", protect, getVendors);
router.get("/:id", protect, getVendorById);
router.put("/:id", protect, allowRoles("admin"), updateVendor);
router.delete("/:id", protect, allowRoles("admin"), deleteVendor);

module.exports = router;
