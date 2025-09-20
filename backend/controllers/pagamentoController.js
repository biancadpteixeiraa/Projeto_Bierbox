// backend/controllers/pagamentoController.js
const mercadopago = require("mercadopago");
const pool = require("../config/db");

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// Criar preferência de pagamento
exports.criarPreferencia = async (req, res) => {
  try {
    const { assinaturaId, planoDescricao, valorTotal } = req.body;

    const preference = {
      items: [
        {
          title: `BierBox - ${planoDescricao}`,
          quantity: 1,
          unit_price: Number(valorTotal)
        }
      ],
      external_reference: assinaturaId.toString(),
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pagamento/sucesso`,
        failure: `${process.env.FRONTEND_URL}/pagamento/falha`,
        pending: `${process.env.FRONTEND_URL}/pagamento/pendente`
      },
      auto_return: "approved",
      notification_url: `${process.env.BACKEND_URL}/api/pagamentos/webhook`
    };

    const response = await mercadopago.preferences.create(preference);
    return res.json({ success: true, init_point: response.body.init_point });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return res.status(500).json({ success: false, message: "Erro ao criar preferência" });
  }
};

// Webhook do Mercado Pago
exports.webhook = async (req, res) => {
  try {
    console.log("🚨 Webhook disparado pelo Mercado Pago!");
    console.log("Body recebido:", req.body);

    if (req.body.type === "payment" && req.body.data && req.body.data.id) {
      const paymentId = req.body.data.id;

      // Buscar detalhes do pagamento
      const pagamento = await mercadopago.payment.findById(paymentId);
      const data = pagamento.body;
      console.log("🔍 Detalhes do Pagamento:", data);

      const assinaturaId = data.external_reference;

      if (data.status === "approved") {
        // Atualizar assinatura como ATIVA
        await pool.query(
          `UPDATE assinaturas
           SET status = 'ATIVA', id_assinatura_mp = $1, data_inicio = NOW(), atualizado_em = NOW()
           WHERE id = $2`,
          [paymentId, assinaturaId]
        );

        console.log(`✅ Assinatura ${assinaturaId} atualizada para ATIVA.`);

        // Criar o primeiro pedido vinculado à assinatura
        const novoPedido = await pool.query(
          `INSERT INTO pedidos 
            (assinatura_id, endereco_entrega, status_pedido, codigo_rastreio, valor_frete, valor_assinatura, valor_total, data_pagamento, criado_em, atualizado_em)
           SELECT 
            a.id,
            a.endereco_entrega_id,
            'PROCESSANDO',
            NULL,
            a.valor_frete,
            a.valor_assinatura,
            COALESCE(a.valor_frete,0) + COALESCE(a.valor_assinatura,0),
            NOW(),
            NOW(),
            NOW()
           FROM assinaturas a
           WHERE a.id = $1
           RETURNING id`,
          [assinaturaId]
        );

        console.log(`📦 Pedido ${novoPedido.rows[0].id} criado para assinatura ${assinaturaId}.`);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    res.sendStatus(500);
  }
};
