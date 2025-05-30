import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Dashboard from "./Dashboard.jsx";
import ChatRoom from "./ChatRoom.jsx";
import FlowPage from "./FlowPage.jsx";
import BuilderPage from "./pages/BuilderPage.jsx";
import StatistikPage from "./pages/StatistikPage.jsx";
import KonsultasiPage from "./pages/KonsultasiPage.jsx"; // ✅ Tambahkan ini

import ProtectedRoute from "./ProtectedRoute.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Halaman landing/login */}
        <Route path="/" element={<App />} />

        {/* Dashboard utama */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Simulasi chatbot */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          }
        />

        {/* Kelola daftar ChatFlow */}
        <Route
          path="/flow"
          element={
            <ProtectedRoute>
              <FlowPage />
            </ProtectedRoute>
          }
        />

        {/* Builder per flow */}
        <Route
          path="/builder/:flowId"
          element={
            <ProtectedRoute>
              <BuilderPage />
            </ProtectedRoute>
          }
        />

        {/* Statistik penjualan */}
        <Route
          path="/statistik"
          element={
            <ProtectedRoute>
              <StatistikPage />
            </ProtectedRoute>
          }
        />

        {/* Konsultasi AI */}
        <Route
          path="/konsultasi"
          element={
            <ProtectedRoute>
              <KonsultasiPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
