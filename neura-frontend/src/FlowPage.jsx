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
    setName("");

    if (res.ok && data._id) {
      // ✅ Redirect langsung ke halaman builder
      navigate(`/builder/${data._id}`);
    } else {
      alert("Gagal membuat flow.");
    }
  };

  const activateFlow = async (flowId) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/chatflow/${flowId}/activate`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchFlows();
  };

  const deleteFlow = async (flowId) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/chatflow/${flowId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setFlows(flows.filter((f) => f._id !== flowId));
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center py-12 px-2">
      <div className="w-full max-w-4xl mx-auto relative">
        {/* Tombol kembali */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-6 left-6 bg-gray-200 hover:bg-gray-300 text-blue-700 px-4 py-2 rounded-lg font-medium transition z-50"
        >
          ← Kembali
        </button>

        <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-10">
          Manajemen Chat Flow
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addFlow();
          }}
          className="flex flex-col md:flex-row gap-4 items-center justify-center mb-10"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Flow Baru"
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
          >
            Tambah Flow Baru
          </button>
        </form>

        <div className="grid grid-cols-1 gap-6">
          {flows.map((flow) => (
            <div
              key={flow._id}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex-1 text-left">
                <h2 className="text-lg font-semibold text-gray-800">{flow.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Status:{" "}
                  {flow.isActive ? (
                    <span className="text-green-600 font-medium">Aktif</span>
                  ) : (
                    <span className="text-gray-400 italic">Nonaktif</span>
                  )}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap justify-end">
                <button
                  onClick={() => navigate(`/builder/${flow._id}`)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition text-sm"
                >
                  Builder
                </button>
                {!flow.isActive && (
                  <button
                    onClick={() => activateFlow(flow._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                  >
                    Aktifkan
                  </button>
                )}
                <button
                  onClick={() => deleteFlow(flow._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
