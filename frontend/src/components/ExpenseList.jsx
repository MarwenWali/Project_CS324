import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { expenseStorage } from '../services/storage'

export default function ExpenseList({ expenses, onExpenseDeleted, onExpenseUpdated }) {
  const { token } = useAuth()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other']

  const handleDelete = (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return

    try {
      expenseStorage.deleteExpense(expenseId)
      onExpenseDeleted(expenseId)
    } catch (err) {
      alert(err.message || 'Failed to delete expense')
    }
  }

  const startEdit = (expense) => {
    setEditingId(expense._id)
    setEditForm({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date.split('T')[0]
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  const handleEditSubmit = (expenseId) => {
    try {
      const updatedExpense = expenseStorage.updateExpense(expenseId, editForm)
      onExpenseUpdated(updatedExpense)
      setEditingId(null)
      setEditForm({})
    } catch (err) {
      alert(err.message || 'Failed to update expense')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="expense-list">
      <h3>Recent Expenses</h3>
      
      {expenses.length === 0 ? (
        <p>No expenses found. Add your first expense!</p>
      ) : (
        <div className="expenses">
          {expenses.map(expense => (
            <div key={expense._id} className="expense-item">
              {editingId === expense._id ? (
                <div className="expense-edit">
                  <input
                    type="number"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    step="0.01"
                  />
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleEditSubmit(expense._id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="expense-details">
                    <div className="expense-amount">{formatCurrency(expense.amount)}</div>
                    <div className="expense-category">{expense.category}</div>
                    <div className="expense-description">{expense.description}</div>
                    <div className="expense-date">{formatDate(expense.date)}</div>
                  </div>
                  <div className="expense-actions">
                    <button onClick={() => startEdit(expense)}>Edit</button>
                    <button onClick={() => handleDelete(expense._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}