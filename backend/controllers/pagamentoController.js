const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const pool = require("../config/db");

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN_TEST,
});

// Criar preferência de pagamento
exports.criarPreferencia = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
    const utilizadorId = req.userId;

    if (!plano_id || !endereco_entrega_id || valor_frete === undefined || !box_id) {
      return res.status(400).json({ message: "Dados insuficientes para criar o pagamento." });
    }

    const userResult = await pool.query(
      "SELECT email, nome_completo FROM users WHERE id = $1",
      [utilizadorId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }
    const userEmail = userResult.rows[0].email;
    const userName = userResult.rows[0].nome_completo;

    // Preço base do plano
    let preco_plano;
    let titulo_plano;
    if (plano_id === "PLANO_MENSAL") {
      preco_plano = 80.0;
      titulo_plano = "BierBox - Assinatura Mensal";
    } else if (plano_id === "PLANO_ANUAL") {
      preco_plano = 70.0;
      titulo_plano = "BierBox - Assinatura Anual";
    } else {
      return res.status(400).json({ message: "plano_id inválido." });
    }

    const valor_total = preco_plano + parseFloat(valor_frete);

    // Criar assinatura no banco
    const novaAssinatura = await pool.query(
      `INSERT INTO assinaturas (utilizador_id, plano_id, status, criado_em, atualizado_em) 
       VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id`,
      [utilizadorId, plano_id, "PENDENTE"]
    );
    const assinaturaId = novaAssinatura.rows[0].id;

    // Criar pedido vinculado
    await pool.query(
      `INSERT INTO pedidos (assinatura_id, endereco_entrega, status_pedido, valor_frete, valor_assinatura, valor_total, criado_em, atualizado_em, box_id) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), $7)`,
      [assinaturaId, endereco_entrega_id, "AGUARDANDO_PAGAMENTO", valor_frete, preco_plano, valor_total, box_id]
    );

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
        success: "https://www.google.com/sucesso",
        failure: "https://www.google.com/falha",
        pending: "https://www.google.com/pendente",
      },
      auto_return: "approved",
    };

    const result = await preference.create({ body: preferenceBody });
    res.status(201).json({ checkoutUrl: result.init_point });

  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    res.status(500).json({ message: "Erro no servidor ao criar preferência de pagamento." });
  }
};

// Webhook Mercado Pago
exports.receberWebhook = async (req, res) => {
  const body = req.body;
  console.log("🚨 Webhook disparado pelo Mercado Pago!");
  console.log("Body recebido:", body);

  try {
    if (body.type === "payment" || body.topic === "payment") {
      const paymentClient = new Payment(client);
      const paymentDetails = await paymentClient.get({ id: body.data?.id || body.resource });

      console.log("🔍 Detalhes do Pagamento:", paymentDetails);

      if (paymentDetails.status === "approved" && paymentDetails.external_reference) {
        const assinaturaId = parseInt(paymentDetails.external_reference, 10);

        // Atualiza assinatura
        await pool.query(
          "UPDATE assinaturas SET status = 'ATIVA', id_assinatura_mp = $1, atualizado_em = NOW() WHERE id = $2",
          [paymentDetails.id, assinaturaId]
        );

        // Atualiza pedido vinculado
        await pool.query(
          "UPDATE pedidos SET status_pedido = 'PAGO', data_pagamento = NOW(), atualizado_em = NOW() WHERE assinatura_id = $1",
          [assinaturaId]
        );

        console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA.`);
      }
    }

    res.status(200).send("Webhook recebido com sucesso.");
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).send("Erro interno no servidor ao processar webhook.");
  }
};
