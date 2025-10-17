const express = require("express");
const router = express.Router();

const {
  iniciarCheckoutAssinatura,
  cancelarAssinatura,
} = require("../controllers/pagamentoStripeController");

const { protect } = require("../middleware/authMiddleware");

// Rota para iniciar o checkout da assinatura (protegida)
router.post("/checkout", protect, iniciarCheckoutAssinatura);

// Rota para cancelar uma assinatura (protegida)
router.delete("/assinaturas/:assinaturaId/cancelar", protect, cancelarAssinatura);

// A rota do webhook foi removida daqui e está a ser gerida diretamente no index.js
// para garantir que o middleware express.raw() seja aplicado corretamente.

module.exports = router;
