import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { expenseStorage } from '../services/storage'
import Navbar from '../components/Navbar'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'

export default function Expenses() {
  const { token } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchExpenses()
  }, [token])

  const fetchExpenses = () => {
    try {
      const data = expenseStorage.getExpenses()
      // Sort by date descending
      setExpenses(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch expenses')
      setLoading(false)
    }
  }

  const handleExpenseAdded = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev])
  }

  const handleExpenseDeleted = (expenseId) => {
    setExpenses(prev => prev.filter(expense => expense._id !== expenseId))
  }

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses(prev => prev.map(expense => 
      expense._id === updatedExpense._id ? updatedExpense : expense
    ))
  }

  return (
    <div>
      <Navbar />
      <div className="expenses-page">
        <h1>Expenses</h1>
        
        <div className="expenses-layout">
          <div className="expenses-form">
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          </div>
          
          <div className="expenses-list">
            {loading ? (
              <div>Loading expenses...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <ExpenseList
                expenses={expenses}
                onExpenseDeleted={handleExpenseDeleted}
                onExpenseUpdated={handleExpenseUpdated}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}