const express = require('express');
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
  getStats
} = require('../controllers/expenseController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getExpenses);
router.post('/', auth, createExpense);
router.put('/:id', auth, updateExpense);
router.delete('/:id', auth, deleteExpense);
router.get('/summary/monthly', auth, getMonthlySummary);
router.get('/stats', auth, getStats);

module.exports = router;