// controllers/pagamentoController.js
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const pool = require("../config/db");

// Inicializa cliente Mercado Pago (usa test token ou token normal)
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

// Criar preferência de pagamento
exports.criarPreferencia = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
    const utilizadorId = req.userId;

    // validações básicas
    if (!plano_id || endereco_entrega_id === undefined || valor_frete === undefined || !box_id) {
      return res.status(400).json({ message: "Dados insuficientes para criar o pagamento. Envie plano_id, endereco_entrega_id, valor_frete e box_id." });
    }

    // buscar email/nome do usuário
    const userResult = await pool.query("SELECT email, nome_completo FROM users WHERE id = $1", [utilizadorId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }
    const userEmail = userResult.rows[0].email;
    const userName = userResult.rows[0].nome_completo;

    // determinar preço do plano (fallbacks seguros)
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

    const valor_assinatura = preco_plano;
    const valor_total = parseFloat(valor_assinatura) + parseFloat(valor_frete || 0);

    // 1) Criar assinatura (com campos extras)
    const insertAssin = `
      INSERT INTO assinaturas
        (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, criado_em, atualizado_em)
      VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),NOW())
      RETURNING id
    `;
    const assinRes = await pool.query(insertAssin, [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, valor_assinatura, box_id]);
    const assinaturaId = assinRes.rows[0].id;
    console.log(`[PAY] Nova assinatura criada: id=${assinaturaId} (usuario=${utilizadorId})`);

    // 2) Criar pedido inicial — mas antes detectar o nome da coluna de endereço em pedidos
    const hasEnderecoId = await columnExists("pedidos", "endereco_entrega_id");
    const hasEnderecoText = await columnExists("pedidos", "endereco_entrega");
    const hasBoxIdInPedidos = await columnExists("pedidos", "box_id");

    // prepara colunas/valores dinamicamente
    const pedidoCols = ["assinatura_id", "status_pedido", "valor_frete", "valor_assinatura", "valor_total", "criado_em", "atualizado_em"];
    const pedidoVals = [assinaturaId, "AGUARDANDO_PAGAMENTO", valor_frete, valor_assinatura, valor_total];
    const placeholders = [];

    // montar placeholders dinâmicos ($1, $2, ...)
    // vamos construir valores para inserir; os placeholders serão ajustados abaixo
    // inserir coluna de endereco: se existir campo_id usamos o id, se existir campo texto, buscamos o texto do endereco para inserir
    if (hasEnderecoId) {
      pedidoCols.unshift("endereco_entrega_id"); // na posição 0
      pedidoVals.unshift(endereco_entrega_id);
    } else if (hasEnderecoText) {
      // buscar endereco em formato texto
      const endRow = await pool.query("SELECT rua, numero, complemento, bairro, cidade, estado, cep FROM enderecos WHERE id = $1", [endereco_entrega_id]);
      let enderecoTexto = null;
      if (endRow.rows.length > 0) {
        const e = endRow.rows[0];
        enderecoTexto = `${e.rua || ''} ${e.numero || ''} ${e.complemento || ''} - ${e.bairro || ''} - ${e.cidade || ''}/${e.estado || ''} - ${e.cep || ''}`.replace(/\s+/g, ' ').trim();
      }
      pedidoCols.unshift("endereco_entrega");
      pedidoVals.unshift(enderecoTexto);
    } else {
      // não existe coluna de endereço na tabela pedidos — só logar e continuar sem endereço
      console.warn("[PAY] tabela 'pedidos' não tem coluna 'endereco_entrega_id' nem 'endereco_entrega'. O pedido será criado sem campo de endereço.");
    }

    // incluir box_id no pedido se coluna existir
    if (hasBoxIdInPedidos) {
      pedidoCols.push("box_id");
      pedidoVals.push(box_id);
    }

    // agora montar placeholders
    for (let i = 1; i <= pedidoVals.length; i++) placeholders.push(`$${i}`);

    // construir SQL dinâmico
    const insertPedidoSQL = `
      INSERT INTO pedidos (${pedidoCols.join(", ")})
      VALUES (${placeholders.join(", ")}, NOW(), NOW())
      RETURNING id
    `;

    // OBS: já adicionamos data create/update via NOW() manualmente no SQL concatenado -> evitar duplicar
    // No entanto, o pedidoCols inclui criado_em/atualizado_em? Não — já concatenamos NOW() no SQL, garantimos consistência.
    // Vamos ajustar: na query acima adicionamos duas colunas cridas e atualizadas via SQL; por isso precisamos ter placeholders length == pedidoVals length.
    // EXECUTE:
    const insertPedidoQuery = insertPedidoSQL;
    const novoPedido = await pool.query(insertPedidoQuery, pedidoVals);
    console.log(`[PAY] Pedido inicial criado: id=${novoPedido.rows[0].id} (assinatura=${assinaturaId})`);

    // 3) Criar preferência no Mercado Pago
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
    // escolher sandbox_init_point quando não estiver em production
    const checkoutUrl = (process.env.NODE_ENV === "production")
      ? (result.init_point || result.body?.init_point)
      : (result.sandbox_init_point || result.init_point || result.body?.sandbox_init_point || result.body?.init_point);

    console.log(`[PAY] Preferência criada para assinatura=${assinaturaId}. checkoutUrl=${checkoutUrl}`);

    return res.status(201).json({ checkoutUrl, assinaturaId });
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    return res.status(500).json({ message: "Erro no servidor ao criar preferência de pagamento." });
  }
};

