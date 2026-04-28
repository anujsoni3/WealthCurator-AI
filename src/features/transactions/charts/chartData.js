export function buildCategorySpendData(transactions) {
  const totalsByCategory = transactions
    .filter((item) => item.direction === 'debit')
    .reduce((accumulator, item) => {
      const currentTotal = accumulator[item.category] || 0
      return {
        ...accumulator,
        [item.category]: currentTotal + item.amount,
      }
    }, {})

  return Object.entries(totalsByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export function buildCashflowData(transactions) {
  const income = transactions
    .filter((item) => item.direction === 'credit')
    .reduce((sum, item) => sum + item.amount, 0)
  const expenses = transactions
    .filter((item) => item.direction === 'debit')
    .reduce((sum, item) => sum + item.amount, 0)

  return [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ]
}
