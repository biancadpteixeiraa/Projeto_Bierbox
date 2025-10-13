require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const boxRoutes = require("./routes/boxRoutes");
const carrinhoRoutes = require("./routes/carrinhoRoutes");
const freteRoutes = require("./routes/freteRoutes");
const profileRoutes = require("./routes/profileRoutes");
const enderecoRoutes = require("./routes/enderecoRoutes");
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const assinaturaRoutes = require("./routes/assinaturaRoutes");
const adminRoutes = require('./routes/adminRoutes');

const app = express();

console.log("🚀 DATABASE_URL encontrada?", process.env.DATABASE_URL ? "SIM" : "NÃO");
console.log("📌 Valor da DATABASE_URL:", process.env.DATABASE_URL);

app.use(cors({
  origin: "*",
}));

app.use((req, res, next) => {
    if (req.originalUrl === "/api/pagamentos/webhook") {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.use("/users", userRoutes);
app.use("/boxes", boxRoutes);
app.use("/frete", freteRoutes);
app.use("/meu-perfil", profileRoutes);
app.use("/carrinho", carrinhoRoutes);
app.use("/api/enderecos", enderecoRoutes);
app.use("/api/pagamentos", pagamentoRoutes);
app.use("/api/assinaturas", assinaturaRoutes);
app.use('/api/admin', adminRoutes);

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 4000;

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}` );
});
