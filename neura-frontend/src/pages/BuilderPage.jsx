import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlockFormFAQ from "../components/builder/BlockFormFAQ";
import BlockFormMenu from "../components/builder/BlockFormMenu";
import BlockFormForm from "../components/builder/BlockFormForm";
import BlockFormNotif from "../components/builder/BlockFormNotif";

export default function BuilderPage() {
  const { flowId } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://localhost:5000/api/chatflow/${flowId}/detail`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.detail && data.detail.blocks) {
            const normalizedBlocks = data.detail.blocks.map((block) => {
              if (block.type === "FAQ") {
                return { ...block, aliases: block.aliases || [] };
              }
              return block;
            });
            setBlocks(normalizedBlocks);
          }
        }
      } catch (err) {
        console.error("❌ Gagal mengambil data blok:", err.message);
      }
    };
    fetchBlocks();
  }, [flowId]);

  const addBlock = (newBlock) => {
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index, updatedBlock) => {
    const updated = [...blocks];
    updated[index] = updatedBlock;
    setBlocks(updated);
  };

  const submitFlow = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Token tidak ditemukan. Silakan login ulang.");

    try {
      const res = await fetch(`http://localhost:5000/api/chatflow/${flowId}/detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blocks }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan flow.");
      const data = await res.json();
      console.log("✅ Flow disimpan:", data);
      alert("Flow berhasil disimpan!");
    } catch (err) {
      console.error("❌ Error submit flow:", err.message);
      alert("Gagal menyimpan flow. Cek koneksi atau token.");
    }
  };

  const renderForm = (block, index) => {
    const sharedProps = {
      block,
      onChange: (updated) => updateBlock(index, updated),
    };

    switch (block.type) {
      case "FAQ":
        return <BlockFormFAQ key={index} {...sharedProps} />;
      case "MENU":
        return <BlockFormMenu key={index} {...sharedProps} />;
      case "FORM":
        return <BlockFormForm key={index} {...sharedProps} />;
      case "NOTIF":
        return <BlockFormNotif key={index} {...sharedProps} />;
      default:
        return <p key={index}>Blok tidak dikenali</p>;
    }
  };

  // ...existing code...
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-3xl mx-auto relative">
        {/* Tombol kembali ke halaman sebelumnya di pojok kiri paling atas */}
        <button
          onClick={() => navigate(-1)}
          className="fixed top-6 left-6 bg-gray-200 hover:bg-gray-300 text-blue-700 px-4 py-2 rounded-lg font-medium transition z-50"
        >
          ← Kembali
        </button>

        <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-4 mt-6">Buat Alur Chatbot</h1>
        <p className="text-center text-gray-600 mb-8">Tambah blok percakapan sesuai kebutuhan bisnismu.</p>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button onClick={() => addBlock({ type: "FAQ", question: "", answer: "", aliases: [] })} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded shadow">
            + Tambah FAQ
          </button>
          <button onClick={() => addBlock({ type: "MENU", items: [] })} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded shadow">
            + Tambah Menu
          </button>
          <button onClick={() => addBlock({ type: "FORM", fields: [] })} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded shadow">
            + Tambah Formulir
          </button>
          <button onClick={() => addBlock({ type: "NOTIF", answer: "" })} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded shadow">
            + Tambah Notifikasi
          </button>
        </div>

        {blocks.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-800">Isi Blok:</h2>
            {blocks.map((block, index) => (
              <div key={index} className="p-6 border rounded-xl bg-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Nama blok di kiri */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-blue-600 mb-4">
                    Blok {index + 1}: {block.type}
                  </h3>
                  {renderForm(block, index)}
                </div>
              </div>
            ))}

            <div className="text-center">
              <button
                onClick={submitFlow}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition"
              >
                💾 Simpan & Aktifkan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}