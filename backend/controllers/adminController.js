const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");

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

module.exports = {
    loginAdmin,
};
