const express = require("express");
const router = express.Router();
const Text = require("../../database/texts.model.js");

router.delete("/texts/deleteonetext/:textId", async (req, res) => {
  try {
    const { textId } = req.params;
    const { adminName } = req.body;
    if (adminName !== process.env.ADMIN_NAME) {
      return res.status(403).json({ message: "Unauthorized!!" });
    }
    const deletedText = await Text.findByIdAndDelete(textId);
    if (!deletedText) {
      return res.status(404).json({ message: "Text not found." });
    }
    res
      .status(200)
      .json({ message: "Text deleted successfully. ", deletedText });
  } catch (error) {
    console.error("Error deleting text:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
