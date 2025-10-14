const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { protect } = require('../middleware/authMiddleware');

// ====================== PRIMEIRA COMPRA ======================
router.post('/criar-preferencia', protect, pagamentoController.criarPreferencia);

// ====================== WEBHOOK ======================
router.post('/webhook', pagamentoController.receberWebhook);

module.exports = router;
