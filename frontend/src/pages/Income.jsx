import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { incomeStorage } from '../services/storage'

export default function Income() {
  const [incomes, setIncomes] = useState([])
  const [formData, setFormData] = useState({
    amount: '',
    source: 'Salary',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadIncomes()
  }, [])

  const loadIncomes = () => {
    try {
      const allIncomes = incomeStorage.getIncomes()
      setIncomes(allIncomes)
    } catch (error) {
      console.error('Error loading incomes:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : parseFloat(value)) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    try {
      if (editingId) {
        incomeStorage.updateIncome(editingId, formData)
        setEditingId(null)
      } else {
        incomeStorage.addIncome(
          formData.amount,
          formData.source,
          formData.description,
          formData.date
        )
      }
      setFormData({
        amount: '',
        source: 'Salary',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
      loadIncomes()
    } catch (error) {
      alert('Error saving income: ' + error.message)
    }
  }

  const handleEdit = (income) => {
    setEditingId(income._id)
    setFormData({
      amount: income.amount,
      source: income.source,
      description: income.description,
      date: income.date.split('T')[0]
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      amount: '',
      source: 'Salary',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleDelete = (incomeId) => {
    if (window.confirm('Are you sure you want to delete this income?')) {
      try {
        incomeStorage.deleteIncome(incomeId)
        loadIncomes()
      } catch (error) {
        alert('Error deleting income: ' + error.message)
      }
    }
  }

  const totalIncome = incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0)

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <h1> Income</h1>
        <div className="summary-cards">
          <div className="card">
            <h3>Total Income</h3>
            <p className="amount">${totalIncome.toFixed(2)}</p>
            <p className="subtext">{incomes.length} income entries</p>
          </div>
        </div>
        <div className="form-section">
          <h2>{editingId ? ' Edit Income' : ' Add New Income'}</h2>
          <form onSubmit={handleSubmit} className="income-form">
            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="source">Source</label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                placeholder="e.g., Salary, Freelance"
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add notes about this income..."
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Income' : 'Add Income'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="list-section">
          <h2> Income List</h2>
          {incomes.length > 0 ? (
            <div className="income-list">
              {incomes
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(income => (
                  <div key={income._id} className="income-item">
                    <div className="income-header">
                      <div className="income-main">
                        <h3>{income.source}</h3>
                        <p className="date">{new Date(income.date).toLocaleDateString()}</p>
                        {income.description && <p className="description">{income.description}</p>}
                      </div>
                      <div className="income-amount">
                        <p className="amount">${income.amount.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="income-actions">
                      <button onClick={() => handleEdit(income)} className="btn-edit">
                         Edit
                      </button>
                      <button onClick={() => handleDelete(income._id)} className="btn-delete">
                         Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No income entries found.</p>
              <p>Start by adding your first income above! </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
