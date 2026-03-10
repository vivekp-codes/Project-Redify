const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../Config/Cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/image-upload", upload.single("image"), async (req, res) => {
  try {

    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "Redify" },
      (error, result) => {

        if (error) {
          console.log("CLOUDINARY ERROR:", error);
          return res.status(500).json({ message: "Upload Failed" });
        }

        console.log("UPLOAD SUCCESS:", result);

        res.status(200).json({
          message: "Image Uploaded",
          url: result.secure_url,
        });

      }
    );

    stream.end(req.file.buffer);

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;