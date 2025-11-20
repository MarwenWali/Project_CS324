const Expense = require('../models/Expense.js');
const mongoose = require('mongoose');
const Income = require('../models/Income.js');

// GET ALL EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category, startDate, endDate } = req.query;
    
    // Build filter
    let filter = { userId };
    
    if (category) filter.category = category;
    if (startDate) filter.date = { $gte: new Date(startDate) };
    if (endDate) {
      filter.date = { ...filter.date, $lte: new Date(endDate) };
    }
    
    // Query database
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE EXPENSE
exports.createExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const userId = req.user.userId;
    
    // Validate
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category required' });
    }
    
    // Create
    const expense = new Expense({
      userId,
      amount: parseFloat(amount),
      category,
      description: description || '',
      date: new Date(date)
    });
    
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE EXPENSE
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Find expense
    let expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    // Check ownership
    if (expense.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Update fields
    const { amount, category, description, date } = req.body;
    if (amount !== undefined) expense.amount = amount;
    if (category) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (date) expense.date = date;
    expense.updatedAt = new Date();
    
    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    // Check ownership
    if (expense.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await Expense.findByIdAndDelete(id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET MONTHLY SUMMARY
exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Aggregate by category
    const summary = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } }
    ]);
    
    // Convert to object
    const result = {};
    summary.forEach(item => {
      result[item._id] = item.total;
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET STATISTICS
exports.getStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const totalExpenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalIncome = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expensesTotal = totalExpenses[0]?.total || 0;
    const incomeTotal = totalIncome[0]?.total || 0;

    res.json({
      totalExpenses: expensesTotal,
      totalIncome: incomeTotal,
      balance: incomeTotal - expensesTotal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};