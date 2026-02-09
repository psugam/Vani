const express = require("express");
const router = express.Router();
const Text = require("../../database/texts.model.js");
const dotenv = require("dotenv");
dotenv.config();

router.put("/texts/editonetext/:textId", async (req, res) => {
  try {
    const { textId } = req.params;
    const { adminName } = req.body;
    if (adminName !== process.env.ADMIN_NAME) {
      return res.status(403).json({ message: "Unauthorized!!" });
    }
    const updatedText = await Text.findByIdAndUpdate(
      textId,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedText) {
      return res.status(404).json({ message: "Text not found." });
    }
    return res
      .status(200)
      .json({ message: "Text updated successfully.", updatedText });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error editing text.", error: error.message });
  }
});

module.exports = router;
