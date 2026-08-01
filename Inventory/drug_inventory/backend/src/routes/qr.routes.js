const express = require("express");
const router = express.Router();

const { generateQR, scanQR } = require("../controllers/qr.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/generate", protect, generateQR);
router.post("/scan", protect, scanQR);

module.exports = router;
