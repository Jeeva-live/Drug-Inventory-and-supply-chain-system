const express = require("express");
const router = express.Router();

const controller = require("../controllers/users.controller");
const { protect, allowRoles } = require("../middlewares/auth.middleware");

// Create user (admin only)
router.post("/", protect, allowRoles("admin"), controller.createUser);

// Get all users (admin only)
router.get("/", protect, allowRoles("admin"), controller.getUsers);

// Update user
router.put("/:id", protect, allowRoles("admin"), controller.updateUser);

// Delete user
router.delete("/:id", protect, allowRoles("admin"), controller.deleteUser);

module.exports = router;
