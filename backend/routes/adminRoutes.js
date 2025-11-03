const express = require('express'); 
const router = express.Router(); 
const { 
    loginAdmin, 
    getDashboardStats, 
    adminGetAllBoxes,
    adminGetBoxById, 
    adminCreateBox, 
    adminUpdateBox, 
    adminDeleteBox, 
    adminGetAllUsers, 
    adminGetUserById, 
    adminGetAllPedidos, 
    adminGetPedidoById, 
    adminUpdatePedido,
    adminGetAllAssinaturas, 
    adminGetAssinaturaById, 
    adminCancelAssinatura, 
    adminPauseAssinatura,
    adminReactivateAssinatura 
} = require('../controllers/adminController'); 

const { protect } = require('../middleware/authMiddleware'); 
const { adminProtect } = require('../middleware/adminMiddleware'); 

router.post('/login', loginAdmin); 
router.get('/stats', protect, adminProtect, getDashboardStats); 
router.get('/boxes', protect, adminProtect, adminGetAllBoxes);
router.get('/boxes/:id', protect, adminProtect, adminGetBoxById);
router.post('/boxes', protect, adminProtect, adminCreateBox); 
router.put('/boxes/:id', protect, adminProtect, adminUpdateBox); 
router.delete('/boxes/:id', protect, adminProtect, adminDeleteBox); 
router.get('/users', protect, adminProtect, adminGetAllUsers); 
router.get('/users/:id', protect, adminProtect, adminGetUserById); 
router.get('/pedidos', protect, adminProtect, adminGetAllPedidos); 
router.get('/pedidos/:id', protect, adminProtect, adminGetPedidoById); 
router.put('/pedidos/:id', protect, adminProtect, adminUpdatePedido);
router.get('/assinaturas', protect, adminProtect, adminGetAllAssinaturas);
router.get('/assinaturas/:id', protect, adminProtect, adminGetAssinaturaById);
router.put('/assinaturas/:id/cancelar', protect, adminProtect, adminCancelAssinatura);
router.put('/assinaturas/:id/pausar', protect, adminProtect, adminPauseAssinatura);
router.put('/assinaturas/:id/reativar', protect, adminProtect, adminReactivateAssinatura);


router.get('/test-auth', protect, adminProtect, (req, res) => { 
    res.status(200).json({ success: true, message: 'Acesso de administrador concedido!' });
 }); 

module.exports = router;
