const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { protect } = require('../middleware/authMiddleware');

// Criar preferência (primeira compra)
router.post('/criar-preferencia', protect, pagamentoController.criarPreferencia);

// Webhook Mercado Pago
router.post('/webhook', pagamentoController.receberWebhook);

module.exports = router;
