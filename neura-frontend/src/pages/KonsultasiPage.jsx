import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareText } from "lucide-react";

export default function KonsultasiPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const aiReply = { sender: "ai", text: data.reply || data.error };
      setChatHistory((prev) => [...prev, aiReply]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Error: tidak dapat menghubungi server." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Header */}
      <div className="flex justify-between items-center py-4 px-6 border-b bg-white shadow-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-700 flex items-center gap-2">
          <MessageSquareText className="w-6 h-6" />
          Konsultasi dengan AI
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ← Kembali
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {chatHistory.length === 0 && !loading && (
          <div className="text-center text-gray-500 italic mt-10">
            💬 Yuk mulai konsultasi, ketik pertanyaanmu di bawah.
          </div>
        )}

        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] whitespace-pre-line break-words shadow-md transition-all duration-300 ${
              chat.sender === "user"
                ? "ml-auto bg-blue-500 text-white rounded-br-none"
                : "mr-auto bg-gray-100 text-gray-800 rounded-bl-none"
            }`}
          >
            {chat.text}
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-gray-100 px-4 py-3 rounded-xl w-fit text-sm text-gray-600 animate-pulse shadow">
            AI sedang mengetik...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-4 border-t bg-white shadow-inner"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="flex-1 border border-blue-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 resize-none shadow-sm"
          placeholder="Tulis pertanyaanmu..."
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
        >
          🚀
        </button>
      </form>
    </div>
  );
}
