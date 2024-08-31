const express = require('express');
const { createTransaction, getUserTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, getUserTransactions);

module.exports = router;
