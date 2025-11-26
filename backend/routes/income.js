const express = require('express');
const { createIncome, getIncomes, getTotalIncome, deleteIncome } = require('../controllers/incomeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createIncome);
router.get('/', auth, getIncomes);
router.get('/total', auth, getTotalIncome);
router.delete('/:id', auth, deleteIncome);

module.exports = router;