// Webhook Mercado Pago
exports.receberWebhook = async (req, res) => {
  try {
    console.log("🚨 Webhook disparado pelo Mercado Pago!");
    console.log("Body recebido:", req.body);

    const body = req.body;

    // Determinar id do pagamento (várias formas de payload)
    let paymentId = null;
    if (body.data && body.data.id) paymentId = body.data.id;
    else if (body.resource && typeof body.resource === "string" && /^\d+$/.test(body.resource)) paymentId = body.resource;
    else if (body.resource && body.resource.id) paymentId = body.resource.id;
    else if (body.id) paymentId = body.id;

    if (!paymentId) {
      console.warn("[PAY] Webhook recebido sem payment id válido. Ignorando.");
      return res.status(200).send("No payment id");
    }

    // Buscar detalhes do pagamento via client
    const paymentClient = new Payment(client);
    const paymentDetails = await paymentClient.get({ id: paymentId });
    const payment = paymentDetails.body || paymentDetails; // pode estar em .body ou já descompactado
    console.log("🔍 Detalhes do Pagamento:", payment);

    const status = payment.status || payment.payment_status;
    const externalRef = payment.external_reference || payment.externalReference || payment.order?.external_reference;

    if ((status === "approved" || status === "authorized") && externalRef) {
      const assinaturaId = parseInt(externalRef, 10);

      // Atualiza assinatura para ATIVA e grava id do MP
      const mpId = payment.id || payment.transaction_id || payment.payment_id;
      await pool.query(
        `UPDATE assinaturas
         SET status = 'ATIVA', id_assinatura_mp = $1, data_inicio = COALESCE(data_inicio, NOW()), atualizado_em = NOW()
         WHERE id = $2`,
        [mpId, assinaturaId]
      );

      console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA (mp_id=${mpId}).`);

      // Atualiza pedidos vinculados pendentes para PAGO (se existirem)
      const upd = await pool.query(
        `UPDATE pedidos
         SET status_pedido = 'PAGO', data_pagamento = NOW(), atualizado_em = NOW()
         WHERE assinatura_id = $1 AND status_pedido IN ('AGUARDANDO_PAGAMENTO', 'PROCESSANDO')`,
        [assinaturaId]
      );

      if (upd.rowCount > 0) {
        console.log(`[PAY] ${upd.rowCount} pedido(s) atualizados para PAGO para assinatura ${assinaturaId}.`);
      } else {
        // Se nenhum pedido foi atualizado, cria um pedido (fallback)
        // Verifica se tabela pedidos utiliza endereco_entrega_id ou endereco_entrega
        const hasEnderecoId = await columnExists("pedidos", "endereco_entrega_id");
        const hasEnderecoText = await columnExists("pedidos", "endereco_entrega");

        // Tenta recuperar campos da assinatura para criar pedido
        const assinRow = await pool.query("SELECT endereco_entrega_id, valor_frete, valor_assinatura, box_id FROM assinaturas WHERE id = $1", [assinaturaId]);
        const assin = assinRow.rows[0] || {};
        let enderecoValor = null;

        if (hasEnderecoId) {
          // criamos pedido com endereco_entrega_id
          const cols = ["assinatura_id", "endereco_entrega_id", "status_pedido", "valor_frete", "valor_assinatura", "valor_total", "data_pagamento", "criado_em", "atualizado_em"];
          const vals = [assinaturaId, assin.endereco_entrega_id || null, "PAGO", assin.valor_frete || 0, assin.valor_assinatura || 0, ( (assin.valor_frete || 0) + (assin.valor_assinatura || 0) ), new Date(), new Date(), new Date()];
          // Note: ajustar placeholders dinamicamente
          const placeholders = vals.map((_, i) => `$${i+1}`);
          const sql = `INSERT INTO pedidos (${cols.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING id`;
          const novo = await pool.query(sql, vals);
          console.log(`[PAY] Pedido fallback criado (com endereco_entrega_id) id=${novo.rows[0].id} para assinatura ${assinaturaId}.`);
        } else if (hasEnderecoText) {
          // buscar texto do endereco
          if (assin.endereco_entrega_id) {
            const endRow = await pool.query("SELECT rua, numero, complemento, bairro, cidade, estado, cep FROM enderecos WHERE id = $1", [assin.endereco_entrega_id]);
            if (endRow.rows.length > 0) {
              const e = endRow.rows[0];
              enderecoValor = `${e.rua || ''} ${e.numero || ''} ${e.complemento || ''} - ${e.bairro || ''} - ${e.cidade || ''}/${e.estado || ''} - ${e.cep || ''}`.replace(/\s+/g,' ').trim();
            }
          }
          const cols = ["assinatura_id", "endereco_entrega", "status_pedido", "valor_frete", "valor_assinatura", "valor_total", "data_pagamento", "criado_em", "atualizado_em"];
          const vals = [assinaturaId, enderecoValor, "PAGO", assin.valor_frete || 0, assin.valor_assinatura || 0, ( (assin.valor_frete || 0) + (assin.valor_assinatura || 0) ), new Date(), new Date(), new Date()];
          const placeholders = vals.map((_, i) => `$${i+1}`);
          const sql = `INSERT INTO pedidos (${cols.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING id`;
          const novo = await pool.query(sql, vals);
          console.log(`[PAY] Pedido fallback criado (com endereco_entrega) id=${novo.rows[0].id} para assinatura ${assinaturaId}.`);
        } else {
          // Se não há campos de endereço na tabela pedidos, criar pedido apenas com colunas mínimas
          const vals = [assinaturaId, "PAGO", assin.valor_frete || 0, assin.valor_assinatura || 0, ( (assin.valor_frete || 0) + (assin.valor_assinatura || 0) )];
          const sql = `INSERT INTO pedidos (assinatura_id, status_pedido, valor_frete, valor_assinatura, valor_total, data_pagamento, criado_em, atualizado_em)
                       VALUES ($1,$2,$3,$4,$5,NOW(),NOW(),NOW()) RETURNING id`;
          const novo = await pool.query(sql, vals);
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
