require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path'); 

const userRoutes = require('./routes/userRoutes');
const boxRoutes = require('./routes/boxRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const freteRoutes = require("./routes/freteRoutes");
const profileRoutes = require("./routes/profileRoutes");
const enderecoRoutes = require('./routes/enderecoRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');


const app = express();

app.use(cors({
  origin: '*'
}));

app.use((req, res, next) => {
    // A rota do webhook do Mercado Pago é /api/pagamentos/webhook
    if (req.originalUrl === '/api/pagamentos/webhook') { // Corrigido para a rota correta do webhook
        // Se for a rota do webhook, não use o parser de JSON.
        // O SDK do Mercado Pago precisa do corpo da requisição em formato raw.
        next();
    } else {
        // Para todas as outras rotas, use o parser de JSON normalmente.
        express.json()(req, res, next);
    }
});

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
app.use('/api/enderecos', enderecoRoutes);
app.use('/api/pagamentos', pagamentoRoutes);

const HOST = '0.0.0.0'; // Escuta em todas as interfaces de rede
const PORT = process.env.PORT || 4000; // Usa a porta do ambiente (Render) ou 4000 localmente

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}` );
});
