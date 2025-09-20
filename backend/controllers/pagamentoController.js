// controllers/pagamentoController.js
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const pool = require("../config/db");

// Cliente Mercado Pago (usa token de teste se presente)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN_TEST || process.env.MP_ACCESS_TOKEN,
});

// =======================
// criarPreferencia
// =======================
exports.criarPreferencia = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
    const utilizadorId = req.userId;

    // validação básica
    if (!plano_id || endereco_entrega_id === undefined || valor_frete === undefined || !box_id) {
      return res.status(400).json({
        success: false,
        message: "Dados insuficientes. Envie plano_id, endereco_entrega_id, valor_frete e box_id."
      });
    }

    // buscar usuário
    const userRes = await pool.query("SELECT id, email, nome_completo FROM users WHERE id = $1", [utilizadorId]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
    }
    const userEmail = userRes.rows[0].email;
    const userName = userRes.rows[0].nome_completo;

    // verificar se endereco existe (evita FK violation)
    const endRes = await pool.query("SELECT id FROM enderecos WHERE id = $1 AND utilizador_id = $2", [endereco_entrega_id, utilizadorId]);
    if (endRes.rowCount === 0) {
      // listar endereços do usuário para sugestão
      const lista = await pool.query("SELECT id, rua, numero, cidade, estado, cep FROM enderecos WHERE utilizador_id = $1", [utilizadorId]);
      return res.status(400).json({
        success: false,
        message: `endereco_entrega_id ${endereco_entrega_id} não encontrado para o usuário.`,
        suggestion: "Use um endereco_entrega_id válido pertencente ao usuário (veja enderecos_disponiveis).",
        enderecos_disponiveis: lista.rows
      });
    }

    // determinar preço do plano
    let preco_plano;
    let titulo_plano;
    if (plano_id === "PLANO_MENSAL") {
      preco_plano = 80.0;
      titulo_plano = "BierBox - Assinatura Mensal";
    } else if (plano_id === "PLANO_ANUAL") {
      preco_plano = 70.0;
      titulo_plano = "BierBox - Assinatura Anual";
    } else {
      return res.status(400).json({ success: false, message: "plano_id inválido." });
    }

    const valor_assinatura = preco_plano;
    const valor_total = parseFloat(valor_assinatura) + parseFloat(valor_frete || 0);

    // inserir assinatura (com box_id)
    const insertAssinSQL = `
      INSERT INTO assinaturas
        (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, criado_em, atualizado_em)
      VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
      RETURNING id
    `;
    const assinRes = await pool.query(insertAssinSQL, [
      utilizadorId,
      plano_id,
      "PENDENTE",
      endereco_entrega_id,
      valor_frete,
      valor_assinatura,
      box_id
    ]);
    const assinaturaId = assinRes.rows[0].id;
    console.log(`[PAY] Nova assinatura criada: id=${assinaturaId} (usuario=${utilizadorId})`);

    // inserir pedido inicial (sem box_id — seu schema não tem box_id em pedidos)
    const insertPedidoSQL = `
      INSERT INTO pedidos
        (assinatura_id, endereco_entrega_id, status_pedido, valor_frete, valor_assinatura, valor_total, criado_em, atualizado_em)
      VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
      RETURNING id
    `;
    const novoPedido = await pool.query(insertPedidoSQL, [
      assinaturaId,
      endereco_entrega_id,
      "AGUARDANDO_PAGAMENTO",
      valor_frete,
      valor_assinatura,
      valor_total
    ]);
    console.log(`[PAY] Pedido inicial criado: id=${novoPedido.rows[0].id} (assinatura=${assinaturaId})`);

    // criar preferência no Mercado Pago (notification_url)
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
        success: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/pagamento/sucesso` : "https://projeto-bierbox.onrender.com/sucesso",
        failure: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/pagamento/falha` : "https://projeto-bierbox.onrender.com/falha",
        pending: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/pagamento/pendente` : "https://projeto-bierbox.onrender.com/pendente",
      },
      auto_return: "approved",
      notification_url: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/pagamentos/webhook` : "https://projeto-bierbox.onrender.com/api/pagamentos/webhook",
    };

    const result = await preference.create({ body: preferenceBody });

    // escolher init_point / sandbox conforme retorno
    const checkoutUrl = result.init_point || result.body?.init_point || result.sandbox_init_point || result.body?.sandbox_init_point;

    console.log(`[PAY] Preferência criada para assinatura=${assinaturaId}. checkoutUrl=${checkoutUrl}`);

    return res.status(201).json({ success: true, checkoutUrl, assinaturaId });
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    return res.status(500).json({ success: false, message: "Erro no servidor ao criar preferência de pagamento." });
  }
};

