const express = require("express");
const { getProfile, updateProfile, deleteAccount } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Rota para obter os dados do perfil do usuário logado
// GET /meu-perfil
router.get("/", protect, getProfile);

// Rota para atualizar os dados do perfil do usuário logado
// PUT /meu-perfil
router.put("/", protect, updateProfile);

// Rota para excluir a conta do usuário logado
// DELETE /meu-perfil
router.delete("/", protect, deleteAccount);

module.exports = router;
