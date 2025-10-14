const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/pagamentos/primeira-compra
router.post('/primeira-compra', protect, pagamentoController.criarPagamentoPrimeiraCompra);

// POST /api/pagamentos/webhook
router.post('/webhook', pagamentoController.receberWebhook);

module.exports = router;
