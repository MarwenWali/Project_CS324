import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Income from './pages/Income'
import Budget from './pages/Budget'
import Reports from './pages/Reports'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
  <Route path="/budget" element={<Budget />} />
  <Route path="/reports" element={<Reports />} />
  <Route path="/income" element={<Income />} />

        {/* Default Route - open dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* 404 Route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </div>
  )
}

export default App