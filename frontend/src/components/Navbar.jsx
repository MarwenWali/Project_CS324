import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">💰 Expense Tracker</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/income">Income</Link>
        <Link to="/budget">Budget</Link>
        <Link to="/reports">Reports</Link>
      </div>
      
      <div className="nav-user">
        <span>Welcome, {user?.name}</span>
      </div>
    </nav>
  )
}