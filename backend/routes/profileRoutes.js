const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Rota para obter os dados do perfil do usuário logado
// GET /meu-perfil
router.get("/", protect, getProfile);

// Rota para atualizar os dados do perfil do usuário logado
// PUT /meu-perfil
router.put("/", protect, updateProfile);

module.exports = router;
