const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("🔐 Verifying token:", {
    hasAuthHeader: !!authHeader,
    headerFormat: authHeader ? authHeader.substring(0, 20) + "..." : "none",
    path: req.path,
    method: req.method
  });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided or invalid format");
    return res.status(401).json({ error: "Token tidak valid (missing)" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const secret = process.env.JWT_SECRET || "RAHASIA_TOKEN_KAMU";
    console.log("🔑 Using secret:", secret === process.env.JWT_SECRET ? "from env" : "fallback");
    
    const decoded = jwt.verify(token, secret);
    
    // Log decoded token untuk debugging
    console.log("📝 Decoded token:", {
      ...decoded,
      exp: new Date(decoded.exp * 1000).toLocaleString(),
      iat: new Date(decoded.iat * 1000).toLocaleString(),
      has_id: !!decoded.id,
      has__id: !!decoded._id
    });
    
    // Validasi decoded token
    if (!decoded) {
      console.error("❌ Invalid token payload:", decoded);
      return res.status(401).json({ error: "Token tidak valid (invalid payload)" });
    }

    // Pastikan menggunakan _id
    const userId = decoded._id || decoded.id;
    if (!userId) {
      console.error("❌ Token tidak memiliki userId:", decoded);
      return res.status(401).json({ error: "Token tidak valid (no user id)" });
    }

    // Log token verification details
    console.log("🔍 Token verification details:", {
      has_id: !!decoded.id,
      has__id: !!decoded._id,
      userId: userId,
      original_id: decoded.id,
      original__id: decoded._id
    });

    // Normalisasi user object dengan _id
    req.user = {
      ...decoded,
      _id: userId // Pastikan selalu menggunakan _id
    };

    console.log("✅ Token verification successful:", {
      userId: req.user._id,
      email: req.user.email,
      exp: new Date(decoded.exp * 1000).toLocaleString(),
      path: req.path,
      normalized_id: req.user._id
    });

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", {
      name: err.name,
      message: err.message,
      token: token.substring(0, 10) + "...",
      path: req.path
    });

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }

    return res.status(401).json({ error: "Token tidak valid" });
  }
};

module.exports = verifyToken;
