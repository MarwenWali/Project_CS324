/**
 * Frontend Storage Service
 * Manages all data persistence using localStorage
 * No database or backend required
 */

// Default user ID
const DEFAULT_USER_ID = 'default-user'

// ==================== EXPENSE STORAGE ====================
export const expenseStorage = {
  // Get all expenses for current user
  getExpenses: () => {
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '{}')
    return allExpenses[DEFAULT_USER_ID] || []
  },

  // Add new expense
  addExpense: (amount, category, description, date) => {
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '{}')
    if (!allExpenses[DEFAULT_USER_ID]) {
      allExpenses[DEFAULT_USER_ID] = []
    }

    const newExpense = {
      _id: Date.now().toString(),
      userId: DEFAULT_USER_ID,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date).toISOString(),
      createdAt: new Date().toISOString()
    }

    allExpenses[DEFAULT_USER_ID].push(newExpense)
    localStorage.setItem('expenses', JSON.stringify(allExpenses))

    return newExpense
  },

  // Update expense
  updateExpense: (expenseId, updates) => {
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '{}')
    const expenses = allExpenses[DEFAULT_USER_ID] || []

    const index = expenses.findIndex(e => e._id === expenseId)
    if (index === -1) throw new Error('Expense not found')

    expenses[index] = {
      ...expenses[index],
      ...updates,
      amount: updates.amount ? parseFloat(updates.amount) : expenses[index].amount,
      _id: expenses[index]._id // Keep original ID
    }

    allExpenses[DEFAULT_USER_ID] = expenses
    localStorage.setItem('expenses', JSON.stringify(allExpenses))

    return expenses[index]
  },

  // Delete expense
  deleteExpense: (expenseId) => {
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '{}')
    if (!allExpenses[DEFAULT_USER_ID]) return

    allExpenses[DEFAULT_USER_ID] = allExpenses[DEFAULT_USER_ID].filter(e => e._id !== expenseId)
    localStorage.setItem('expenses', JSON.stringify(allExpenses))
  },

  // Get expenses summary
  getSummary: () => {
    const expenses = expenseStorage.getExpenses()
    
    const summary = {
      totalExpenses: 0,
      byCategory: {},
      byMonth: {}
    }

    expenses.forEach(expense => {
      summary.totalExpenses += expense.amount

      // By category
      if (!summary.byCategory[expense.category]) {
        summary.byCategory[expense.category] = 0
      }
      summary.byCategory[expense.category] += expense.amount

      // By month
      const date = new Date(expense.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!summary.byMonth[monthKey]) {
        summary.byMonth[monthKey] = 0
      }
      summary.byMonth[monthKey] += expense.amount
    })

    return summary
  }
}

// ==================== BUDGET STORAGE ====================
export const budgetStorage = {
  // Default budget structure
  getDefaultBudget: () => ({
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
  }),

  // Get user's budget
  getBudget: () => {
    const budgets = JSON.parse(localStorage.getItem('budgets') || '{}')
    return budgets[DEFAULT_USER_ID] || budgetStorage.getDefaultBudget()
  },

  // Update budget
  updateBudget: (monthlyBudget, categories) => {
    const budgets = JSON.parse(localStorage.getItem('budgets') || '{}')

    budgets[DEFAULT_USER_ID] = {
      monthlyBudget: parseFloat(monthlyBudget),
      categories: Object.fromEntries(
        Object.entries(categories).map(([key, value]) => [key, parseFloat(value)])
      )
    }

    localStorage.setItem('budgets', JSON.stringify(budgets))
    return budgets[DEFAULT_USER_ID]
  },

  // Get budget status with remaining amounts
  getBudgetStatus: () => {
    const budget = budgetStorage.getBudget()
    const summary = expenseStorage.getSummary()

    const status = {
      ...budget,
      totalSpent: summary.totalExpenses,
      remaining: budget.monthlyBudget - summary.totalExpenses,
      expenses: summary.byCategory,
      remaining: {}
    }

    // Calculate remaining per category
    Object.keys(budget.categories).forEach(category => {
      const budgetAmount = budget.categories[category]
      const spent = summary.byCategory[category] || 0
      status.remaining[category] = budgetAmount - spent
    })

    return status
  }
}

