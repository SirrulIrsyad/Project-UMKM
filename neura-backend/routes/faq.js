const express = require("express");
const router = express.Router();
const { suggestAlias } = require("../controllers/faqController");

router.post("/suggest-alias", suggestAlias);

module.exports = router; // ✅ WAJIB ADA
