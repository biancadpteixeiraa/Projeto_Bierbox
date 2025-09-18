const express = require("express");
const router = express.Router();
const assinaturaController = require("../controllers/assinaturaController");
const { protect } = require("../middleware/authMiddleware");

// Todas as rotas de assinatura exigem autenticação
router.use(protect);

/**
 * @route GET /api/assinaturas
 * @desc Listar todas as assinaturas do usuário autenticado
 * @access Private
 * @returns {Array} Lista de assinaturas
 */
router.get("/", assinaturaController.listarAssinaturas);

/**
 * @route GET /api/assinaturas/:id
 * @desc Obter detalhes de uma assinatura específica do usuário autenticado
 * @access Private
 * @param {string} id - ID da assinatura
 * @returns {Object} Detalhes da assinatura
 */
router.get("/:id", assinaturaController.obterDetalhesAssinatura);

/**
 * @route POST /api/assinaturas/:id/cancelar
 * @desc Cancelar uma assinatura do usuário autenticado
 * @access Private
 * @param {string} id - ID da assinatura a ser cancelada
 * @body {string} [motivo_cancelamento] - Motivo opcional para o cancelamento
 * @returns {Object} Mensagem de sucesso
 */
router.post("/:id/cancelar", assinaturaController.cancelarAssinatura);

module.exports = router;
