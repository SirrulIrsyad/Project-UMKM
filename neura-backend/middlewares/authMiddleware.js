const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak tersedia." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "RAHASIA_TOKEN_KAMU");

    if (!decoded._id && !decoded.id) {
      console.error("❌ Token tidak memiliki ID:", decoded);
      return res.status(401).json({ message: "Token tidak valid (missing id)" });
    }

    req.user = {
      id: decoded._id || decoded.id, // ✅ Perbaikan penting
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return res.status(401).json({ message: "Token tidak valid." });
  }
}

module.exports = authMiddleware;
