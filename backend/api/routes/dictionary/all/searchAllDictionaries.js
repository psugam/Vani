// server.js
const express = require('express');
// const mongoose = require('mongoose'); // not used here
// const cors = require('cors'); // cors handled at deployment level or in app if needed

const router = express.Router();
const Bhs = require('../../../database/bhs.model')
const Vei=require('../../../database/vei.model')
const Mw=require('../../../database/new_mw.model')
const Ap=require('../../../database/ap90.model')

router.get("/search/:searchWord", async (req, res) => {
  const { searchWord } = req.params;
  const query = (searchWord || "").trim().toLowerCase();

  if (!query) {
    return res.status(400).json({ error: "Missing search word" });
  }

  const dictionaries = [
    { name: "Bhs", model: Bhs },
    { name: "Vei", model: Vei },
    { name: "Mw", model: Mw },
    { name: "Ap", model: Ap },
  ];

  try {
    const results = [];

    for (let dict of dictionaries) {
      // 1️⃣ Search in main entries
      const entry = await dict.model.findOne({ word_iast: query }).lean();
      if (entry) {
        results.push({
          dictionary: dict.name,
          found_in: "main",
          result: entry,
        });
      }

      // 2️⃣ Search in related entries
      const parentEntries = await dict.model.find({ "related.word_iast": query }).lean();
      for (let parentEntry of parentEntries) {
        const relatedMatch = parentEntry.related.filter(r => r.word_iast === query);
        if (relatedMatch.length > 0) {
          results.push({
            dictionary: dict.name,
            found_in: "related",
            result: relatedMatch,
          });
        }
      }
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Word not found in any dictionary" });
    }

    return res.json(results);

  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports=router