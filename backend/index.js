// backend/index.js
const express = require('express');
const cors = require('cors');

// Importa os arquivos de rotas
const userRoutes = require('./routes/userRoutes');
const boxRoutes = require('./routes/boxRoutes'); // 1. Importa as rotas das boxes

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota principal da API (para teste)
app.get('/', (req, res) => {
  res.send('API do Bierbox funcionando! 🍻');
});

// Conecta os roteadores ao nosso app
app.use('/users', userRoutes);
app.use('/boxes', boxRoutes); // 2. Usa as rotas das boxes para a URL /boxes

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}` );
});
