const express = require("express");
const router = express.Router();
const controller = require("../controllers/settings.controller");

router.get("/", controller.getSettings);
router.put("/", controller.updateSettings);

module.exports = router;
