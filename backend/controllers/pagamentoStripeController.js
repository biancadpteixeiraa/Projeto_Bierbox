const Stripe = require("stripe");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

// Carrega as chaves do ambiente
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET; // Chave secreta do endpoint do webhook
const FRONTEND_URL = process.env.FRONTEND_URL || "https://projeto-bierbox.onrender.com";

if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
  throw new Error("As chaves STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET devem ser configuradas no ambiente.");
}

const stripe = Stripe(STRIPE_SECRET_KEY);

// Criar sessão de checkout no Stripe (Sua função original - sem alterações)
const iniciarCheckoutAssinatura = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id } = req.body;
    const utilizadorId = req.userId;

    if (!isUuid(endereco_entrega_id) || (box_id && !isUuid(box_id))) {
      return res.status(400).json({ message: "ID de endereço ou box inválido." });
    }

    if (!plano_id || valor_frete === undefined) {
      return res.status(400).json({ message: "Dados insuficientes para criar o pagamento." });
    }

    // Busca usuário
    const userResult = await pool.query(
      "SELECT email, nome_completo FROM users WHERE id = $1",
      [utilizadorId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }
    const userEmail = userResult.rows[0].email;

    // Define preço do plano
    let preco_plano;
    let titulo_plano;
    if (plano_id === "PLANO_MENSAL") {
      preco_plano = 80.0;
      titulo_plano = "BierBox - Assinatura Mensal";
    } else if (plano_id === "PLANO_ANUAL") {
      preco_plano = 70.0; // valor mensal com desconto anual
      titulo_plano = "BierBox - Assinatura Anual (mensal com desconto)";
    } else {
      return res.status(400).json({ message: "plano_id inválido." });
    }

    const valor_total = preco_plano + parseFloat(valor_frete);

    // Cria assinatura PENDENTE no banco
    const novaAssinatura = await pool.query(
      `INSERT INTO assinaturas 
        (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em, forma_pagamento) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW(), $8) 
       RETURNING id`,
      [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id, "cartao"]
    );
    const assinaturaId = novaAssinatura.rows[0].id;

    // Cria produto e preço no Stripe
    const product = await stripe.products.create({
      name: titulo_plano,
      description: "Assinatura do clube de cervejas BierBox",
    });

    const interval = "month";

    const price = await stripe.prices.create({
      unit_amount: Math.round(valor_total * 100),
      currency: "brl",
      recurring: { interval },
      product: product.id,
    });

    // Cria sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: userEmail,
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${FRONTEND_URL}/checkout/aprovado`,
      cancel_url: `${FRONTEND_URL}/checkout/falha`,
      metadata: {
        assinaturaId: assinaturaId.toString(),
        utilizadorId,
        plano_id,
        box_id,
      },
    });

    return res.status(201).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Erro ao iniciar checkout Stripe:", error);
    res.status(500).json({ message: "Erro no servidor ao criar checkout Stripe." });
  }
};

// Webhook Stripe - VERSÃO CORRIGIDA E SEGURA
const webhookStripe = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // 1. VERIFICAÇÃO DE SEGURANÇA
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`❌ Erro na verificação da assinatura do webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. PROCESSAMENTO DO EVENTO
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const assinaturaId = session.metadata.assinaturaId;
      const stripeSubscriptionId = session.subscription;

      if (!assinaturaId || !stripeSubscriptionId) {
        console.error("Webhook 'checkout.session.completed' recebido sem metadata.assinaturaId ou sem session.subscription.");
        return res.status(400).send("Dados insuficientes no evento do webhook.");
      }

      console.log(`Webhook recebido: Atualizando assinatura interna ${assinaturaId} para ATIVA.`);

      const updateResult = await pool.query(
        `UPDATE assinaturas 
         SET status = 'ATIVA',
             id_assinatura_mp = $1,
             data_inicio = CURRENT_DATE,
             atualizado_em = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [stripeSubscriptionId, assinaturaId]
      );

      if (updateResult.rowCount > 0) {
        console.log(`✅ Assinatura ${assinaturaId} ativada com sucesso no banco de dados.`);
      } else {
        console.warn(`⚠️ A assinatura com ID ${assinaturaId} não foi encontrada no banco para ser atualizada.`);
      }
    }

    // 3. Responde ao Stripe que o evento foi recebido com sucesso
    res.status(200).json({ received: true });

  } catch (error) {
    console.error("Erro ao processar o evento do webhook no banco de dados:", error);
    res.status(500).send("Erro interno no servidor ao processar o evento.");
  }
};


// Cancelar assinatura (Sua função original - sem alterações)
const cancelarAssinatura = async (req, res) => {
  try {
    const { assinaturaId } = req.params;

    // Busca a assinatura no banco
    const { rows } = await pool.query(
      "SELECT id_assinatura_mp, status FROM assinaturas WHERE id = $1",
      [assinaturaId]
    );
    const assinatura = rows[0];

    if (!assinatura) {
      return res.status(404).json({ error: "Assinatura não encontrada." });
    }

    if (assinatura.status !== "ATIVA") {
      return res.status(400).json({ error: "Assinatura não está ativa." });
    }

    // Cancela no Stripe
    await stripe.subscriptions.cancel(assinatura.id_assinatura_mp);

    // Atualiza no banco
    await pool.query(
      `UPDATE assinaturas 
       SET status = 'CANCELADA',
           data_cancelamento = CURRENT_DATE,
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [assinaturaId]
    );

    return res.status(200).json({ message: "Assinatura cancelada com sucesso." });
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return res.status(500).json({ error: "Erro ao cancelar assinatura." });
  }
};

module.exports = {
  iniciarCheckoutAssinatura,
  webhookStripe,
  cancelarAssinatura,
};