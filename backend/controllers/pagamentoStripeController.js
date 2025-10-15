const Stripe = require("stripe");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");


const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY não configurada no ambiente.");
}

const stripe = Stripe(STRIPE_SECRET_KEY);

// Criar sessão de checkout no Stripe
const iniciarCheckoutAssinatura = async (req, res) => {
  try {
    console.log("🔍 req.userId:", req.userId);
    
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
    const userName = userResult.rows[0].nome_completo;

    // Define preço do plano
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

    // Cria assinatura PENDENTE no banco
    const novaAssinatura = await pool.query(
      `INSERT INTO assinaturas 
        (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, data_inicio, criado_em, atualizado_em) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW()) 
       RETURNING id`,
      [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id]
    );
    const assinaturaId = novaAssinatura.rows[0].id;

    // Cria produto e preço no Stripe
    const product = await stripe.products.create({
      name: titulo_plano,
      description: "Assinatura do clube de cervejas BierBox",
    });

    const interval = plano_id === "PLANO_MENSAL" ? "month" : "year";

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
      success_url: `https://projeto-bierbox.onrender.com/checkout/aprovado`,
      cancel_url: `https://projeto-bierbox.onrender.com/checkout/falha`,
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

// Webhook Stripe
const webhookStripe = async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const assinaturaId = session.metadata.assinaturaId;

      await pool.query(
        "UPDATE assinaturas SET status = 'ATIVA', id_assinatura_mp = $1, atualizado_em = CURRENT_TIMESTAMP, forma_pagamento = 'Stripe' WHERE id = $2",
        [session.subscription, assinaturaId]
      );
    }

    res.status(200).send("Webhook recebido com sucesso.");
  } catch (error) {
    console.error("Erro no webhook Stripe:", error);
    res.status(500).send("Erro interno no servidor ao processar webhook.");
  }
};

module.exports = {
  iniciarCheckoutAssinatura,
  webhookStripe,
};

// Cancelar assinatura
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
