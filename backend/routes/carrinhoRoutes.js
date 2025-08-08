// backend/routes/carrinhoRoutes.js
const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');
const { protect } = require('../middleware/authMiddleware'); // 1. Importa nosso segurança

// 2. Define a rota para adicionar um item
// Note como o 'protect' vem antes do 'adicionarItem'.
// Isso força a verificação do token ANTES de executar a lógica do controlador.
router.post('/adicionar', protect, carrinhoController.adicionarItem);

router.get('/', protect, carrinhoController.verCarrinho);

router.delete('/item/:id', protect, carrinhoController.removerItem);

module.exports = router;
