// routes/pagamentoRoutes.js
const express = require("express");
const router = express.Router();
const pagamentoController = require("../controllers/pagamentoController");
const { protect } = require("../middlewares/authMiddleware"); // ajuste se o protect estiver em outro lugar

router.post("/criar-assinatura", protect, pagamentoController.criarAssinatura);
router.post("/webhook", express.json({ type: "*/*" }), pagamentoController.receberWebhook);
// OBS: usamos express.json({ type: "*/*" }) para aceitar webhooks que não venham como application/json

module.exports = router;
