// backend/models/ChatflowDetail.js
const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "FAQ", "MENU", etc
  question: String,      // hanya untuk FAQ
  answer: String,        // hanya untuk FAQ & Notifikasi
  items: [String],       // untuk MENU
  fields: [String],      // untuk FORM
});

const chatflowDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  flowId: { type: mongoose.Schema.Types.ObjectId, ref: "Chatflow" },
  blocks: [blockSchema],
});

module.exports = mongoose.model("ChatflowDetail", chatflowDetailSchema);
