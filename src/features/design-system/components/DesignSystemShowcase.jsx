import { useCallback, useMemo } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useFetch } from '../../../hooks'
import { getSummaryMetrics } from '../../summary/data/summaryMetrics'
import { getTransactions } from '../../transactions/data/transactions'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

async function loadDesignData() {
  const [metrics, transactions] = await Promise.all([
    getSummaryMetrics(),
    getTransactions(),
  ])
  return { metrics, transactions }
}

function DesignSystemShowcase() {
  const fetchDesignData = useCallback(() => loadDesignData(), [])
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchDesignData, {
    initialData: null,
    immediate: true,
  })

  const availableBalance = useMemo(
    () => data?.metrics.find((metric) => metric.id === 'net-worth')?.value || 0,
    [data]
  )

  if (isLoading) {
    return (
      <LoadingState
        title="Loading design system preview"
        description="Preparing typography, token, and control samples."
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load design system preview"
        description="Retry to render design system documentation blocks."
        onRetry={() => void refetch()}
      />
    )
  }

  if (!data) {
    return (
      <EmptyState
        title="No design system data available"
        description="Sample data is required to render the design system showcase."
      />
    )
  }

  return (
    <div className="space-y-5">
      <header>
        <h3 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Proton Finance Design System
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          A curated editorial framework for premium wealth management with tonal
          depth, intentional asymmetry, and financial clarity.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-[0.16em] text-blue-500 dark:text-blue-400">
            Typography Scale
          </p>
          <p className="mt-2 text-[44px] font-semibold leading-none text-slate-900 dark:text-slate-100">
            {formatCurrency(availableBalance)}
          </p>
          <p className="mt-2 text-2xl font-medium text-slate-900 dark:text-slate-100">
            Monthly Cash Flow Analysis
          </p>
          <p className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-300">
            Portfolio Asset Allocation
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Financial markets showed significant volatility this quarter, primarily
            driven by shifting interest rate expectations and geopolitical risk.
          </p>
        </section>

        <section className="grid gap-4">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] uppercase tracking-[0.16em] text-blue-500 dark:text-blue-400">
              Interactive Elements
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                Primary Action
              </button>
              <button className="rounded-md bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Secondary
              </button>
              <button className="rounded-md px-3 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Ghost Button
              </button>
            </div>
            <div className="mt-4 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Search markets...
            </div>
          </article>

          <article className="rounded-xl border border-blue-500/30 bg-blue-600 p-5 text-white shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.16em] text-blue-100">
              AI Financial Strategist
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-50">
              Your portfolio shows strong tech correlation. Consider shifting 12% to
              commodities for hedging.
            </p>
            <button className="mt-3 rounded bg-white px-3 py-2 text-xs font-semibold text-blue-700">
              Execute Rebalance
            </button>
          </article>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.16em] text-blue-500 dark:text-blue-400">
            Color Tokens
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">At Limit: 2</p>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-lg bg-blue-600 p-3 text-xs font-semibold text-white">
            Primary
          </div>
          <div className="rounded-lg bg-emerald-500 p-3 text-xs font-semibold text-white">
            Success
          </div>
          <div className="rounded-lg bg-amber-500 p-3 text-xs font-semibold text-white">
            Tertiary (Gold)
          </div>
          <div className="rounded-lg bg-rose-500 p-3 text-xs font-semibold text-white">
            Error
          </div>
          <div className="rounded-lg bg-slate-800 p-3 text-xs font-semibold text-slate-100">
            Background
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Recent Transactions
          </h4>
          <button className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Export CSV
          </button>
        </div>
        <div className="space-y-2">
          {data.transactions.slice(0, 3).map((tx) => (
            <article
              key={tx.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800"
            >
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {tx.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tx.category}</p>
              </div>
              <p
                className={`text-sm font-semibold ${
                  tx.direction === 'credit' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {tx.direction === 'credit' ? '+' : '-'}
                {formatCurrency(tx.amount)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DesignSystemShowcase
