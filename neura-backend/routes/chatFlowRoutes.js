// routes/chatFlowRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const chatFlowController = require("../controllers/chatFlowController");

// 🔹 Ambil semua flow milik user
router.get("/", authMiddleware, chatFlowController.getUserChatFlows);

// 🔹 Buat flow baru
router.post("/", authMiddleware, chatFlowController.createChatFlow);

// 🔹 Aktifkan salah satu flow
router.patch("/:id/activate", authMiddleware, chatFlowController.activateChatFlow);

// 🔹 (Opsional) Hapus flow
router.delete("/:id", authMiddleware, chatFlowController.deleteChatFlow);

module.exports = router;
