const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  monthlyBudget: {
    type: Number,
    default: 0,
    min: 0
  },
  categories: {
    Food: { type: Number, default: 0 },
    Transportation: { type: Number, default: 0 },
    Entertainment: { type: Number, default: 0 },
    Utilities: { type: Number, default: 0 },
    Healthcare: { type: Number, default: 0 },
    Shopping: { type: Number, default: 0 },
    Other: { type: Number, default: 0 }
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

module.exports = mongoose.model('Budget', BudgetSchema);