const BUDGET_CATEGORIES = [
  { id: 'housing', name: 'Housing', spent: 2210, budget: 2500 },
  { id: 'food', name: 'Food & Dining', spent: 530, budget: 900 },
  { id: 'transport', name: 'Transportation', spent: 380, budget: 600 },
  { id: 'utilities', name: 'Utilities', spent: 310, budget: 450 },
  { id: 'entertainment', name: 'Entertainment', spent: 260, budget: 500 },
]

const BUDGET_HISTORY = [
  { month: 'May', budget: 4300, actual: 3980 },
  { month: 'Jun', budget: 4300, actual: 4210 },
  { month: 'Jul', budget: 4300, actual: 3890 },
  { month: 'Aug', budget: 4300, actual: 4170 },
  { month: 'Sep', budget: 4300, actual: 4250 },
  { month: 'Oct', budget: 4300, actual: 4025 },
]

export async function getBudgetIntelligence() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 500)
  })

  return {
    categories: BUDGET_CATEGORIES,
    history: BUDGET_HISTORY,
  }
}
