const { MercadoPagoConfig, Preference, Payment, Customer, Card } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN_TEST,
});

// ====================== PRIMEIRA COMPRA (COM LINK) ======================
const criarPreferencia = async (req, res) => {
    try {
        const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
        const utilizadorId = req.userId;

        if (!isUuid(endereco_entrega_id) || (box_id && !isUuid(box_id))) {
            return res.status(400).json({ message: "ID de endereço ou box inválido." });
        }
        if (!plano_id || valor_frete === undefined) {
            return res.status(400).json({ message: "Dados insuficientes para criar o pagamento." });
        }

        const userResult = await pool.query("SELECT email, nome_completo, mp_card_token FROM users WHERE id = $1", [utilizadorId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "Utilizador não encontrado." });
        }

        const userEmail = userResult.rows[0].email;
        const userName = userResult.rows[0].nome_completo;

        let preco_plano;
        let titulo_plano;

        if (plano_id === "PLANO_MENSAL") {
            preco_plano = 80.00;
            titulo_plano = "BierBox - Assinatura Mensal";
        } else if (plano_id === "PLANO_ANUAL") {
            preco_plano = 70.00;
            titulo_plano = "BierBox - Assinatura Anual";
        } else {
            return res.status(400).json({ message: "plano_id inválido." });
        }

        const valor_total = preco_plano + parseFloat(valor_frete);

        // Criar assinatura no banco
        const novaAssinatura = await pool.query(
            "INSERT INTO assinaturas (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em, proximo_ciclo, status_pagamento_atual) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW(), NOW(), 'PENDENTE') RETURNING id",
            [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
        );
        const assinaturaId = novaAssinatura.rows[0].id; 

        // Criar preferência no Mercado Pago
        const preference = new Preference(client);
        const preferenceBody = {
            items: [
                {
                    id: plano_id,
                    title: titulo_plano,
                    description: "Assinatura do clube de cervejas BierBox",
                    quantity: 1,
                    unit_price: valor_total,
                    currency_id: "BRL",
                },
            ],
            payer: {
                email: userEmail,
                name: userName,
            },
            external_reference: assinaturaId.toString(),
            back_urls: {
                success: `${process.env.BASE_URL}/checkout/aprovado`,
                pending: `${process.env.BASE_URL}/checkout/pendente`,
                failure: `${process.env.BASE_URL}/checkout/falha`,
            },
            auto_return: "approved",
            notification_url: `${process.env.BASE_URL}/api/pagamentos/webhook`,
        };

        const result = await preference.create({ body: preferenceBody });
        res.status(201).json({ checkoutUrl: result.init_point });
    } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ message: "Erro no servidor ao criar preferência de pagamento." });
    }
};

// ====================== COBRANÇA AUTOMÁTICA RECORRENTE ======================
const pagarRecorrente = async (assinaturaId) => {
    try {
        // Buscar assinatura ativa e token do cartão do usuário
        const assinaturaResult = await pool.query(
            `SELECT a.id, a.plano_id, a.box_id, a.endereco_entrega_id, a.utilizador_id, u.email, u.nome_completo, u.mp_card_token
             FROM assinaturas a
             JOIN users u ON u.id = a.utilizador_id
             WHERE a.id = $1 AND a.status = 'ATIVA'`,
            [assinaturaId]
        );

        if (assinaturaResult.rows.length === 0) return null;
        const assinatura = assinaturaResult.rows[0];

        if (!assinatura.mp_card_token) {
            console.log(`Usuário ${assinatura.utilizador_id} não possui token de cartão. Não é possível cobrar automaticamente.`);
            return null;
        }

        // calcular valor do box + frete
        const valor_frete = await calcularFrete(assinatura.endereco_entrega_id);
        let preco_plano = assinatura.plano_id === "PLANO_MENSAL" ? 80.00 : 70.00;
        const valor_total = preco_plano + parseFloat(valor_frete);

        // Criar pagamento automático via token do cartão
        const paymentClient = new Payment(client);
        const paymentResult = await paymentClient.create({
            transaction_amount: valor_total,
            token: assinatura.mp_card_token,
            description: `Assinatura BierBox - ${assinatura.plano_id}`,
            installments: 1,
            payer: {
                email: assinatura.email,
            },
            external_reference: assinaturaId.toString(),
        });

        // Registrar pagamento no banco (nova tabela pagamentos)
        await pool.query(
            `INSERT INTO pagamentos (assinatura_id, valor, status, mp_payment_id, criado_em) VALUES ($1, $2, $3, $4, NOW())`,
            [assinaturaId, valor_total, paymentResult.status, paymentResult.id.toString()]
        );

        console.log(`Pagamento recorrente criado para assinatura ${assinaturaId} - Status: ${paymentResult.status}`);
        return paymentResult;
    } catch (error) {
        console.error("Erro ao gerar pagamento recorrente:", error);
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
            if (paymentDetails.external_reference) {
                const assinaturaId = paymentDetails.external_reference;

                let statusCiclo;
                switch (paymentDetails.status) {
                    case "approved": statusCiclo = "APROVADO"; break;
                    case "pending": statusCiclo = "PENDENTE"; break;
                    default: statusCiclo = "INADIMPLENTE"; break;
                }

                await pool.query(
                    `UPDATE assinaturas 
                     SET status_pagamento_atual = $1, atualizado_em = NOW()
                     WHERE id = $2`,
                    [statusCiclo, assinaturaId]
                );

                // Atualiza tabela pagamentos se existir
                await pool.query(
                    `UPDATE pagamentos SET status = $1, atualizado_em = NOW() WHERE mp_payment_id = $2`,
                    [statusCiclo, paymentDetails.id.toString()]
                );

                console.log(`Assinatura ${assinaturaId} atualizada via webhook - Status: ${statusCiclo}`);
            }
        }
        res.status(200).send("Webhook recebido com sucesso.");
    } catch (error) {
        console.error("Erro ao processar webhook:", error);
        res.status(500).send("Erro interno no servidor ao processar webhook.");
    }
};

module.exports = {
    criarPreferencia,   // primeira compra
    pagarRecorrente,    // cobrança automática
    receberWebhook,     // webhook
};
