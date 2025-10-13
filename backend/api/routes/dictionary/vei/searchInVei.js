// server.js
const express = require('express');
// const mongoose = require('mongoose'); // not used here
// const cors = require('cors'); // cors handled at deployment level or in app if needed

const router = express.Router();
const Vei = require("../../../database/vei.model");



// --- Search Route ---
router.get("/search/:searchWord", async (req, res) => {
    const {searchWord}=req.params;
  const query = (searchWord || "").trim().toLowerCase();

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter ?q=" });
  }

  try {
    // 1️⃣ Try to find exact match in main entries
    const entry = await Vei.findOne({ word_iast: query }).lean();
    if (entry) {
      return res.json({ found_in: "main", result: entry });
    }

    // 2️⃣ If not found, search in related entries
    const parentEntry = await Vei.findOne({
      "related.word_iast": query,
    }).lean();

    if (parentEntry) {
      // extract only the matching related item(s)
      const relatedMatch = parentEntry.related.filter(
        (r) => r.word_iast === query
      );
      return res.json({ found_in: "related", result: relatedMatch });
    }

    // 3️⃣ Not found anywhere
    return res.status(404).json({ message: "Word not found" });
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports=router
