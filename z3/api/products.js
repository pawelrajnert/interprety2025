const express = require('express');
const router = express.Router();
const products = require('../controllers/productController');
const authController = require('../controllers/authController');
const { authenticateToken, requireRole} = require('../middleware/authMiddleware');

router.get('/', products.getAllProducts)
router.get('/:id', products.getOneProduct)
router.post('/', authenticateToken, requireRole('PRACOWNIK'), products.addProducts)
// router.put('/:id', authenticateToken, requireRole('PRACOWNIK'), products.updateOneProduct)
router.put('/:id', authenticateToken, products.updateOneProduct)
router.get('/:id/seo-description', authenticateToken, requireRole('PRACOWNIK'), products.getSeoDescription)
router.get('/:id/description', authenticateToken, requireRole('PRACOWNIK'), products.getDescription)

module.exports = router;