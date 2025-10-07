const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_admin = true', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const admin = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, admin.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: admin.id, is_admin: true }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Erro ao fazer login de admin:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const boxes = await pool.query('SELECT COUNT(*) FROM boxes');
    const pedidos = await pool.query('SELECT COUNT(*) FROM pedidos');
    const assinaturas = await pool.query('SELECT COUNT(*) FROM assinaturas');

    res.status(200).json({
      success: true,
      stats: {
        total_users: users.rows[0].count,
        total_boxes: boxes.rows[0].count,
        total_pedidos: pedidos.rows[0].count,
        total_assinaturas: assinaturas.rows[0].count,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminGetAllBoxes = async (req, res) => {
  try {
    const boxes = await pool.query('SELECT * FROM boxes ORDER BY created_at DESC');
    res.status(200).json({ success: true, boxes: boxes.rows });
  } catch (error) {
    console.error('Erro ao buscar boxes:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminCreateBox = async (req, res) => {
  const { nome, descricao, preco } = req.body;
  try {
    const novaBox = await pool.query(
      'INSERT INTO boxes (nome, descricao, preco) VALUES ($1, $2, $3) RETURNING *',
      [nome, descricao, preco]
    );
    res.status(201).json({ success: true, box: novaBox.rows[0] });
  } catch (error) {
    console.error('Erro ao criar box:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminUpdateBox = async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco } = req.body;

  try {
    const boxAtualizada = await pool.query(
      'UPDATE boxes SET nome = $1, descricao = $2, preco = $3 WHERE id = $4 RETURNING *',
      [nome, descricao, preco, id]
    );
    if (boxAtualizada.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Box não encontrada.' });
    }
    res.status(200).json({ success: true, box: boxAtualizada.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar box:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminDeleteBox = async (req, res) => {
  const { id } = req.params;
  try {
    const deletada = await pool.query('DELETE FROM boxes WHERE id = $1 RETURNING *', [id]);
    if (deletada.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Box não encontrada.' });
    }
    res.status(200).json({ success: true, message: 'Box excluída com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar box:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminGetAllUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT id, nome_completo, email, created_at FROM users ORDER BY created_at DESC');
    res.status(200).json({ success: true, users: users.rows });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminGetUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }
    res.status(200).json({ success: true, user: user.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminGetAllPedidos = async (req, res) => {
  try {
    const pedidos = await pool.query(`
      SELECT p.*, u.nome_completo AS cliente_nome
      FROM pedidos p
      LEFT JOIN assinaturas a ON p.assinatura_id = a.id
      LEFT JOIN users u ON a.utilizador_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.status(200).json({ success: true, pedidos: pedidos.rows });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminGetPedidoById = async (req, res) => {
  const { id } = req.params;
  try {
    const pedido = await pool.query(`
      SELECT p.*, u.nome_completo AS cliente_nome, u.email, b.nome AS box_nome, e.rua, e.numero, e.bairro, e.cidade, e.estado, e.cep
      FROM pedidos p
      LEFT JOIN assinaturas a ON p.assinatura_id = a.id
      LEFT JOIN users u ON a.utilizador_id = u.id
      LEFT JOIN boxes b ON a.box_id = b.id
      LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id
      WHERE p.id = $1
    `, [id]);

    if (pedido.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
    }
    res.status(200).json({ success: true, pedido: pedido.rows[0] });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminUpdatePedido = async (req, res) => {
  const { id } = req.params;
  const { status_pedido, codigo_rastreio } = req.body;

  try {
    const pedidoAtualizado = await pool.query(
      'UPDATE pedidos SET status_pedido = $1, codigo_rastreio = $2 WHERE id = $3 RETURNING *',
      [status_pedido, codigo_rastreio, id]
    );

    if (pedidoAtualizado.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
    }

    res.status(200).json({ success: true, pedido: pedidoAtualizado.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminGetAllAssinaturas = async (req, res) => {
  const { search, status } = req.query;

  try {
    let query = `
      SELECT a.*, u.nome_completo AS cliente_nome, b.nome AS box_nome
      FROM assinaturas a
      LEFT JOIN users u ON a.utilizador_id = u.id
      LEFT JOIN boxes b ON a.box_id = b.id
      WHERE 1=1
    `;
    const values = [];

    if (search) {
      values.push(`%${search}%`);
      query += ` AND LOWER(u.nome_completo) LIKE LOWER($${values.length})`;
    }

    if (status) {
      values.push(status);
      query += ` AND a.status = $${values.length}`;
    }

    query += ' ORDER BY a.data_inicio DESC';
    const assinaturas = await pool.query(query, values);

    res.status(200).json({ success: true, assinaturas: assinaturas.rows });
  } catch (error) {
    console.error('Erro ao buscar assinaturas:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminGetAssinaturaById = async (req, res) => {
  const { id } = req.params;

  try {
    const assinatura = await pool.query(`
      SELECT a.*, 
             u.nome_completo AS cliente_nome, u.email,
             b.nome AS box_nome, b.preco AS box_valor,
             e.rua, e.numero, e.bairro, e.cidade, e.estado, e.cep
      FROM assinaturas a
      LEFT JOIN users u ON a.utilizador_id = u.id
      LEFT JOIN boxes b ON a.box_id = b.id
      LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id
      WHERE a.id = $1
    `, [id]);

    if (assinatura.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assinatura não encontrada.' });
    }

    const pagamentos = await pool.query(`
      SELECT id, data_pagamento, valor_total, status_pedido
      FROM pedidos
      WHERE assinatura_id = $1
      ORDER BY data_pagamento DESC
    `, [id]);

    res.status(200).json({
      success: true,
      assinatura: assinatura.rows[0],
      historico_pagamentos: pagamentos.rows
    });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminCancelarAssinatura = async (req, res) => {
  const { id } = req.params;

  try {
    const cancelada = await pool.query(
      "UPDATE assinaturas SET status = 'CANCELADA' WHERE id = $1 RETURNING *",
      [id]
    );

    if (cancelada.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assinatura não encontrada.' });
    }

    res.status(200).json({ success: true, message: 'Assinatura cancelada com sucesso.' });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
};

const adminToggleStatusAssinatura = async (req, res) => {
  const { id } = req.params;

  try {
    const assinatura = await pool.query('SELECT status FROM assinaturas WHERE id = $1', [id]);
    if (assinatura.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Assinatura não encontrada.' });
    }

    const novoStatus = assinatura.rows[0].status === 'ATIVA' ? 'PAUSADA' : 'ATIVA';
    await pool.query('UPDATE assinaturas SET status = $1 WHERE id = $2', [novoStatus, id]);

    res.status(200).json({
      success: true,
      message: `Assinatura agora está ${novoStatus}.`
    });
  } catch (error) {
    console.error('Erro ao alterar status da assinatura:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
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
  adminCancelarAssinatura,
  adminToggleStatusAssinatura
  
};
