const express = require('express');
const router = express.Router();
const {
  iniciarCheckoutAssinatura,
  webhookStripe,
  cancelarAssinatura,
} = require('./pagamentoStripeController');

// Iniciar checkout (POST)
router.post('/checkout', iniciarCheckoutAssinatura);

// Webhook Stripe (POST)
// IMPORTANTE: para validar a assinatura do webhook corretamente,
// você precisa acessar o raw body. Configure seu app para isso.
// Durante testes simples, podemos aceitar JSON normal.
router.post('/webhook', express.json({ type: '*/*' }), webhookStripe);

// Cancelar assinatura (DELETE)
router.delete('/assinaturas/:assinaturaId/cancelar', cancelarAssinatura);

module.exports = router;
