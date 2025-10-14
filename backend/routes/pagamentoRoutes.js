const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const { protect } = require('../middleware/authMiddleware');

// ===================== CRIAR PREFERÊNCIA =====================
// Cria uma preferência de pagamento para o usuário
// 🔹 Mantido protegido com login (Bearer Token)
router.post('/criar-preferencia', protect, pagamentoController.criarPreferencia);

// ===================== WEBHOOK =====================
// Recebe notificações do Mercado Pago sobre pagamentos
// 🔹 Público, não precisa de autenticação
router.post('/webhook', pagamentoController.receberWebhook);

module.exports = router;
