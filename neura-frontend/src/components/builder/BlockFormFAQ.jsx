import React, { useEffect, useState } from "react";

export default function BlockFormFAQ({ block, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [aliases, setAliases] = useState([]);

  // ✅ Sinkronisasi ulang saat block.aliases dari parent berubah
  useEffect(() => {
    setAliases(block.aliases || []);
  }, [block.aliases]);

  // ✅ Debounced AI Suggestion saat mengetik pertanyaan
  useEffect(() => {
    const delay = setTimeout(() => {
      if (block.question?.trim().length > 3) {
        fetch("http://localhost:5000/api/faq/suggest-alias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: block.question }),
        })
          .then((res) => res.json())
          .then((data) => setSuggestions(data.suggestions || []))
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [block.question]);

  // ✅ Tambahkan alias dari hasil suggestion
  const handleAddAlias = (alias) => {
    if (!aliases.includes(alias)) {
      const updated = [...aliases, alias];
      setAliases(updated);
      onChange({ ...block, aliases: updated });
    }
  };

  return (
    <div className="space-y-2">
      <label>Pertanyaan</label>
      <input
        type="text"
        className="w-full border p-2 rounded"
        value={block.question}
        onChange={(e) => onChange({ ...block, question: e.target.value })}
      />

      {/* ✅ Saran alias dari AI */}
      {suggestions.length > 0 && (
        <div className="text-sm text-gray-600 mt-1">
          <p className="font-medium text-gray-500">Saran Alias:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleAddAlias(s)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded text-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <label>Jawaban</label>
      <textarea
        className="w-full border p-2 rounded"
        value={block.answer}
        onChange={(e) => onChange({ ...block, answer: e.target.value })}
      />

      {/* ✅ Alias yang sudah dipilih */}
      {aliases.length > 0 && (
        <div className="text-sm text-gray-600">
          <p className="font-medium mt-2">Alias Terpilih:</p>
          <ul className="flex flex-wrap gap-2 mt-1">
            {aliases.map((a, i) => (
              <li
                key={i}
                className="bg-green-100 text-green-800 px-2 py-1 rounded"
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
