const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, enderecoController.getEnderecos)      // Buscar todos os endereços
    .post(protect, enderecoController.addEndereco);     // Adicionar um novo endereço

router.route('/:id')
    .put(protect, enderecoController.updateEndereco)       // Atualizar um endereço específico
    .delete(protect, enderecoController.deleteEndereco);    // Apagar um endereço específico

module.exports = router;
