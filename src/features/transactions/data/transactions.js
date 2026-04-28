const MOCK_TRANSACTIONS = [
  {
    id: 'txn-001',
    date: '2026-04-26',
    description: 'Salary Deposit',
    category: 'Income',
    amount: 6200,
    direction: 'credit',
    account: 'Primary Checking',
  },
  {
    id: 'txn-002',
    date: '2026-04-25',
    description: 'Apartment Rent',
    category: 'Housing',
    amount: 1850,
    direction: 'debit',
    account: 'Primary Checking',
  },
  {
    id: 'txn-003',
    date: '2026-04-24',
    description: 'Mutual Fund SIP',
    category: 'Investments',
    amount: 500,
    direction: 'debit',
    account: 'Brokerage',
  },
  {
    id: 'txn-004',
    date: '2026-04-23',
    description: 'Grocery Store',
    category: 'Food',
    amount: 132,
    direction: 'debit',
    account: 'Rewards Credit Card',
  },
  {
    id: 'txn-005',
    date: '2026-04-22',
    description: 'Freelance Project',
    category: 'Income',
    amount: 940,
    direction: 'credit',
    account: 'Primary Checking',
  },
]

export async function getTransactions() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 650)
  })

  return MOCK_TRANSACTIONS
}
