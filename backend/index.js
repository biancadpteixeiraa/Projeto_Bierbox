require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const { protect } = require("./middleware/authMiddleware");

const userRoutes = require("./routes/userRoutes");
const boxRoutes = require("./routes/boxRoutes");
const carrinhoRoutes = require("./routes/carrinhoRoutes");
const freteRoutes = require("./routes/freteRoutes");
const profileRoutes = require("./routes/profileRoutes");
const enderecoRoutes = require("./routes/enderecoRoutes");
const assinaturaRoutes = require("./routes/assinaturaRoutes");
const adminRoutes = require("./routes/adminRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

// Importe o controlador do Stripe
const { webhookStripe } = require("./controllers/pagamentoStripeController");

const app = express();

console.log("🚀 DATABASE_URL encontrada?", process.env.DATABASE_URL ? "SIM" : "NÃO");
console.log("📌 Valor da DATABASE_URL:", process.env.DATABASE_URL);

// CORS
app.use(cors({ origin: "*" }));

// Webhook Stripe: deve vir ANTES do express.json()
// Use uma rota consistente com o resto da sua API
app.post(
  "/api/stripe/webhook", // Rota corrigida e consistente
  express.raw({ type: "application/json" }),
  webhookStripe // Chama a função do controlador diretamente
);

// Parser padrão para todas as outras rotas
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota teste
app.get("/", (req, res) => {
  res.send("API funcionando!");
});

// Rotas
app.use("/users", userRoutes);
app.use("/boxes", boxRoutes);
app.use("/frete", freteRoutes);
app.use("/meu-perfil", profileRoutes);
app.use("/carrinho", carrinhoRoutes);
app.use("/api/enderecos", enderecoRoutes);
app.use("/api/assinaturas", assinaturaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stripe", stripeRoutes); 

const HOST = "0.0.0.0";
const PORT = process.env.PORT || 4000;

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}` );
});
