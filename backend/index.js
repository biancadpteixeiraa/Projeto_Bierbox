const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // 1. Importa nosso arquivo de rotas

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(express.json()); // Essencial para o backend entender JSON

// Rota principal da API (para teste)
app.get('/', (req, res) => {
  res.send('API do Bierbox funcionando! 🍻');
});

// 2. Conecta o roteador de usuários ao nosso app
// Diz ao Express: "Qualquer URL que começar com '/users',
// passe para o 'userRoutes' (nossa recepcionista) resolver."
app.use('/users', userRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}` );
});
