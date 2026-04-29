import { useCallback, useMemo } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useAnalytics, useFetch } from '../../../hooks'
import { getSummaryMetrics } from '../../summary/data/summaryMetrics'
import { getTransactions } from '../../transactions/data/transactions'
import { generateInsights } from '../engine/generateInsights'

async function loadInsightsData() {
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

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function InsightsSection() {
  const { trackEvent } = useAnalytics()
  const fetchInsights = useCallback(() => loadInsightsData(), [])
  const handleExecuteStrategy = useCallback(
    (insightId) => {
      trackEvent('execute_strategy_click', { insight_id: insightId })
    },
    [trackEvent]
  )
  const { data, error, isLoading, refetch } = useFetch(fetchInsights, {
    initialData: null,
    immediate: true,
  })
  const insights = data?.insights || []
  const metrics = data?.metrics || []

  const marketSentiment = useMemo(() => {
    const score = Math.min(90, 62 + insights.length * 4)
    return {
      score,
      tone: score >= 70 ? 'Optimistic' : 'Neutral',
      equities: score >= 70 ? 'Bullish' : 'Balanced',
    }
  }, [insights.length])
  const netWorth = metrics.find((metric) => metric.id === 'net-worth')?.value || 0
  const displayPortfolioValue = Math.max(netWorth, 1424902.18)
  const sectorAllocation = [
    { name: 'Technology', value: 42, dot: 'bg-blue-600' },
    { name: 'Financials', value: 18, dot: 'bg-amber-600' },
    { name: 'Healthcare', value: 15, dot: 'bg-slate-500' },
    { name: 'Other', value: 25, dot: 'bg-slate-300 dark:bg-slate-600' },
  ]

  if (isLoading) {
    return (
      <LoadingState
        title="Generating AI insights"
        description="Analyzing your financial activity to produce strategy recommendations."
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to generate insights"
        description="Retry to run the insights engine again."
        onRetry={() => void refetch()}
      />
    )
  }

  if (insights.length === 0) {
    return (
      <EmptyState
        title="No insights available"
        description="We need more finance activity data to generate meaningful insights."
      />
    )
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-500 dark:text-blue-400">
          Wealth Intelligence
        </p>
        <h3 className="mt-1 text-[50px] leading-tight font-semibold text-slate-900 dark:text-slate-100">
          Portfolio Insights
        </h3>
        <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-500 dark:text-slate-400">
          Your curated financial perspective, balancing algorithmic precision with
          long-term wealth preservation goals.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#1b2d4a]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-500">
            Active Signal: Rebalance Priority
          </p>
          <div className="mt-2 grid gap-4 md:grid-cols-[1.8fr_0.7fr]">
            <div>
              <h4 className="max-w-xl text-[16px] font-semibold leading-[1.3] text-slate-900 dark:text-slate-100 md:text-[18px]">
                Your technology exposure has increased by 14.2% since last quarter.
              </h4>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-slate-500 dark:text-slate-300">
                Our algorithms suggest shifting 4% of gains into emerging market
                debt and high-yield real estate to maintain your risk-adjusted
                profile.
              </p>
              <div className="mt-5 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleExecuteStrategy(insights[0]?.id)}
                  className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Review Strategy
                </button>
                <button className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                  Dismiss
                </button>
              </div>
            </div>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-[#243753]">
              <div className="flex h-full flex-col justify-between">
                <div className="rounded-lg bg-slate-100 p-4 text-center dark:bg-[#2c4263]">
                  <span className="text-3xl text-blue-300">⌁</span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
                    Signal Confidence
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-2 w-[92%] rounded-full bg-blue-600" />
                  </div>
                  <p className="mt-1 text-right text-sm font-semibold text-blue-600 dark:text-blue-300">
                    92%
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0f1b33]">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Market Sentiment
          </p>
          <div className="mt-5 flex items-center justify-center">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <div className="absolute h-44 w-44 rounded-full border-[14px] border-slate-200 dark:border-slate-700" />
              <div
                className="absolute h-44 w-44 rounded-full border-[14px] border-transparent border-t-blue-600 border-r-blue-600"
                style={{ transform: 'rotate(-35deg)' }}
              />
              <span className="relative z-10 px-2 text-[24px] font-semibold leading-none text-slate-900 dark:text-slate-100">
                {marketSentiment.tone}
              </span>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            Score: {marketSentiment.score}/100
          </p>
          <div className="mt-4 space-y-2 text-[12px] text-slate-500 dark:text-slate-400">
            <p className="flex justify-between">
              <span>Global Equities</span>
              <span className="font-semibold text-emerald-500">{marketSentiment.equities}</span>
            </p>
            <p className="flex justify-between">
              <span>Fixed Income</span>
              <span className="font-semibold text-amber-500">Neutral</span>
            </p>
            <p className="flex justify-between">
              <span>Volatility Index</span>
              <span className="font-semibold text-emerald-500">Low</span>
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#152540]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Portfolio Performance
            </h4>
            <p className="text-[45px] font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(displayPortfolioValue)}
              <span className="ml-2 text-sm font-semibold text-emerald-500">+12.4%</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {['1M', '3M', '1Y', 'ALL'].map((range) => (
              <button
                key={range}
                className={`rounded px-2.5 py-1 text-xs font-semibold ${
                  range === '3M'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 h-64 rounded-xl bg-slate-50 p-4 dark:bg-[#172845]">
          <svg viewBox="0 0 800 260" className="h-full w-full">
            <path d="M0 205 H800" stroke="rgba(148,163,184,0.2)" />
            <path d="M0 150 H800" stroke="rgba(148,163,184,0.2)" />
            <path d="M0 95 H800" stroke="rgba(148,163,184,0.2)" />
            <path
              d="M20 210 C120 175, 180 260, 270 135 C320 66, 380 45, 445 137 C525 250, 615 197, 780 50"
              fill="none"
              stroke="#0b61c4"
              strokeWidth="5"
            />
            <path
              d="M20 210 C120 175, 180 260, 270 135 C320 66, 380 45, 445 137 C525 250, 615 197, 780 50 L780 260 L20 260 Z"
              fill="rgba(37, 99, 235, 0.08)"
            />
            <line x1="602" y1="220" x2="602" y2="72" stroke="#2380e0" strokeWidth="2" />
            <rect x="498" y="52" width="130" height="58" rx="8" fill="#111827" />
            <text x="514" y="77" fill="#d1d5db" fontSize="10">
              Oct 14, 2023
            </text>
            <text x="514" y="95" fill="#ffffff" fontSize="13">
              $1,388,400.00
            </text>
          </svg>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#13213a]">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Cash Flow Intelligence
            </h4>
            <button className="text-sm font-semibold text-blue-600 dark:text-blue-300">
              View Monthly Report
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Automated suggestions based on your November spending patterns.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl bg-slate-50 p-4 dark:bg-[#0f1b33]">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Surplus Opportunity
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                You spent 12% less on dining this month. Transfer $450 to your
                growth bucket to stay ahead of your 2024 goal.
              </p>
            </article>
            <article className="rounded-xl bg-slate-50 p-4 dark:bg-[#0f1b33]">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recurring Audit
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                We detected two overlapping streaming subscriptions. Canceling
                one could save you $180 annually.
              </p>
            </article>
            <article className="rounded-xl bg-slate-50 p-4 dark:bg-[#0f1b33]">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Tax-Loss Harvesting
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                3 assets in your legacy portfolio are eligible for tax-loss
                harvesting. Potential benefit: $2,100.
              </p>
            </article>
          </div>
        </section>

        <section className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0f1b33]">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Sector Allocation
            </h4>
            <div className="mt-3 space-y-2">
              {sectorAllocation.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </article>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <article className="rounded-xl bg-blue-700 p-4 text-white">
              <p className="text-[10px] uppercase tracking-[0.14em] text-blue-100">Top Performer</p>
              <p className="mt-2 text-2xl font-semibold">NVDA</p>
              <p className="text-sm">+8.4%</p>
            </article>
            <article className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
              <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Risk Level
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Moderate
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Balanced</p>
            </article>
          </div>
        </section>
      </div>

    </div>
  )
}

export default InsightsSection
