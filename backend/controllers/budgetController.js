const Budget = require('../models/budget.js');
const Expense = require('../models/Expense.js');
const mongoose = require('mongoose');

// GET BUDGET
exports.getBudget = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    let budget = await Budget.findOne({ userId });
    
    if (!budget) {
      // Create default budget if doesn't exist
      budget = new Budget({ userId });
      await budget.save();
    }
    
    // Calculate current month expenses by category
    const currentMonth = new Date();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: firstDay, $lte: lastDay }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Convert expenses to object
    const expensesByCategory = {};
    expenses.forEach(expense => {
      expensesByCategory[expense._id] = expense.total;
    });
    
    // Calculate remaining budget
    const remainingByCategory = {};
    Object.keys(budget.categories).forEach(category => {
      const spent = expensesByCategory[category] || 0;
      const budgeted = budget.categories[category] || 0;
      remainingByCategory[category] = budgeted - spent;
    });
    
    // Compute monthlyBudget as sum of category budgets to keep it consistent
    const monthlyBudgetComputed = Object.values(budget.categories || {}).reduce((s, v) => s + (v || 0), 0);

    res.json({
      monthlyBudget: monthlyBudgetComputed,
      categories: budget.categories,
      expenses: expensesByCategory,
      remaining: remainingByCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE BUDGET
exports.updateBudget = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { categories } = req.body;
    
    let budget = await Budget.findOne({ userId });
    
    if (!budget) {
      budget = new Budget({ userId });
    }
    
    if (categories) {
      Object.keys(categories).forEach(category => {
        if (budget.categories[category] !== undefined) {
          budget.categories[category] = categories[category];
        }
      });
    }
    // Recompute monthlyBudget from category sums
    budget.monthlyBudget = Object.values(budget.categories || {}).reduce((s, v) => s + (v || 0), 0);
    budget.updatedAt = new Date();
    await budget.save();
    
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};