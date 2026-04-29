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

  return generateInsights({ metrics, transactions })
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
  const {
    data: insights = [],
    error,
    isLoading,
    refetch,
  } = useFetch(fetchInsights, {
    initialData: [],
    immediate: true,
  })

  const marketSentiment = useMemo(() => {
    const score = Math.min(90, 58 + insights.length * 4)
    return {
      score,
      tone: score >= 70 ? 'Optimistic' : 'Neutral',
      equities: score >= 70 ? 'Bullish' : 'Balanced',
    }
  }, [insights.length])

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
    <div className="space-y-4">
      <header>
        <p className="text-[10px] uppercase tracking-[0.14em] text-blue-500 dark:text-blue-400">
          Wealth Intelligence
        </p>
        <h3 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Portfolio Insights
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your curated financial perspective, balancing algorithmic precision with
          long-term wealth preservation goals.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-500">
            Active Signal: Rebalance Priority
          </p>
          <h4 className="mt-2 text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-100">
            {insights[0]?.title}
          </h4>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {insights[0]?.message}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => handleExecuteStrategy(insights[0]?.id)}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Review Strategy
            </button>
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
              Dismiss
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Market Sentiment
          </p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-blue-500/30">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {marketSentiment.score}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {marketSentiment.tone}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Global Equities: {marketSentiment.equities}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Portfolio Performance
          </h4>
          <span className="text-xs text-emerald-500">+12.4%</span>
        </div>
        <div className="mt-4 h-56 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
          <div className="relative h-full w-full">
            <div className="absolute bottom-0 left-0 right-0 top-0">
              <svg viewBox="0 0 300 160" className="h-full w-full">
                <path
                  d="M0 130 C40 120, 60 140, 90 110 C120 80, 145 30, 175 42 C205 54, 225 130, 260 118 C280 111, 290 84, 300 44"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {insights.slice(1, 4).map((insight) => (
          <article
            key={insight.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {insight.title}
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
              {insight.message}
            </p>
            <button
              type="button"
              onClick={() => handleExecuteStrategy(insight.id)}
              className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400"
            >
              View Strategy
            </button>
          </article>
        ))}
      </section>
    </div>
  )
}

export default InsightsSection
