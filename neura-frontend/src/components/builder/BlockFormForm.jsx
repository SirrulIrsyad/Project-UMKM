import React from "react";

export default function BlockFormForm({ block, onChange }) {
  const updateField = (index, value) => {
    const fields = [...block.fields];
    fields[index] = value;
    onChange({ ...block, fields });
  };

  const addField = () => {
    onChange({ ...block, fields: [...block.fields, ""] });
  };

  return (
    <div className="space-y-2">
      <label>Field Formulir</label>
      {block.fields.map((field, idx) => (
        <input
          key={idx}
          type="text"
          className="w-full border p-2 rounded"
          value={field}
          onChange={(e) => updateField(idx, e.target.value)}
        />
      ))}
      <button
        className="text-blue-600 underline"
        onClick={addField}
        type="button"
      >
        + Tambah Field
      </button>
    </div>
  );
}
