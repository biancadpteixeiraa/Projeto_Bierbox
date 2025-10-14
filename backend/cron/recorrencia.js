const cron = require('node-cron');
const pool = require('../config/db');
const { cobrarAssinaturaAutomaticamente } = require('../controllers/pagamentoController');

// Cron job: todo dia 1º do mês às 00:00
cron.schedule('0 0 1 * *', async () => {
    console.log("🚀 Iniciando cobrança automática de assinaturas...");

    try {
        // Busca todas as assinaturas ATIVAS
        const result = await pool.query("SELECT id FROM assinaturas WHERE status = 'ATIVA'");
        const assinaturas = result.rows;

        if (assinaturas.length === 0) {
            console.log("⚠️ Nenhuma assinatura ativa encontrada.");
            return;
        }

        for (const assinatura of assinaturas) {
            console.log(`💳 Processando assinatura ${assinatura.id}...`);
            const pagamento = await cobrarAssinaturaAutomaticamente(assinatura.id);

            if (pagamento) console.log(`✅ Cobrança realizada para assinatura ${assinatura.id}`);
            else console.log(`❌ Falha ao cobrar assinatura ${assinatura.id}`);
        }

    } catch (error) {
        console.error("❌ Erro ao processar cobranças automáticas:", error);
    }
});

console.log("⏱️ Cron job de recorrência iniciado com sucesso!");
