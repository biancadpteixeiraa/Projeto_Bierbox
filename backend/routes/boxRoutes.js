
const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');

// Rota para buscar todas as boxes
router.get('/', boxController.getAllBoxes);

// Rota para buscar uma box específica pelo  ID
router.get('/:id', boxController.getBoxById); 

module.exports = router;
