// backend/routes/chatflowDetailRoutes.js
const express = require("express");
const router = express.Router();
const {
  saveFlowDetail,
  getFlowDetail,
} = require("../controllers/chatflowDetailController");
const verifyToken = require("../middlewares/authMiddleware");

// 🔐 Semua route diamankan dengan token
router.post("/:flowId/detail", verifyToken, saveFlowDetail);
router.get("/:flowId/detail", verifyToken, getFlowDetail);

module.exports = router;
