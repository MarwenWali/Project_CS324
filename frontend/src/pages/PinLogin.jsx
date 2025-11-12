import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PinLogin() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { verifyPin } = useAuth()
  const navigate = useNavigate()

  const handlePinChange = (e) => {
    const value = e.target.value
    // Only allow digits, max 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!pin) {
      setError('Please enter your PIN')
      setLoading(false)
      return
    }

    try {
      if (verifyPin(pin)) {
        setPin('')
        navigate('/dashboard')
      } else {
        setError('Invalid PIN. Try again.')
        setPin('')
      }
    } catch (err) {
      setError(err.message || 'PIN verification failed')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pin-login-container">
      <div className="pin-login-box">
        <h1>💰 Expense Tracker</h1>
        <h2>Enter PIN</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>PIN Code</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={handlePinChange}
              placeholder="Enter 4-digit PIN"
              maxLength="6"
              autoFocus
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>

        <p className="pin-info">
          💡 Default PIN: <code>1234</code>
        </p>
        <p className="pin-hint">
          Change your PIN in the app settings
        </p>
      </div>
    </div>
  )
}
