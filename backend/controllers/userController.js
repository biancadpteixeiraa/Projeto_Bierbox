// backend/controllers/userController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // 1. Importa a biblioteca JWT

// Função de Registro (já existia, não precisa mexer)
const registerUser = async (req, res) => {
  // ... seu código de registro continua aqui, sem alterações ...
  const { nome_completo, email, cpf, senha } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);
    const newUser = await pool.query(
      'INSERT INTO users (nome_completo, email, cpf, senha_hash) VALUES ($1, $2, $3, $4) RETURNING id, email',
      [nome_completo, email, cpf, senha_hash]
    );
    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Erro: Email ou CPF já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- NOVA FUNÇÃO DE LOGIN ---
const loginUser = async (req, res) => {
  // 2. Pega o email e a senha do corpo da requisição
  const { email, senha } = req.body;

  try {
    // 3. Procura o usuário no banco de dados pelo email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // 4. Verifica se o usuário não foi encontrado
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas (email não encontrado).' });
    }

    const user = userResult.rows[0]; // Pega os dados do usuário encontrado

    // 5. Compara a senha enviada com a senha criptografada no banco
    const isMatch = await bcrypt.compare(senha, user.senha_hash);

    // 6. Verifica se as senhas não batem
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas (senha incorreta).' });
    }

    // 7. Se a senha bate, cria o Token JWT (o "crachá")
    const payload = { userId: user.id, email: user.email }; // O que vamos guardar no crachá
    const token = jwt.sign(payload, 'SEGREDO_MUITO_SECRETO', { expiresIn: '1h' }); // Assina o crachá

    // 8. Envia a resposta de sucesso com o token
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};


// Exporta a nova função junto com a antiga
module.exports = {
  registerUser,
  loginUser, // Adicione esta linha
};
