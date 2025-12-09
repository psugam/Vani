const express = require("express");
const router = express.Router();
const MacdonnellChapter = require("../../../database/macdonnellChapter.model");

const dotenv = require("dotenv");
dotenv.config();

router.put(
  "/chapters/macdonnell/editonechapter/:chapterId",
  async (req, res) => {
    try {
      const { macdonnellChapterId } = req.params;
      const { adminName } = req.body;
      if (adminName !== process.env.ADMIN_NAME) {
        return res.status(403).json({ message: "Unauthorized!!" });
      }
      const updatedMacdonnellChapter =
        await MacdonnellChapter.findByIdAndUpdate(
          macdonnellChapterId,
          {
            $set: req.body,
          },
          {
            new: true,
            runValidators: true,
          }
        );
      if (!updatedMacdonnellChapter) {
        return res.status(404).json({ message: "Chapter not found." });
      }
      return res.status(200).json({
        message: "Chapter updated successfully.",
        updatedMacdonnellChapter,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error editing chapter.", error: error.message });
    }
  }
);

module.exports = router;
