export const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', sectionId: null },
  { id: 'analytics', label: 'Analytics', sectionId: 'designSystem' },
  { id: 'portfolio', label: 'Accounts', sectionId: 'portfolio' },
  { id: 'transactions', label: 'Transactions', sectionId: 'transactions' },
  { id: 'budgets', label: 'Budgets', sectionId: 'budgets' },
  { id: 'insights', label: 'Insights', sectionId: 'insights' },
]

export const DASHBOARD_SECTIONS = [
  {
    id: 'designSystem',
    title: 'Proton Finance Design System',
    description: 'Typography, color tokens, controls, and premium fintech UI primitives.',
    keywords: [
      'design system',
      'analytics',
      'ui kit',
      'typography',
      'color tokens',
      'controls',
      'proton',
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio Overview',
    description: 'High-level strategy, alerts, and account activity snapshot.',
    keywords: [
      'portfolio',
      'dashboard',
      'overview',
      'market',
      'analysis',
      'alerts',
      'strategy',
      'accounts',
    ],
  },
  {
    id: 'budgets',
    title: 'Budget Intelligence',
    description: 'Category budget utilization and monthly allocation trends.',
    keywords: ['budgets', 'budget', 'spending', 'allocation', 'categories'],
  },
  {
    id: 'summary',
    title: 'Summary',
    description: 'Net worth, spending, and savings metrics will appear here.',
    keywords: ['summary', 'net worth', 'savings', 'spending'],
  },
  {
    id: 'insights',
    title: 'AI Insights',
    description: 'Dynamic strategy recommendations and risk alerts will appear here.',
    keywords: ['insights', 'analysis', 'signal', 'recommendations', 'ai'],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    description: 'Recent transactions and filters will appear here.',
    keywords: ['transactions', 'activity', 'ledger', 'market moves', 'filters'],
  },
]

export const ALERT_ITEMS = [
  {
    id: 'alert-1',
    title: 'Subscription Spike',
    message: 'Streaming charges increased 18% compared to your monthly average.',
    severity: 'high',
    time: '1h ago',
  },
  {
    id: 'alert-2',
    title: 'Budget Threshold',
    message: 'Food & Dining reached 89% of allocated monthly budget.',
    severity: 'medium',
    time: '3h ago',
  },
  {
    id: 'alert-3',
    title: 'Dividend Posted',
    message: 'AAPL dividend has been credited to your brokerage account.',
    severity: 'low',
    time: 'Today',
  },
]
