const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 📌 Register
exports.register = async (req, res) => {
  const { email, password, businessName, whatsapp } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const user = await User.create({
      email,
      password: hashedPassword,
      businessName,
      whatsapp,
    });

    res.json({ message: "Registrasi berhasil", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan saat registrasi" });
  }
};

// 📌 Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Login failed: Email tidak ditemukan:", email);
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    // Cek kecocokan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Login failed: Password salah untuk user:", email);
      return res.status(401).json({ message: "Password salah" });
    }

    // Log user object untuk debugging
    console.log("🔍 User object before token creation:", {
      _id: user._id,
      id: user.id,
      email: user.email,
      businessName: user.businessName,
      whatsapp: user.whatsapp
    });

    // Validasi user data
    if (!user._id) {
      console.error("❌ User tidak memiliki _id:", user);
      return res.status(500).json({ message: "Data user tidak valid" });
    }

    // Log user data sebelum membuat token
    console.log("🔑 Creating token for user:", {
      userId: user._id,
      email: user.email,
      businessName: user.businessName
    });

    // Buat token dengan memastikan _id digunakan
    const tokenPayload = {
      _id: user._id.toString(), // Pastikan _id adalah string
      email: user.email,
      businessName: user.businessName,
      whatsapp: user.whatsapp,
    };

    // Log payload untuk debugging
    console.log("📝 Token payload:", tokenPayload);

    const secret = process.env.JWT_SECRET || "RAHASIA_TOKEN_KAMU";
    console.log("🔐 Using secret for token:", secret === process.env.JWT_SECRET ? "from env" : "fallback");

    // Buat token dengan payload yang benar
    const token = jwt.sign(
      tokenPayload,
      secret,
      { expiresIn: "1d" }
    );

    // Verifikasi token yang baru dibuat
    try {
      const decoded = jwt.verify(token, secret);
      console.log("✅ Token created and verified:", {
        userId: decoded._id,
        email: decoded.email,
        exp: new Date(decoded.exp * 1000).toLocaleString(),
        has_id: !!decoded.id,
        has__id: !!decoded._id,
        payload: decoded // Log seluruh payload untuk verifikasi
      });
    } catch (err) {
      console.error("❌ Token verification failed after creation:", err);
      return res.status(500).json({ message: "Gagal membuat token" });
    }

    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
};

// 📌 Ambil data user dari token
exports.getCurrentUser = (req, res) => {
  if (!req.user || !req.user._id) {
    console.error("❌ Invalid user data in request:", req.user);
    return res.status(401).json({ error: "Data user tidak valid" });
  }
  res.json(req.user);
};
