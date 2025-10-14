const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/pagamentos/criar-assinatura
// @desc    Criar uma assinatura recorrente
// @access  Privado (precisa de login)
router.post('/criar-assinatura', protect, pagamentoController.criarAssinaturaRecorrente);

// @route   POST /api/pagamentos/webhook
// @desc    Receber notificações do Mercado Pago
// @access  Público (o Mercado Pago não vai fazer login para nos notificar)
router.post('/webhook', pagamentoController.receberWebhook);

module.exports = router;
