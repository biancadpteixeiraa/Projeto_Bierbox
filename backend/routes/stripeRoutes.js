const express = require("express");
const router = express.Router();

const {
  iniciarCheckoutAssinatura,
  webhookStripe,
  cancelarAssinatura,
} = require("../controllers/pagamentoStripeController");

// 🚀 Criar sessão de checkout (assinatura)
router.post("/checkout", iniciarCheckoutAssinatura);

// 🚀 Webhook do Stripe
// ⚠️ Importante: no index.js você já configurou express.raw() para /stripe/webhook
router.post("/webhook", webhookStripe);

// 🚀 Cancelar assinatura
router.delete("/assinaturas/:assinaturaId/cancelar", cancelarAssinatura);

module.exports = router;
