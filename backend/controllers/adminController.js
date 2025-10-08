const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Função para gerar token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc Autenticar um administrador
// @route POST /api/admin/login
// @access Público
const loginAdmin = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      message: "Por favor, forneça e-mail e senha.",
    });
  }

  try {
    const userResult = await pool.query(
      "SELECT id, nome_completo, email, senha_hash, role FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas." });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Acesso proibido. Este usuário não é um administrador.",
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login de administrador bem-sucedido!",
      token: token,
      user: {
        id: user.id,
        nome_completo: user.nome_completo,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login de administrador:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

// @desc Obter estatísticas para a dashboard
// @route GET /api/admin/stats
// @access Admin
const getDashboardStats = async (req, res) => {
  try {
    const receitaTotalResult = await pool.query(
      "SELECT SUM(valor_total) AS receita_total FROM pedidos WHERE status_pedido = 'PAGO'"
    );

    const assinaturasAtivasResult = await pool.query(
      "SELECT COUNT(id) AS assinaturas_ativas FROM assinaturas WHERE status = 'ATIVA'"
    );

    const novosClientesResult = await pool.query(
      "SELECT COUNT(id) AS novos_clientes FROM users WHERE data_criacao >= NOW() - INTERVAL '30 days'"
    );

    const pedidosMesResult = await pool.query(
      "SELECT COUNT(id) AS pedidos_mes FROM pedidos WHERE criado_em >= date_trunc('month', CURRENT_DATE)"
    );

    const kpis = {
      receitaTotal: parseFloat(receitaTotalResult.rows[0].receita_total) || 0,
      assinaturasAtivas: parseInt(assinaturasAtivasResult.rows[0].assinaturas_ativas) || 0,
      novosClientes30d: parseInt(novosClientesResult.rows[0].novos_clientes) || 0,
      pedidosNoMes: parseInt(pedidosMesResult.rows[0].pedidos_mes) || 0,
    };

    const receitaMensalResult = await pool.query(`
      SELECT to_char(date_trunc('month', criado_em), 'YYYY-MM') AS mes,
             SUM(valor_total) as receita
      FROM pedidos
      WHERE status_pedido = 'PAGO' AND criado_em >= NOW() - INTERVAL '12 months'
      GROUP BY date_trunc('month', criado_em)
      ORDER BY date_trunc('month', criado_em);
    `);

    const assinaturasPorPlanoResult = await pool.query(`
      SELECT plano_id, COUNT(id) AS total
      FROM assinaturas
      WHERE status = 'ATIVA'
      GROUP BY plano_id;
    `);

    const ultimosPedidosResult = await pool.query(`
      SELECT p.id,
             u.nome_completo AS cliente_nome,
             p.valor_total,
             p.status_pedido,
             p.criado_em
      FROM pedidos p
      JOIN assinaturas a ON p.assinatura_id = a.id
      JOIN users u ON a.utilizador_id = u.id
      ORDER BY p.criado_em DESC
      LIMIT 5;
    `);

    const ultimosUsuariosResult = await pool.query(
      "SELECT id, nome_completo, email, data_criacao FROM users ORDER BY data_criacao DESC LIMIT 5"
    );

    const stats = {
      kpis,
      receitaMensal: receitaMensalResult.rows,
      assinaturasPorPlano: assinaturasPorPlanoResult.rows,
      ultimosPedidos: ultimosPedidosResult.rows,
      ultimosUsuarios: ultimosUsuariosResult.rows,
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Erro ao buscar estatísticas da dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao buscar estatísticas.",
    });
  }
};

