// controllers/pagamentoController.js
const { MercadoPagoConfig, PreApproval, Payment } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

// Inicializa o client do Mercado Pago com prioridade para token de produção
const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN_TEST;
const client = new MercadoPagoConfig({ accessToken: mpAccessToken });

// helpers
function getBaseUrl() {
  const base = (process.env.BASE_URL || "").replace(/\/+$/, ""); // remove trailing slash
  return base || `http://localhost:${process.env.PORT || 4000}`;
}

const criarAssinatura = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
    const utilizadorId = req.userId;

    // validações básicas
    if (!isUuid(endereco_entrega_id) || (box_id && !isUuid(box_id))) {
      return res.status(400).json({ message: "ID de endereço ou box inválido." });
    }
    if (!plano_id || valor_frete === undefined) {
      return res.status(400).json({ message: "Dados insuficientes para criar a assinatura." });
    }

    // Busca dados do usuário
    const userResult = await pool.query("SELECT email, nome_completo FROM users WHERE id = $1", [utilizadorId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }
    const userEmail = userResult.rows[0].email;
    const userName = userResult.rows[0].nome_completo;

    // Define preço base do plano
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

    // Valor final (fixo para toda a recorrência)
    const valor_total_recorrente = Number(preco_plano) + Number(parseFloat(valor_frete || 0));

    // 1) cria assinatura no BD com status PENDENTE e pega o id
    const insertResult = await pool.query(
      `INSERT INTO assinaturas
        (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW(),NOW()) RETURNING id`,
      [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
    );
    const assinaturaId = insertResult.rows[0].id.toString();

    // 2) monta o body para PreApproval (assinatura recorrente)
    const baseUrl = getBaseUrl();
    if (!baseUrl.startsWith("http")) {
    console.error("BASE_URL inválida:", baseUrl);
    return res.status(500).json({ message: "Configuração de BASE_URL inválida no servidor." });
    }

    // Detecta se está usando token de teste
    const isTestEnv = mpAccessToken === process.env.MP_ACCESS_TOKEN_TEST;

    // Define email do pagador conforme ambiente
    const payerEmail = isTestEnv ? "test_user_2695420795@testuser.com" : userEmail;

    const subscriptionBody = {
    reason: titulo_plano,
    payer_email: payerEmail, // ← campo direto, não dentro de "payer"
    external_reference: assinaturaId,
    auto_recurring: {
        frequency: plano_id === "PLANO_MENSAL" ? 1 : 12,
        frequency_type: "months",
        transaction_amount: Number(valor_total_recorrente),
        currency_id: "BRL"
    },
    notification_url: `${baseUrl}/api/pagamentos/webhook`
    };


    // 3) cria a assinatura no Mercado Pago via PreApproval
    const subscriptionClient = new PreApproval(client);
    const result = await subscriptionClient.create({ body: subscriptionBody });

    // result deve conter id e init_point (URL para checkout de autorização)
    const mpId = result.id || result.response?.id || null;
    const initPoint = result.init_point || result.response?.init_point || result.response?.sandbox_init_point || null;

    // 4) atualiza o registro local com id do MP (não altera status; aguarda webhook)
    if (mpId) {
      await pool.query("UPDATE assinaturas SET id_assinatura_mp = $1, atualizado_em = NOW() WHERE id = $2", [mpId, assinaturaId]);
    }

    // 5) retorna para o frontend a URL para o usuário autorizar o débito (init_point)
    return res.status(201).json({
      checkoutUrl: initPoint,
      assinaturaId,
      mercadoPagoId: mpId
    });

  } catch (error) {
    console.error("Erro ao criar assinatura recorrente:", error);
    // repassar mensagens úteis se vierem do MP
    if (error?.message) {
      return res.status(500).json({ message: "Erro no servidor ao criar assinatura recorrente.", details: error.message });
    }
    return res.status(500).json({ message: "Erro no servidor ao criar assinatura recorrente." });
  }
};

const receberWebhook = async (req, res) => {
  console.log("🚨 Webhook disparado pelo Mercado Pago!");
  console.log("Body recebido:", req.body);

  const { type, data } = req.body; // o MP envia fields variados dependendo do evento

  try {
    // Evento para pagamentos pontuais (caso ainda use)
    if (type === "payment") {
      const paymentClient = new Payment(client);
      const paymentDetails = await paymentClient.get({ id: data.id });

      console.log("🔍 Detalhes do Pagamento (Webhook Payment):", paymentDetails);

      if ((paymentDetails.status === "approved" || paymentDetails.status === "approved") && paymentDetails.external_reference) {
        const assinaturaId = paymentDetails.external_reference;
        if (!isUuid(assinaturaId)) {
          console.error("external_reference inválida:", assinaturaId);
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

        console.log(`Assinatura ${assinaturaId} atualizada para ATIVA via payment webhook.`);
      }
    }

    // Evento de preapproval (assinatura)
    if (type === "preapproval") {
      // dependendo do payload do MP, 'data' pode trazer um id de preapproval ou preapproval.id
      const preapprovalId = data?.id || data?.preapproval_id || data?.preapproval?.id;
      if (!preapprovalId) {
        console.log("preapproval sem id no payload:", data);
        return res.status(200).send("OK");
      }

      const subscriptionClient = new PreApproval(client);
      const subscriptionDetails = await subscriptionClient.get({ id: preapprovalId });

      console.log("🔍 Detalhes da Assinatura (Webhook Preapproval):", subscriptionDetails);

      // exemplo de status: 'authorized', 'cancelled', 'paused', 'inactive', etc.
      const status = subscriptionDetails.status || subscriptionDetails.response?.status;

      const externalRef = subscriptionDetails.external_reference || subscriptionDetails.response?.external_reference;
      if (!externalRef || !isUuid(externalRef)) {
        console.error("external_reference inválida no preapproval:", externalRef);
        return res.status(200).send("Webhook processado com erro de referência.");
      }

      if (status === "authorized" || status === "active") {
        await pool.query(
          "UPDATE assinaturas SET status = 'ATIVA', id_assinatura_mp = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id = $2",
          [preapprovalId, externalRef]
        );
        console.log(`Assinatura ${externalRef} atualizada para ATIVA via preapproval webhook.`);
      } else if (status === "cancelled") {
        await pool.query(
          "UPDATE assinaturas SET status = 'CANCELADA', data_cancelamento = CURRENT_TIMESTAMP, atualizado_em = CURRENT_TIMESTAMP WHERE id = $1",
          [externalRef]
        );
        console.log(`Assinatura ${externalRef} atualizada para CANCELADA via preapproval webhook.`);
      } else {
        console.log(`Preapproval ${preapprovalId} com status ${status} recebido; ação não definida.`);
      }
    }

    // Responder sempre 200 para Mercado Pago
    return res.status(200).send("Webhook recebido com sucesso.");
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return res.status(500).send("Erro interno no servidor ao processar webhook.");
  }
};

module.exports = {
  criarAssinatura,
  receberWebhook
};
