import React, { useEffect, useState } from 'react'
import { dashboardStorage, budgetStorage } from '../services/storage'
import Navbar from '../components/Navbar'
import SummaryCards from '../components/SummaryCards'
import Charts from '../components/Charts'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    try {
      const stats = dashboardStorage.getStats()
      const monthlyBreakdown = dashboardStorage.getMonthlyBreakdown()
      const budget = budgetStorage.getBudget()

      setData({
        stats,
        monthlyBreakdown,
        budget
      })
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch data')
      setLoading(false)
    }
  }

  if (loading) return (
    <div>
      <Navbar />
      <div className="loading">Loading...</div>
    </div>
  )
  
  if (error) return (
    <div>
      <Navbar />
      <div className="error">{error}</div>
    </div>
  )

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <h1>Dashboard</h1>
        
        <SummaryCards
          totalExpenses={data.stats.totalExpenses}
          balance={data.stats.balance}
          budgetRemaining={data.stats.budgetRemaining}
        />

        <Charts
          monthlyData={data.monthlyBreakdown}
          stats={data.stats}
        />
      </div>
    </div>
  )
}