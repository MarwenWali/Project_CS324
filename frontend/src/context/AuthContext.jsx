import React, { createContext, useState, useContext } from 'react'

// Lightweight AuthContext simplified: app has no login/logout.
// Components can still call useAuth() for compatibility but
// authentication is always considered active.

export const AuthContext = createContext()

const DEFAULT_USER = {
  id: 'default-user',
  name: 'User'
}

export const AuthProvider = ({ children }) => {
  // Keep a stable user object for legacy UI that reads user.name
  const [user] = useState(DEFAULT_USER)

  const value = {
    user,
    // Stubs for compatibility
    verifyPin: () => true,
    changePin: () => true,
    logout: () => {},
    isAuthenticated: true
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}