const { MercadoPagoConfig, Preference, Payment, CustomerCard, Subscription } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN_TEST,
});

// ==================== CRIAR PREFERÊNCIA (primeira compra) ====================
const criarPreferencia = async (req, res) => {
    try {
        const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
        const utilizadorId = req.userId;

        // Valida UUIDs
        if (!isUuid(endereco_entrega_id) || (box_id && !isUuid(box_id))) {
            return res.status(400).json({ message: "ID de endereço ou box inválido." });
        }
        if (!plano_id || valor_frete === undefined) {
            return res.status(400).json({ message: "Dados insuficientes para criar o pagamento." });
        }

        // Busca usuário
        const userResult = await pool.query("SELECT email, nome_completo FROM users WHERE id = $1", [utilizadorId]);
        if (userResult.rows.length === 0) return res.status(404).json({ message: "Utilizador não encontrado." });
        const { email: userEmail, nome_completo: userName } = userResult.rows[0];

        // Define preço
        let preco_plano, titulo_plano;
        if (plano_id === "PLANO_MENSAL") { preco_plano = 80.00; titulo_plano = "BierBox - Mensal"; }
        else if (plano_id === "PLANO_ANUAL") { preco_plano = 70.00; titulo_plano = "BierBox - Anual"; }
        else return res.status(400).json({ message: "plano_id inválido." });

        const valor_total = preco_plano + parseFloat(valor_frete);

        // Cria assinatura no banco
        const novaAssinatura = await pool.query(
            `INSERT INTO assinaturas 
             (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em) 
             VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW(),NOW()) RETURNING id`,
            [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
        );
        const assinaturaId = novaAssinatura.rows[0].id;

        // Cria preferência no Mercado Pago (checkout link)
        const preference = new Preference(client);
        const preferenceBody = {
            items: [{ id: plano_id, title: titulo_plano, description: "Assinatura BierBox", quantity: 1, unit_price: valor_total, currency_id: "BRL" }],
            payer: { email: userEmail, name: userName },
            external_reference: assinaturaId.toString(),
            back_urls: {
                success: `${BASE_URL}/checkout/aprovado`,
                pending: `${BASE_URL}/checkout/pendente`,
                failure: `${BASE_URL}/checkout/falha`,
            },
            auto_return: "approved",
            notification_url: `${BASE_URL}/api/pagamentos/webhook`,
        };
        const result = await preference.create({ body: preferenceBody });
        res.status(201).json({ checkoutUrl: result.init_point });

    } catch (error) {
        console.error("Erro ao criar preferência:", error);
        res.status(500).json({ message: "Erro no servidor ao criar preferência." });
    }
};

// ==================== COBRANÇA RECORRENTE (tokenizada) ====================
// Essa função será chamada pelo cronjob mensal
const cobrarAssinaturaAutomaticamente = async (assinaturaId) => {
    try {
        const assinaturaResult = await pool.query(
            `SELECT a.id, a.plano_id, a.utilizador_id, u.mp_card_token, u.email, u.nome_completo
             FROM assinaturas a
             JOIN users u ON u.id = a.utilizador_id
             WHERE a.id = $1 AND a.status = 'ATIVA'`,
            [assinaturaId]
        );
        if (assinaturaResult.rows.length === 0) return null;

        const assinatura = assinaturaResult.rows[0];
        if (!assinatura.mp_card_token) return null; // usuário não tem cartão tokenizado

        // Define valor
        const preco_plano = assinatura.plano_id === "PLANO_MENSAL" ? 80.00 : 70.00;
        // Aqui você pode adicionar cálculo de frete se necessário
        const valor_total = preco_plano; 

        // Criar pagamento via token (Mercado Pago)
        const paymentData = {
            transaction_amount: valor_total,
            token: assinatura.mp_card_token,
            description: `Assinatura recorrente ${assinatura.plano_id}`,
            installments: 1,
            payer: { email: assinatura.email },
        };
        const paymentClient = new Payment(client);
        const paymentResult = await paymentClient.create(paymentData);

        // Salvar pagamento na tabela pagamentos
        await pool.query(
            `INSERT INTO pagamentos (assinatura_id, mp_payment_id, valor, status, criado_em) 
             VALUES ($1,$2,$3,$4,NOW())`,
            [assinaturaId, paymentResult.id.toString(), valor_total, paymentResult.status.toUpperCase()]
        );

        console.log(`✅ Cobrança automática realizada: Assinatura ${assinaturaId}, status: ${paymentResult.status}`);
        return paymentResult;

    } catch (error) {
        console.error("Erro ao cobrar assinatura automaticamente:", error);
        return null;
    }
};

// ==================== WEBHOOK ====================
const receberWebhook = async (req, res) => {
    console.log("🚨 Webhook Mercado Pago disparado!");
    console.log(req.body);

    try {
        const { type, data } = req.body;
        if (type === "payment") {
            const paymentClient = new Payment(client);
            const paymentDetails = await paymentClient.get({ id: data.id });

            if (paymentDetails.external_reference && isUuid(paymentDetails.external_reference)) {
                const assinaturaId = paymentDetails.external_reference;
                const formaPagamento = paymentDetails.payment_type_id || paymentDetails.payment_method_id || "Desconhecida";

                let statusAtual = "INADIMPLENTE";
                if (paymentDetails.status === "approved") statusAtual = "APROVADO";
                else if (paymentDetails.status === "pending") statusAtual = "PENDENTE";

                // Atualiza assinatura e pagamento
                await pool.query(
                    `UPDATE assinaturas SET status_pagamento_atual = $1, atualizado_em = NOW(), forma_pagamento = $2 
                     WHERE id = $3`,
                    [statusAtual, formaPagamento, assinaturaId]
                );
                console.log(`Assinatura ${assinaturaId} atualizada via webhook: ${statusAtual}`);
            }
        }
        res.status(200).send("Webhook recebido com sucesso.");
    } catch (error) {
        console.error("Erro webhook:", error);
        res.status(500).send("Erro interno no servidor");
    }
};

module.exports = {
    criarPreferencia,
    cobrarAssinaturaAutomaticamente,
    receberWebhook
};