// @desc [Admin] Listar todas as boxes
// @route GET /api/admin/boxes
// @access Admin
const adminGetAllBoxes = async (req, res) => {
  try {
    const allBoxes = await pool.query("SELECT * FROM boxes ORDER BY id ASC");
    res.status(200).json({ success: true, data: allBoxes.rows });
  } catch (error) {
    console.error("Erro ao buscar todas as boxes (Admin):", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

// @desc [Admin] Criar uma nova box
// @route POST /api/admin/boxes
// @access Admin
const adminCreateBox = async (req, res) => {
  const {
    nome,
    descricao_curta,
    descricao_longa,
    especificacao,
    preco_mensal_4_un,
    preco_anual_4_un,
    preco_mensal_6_un,
    preco_anual_6_un,
    ativo,
    imagem_principal_url,
    imagem_url_2,
    imagem_url_3,
    imagem_url_4,
    imagem_url_5,
  } = req.body;

  if (!nome || !preco_mensal_4_un) {
    return res.status(400).json({
      success: false,
      message: "Nome e pelo menos um preço são obrigatórios.",
    });
  }

  try {
    const newBox = await pool.query(
      `INSERT INTO boxes (
        nome, descricao_curta, descricao_longa, especificacao,
        preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un,
        preco_anual_6_un, ativo, imagem_principal_url,
        imagem_url_2, imagem_url_3, imagem_url_4, imagem_url_5
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [
        nome,
        descricao_curta,
        descricao_longa,
        especificacao,
        preco_mensal_4_un,
        preco_anual_4_un,
        preco_mensal_6_un,
        preco_anual_6_un,
        ativo === false ? false : true,
        imagem_principal_url,
        imagem_url_2,
        imagem_url_3,
        imagem_url_4,
        imagem_url_5,
      ]
    );

    res.status(201).json({ success: true, message: "Box criada com sucesso!", data: newBox.rows[0] });
  } catch (error) {
    console.error("Erro ao criar box (Admin):", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

// @desc [Admin] Atualizar uma box
// @route PUT /api/admin/boxes/:id
// @access Admin
const adminUpdateBox = async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    descricao_curta,
    descricao_longa,
    especificacao,
    preco_mensal_4_un,
    preco_anual_4_un,
    preco_mensal_6_un,
    preco_anual_6_un,
    ativo,
    imagem_principal_url,
    imagem_url_2,
    imagem_url_3,
    imagem_url_4,
    imagem_url_5,
  } = req.body;

  try {
    const updatedBox = await pool.query(
      `UPDATE boxes SET
        nome=$1, descricao_curta=$2, descricao_longa=$3, especificacao=$4,
        preco_mensal_4_un=$5, preco_anual_4_un=$6, preco_mensal_6_un=$7,
        preco_anual_6_un=$8, ativo=$9, imagem_principal_url=$10,
        imagem_url_2=$11, imagem_url_3=$12, imagem_url_4=$13, imagem_url_5=$14, data_atualizacao=NOW()
      WHERE id=$15 RETURNING *`,
      [
        nome,
        descricao_curta,
        descricao_longa,
        especificacao,
        preco_mensal_4_un,
        preco_anual_4_un,
        preco_mensal_6_un,
        preco_anual_6_un,
        ativo,
        imagem_principal_url,
        imagem_url_2,
        imagem_url_3,
        imagem_url_4,
        imagem_url_5,
        id,
      ]
    );

    if (updatedBox.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Box não encontrada." });
    }

    res.status(200).json({ success: true, message: "Box atualizada com sucesso!", data: updatedBox.rows[0] });
  } catch (error) {
    console.error("Erro ao atualizar box (Admin):", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

// @desc [Admin] Deletar uma box
// @route DELETE /api/admin/boxes/:id
// @access Admin
const adminDeleteBox = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteResult = await pool.query("DELETE FROM boxes WHERE id = $1", [id]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Box não encontrada." });
    }

    res.status(200).json({ success: true, message: "Box deletada com sucesso." });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Não é possível deletar esta box, pois ela está vinculada a assinaturas existentes.",
      });
    }

    console.error("Erro ao deletar box (Admin):", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

// @desc [Admin] Listar todos os clientes
// @route GET /api/admin/users
// @access Admin
const adminGetAllUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, nome_completo, email, data_criacao, role, ativo FROM users ORDER BY data_criacao DESC"
    );
    res.status(200).json({ success: true, data: users.rows });
  } catch (error) {
    console.error("Erro ao buscar todos os usuários (Admin):", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

// @desc Obter detalhes de um cliente específico
// @route GET /api/admin/users/:id
// @access Admin
const adminGetUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const userResult = await pool.query(
      "SELECT id, nome_completo, email, cpf, data_criacao, role, ativo FROM users WHERE id = $1",
      [id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuário não encontrado." });
    }

    const userInfo = userResult.rows[0];

    const enderecosResult = await pool.query(
      "SELECT * FROM enderecos WHERE utilizador_id = $1 ORDER BY is_padrao DESC",
      [id]
    );

    const assinaturasResult = await pool.query(
      "SELECT id, plano_id, status, data_inicio FROM assinaturas WHERE utilizador_id = $1 ORDER BY data_inicio DESC",
      [id]
    );

    const userDetails = {
      info: userInfo,
      enderecos: enderecosResult.rows,
      assinaturas: assinaturasResult.rows,
    };

    res.status(200).json({ success: true, data: userDetails });
  } catch (error) {
    console.error("Erro ao buscar detalhes do usuário (Admin):", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

// @desc [Admin] Listar todos os pedidos
// @route GET /api/admin/pedidos
// @access Admin
const adminGetAllPedidos = async (req, res) => {
  try {
    const query = `
      SELECT id, assinatura_id, valor_total, status_pedido, criado_em
      FROM pedidos
      ORDER BY criado_em DESC
    `;
    const pedidos = await pool.query(query);
    res.status(200).json({ success: true, data: pedidos.rows });
  } catch (error) {
    console.error("Erro ao buscar todos os pedidos (Admin):", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

const adminGetPedidoById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT p.*, u.nome_completo AS cliente_nome, u.email AS cliente_email, u.cpf AS cliente_cpf,
             b.nome AS box_nome, e.*
      FROM pedidos p
      LEFT JOIN assinaturas a ON p.assinatura_id = a.id
      LEFT JOIN users u ON a.utilizador_id = u.id
      LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id
      LEFT JOIN boxes b ON a.box_id = b.id
      WHERE p.id = $1
    `;
    const pedidoResult = await pool.query(query, [id]);

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Pedido não encontrado." });
    }

    res.status(200).json({ success: true, data: pedidoResult.rows[0] });
  } catch (error) {
    console.error("Erro ao buscar detalhes do pedido (Admin):", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

// @desc [Admin] Atualizar um pedido (status e/ou código de rastreio)
// @route PUT /api/admin/pedidos/:id
// @access Admin
const adminUpdatePedido = async (req, res) => {
  const { id } = req.params;
  const { status_pedido, codigo_rastreio } = req.body;

  if (!status_pedido && !codigo_rastreio) {
    return res.status(400).json({
      success: false,
      message: "Pelo menos um campo (status_pedido ou codigo_rastreio) deve ser fornecido para atualização.",
    });
  }

  try {
    let queryFields = [];
    let queryParams = [];
    let paramIndex = 1;

    if (status_pedido) {
      queryFields.push(`status_pedido = $${paramIndex++}`);
      queryParams.push(status_pedido);
    }

    if (codigo_rastreio) {
      queryFields.push(`codigo_rastreio = $${paramIndex++}`);
      queryParams.push(codigo_rastreio);
    }

    queryParams.push(id);

    const updateQuery = `
      UPDATE pedidos
      SET ${queryFields.join(", ")}, atualizado_em = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const updatedPedido = await pool.query(updateQuery, queryParams);

    if (updatedPedido.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Pedido não encontrado." });
    }

    res.status(200).json({ success: true, message: "Pedido atualizado com sucesso!", data: updatedPedido.rows[0] });
  } catch (error) {
    console.error("Erro ao atualizar pedido (Admin):", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

// @desc    [Admin] Listar todas as assinaturas
// @route   GET /api/admin/assinaturas
// @access  Admin
const adminGetAllAssinaturas = async (req, res) => {
    const { search, status } = req.query;
    let query = `
        SELECT 
            a.id AS id_assinatura,
            u.nome_completo AS cliente_nome,
            a.plano_id AS plano,
            b.nome AS box_nome,
            a.status,
            a.data_inicio
        FROM assinaturas a
        JOIN users u ON a.utilizador_id = u.id
        JOIN boxes b ON a.box_id = b.id
    `;
    const queryParams = [];
    const conditions = [];
    let paramIndex = 1;

    if (search) {
        conditions.push(`LOWER(u.nome_completo) LIKE LOWER($${paramIndex++})`);
        queryParams.push(`%${search}%`);
    }

    if (status) {
        conditions.push(`a.status = $${paramIndex++}`);
        queryParams.push(status);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY a.data_inicio DESC`;

    try {
        const assinaturas = await pool.query(query, queryParams);
        res.status(200).json({ success: true, data: assinaturas.rows });
    } catch (error) {
        console.error("Erro ao buscar assinaturas (Admin):", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// @desc    [Admin] Obter detalhes de uma assinatura específica
// @route   GET /api/admin/assinaturas/:id
// @access  Admin
const adminGetAssinaturaById = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT 
                a.id AS id_assinatura,
                u.nome_completo AS cliente_nome,
                u.email AS cliente_email,
                b.nome AS box_nome,
                a.valor_assinatura AS valor_box,
                a.data_inicio,
                a.status,
                e.cep AS endereco_cep,
                e.rua AS endereco_rua,
                e.numero AS endereco_numero,
                e.complemento AS endereco_complemento,
                e.bairro AS endereco_bairro,
                e.cidade AS endereco_cidade,
                e.estado AS endereco_estado,
                a.forma_pagamento,
                a.criado_em AS data_criacao_assinatura
            FROM assinaturas a
            LEFT JOIN users u ON a.utilizador_id = u.id
            LEFT JOIN boxes b ON a.box_id = b.id
            LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id
            WHERE a.id = $1
        `;
        const assinaturaResult = await pool.query(query, [id]);

        if (assinaturaResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Assinatura não encontrada." });
        }

        const assinaturaDetalhes = assinaturaResult.rows[0];


        const historicoPagamentosResult = await pool.query(
            `SELECT criado_em AS data_pagamento, valor_total, status_pedido
             FROM pedidos
             WHERE assinatura_id = $1
             ORDER BY criado_em DESC`,
            [id]
        );

        assinaturaDetalhes.historico_pagamentos = historicoPagamentosResult.rows;

        res.status(200).json({ success: true, data: assinaturaDetalhes });

    } catch (error) {
        console.error("Erro ao buscar detalhes da assinatura (Admin):", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// @desc    [Admin] Cancelar uma assinatura
// @route   PUT /api/admin/assinaturas/:id/cancelar
// @access  Admin
const adminCancelAssinatura = async (req, res) => {
    const { id } = req.params;

    try {
        const assinatura = await pool.query("SELECT status FROM assinaturas WHERE id = $1", [id]);

        if (assinatura.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Assinatura não encontrada." });
        }

        if (assinatura.rows[0].status === 'CANCELADA') {
            return res.status(400).json({ success: false, message: "Assinatura já está cancelada." });
        }

        const updatedAssinatura = await pool.query(
            `UPDATE assinaturas 
             SET status = 'CANCELADA', data_cancelamento = NOW(), atualizado_em = NOW()
             WHERE id = $1 RETURNING *`,
            [id]
        );

        res.status(200).json({ success: true, message: "Assinatura cancelada com sucesso!", data: updatedAssinatura.rows[0] });

    } catch (error) {
        console.error("Erro ao cancelar assinatura (Admin):", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// @desc    [Admin] Pausar uma assinatura
// @route   PUT /api/admin/assinaturas/:id/pausar
// @access  Admin
const adminPauseAssinatura = async (req, res) => {
    const { id } = req.params;

    try {
        const assinatura = await pool.query("SELECT status FROM assinaturas WHERE id = $1", [id]);

        if (assinatura.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Assinatura não encontrada." });
        }

        if (assinatura.rows[0].status === 'PAUSADA') {
            return res.status(400).json({ success: false, message: "Assinatura já está pausada." });
        }

        if (assinatura.rows[0].status === 'CANCELADA') {
            return res.status(400).json({ success: false, message: "Não é possível pausar uma assinatura cancelada." });
        }

        const updatedAssinatura = await pool.query(
            `UPDATE assinaturas 
             SET status = 'PAUSADA', atualizado_em = NOW()
             WHERE id = $1 RETURNING *`,
            [id]
        );

        res.status(200).json({ success: true, message: "Assinatura pausada com sucesso!", data: updatedAssinatura.rows[0] });

    } catch (error) {
        console.error("Erro ao pausar assinatura (Admin):", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// @desc    [Admin] Reativar uma assinatura
// @route   PUT /api/admin/assinaturas/:id/reativar
// @access  Admin
const adminReactivateAssinatura = async (req, res) => {
    const { id } = req.params;

    try {
        const assinatura = await pool.query("SELECT status FROM assinaturas WHERE id = $1", [id]);

        if (assinatura.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Assinatura não encontrada." });
        }

        if (assinatura.rows[0].status === 'ATIVA') {
            return res.status(400).json({ success: false, message: "Assinatura já está ativa." });
        }

        if (assinatura.rows[0].status === 'CANCELADA') {
            return res.status(400).json({ success: false, message: "Não é possível reativar uma assinatura cancelada." });
        }

        const updatedAssinatura = await pool.query(
            `UPDATE assinaturas 
             SET status = 'ATIVA', atualizado_em = NOW()
             WHERE id = $1 RETURNING *`,
            [id]
        );

        res.status(200).json({ success: true, message: "Assinatura reativada com sucesso!", data: updatedAssinatura.rows[0] });

    } catch (error) {
        console.error("Erro ao reativar assinatura (Admin):", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

module.exports = {
  loginAdmin,
  getDashboardStats,
  adminGetAllBoxes,
  adminCreateBox,
  adminUpdateBox,
  adminDeleteBox,
  adminGetAllUsers,
  adminGetUserById,
  adminGetAllPedidos,
  adminGetPedidoById,
  adminUpdatePedido,
  adminGetAllAssinaturas,
  adminGetAssinaturaById,
  adminCancelAssinatura,
  adminPauseAssinatura,
  adminReactivateAssinatura,
};
