const { MercadoPagoConfig, Preference, PreApproval, Payment } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN_TEST;
const client = new MercadoPagoConfig({ accessToken: mpAccessToken });

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
      external_reference: "temp-" + Date.now(), // referência temporária
      back_urls: {
        success: `${process.env.BASE_URL}/checkout/aprovado`,
        pending: `${process.env.BASE_URL}/checkout/pendente`,
        failure: `${process.env.BASE_URL}/checkout/falha`,
      },
      auto_return: "approved",
      notification_url: `${process.env.BASE_URL}/api/pagamentos/webhook`,
    };

    const result = await preference.create({ body: preferenceBody });

    // Cria assinatura no banco após preferência ser criada
    const novaAssinatura = await pool.query(
      "INSERT INTO assinaturas (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW()) RETURNING id",
      [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
    );
    const assinaturaId = novaAssinatura.rows[0].id;

    res.status(201).json({ checkoutUrl: result.init_point });

  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    res.status(500).json({ message: "Erro no servidor ao criar preferência de pagamento." });
  }
};

const receberWebhook = async (req, res) => {
  console.log("🚨 Webhook disparado pelo Mercado Pago!");
  console.log("Body recebido:", JSON.stringify(req.body, null, 2));

  const { type, data } = req.body;

  try {
    if (type === "payment") {
      const paymentClient = new Payment(client);
      const paymentDetails = await paymentClient.get({ id: data.id });

      console.log("🔍 Detalhes do Pagamento:", JSON.stringify(paymentDetails, null, 2));

      const assinaturaId = paymentDetails.external_reference;
      console.log("🔍 External Reference recebido:", assinaturaId);

      if (!assinaturaId) {
        console.error("external_reference ausente ou inválida:", assinaturaId);
        return res.status(200).send("Webhook processado com erro de referência.");
      }

      let formaPagamento = "Desconhecida";
      if (paymentDetails.payment_type_id) {
        switch (paymentDetails.payment_type_id) {
          case "credit_card": formaPagamento = "Cartão de Crédito"; break;
          case "debit_card": formaPagamento = "Cartão de Débito"; break;
          case "ticket": formaPagamento = "Boleto"; break;
          case "pix": formaPagamento = "Pix"; break;
          default: formaPagamento = paymentDetails.payment_type_id;
        }
      } else if (paymentDetails.payment_method_id) {
        formaPagamento = paymentDetails.payment_method_id;
      }

      await pool.query(
        "UPDATE assinaturas SET status = 'ATIVA', id_assinatura_mp = $1, atualizado_em = CURRENT_TIMESTAMP, forma_pagamento = $3 WHERE id = $2",
        [paymentDetails.id.toString(), assinaturaId, formaPagamento]
      );

      console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA com forma de pagamento: ${formaPagamento}.`);

      // 🔁 Cria assinatura recorrente após pagamento único aprovado
      try {
        const assinaturaResult = await pool.query("SELECT * FROM assinaturas WHERE id = $1", [assinaturaId]);
        const assinatura = assinaturaResult.rows[0];

        const valorRecorrente = Number(assinatura.valor_assinatura) + Number(assinatura.valor_frete || 0);
        const planoId = assinatura.plano_id;
        const tituloPlano = planoId === "PLANO_MENSAL" ? "BierBox - Assinatura Mensal" : "BierBox - Assinatura Anual";

        const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [assinatura.utilizador_id]);
        const userEmail = userResult.rows[0].email;

        const isTestEnv = mpAccessToken === process.env.MP_ACCESS_TOKEN_TEST;
        const payerEmail = isTestEnv ? "test_user_2695420795@testuser.com" : userEmail;

        const subscriptionClient = new PreApproval(client);
        const subscriptionBody = {
          reason: tituloPlano,
          payer_email: payerEmail,
          back_url: `${process.env.BASE_URL}/checkout/assinatura-status`,
          external_reference: assinaturaId,
          auto_recurring: {
            frequency: planoId === "PLANO_MENSAL" ? 1 : 12,
            frequency_type: "months",
            transaction_amount: valorRecorrente,
            currency_id: "BRL"
          },
          notification_url: `${process.env.BASE_URL}/api/pagamentos/webhook`
        };

        const result = await subscriptionClient.create({ body: subscriptionBody });
        const mpId = result.id || result.response?.id || null;

        if (mpId) {
          await pool.query("UPDATE assinaturas SET id_assinatura_mp = $1 WHERE id = $2", [mpId, assinaturaId]);
          console.log(`🔁 Assinatura recorrente criada com sucesso para ${assinaturaId}`);
        }
      } catch (err) {
        console.error("❌ Erro ao criar assinatura recorrente após pagamento único:", err);
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
