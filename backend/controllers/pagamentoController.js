// controllers/pagamentoController.js
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const pool = require("../config/db");

// Inicializa cliente Mercado Pago (usa token de teste se presente)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN_TEST || process.env.MP_ACCESS_TOKEN,
});

// Helper: verifica se coluna existe na tabela (schema public)
async function columnExists(tableName, columnName) {
  const q = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2
    LIMIT 1
  `;
  const r = await pool.query(q, [tableName, columnName]);
  return r.rowCount > 0;
}

// =======================
// criarPreferencia
// =======================
exports.criarPreferencia = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
    const utilizadorId = req.userId;

    // validações básicas
    if (!plano_id || endereco_entrega_id === undefined || valor_frete === undefined || !box_id) {
      return res.status(400).json({
        success: false,
        message: "Dados insuficientes. Envie plano_id, endereco_entrega_id, valor_frete e box_id."
      });
    }

    // verificar usuário
    const userResult = await pool.query("SELECT id, email, nome_completo FROM users WHERE id = $1", [utilizadorId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
    }
    const { email: userEmail, nome_completo: userName } = userResult.rows[0];

    // checar se endereco existe (evita FK violation)
    const endRes = await pool.query("SELECT id FROM enderecos WHERE id = $1", [endereco_entrega_id]);
    if (endRes.rowCount === 0) {
      // lista endereços do usuário para ajudar o front a escolher correto
      const lista = await pool.query("SELECT id, rua, numero, cidade, estado, cep FROM enderecos WHERE utilizador_id = $1", [utilizadorId]);
      return res.status(400).json({
        success: false,
        message: `endereco_entrega_id ${endereco_entrega_id} não encontrado.`,
        suggestion: "Use um endereco_entrega_id válido pertencente ao usuário.",
        enderecos_disponiveis: lista.rows
      });
    }

    // determinar preço do plano (fallbacks)
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

    // Inserir assinatura (com campos extras)
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

    // Inserir pedido inicial (pedidos tem endereco_entrega_id no seu schema)
    const insertPedidoSQL = `
      INSERT INTO pedidos
        (assinatura_id, endereco_entrega_id, status_pedido, valor_frete, valor_assinatura, valor_total, criado_em, atualizado_em, box_id)
      VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW(),$7)
      RETURNING id
    `;
    const novoPedido = await pool.query(insertPedidoSQL, [
      assinaturaId,
      endereco_entrega_id,
      "AGUARDANDO_PAGAMENTO",
      valor_frete,
      valor_assinatura,
      valor_total,
      box_id
    ]);
    console.log(`[PAY] Pedido inicial criado: id=${novoPedido.rows[0].id} (assinatura=${assinaturaId})`);

    // Criar preferência no Mercado Pago (notification_url aponta pro webhook)
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

    // escolher sandbox_init_point quando apropriado
    const checkoutUrl = (process.env.NODE_ENV === "production")
      ? (result.init_point || result.body?.init_point)
      : (result.sandbox_init_point || result.init_point || result.body?.sandbox_init_point || result.body?.init_point);

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
    console.log("Body recebido:", typeof req.body === "object" ? JSON.stringify(req.body).slice(0,2000) : req.body);

    const body = req.body;

    // Determinar id do pagamento
    let paymentId = null;
    if (body.data && body.data.id) paymentId = body.data.id;
    else if (body.resource && typeof body.resource === "string" && /^\d+$/.test(body.resource)) paymentId = body.resource;
    else if (body.resource && body.resource.id) paymentId = body.resource.id;
    else if (body.id) paymentId = body.id;

    if (!paymentId) {
      console.warn("[PAY] Webhook sem payment id válido. Ignorando.");
      return res.status(200).send("No payment id");
    }

    // Buscar detalhes do pagamento via client
    const paymentClient = new Payment(client);
    const paymentDetails = await paymentClient.get({ id: paymentId });
    const payment = paymentDetails.body || paymentDetails;
    console.log("🔍 Detalhes do Pagamento (parcial log):", (payment.id ? `id=${payment.id}` : "sem id"), `status=${payment.status}`);

    // extrair status e external reference
    const status = payment.status || payment.payment_status;
    const externalRef = payment.external_reference || payment.externalReference || payment.order?.external_reference;

    if ((status === "approved" || status === "authorized") && externalRef) {
      const assinaturaId = parseInt(externalRef, 10);

      // Atualiza assinatura (id_assinatura_mp e status)
      const mpId = payment.id || payment.transaction_id || null;
      await pool.query(
        `UPDATE assinaturas
         SET status = 'ATIVA', id_assinatura_mp = $1, data_inicio = COALESCE(data_inicio, NOW()), atualizado_em = NOW()
         WHERE id = $2`,
        [mpId, assinaturaId]
      );
      console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA (mp_id=${mpId}).`);

      // Atualiza pedidos vinculados
      const upd = await pool.query(
        `UPDATE pedidos
         SET status_pedido = 'PAGO', data_pagamento = NOW(), atualizado_em = NOW()
         WHERE assinatura_id = $1 AND status_pedido IN ('AGUARDANDO_PAGAMENTO', 'PROCESSANDO')`,
        [assinaturaId]
      );

      if (upd.rowCount > 0) {
        console.log(`[PAY] ${upd.rowCount} pedido(s) atualizados para PAGO para assinatura ${assinaturaId}.`);
      } else {
        // fallback: criar pedido se não houver pedidos atualizáveis
        const assinRow = await pool.query(
          `SELECT endereco_entrega_id, valor_frete, valor_assinatura, box_id FROM assinaturas WHERE id = $1`,
          [assinaturaId]
        );
        const assin = assinRow.rows[0] || {};
        const valorF = assin.valor_frete || 0;
        const valorA = assin.valor_assinatura || 0;
        const total = parseFloat(valorF) + parseFloat(valorA);

        // criar com endereco_entrega_id (se existir)
        if (assin.endereco_entrega_id) {
          const novo = await pool.query(
            `INSERT INTO pedidos (assinatura_id, endereco_entrega_id, status_pedido, valor_frete, valor_assinatura, valor_total, data_pagamento, criado_em, atualizado_em, box_id)
             VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW(),NOW(),$7) RETURNING id`,
            [assinaturaId, assin.endereco_entrega_id, "PAGO", valorF, valorA, total, assin.box_id || null]
          );
          console.log(`[PAY] Pedido fallback criado id=${novo.rows[0].id} para assinatura ${assinaturaId}.`);
        } else {
          const novo = await pool.query(
            `INSERT INTO pedidos (assinatura_id, status_pedido, valor_frete, valor_assinatura, valor_total, data_pagamento, criado_em, atualizado_em, box_id)
             VALUES ($1,$2,$3,$4,$5,NOW(),NOW(),NOW(),$6) RETURNING id`,
            [assinaturaId, "PAGO", valorF, valorA, total, assin.box_id || null]
          );
          console.log(`[PAY] Pedido fallback simples criado id=${novo.rows[0].id} para assinatura ${assinaturaId}.`);
        }
      }
    }

    return res.status(200).send("Webhook processado");
  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).send("Erro interno no webhook");
  }
};
