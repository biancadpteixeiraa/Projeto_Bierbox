const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');
const { protect } = require('../middleware/authMiddleware');

router.post('/adicionar', protect, carrinhoController.adicionarItem);

router.get('/', protect, carrinhoController.verCarrinho);

router.delete('/remover/:box_id', protect, carrinhoController.removerItem);

module.exports = router;
