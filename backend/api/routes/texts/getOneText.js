const express = require("express");
const router = express.Router();

const Text = require("../../database/texts.model.js");

router.get("/texts/:textNo", async (req, res, next) => {
  const { textNo } = req.params;
  if (!textNo) {
    return res.status(400).json({
      message: "Text number is required.",
    });
  }
  try {
    const Texts = await Text.find({ serialNumber: textNo }).sort({
      serialNumber: 1,
    });
    res.status(200).json(Texts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching texts.",
      error: error.message,
    });
  }
});

module.exports = router;
