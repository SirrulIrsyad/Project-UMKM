import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ChatBubble from "./components/ChatBubble";
import { FaPaperclip, FaSmile, FaPaperPlane, FaSignOutAlt, FaTrash } from "react-icons/fa";

// Helper untuk debug token
const debugToken = (token) => {
  // ... existing code ...
};

// Helper untuk format waktu
const formatTime = (timestamp) => {
  try {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    // Cek apakah date valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', timestamp);
      return '';
    }

    // Format waktu sesuai zona waktu user
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

const ChatRoom = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const bottomRef = useRef(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      const lastReset = localStorage.getItem("lastChatReset");
      
      if (!token) return;

      // Jika ada reset timestamp, cek apakah lebih baru dari 5 menit yang lalu
      if (lastReset) {
        const resetTime = parseInt(lastReset);
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        
        if (resetTime > fiveMinutesAgo) {
          setMessages([]);
          return;
        } else {
          // Hapus timestamp reset jika sudah lebih dari 5 menit
          localStorage.removeItem("lastChatReset");
        }
      }

      try {
        const res = await fetch("http://localhost:5000/api/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Gagal mengambil pesan:", err);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    const userMessage = { 
      sender: "user", 
      text: input,
      createdAt: new Date().toISOString() // Tambahkan timestamp saat pesan dibuat
    };

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      
      // Tambahkan pesan user dengan ID dari response
      const userMessageWithId = { ...userMessage, _id: data._id };
      setMessages((prev) => [...prev, userMessageWithId]);
      setInput("");
      setIsBotTyping(true);

      // Simulasi delay untuk animasi mengetik
      setTimeout(() => {
        const botReply = { 
          sender: "bot", 
          text: data.reply,
          createdAt: new Date().toISOString() // Tambahkan timestamp saat pesan dibuat
        };
        setMessages((prev) => [...prev, botReply]);
        setIsBotTyping(false);
      }, 1500);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorReply = { 
        sender: "bot", 
        text: "Gagal mengirim pesan ke server.",
        createdAt: new Date().toISOString() // Tambahkan timestamp saat pesan dibuat
      };
      setMessages((prev) => [...prev, errorReply]);
      setIsBotTyping(false);
    }
  };

  const handleDelete = async (messageId) => {
    console.log("Attempting to delete message with ID:", messageId);

    if (!messageId) {
      console.error("Message ID tidak valid:", messageId);
      return;
    }

    const confirmDelete = window.confirm("Yakin ingin menghapus pesan ini?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/chat/message/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        // Tampilkan notifikasi sukses
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        successMessage.textContent = 'Pesan berhasil dihapus';
        document.body.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 3000);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menghapus pesan');
      }
    } catch (err) {
      console.error("Gagal menghapus pesan:", err);
      // Tampilkan notifikasi error
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
      errorMessage.textContent = err.message || 'Gagal menghapus pesan';
      document.body.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    }
  };

  const handleReset = async () => {
    const confirmDelete = window.confirm("Yakin ingin menghapus semua pesan?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Clear messages immediately
        setMessages([]);
        // Store reset timestamp in localStorage
        localStorage.setItem('lastChatReset', Date.now().toString());
        // Tampilkan notifikasi sukses
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        successMessage.textContent = 'Percakapan berhasil direset';
        document.body.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 3000);
        
        // Navigate back to chat page
        navigate('/chat');
      } else {
        throw new Error('Failed to reset chat');
      }
    } catch (err) {
      console.error("Gagal reset chat:", err);
      // Tampilkan notifikasi error
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
      errorMessage.textContent = 'Gagal mereset percakapan. Silakan coba lagi.';
      document.body.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    }
  };

    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4">
        <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[90vh]">
          
          {/* Header */}
          <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center text-lg font-semibold shadow-sm">
            <span className="flex items-center gap-2">🤖 Chatbot NeuraGo</span>
            <button
              onClick={handleReset}
              className="text-sm bg-white text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition"
            >
              Reset Chat
            </button>
          </header>

          {/* Chat Area */}
          <main className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-white">
            {messages.length === 0 && !isBotTyping && (
              <div className="text-center text-gray-400 italic mt-10 animate-fade-in">
                💬 Mulai percakapan dengan chatbot NeuraGo...
              </div>
            )}

            {messages.map((msg, idx) => (
              <ChatBubble
                key={msg._id || idx}
                sender={msg.sender}
                text={msg.text}
                onDelete={() => handleDelete(msg._id)}
              />
            ))}

            {isBotTyping && (
              <div className="text-sm text-gray-500 italic animate-pulse px-2">
                🤖 NeuraGo sedang mengetik...
              </div>
            )}

            <div ref={bottomRef} />
          </main>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="px-4 py-4 bg-white border-t border-gray-200 flex items-center gap-3"
          >
            <input
              type="text"
              className="flex-1 px-4 py-3 border rounded-full shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Ketik pesan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>
    );
  };

export default ChatRoom;
