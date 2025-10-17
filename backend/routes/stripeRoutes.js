const express = require("express");
const router = express.Router();
const pool = require("../config/db");


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

// ✅ Rota para simular a renovação de uma assinatura (sem passar pelo Stripe)
router.post("/assinaturas/:assinaturaId/simular-renovacao", async (req, res) => {
  try {
    const { assinaturaId } = req.params;

    // Verifica se existe no banco
    const { rows } = await pool.query(
      "SELECT status FROM assinaturas WHERE id = $1",
      [assinaturaId]
    );
    const assinatura = rows[0];

    if (!assinatura) {
      return res.status(404).json({ error: "Assinatura não encontrada." });
    }

    // Simula a renovação: atualiza status e data de atualização
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
