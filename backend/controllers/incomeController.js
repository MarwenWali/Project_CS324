const Income = require('../models/Income');

// Create income entry
exports.createIncome = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, description, date } = req.body;

    if (amount === undefined || amount < 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const income = new Income({ userId, amount, description: description || '', date: date ? new Date(date) : undefined });
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all incomes for the user
exports.getIncomes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total income (optionally for current month)
exports.getTotalIncome = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month } = req.query; // optional

    let match = { userId: require('mongoose').Types.ObjectId(userId) };

    if (month === 'current') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      match.date = { $gte: firstDay, $lte: lastDay };
    }

    const result = await Income.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({ total: result[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
