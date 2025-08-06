// backend/routes/boxRoutes.js
const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');

// Rota para buscar todas as boxes (já existia)
router.get('/', boxController.getAllBoxes);

// Nova Rota para buscar uma box específica pelo seu ID
router.get('/:id', boxController.getBoxById); // Adicione esta linha

module.exports = router;
