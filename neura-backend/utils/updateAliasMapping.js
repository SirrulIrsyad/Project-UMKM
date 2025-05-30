const fs = require("fs");
const path = require("path");
const aliasFilePath = path.join(__dirname, "aliasMapping.js");

function updateAliasMapping(newMappings) {
  // ❗ Hapus cache agar selalu baca file terbaru
  delete require.cache[require.resolve("./aliasMapping")];
  const existing = require("./aliasMapping");

  let updated = { ...existing };
  let changed = false;

  for (const [alias, intent] of Object.entries(newMappings)) {
    if (!updated[alias]) {
      updated[alias] = intent;
      changed = true;
    }
  }

  if (!changed) {
    console.log("✅ Tidak ada alias baru, tidak menulis ulang file.");
    return;
  }

  const content =
    "// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.\n\nmodule.exports = " +
    JSON.stringify(updated, null, 2) +
    ";\n";

  try {
    fs.writeFileSync(aliasFilePath, content, "utf-8");
    console.log("✅ aliasMapping.js berhasil diperbarui!");
  } catch (err) {
    console.error("❌ Gagal menulis aliasMapping.js:", err.message);
  }
}

module.exports = updateAliasMapping;
