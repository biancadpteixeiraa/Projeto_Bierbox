// controllers/pagamentoController.js
const mercadopago = require("mercadopago");
const pool = require("../config/db"); // usa o mesmo padrão dos outros controllers

// configura o SDK (certifique-se que a var de ambiente existe no Render)
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN_TEST
});

const DEFAULT_NOTIFICATION_URL =
  process.env.MP_NOTIFICATION_URL || "https://projeto-bierbox.onrender.com/api/pagamentos/webhook";

exports.criarPreferencia = async (req, res) => {
  const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
  const utilizadorId = req.userId;

  try {
    // validações básicas
    if (!plano_id || !endereco_entrega_id || valor_frete === undefined || !box_id) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios faltando: plano_id, endereco_entrega_id, valor_frete, box_id" });
    }

    // verifica se o endereço pertence ao usuário
    const endRes = await pool.query(
      "SELECT id FROM enderecos WHERE id = $1 AND utilizador_id = $2",
      [endereco_entrega_id, utilizadorId]
    );
    if (endRes.rows.length === 0) {
      // retorna lista de endereços do usuário para ajudar
      const { rows: enderecos_disponiveis } = await pool.query(
        "SELECT id, rua, numero, bairro, cidade FROM enderecos WHERE utilizador_id = $1 ORDER BY is_padrao DESC",
        [utilizadorId]
      );
      return res.status(400).json({
        success: false,
        message: `endereco_entrega_id ${endereco_entrega_id} não encontrado para o usuário.`,
        suggestion: "Use um endereco_entrega_id válido pertencente ao usuário (veja enderecos_disponiveis).",
        enderecos_disponiveis
      });
    }

    // pega dados da box para calcular preço do plano
    const boxRes = await pool.query("SELECT * FROM boxes WHERE id = $1", [box_id]);
    if (boxRes.rows.length === 0) {
      return res.status(400).json({ success: false, message: "box_id inválido (box não encontrada)." });
    }
    const box = boxRes.rows[0];

    // define valor_assinatura a partir da box + plano
    let valor_assinatura;
    if (plano_id === "PLANO_MENSAL") {
      valor_assinatura = parseFloat(box.preco_mensal_4_un) || 0;
    } else if (plano_id === "PLANO_ANUAL") {
      valor_assinatura = parseFloat(box.preco_anual_4_un) || 0;
    } else {
      return res.status(400).json({ success: false, message: "plano_id inválido." });
    }

    const valorTotal = Number(valor_assinatura) + Number(valor_frete);

    // pega email/nome do usuário (para payer)
    const userRes = await pool.query("SELECT email, nome_completo FROM users WHERE id = $1", [utilizadorId]);
    const user = userRes.rows[0] || {};
    const payerEmail = user.email || `user_${utilizadorId}@example.com`;
    const payerName = user.nome_completo || "";

    // Inicia transação para criar assinatura + pedido
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertAss = await client.query(
        `INSERT INTO assinaturas 
         (utilizador_id, plano_id, status, box_id, valor_frete, valor_assinatura, endereco_entrega_id, criado_em, atualizado_em)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
         RETURNING id`,
        [utilizadorId, plano_id, "PENDENTE", box_id, valor_frete, valor_assinatura, endereco_entrega_id]
      );

      const assinaturaId = insertAss.rows[0].id;

      const insertPedido = await client.query(
        `INSERT INTO pedidos
         (assinatura_id, endereco_entrega_id, status_pedido, valor_frete, valor_assinatura, valor_total, criado_em, atualizado_em)
         VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
         RETURNING id`,
        [assinaturaId, endereco_entrega_id, "PENDENTE", valor_frete, valor_assinatura, valorTotal]
      );

      const pedidoId = insertPedido.rows[0].id;

      // criar preferência no Mercado Pago
      const preference = {
        items: [
          {
            id: String(assinaturaId),
            title: plano_id === "PLANO_MENSAL" ? "BierBox - Assinatura Mensal" : "BierBox - Assinatura Anual",
            description: `Assinatura - Box ${box.nome || box_id}`,
            quantity: 1,
            unit_price: valorTotal,
            currency_id: "BRL"
          }
        ],
        payer: {
          email: payerEmail,
          name: payerName
        },
        external_reference: String(assinaturaId),
        back_urls: {
          success: process.env.MP_BACK_URL_SUCCESS || "https://projeto-bierbox.onrender.com/sucesso",
          failure: process.env.MP_BACK_URL_FAILURE || "https://projeto-bierbox.onrender.com/falha",
          pending: process.env.MP_BACK_URL_PENDING || "https://projeto-bierbox.onrender.com/pendente"
        },
        auto_return: "approved",
        notification_url: DEFAULT_NOTIFICATION_URL
      };

      const mpResponse = await mercadopago.preferences.create(preference);
      const checkoutUrl = mpResponse.body?.init_point || mpResponse.init_point || null;
      const preferenceId = mpResponse.body?.id || mpResponse.id || null;

      // opcional: guardar preferenceId (se quiser) no campo id_assinatura_mp ou outro campo
      // aqui NÃO sobrescrevemos id_assinatura_mp com payment id (webhook fará isso)
      await client.query(
        "UPDATE assinaturas SET atualizado_em = NOW() WHERE id = $1",
        [assinaturaId]
      );

      await client.query("COMMIT");

      return res.status(201).json({
        success: true,
        message: "Preferência criada com sucesso.",
        checkoutUrl,
        assinaturaId,
        pedidoId,
        preferenceId
      });
    } catch (txErr) {
      await client.query("ROLLBACK");
      console.error("[PAY] Erro na transacao ao criar preferencia:", txErr);
      return res.status(500).json({ success: false, message: "Erro ao processar pagamento (transação).", erro: txErr.message });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    res.status(500).json({ success: false, message: "Erro no servidor ao criar preferência de pagamento.", erro: error.message });
  }
};

