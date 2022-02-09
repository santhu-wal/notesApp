const multer = require("multer");
const path = require("path");
const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "uploads",
  filename: (req, file, cb) => {
    const { originalname } = file;

    cb(null, originalname);
  },
});

const imageUpload = multer({ storage: imageStorage });
module.exports = imageUpload;
