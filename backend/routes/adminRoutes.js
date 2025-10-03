const express = require('express');
const router = express.Router();
const { 
    loginAdmin, 
    getDashboardStats,
    adminGetAllBoxes,
    adminCreateBox,
    adminUpdateBox,
    adminDeleteBox,
    adminGetAllUsers,
    adminGetUserById
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');

router.post('/login', loginAdmin);


router.get('/stats', protect, adminProtect, getDashboardStats);

router.get('/boxes', protect, adminProtect, adminGetAllBoxes);
router.post('/boxes', protect, adminProtect, adminCreateBox);
router.put('/boxes/:id', protect, adminProtect, adminUpdateBox);
router.delete('/boxes/:id', protect, adminProtect, adminDeleteBox);

router.get('/users', protect, adminProtect, adminGetAllUsers);
router.get('/users/:id', protect, adminProtect, adminGetUserById); 

router.get('/test-auth', protect, adminProtect, (req, res) => {
    res.status(200).json({ success: true, message: 'Acesso de administrador concedido!' });
});

module.exports = router;
