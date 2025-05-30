import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NeuraGoHome() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    businessName: "",
    whatsapp: ""
  });

  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registrasi berhasil! Silakan login.");
      } else {
        alert(data.message || "Registrasi gagal.");
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    }
  };

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login berhasil!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Login gagal.");
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    }
  };

  const handleMulaiClick = () => {
    setIsButtonPressed(true);
    const daftarSection = document.getElementById("register");
    if (daftarSection) {
      daftarSection.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      setIsButtonPressed(false);
    }, 200);
  };

  const handleSudahPunyaAkunClick = () => {
    const loginSection = document.getElementById("login");
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col font-sans overflow-x-hidden w-full">
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-200 shadow-sm w-full bg-white sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold text-blue-700 cursor-pointer select-none">NeuraGo</h1>
        <nav className="space-x-8 text-base font-medium text-gray-700">
          <a href="#features" className="hover:text-blue-700">Fitur</a>
          <a href="#solutions" className="hover:text-blue-700">Solusi</a>
          <a href="#about" className="hover:text-blue-700">Tentang</a>
          <a href="#login" className="hover:text-blue-700">Masuk</a>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-6 py-32 flex-1 w-full bg-gradient-to-b from-white to-blue-50">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight max-w-4xl text-blue-800">
          Mendorong UMKM dengan Kecerdasan Buatan
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
          NeuraGo membantu bisnis kecil terhubung dengan pelanggan melalui chatbot cerdas dan layanan otomatisasi modern.
        </p>
        <button
          onClick={handleMulaiClick}
          onMouseDown={() => setIsButtonPressed(true)}
          onMouseUp={() => setIsButtonPressed(false)}
          onMouseLeave={() => setIsButtonPressed(false)}
          className={`bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 ${
            isButtonPressed ? "scale-95" : ""
          }`}
        >
          Mulai Sekarang
        </button>
      </main>

      <section id="features" className="px-8 py-20 border-t border-gray-200 w-full bg-white">
        <h3 className="text-4xl font-extrabold mb-12 text-center text-blue-700">Fitur Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 text-5xl mb-4">🤖</div>
            <h4 className="text-xl font-bold mb-2">Chatbot Modular</h4>
            <p className="text-gray-600 text-sm">Sesuaikan alur percakapan sesuai kebutuhan UMKM-mu.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 text-5xl mb-4">💬</div>
            <h4 className="text-xl font-bold mb-2">Integrasi WhatsApp</h4>
            <p className="text-gray-600 text-sm">Terhubung langsung dengan pelanggan dari aplikasi favorit mereka.</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-blue-600 text-5xl mb-4">📊</div>
            <h4 className="text-xl font-bold mb-2">Analitik Pintar</h4>
            <p className="text-gray-600 text-sm">Lihat wawasan pengguna untuk membuat keputusan yang lebih baik.</p>
          </div>
        </div>
      </section>

      <section id="register" className="px-8 py-20 border-t border-gray-200 w-full bg-white">
        <h3 className="text-3xl font-bold mb-10 text-center text-blue-700">Daftar Akun UMKM</h3>
        <form onSubmit={handleRegister} className="max-w-md mx-auto bg-gray-50 p-8 rounded-xl shadow space-y-6">
          <input type="email" placeholder="Email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
          <input type="password" placeholder="Kata Sandi" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
          <input type="text" placeholder="Nama Bisnis" value={registerData.businessName} onChange={(e) => setRegisterData({ ...registerData, businessName: e.target.value })} className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
          <input type="tel" placeholder="Nomor WhatsApp" value={registerData.whatsapp} onChange={(e) => setRegisterData({ ...registerData, whatsapp: e.target.value })} className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition">Daftar</button>
          <button type="button" onClick={handleSudahPunyaAkunClick} className="w-full mt-2 text-sm text-blue-600 hover:underline">Sudah punya akun?</button>
        </form>
      </section>

      <section id="login" className="px-8 py-20 w-full bg-white">
        <h3 className="text-3xl font-bold mb-10 text-center text-blue-700">Masuk Akun</h3>
        <form onSubmit={handleLogin} className="max-w-md mx-auto bg-gray-50 p-8 rounded-xl shadow space-y-6">
          <input type="email" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
          <input type="password" placeholder="Kata Sandi" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition">Masuk</button>
        </form>
      </section>

      <footer className="border-t border-gray-200 text-center py-6 text-gray-500 text-sm">
        &copy; 2025 NeuraGo. Semua hak cipta dilindungi.
      </footer>
    </div>
  );
}
