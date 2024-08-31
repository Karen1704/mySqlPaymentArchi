const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.post('/top-up', authMiddleware, userController.topUpBalance);
router.post('/transactions', authMiddleware, userController.createTransaction);
router.get('/transactions', authMiddleware, userController.getUserTransactions);

module.exports = router;
