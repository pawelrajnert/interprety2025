const express = require('express');
const router = express.Router();
const products = require('../controllers/productController');

router.get('/', products.getAllProducts)
router.get('/:id', products.getOneProduct)
router.post('/', products.addProducts)
router.put('/:id', products.updateOneProduct)

module.exports = router;