require('dotenv').config();
console.log('JWT_SECRET carregado:', process.env.JWT_SECRET);


const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const boxRoutes = require('./routes/boxRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const freteRoutes = require("./routes/freteRoutes");
const profileRoutes = require("./routes/profileRoutes");


const app = express();""
const PORT = 4000;

app.use(cors({
  origin: '*',
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('APIfuncionando!');
});

// Rotas existentes
app.use('/users', userRoutes);
app.use('/boxes', boxRoutes);
app.use("/frete", freteRoutes);
app.use("/meu-perfil", profileRoutes);


// Nova rota do carrinho
app.use('/carrinho', carrinhoRoutes); 

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}` );
});
