const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, resetMessages } = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");
const Message = require("../models/Message");

router.post("/", authMiddleware, sendMessage);
router.get("/", authMiddleware, getMessages); 
router.delete("/", authMiddleware, resetMessages);

// Route untuk menghapus satu pesan
router.delete("/message/:messageId", authMiddleware, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    console.log("Attempting to delete message:", { messageId, userId });

    // Pastikan pesan milik user yang sedang login
    const message = await Message.findOne({ _id: messageId, userId });
    
    if (!message) {
      console.log("Message not found or not owned by user");
      return res.status(404).json({ error: "Pesan tidak ditemukan" });
    }

    const result = await Message.deleteOne({ _id: messageId });
    console.log("Delete result:", result);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Pesan tidak ditemukan" });
    }

    res.status(200).json({ message: "Pesan berhasil dihapus" });
  } catch (err) {
    console.error("Gagal menghapus pesan:", err);
    res.status(500).json({ error: "Gagal menghapus pesan" });
  }
});

module.exports = router;
