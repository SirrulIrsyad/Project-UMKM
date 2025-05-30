exports.suggestAlias = async (req, res) => {
  const { question } = req.body;

  // Simulasi hasil AI (dummy)
  const suggestions = generateAliasMock(question);

  res.json({ suggestions });
};

// Helper mock sederhana (bisa diganti OpenAI nanti)
function generateAliasMock(input) {
  const q = input.toLowerCase();

  if (q.includes("jam buka")) {
    return ["jam operasional", "kapan buka", "buka toko jam berapa"];
  }

  if (q.includes("lokasi")) {
    return ["alamat", "di mana toko", "letak toko"];
  }

  return [`${input}?`, `info tentang ${input}`, `penjelasan ${input}`];
}
