const express = require("express");
const router = express.Router();

const {
  iniciarCheckoutAssinatura,
  webhookStripe,
  cancelarAssinatura,
} = require("../controllers/pagamentoStripeController");

const { protect } = require("../middleware/authMiddleware");

router.post("/checkout", protect, iniciarCheckoutAssinatura);

router.post("/webhook", webhookStripe);

// 🚀 Cancelar assinatura
router.delete("/assinaturas/:assinaturaId/cancelar", protect, cancelarAssinatura);

module.exports = router;
