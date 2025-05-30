const mongoose = require("mongoose");

const botRoleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // contoh: "Toko Baju", "Warung Kopi"
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("BotRole", botRoleSchema);
