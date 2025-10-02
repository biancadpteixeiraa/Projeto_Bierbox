const express = require('express');
const router = express.Router();
const { loginAdmin, getDashboardStats } = require('../controllers/adminController'); 
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

router.post('/login', loginAdmin);

router.get('/stats', protect, adminProtect, getDashboardStats);


router.get('/test-auth', protect, adminProtect, (req, res) => {
    res.status(200).json({ success: true, message: 'Acesso de administrador concedido!' });
});

module.exports = router;
