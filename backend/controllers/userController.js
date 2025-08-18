const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const registerUser = async (req, res) => {

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
    console.error('Erro ao registrar usuário:', error.message);
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Erro: Email ou CPF já cadastrado.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas (email não encontrado).' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(senha, user.senha_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas (senha incorreta).' });
    }

    const payload = { userId: user.id, email: user.email }; 
    const token = jwt.sign(payload, 'SEGREDO_MUITO_SECRETO', { expiresIn: '1h' });


    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};


// Exporta a nova função junto com a antiga
module.exports = {
  registerUser,
  loginUser, // Adicione esta linha
};
