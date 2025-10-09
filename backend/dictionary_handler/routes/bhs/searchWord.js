const express = require("express");
const router = express.Router();
const handleSearch = require("../handleSearch");

router.get("/search/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const results = await handleSearch("bhs", searchTerm);

    if (results.length === 0)
      return res.status(404).json({ message: "Word not found in bhs dictionary" });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error searching bhs dictionary", error: err.message });
  }
});

module.exports = router;
