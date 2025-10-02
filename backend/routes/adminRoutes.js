const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController'); 

// @route   POST /api/admin/login
// @desc    Autenticar um administrador e retornar um token
// @access  Público
router.post('/login', loginAdmin);

module.exports = router;
