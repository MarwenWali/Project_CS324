import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { budgetStorage } from '../services/storage'
import Navbar from '../components/Navbar'

export default function Budget() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    monthlyBudget: 0,
    categories: {
      Food: 0,
      Transportation: 0,
      Entertainment: 0,
      Utilities: 0,
      Healthcare: 0,
      Shopping: 0,
      Other: 0
    }
  })

  useEffect(() => {
    fetchBudget()
  }, [token])

  const fetchBudget = () => {
    try {
      const budgetData = budgetStorage.getBudget()
      setFormData({
        monthlyBudget: budgetData.monthlyBudget,
        categories: budgetData.categories
      })
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch budget')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'monthlyBudget') {
      setFormData(prev => ({
        ...prev,
        monthlyBudget: parseFloat(value) || 0
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [name]: parseFloat(value) || 0
        }
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      budgetStorage.updateBudget(formData.monthlyBudget, formData.categories)
      alert('Budget updated successfully!')
      fetchBudget() // Refresh data
    } catch (err) {
      setError(err.message || 'Failed to update budget')
    }
  }

  if (loading) return (
    <div>
      <Navbar />
      <div className="loading">Loading...</div>
    </div>
  )

  return (
    <div>
      <Navbar />
      <div className="budget-page">
        <h1>Budget Settings</h1>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="budget-form">
          <h3>Category Budgets</h3>
          {Object.keys(formData.categories).map(category => (
            <div key={category} className="form-group">
              <label>{category}:</label>
              <input
                type="number"
                name={category}
                value={formData.categories[category]}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          ))}
          
          <button type="submit">Update Budget</button>
        </form>
      </div>
    </div>
  )
}