// Recebe webhook do Mercado Pago
exports.receberWebhook = async (req, res) => {
  // O index.js já pula o parse JSON para esta rota (raw), mas aqui lidamos com os casos
  const body = req.body || {};
  console.log("🔍 Webhook recebido:", body);

  try {
    // O Mercado Pago pode enviar formatos diferentes; vamos tentar extrair o payment id
    const paymentId = body.data?.id || body.id || body.resource || (body.action === "payment.created" && body.data?.id) || null;

    // se o payload for do tipo {topic: 'payment', id: <id>}:
    const idFromTopic = body.id || (body.resource && Number(body.resource)) || null;
    const finalPaymentId = (paymentId && Number(paymentId)) || (idFromTopic && Number(idFromTopic)) || null;

    if (!finalPaymentId) {
      // pode ser merchant_order ou outro tipo, apenas retorna OK
      return res.status(200).send("Webhook recebido.");
    }

    // buscar detalhes do pagamento no MP
    const mpPayment = await mercadopago.payment.findById(finalPaymentId).catch(err => {
      // algumas versões usam mercadopago.payment.get, fallback:
      return mercadopago.payment.get ? mercadopago.payment.get(finalPaymentId) : null;
    });

    const paymentDetails = mpPayment?.response || mpPayment?.body || mpPayment || null;
    console.log("🔍 Detalhes do Pagamento:", paymentDetails);

    if (!paymentDetails) {
      return res.status(200).send("Pagamento recebido, mas não foi possível buscar detalhes.");
    }

    if (paymentDetails.status === "approved" || paymentDetails.status === "paid" || paymentDetails.status === "authorized") {
      const externalReference = paymentDetails.external_reference || paymentDetails.external_reference;
      if (externalReference) {
        const assinaturaId = parseInt(externalReference, 10);
        if (!Number.isNaN(assinaturaId)) {
          // Atualiza assinatura e pedido
          await pool.query(
            "UPDATE assinaturas SET status = 'ATIVA', id_assinatura_mp = $1, atualizado_em = NOW() WHERE id = $2",
            [paymentDetails.id || finalPaymentId, assinaturaId]
          );

          // atualiza pedido mais recente referente a essa assinatura
          await pool.query(
            `UPDATE pedidos SET status_pedido = 'PAGO', data_pagamento = NOW(), atualizado_em = NOW() 
             WHERE assinatura_id = $1 AND status_pedido = 'PENDENTE'`,
            [assinaturaId]
          );

          console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA.`);
        }
      }
    }

    res.status(200).send("Webhook processado com sucesso.");
  } catch (err) {
    console.error("Erro no webhook:", err);
    res.status(500).send("Erro ao processar webhook.");
  }
};
