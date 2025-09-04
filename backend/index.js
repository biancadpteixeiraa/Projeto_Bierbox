require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path'); 

const userRoutes = require('./routes/userRoutes');
const boxRoutes = require('./routes/boxRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const freteRoutes = require("./routes/freteRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
const PORT = 4000;

app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Configura o Express para servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.use('/users', userRoutes);
app.use('/boxes', boxRoutes);
app.use("/frete", freteRoutes);
app.use("/meu-perfil", profileRoutes);
app.use('/carrinho', carrinhoRoutes); 

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}` );
});
