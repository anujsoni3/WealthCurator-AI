import { useCallback, useMemo, useState } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useFetch } from '../../../hooks'
import { getTransactions } from '../data/transactions'

function TransactionsSection() {
  const [selectedRange, setSelectedRange] = useState('1M')
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

  const sentimentScore = useMemo(() => {
    const income = transactions
      .filter((item) => item.direction === 'credit')
      .reduce((total, item) => total + item.amount, 0)
    const expenses = transactions
      .filter((item) => item.direction === 'debit')
      .reduce((total, item) => total + item.amount, 0)
    if (income === 0) {
      return 72
    }
    return Math.max(66, Math.min(82, Math.round((income / (expenses || 1)) * 16)))
  }, [transactions])
  const rangeSeries = useMemo(
    () => ({
      '1W': {
        primary:
          'M20 214 C120 194, 210 224, 300 182 C420 126, 540 144, 650 202 C750 236, 825 170, 870 122',
        secondary:
          'M20 230 C160 214, 285 206, 430 214 C570 222, 710 202, 870 192',
        markerX: 640,
        markerY: 130,
        peak: '$38,250',
      },
      '1M': {
        primary:
          'M20 205 C150 150, 235 220, 330 120 C415 42, 510 60, 590 165 C665 250, 730 160, 870 28',
        secondary:
          'M20 225 C160 195, 260 205, 360 210 C500 215, 640 150, 860 165',
        markerX: 560,
        markerY: 66,
        peak: '$142,850',
      },
      '1Y': {
        primary:
          'M20 228 C140 180, 230 194, 340 112 C440 46, 520 96, 620 154 C710 208, 790 150, 870 108',
        secondary:
          'M20 238 C170 222, 300 216, 450 194 C590 172, 725 164, 870 154',
        markerX: 612,
        markerY: 96,
        peak: '$518,420',
      },
      ALL: {
        primary:
          'M20 236 C120 216, 210 228, 320 198 C430 166, 500 128, 590 144 C690 164, 760 108, 870 42',
        secondary:
          'M20 246 C190 230, 350 224, 520 198 C650 178, 760 166, 870 154',
        markerX: 656,
        markerY: 88,
        peak: '$1,024,880',
      },
    }),
    []
  )
  const chartView = rangeSeries[selectedRange]

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
    <div className="space-y-5">
      <header>
        <p className="text-[10px] uppercase tracking-[0.14em] text-blue-500 dark:text-blue-400">
          The Wealth Curator
        </p>
        <h3 className="mt-1 text-5xl font-semibold text-slate-900 dark:text-slate-100">
          Market Intelligence
        </h3>
        <p className="mt-1 max-w-3xl text-[15px] text-slate-500 dark:text-slate-400">
          Personalized editorial insights synthesized from market movement and
          account activity.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-gradient-to-br dark:from-[#2a3a56] dark:via-[#2f3f5a] dark:to-[#364560]">
          <div className="flex items-start justify-between gap-4">
            <h4 className="max-w-lg text-[38px] font-bold leading-[1.15] tracking-tight text-slate-900 dark:text-white">
              Optimizing Alpha: Your Tech-Weighted Strategy
            </h4>
            <span className="flex shrink-0 flex-col items-center rounded-full bg-[#364b70] px-4 py-2 text-center">
              <span className="text-[10px] text-blue-200">✦</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-100">
                Signal
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-blue-100">
                Active
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">
            We&apos;ve identified a 4.2% efficiency gap in your fixed-income
            rotation. Realigning toward sovereign bonds could mitigate the current
            volatility in your growth bucket.
          </p>
          <button className="mt-6 flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
            Review Strategy
            <span>›</span>
          </button>
          <div className="pointer-events-none absolute inset-0 rounded-2xl">
            <div className="absolute -bottom-20 left-8 hidden h-36 w-36 rounded-full bg-blue-400/10 blur-2xl dark:block" />
            <div className="absolute -right-10 -top-10 hidden h-32 w-32 rounded-full bg-slate-400/5 blur-xl dark:block" />
          </div>
        </section>

        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0f1b33]">
          <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-200">
            <span className="text-blue-500">↗</span> Sentiment Index
          </p>
          <div className="flex flex-1 items-center justify-center py-4">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(sentimentScore / 100) * 264} 264`} className="text-blue-500" />
              </svg>
              <div className="text-center">
                <p className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                  {sentimentScore}
                </p>
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                  Bullish
                </p>
              </div>
            </div>
          </div>
          <p className="text-[12px] leading-5 text-slate-500 dark:text-slate-400">
            Retail investors are showing strong accumulation signals despite macro
            headwinds.
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1a2946]">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h4 className="text-[22px] font-bold text-slate-900 dark:text-slate-100">
              Portfolio Velocity
            </h4>
            <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
              Comparison vs. S&amp;P 500 Benchmarks
            </p>
          </div>
          <div className="flex items-center gap-1">
            {['1W', '1M', '1Y', 'ALL'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setSelectedRange(range)}
                className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                  range === selectedRange
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="h-72 rounded-xl bg-slate-50 p-4 dark:bg-[#1c2e4d]">
          <svg viewBox="0 0 900 280" className="h-full w-full" preserveAspectRatio="none">
            <path d="M0 240 H900" stroke="rgba(148,163,184,0.15)" />
            <path d="M0 180 H900" stroke="rgba(148,163,184,0.15)" />
            <path d="M0 120 H900" stroke="rgba(148,163,184,0.15)" />
            <path d="M0 60 H900" stroke="rgba(148,163,184,0.15)" />
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(6,104,218,0.2)" />
                <stop offset="100%" stopColor="rgba(6,104,218,0)" />
              </linearGradient>
            </defs>
            <path
              d={`${chartView.primary} L870 280 L20 280 Z`}
              fill="url(#chartGradient)"
            />
            <path
              d={chartView.primary}
              fill="none"
              stroke="#0668da"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d={chartView.secondary}
              fill="none"
              stroke="#a16538"
              strokeWidth="2"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />
            <rect x={chartView.markerX} y={chartView.markerY} width="140" height="58" rx="8" fill="#ffffff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
            <text x={chartView.markerX + 12} y={chartView.markerY + 18} fill="#64748b" fontSize="10" fontWeight="500" letterSpacing="0.05em">
              PEAK PERFORMANCE
            </text>
            <text x={chartView.markerX + 12} y={chartView.markerY + 44} fill="#0f172a" fontSize="22" fontWeight="600">
              {chartView.peak}
            </text>
          </svg>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <section className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#101d36]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <p className="text-[13px] text-slate-600 dark:text-slate-300">Technology</p>
              <p className="mt-3 text-[42px] font-semibold leading-none text-slate-900 dark:text-slate-100">42%</p>
              <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-2 w-[42%] rounded-full bg-blue-500" />
              </div>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#101d36]">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-[13px] text-slate-600 dark:text-slate-300">ESG / Green</p>
              <p className="mt-3 text-[42px] font-semibold leading-none text-slate-900 dark:text-slate-100">18%</p>
              <div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-2 w-[18%] rounded-full bg-amber-500" />
              </div>
            </article>
          </div>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#101d36]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">
                    Real Estate
                  </p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    Diversification Score: High
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[38px] font-semibold leading-none text-slate-900 dark:text-slate-100">12%</p>
                <p className="mt-1 text-sm font-semibold text-emerald-500">+2.4% MoM</p>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#1a2742]">
          <h4 className="text-[20px] font-semibold text-slate-900 dark:text-slate-100">
            Spending Intelligence
          </h4>
          <div className="mt-5 space-y-5">
            <article className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                    Recurring Subscriptions
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                    You could save $42/mo by consolidating your premium media platforms.
                  </p>
                </div>
                <p className="shrink-0 text-[14px] font-semibold text-slate-900 dark:text-slate-100">$184/mo</p>
              </div>
            </article>
            <article className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                    Daily Discretionary
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                    Automating 10% of this into your Roth IRA would yield $18k in 10 years.
                  </p>
                </div>
                <p className="shrink-0 text-[14px] font-semibold text-slate-900 dark:text-slate-100">$320/mo</p>
              </div>
            </article>
          </div>
          <button className="mt-6 w-full rounded-md bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:bg-[#263855] dark:text-slate-200">
            View All Efficiency Gains
          </button>
        </section>
      </div>
    </div>
  )
}

export default TransactionsSection
