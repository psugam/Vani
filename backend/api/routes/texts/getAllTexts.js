const express = require("express");
const router = express.Router();
const Text = require("../../database/texts.model.js");

router.get("/texts/getalltexts", async (req, res, next) => {
  try {
    const Texts = await Text.find().sort({ serialNumber: 1 });
    res.status(200).json(Texts, { message: "Texts fetched successfully" });
    //   somehow not working but gives 200 with blank but works when message is added but the message itself doesnt show.
  } catch (error) {
    res.status(500).json({
      message: "Error fetching texts",
      error: error.message,
    });
  }
});

module.exports = router;
