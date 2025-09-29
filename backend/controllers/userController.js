const pool = require("../config/db" );
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { nome_completo, email, cpf, senha, data_nascimento } = req.body;

  if (!data_nascimento) {
    return res.status(400).json({ success: false, message: "Erro: A data de nascimento é obrigatória." });
  }

  try {
    const hoje = new Date();
    const nascimento = new Date(data_nascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    if (idade < 18) {
      return res.status(400).json({ success: false, message: "Cadastro permitido apenas para maiores de 18 anos." });
    }

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Erro: Email já cadastrado." });
    }

    const existingCpf = await pool.query("SELECT id FROM users WHERE cpf = $1", [cpf]);
    if (existingCpf.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Erro: CPF já cadastrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    const newUser = await pool.query(
      "INSERT INTO users (nome_completo, email, cpf, senha_hash, data_nascimento) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome_completo, email",
      [nome_completo, email, cpf, senha_hash, data_nascimento]
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query("SELECT id, email FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(200).json({ success: true, message: "Se um usuário com este e-mail existir, um link de recuperação de senha foi enviado." });
    }

    const user = userResult.rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); 

    await pool.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [token, expires, user.id]
    );

    const resetLink = `http://localhost:3000/recuperar-senha/nova-senha/${token}`;

    await transporter.sendMail({
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "BierBox - Recuperação de Senha",
      html: `
        <p>Você solicitou a recuperação de senha para sua conta na BierBox.</p>
        <p>Clique no link a seguir para redefinir sua senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link é válido por 1 hora.</p>
        <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
      `,
    } );

    res.status(200).json({ success: true, message: "Se um usuário com este e-mail existir, um link de recuperação de senha foi enviado." });

  } catch (error) {
    console.error("Erro em forgotPassword:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

const resetPassword = async (req, res) => {
  const { token, nova_senha } = req.body;

  if (!token || !nova_senha) {
    return res.status(400).json({ success: false, message: "Token e nova senha são obrigatórios." });
  }

  try {
    const userResult = await pool.query(
      "SELECT id FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()",
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Token de recuperação de senha inválido ou expirado." });
    }

    const user = userResult.rows[0];
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(nova_senha, salt);

    await pool.query(
      "UPDATE users SET senha_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2",
      [senha_hash, user.id]
    );

    res.status(200).json({ success: true, message: "Senha redefinida com sucesso!" });

  } catch (error) {
    console.error("Erro em resetPassword:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
