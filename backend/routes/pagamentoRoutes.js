const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { protect } = require('../middleware/authMiddleware');

// Criar assinatura (requer login)
router.post('/criar-assinatura', protect, pagamentoController.criarAssinatura);

// Webhook (público)
router.post('/webhook', pagamentoController.receberWebhook);

module.exports = router;
