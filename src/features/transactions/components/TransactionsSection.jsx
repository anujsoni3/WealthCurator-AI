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
      <Suspense
        fallback={
          <LoadingState
            title="Loading charts"
            description="Optimizing and rendering transaction visualizations."
          />
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
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

      <div className="flex items-center justify-between">
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
  )
}

export default TransactionsSection
