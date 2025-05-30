// src/pages/FlowPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FlowPage() {
  const [flows, setFlows] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchFlows = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/chatflow", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFlows(data);
  };

  const addFlow = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/chatflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setFlows([...flows, data]);
    setName("");
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Daftar Chat Flow</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Flow"
        className="border p-2 mr-2"
      />
      <button onClick={addFlow} className="btn-primary text-white">
        Tambah Flow Baru
      </button>

      <ul className="mt-4 space-y-2">
        {flows.map((flow) => (
          <li key={flow._id} className="border p-3 rounded flex justify-between items-center">
            <span>{flow.name}</span>
            <button
              onClick={() => navigate(`/builder/${flow._id}`)}
              className="btn-primary text-white text-sm px-3 py-1 rounded"
            >
              Builder
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
