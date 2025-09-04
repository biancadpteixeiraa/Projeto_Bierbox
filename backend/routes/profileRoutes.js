const express = require("express");
const { getProfile, updateProfile, deleteAccount, uploadProfilePhoto } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configuração do Multer para armazenamento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // A pasta 'uploads' deve existir na raiz do seu backend
  },
  filename: (req, file, cb) => {
    cb(null, `${req.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filtro de arquivos para permitir apenas JPEG e PNG e limitar o tamanho
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Apenas imagens JPEG e PNG são permitidas e o tamanho máximo é 1MB!"));
  },
});

// Rotas de perfil existentes
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.delete("/", protect, deleteAccount);

// Nova rota para upload de foto de perfil
// POST /meu-perfil/upload-foto
router.post("/upload-foto", protect, upload.single("profilePhoto"), uploadProfilePhoto);

module.exports = router;
