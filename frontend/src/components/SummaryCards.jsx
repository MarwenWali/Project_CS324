import React from 'react'

export default function SummaryCards({ totalExpenses, balance, budgetRemaining }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="summary-cards">
      <div className="summary-card expenses">
        <h3>Total Expenses</h3>
        <div className="amount">{formatCurrency(totalExpenses)}</div>
      </div>
      
      <div className="summary-card balance">
        <h3>Balance</h3>
        <div className="amount">{formatCurrency(balance)}</div>
      </div>
      
      <div className="summary-card budget">
        <h3>Budget Remaining</h3>
        <div className="amount">{formatCurrency(budgetRemaining)}</div>
      </div>
    </div>
  )
}