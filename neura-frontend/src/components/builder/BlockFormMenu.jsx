import React from "react";

export default function BlockFormMenu({ block, onChange }) {
  const updateItem = (index, value) => {
    const items = [...block.items];
    items[index] = value;
    onChange({ ...block, items });
  };

  const addItem = () => {
    onChange({ ...block, items: [...block.items, ""] });
  };

  return (
    <div className="space-y-2">
      <label>Menu / Produk</label>
      {block.items.map((item, idx) => (
        <input
          key={idx}
          type="text"
          className="w-full border p-2 rounded"
          value={item}
          onChange={(e) => updateItem(idx, e.target.value)}
        />
      ))}
      <button
        className="text-blue-600 underline"
        onClick={addItem}
        type="button"
      >
        + Tambah Item
      </button>
    </div>
  );
}
