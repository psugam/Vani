const express = require("express");
const router = express.Router();
const MacdonnellChapter = require("../../../database/macdonnellChapter.model");

router.delete(
  "/chapters/macdonnell/deleteonechapter/:chapterId",
  async (req, res) => {
    try {
      const { macdonnellChapterId } = req.params;
      const { adminName } = req.body;
      if (adminName !== process.env.ADMIN_NAME) {
        return res.status(403).json({ message: "Unauthorized!!" });
      }
      const deletedMacdonnellChapter =
        await MacdonnellChapter.findByIdAndDelete(macdonnellChapterId);
      if (!deletedMacdonnellChapter) {
        return res.status(404).json({ message: "Chapter not found." });
      }
      res.status(200).json({
        message: "Chapter deleted successfully. ",
        deletedMacdonnellChapter,
      });
    } catch (error) {
      console.error("Error deleting chapter:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
