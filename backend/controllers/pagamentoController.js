const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN_TEST,
});

// ===================== CRIAR PREFERÊNCIA =====================
const criarPreferencia = async (req, res) => {
    try {
        const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
        const utilizadorId = req.userId;

        // 🔹 Mantido exatamente como no seu código original
        if (!isUuid(endereco_entrega_id) || (box_id && !isUuid(box_id))) {
            return res.status(400).json({ message: "ID de endereço ou box inválido." });
        }

        if (!plano_id || valor_frete === undefined) {
            return res.status(400).json({ message: "Dados insuficientes para criar o pagamento." });
        }

        const userResult = await pool.query(
            "SELECT email, nome_completo, mp_card_token FROM users WHERE id = $1",
            [utilizadorId]
        );
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "Utilizador não encontrado." });
        }
        const { email: userEmail, nome_completo: userName, mp_card_token } = userResult.rows[0];

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

        // 🔹 Inserção no banco exatamente como estava no seu código original
        const novaAssinatura = await pool.query(
            `INSERT INTO assinaturas 
            (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW()) RETURNING id`,
            [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
        );
        const assinaturaId = novaAssinatura.rows[0].id;

        // 🔹 Se já tiver token do cartão, podemos marcar para pagamento recorrente futuro
        let checkoutUrl = null;
        if (!mp_card_token) {
            // 🔹 Usuário ainda não cadastrou cartão → criar preferência para pagamento único
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
            checkoutUrl = result.init_point;
        } else {
            // 🔹 Aqui podemos preparar lógica futura de pagamento automático usando token
            // Exemplo comentado:
            // await gerarPagamentoRecorrenteComToken(assinaturaId, mp_card_token);
        }

        res.status(201).json({ checkoutUrl, assinaturaId });

    } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ message: "Erro no servidor ao criar preferência de pagamento." });
    }
};

// ===================== WEBHOOK =====================
const receberWebhook = async (req, res) => {
    console.log("🚨 Webhook disparado pelo Mercado Pago!");
    console.log("Body recebido:", req.body);

    const { type, data } = req.body;

    try {
        if (type === "payment") {
            const paymentClient = new Payment(client);
            const paymentDetails = await paymentClient.get({ id: data.id });

            console.log("🔍 Detalhes do Pagamento:", paymentDetails);

            if (paymentDetails.external_reference) {
                const assinaturaId = paymentDetails.external_reference;

                if (!isUuid(assinaturaId)) {
                    console.error(`❌ Erro no Webhook: external_reference não é um UUID válido: ${assinaturaId}`);
                    return res.status(200).send("Webhook processado com erro de referência.");
                }

                let formaPagamento = "Desconhecida";
                if (paymentDetails.payment_type_id) {
                    switch (paymentDetails.payment_type_id) {
                        case "credit_card": formaPagamento = "Cartão de Crédito"; break;
                        case "debit_card": formaPagamento = "Cartão de Débito"; break;
                        case "ticket": formaPagamento = "Boleto"; break;
                        case "atm": formaPagamento = "Caixa Eletrônico"; break;
                        case "bank_transfer": formaPagamento = "Transferência Bancária"; break;
                        case "account_money": formaPagamento = "Dinheiro em Conta MP"; break;
                        case "pix": formaPagamento = "Pix"; break;
                        default: formaPagamento = paymentDetails.payment_type_id;
                    }
                } else if (paymentDetails.payment_method_id) {
                    formaPagamento = paymentDetails.payment_method_id;
                }

                // Atualiza assinatura
                await pool.query(
                    "UPDATE assinaturas SET status = 'ATIVA', id_assinatura_mp = $1, atualizado_em = CURRENT_TIMESTAMP, forma_pagamento = $3 WHERE id = $2",
                    [paymentDetails.id.toString(), assinaturaId, formaPagamento]
                );

                console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA com forma de pagamento: ${formaPagamento}.`);
            }
        }

        res.status(200).send("Webhook recebido com sucesso.");
    } catch (error) {
        console.error("❌ Erro ao processar webhook:", error);
        res.status(500).send("Erro interno no servidor ao processar webhook.");
    }
};

module.exports = {
    criarPreferencia,
    receberWebhook
};
