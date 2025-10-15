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
const pagamentoRoutes = require("./routes/pagamentoRoutes");
const assinaturaRoutes = require("./routes/assinaturaRoutes");
const adminRoutes = require("./routes/adminRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const app = express();

console.log("🚀 DATABASE_URL encontrada?", process.env.DATABASE_URL ? "SIM" : "NÃO");
console.log("📌 Valor da DATABASE_URL:", process.env.DATABASE_URL);

app.use(cors({ origin: "*" }));

app.post("/stripe/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  require("./pagamentoStripeController").webhookStripe(req, res, next);
});

app.use(express.json());

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
app.use("/api/admin", adminRoutes);
app.use("/stripe", stripeRoutes);
app.use("/stripe", protect, stripeRoutes);


const HOST = "0.0.0.0";
const PORT = process.env.PORT || 4000;

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
