const express = require("express");
const { calcularFrete } = require("../controllers/freteController");

const router = express.Router();

// Rota para calcular frete - POST /frete/calcular
router.post("/calcular", calcularFrete);

module.exports = router;
