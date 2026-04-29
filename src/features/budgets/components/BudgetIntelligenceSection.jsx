import { useCallback } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useFetch } from '../../../hooks'
import { getBudgetIntelligence } from '../data/budgetData'

function formatCurrency(value, decimals = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

const CATEGORY_CONFIG = {
  'Housing & Rent': {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    barColor: 'bg-blue-500',
    iconBg: 'bg-blue-500/20 text-blue-400',
  },
  Groceries: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    barColor: 'bg-emerald-500',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
  },
  Entertainment: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    barColor: 'bg-rose-500',
    iconBg: 'bg-rose-500/20 text-rose-400',
  },
  Lifestyle: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    barColor: 'bg-amber-500',
    iconBg: 'bg-amber-500/20 text-amber-400',
  },
}

function getStatusStyle(percent) {
  if (percent >= 100) return { label: 'FIXED', color: 'text-blue-400' }
  if (percent >= 90) return { label: 'CRITICAL', color: 'text-rose-400' }
  if (percent >= 60) return { label: 'HEALTHY', color: 'text-emerald-400' }
  return { label: 'OPTIMAL', color: 'text-emerald-400' }
}

function BudgetIntelligenceSection() {
  const fetchBudgets = useCallback(() => getBudgetIntelligence(), [])
  const {
    data: budgetData,
    isLoading,
    error,
    refetch,
  } = useFetch(fetchBudgets, {
    initialData: null,
    immediate: true,
  })

  if (isLoading) {
    return (
      <LoadingState
        title="Loading budget intelligence"
        description="Preparing category allocation and monthly budget performance."
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load budget intelligence"
        description="Retry to refresh category and budget trend analytics."
        onRetry={() => void refetch()}
      />
    )
  }

  if (!budgetData || budgetData.categories.length === 0) {
    return (
      <EmptyState
        title="No budget data available"
        description="Create category budgets to unlock allocation intelligence."
      />
    )
  }

  const totalSpent = 12450
  const totalBudget = 15000
  const utilization = Math.round((totalSpent / totalBudget) * 100)
  const projectedSurplus = 2550
  const savingsEfficiency = 94.2
  const daysRemaining = 12

  const categories = [
    { name: 'Housing & Rent', spent: 3200, budget: 3200 },
    { name: 'Groceries', spent: 642.5, budget: 900 },
    { name: 'Entertainment', spent: 450, budget: 500 },
    { name: 'Lifestyle', spent: 210, budget: 600 },
  ]

  const alerts = [
    {
      id: 1,
      title: 'Entertainment Threshold',
      message: 'Limit is at 90% ($450/$500). Pause non-essential bookings.',
      time: '2 HOURS AGO',
      color: 'bg-rose-500',
    },
    {
      id: 2,
      title: 'Dining Anomaly',
      message: "Spending at 'The Oak Room' is 20% higher than your average.",
      time: 'YESTERDAY',
      color: 'bg-amber-500',
    },
    {
      id: 3,
      title: 'Subscription Renewed',
      message: "'Bloomberg Terminal' subscription was successfully auto-paid.",
      time: '2 DAYS AGO',
      color: 'bg-slate-400',
    },
  ]

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between">
        <div>
          <h3 className="text-[38px] font-bold tracking-tight text-slate-900 dark:text-white">
            Monthly Overview
          </h3>
          <p className="mt-1 text-[14px] text-slate-500 dark:text-slate-400">
            Fiscal Period: October 2023
          </p>
        </div>
        <button className="flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
          <span>+</span> Adjust Limits
        </button>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
          <p className="text-[11px] uppercase tracking-[0.12em] text-blue-500">
            Total Budget Velocity
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[48px] font-bold leading-none text-slate-900 dark:text-white">
              {formatCurrency(totalSpent, 2)}
            </span>
            <span className="text-[20px] text-slate-400 dark:text-slate-500">
              / {formatCurrency(totalBudget, 2)}
            </span>
          </div>
          <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-3 rounded-full bg-blue-500"
              style={{ width: `${utilization}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[12px] text-slate-500 dark:text-slate-400">
            <span>{utilization}% of monthly limit reached</span>
            <span className="text-blue-500">{daysRemaining} days remaining</span>
          </div>
        </section>

        <div className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Projected Surplus
            </p>
            <p className="mt-2 text-[32px] font-bold leading-none text-emerald-500">
              +{formatCurrency(projectedSurplus)}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Savings Efficiency
            </p>
            <p className="mt-2 text-[32px] font-bold leading-none text-slate-900 dark:text-white">
              {savingsEfficiency}%
            </p>
          </article>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-[18px] font-semibold text-slate-900 dark:text-white">
              Category Allocation
            </h4>
            <button className="text-[13px] font-medium text-blue-500 hover:underline">
              View All Categories
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((cat) => {
              const percent = Math.round((cat.spent / cat.budget) * 100)
              const status = getStatusStyle(percent)
              const config = CATEGORY_CONFIG[cat.name] || CATEGORY_CONFIG['Lifestyle']
              return (
                <article
                  key={cat.name}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]"
                >
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.iconBg}`}>
                      {config.icon}
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-wide ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] font-semibold text-slate-900 dark:text-white">
                    {cat.name}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[13px] text-slate-500 dark:text-slate-400">
                    <span>
                      {formatCurrency(cat.spent, cat.spent % 1 ? 2 : 0)} / {formatCurrency(cat.budget)}
                    </span>
                    <span>{percent}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-2 rounded-full ${config.barColor}`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-600 to-blue-700 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-blue-100">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                Budget Strategy
              </span>
            </div>
            <p className="mt-3 text-[18px] font-semibold leading-snug text-white">
              Optimize your spending to save{' '}
              <span className="rounded bg-white/20 px-1.5 py-0.5">{formatCurrency(200, 2)}</span>{' '}
              next month.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-blue-100">
              Based on your spending patterns at &apos;Gourmet Mart&apos;, switching to bulk
              purchases could reduce your grocery overhead by 14%.
            </p>
            <button className="mt-4 w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-blue-700">
              Apply Strategy
            </button>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#0f1d35]">
            <div className="flex items-center gap-2 text-amber-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">
                Recent Alerts
              </span>
            </div>
            <div className="mt-3 space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex gap-3">
                  <div className={`mt-1 h-1 w-1 shrink-0 rounded-full ${alert.color}`} style={{ width: '3px', height: '100%', minHeight: '40px' }} />
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-white">
                      {alert.title}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {alert.message}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-amber-500">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-800 to-slate-900 p-4 shadow-sm">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/20 blur-2xl" />
            <div className="relative">
              <p className="text-[22px] font-bold leading-tight text-white">
                Institutional Growth
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                Quarterly Report Ready
              </p>
            </div>
            <div className="mt-4 flex items-end justify-center">
              <div className="flex gap-1">
                {[40, 55, 70, 85, 65].map((h, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-t bg-amber-500/80"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}

export default BudgetIntelligenceSection
