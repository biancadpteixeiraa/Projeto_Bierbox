const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController'); 

// @route   POST /api/admin/login
// @desc    Autenticar um administrador e retornar um token
// @access  Público
router.post('/login', loginAdmin);
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

router.get('/test-auth', protect, adminProtect, (req, res) => {
    res.status(200).json({ success: true, message: 'Acesso de administrador concedido!' });
});

module.exports = router;
