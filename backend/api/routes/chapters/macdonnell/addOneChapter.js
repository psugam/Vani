const express = require("express");
const router = express.Router();
const MacdonnellChapter = require("../../../database/macdonnellChapter.model");
const User = require("../../../database/user.model");

router.post("/chapters/macdonnell/addonechapter", async (req, res, next) => {
  try {
    const { title, serialNumber, mainText, footnotes, userId } = req.body;
    const alreadyExists = await MacdonnellChapter.findOne({
      serialNumber: serialNumber,
    });
    const userExists = await User.findById({ _id: userId });
    if (!userExists) {
      return res
        .status(400)
        .json({ message: "Unauthorized user. Permission denied." });
    }
    if (userExists.role !== "admin") {
      return res
        .status(400)
        .json({ message: "Not an admin. Permission denied." });
    }

    if (alreadyExists) {
      return res.status(400).json({
        message: "Chapter with this serial number already exists",
      });
    }
    const newMacdonnellChapter = new MacdonnellChapter({
      userId: userId,
      title,
      serialNumber,
      mainText,
      footnotes,
    });
    await newMacdonnellChapter.save();
    res.status(201).json(newMacdonnellChapter);
  } catch (error) {
    res.status(500).json({
      message: "Error adding the chapter",
      error: error.message,
    });
  }
});

module.exports = router;
