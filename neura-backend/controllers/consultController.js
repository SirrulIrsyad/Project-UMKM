const OpenAI = require("openai");

// Gunakan OpenRouter sebagai endpoint OpenAI alternatif
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // WAJIB jika pakai OpenRouter
});

exports.consultWithAI = async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Pesan tidak boleh kosong" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // ✅ Bisa diganti dengan model lain jika ingin
      messages: [
        {
          role: "system",
          content: "Kamu adalah asisten bisnis UMKM yang ramah dan aplikatif.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content || "(Tidak ada balasan)";
    res.json({ reply });
  } catch (err) {
    console.error("❌ Error dari OpenRouter:", err.response?.data || err.message);
    res.status(500).json({ error: "Gagal mendapatkan respon dari AI" });
  }
};
