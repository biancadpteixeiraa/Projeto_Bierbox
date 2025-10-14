const { MercadoPagoConfig, PreApproval } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN_TEST;
const client = new MercadoPagoConfig({ accessToken: mpAccessToken });

const criarAssinaturaRecorrente = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
    const utilizadorId = req.userId;

    if (!isUuid(endereco_entrega_id) || (box_id && !isUuid(box_id))) {
      return res.status(400).json({ message: "ID de endereço ou box inválido." });
    }

    if (!plano_id || valor_frete === undefined) {
      return res.status(400).json({ message: "Dados insuficientes para criar a assinatura." });
    }

    const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [utilizadorId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }
    const userEmail = userResult.rows[0].email;

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

    const valor_total_recorrente = preco_plano + parseFloat(valor_frete);

    const novaAssinatura = await pool.query(
      "INSERT INTO assinaturas (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW()) RETURNING id",
      [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
    );
    const assinaturaId = novaAssinatura.rows[0].id;

    const isTestEnv = mpAccessToken === process.env.MP_ACCESS_TOKEN_TEST;
    const payerEmail = isTestEnv ? "test_user_2695420795@testuser.com" : userEmail;

    const subscriptionClient = new PreApproval(client);
    const subscriptionBody = {
      reason: titulo_plano,
      payer_email: payerEmail,
      back_url: `${process.env.BASE_URL}/checkout/assinatura-status`,
      external_reference: assinaturaId,
      auto_recurring: {
        frequency: plano_id === "PLANO_MENSAL" ? 1 : 12,
        frequency_type: "months",
        transaction_amount: valor_total_recorrente,
        currency_id: "BRL"
      },
      notification_url: `${process.env.BASE_URL}/api/pagamentos/webhook`
    };

    const result = await subscriptionClient.create({ body: subscriptionBody });

    res.status(201).json({
      checkoutUrl: result.init_point,
      assinaturaId,
      mercadoPagoId: result.id
    });

  } catch (error) {
    console.error("Erro ao criar assinatura recorrente:", error);
    res.status(500).json({
      message: "Erro no servidor ao criar assinatura recorrente.",
      details: error.message || error
    });
  }
};

const receberWebhook = async (req, res) => {
  console.log("🚨 Webhook disparado pelo Mercado Pago!");
  console.log("Body recebido:", JSON.stringify(req.body, null, 2));

  const { type, data } = req.body;

  try {
    if (type === "subscription_preapproval") {
      const preapprovalId = data.id;
      console.log("🔁 Notificação de assinatura recorrente recebida:", preapprovalId);

      const result = await pool.query(
        "UPDATE assinaturas SET status = 'ATIVA', id_assinatura_mp = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id_assinatura_mp IS NULL AND status = 'PENDENTE'",
        [preapprovalId]
      );

      if (result.rowCount > 0) {
        console.log(`✅ Assinatura recorrente ativada com sucesso: ${preapprovalId}`);
      } else {
        console.warn(`⚠️ Nenhuma assinatura pendente encontrada para atualizar com ID: ${preapprovalId}`);
      }
    }

    res.status(200).send("Webhook recebido com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    res.status(500).send("Erro interno no servidor ao processar webhook.");
  }
};

module.exports = {
  criarAssinaturaRecorrente,
  receberWebhook
};
