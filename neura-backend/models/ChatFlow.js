// models/ChatFlow.js
const mongoose = require("mongoose");

const chatFlowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    nodes: {
      type: Array,
      default: [],
    },
    isActive: {
      type: Boolean,
      default: false, // ✅ flow akan non-aktif secara default
    },
  },
  {
    timestamps: true, // ✅ agar ada createdAt & updatedAt otomatis
  }
);

module.exports = mongoose.model("Chatflow", chatFlowSchema);