// (Income feature removed) - income storage intentionally omitted.

// ==================== INCOME STORAGE ====================
export const incomeStorage = {
  // Get all incomes for current user
  getIncomes: () => {
    const allIncomes = JSON.parse(localStorage.getItem('incomes') || '{}')
    return allIncomes[DEFAULT_USER_ID] || []
  },

  // Add new income
  addIncome: (amount, source, description, date) => {
    const allIncomes = JSON.parse(localStorage.getItem('incomes') || '{}')
    if (!allIncomes[DEFAULT_USER_ID]) {
      allIncomes[DEFAULT_USER_ID] = []
    }

    const newIncome = {
      _id: Date.now().toString(),
      userId: DEFAULT_USER_ID,
      amount: parseFloat(amount),
      source,
      description,
      date: new Date(date).toISOString(),
      createdAt: new Date().toISOString()
    }

    allIncomes[DEFAULT_USER_ID].push(newIncome)
    localStorage.setItem('incomes', JSON.stringify(allIncomes))

    return newIncome
  },

  // Update income
  updateIncome: (incomeId, updates) => {
    const allIncomes = JSON.parse(localStorage.getItem('incomes') || '{}')
    const incomes = allIncomes[DEFAULT_USER_ID] || []

    const index = incomes.findIndex(i => i._id === incomeId)
    if (index === -1) throw new Error('Income not found')

    incomes[index] = {
      ...incomes[index],
      ...updates,
      amount: updates.amount ? parseFloat(updates.amount) : incomes[index].amount,
      _id: incomes[index]._id // Keep original ID
    }

    allIncomes[DEFAULT_USER_ID] = incomes
    localStorage.setItem('incomes', JSON.stringify(allIncomes))

    return incomes[index]
  },

  // Delete income
  deleteIncome: (incomeId) => {
    const allIncomes = JSON.parse(localStorage.getItem('incomes') || '{}')
    if (!allIncomes[DEFAULT_USER_ID]) return

    allIncomes[DEFAULT_USER_ID] = allIncomes[DEFAULT_USER_ID].filter(i => i._id !== incomeId)
    localStorage.setItem('incomes', JSON.stringify(allIncomes))
  },

  // Get incomes summary
  getSummary: () => {
    const incomes = incomeStorage.getIncomes()
    
    const summary = {
      totalIncome: 0,
      bySource: {},
      byMonth: {}
    }

    incomes.forEach(income => {
      summary.totalIncome += income.amount

      // By source
      if (!summary.bySource[income.source]) {
        summary.bySource[income.source] = 0
      }
      summary.bySource[income.source] += income.amount

      // By month
      const date = new Date(income.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (!summary.byMonth[monthKey]) {
        summary.byMonth[monthKey] = 0
      }
      summary.byMonth[monthKey] += income.amount
    })

    return summary
  }
}

// ==================== DASHBOARD STATS ====================
export const dashboardStorage = {
  // Get all dashboard stats
  getStats: () => {
    const expenses = expenseStorage.getExpenses()
    const expenseSummary = expenseStorage.getSummary()
    const incomeSummary = incomeStorage.getSummary()
    const budget = budgetStorage.getBudget()

    return {
      totalIncome: incomeSummary.totalIncome,
      totalExpenses: expenseSummary.totalExpenses,
      balance: incomeSummary.totalIncome - expenseSummary.totalExpenses,
      budgetRemaining: budget.monthlyBudget - expenseSummary.totalExpenses,
      expensesByCategory: expenseSummary.byCategory
    }
  },

  // Get monthly breakdown
  getMonthlyBreakdown: () => {
    const summary = expenseStorage.getSummary()
    return summary.byCategory
  }
}

export default {
  expenseStorage,
  budgetStorage,
  dashboardStorage
}
