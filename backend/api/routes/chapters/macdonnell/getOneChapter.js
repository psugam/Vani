const express = require("express");
const router = express.Router();

const MacdonnellChapter = require("../../../database/macdonnellChapter.model");

router.get("/chapters/macdonnell/:chapterNo", async (req, res, next) => {
  const { macdonnellChapterNo } = req.params;
  if (!macdonnellChapterNo) {
    return res.status(400).json({
      message: "Chapter number is required.",
    });
  }
  try {
    const MacdonnellChapters = await MacdonnellChapter.find({
      serialNumber: macdonnellChapterNo,
    }).sort({
      serialNumber: 1,
    });
    res.status(200).json(MacdonnellChapters);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching chapters.",
      error: error.message,
    });
  }
});

module.exports = router;
