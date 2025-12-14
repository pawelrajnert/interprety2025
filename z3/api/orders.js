const express = require('express');
const router = express.Router();
const orders = require('../controllers/orderController');

router.get('/', orders.getAllOrders)
router.post('/',orders.addOrders)
router.patch('/:id', orders.updateOneOrder)
router.get('/status/:id', orders.getOrdersByStatus)

module.exports = router;