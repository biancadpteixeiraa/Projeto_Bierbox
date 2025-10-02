const express = require('express');
const router = express.Router();
const { 
    loginAdmin, 
    getDashboardStats,
    adminGetAllBoxes,
    adminCreateBox,
    adminUpdateBox,
    adminDeleteBox
} = require('../controllers/adminController'); 
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

router.post('/login', loginAdmin);

// Rota de Estatísticas
router.get('/stats', protect, adminProtect, getDashboardStats);

// Rotas de Gestão de Produtos (Boxes)
router.get('/boxes', protect, adminProtect, adminGetAllBoxes);
router.post('/boxes', protect, adminProtect, adminCreateBox); 
router.put('/boxes/:id', protect, adminProtect, adminUpdateBox);
router.delete('/boxes/:id', protect, adminProtect, adminDeleteBox);


router.get('/test-auth', protect, adminProtect, (req, res) => {
    res.status(200).json({ success: true, message: 'Acesso de administrador concedido!' });
});

module.exports = router;
