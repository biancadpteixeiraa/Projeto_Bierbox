const mercadopago = require('mercadopago');
const pool = require('../db');

// Configuração Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

/**
 * Criar preferência de pagamento
 */
exports.criarPreferencia = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
    const userId = req.userId; // vindo do middleware de autenticação

    console.log(`[PAY] Criando nova preferência para usuário=${userId}`);

    // Verifica se o endereço realmente pertence ao usuário
    const checkEndereco = await pool.query(
      `SELECT id FROM enderecos WHERE id = $1 AND utilizador_id = $2`,
      [endereco_entrega_id, userId]
    );

    if (checkEndereco.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `endereco_entrega_id ${endereco_entrega_id} não encontrado para o usuário.`,
        suggestion: "Use um endereco_entrega_id válido pertencente ao usuário."
      });
    }

    // Buscar dados da box
    const boxResult = await pool.query(`SELECT * FROM boxes WHERE id = $1`, [box_id]);
    if (boxResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Box com id ${box_id} não encontrada.`
      });
    }
    const box = boxResult.rows[0];

    // Definir valor da assinatura
    let valorAssinatura = 0;
    if (plano_id === "PLANO_MENSAL") {
      valorAssinatura = box.preco_mensal_4_un;
    } else if (plano_id === "PLANO_ANUAL") {
      valorAssinatura = box.preco_anual_4_un;
    }

    const valorTotal = valorAssinatura + valor_frete;

    // Criar assinatura
    const assinaturaResult = await pool.query(
      `INSERT INTO assinaturas 
        (utilizador_id, plano_id, status, data_inicio, criado_em, atualizado_em, box_id, endereco_entrega_id, valor_frete, valor_assinatura) 
       VALUES ($1,$2,$3,NOW(),NOW(),NOW(),$4,$5,$6,$7) RETURNING id`,
      [userId, plano_id, 'PENDENTE', box_id, endereco_entrega_id, valor_frete, valorAssinatura]
    );
    const assinaturaId = assinaturaResult.rows[0].id;

    // Criar pedido vinculado
    await pool.query(
      `INSERT INTO pedidos 
        (assinatura_id, endereco_entrega_id, status_pedido, valor_frete, valor_assinatura, valor_total, criado_em, atualizado_em) 
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW()) RETURNING id`,
      [assinaturaId, endereco_entrega_id, 'AGUARDANDO_PAGAMENTO', valor_frete, valorAssinatura, valorTotal]
    );

    // Criar preferência no Mercado Pago
    const preference = {
      items: [
        {
          title: `BierBox - ${plano_id}`,
          unit_price: valorTotal,
          quantity: 1
        }
      ],
      external_reference: String(assinaturaId),
      notification_url: `${process.env.BASE_URL}/api/pagamentos/webhook`
    };

    const response = await mercadopago.preferences.create(preference);

    console.log(`[PAY] Nova assinatura criada: id=${assinaturaId} (usuario=${userId})`);

    res.json({
      success: true,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point,
      assinaturaId
    });

  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
};

/**
 * Webhook Mercado Pago
 */
exports.webhook = async (req, res) => {
  try {
    console.log("🚨 Webhook disparado pelo Mercado Pago!");
    console.log("Body recebido:", req.body);

    const topic = req.body.topic || req.query.topic;
    if (topic === "payment" || req.body.type === "payment") {
      const paymentId = req.body.data?.id || req.body.resource;

      // Buscar detalhes do pagamento
      const payment = await mercadopago.payment.findById(paymentId);
      console.log("🔍 Detalhes do Pagamento:", payment.body);

      if (payment.body.status === "approved") {
        const assinaturaId = payment.body.external_reference;

        await pool.query(
          `UPDATE assinaturas 
           SET status = 'ATIVA', id_assinatura_mp = $1, atualizado_em = NOW() 
           WHERE id = $2`,
          [paymentId, assinaturaId]
        );

        await pool.query(
          `UPDATE pedidos 
           SET status_pedido = 'PAGO', data_pagamento = NOW(), atualizado_em = NOW() 
           WHERE assinatura_id = $1`,
          [assinaturaId]
        );

        console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA.`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
};

/**
 * Listar assinaturas
 */
exports.listarAssinaturas = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(`[DEBUG] Listando assinaturas para userId: ${userId}`);

    const result = await pool.query(
      `SELECT 
          a.id,
          a.plano_id,
          a.status,
          a.data_inicio,
          a.data_cancelamento,
          a.criado_em,
          a.atualizado_em,
          a.id_assinatura_mp,
          a.valor_assinatura,
          a.valor_frete,
          a.box_id,
          b.nome AS box_nome,
          b.imagem_principal_url AS box_imagem_url,
          p.status_pedido AS ultimo_status_pedido,
          p.codigo_rastreio AS ultimo_codigo_rastreio
       FROM assinaturas a
       LEFT JOIN boxes b ON a.box_id = b.id
       LEFT JOIN LATERAL (
          SELECT status_pedido, codigo_rastreio
          FROM pedidos
          WHERE assinatura_id = a.id
          ORDER BY criado_em DESC
          LIMIT 1
       ) p ON true
       WHERE a.utilizador_id = $1
       ORDER BY a.data_inicio DESC`,
      [userId]
    );

    res.json({ success: true, assinaturas: result.rows });
  } catch (error) {
    console.error("Erro ao listar assinaturas:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
};

/**
 * Cancelar assinatura
 */
exports.cancelarAssinatura = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await pool.query(
      `UPDATE assinaturas 
       SET status = 'CANCELADA', data_cancelamento = NOW(), atualizado_em = NOW()
       WHERE id = $1 AND utilizador_id = $2`,
      [id, userId]
    );

    await pool.query(
      `UPDATE pedidos 
       SET status_pedido = 'CANCELADO', atualizado_em = NOW()
       WHERE assinatura_id = $1`,
      [id]
    );

    res.json({ success: true, message: `Assinatura ${id} cancelada com sucesso.` });
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
};
