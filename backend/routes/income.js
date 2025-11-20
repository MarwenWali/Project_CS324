const express = require('express');
const { createIncome, getIncomes, getTotalIncome } = require('../controllers/incomeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createIncome);
router.get('/', auth, getIncomes);
router.get('/total', auth, getTotalIncome);

module.exports = router;
