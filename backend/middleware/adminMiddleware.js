const pool = require('../config/db');

const adminProtect = async (req, res, next) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Não autorizado, token falhou.' });
    }

    try {
        const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }

        const userRole = userResult.rows[0].role;

        if (userRole !== 'admin') {
            return res.status(403).json({ success: false, message: 'Acesso proibido. Rota apenas para administradores.' });
        }

        next();

    } catch (error) {
        console.error('Erro no middleware de admin:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor na verificação de permissão.' });
    }
};

module.exports = { adminProtect };
