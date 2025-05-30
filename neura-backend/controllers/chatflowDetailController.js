const ChatflowDetail = require("../models/ChatflowDetail");
const updateAliasMapping = require("../utils/updateAliasMapping"); // 🔄 Import helper

// ✅ Simpan atau update blok detail dari flow tertentu
exports.saveFlowDetail = async (req, res) => {
  const { flowId } = req.params;
  const userId = req.user.id;
  const { blocks } = req.body;

  console.log("📦 Data blok yang diterima:", JSON.stringify(blocks, null, 2));

  try {
    // Cek apakah sudah ada detail sebelumnya
    let detail = await ChatflowDetail.findOne({ userId, flowId });
    if (!detail) {
      detail = new ChatflowDetail({ userId, flowId, blocks });
    } else {
      detail.blocks = blocks;
    }

    await detail.save();

    // 🔄 Auto-sinkron aliasMapping untuk blok FAQ
    const newAliases = {};

    blocks
      .filter((block) => block.type?.toLowerCase() === "faq") // Normalisasi type
      .forEach((faq) => {
        const mainQ = faq.question?.trim().toLowerCase();
        const aliases = faq.aliases || [];

        if (mainQ) {
          newAliases[mainQ] = mainQ; // Tambahkan pertanyaan utama
          aliases.forEach((alias) => {
            const cleanAlias = alias.trim().toLowerCase();
            if (cleanAlias) {
              newAliases[cleanAlias] = mainQ; // Alias diarahkan ke mainQ
            }
          });
        }
      });

    console.log("🔁 Alias yang akan ditambahkan:", newAliases); // Untuk debugging

    if (Object.keys(newAliases).length > 0) {
      updateAliasMapping(newAliases);
    }

    res.status(200).json({ success: true, detail });
  } catch (err) {
    console.error("❌ Error saveFlowDetail:", err.message);
    res.status(500).json({ success: false, message: "Gagal menyimpan detail flow" });
  }
};

// ✅ Ambil detail blok berdasarkan flowId milik user
exports.getFlowDetail = async (req, res) => {
  const { flowId } = req.params;
  const userId = req.user.id;

  try {
    const detail = await ChatflowDetail.findOne({ userId, flowId });

    if (!detail) {
      return res.status(404).json({ success: false, message: "Detail tidak ditemukan" });
    }

    res.status(200).json({ success: true, detail });
  } catch (err) {
    console.error("❌ Error getFlowDetail:", err.message);
    res.status(500).json({ success: false, message: "Gagal mengambil detail flow" });
  }
};
