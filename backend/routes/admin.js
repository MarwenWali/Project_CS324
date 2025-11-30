const express = require('express');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User');

const router = express.Router();

// List all users (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ message: 'Role updated', user: { _id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (admin only)
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get reports for a specific user (admin only)
router.get('/users/:id/reports', auth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const mongoose = require('mongoose');
    const Expense = require('../models/Expense');
    const Income = require('../models/Income');

    // Monthly summary by category for the user (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const summary = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id), date: { $gte: firstDay, $lte: lastDay } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);

    const monthlyData = {};
    summary.forEach(item => { monthlyData[item._id] = item.total; });

    // Totals (expenses and incomes)
    const totalExpensesAgg = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncomeAgg = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalExpenses = totalExpensesAgg[0]?.total || 0;
    const totalIncome = totalIncomeAgg[0]?.total || 0;

    res.json({ monthlyData, stats: { totalExpenses, totalIncome, balance: totalIncome - totalExpenses } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
