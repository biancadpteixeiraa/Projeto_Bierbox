const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

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
            SELECT p.id, u.nome_completo AS cliente_nome, p.valor_total, p.status_pedido, p.criado_em
            FROM pedidos p
            JOIN users u ON p.utilizador_id = u.id
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


module.exports = {
    loginAdmin,
    getDashboardStats,
};
