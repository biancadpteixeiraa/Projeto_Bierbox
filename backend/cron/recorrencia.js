const cron = require('node-cron');
const { gerarPagamentoRecorrente } = require('../controllers/pagamentoController');
const pool = require('../config/db');

// Roda todo dia 1º de cada mês às 00:05
cron.schedule('5 0 1 * *', async () => {
    console.log("🚀 Iniciando cobrança recorrente...");
    const assinaturas = await pool.query("SELECT id FROM assinaturas WHERE status = 'ATIVA'");
    for (const a of assinaturas.rows) {
        const status = await gerarPagamentoRecorrente(a.id);
        console.log(`Assinatura ${a.id}: status ${status}`);
    }
});
