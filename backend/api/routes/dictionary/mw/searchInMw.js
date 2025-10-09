const express = require("express");
const router = express.Router();
const MW = require("../../../../database/mw.model");

// GET /api/mw/search/:searchWord
router.get("/search/:searchWord", async (req, res) => {
  const { searchWord } = req.params;
  if (!searchWord) {
    return res.status(400).json({ message: "Search word is required" });
  }

  try {
    // 1️⃣ Try finding a direct match in headword or headword_slp1
    const meaning = await MW.find({
      $or: [
        { headword: searchWord },
        { headword_slp1: searchWord },
      ],
    });

    // 2️⃣ If found, return it immediately
    if (meaning.length > 0) {
      return res.status(200).json(meaning);
    }

    // 3️⃣ Otherwise, search inside related_entries
    const relatedResults = await MW.aggregate([
      {
        $project: {
          headword: 1,
          headword_slp1: 1,
          related_entries: {
            $filter: {
              input: "$related_entries",
              as: "entry",
              cond: {
                $or: [
                  // Match by headword or headword_slp1
                  { $regexMatch: { input: "$$entry.headword", regex: searchWord, options: "i" } },
                  { $regexMatch: { input: "$$entry.headword_slp1", regex: searchWord, options: "i" } },
                  // Match inside senses.meaning
                  {
                    $regexMatch: {
                      input: {
                        $reduce: {
                          input: "$$entry.senses",
                          initialValue: "",
                          in: { $concat: ["$$value", " ", { $ifNull: ["$$this.meaning", ""] }] },
                        },
                      },
                      regex: searchWord,
                      options: "i",
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $match: { "related_entries.0": { $exists: true } } },
    ]);

    // 4️⃣ Flatten results into one array
    const flattened = relatedResults.flatMap(doc =>
      doc.related_entries.map(entry => ({
        parent_headword: doc.headword,
        parent_headword_slp1: doc.headword_slp1,
        ...entry,
      }))
    );

    if (flattened.length === 0) {
      return res.status(404).json({ message: "No results found" });
    }

    res.status(200).json(flattened);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "Error searching word",
      error: error.message,
    });
  }
});

module.exports = router;
