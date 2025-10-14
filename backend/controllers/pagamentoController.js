const { MercadoPagoConfig, CustomerCard, Payment } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN_TEST,
});

// ====================== PRIMEIRA COMPRA (gera link e captura token se cartão) ======================
const criarPagamentoPrimeiraCompra = async (req, res) => {
    try {
        const { plano_id, endereco_entrega_id, valor_frete, box_id, card_token } = req.body;
        const utilizadorId = req.userId;

        if (!isUuid(endereco_entrega_id) || (box_id && !isUuid(box_id))) {
            return res.status(400).json({ message: "ID de endereço ou box inválido." });
        }

        if (!plano_id || valor_frete === undefined) {
            return res.status(400).json({ message: "Dados insuficientes para criar o pagamento." });
        }

        const userResult = await pool.query("SELECT email, nome_completo FROM users WHERE id = $1", [utilizadorId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "Utilizador não encontrado." });
        }
        const userEmail = userResult.rows[0].email;
        const userName = userResult.rows[0].nome_completo;

        let preco_plano;
        if (plano_id === "PLANO_MENSAL") preco_plano = 80.00;
        else if (plano_id === "PLANO_ANUAL") preco_plano = 70.00;
        else return res.status(400).json({ message: "plano_id inválido." });

        const valor_total = preco_plano + parseFloat(valor_frete);

        // cria assinatura
        const novaAssinatura = await pool.query(
            "INSERT INTO assinaturas (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW()) RETURNING id",
            [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
        );
        const assinaturaId = novaAssinatura.rows[0].id; 

        // se tiver token de cartão, salva no usuário para recorrência futura
        if (card_token) {
            await pool.query(
                "UPDATE users SET mp_card_token = $1 WHERE id = $2",
                [card_token, utilizadorId]
            );
        }

        // Cria link para pagamento da primeira compra
        const paymentClient = new Payment(client);
        const paymentData = {
            transaction_amount: valor_total,
            token: card_token || undefined,
            description: `Assinatura BierBox - ${plano_id}`,
            payer: { email: userEmail },
            external_reference: assinaturaId.toString(),
            installments: 1,
        };

        const result = await paymentClient.create({ body: paymentData });
        res.status(201).json({ payment_id: result.id, status: result.status, link_pagamento: result.init_point });

    } catch (error) {
        console.error("Erro criar pagamento primeira compra:", error);
        res.status(500).json({ message: "Erro no servidor ao criar pagamento." });
    }
};

// ====================== CRON JOB / COBRANÇA AUTOMÁTICA ======================
const gerarPagamentoRecorrente = async (assinaturaId) => {
    try {
        const assinaturaResult = await pool.query(
            `SELECT a.id, a.plano_id, a.box_id, a.endereco_entrega_id, a.utilizador_id, u.email, u.nome_completo, u.mp_card_token
             FROM assinaturas a
             JOIN users u ON u.id = a.utilizador_id
             WHERE a.id = $1 AND a.status = 'ATIVA'`,
            [assinaturaId]
        );
        if (!assinaturaResult.rows.length) return null;

        const assinatura = assinaturaResult.rows[0];
        if (!assinatura.mp_card_token) return null; // não tem token → não cobramos

        // calcular valor do plano + frete (implementar calcularFrete)
        const valor_frete = await calcularFrete(assinatura.endereco_entrega_id);
        let preco_plano = assinatura.plano_id === "PLANO_MENSAL" ? 80.00 : 70.00;
        const valor_total = preco_plano + parseFloat(valor_frete);

        const paymentClient = new Payment(client);
        const paymentData = {
            transaction_amount: valor_total,
            token: assinatura.mp_card_token,
            description: `Assinatura BierBox - ${assinatura.plano_id}`,
            payer: { email: assinatura.email },
            installments: 1,
            external_reference: assinatura.id.toString(),
        };

        const result = await paymentClient.create({ body: paymentData });

        await pool.query(
            "INSERT INTO pagamentos (assinatura_id, valor, status, criado_em) VALUES ($1, $2, $3, NOW())",
            [assinatura.id, valor_total, result.status]
        );

        return result.status;
    } catch (error) {
        console.error("Erro gerar pagamento recorrente:", error);
        return null;
    }
};

// ====================== WEBHOOK ======================
const receberWebhook = async (req, res) => {
    const { type, data } = req.body;

    try {
        if (type === "payment") {
            const paymentClient = new Payment(client);
            const paymentDetails = await paymentClient.get({ id: data.id });

            const assinaturaId = paymentDetails.external_reference;
            if (!isUuid(assinaturaId)) return res.status(200).send("Erro de referência.");

            let statusCiclo = paymentDetails.status === "approved" ? "APROVADO" : "INADIMPLENTE";

            await pool.query(
                "UPDATE assinaturas SET status_pagamento_atual = $1, atualizado_em = NOW() WHERE id = $2",
                [statusCiclo, assinaturaId]
            );

            await pool.query(
                "UPDATE pagamentos SET status = $1, atualizado_em = NOW() WHERE assinatura_id = $2",
                [statusCiclo, assinaturaId]
            );
        }
        res.status(200).send("Webhook processado com sucesso.");
    } catch (error) {
        console.error("Erro processando webhook:", error);
        res.status(500).send("Erro interno no servidor.");
    }
};

module.exports = {
    criarPagamentoPrimeiraCompra,
    gerarPagamentoRecorrente,
    receberWebhook,
};
