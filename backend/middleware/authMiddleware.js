// backend/src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Verifica se o token está no cabeçalho da requisição
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Pega apenas o token (remove a palavra "Bearer")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verifica se o token é válido usando o nosso segredo
      const decoded = jwt.verify(token, 'SEGREDO_MUITO_SECRETO');

      // 4. Adiciona os dados do usuário (o payload do token) ao objeto 'req'
      // para que as próximas rotas possam usá-lo
      req.user = decoded;

      // 5. Deixa a requisição continuar para a próxima etapa (a rota do controlador)
      next();

    } catch (error) {
      console.error('Erro na autenticação do token:', error);
      res.status(401).json({ message: 'Não autorizado, token falhou.' });
    }
  }

  // 6. Se não encontrou nenhum token
  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token.' });
  }
};

module.exports = { protect };
