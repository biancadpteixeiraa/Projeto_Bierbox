// index.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const boxRoutes = require('./routes/boxRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes'); // Importa as rotas do carrinho

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('APIfuncionando!');
});

// Rotas existentes
app.use('/users', userRoutes);
app.use('/boxes', boxRoutes);

// Nova rota do carrinho
app.use('/carrinho', carrinhoRoutes); // Conecta o roteador do carrinho

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}` );
});
