const express = require("express");
const { getProfile, updateProfile, deleteAccount, uploadProfilePhoto } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bierbox_profiles",
    allowed_formats: ["jpeg", "jpg", "png"],
    transformation: [{ width: 200, height: 200, crop: "fill" }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2 }, 
});

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.delete("/", protect, deleteAccount);

router.post("/upload-foto", protect, upload.single("profilePhoto"), uploadProfilePhoto);

module.exports = router;
