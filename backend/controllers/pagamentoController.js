// backend/controllers/pagamentoController.js

const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const pool = require("../config/db");

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN_TEST,
});

exports.criarPreferencia = async (req, res) => {
    try {
        const { plano_id, endereco_entrega_id, valor_frete } = req.body;
        const utilizadorId = req.userId;

        if (!plano_id || !endereco_entrega_id || valor_frete === undefined) {
            return res.status(400).json({ message: "Dados insuficientes para criar o pagamento." });
        }

        const userResult = await pool.query("SELECT email, nome_completo FROM users WHERE id = $1", [utilizadorId]);
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

        // Inserir a assinatura como PENDENTE antes de criar a preferência
        const novaAssinatura = await pool.query(
            "INSERT INTO assinaturas (utilizador_id, plano_id, status) VALUES ($1, $2, $3) RETURNING id",
            [utilizadorId, plano_id, "PENDENTE"]
        );
        const assinaturaId = novaAssinatura.rows[0].id;

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
            // Usar o ID da assinatura como external_reference para facilitar a identificação no webhook
            external_reference: assinaturaId.toString(), 
            back_urls: {
                success: `https://www.google.com/sucesso?assinatura_id=${assinaturaId}`,
                failure: `https://www.google.com/falha?assinatura_id=${assinaturaId}`,
                pending: `https://www.google.com/pendente?assinatura_id=${assinaturaId}`,
            },
            auto_return: "approved",
            // Adicionar a URL de notificação para o webhook
            notification_url: `${process.env.BACKEND_URL}/api/pagamentos/webhook` 
        };

        const result = await preference.create({ body: preferenceBody } );
        res.status(201).json({ checkoutUrl: result.init_point });

    } catch (error) {
        console.error("Erro ao criar preferência de pagamento:", error);
        res.status(500).json({ message: "Erro no servidor ao criar preferência de pagamento." });
    }
};

exports.receberWebhook = async (req, res) => {
    console.log("Webhook COMPLETO recebido:", JSON.stringify(req.body, null, 2));
    const { type, data } = req.body;

    try {
        if (type === "payment") {
            const paymentClient = new Payment(client);
            // O ID do pagamento no webhook do Mercado Pago vem em req.query.id ou req.body.data.id
            // Vamos usar req.query.id que é mais comum para notificações de pagamento
            const paymentId = req.query.id || data.id; 

            if (!paymentId) {
                console.error("Webhook de pagamento recebido sem ID de pagamento.", req.body);
                return res.status(400).send("ID de pagamento ausente.");
            }

            const paymentDetails = await paymentClient.get({ id: paymentId });

            console.log("Detalhes do Pagamento obtidos do MP:", JSON.stringify(paymentDetails, null, 2));

            if (paymentDetails.status === "approved" && paymentDetails.external_reference) {
                const assinaturaId = parseInt(paymentDetails.external_reference, 10);
                
                if (isNaN(assinaturaId)) {
                    console.error("external_reference inválido no webhook:", paymentDetails.external_reference);
                    return res.status(400).send("external_reference inválido.");
                }

                await pool.query(
                    "UPDATE assinaturas SET status = \'ATIVA\', id_assinatura_mp = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id = $2",
                    [paymentDetails.id, assinaturaId]
                );
                console.log(`Assinatura ${assinaturaId} atualizada para ATIVA. ID MP: ${paymentDetails.id}`);
                
                // Futuramente, aqui também se cria o primeiro registo na tabela \'pedidos\'
            } else {
                console.log(`Pagamento ${paymentId} não aprovado ou sem external_reference. Status: ${paymentDetails.status}`);
            }
        } else {
            console.log(`Tipo de webhook (${type}) não tratado neste momento.`);
        }
        res.status(200).send("Webhook recebido com sucesso.");
    } catch (error) {
        console.error("Erro ao processar webhook:", error);
        res.status(500).send("Erro interno no servidor ao processar webhook.");
    }
};
