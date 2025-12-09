const express = require("express");
const router = express.Router();
const MacdonnellChapter = require("../../../database/macdonnellChapter.model");

router.get("/chapters/macdonnell/getallchapters", async (req, res, next) => {
  try {
    const MacdonnellChapters = await MacdonnellChapter.find().sort({
      serialNumber: 1,
    });
    res.status(200).json(MacdonnellChapters);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching chapters",
      error: error.message,
    });
  }
});

module.exports = router;
