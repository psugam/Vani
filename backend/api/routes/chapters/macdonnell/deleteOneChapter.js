const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const MacdonnellChapter = require("../../../database/macdonnellChapter.model");

// Initialize dotenv to ensure process.env.ADMIN_NAME is accessible
dotenv.config();

router.delete(
  "/chapters/macdonnell/deleteonechapter/:chapterId",
  async (req, res) => {
    try {
      // FIX: Changed macdonnellChapterId to chapterId to match the route parameter
      const { chapterId } = req.params;
      const { adminName } = req.body;

      // 1. Authorization Check
      if (adminName !== process.env.ADMIN_NAME) {
        return res.status(403).json({ message: "Unauthorized!!" });
      }

      // 2. Database Operation
      // We use the variable 'chapterId' extracted above
      const deletedMacdonnellChapter =
        await MacdonnellChapter.findByIdAndDelete(chapterId);

      // 3. Handle non-existent ID
      if (!deletedMacdonnellChapter) {
        return res.status(404).json({ message: "Chapter not found." });
      }

      res.status(200).json({
        message: "Chapter deleted successfully.",
        deletedMacdonnellChapter,
      });
    } catch (error) {
      // This will now catch genuine database issues rather than undefined parameter errors
      console.error("Error deleting chapter:", error);
      res.status(500).json({ message: "Server error", details: error.message });
    }
  }
);

module.exports = router;
