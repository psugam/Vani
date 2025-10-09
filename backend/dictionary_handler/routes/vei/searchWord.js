const express = require("express");
const router = express.Router();
const handleSearch = require("../handleSearch");

router.get("/search/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const results = await handleSearch("vei", searchTerm);

    if (results.length === 0)
      return res.status(404).json({ message: "Word not found in vei dictionary" });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error searching vei dictionary", error: err.message });
  }
});

module.exports = router;
