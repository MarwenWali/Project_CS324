import React from 'react'

export default function Charts({ monthlyData, stats }) {
  // Simple chart implementation - you can replace with Chart.js or other library
  const categories = Object.keys(monthlyData || {})
  const amounts = Object.values(monthlyData || {})

  return (
    <div className="charts">
      <div className="chart">
        <h3>Spending by Category</h3>
        <div className="chart-bars">
          {categories.map((category, index) => (
            <div key={category} className="chart-bar">
              <div className="bar-label">{category}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ width: `${(amounts[index] / Math.max(...amounts, 1)) * 100}%` }}
                ></div>
              </div>
              <div className="bar-amount">${amounts[index]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}