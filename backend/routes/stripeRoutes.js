const express = require('express');
const router = express.Router();

const {
  iniciarCheckoutAssinatura,
  webhookStripe,
  cancelarAssinatura,
} = require('./controllers/pagamentoStripeController');

// 🚀 Criar sessão de checkout (assinatura)
router.post('/checkout', iniciarCheckoutAssinatura);

// 🚀 Webhook do Stripe
// ⚠️ Importante: no index.js você já configurou o express.raw() para /stripe/webhook
// então aqui podemos usar direto o controller
router.post('/webhook', webhookStripe);

// 🚀 Cancelar assinatura
router.delete('/assinaturas/:assinaturaId/cancelar', cancelarAssinatura);

module.exports = router;
