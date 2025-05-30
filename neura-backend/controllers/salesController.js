const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// 📊 Ringkasan total: hari ini, bulan ini, transaksi, produk terlaris
exports.getSalesSummary = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todaySales, monthSales, transactions, bestProductAgg] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: userObjectId, date: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Transaction.aggregate([
        { $match: { userId: userObjectId, date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Transaction.countDocuments({ userId: userObjectId }),
      Transaction.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: "$product", totalSold: { $sum: "$quantity" } } },
        { $sort: { totalSold: -1 } },
        { $limit: 1 },
      ]),
    ]);

    res.json({
      today: todaySales[0]?.total || 0,
      month: monthSales[0]?.total || 0,
      transactions,
      bestProduct: bestProductAgg[0]?._id || "-",
    });
  } catch (err) {
    console.error("Error summary:", err);
    res.status(500).json({ error: "Gagal ambil ringkasan" });
  }
};

// 📈 Grafik penjualan (support filter tanggal start & end)
exports.getSalesChart = async (req, res) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);

    const { start, end } = req.query;
    const match = { userId: userObjectId };

    // Tambahkan filter tanggal jika tersedia
    if (start && end) {
      match.date = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const salesPerDay = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: "%d %b", date: "$date" },
          },
          total: { $sum: "$total" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const result = salesPerDay.map((item) => ({
      tanggal: item._id,
      total: item.total,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error chart:", err);
    res.status(500).json({ error: "Gagal ambil grafik" });
  }
};
