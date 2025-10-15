const express = require("express");
const router = express.Router();

const {
  iniciarCheckoutAssinatura,
  webhookStripe,
  cancelarAssinatura,
} = require("../controllers/pagamentoStripeController");

const { protect } = require("../middleware/authMiddleware");

// 🚀 Criar sessão de checkout (assinatura)
router.post("/checkout", protect, iniciarCheckoutAssinatura);

// 🚀 Webhook do Stripe
// ⚠️ Importante: no index.js você já configurou express.raw() para /stripe/webhook
router.post("/webhook", webhookStripe);

// 🚀 Cancelar assinatura
router.delete("/assinaturas/:assinaturaId/cancelar", protect, cancelarAssinatura);

module.exports = router;
