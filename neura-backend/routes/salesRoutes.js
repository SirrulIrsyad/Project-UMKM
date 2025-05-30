const express = require("express");
const router = express.Router();

// Import controller
const {
  getSalesSummary,
  getSalesChart,
} = require("../controllers/salesController");

// Import middleware autentikasi
const verifyToken = require("../middlewares/verifyToken");

// ✅ GET: Ringkasan penjualan
router.get("/summary", verifyToken, getSalesSummary);

// ✅ GET: Grafik penjualan harian (support query start & end)
router.get("/chart", verifyToken, getSalesChart);

// ✅ POST: Tambah transaksi dummy manual (untuk testing)
router.post("/add-dummy", verifyToken, async (req, res) => {
  try {
    const Transaction = require("../models/Transaction");
    const { product, quantity, total, date } = req.body;

    // Validasi sederhana (opsional)
    if (!product || !quantity || !total || !date) {
      return res.status(400).json({ error: "Data tidak lengkap." });
    }

    const dummy = new Transaction({
      userId: req.user.id,
      product,
      quantity,
      total,
      date: new Date(date), // pastikan formatnya ISO atau yyyy-mm-dd
    });

    await dummy.save();
    res.json({ message: "Transaksi berhasil ditambahkan!" });
  } catch (error) {
    console.error("Gagal tambah dummy transaksi:", error);
    res.status(500).json({ error: "Gagal menyimpan transaksi." });
  }
});

module.exports = router;
