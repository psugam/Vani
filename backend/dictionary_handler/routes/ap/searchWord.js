const express = require("express");
const router = express.Router();
const handleSearch = require("../handleSearch");

router.get("/search/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const results = await handleSearch("ap90", searchTerm);

    if (results.length === 0)
      return res.status(404).json({ message: "Word not found in AP90 dictionary" });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error searching AP90 dictionary", error: err.message });
  }
});

module.exports = router;
