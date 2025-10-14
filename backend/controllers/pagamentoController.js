const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN_TEST,
});

const criarAssinatura = async (req, res) => {
    try {
        const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
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

        let titulo_plano;
        let preco_plano; // Valor base da assinatura, sem frete

        if (plano_id === "PLANO_MENSAL") {
            titulo_plano = "BierBox - Assinatura Mensal";
            preco_plano = 80.00;
        } else if (plano_id === "PLANO_ANUAL") {
            titulo_plano = "BierBox - Assinatura Anual";
            preco_plano = 70.00;
        } else {
            return res.status(400).json({ message: "plano_id inválido." });
        }

        // O valor total da recorrência incluirá o preço da box + o frete
        const valor_total_recorrente = preco_plano + parseFloat(valor_frete);

        // Cria uma entrada PENDENTE no seu banco de dados para a assinatura
        const novaAssinatura = await pool.query(
            "INSERT INTO assinaturas (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW()) RETURNING id",
            [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
        );
        const assinaturaId = novaAssinatura.rows[0].id; 

        const subscriptionClient = new client.preapproval();
        const subscriptionBody = {
            reason: titulo_plano,
            payer_email: userEmail,
            back_url: `https://projeto-bierbox.onrender.com/checkout/assinatura-status`,
            external_reference: assinaturaId.toString(), // ID da sua assinatura no seu banco de dados
            auto_recurring: {
                frequency: (plano_id === "PLANO_MENSAL") ? 1 : 12, // 1 para mensal, 12 para anual
                frequency_type: "months",
                transaction_amount: valor_total_recorrente, // O valor da recorrência é o preço do plano + frete
                currency_id: "BRL",
            },
            // notification_url: "https://projeto-bierbox.onrender.com/api/pagamentos/webhook", // O webhook de assinaturas é diferente
            // Para assinaturas, o Mercado Pago envia notificações para a URL configurada no plano ou na aplicação
            // É importante configurar o webhook de assinaturas no painel do MP para receber eventos de \'preapproval\'
        };

        const result = await subscriptionClient.create({ body: subscriptionBody } );
        
        // Atualiza a assinatura no seu banco de dados com o ID da assinatura do Mercado Pago
        await pool.query(
            "UPDATE assinaturas SET id_assinatura_mp = $1, atualizado_em = NOW() WHERE id = $2",
            [result.id, assinaturaId]
        );

        res.status(201).json({ checkoutUrl: result.init_point });

    } catch (error) {
        console.error("Erro ao criar assinatura recorrente:", error);
        res.status(500).json({ message: "Erro no servidor ao criar assinatura recorrente." });
    }
};

const receberWebhook = async (req, res) => {
    console.log("🚨 Webhook disparado pelo Mercado Pago!");
    console.log("Body recebido:", req.body);

    const { type, data } = req.body;

    try {
        if (type === "payment") {
            // Lógica existente para pagamentos únicos (se ainda for relevante)
            const paymentClient = new Payment(client);
            const paymentDetails = await paymentClient.get({ id: data.id });

            console.log("🔍 Detalhes do Pagamento (Webhook Payment):", paymentDetails);

            if (paymentDetails.status === "approved" && paymentDetails.external_reference) {
                const assinaturaId = paymentDetails.external_reference;

                if (!isUuid(assinaturaId)) {
                    console.error(`❌ Erro no Webhook Payment: external_reference não é um UUID válido: ${assinaturaId}`);
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

                await pool.query(
                    "UPDATE assinaturas SET status = \'ATIVA\', id_assinatura_mp = $1, atualizado_em = CURRENT_TIMESTAMP, forma_pagamento = $3 WHERE id = $2",
                    [paymentDetails.id.toString(), assinaturaId, formaPagamento]
                );

                console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA com forma de pagamento: ${formaPagamento}.`);
            }
        } else if (type === "preapproval") {
            // Lógica para webhooks de Assinatura (Preapproval)
            const subscriptionClient = new client.preapproval();
            const subscriptionDetails = await subscriptionClient.get({ id: data.id });

            console.log("🔍 Detalhes da Assinatura (Webhook Preapproval):", subscriptionDetails);

            if (subscriptionDetails.status === "authorized" && subscriptionDetails.external_reference) {
                const assinaturaId = subscriptionDetails.external_reference;

                if (!isUuid(assinaturaId)) {
                    console.error(`❌ Erro no Webhook Preapproval: external_reference não é um UUID válido: ${assinaturaId}`);
                    return res.status(200).send("Webhook processado com erro de referência.");
                }

                // Atualiza o status da assinatura no seu banco de dados
                await pool.query(
                    "UPDATE assinaturas SET status = \'ATIVA\', id_assinatura_mp = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id = $2",
                    [subscriptionDetails.id, assinaturaId]
                );

                console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA via webhook de preapproval.`);
            } else if (subscriptionDetails.status === "cancelled" && subscriptionDetails.external_reference) {
                const assinaturaId = subscriptionDetails.external_reference;

                if (!isUuid(assinaturaId)) {
                    console.error(`❌ Erro no Webhook Preapproval: external_reference não é um UUID válido: ${assinaturaId}`);
                    return res.status(200).send("Webhook processado com erro de referência.");
                }

                await pool.query(
                    "UPDATE assinaturas SET status = \'CANCELADA\', data_cancelamento = CURRENT_TIMESTAMP, atualizado_em = CURRENT_TIMESTAMP WHERE id = $1",
                    [assinaturaId]
                );
                console.log(`❌ Assinatura ${assinaturaId} atualizada para CANCELADA via webhook de preapproval.`);
            }
            // Você pode adicionar mais condições para outros status de assinatura, como \'paused\', \'pending\', etc.

        } else {
            console.log(`ℹ️ Webhook de tipo desconhecido recebido: ${type}`);
        }

        res.status(200).send("Webhook recebido com sucesso.");
    } catch (error) {
        console.error("❌ Erro ao processar webhook:", error);
        res.status(500).send("Erro interno no servidor ao processar webhook.");
    }
};

module.exports = {
    criarAssinatura,
    receberWebhook
};
