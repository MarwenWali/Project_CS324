const express = require('express');
const { getBudget, updateBudget } = require('../controllers/budgetController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getBudget);
router.put('/', auth, updateBudget);

module.exports = router;