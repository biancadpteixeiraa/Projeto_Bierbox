const express = require("express");
const { calcularFrete } = require("../controllers/freteController");

const router = express.Router();

router.post("/calcular", calcularFrete);

module.exports = router;
