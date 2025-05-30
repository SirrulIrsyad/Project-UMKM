import React from "react";

export default function BlockFormNotif({ block, onChange }) {
  return (
    <div className="space-y-2">
      <label>Pesan Notifikasi</label>
      <textarea
        className="w-full border p-2 rounded"
        value={block.answer}
        onChange={(e) => onChange({ ...block, answer: e.target.value })}
      />
    </div>
  );
}
