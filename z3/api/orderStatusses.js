const express = require('express');
const router = express.Router();
const orderStatusses = require('../controllers/orderStatusController');
const {authenticateToken} = require("../middleware/authMiddleware");

router.get('/', authenticateToken, orderStatusses.getStatuses)

module.exports = router;