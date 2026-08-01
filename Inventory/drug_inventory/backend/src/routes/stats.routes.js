const express = require("express");
const router = express.Router();
const controller = require("../controllers/stats.controller");
const { protect, allowRoles } = require("../middlewares/auth.middleware");

router.get("/admin", protect, allowRoles("admin"), controller.getAdminStats);

module.exports = router;
