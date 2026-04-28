function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value) {
  return `${value.toFixed(1)}%`
}

function getMetricValue(metrics, metricId) {
  const metric = metrics.find((item) => item.id === metricId)
  return metric ? metric.value : 0
}

function getTopExpenseCategory(transactions) {
  const totalsByCategory = transactions
    .filter((item) => item.direction === 'debit')
    .reduce((accumulator, item) => {
      const currentTotal = accumulator[item.category] || 0
      return {
        ...accumulator,
        [item.category]: currentTotal + item.amount,
      }
    }, {})

  const sortedCategories = Object.entries(totalsByCategory).sort(
    (a, b) => b[1] - a[1]
  )

  if (sortedCategories.length === 0) {
    return null
  }

  return {
    name: sortedCategories[0][0],
    amount: sortedCategories[0][1],
  }
}

export function generateInsights({ metrics, transactions }) {
  const spending = getMetricValue(metrics, 'spending')
  const savings = getMetricValue(metrics, 'savings')
  const netWorth = getMetricValue(metrics, 'net-worth')

  const totalIncome = transactions
    .filter((item) => item.direction === 'credit')
    .reduce((total, item) => total + item.amount, 0)

  const totalExpenses = transactions
    .filter((item) => item.direction === 'debit')
    .reduce((total, item) => total + item.amount, 0)

  const cashflow = totalIncome - totalExpenses
  const savingsRate = spending > 0 ? (savings / spending) * 100 : 0
  const topExpenseCategory = getTopExpenseCategory(transactions)
  const insights = []

  if (cashflow > 0) {
    insights.push({
      id: 'cashflow-positive',
      priority: 'high',
      title: 'Positive monthly cashflow',
      message: `You generated ${formatCurrency(cashflow)} more income than expenses in your recent transactions. Consider auto-investing part of this surplus.`,
    })
  } else if (cashflow < 0) {
    insights.push({
      id: 'cashflow-negative',
      priority: 'high',
      title: 'Cashflow needs attention',
      message: `Your recent expenses exceeded income by ${formatCurrency(
        Math.abs(cashflow)
      )}. Reduce discretionary categories first to stabilize your runway.`,
    })
  }

  if (topExpenseCategory) {
    const topExpenseShare =
      totalExpenses > 0 ? (topExpenseCategory.amount / totalExpenses) * 100 : 0

    insights.push({
      id: 'top-expense-category',
      priority: 'medium',
      title: `${topExpenseCategory.name} is your top expense category`,
      message: `${formatCurrency(topExpenseCategory.amount)} (${formatPercent(
        topExpenseShare
      )}) of recent spend is concentrated in ${topExpenseCategory.name}. A 10% reduction here can improve monthly savings quickly.`,
    })
  }

  insights.push({
    id: 'savings-efficiency',
    priority: savingsRate >= 35 ? 'low' : 'medium',
    title: 'Savings efficiency signal',
    message: `Current savings rate is ${formatPercent(
      savingsRate
    )} based on ${formatCurrency(savings)} savings over ${formatCurrency(
      spending
    )} spending. ${
      savingsRate >= 35
        ? 'You are operating above a strong savings benchmark.'
        : 'Push toward a 35% target for stronger long-term compounding.'
    }`,
  })

  insights.push({
    id: 'net-worth-momentum',
    priority: 'low',
    title: 'Net worth momentum',
    message: `At ${formatCurrency(
      netWorth
    )} net worth, maintaining consistent monthly contributions creates meaningful compounding over the next 12 months.`,
  })

  return insights
}
