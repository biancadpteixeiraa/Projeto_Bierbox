// controllers/pagamentoController.js
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const pool = require('../config/db');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN_TEST || process.env.MP_ACCESS_TOKEN // fallback
});

exports.criarPreferencia = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
    const utilizadorId = req.userId;

    if (!plano_id || endereco_entrega_id === undefined || valor_frete === undefined) {
      return res.status(400).json({ message: 'Dados insuficientes para criar o pagamento.' });
    }

    // buscar email/nome do usuário
    const userResult = await pool.query('SELECT email, nome_completo FROM users WHERE id = $1', [utilizadorId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    const userEmail = userResult.rows[0].email;
    const userName = userResult.rows[0].nome_completo;

    // determinar preço do plano (padrões)
    let preco_plano;
    let titulo_plano;

    if (plano_id === 'PLANO_MENSAL') {
      preco_plano = 80.00;
      titulo_plano = 'BierBox - Assinatura Mensal';
    } else if (plano_id === 'PLANO_ANUAL') {
      preco_plano = 70.00;
      titulo_plano = 'BierBox - Assinatura Anual';
    } else {
      return res.status(400).json({ message: 'plano_id inválido.' });
    }

    const valor_total = parseFloat(preco_plano) + parseFloat(valor_frete);

    // Inserir assinatura (guardando endereco_entrega_id, frete e preco do plano)
    const novaAssinatura = await pool.query(
      `INSERT INTO assinaturas 
        (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, criado_em, atualizado_em)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING id`,
      [utilizadorId, plano_id, 'PENDENTE', endereco_entrega_id, valor_frete, preco_plano, box_id || null]
    );
    const assinaturaId = novaAssinatura.rows[0].id;

    // Criar preferência no Mercado Pago
    const preference = new Preference(client);
    const preferenceBody = {
      items: [
        {
          id: plano_id,
          title: titulo_plano,
          description: 'Assinatura do clube de cervejas BierBox',
          quantity: 1,
          unit_price: valor_total,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: userEmail,
        name: userName,
      },
      external_reference: assinaturaId.toString(),
      back_urls: {
        success: process.env.NODE_ENV === 'production' ? 'https://projeto-bierbox.onrender.com/sucesso' : 'https://projeto-bierbox.onrender.com/sucesso',
        failure: process.env.NODE_ENV === 'production' ? 'https://projeto-bierbox.onrender.com/falha' : 'https://projeto-bierbox.onrender.com/falha',
        pending: process.env.NODE_ENV === 'production' ? 'https://projeto-bierbox.onrender.com/pendente' : 'https://projeto-bierbox.onrender.com/pendente',
      },
      auto_return: 'approved',
    };

    const result = await preference.create({ body: preferenceBody });

    // Escolher sandbox_init_point quando não está em produção
    const checkoutUrl = (process.env.NODE_ENV === 'production')
      ? result.init_point
      : (result.sandbox_init_point || result.init_point);

    return res.status(201).json({ checkoutUrl, assinaturaId });

  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error);
    return res.status(500).json({ message: 'Erro no servidor ao criar preferência de pagamento.' });
  }
};


// Webhook do Mercado Pago - Recebe notificações
exports.receberWebhook = async (req, res) => {
  // O body do Mercado Pago tipicamente vem como { type: 'payment', data: { id: '123' } }
  const { type, data } = req.body;
  console.log('Webhook recebido:', JSON.stringify(req.body).slice(0, 1000)); // log parcial para não lotar

  try {
    if (type === 'payment' && data && data.id) {
      const paymentClient = new Payment(client);
      const paymentDetails = await paymentClient.get({ id: data.id });

      // dependendo da lib, o retorno pode estar em paymentDetails (ou paymentDetails.body)
      const payment = paymentDetails.body || paymentDetails; // fallback
      console.log('Detalhes do pagamento (webhook):', payment);

      if (payment && (payment.status === 'approved' || payment.status === 'authorized') && payment.external_reference) {
        const assinaturaId = parseInt(payment.external_reference, 10);

        // Atualiza assinatura para ATIVA e grava id do MP
        await pool.query(
          `UPDATE assinaturas SET status = 'ATIVA', id_assinatura_mp = $1, atualizado_em = NOW() WHERE id = $2`,
          [payment.id || payment.transaction_id || null, assinaturaId]
        );

        // Busca dados da assinatura recém-ativada para criar pedido
        const assinRow = await pool.query('SELECT * FROM assinaturas WHERE id = $1', [assinaturaId]);
        if (assinRow.rows.length > 0) {
          const assin = assinRow.rows[0];

          // Montar endereco de entrega pesquisando na tabela de enderecos (se existir)
          let enderecoTexto = null;
          if (assin.endereco_entrega_id) {
            const endRow = await pool.query('SELECT rua, numero, complemento, bairro, cidade, estado, cep FROM enderecos WHERE id = $1', [assin.endereco_entrega_id]);
            if (endRow.rows.length > 0) {
              const e = endRow.rows[0];
              enderecoTexto = `${e.rua || ''} ${e.numero || ''} ${e.complemento || ''} - ${e.bairro || ''} - ${e.cidade || ''}/${e.estado || ''} - ${e.cep || ''}`.trim();
            }
          }

          // determinar valores: usamos valor_assinatura e valor_frete gravados na assinatura (se existirem)
          const valorAssinatura = assin.valor_assinatura || null;
          const valorFrete = assin.valor_frete || 0;
          const valorTotal = (payment.transaction_amount !== undefined) ? payment.transaction_amount : ( (valorAssinatura || 0) + (valorFrete || 0) );

          // Inserir pedido inicial na tabela pedidos (primeiro registro)
          await pool.query(
            `INSERT INTO pedidos 
             (assinatura_id, endereco_entrega, status_pedido, codigo_rastreio, valor_frete, valor_assinatura, valor_total, data_pagamento, criado_em, atualizado_em)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
            [assinaturaId, enderecoTexto, 'PAGO', null, valorFrete, valorAssinatura, valorTotal, payment.date_approved || new Date()]
          );

          console.log(`Assinatura ${assinaturaId} atualizada para ATIVA e pedido criado.`);
        } // fim se assin existe
      } // fim se approved
    }

    return res.status(200).send('Webhook recebido com sucesso.');
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return res.status(500).send('Erro interno no servidor ao processar webhook.');
  }
};
