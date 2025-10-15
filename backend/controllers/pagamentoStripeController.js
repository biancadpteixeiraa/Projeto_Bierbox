// pagamentoStripeController.js
// Controller Stripe – assinaturas recorrentes (box + frete real via Melhor Envio)

const Stripe = require('stripe');
const pool = require('../config/db'); // usa sua conexão centralizada
const { calcularFretePorCep } = require('./freteService'); // novo service que criamos

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não configurada no ambiente.');
}

const stripe = Stripe(STRIPE_SECRET_KEY);

// ----------------- UTILS -----------------

// Busca preço da box conforme plano e quantidade
async function obterPrecoBox(boxId, tipoPlano, quantidadeCervejas) {
  const { rows } = await pool.query(
    'SELECT * FROM boxes WHERE id = $1 AND ativo = true',
    [boxId]
  );
  const box = rows[0];
  if (!box) throw new Error('Box não encontrada ou inativa.');

  if (tipoPlano === 'mensal') {
    if (quantidadeCervejas === 4) return Number(box.preco_mensal_4_un);
    if (quantidadeCervejas === 6) return Number(box.preco_mensal_6_un);
  } else if (tipoPlano === 'anual') {
    if (quantidadeCervejas === 4) return Number(box.preco_anual_4_un);
    if (quantidadeCervejas === 6) return Number(box.preco_anual_6_un);
  }
  throw new Error('Combinação de plano e quantidade inválida.');
}

// Busca endereço do usuário
async function obterEndereco(enderecoId, usuarioId) {
  const { rows } = await pool.query(
    'SELECT * FROM enderecos WHERE id = $1 AND utilizador_id = $2',
    [enderecoId, usuarioId]
  );
  return rows[0];
}

// Busca usuário
async function obterUsuario(usuarioId) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [usuarioId]
  );
  return rows[0];
}

// Cria ou retorna cliente Stripe
async function getOrCreateStripeCustomer(user) {
  const customers = await stripe.customers.list({ email: user.email, limit: 1 });
  if (customers.data && customers.data.length > 0) {
    return customers.data[0];
  }
  return await stripe.customers.create({
    email: user.email,
    name: user.nome_completo,
    metadata: { user_id: user.id },
  });
}

// ----------------- CONTROLLERS -----------------

