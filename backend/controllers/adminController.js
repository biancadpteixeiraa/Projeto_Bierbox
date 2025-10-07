const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const loginAdmin = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const admin = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        if (admin.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        const validPassword = await bcrypt.compare(senha, admin.rows[0].senha_hash);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        const token = generateToken(admin.rows[0].id);

        res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso!',
            token,
        });
    } catch (error) {
        console.error('Erro ao fazer login de admin:', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await pool.query('SELECT COUNT(*) FROM users');
        const totalPedidos = await pool.query('SELECT COUNT(*) FROM pedidos');
        const totalBoxes = await pool.query('SELECT COUNT(*) FROM boxes');
        const totalAssinaturas = await pool.query('SELECT COUNT(*) FROM assinaturas');

        res.status(200).json({
            success: true,
            data: {
                totalUsers: parseInt(totalUsers.rows[0].count),
                totalPedidos: parseInt(totalPedidos.rows[0].count),
                totalBoxes: parseInt(totalBoxes.rows[0].count),
                totalAssinaturas: parseInt(totalAssinaturas.rows[0].count),
            },
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas do dashboard.' });
    }
};

const adminGetAllBoxes = async (req, res) => {
    try {
        const boxes = await pool.query('SELECT * FROM boxes ORDER BY criado_em DESC');
        res.status(200).json({ success: true, data: boxes.rows });
    } catch (error) {
        console.error('Erro ao listar boxes:', error);
        res.status(500).json({ success: false, message: 'Erro ao listar boxes.' });
    }
};

const adminCreateBox = async (req, res) => {
    const { nome, descricao, preco, ativo } = req.body;

    try {
        const novaBox = await pool.query(
            'INSERT INTO boxes (nome, descricao, preco, ativo) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, descricao, preco, ativo]
        );

        res.status(201).json({ success: true, data: novaBox.rows[0] });
    } catch (error) {
        console.error('Erro ao criar box:', error);
        res.status(500).json({ success: false, message: 'Erro ao criar box.' });
    }
};

const adminUpdateBox = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, ativo } = req.body;

    try {
        const box = await pool.query('SELECT * FROM boxes WHERE id = $1', [id]);
        if (box.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Box não encontrada.' });
        }

        const updatedBox = await pool.query(
            'UPDATE boxes SET nome = $1, descricao = $2, preco = $3, ativo = $4, atualizado_em = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [nome, descricao, preco, ativo, id]
        );

        res.status(200).json({ success: true, data: updatedBox.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar box:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar box.' });
    }
};

const adminDeleteBox = async (req, res) => {
    const { id } = req.params;

    try {
        const box = await pool.query('SELECT * FROM boxes WHERE id = $1', [id]);
        if (box.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Box não encontrada.' });
        }

        await pool.query('DELETE FROM boxes WHERE id = $1', [id]);
        res.status(200).json({ success: true, message: 'Box excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir box:', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir box.' });
    }
};


const adminGetAllUsers = async (req, res) => {
    try {
        const users = await pool.query('SELECT id, nome_completo, email, criado_em FROM users ORDER BY criado_em DESC');
        res.status(200).json({ success: true, data: users.rows });
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ success: false, message: 'Erro ao listar usuários.' });
    }
};

const adminGetUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await pool.query('SELECT id, nome_completo, email, criado_em FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ success: true, data: user.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar usuário.' });
    }
};

const adminGetAllPedidos = async (req, res) => {
    try {
        const pedidos = await pool.query(`
            SELECT 
                p.id, 
                p.status_pedido, 
                p.criado_em, 
                a.plano_id,
                u.nome_completo AS cliente
            FROM pedidos p
            LEFT JOIN assinaturas a ON p.assinatura_id = a.id
            LEFT JOIN users u ON a.utilizador_id = u.id
            ORDER BY p.criado_em DESC
        `);

        res.status(200).json({ success: true, data: pedidos.rows });
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        res.status(500).json({ success: false, message: 'Erro ao listar pedidos.' });
    }
};

const adminGetPedidoById = async (req, res) => {
    const { id } = req.params;

    try {
        const pedido = await pool.query(`
            SELECT 
                p.*, 
                a.plano_id, 
                a.box_id, 
                b.nome AS box_nome,
                u.nome_completo AS cliente, 
                e.rua, e.numero, e.cidade, e.estado, e.cep
            FROM pedidos p
            LEFT JOIN assinaturas a ON p.assinatura_id = a.id
            LEFT JOIN boxes b ON a.box_id = b.id
            LEFT JOIN users u ON a.utilizador_id = u.id
            LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id
            WHERE p.id = $1
        `, [id]);

        if (pedido.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        res.status(200).json({ success: true, data: pedido.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar pedido.' });
    }
};

const adminUpdatePedido = async (req, res) => {
    const { id } = req.params;
    const { status_pedido, codigo_rastreio } = req.body;

    try {
        const pedido = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
        if (pedido.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
        }

        const updatedPedido = await pool.query(
            'UPDATE pedidos SET status_pedido = $1, codigo_rastreio = $2, atualizado_em = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [status_pedido, codigo_rastreio, id]
        );

        res.status(200).json({ success: true, data: updatedPedido.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar pedido.' });
    }
};


const adminGetAllAssinaturas = async (req, res) => {
    const { status, search } = req.query;

    try {
        let query = `
            SELECT 
                a.id,
                u.nome_completo AS cliente,
                a.plano_id,
                b.nome AS box,
                a.status,
                a.data_inicio
            FROM assinaturas a
            LEFT JOIN users u ON a.utilizador_id = u.id
            LEFT JOIN boxes b ON a.box_id = b.id
            WHERE 1=1
        `;
        const values = [];

        if (status) {
            values.push(status);
            query += ` AND a.status = $${values.length}`;
        }

        if (search) {
            values.push(`%${search}%`);
            query += ` AND (u.nome_completo ILIKE $${values.length} OR b.nome ILIKE $${values.length})`;
        }

        query += ' ORDER BY a.criado_em DESC';

        const result = await pool.query(query, values);
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Erro ao listar assinaturas:', error);
        res.status(500).json({ success: false, message: 'Erro ao listar assinaturas.' });
    }
};

const adminGetAssinaturaById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT 
                a.*, 
                u.nome_completo AS cliente,
                u.email AS cliente_email,
                b.nome AS box_nome,
                e.rua, e.numero, e.cidade, e.estado, e.cep
            FROM assinaturas a
            LEFT JOIN users u ON a.utilizador_id = u.id
            LEFT JOIN boxes b ON a.box_id = b.id
            LEFT JOIN enderecos e ON a.endereco_entrega_id = e.id
            WHERE a.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Assinatura não encontrada.' });
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar assinatura:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar assinatura.' });
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
    adminGetAssinaturaById
};
