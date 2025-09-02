const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Pega o token do cabeçalho
      token = req.headers.authorization.split(" ")[1];

      // Verifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adiciona o ID do usuário ao objeto de requisição
      req.userId = decoded.id;

      return next(); // Adicionado return para clareza, embora next() já encerre o fluxo aqui.
    } catch (error) { 
      console.error("Erro na autenticação do token:", error.message);
      return res.status(401).json({ message: "Não autorizado, token falhou." }); // Adicionado return
    }
  }

  if (!token) {
    // Esta verificação agora se torna a principal para quando não há token.
    return res.status(401).json({ message: "Não autorizado, nenhum token." }); // Adicionado return
  }
};

module.exports = { protect };
