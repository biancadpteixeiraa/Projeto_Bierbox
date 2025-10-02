const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, enderecoController.getEnderecos) 
    .post(protect, enderecoController.addEndereco);   

router.route('/:id')
    .get(protect, enderecoController.getEnderecoById)
    .put(protect, enderecoController.updateEndereco) 
    .delete(protect, enderecoController.deleteEndereco); 

module.exports = router;
