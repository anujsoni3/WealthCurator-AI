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

function formatCurrencyAmount(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))
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
  const recentTransactions = overview.transactions.slice(0, 3)
  const totalSavings =
    overview.metrics.find((metric) => metric.id === 'net-worth')?.value || 0
  const spendingItems =
    categoryComposition.length > 0
      ? categoryComposition.map((item) => ({
          name: item.name,
          percent: expenses.value ? Math.round((item.value / expenses.value) * 100) : 0,
        }))
      : [
          { name: 'Housing & Utilities', percent: 42 },
          { name: 'Dining & Leisure', percent: 18 },
          { name: 'Investments', percent: 25 },
          { name: 'Transportation', percent: 15 },
        ]
  const spendingBarColors = ['bg-[#8db4ff]', 'bg-[#ffb47a]', 'bg-[#30d9a4]', 'bg-[#7084ac]']
  const alerts = [
    {
      id: 'subscription-spike',
      title: 'Subscription Spike',
      message: `3 new recurring charges detected from "Cloud SaaS" in the last 48h.`,
      accent: 'bg-[#ffadad]',
      iconBg: 'bg-[#b10000]',
      icon: '△',
    },
    {
      id: 'emergency-fund-cap',
      title: 'Emergency Fund Cap',
      message: `Your "Rainy Day" fund has reached its target of $20k. Redirecting flows?`,
      accent: 'bg-[#ffc98f]',
      iconBg: 'bg-[#ffe4cf]',
      icon: '☞',
    },
    {
      id: 'dividend-reinvestment',
      title: 'Dividend Reinvestment',
      message: 'AAPL and MSFT paid dividends today. Automatic reinvestment pending.',
      accent: 'bg-[#95b9ff]',
      iconBg: 'bg-[#dce8ff]',
      icon: '↗',
    },
  ]

  return (
    <div className="space-y-4">
      <header>
        <h2 className="text-[42px] leading-tight font-semibold text-slate-900 dark:text-slate-100">
          Personal Finance Dashboard
        </h2>
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          Track your personal finance activity in one place.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0c131b]">
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

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0c131b]">
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

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0c131b]">
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

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a3a6e] via-[#1e4a8a] to-[#2563eb] p-7 text-white shadow-lg">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-300/10 blur-2xl" />
          <div className="relative">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-100">
              Pro Strategy Insight
            </span>
            <h3 className="mt-5 max-w-lg text-[32px] font-bold leading-[1.15] tracking-tight">
              Optimizing your portfolio for the upcoming Q3 market shift.
            </h3>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-blue-100/90">
              Our AI analyzed your current allocation and identified 3 key
              rebalancing opportunities to increase yield by 2.4%.
            </p>
            <div className="mt-6 flex gap-3">
              <button className="rounded-lg bg-white px-5 py-2.5 text-[14px] font-semibold text-blue-700 shadow-sm hover:bg-blue-50">
                Execute Strategy
              </button>
              <button className="rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-[14px] font-semibold text-white backdrop-blur-sm hover:bg-white/20">
                Review Audit
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0c131b]">
          <h3 className="text-[34px] font-medium text-slate-900 dark:text-slate-100">
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
                className="relative overflow-hidden rounded-lg border border-slate-200 p-3 pl-4 dark:border-slate-700 dark:bg-[#0a1218]"
              >
                <span className={`absolute inset-y-0 left-0 w-1 ${alert.accent}`} />
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-semibold text-slate-900 ${alert.iconBg}`}
                  >
                    {alert.icon}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-slate-900 dark:text-slate-100">
                      {alert.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-6 text-slate-600 dark:text-slate-400">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_1.25fr]">
        <section className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0c131b]">
            <div className="flex items-center justify-between">
              <h3 className="text-[34px] font-semibold text-slate-900 dark:text-slate-100">
                Spending Composition
              </h3>
              <span className="text-[18px] font-medium text-blue-400">View All</span>
            </div>
            <div className="mt-5 space-y-4">
              {spendingItems.map((item, index) => {
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-slate-700 dark:text-slate-200">{item.name}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.percent}%
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-2.5 rounded-full ${spendingBarColors[index % spendingBarColors.length]}`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <article className="mt-5 rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-[#182028]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Editor&apos;s Note
              </p>
              <p className="mt-2 text-[13px] italic leading-6 text-slate-600 dark:text-slate-300">
                &quot;Your discretionary spending on &apos;Dining &amp; Leisure&apos; is down 12% this month.
                This surplus has been automatically moved to your &apos;S&amp;P 500&apos; bucket.&quot;
              </p>
            </article>
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0c131b]">
          <div className="flex items-center justify-between">
            <h3 className="text-[34px] font-semibold text-slate-900 dark:text-slate-100">
              Recent Activity
            </h3>
            <div className="flex items-center gap-2">
              <button className="rounded border border-slate-300 bg-slate-100 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Export CSV
              </button>
              <button className="rounded border border-slate-300 bg-slate-100 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Filter
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[1.6fr_1fr_0.9fr_0.9fr] gap-2 border-b border-slate-200 pb-3 text-[11px] uppercase tracking-[0.12em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>Merchant</span>
            <span>Category</span>
            <span>Status</span>
            <span className="text-right">Amount</span>
          </div>

          <div className="mt-2 space-y-1">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-[1.6fr_1fr_0.9fr_0.9fr] items-center gap-2 border-b border-slate-200 px-1 py-3 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-sm dark:bg-slate-800">
                    {tx.direction === 'credit'
                      ? '💵'
                      : tx.category.toLowerCase().includes('utility')
                        ? '⚡'
                        : tx.category.toLowerCase().includes('dining')
                          ? '🍴'
                          : '👜'}
                  </div>
                  <div>
                    <p className="text-[16px] font-semibold text-slate-900 dark:text-slate-100">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{tx.date}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      tx.category.toLowerCase().includes('tech')
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                        : tx.category.toLowerCase().includes('dining')
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {tx.category}
                  </span>
                </p>
                <p
                  className={`text-[12px] font-semibold uppercase ${
                    tx.direction === 'credit' ? 'text-emerald-500' : 'text-blue-400'
                  }`}
                >
                  {tx.direction === 'credit' ? '• Cleared' : '• Pending'}
                </p>
                <p
                  className={`text-right text-[17px] font-semibold ${
                    tx.direction === 'credit' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {tx.direction === 'credit' ? '+' : '-'}
                  {formatCurrencyAmount(tx.amount)}
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
