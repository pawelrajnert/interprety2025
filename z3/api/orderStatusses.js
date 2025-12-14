const express = require('express');
const router = express.Router();
const orderStatusses = require('../controllers/orderStatusController');

router.get('/', orderStatusses.getStatuses)

module.exports = router;