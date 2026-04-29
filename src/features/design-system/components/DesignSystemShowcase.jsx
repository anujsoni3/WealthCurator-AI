import { useCallback, useMemo } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useFetch } from '../../../hooks'
import { getSummaryMetrics } from '../../summary/data/summaryMetrics'
import { getTransactions } from '../../transactions/data/transactions'

function formatCurrency(value, decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

async function loadDesignData() {
  const [metrics, transactions] = await Promise.all([
    getSummaryMetrics(),
    getTransactions(),
  ])
  return { metrics, transactions }
}

const COLOR_TOKENS = [
  { name: 'Primary Blue', color: 'bg-blue-600', hex: '#0058be' },
  { name: 'Success Green', color: 'bg-emerald-600', hex: '#10B981' },
  { name: 'Error Red', color: 'bg-red-600', hex: '#ba1a1a' },
  { name: 'Warning Gold', color: 'bg-amber-600', hex: '#924700' },
  { name: 'Surface Low', color: 'bg-slate-200', hex: '#e2e8f0' },
  { name: 'Surface High', color: 'bg-slate-100', hex: '#f1f5f9' },
]

const SAMPLE_TRANSACTIONS = [
  { id: 1, date: 'Oct 24, 2023', merchant: 'Apple Store Soho', category: 'TECHNOLOGY', status: 'Cleared', amount: -2499.00 },
  { id: 2, date: 'Oct 22, 2023', merchant: 'Delta Air Lines', category: 'TRAVEL', status: 'Pending', amount: -842.10 },
  { id: 3, date: 'Oct 20, 2023', merchant: 'Le Coucou NYC', category: 'LIFESTYLE', status: 'Cleared', amount: -312.50 },
]

const CATEGORY_COLORS = {
  TECHNOLOGY: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  TRAVEL: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  LIFESTYLE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
}

const CATEGORY_BUDGETS = [
  { name: 'Groceries', icon: '🛒', spent: 840, budget: 1200 },
  { name: 'Rent', icon: '🏠', spent: 3500, budget: 3500 },
  { name: 'Entertainment', icon: '🎬', spent: 420, budget: 500 },
]

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
    () => data?.metrics.find((metric) => metric.id === 'net-worth')?.value || 1248392,
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
    <div className="space-y-6">
      <header>
        <h3 className="text-[38px] font-bold tracking-tight text-slate-900 dark:text-white">
          <span className="font-normal">Proton Finance</span> Design System
        </h3>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500 dark:text-slate-400">
          A curated editorial framework for premium wealth management. Defined by
          tonal depth, intentional asymmetry, and financial clarity.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
            Typography Scale
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-[11px] text-slate-400">DISPLAY MD (2.75rem / 44px)</p>
              <p className="mt-1 text-[44px] font-semibold leading-none text-slate-900 dark:text-white">
                {formatCurrency(availableBalance)}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400">HEADLINE SM (1.5rem / 24px)</p>
              <p className="mt-1 text-[24px] font-semibold text-slate-900 dark:text-white">
                Monthly Cash Flow Analysis
              </p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400">TITLE MD (1.125rem / 18px)</p>
              <p className="mt-1 text-[18px] font-medium text-slate-900 dark:text-white">
                Portfolio Asset Allocation
              </p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400">BODY MD (0.875rem / 14px)</p>
              <p className="mt-1 text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
                Financial markets showed significant volatility this quarter, primarily
                driven by shifting interest rate expectations and global geopolitical tensions.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
              Interactive Elements
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                Primary Action
              </button>
              <button className="rounded-lg border border-slate-300 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                Secondary
              </button>
              <button className="px-3 py-2 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                Ghost Button
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-800">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search markets...
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <span className="text-slate-400">$</span>
                Target Amount
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-blue-500/30 bg-blue-600 p-5 text-white shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-100">
                  AI Financial Strategist
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-blue-50">
                  &quot;Your portfolio shows 84% correlation with tech. Consider shifting 12% to
                  commodities for hedging.
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
          Color Tokens
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {COLOR_TOKENS.map((token) => (
            <div key={token.name} className="text-center">
              <div className={`h-20 rounded-lg ${token.color}`} />
              <p className="mt-2 text-[12px] font-medium text-slate-700 dark:text-slate-300">
                {token.name}
              </p>
              <p className="text-[11px] text-slate-400">{token.hex}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                Layout &amp; Containers
              </p>
              <h4 className="mt-1 text-[22px] font-semibold text-slate-900 dark:text-white">
                The Bento Surface Logic
              </h4>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                  Main Portfolio
                </p>
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  ↗ +12.4%
                </span>
              </div>
              <p className="mt-2 text-[32px] font-bold text-slate-900 dark:text-white">
                {formatCurrency(412064.20)}
              </p>
              <div className="mt-4 flex items-end gap-2">
                {[45, 60, 50, 70, 85, 95].map((h, i) => (
                  <div
                    key={i}
                    className="w-8 rounded-t bg-blue-300 dark:bg-blue-600"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </article>

            <article className="rounded-xl bg-blue-600 p-4 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <p className="mt-3 text-[16px] font-semibold">AI Wealth Signal</p>
              <p className="mt-1 text-[13px] leading-relaxed text-blue-100">
                Your real estate allocation is 4% under-weighted compared to your long-term goal. Consider rebalancing.
              </p>
              <button className="mt-4 w-full rounded-lg bg-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/30">
                Review Strategy
              </button>
            </article>
          </div>
        </section>

        <section className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
                Category Budgets
              </p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="rounded bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Period: Monthly
                </span>
                <span className="rounded bg-blue-600 px-2 py-1 text-white">At Limit: 2</span>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {CATEGORY_BUDGETS.map((cat) => {
                const percent = Math.round((cat.spent / cat.budget) * 100)
                const barColor = percent >= 100 ? 'bg-rose-500' : percent >= 70 ? 'bg-amber-500' : 'bg-blue-500'
                return (
                  <div key={cat.name}>
                    <div className="flex items-center gap-2 text-[12px] text-slate-600 dark:text-slate-400">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    <p className="mt-1 text-[13px] font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(cat.spent, 0)} / {formatCurrency(cat.budget, 0)}
                    </p>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${Math.min(100, percent)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Available Balance</p>
                <p className="text-[28px] font-bold text-slate-900 dark:text-white">
                  {formatCurrency(84230.45)}
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
              Data Integrity
            </p>
            <h4 className="mt-1 text-[22px] font-semibold text-slate-900 dark:text-white">
              Transactional Ledger
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">
              Export CSV
            </button>
            <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
              Add Transaction
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-[0.1em] text-slate-500 dark:border-slate-700">
                <th className="pb-3 pr-4 font-semibold">Date</th>
                <th className="pb-3 pr-4 font-semibold">Merchant</th>
                <th className="pb-3 pr-4 font-semibold">Category</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {SAMPLE_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="text-[14px]">
                  <td className="py-4 pr-4 text-slate-500 dark:text-slate-400">{tx.date}</td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {tx.category === 'TECHNOLOGY' && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        {tx.category === 'TRAVEL' && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                        {tx.category === 'LIFESTYLE' && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{tx.merchant}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${CATEGORY_COLORS[tx.category]}`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`flex items-center gap-1.5 text-[13px] ${tx.status === 'Cleared' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${tx.status === 'Cleared' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {tx.status}
                    </span>
                  </td>
                  <td className={`py-4 text-right text-[15px] font-semibold ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t border-slate-200 pt-6 dark:border-slate-800">
        <p className="text-center text-[12px] uppercase tracking-[0.12em] text-slate-400">
          Proton Finance — Part of the Wealth Curator Ecosystem
        </p>
        <div className="mt-3 flex items-center justify-center gap-6 text-[12px] font-semibold text-blue-600 dark:text-blue-400">
          <button className="hover:underline">Design System</button>
          <button className="hover:underline">Legal Documentation</button>
          <button className="hover:underline">Security Protocol</button>
        </div>
      </footer>
    </div>
  )
}

export default DesignSystemShowcase
