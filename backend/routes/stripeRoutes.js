const express = require("express");
const router = express.Router();
const pool = require("../config/db");


const {
  iniciarCheckoutAssinatura,
  cancelarAssinatura,
} = require("../controllers/pagamentoStripeController");

const { protect } = require("../middleware/authMiddleware");

router.post("/checkout", protect, iniciarCheckoutAssinatura);

router.delete("/assinaturas/:assinaturaId/cancelar", protect, cancelarAssinatura);

module.exports = router;

router.post("/assinaturas/:assinaturaId/simular-renovacao", async (req, res) => {
  try {
    const { assinaturaId } = req.params;

    const { rows } = await pool.query(
      "SELECT status FROM assinaturas WHERE id = $1",
      [assinaturaId]
    );
    const assinatura = rows[0];

    if (!assinatura) {
      return res.status(404).json({ error: "Assinatura não encontrada." });
    }

    await pool.query(
      `UPDATE assinaturas 
       SET status = 'RENOVADA',
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [assinaturaId]
    );

    return res.status(200).json({ message: "Simulação de renovação realizada com sucesso." });
  } catch (error) {
    console.error("Erro ao simular renovação:", error);
    return res.status(500).json({ error: "Erro ao simular renovação." });
  }
});
