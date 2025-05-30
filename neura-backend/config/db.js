const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB terkoneksi!");
  } catch (err) {
    console.error("❌ Gagal koneksi ke MongoDB:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
