const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for performance
ExpenseSchema.index({ userId: 1 });
ExpenseSchema.index({ date: 1 });
ExpenseSchema.index({ category: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
