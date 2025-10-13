const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const {
  loginAdmin,
  getDashboardStats,
  adminGetAllBoxes,
  adminCreateBox,
  adminUpdateBox,
  adminDeleteBox,
  adminGetAllUsers,
  adminGetUserById,
  adminGetAllPedidos,
  adminGetPedidoById,
  adminUpdatePedido,
  adminGetAllAssinaturas,
  adminGetAssinaturaById,
  adminCancelAssinatura,
  adminPauseAssinatura,
  adminReactivateAssinatura,
  adminUploadBoxImage, // função nova do controller
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bierbox_boxes",
    allowed_formats: ["jpeg", "jpg", "png"],
    transformation: [{ width: 800, height: 800, crop: "fill" }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, 
});

router.post("/login", loginAdmin);
router.get("/stats", protect, adminProtect, getDashboardStats);
router.get("/boxes", protect, adminProtect, adminGetAllBoxes);
router.post("/boxes", protect, adminProtect, adminCreateBox);
router.put("/boxes/:id", protect, adminProtect, adminUpdateBox);
router.delete("/boxes/:id", protect, adminProtect, adminDeleteBox);

router.post(
  "/boxes/:id/upload",
  protect,
  adminProtect,
  upload.single("imagem"), 
  adminUploadBoxImage
);

router.get("/users", protect, adminProtect, adminGetAllUsers);
router.get("/users/:id", protect, adminProtect, adminGetUserById);
router.get("/pedidos", protect, adminProtect, adminGetAllPedidos);
router.get("/pedidos/:id", protect, adminProtect, adminGetPedidoById);
router.put("/pedidos/:id", protect, adminProtect, adminUpdatePedido);
router.get("/assinaturas", protect, adminProtect, adminGetAllAssinaturas);
router.get("/assinaturas/:id", protect, adminProtect, adminGetAssinaturaById);
router.put("/assinaturas/:id/cancelar", protect, adminProtect, adminCancelAssinatura);
router.put("/assinaturas/:id/pausar", protect, adminProtect, adminPauseAssinatura);
router.put("/assinaturas/:id/reativar", protect, adminProtect, adminReactivateAssinatura);
router.get("/test-auth", protect, adminProtect, (req, res) => {
  res.status(200).json({ success: true, message: "Acesso de administrador concedido!" });
});

module.exports = router;
