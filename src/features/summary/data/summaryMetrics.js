const SUMMARY_METRICS = [
  {
    id: 'net-worth',
    title: 'Net Worth',
    value: 284620,
    delta: 4.8,
    trend: 'up',
    helperText: 'Updated from linked accounts',
  },
  {
    id: 'spending',
    title: 'Monthly Spending',
    value: 4280,
    delta: 2.1,
    trend: 'down',
    helperText: 'Compared to last month',
  },
  {
    id: 'savings',
    title: 'Monthly Savings',
    value: 1765,
    delta: 6.4,
    trend: 'up',
    helperText: 'On track for annual goal',
  },
]

export async function getSummaryMetrics() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 500)
  })

  return SUMMARY_METRICS
}