// Iniciar checkout de assinatura
async function iniciarCheckoutAssinatura(req, res) {
  try {
    const { usuarioId, boxId, tipoPlano, quantidadeCervejas, enderecoEntregaId } = req.body;

    if (!usuarioId || !boxId || !tipoPlano || !quantidadeCervejas || !enderecoEntregaId) {
      return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes.' });
    }

    // Busca usuário e endereço
    const user = await obterUsuario(usuarioId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const endereco = await obterEndereco(enderecoEntregaId, usuarioId);
    if (!endereco) return res.status(404).json({ error: 'Endereço de entrega não encontrado.' });

    // Calcula valores
    const valorAssinatura = await obterPrecoBox(boxId, tipoPlano, Number(quantidadeCervejas));

    // usa o frete real via Melhor Envio
    const frete = await calcularFretePorCep(endereco.cep);
    const valorFrete = frete.preco;

    const valorTotal = Number((valorAssinatura + valorFrete).toFixed(2));
    const unitAmount = Math.round(valorTotal * 100);

    // Cria/obtém cliente Stripe
    const customer = await getOrCreateStripeCustomer(user);

    // Cria produto e price dinâmico
    const product = await stripe.products.create({
      name: `BierBox – ${quantidadeCervejas} un (${tipoPlano})`,
      metadata: { box_id: boxId, user_id: usuarioId, plano: tipoPlano }
    });

    const interval = tipoPlano === 'mensal' ? 'month' : 'year';

    const price = await stripe.prices.create({
      unit_amount: unitAmount,
      currency: 'brl',
      recurring: { interval },
      product: product.id,
    });

    // Cria sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customer.id,
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${FRONTEND_URL}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/pagamento/cancelado`,
      payment_method_types: ['card'],
      metadata: {
        usuarioId,
        boxId,
        tipoPlano,
        quantidadeCervejas,
        enderecoEntregaId,
        valorAssinatura: valorAssinatura.toFixed(2),
        valorFrete: valorFrete.toFixed(2),
      }
    });

    // Persiste assinatura PENDENTE
    const planoId = `${tipoPlano}_${quantidadeCervejas}un`;
    const formaPagamento = 'stripe';

    const insertAssinatura = `
      INSERT INTO assinaturas (
        utilizador_id,
        plano_id,
        status,
        id_assinatura_mp,
        endereco_entrega_id,
        valor_frete,
        valor_assinatura,
        forma_pagamento,
        box_id
      )
      VALUES ($1, $2, 'PENDENTE', $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    const { rows: assinaturaRows } = await pool.query(insertAssinatura, [
      usuarioId,
      planoId,
      session.id, // guardamos session.id até confirmar
      enderecoEntregaId,
      valorFrete,
      valorAssinatura,
      formaPagamento,
      boxId
    ]);

    return res.status(200).json({
      checkoutUrl: session.url,
      sessionId: session.id,
      assinaturaId: assinaturaRows[0].id,
      resumo: { valorAssinatura, valorFrete, valorTotal }
    });
  } catch (err) {
    console.error('Erro iniciarCheckoutAssinatura:', err);
    return res.status(500).json({ error: 'Erro ao iniciar checkout de assinatura.' });
  }
}

// Webhook Stripe
async function webhookStripe(req, res) {
  try {
    const event = req.body;

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscriptionId = session.subscription;
        const sessionId = session.id;

        await pool.query(
          `UPDATE assinaturas
           SET status = 'ATIVA',
               id_assinatura_mp = $1,
               data_inicio = CURRENT_DATE,
               atualizado_em = CURRENT_TIMESTAMP
           WHERE id_assinatura_mp = $2`,
          [subscriptionId, sessionId]
        );
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        const { rows } = await pool.query(
          'SELECT id, endereco_entrega_id, valor_frete, valor_assinatura FROM assinaturas WHERE id_assinatura_mp = $1',
          [subscriptionId]
        );
        const assinatura = rows[0];
        if (assinatura) {
          const valorTotal = Number(assinatura.valor_frete) + Number(assinatura.valor_assinatura);
          await pool.query(
            `INSERT INTO pedidos (endereco_entrega_id, status_pedido, valor_frete, valor_assinatura, valor_total, data_pagamento, assinatura_id)
             VALUES ($1, 'PAGO', $2, $3, $4, CURRENT_DATE, $5)`,
            [assinatura.endereco_entrega_id, assinatura.valor_frete, assinatura.valor_assinatura, valorTotal, assinatura.id]
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;

        await pool.query(
          `UPDATE assinaturas
           SET status = 'CANCELADA',
               data_cancelamento = CURRENT_DATE,
               atualizado_em = CURRENT_TIMESTAMP
           WHERE id_assinatura_mp = $1`,
          [subscriptionId]
        );
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Erro webhookStripe:', err);
    return res.status(400).json({ error: 'Webhook inválido.' });
  }
}

// Cancelar assinatura (cliente ou admin)
async function cancelarAssinatura(req, res) {
  try {
    const { assinaturaId } = req.params;

    // Busca assinatura no banco
    const { rows } = await pool.query(
      'SELECT id_assinatura_mp, status FROM assinaturas WHERE id = $1',
      [assinaturaId]
    );
    const assinatura = rows[0];

    if (!assinatura) {
      return res.status(404).json({ error: 'Assinatura não encontrada.' });
    }

    if (assinatura.status !== 'ATIVA') {
      return res.status(400).json({ error: 'Assinatura não está ativa.' });
    }

    // Cancela no Stripe
    await stripe.subscriptions.cancel(assinatura.id_assinatura_mp);

    // O webhook "customer.subscription.deleted" vai atualizar o banco para CANCELADA
    // Mas se quiser já marcar imediatamente:
    await pool.query(
      `UPDATE assinaturas
       SET status = 'CANCELADA',
           data_cancelamento = CURRENT_DATE,
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [assinaturaId]
    );

    return res.status(200).json({ message: 'Assinatura cancelada com sucesso.' });
  } catch (err) {
    console.error('Erro cancelarAssinatura:', err);
    return res.status(500).json({ error: 'Erro ao cancelar assinatura.' });
  }
}

module.exports = {
  iniciarCheckoutAssinatura,
  webhookStripe,
  cancelarAssinatura,
};

