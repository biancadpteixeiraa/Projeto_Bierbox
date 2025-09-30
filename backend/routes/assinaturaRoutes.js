const express = require("express");
const router = express.Router();
const assinaturaController = require("../controllers/assinaturaController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", assinaturaController.listarAssinaturas);
router.get("/:id", assinaturaController.obterDetalhesAssinatura);
router.post("/:id/cancelar", assinaturaController.cancelarAssinatura);
router.put("/:id/alterar-endereco", assinaturaController.alterarEnderecoAssinatura);

module.exports = router;
