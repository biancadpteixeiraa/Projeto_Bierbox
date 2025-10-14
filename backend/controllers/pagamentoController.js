const { MercadoPagoConfig, PreApproval, Payment } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN_TEST });

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

        const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [utilizadorId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "Utilizador não encontrado." });
        }
        const userEmail = userResult.rows[0].email;

        let titulo_plano;
        let preco_plano;

        if (plano_id === "PLANO_MENSAL") {
            titulo_plano = "BierBox - Assinatura Mensal";
            preco_plano = 80.00;
        } else if (plano_id === "PLANO_ANUAL") {
            titulo_plano = "BierBox - Assinatura Anual";
            preco_plano = 70.00;
        } else {
            return res.status(400).json({ message: "plano_id inválido." });
        }

        const valor_total_recorrente = preco_plano + parseFloat(valor_frete);

        const novaAssinatura = await pool.query(
            "INSERT INTO assinaturas (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id",
            [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
        );
        const assinaturaId = novaAssinatura.rows[0].id;

        const preApprovalClient = new PreApproval(client);
        const preApprovalBody = {
            reason: titulo_plano,
            payer_email: userEmail,
            back_url: `${process.env.BASE_URL}/checkout/assinatura-status`,
            external_reference: assinaturaId.toString(),
            auto_recurring: {
                frequency: 1, // A frequência é sempre 1
                frequency_type: (plano_id === "PLANO_MENSAL") ? "months" : "years", // 'months' para mensal, 'years' para anual
                transaction_amount: valor_total_recorrente,
                currency_id: "BRL",
            },
        };

        const result = await preApprovalClient.create({ body: preApprovalBody });

        await pool.query(
            "UPDATE assinaturas SET id_assinatura_mp = $1 WHERE id = $2",
            [result.id, assinaturaId]
        );

        res.status(201).json({ checkoutUrl: result.init_point });

    } catch (error) {
        console.error("Erro ao criar assinatura recorrente:", error);
        res.status(500).json({ message: "Erro no servidor ao criar assinatura recorrente." });
    }
};

const receberWebhook = async (req, res) => {
    const { type, data } = req.body;
    console.log("Webhook recebido:", type, data);

    try {
        if (type === "preapproval") {
            const preApprovalClient = new PreApproval(client);
            const preApprovalDetails = await preApprovalClient.get({ id: data.id });

            if (preApprovalDetails.status === "authorized" && preApprovalDetails.external_reference) {
                const assinaturaId = preApprovalDetails.external_reference;
                await pool.query("UPDATE assinaturas SET status = 'ATIVA' WHERE id = $1", [assinaturaId]);
                console.log(`Assinatura ${assinaturaId} atualizada para ATIVA.`);
            } else if (preApprovalDetails.status === "cancelled" && preApprovalDetails.external_reference) {
                const assinaturaId = preApprovalDetails.external_reference;
                await pool.query("UPDATE assinaturas SET status = 'CANCELADA', data_cancelamento = NOW() WHERE id = $1", [assinaturaId]);
                console.log(`Assinatura ${assinaturaId} atualizada para CANCELADA.`);
            }
        }
        // Adicione aqui a lógica para 'payment' se necessário

        res.status(200).send("Webhook processado.");
    } catch (error) {
        console.error("Erro ao processar webhook:", error);
        res.status(500).send("Erro interno no servidor ao processar webhook.");
    }
};

module.exports = {
    criarAssinatura,
    receberWebhook
};
