const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { consultWithAI } = require("../controllers/consultController");

router.post("/", verifyToken, consultWithAI);

module.exports = router;
