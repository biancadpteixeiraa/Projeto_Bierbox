const { MercadoPagoConfig, PreApproval } = require("mercadopago");
const pool = require("../config/db");
const { validate: isUuid } = require("uuid");

const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN_TEST;
const client = new MercadoPagoConfig({ accessToken: mpAccessToken });

const criarAssinaturaRecorrente = async (req, res) => {
  try {
    const { plano_id, quantidade_unidades, endereco_entrega_id, valor_frete, box_id } = req.body;
    const utilizadorId = req.userId;

    if (!isUuid(endereco_entrega_id) || !isUuid(box_id)) {
      return res.status(400).json({ message: "ID de endereço ou box inválido." });
    }

    if (!plano_id || !quantidade_unidades || valor_frete === undefined) {
      return res.status(400).json({ message: "Dados insuficientes para criar a assinatura." });
    }

    const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [utilizadorId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }
    const userEmail = userResult.rows[0].email;

    const boxResult = await pool.query("SELECT * FROM boxes WHERE id = $1", [box_id]);
    const box = boxResult.rows[0];

    if (!box) {
      return res.status(404).json({ message: "Box não encontrada." });
    }

    let preco_plano;
    let titulo_plano;

    if (plano_id === "PLANO_MENSAL") {
      if (quantidade_unidades === 4) {
        preco_plano = box.preco_mensal_4_un;
        titulo_plano = "BierBox Mensal - 4 Unidades";
      } else if (quantidade_unidades === 6) {
        preco_plano = box.preco_mensal_6un;
        titulo_plano = "BierBox Mensal - 6 Unidades";
      } else {
        return res.status(400).json({ message: "Quantidade inválida para plano mensal." });
      }
    } else if (plano_id === "PLANO_ANUAL") {
      if (quantidade_unidades === 4) {
        preco_plano = box.preco_anual_4_un;
        titulo_plano = "BierBox Anual - 4 Unidades";
      } else if (quantidade_unidades === 6) {
        preco_plano = box.preco_anual_6_un;
        titulo_plano = "BierBox Anual - 6 Unidades";
      } else {
        return res.status(400).json({ message: "Quantidade inválida para plano anual." });
      }
    } else {
      return res.status(400).json({ message: "plano_id inválido." });
    }

    const valor_total_recorrente = preco_plano + parseFloat(valor_frete);

    const novaAssinatura = await pool.query(
      "INSERT INTO assinaturas (utilizador_id, plano_id, status, endereco_entrega_id, valor_frete, valor_assinatura, box_id, quantidade_unidades, data_inicio, criado_em, atualizado_em) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), NOW()) RETURNING id",
      [utilizadorId, plano_id, "PENDENTE", endereco_entrega_id, valor_frete, preco_plano, box_id, quantidade_unidades]
    );
    const assinaturaId = novaAssinatura.rows[0].id;

    const isTestEnv = mpAccessToken === process.env.MP_ACCESS_TOKEN_TEST;
    const payerEmail = isTestEnv ? "test_user_2695420795@testuser.com" : userEmail;

    const subscriptionClient = new PreApproval(client);
    const subscriptionBody = {
      reason: titulo_plano,
      payer_email: payerEmail,
      back_url: "https://projeto-bierbox.onrender.com/checkout/assinatura-status",
      external_reference: assinaturaId,
      auto_recurring: {
        frequency: plano_id === "PLANO_MENSAL" ? 1 : 12,
        frequency_type: "months",
        transaction_amount: valor_total_recorrente,
        currency_id: "BRL"
      },
      notification_url: "https://projeto-bierbox.onrender.com/api/pagamentos/webhook"
    };

    const result = await subscriptionClient.create({ body: subscriptionBody });

    res.status(201).json({
      checkoutUrl: result.init_point,
      assinaturaId,
      mercadoPagoId: result.id
    });

  } catch (error) {
    console.error("Erro ao criar assinatura recorrente:", error);
    res.status(500).json({
      message: "Erro no servidor ao criar assinatura recorrente.",
      details: error.message || error
    });
  }
};

module.exports = {
  criarAssinaturaRecorrente
};
