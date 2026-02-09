const express = require("express");
const router = express.Router();
const Text = require("../../database/texts.model.js");
const User = require("../../database/user.model");

router.post("/texts/addonetext", async (req, res, next) => {
  try {
    const { title, serialNumber, mainText, footnotes, userId } = req.body;
    const alreadyExists = await Text.findOne({ serialNumber: serialNumber });
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
    const newText = new Text({
      userId: userId,
      title,
      serialNumber,
      mainText,
      footnotes,
    });
    await newText.save();
    res.status(201).json(newText);
  } catch (error) {
    res.status(500).json({
      message: "Error adding the text",
      error: error.message,
    });
  }
});

module.exports = router;
