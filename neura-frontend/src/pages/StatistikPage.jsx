import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function StatistikPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [summary, setSummary] = useState(null);
  const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);

  const [rangeA, setRangeA] = useState({ start: "", end: "" });
  const [rangeB, setRangeB] = useState({ start: "", end: "" });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/sales/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Gagal ambil summary:", err);
      }
    };
    fetchSummary();
  }, [token]);

  useEffect(() => {
    if (!rangeA.start || !rangeA.end) return;
    const fetchA = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/sales/chart?start=${rangeA.start}&end=${rangeA.end}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setDataA(data.map((item) => ({ tanggal: item.tanggal, rentangA: item.total })));
      } catch (err) {
        console.error("Gagal ambil data A:", err);
      }
    };
    fetchA();
  }, [rangeA, token]);

  useEffect(() => {
    if (!rangeB.start || !rangeB.end) return;
    const fetchB = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/sales/chart?start=${rangeB.start}&end=${rangeB.end}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setDataB(data.map((item) => ({ tanggal: item.tanggal, rentangB: item.total })));
      } catch (err) {
        console.error("Gagal ambil data B:", err);
      }
    };
    fetchB();
  }, [rangeB, token]);

  const mergedData = [...dataA];
  dataB.forEach((item, idx) => {
    if (mergedData[idx]) mergedData[idx].rentangB = item.rentangB;
    else mergedData[idx] = item;
  });

  const totalA = dataA.reduce((sum, item) => sum + (item.rentangA || 0), 0);
  const totalB = dataB.reduce((sum, item) => sum + (item.rentangB || 0), 0);
  const growth = totalB === 0 ? 0 : (((totalA - totalB) / totalB) * 100).toFixed(1);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📊 Statistik Penjualan</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          ← Kembali ke Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Penjualan Hari Ini" value={`Rp ${summary?.today?.toLocaleString() || 0}`} />
        <StatCard label="Penjualan Bulan Ini" value={`Rp ${summary?.month?.toLocaleString() || 0}`} />
        <StatCard label="Jumlah Transaksi" value={summary?.transactions || 0} />
        <StatCard label="Produk Terlaris" value={summary?.bestProduct || "-"} />
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">📅 Bandingkan Dua Rentang Waktu</h2>

        <DateRangeFilter range={rangeA} setRange={setRangeA} label="Rentang A" />
        <DateRangeFilter range={rangeB} setRange={setRangeB} label="Rentang B" />

        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tanggal" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rentangA" name="Rentang A" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="rentangB" name="Rentang B" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-center text-sm">
          <p className="font-medium text-gray-700">
            Pertumbuhan:{" "}
            <span className={growth >= 0 ? "text-green-600" : "text-red-600"}>
              {growth >= 0 ? "+" : ""}
              {growth}%
            </span>{" "}
            dibanding Rentang B
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total A: Rp {totalA.toLocaleString()} — Total B: Rp {totalB.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Form Tambah Dummy */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">📝 Tambah Transaksi Manual</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const body = {
              product: e.target.product.value,
              quantity: parseInt(e.target.quantity.value),
              total: parseInt(e.target.total.value),
              date: e.target.date.value,
            };
            try {
              const res = await fetch("http://localhost:5000/api/sales/add-dummy", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
              });
              const data = await res.json();
              alert(data.message);
              e.target.reset();
            } catch (err) {
              alert("Gagal menambahkan transaksi.");
              console.error(err);
            }
          }}
          className="grid sm:grid-cols-2 gap-4"
        >
          <input name="product" type="text" placeholder="Nama Produk" className="border p-2 rounded-lg" required />
          <input name="quantity" type="number" placeholder="Jumlah" className="border p-2 rounded-lg" required />
          <input name="total" type="number" placeholder="Total Penjualan (Rp)" className="border p-2 rounded-lg" required />
          <input name="date" type="date" className="border p-2 rounded-lg" required />
          <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Tambah Transaksi
          </button>
        </form>
      </div>
    </div>
  );
}

// Komponen kecil untuk statistik card
function StatCard({ label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

// Komponen kecil untuk filter tanggal
function DateRangeFilter({ range, setRange, label }) {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1 font-medium text-gray-600">{label}</label>
      <div className="flex gap-2">
        <input
          type="date"
          value={range.start}
          onChange={(e) => setRange({ ...range, start: e.target.value })}
          className="border px-3 py-1 rounded-lg w-full"
        />
        <input
          type="date"
          value={range.end}
          onChange={(e) => setRange({ ...range, end: e.target.value })}
          className="border px-3 py-1 rounded-lg w-full"
        />
      </div>
    </div>
  );
}