// =======================
// receberWebhook
// =======================
exports.receberWebhook = async (req, res) => {
  try {
    console.log("🚨 Webhook disparado pelo Mercado Pago!");
    console.log("Body recebido (parcial):", typeof req.body === "object" ? JSON.stringify(req.body).slice(0,2000) : req.body);

    const body = req.body;

    // identificar payment id (várias formas)
    let paymentId = null;
    if (body.data && body.data.id) paymentId = body.data.id;
    else if (body.resource && typeof body.resource === "string" && /^\d+$/.test(body.resource)) paymentId = body.resource;
    else if (body.resource && body.resource.id) paymentId = body.resource.id;
    else if (body.id) paymentId = body.id;

    if (!paymentId) {
      console.warn("[PAY] Webhook recebido sem payment id válido. Ignorando.");
      return res.status(200).send("No payment id");
    }

    // buscar detalhes do pagamento via client
    const paymentClient = new Payment(client);
    const paymentDetails = await paymentClient.get({ id: paymentId });
    const payment = paymentDetails.body || paymentDetails;
    console.log("🔍 Detalhes do Pagamento (chave/id/status):", payment.id, payment.status);

    const status = payment.status || payment.payment_status;
    const externalRef = payment.external_reference || payment.externalReference || payment.order?.external_reference;

    if ((status === "approved" || status === "authorized") && externalRef) {
      const assinaturaId = parseInt(externalRef, 10);
      const mpId = payment.id || null;

      // atualizar assinatura
      await pool.query(
        `UPDATE assinaturas
         SET status = 'ATIVA', id_assinatura_mp = $1, data_inicio = COALESCE(data_inicio, NOW()), atualizado_em = NOW()
         WHERE id = $2`,
        [mpId, assinaturaId]
      );
      console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA (mp_id=${mpId}).`);

      // atualizar pedidos pendentes
      const upd = await pool.query(
        `UPDATE pedidos
         SET status_pedido = 'PAGO', data_pagamento = NOW(), atualizado_em = NOW()
         WHERE assinatura_id = $1 AND status_pedido IN ('AGUARDANDO_PAGAMENTO', 'PROCESSANDO')`,
        [assinaturaId]
      );

      if (upd.rowCount > 0) {
        console.log(`[PAY] ${upd.rowCount} pedido(s) atualizados para PAGO para assinatura ${assinaturaId}.`);
      } else {
        // fallback: criar pedido se não houver pedido atualizável
        const assinRow = await pool.query("SELECT endereco_entrega_id, valor_frete, valor_assinatura FROM assinaturas WHERE id = $1", [assinaturaId]);
        const assin = assinRow.rows[0] || {};
        const valorF = assin.valor_frete || 0;
        const valorA = assin.valor_assinatura || 0;
        const total = parseFloat(valorF) + parseFloat(valorA);

        // criar pedido fallback (sem box_id)
        const novo = await pool.query(
          `INSERT INTO pedidos (assinatura_id, endereco_entrega_id, status_pedido, valor_frete, valor_assinatura, valor_total, data_pagamento, criado_em, atualizado_em)
           VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW(),NOW()) RETURNING id`,
          [assinaturaId, assin.endereco_entrega_id || null, "PAGO", valorF, valorA, total]
        );
        console.log(`[PAY] Pedido fallback criado id=${novo.rows[0].id} para assinatura ${assinaturaId}.`);
      }
    }

    return res.status(200).send("Webhook processado");
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).send("Erro interno no webhook");
  }
};
