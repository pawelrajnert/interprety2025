const express = require('express');
const router = express.Router();
const orders = require('../controllers/orderController');
const {authenticateToken} = require("../middleware/authMiddleware");

router.get('/', authenticateToken, orders.getAllOrders)
router.post('/', authenticateToken, orders.addOrders)
router.patch('/:id', authenticateToken, orders.updateOneOrder)
router.get('/status/:id', authenticateToken, orders.getOrdersByStatus)
router.post('/:id/opinions', authenticateToken, orders.addOpinion)

module.exports = router;