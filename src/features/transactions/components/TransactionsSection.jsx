import { Suspense, lazy, useCallback, useMemo, useState } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useAnalytics, useFetch } from '../../../hooks'
import {
  buildCashflowData,
  buildCategorySpendData,
} from '../charts/chartData'
import { getTransactions } from '../data/transactions'
import TransactionsTable from './TransactionsTable'

const CashflowBarChart = lazy(() => import('./CashflowBarChart'))
const SpendingBreakdownChart = lazy(() => import('./SpendingBreakdownChart'))

function TransactionsSection() {
  const [typeFilter, setTypeFilter] = useState('all')
  const { trackEvent } = useAnalytics()
  const handleFilterChange = useCallback((nextFilter) => {
    setTypeFilter(nextFilter)
    trackEvent('transactions_filter_click', { filter_type: nextFilter })
  }, [trackEvent])

  const fetchTransactions = useCallback(() => getTransactions(), [])
  const {
    data: transactions = [],
    error,
    isLoading,
    refetch,
  } = useFetch(fetchTransactions, {
    initialData: [],
    immediate: true,
  })

  const filteredTransactions = useMemo(() => {
    if (typeFilter === 'all') {
      return transactions
    }

    return transactions.filter((transaction) => transaction.direction === typeFilter)
  }, [transactions, typeFilter])

  const categorySpendData = useMemo(
    () => buildCategorySpendData(transactions),
    [transactions]
  )
  const cashflowData = useMemo(() => buildCashflowData(transactions), [transactions])
  const sentimentScore = useMemo(() => {
    const income = cashflowData[0]?.value || 0
    const expenses = cashflowData[1]?.value || 0
    if (income === 0) {
      return 50
    }
    return Math.max(45, Math.min(82, Math.round((income / (expenses || 1)) * 28)))
  }, [cashflowData])

  if (isLoading) {
    return (
      <LoadingState
        title="Loading transactions"
        description="Fetching your recent transactions and spend activity."
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load transactions"
        description="Please retry to refresh your transaction history."
        onRetry={() => void refetch()}
      />
    )
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No transactions available"
        description="Your latest transactions will appear here once accounts are synced."
      />
    )
  }

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[10px] uppercase tracking-[0.14em] text-blue-500 dark:text-blue-400">
          The Wealth Curator
        </p>
        <h3 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Market Intelligence
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Personalized editorial insights synthesized from market movement and
          account activity.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h4 className="text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
            Optimizing Alpha: Your Tech-Weighted Strategy
          </h4>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            We identified an efficiency gap in your fixed-income rotation. Realigning
            toward sovereign bonds could mitigate portfolio volatility this quarter.
          </p>
          <button className="mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
            Review Strategy
          </button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Sentiment Index
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-blue-500/30">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {sentimentScore}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bullish</p>
          </div>
        </section>
      </div>

      <Suspense
        fallback={
          <LoadingState
            title="Loading charts"
            description="Optimizing and rendering transaction visualizations."
          />
        }
      >
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <CashflowBarChart data={cashflowData} />
          {categorySpendData.length > 0 ? (
            <SpendingBreakdownChart data={categorySpendData} />
          ) : (
            <EmptyState
              title="No expense data for chart"
              description="Add expense transactions to view category distribution."
            />
          )}
        </div>
      </Suspense>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium">Type</span>
            <select
              value={typeFilter}
              onChange={(event) => handleFilterChange(event.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="all">All</option>
              <option value="credit">Income</option>
              <option value="debit">Expense</option>
            </select>
          </label>
        </div>

        {filteredTransactions.length === 0 ? (
          <EmptyState
            title="No transactions match this filter"
            description="Choose another transaction type to view more records."
          />
        ) : (
          <TransactionsTable rows={filteredTransactions} />
        )}
      </div>
    </div>
  )
}

export default TransactionsSection
