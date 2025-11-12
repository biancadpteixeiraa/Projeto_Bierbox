const Stripe = require("stripe");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://projeto-bierbox.onrender.com";

if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
  throw new Error("As chaves STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET devem ser configuradas no ambiente.");
}

const stripe = Stripe(STRIPE_SECRET_KEY);

const iniciarCheckoutAssinatura = async (req, res) => {
  try {
    const { plano_id, endereco_entrega_id, valor_frete, box_id, quantidade_cervejas, assinatura_id } = req.body;
    const utilizadorId = req.userId;

    if (!isUuid(endereco_entrega_id) || !isUuid(box_id)) {
      return res.status(400).json({ message: "ID de endereço ou box inválido." });
    }

    if (!plano_id || valor_frete === undefined || !quantidade_cervejas) {
      return res.status(400).json({ message: "Dados insuficientes para criar o pagamento." });
    }

    const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [utilizadorId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }
    const userEmail = userResult.rows[0].email;

    const boxResult = await pool.query("SELECT * FROM boxes WHERE id = $1", [box_id]);
    if (boxResult.rows.length === 0) {
      return res.status(404).json({ message: "Box não encontrada." });
    }
    const box = boxResult.rows[0];

    let colunaPreco;
    if (plano_id === "PLANO_MENSAL" && quantidade_cervejas === 4) colunaPreco = "preco_mensal_4_un";
    else if (plano_id === "PLANO_MENSAL" && quantidade_cervejas === 6) colunaPreco = "preco_mensal_6_un";
    else if (plano_id === "PLANO_ANUAL" && quantidade_cervejas === 4) colunaPreco = "preco_anual_4_un";
    else if (plano_id === "PLANO_ANUAL" && quantidade_cervejas === 6) colunaPreco = "preco_anual_6_un";
    else return res.status(400).json({ message: "Combinação de plano e quantidade inválida." });

    const precoPlano = Number(box[colunaPreco]);
    const frete = Number(parseFloat(valor_frete).toFixed(2));
    const valorTotal = Number((precoPlano + frete).toFixed(2));
    const titulo_plano = `${box.nome} - ${plano_id.replace("_", " ")} (${quantidade_cervejas} un.)`;

    let assinaturaId = assinatura_id;

    if (assinatura_id) {
      const check = await pool.query(
        "SELECT status, criado_em FROM assinaturas WHERE id = $1 AND utilizador_id = $2",
        [assinatura_id, utilizadorId]
      );
      if (check.rows.length === 0) {
        return res.status(404).json({ message: "Assinatura não encontrada." });
      }

      const assinatura = check.rows[0];
      if (assinatura.status === "CANCELADA") {
        return res.status(400).json({ message: "Assinatura já foi cancelada." });
      }

      const criadoEm = new Date(assinatura.criado_em);
      const agora = new Date();
      const diffHoras = (agora - criadoEm) / (1000 * 60 * 60);

      if (diffHoras > 24) {
        await pool.query(
          "UPDATE assinaturas SET status = 'CANCELADA', atualizado_em = NOW() WHERE id = $1",
          [assinatura_id]
        );
        return res.status(400).json({ message: "Assinatura expirada. É necessário criar uma nova." });
      }
    } else {

      const novaAssinatura = await pool.query(
        `INSERT INTO assinaturas 
          (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, criado_em, atualizado_em, forma_pagamento) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8) 
         RETURNING id`,
        [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, frete, precoPlano, box_id, "cartao"]
      );
      assinaturaId = novaAssinatura.rows[0].id;
    }

    const product = await stripe.products.create({
      name: titulo_plano,
      description: `Assinatura do clube de cervejas BierBox - ${box.nome}`,
    });

    const price = await stripe.prices.create({
      unit_amount: Math.round(valorTotal * 100),
      currency: "brl",
      recurring: { interval: "month" },
      product: product.id,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: userEmail,
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `https://www.bierbox.com.br/checkout/aprovado`,
      cancel_url: `https://www.bierbox.com.br/checkout/falha`,
      metadata: { assinaturaId: assinaturaId.toString(), utilizadorId, plano_id, box_id, quantidade_cervejas },
    });

    return res.status(201).json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Erro ao iniciar checkout Stripe:", error);
    res.status(500).json({ message: "Erro no servidor ao criar checkout Stripe." });
  }
};

const webhookStripe = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`❌ Erro na verificação do webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const assinaturaId = session.metadata.assinaturaId;
      const stripeSubscriptionId = session.subscription;

      if (!assinaturaId || !stripeSubscriptionId) {
        console.error("Webhook recebido sem assinaturaId ou subscription.");
        return res.status(400).send("Dados insuficientes no webhook.");
      }

      await pool.query(
        `UPDATE assinaturas 
         SET status = 'ATIVA',
             id_assinatura_mp = $1,
             data_inicio = CURRENT_DATE,
             atualizado_em = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [stripeSubscriptionId, assinaturaId]
      );

      console.log(`✅ Assinatura ${assinaturaId} ativada com sucesso.`);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const assinaturaId = session.metadata?.assinaturaId;

      if (assinaturaId) {
        await pool.query(
          `UPDATE assinaturas 
           SET status = 'CANCELADA',
               atualizado_em = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [assinaturaId]
        );
        console.log(`❌ Assinatura ${assinaturaId} cancelada (checkout expirado).`);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook Stripe:", error);
    res.status(500).send("Erro interno ao processar evento.");
  }
};

const cancelarAssinatura = async (req, res) => {
  try {
    const { assinaturaId } = req.params;

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

    await stripe.subscriptions.cancel(assinatura.id_assinatura_mp);
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
