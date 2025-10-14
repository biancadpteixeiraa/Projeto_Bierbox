pagamentoRoutes

const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/pagamentos/criar-preferencia
// @desc    Criar uma preferência de pagamento
// @access  Privado (precisa de login)
router.post('/criar-preferencia', protect, pagamentoController.criarPreferencia);

// @route   POST /api/pagamentos/webhook
// @desc    Receber notificações do Mercado Pago
// @access  Público (o Mercado Pago não vai fazer login para nos notificar)
router.post('/webhook', pagamentoController.receberWebhook);

module.exports = router;
