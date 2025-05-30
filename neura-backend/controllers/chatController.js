const Message = require("../models/Message");
const Chatflow = require("../models/ChatFlow");
const ChatflowDetail = require("../models/ChatflowDetail");
const aliasMap = require("../utils/aliasMapping");

// Fungsi normalisasi teks (tanpa tanda baca, trim, lowercase)
const normalizeText = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // hapus tanda baca
    .replace(/\s+/g, " ");   // hilangkan spasi berlebihan

exports.sendMessage = async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;
  const normalized = normalizeText(message);

  try {
    // Simpan pesan user
    const userMessage = await Message.create({ userId, sender: "user", text: message });
    console.log("Created user message with ID:", userMessage._id);

    // Ambil flow TERBARU milik user
    const flow = await Chatflow.findOne({ userId }).sort({ createdAt: -1 });
    if (!flow) return res.json({ reply: "Flow belum dibuat." });

    const flowDetail = await ChatflowDetail.findOne({
      userId,
      flowId: flow._id.toString(),
    });

    if (!flowDetail || !flowDetail.blocks || flowDetail.blocks.length === 0) {
      return res.json({ reply: "Isi chatbot belum tersedia." });
    }

    // 🔎 Coba cari alias dari pertanyaan
    const keyword = aliasMap[normalized] || normalized;

    // Debug log untuk bantu lacak
    console.log("🔎 Pesan user:", message);
    console.log("🔎 Normalized:", normalized);
    console.log("🔎 Keyword hasil aliasMapping:", keyword);
    console.log("📦 Pertanyaan FAQ:", flowDetail.blocks.map(b => b.question));

    // 🔍 Cari blok FAQ berdasarkan keyword hasil alias
    const matchedFAQ = flowDetail.blocks.find(
      (b) =>
        b.type?.toLowerCase() === "faq" &&
        normalizeText(b.question) === keyword
    );

    const replyText = matchedFAQ
      ? matchedFAQ.answer
      : "Maaf, saya belum mengerti. Coba ulangi pertanyaannya.";

    // Simpan balasan bot
    const botMessage = await Message.create({ userId, sender: "bot", text: replyText });
    console.log("Created bot message with ID:", botMessage._id);

    res.json({ 
      reply: replyText,
      _id: userMessage._id.toString() // Pastikan ID dikirim sebagai string
    });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ reply: "Terjadi kesalahan di sisi server." });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil pesan" });
  }
};

exports.resetMessages = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User tidak terautentikasi" });
    }

    console.log("Reset messages request received for user:", req.user.id);
    const result = await Message.deleteMany({ userId: req.user.id });
    console.log(`Deleted ${result.deletedCount} messages for user ${req.user.id}`);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Tidak ada pesan yang ditemukan untuk dihapus" });
    }

    res.status(200).json({ 
      message: "Semua pesan telah dihapus.",
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error("Gagal reset pesan:", err);
    res.status(500).json({ 
      error: "Gagal menghapus semua pesan.",
      details: err.message 
    });
  }
};
