const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Autenticar um administrador
// @route   POST /api/admin/login
// @access  Público
const loginAdmin = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Por favor, forneça e-mail e senha.' });
    }

    try {
        const userResult = await pool.query("SELECT id, nome_completo, email, senha_hash, role FROM users WHERE email = $1", [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Credenciais inválidas." });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(senha, user.senha_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Credenciais inválidas." });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Acesso proibido. Este usuário não é um administrador." });
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
                role: user.role
            },
        });

    } catch (error) {
        console.error("Erro no login de administrador:", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// @desc    Obter estatísticas para a dashboard
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
    try {
        const receitaTotalResult = await pool.query("SELECT SUM(valor_total) AS receita_total FROM pedidos WHERE status_pedido = 'PAGO'");
        const assinaturasAtivasResult = await pool.query("SELECT COUNT(id) AS assinaturas_ativas FROM assinaturas WHERE status = 'ATIVA'");
        const novosClientesResult = await pool.query("SELECT COUNT(id) AS novos_clientes FROM users WHERE data_criacao >= NOW() - INTERVAL '30 days'");
        const pedidosMesResult = await pool.query("SELECT COUNT(id) AS pedidos_mes FROM pedidos WHERE criado_em >= date_trunc('month', CURRENT_DATE)");

        const kpis = {
            receitaTotal: parseFloat(receitaTotalResult.rows[0].receita_total) || 0,
            assinaturasAtivas: parseInt(assinaturasAtivasResult.rows[0].assinaturas_ativas) || 0,
            novosClientes30d: parseInt(novosClientesResult.rows[0].novos_clientes) || 0,
            pedidosNoMes: parseInt(pedidosMesResult.rows[0].pedidos_mes) || 0,
        };

        const receitaMensalResult = await pool.query(`
            SELECT 
                to_char(date_trunc('month', criado_em), 'YYYY-MM') AS mes,
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
            SELECT 
                p.id, 
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
        const ultimosUsuariosResult = await pool.query("SELECT id, nome_completo, email, data_criacao FROM users ORDER BY data_criacao DESC LIMIT 5");

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
        res.status(500).json({ success: false, message: "Erro interno do servidor ao buscar estatísticas." });
    }
};

// @desc    [Admin] Listar todas as boxes
// @route   GET /api/admin/boxes
// @access  Admin
const adminGetAllBoxes = async (req, res) => {
    try {
        const allBoxes = await pool.query("SELECT * FROM boxes ORDER BY id ASC");
        res.status(200).json({ success: true, data: allBoxes.rows });
    } catch (error) {
        console.error("Erro ao buscar todas as boxes (Admin):", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// @desc    [Admin] Criar uma nova box
// @route   POST /api/admin/boxes
// @access  Admin
const adminCreateBox = async (req, res) => {
    const {
        nome, descricao_curta, descricao_longa, especificacao,
        preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un,
        ativo, imagem_principal_url
    } = req.body;

    if (!nome || !preco_mensal_4_un) {
        return res.status(400).json({ success: false, message: "Nome e pelo menos um preço são obrigatórios." });
    }

    try {
        const newBox = await pool.query(
            `INSERT INTO boxes (
                nome, descricao_curta, descricao_longa, especificacao, 
                preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un, 
                ativo, imagem_principal_url
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                nome, descricao_curta, descricao_longa, especificacao,
                preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un,
                ativo === false ? false : true,
                imagem_principal_url
            ]
        );
        res.status(201).json({ success: true, message: "Box criada com sucesso!", data: newBox.rows[0] });
    } catch (error) {
        console.error("Erro ao criar box (Admin):", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// @desc    [Admin] Atualizar uma box
// @route   PUT /api/admin/boxes/:id
// @access  Admin
const adminUpdateBox = async (req, res) => {
    const { id } = req.params;
    const {
        nome, descricao_curta, descricao_longa, especificacao,
        preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un,
        ativo, imagem_principal_url
    } = req.body;

    try {
        const updatedBox = await pool.query(
            `UPDATE boxes SET
                nome = $1, descricao_curta = $2, descricao_longa = $3, especificacao = $4,
                preco_mensal_4_un = $5, preco_anual_4_un = $6, preco_mensal_6_un = $7, preco_anual_6_un = $8,
                ativo = $9, imagem_principal_url = $10, data_atualizacao = NOW()
            WHERE id = $11 RETURNING *`,
            [
                nome, descricao_curta, descricao_longa, especificacao,
                preco_mensal_4_un, preco_anual_4_un, preco_mensal_6_un, preco_anual_6_un,
                ativo, imagem_principal_url,
                id
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

// @desc    [Admin] Deletar uma box
// @route   DELETE /api/admin/boxes/:id
// @access  Admin
const adminDeleteBox = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteResult = await pool.query("DELETE FROM boxes WHERE id = $1", [id]);

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Box não encontrada." });
        }

        res.status(200).json({ success: true, message: "Box deletada com sucesso." });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(400).json({ success: false, message: "Não é possível deletar esta box, pois ela está vinculada a assinaturas existentes." });
        }
        console.error("Erro ao deletar box (Admin):", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// @desc    [Admin] Listar todos os clientes
// @route   GET /api/admin/users
// @access  Admin
const adminGetAllUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT id, nome_completo, email, data_criacao, role, ativo FROM users ORDER BY data_criacao DESC");
        res.status(200).json({ success: true, data: users.rows });
    } catch (error) {
        console.error("Erro ao buscar todos os usuários (Admin):", error);
        res.status(500).json({ success: false, message: "Erro interno do servidor." });
    }
};

// @desc    [Admin] Obter detalhes de um cliente específico
// @route   GET /api/admin/users/:id
// @access  Admin
const adminGetUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const userResult = await pool.query("SELECT id, nome_completo, email, cpf, data_criacao, role, ativo FROM users WHERE id = $1", [id]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado." });
        }
        const userInfo = userResult.rows[0];

        const enderecosResult = await pool.query("SELECT * FROM enderecos WHERE utilizador_id = $1 ORDER BY is_padrao DESC", [id]);

        const assinaturasResult = await pool.query("SELECT id, plano_id, status, data_inicio FROM assinaturas WHERE utilizador_id = $1 ORDER BY data_inicio DESC", [id]);

        const userDetails = {
            info: userInfo,
            enderecos: enderecosResult.rows,
            assinaturas: assinaturasResult.rows
        };

        res.status(200).json({ success: true, data: userDetails });

    } catch (error) {
        console.error("Erro ao buscar detalhes do usuário (Admin):", error);
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
};
