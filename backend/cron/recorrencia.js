const cron = require("node-cron");
const pagamentoController = require("../controllers/pagamentoController");

// Executa todo dia 1º do mês às 00:00
cron.schedule("0 0 1 * *", async () => {
    console.log("🔔 Iniciando cron job de cobrança recorrente...");

    try {
        // Buscar todas assinaturas ativas
        const pool = require("../config/db");
        const result = await pool.query("SELECT id FROM assinaturas WHERE status = 'ATIVA'");
        const assinaturas = result.rows;

        for (let assinatura of assinaturas) {
            await pagamentoController.pagarRecorrente(assinatura.id);
        }

        console.log("✅ Cron job de cobrança concluído!");
    } catch (error) {
        console.error("❌ Erro no cron job de cobrança recorrente:", error);
    }
});
