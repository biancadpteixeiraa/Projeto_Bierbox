const pool = require("../config/db");
const bcrypt = require("bcryptjs"); // Certifique-se que é 'bcryptjs'
const jwt = require("jsonwebtoken");

// Função auxiliar para gerar o token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token válido por 30 dias para facilitar testes
  });
};

const registerUser = async (req, res) => {
  const { nome_completo, email, cpf, senha } = req.body;

  try {
    // Verifica se o email já existe
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Erro: Email já cadastrado." });
    }

    // Verifica se o CPF já existe
    const existingCpf = await pool.query("SELECT id FROM users WHERE cpf = $1", [cpf]);
    if (existingCpf.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Erro: CPF já cadastrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    const newUser = await pool.query(
      "INSERT INTO users (nome_completo, email, cpf, senha_hash) VALUES ($1, $2, $3, $4) RETURNING id, nome_completo, email",
      [nome_completo, email, cpf, senha_hash]
    );

    const token = generateToken(newUser.rows[0].id);

    res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso!",
      token: token,
      user: {
        id: newUser.rows[0].id,
        nome_completo: newUser.rows[0].nome_completo,
        email: newUser.rows[0].email,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor ao registrar usuário." });
  }
};

const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas (email não encontrado)." });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(senha, user.senha_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Credenciais inválidas (senha incorreta)." });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login bem-sucedido!",
      token: token,
      user: {
        id: user.id,
        nome_completo: user.nome_completo,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor ao fazer login." });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
