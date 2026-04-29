import { useCallback, useMemo } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useFetch } from '../../../hooks'
import { generateInsights } from '../../insights/engine/generateInsights'
import { getSummaryMetrics } from '../../summary/data/summaryMetrics'
import {
  buildCategorySpendData,
  buildCashflowData,
} from '../../transactions/charts/chartData'
import { getTransactions } from '../../transactions/data/transactions'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

async function fetchOverviewData() {
  const [metrics, transactions] = await Promise.all([
    getSummaryMetrics(),
    getTransactions(),
  ])

  return {
    metrics,
    transactions,
    insights: generateInsights({ metrics, transactions }),
  }
}

function PortfolioOverview() {
  const getOverview = useCallback(() => fetchOverviewData(), [])
  const {
    data: overview,
    error,
    isLoading,
    refetch,
  } = useFetch(getOverview, {
    initialData: null,
    immediate: true,
  })

  const categoryComposition = useMemo(
    () => buildCategorySpendData(overview?.transactions || []),
    [overview?.transactions]
  )

  const cashflow = useMemo(
    () => buildCashflowData(overview?.transactions || []),
    [overview?.transactions]
  )

  if (isLoading) {
    return (
      <LoadingState
        title="Building portfolio overview"
        description="Preparing analytics, activity, and AI strategy insights."
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load portfolio overview"
        description="Retry to fetch the latest dashboard snapshot."
        onRetry={() => void refetch()}
      />
    )
  }

  if (!overview) {
    return (
      <EmptyState
        title="No portfolio data available"
        description="Connect your accounts to render your dashboard overview."
      />
    )
  }

  const [income = { value: 0 }, expenses = { value: 0 }] = cashflow
  const alerts = overview.insights.slice(0, 3)
  const recentTransactions = overview.transactions.slice(0, 4)
  const totalSavings =
    overview.metrics.find((metric) => metric.id === 'net-worth')?.value || 0

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Total Net Worth
          </p>
          <p className="mt-2 text-[38px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {formatCurrency(overview.metrics[0]?.value || 0)}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-emerald-500">
            +12.4% vs last month
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Monthly Spending
          </p>
          <p className="mt-2 text-[38px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {formatCurrency(overview.metrics[1]?.value || 0)}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-rose-500">
            +2.1% higher than avg
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Total Savings
          </p>
          <p className="mt-2 text-[38px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {formatCurrency(totalSavings)}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-emerald-500">
            On track for Q4 goal
          </p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2.2fr_1fr]">
        <section className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-6 text-white shadow-lg">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-blue-100">
            Pro Strategy Insight
          </p>
          <h3 className="mt-3 text-[37px] font-semibold leading-[1.05]">
            Optimizing your portfolio for the upcoming Q3 market shift.
          </h3>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-blue-100">
            Our AI analyzed your current allocation and identified three key
            rebalancing opportunities to increase yield by 2.4%.
          </p>
          <div className="mt-5 flex gap-2">
            <button className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-700">
              Execute Strategy
            </button>
            <button className="rounded-md bg-blue-500/70 px-3 py-2 text-sm font-semibold text-white">
              Review Audit
            </button>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Active Alerts
          </h3>
          {alerts.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No alerts detected.
            </p>
          ) : (
            alerts.map((alert) => (
              <article
                key={alert.id}
                className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
              >
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {alert.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                  {alert.message}
                </p>
              </article>
            ))
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_1.25fr]">
        <section className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Spending Composition
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">View all</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {categoryComposition.map((item) => {
                const percent = expenses.value
                  ? Math.round((item.value / expenses.value) * 100)
                  : 0
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {percent}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-1.5 rounded-full bg-blue-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Editor&apos;s Note
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
              Your discretionary spending on Dining & Leisure is down 12% this
              month. This surplus has been automatically moved to your S&P 500
              bucket.
            </p>
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Recent Activity
            </h3>
            <div className="flex items-center gap-2">
              <button className="rounded border border-slate-300 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Export CSV
              </button>
              <button className="rounded border border-slate-300 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-700 dark:text-slate-300">
                Filter
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-[1.3fr_1fr_0.9fr_0.9fr] gap-2 border-b border-slate-200 pb-2 text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>Merchant</span>
            <span>Category</span>
            <span>Status</span>
            <span className="text-right">Amount</span>
          </div>

          <div className="mt-1 space-y-1">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-[1.3fr_1fr_0.9fr_0.9fr] items-center gap-2 rounded-md px-1 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <div>
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                    {tx.description}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {tx.date}
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{tx.category}</p>
                <p
                  className={`text-xs font-semibold ${
                    tx.direction === 'credit' ? 'text-emerald-500' : 'text-amber-500'
                  }`}
                >
                  {tx.direction === 'credit' ? 'Cleared' : 'Pending'}
                </p>
                <p
                  className={`text-right text-xs font-semibold ${
                    tx.direction === 'credit' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {tx.direction === 'credit' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Income window: {formatCurrency(income.value)}
          </p>
        </section>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>© 2023 Editorial Finance. All financial data is encrypted and secure.</p>
        <div className="flex items-center gap-3">
          <button className="hover:text-slate-700 dark:hover:text-slate-300">
            Privacy Policy
          </button>
          <button className="hover:text-slate-700 dark:hover:text-slate-300">
            Security Audit
          </button>
          <button className="hover:text-slate-700 dark:hover:text-slate-300">
            API Docs
          </button>
        </div>
      </footer>
    </div>
  )
}

export default PortfolioOverview
