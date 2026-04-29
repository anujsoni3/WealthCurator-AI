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

const SPENDING_CATEGORIES = [
  {
    name: 'Housing',
    spent: 1580,
    budget: 1800,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    name: 'Food & Dining',
    spent: 450,
    budget: 800,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
      </svg>
    ),
  },
  {
    name: 'Transportation',
    spent: 250,
    budget: 400,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    ),
  },
  {
    name: 'Utilities',
    spent: 250,
    budget: 300,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 2v11h3v9l7-12h-4l4-8z" />
      </svg>
    ),
  },
  {
    name: 'Entertainment',
    spent: 590,
    budget: 1200,
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
    ),
  },
]

const BUDGET_HISTORY = [
  { month: 'May', budget: 4500, actual: 3800 },
  { month: 'Jun', budget: 4500, actual: 4200 },
  { month: 'Jul', budget: 4500, actual: 3600 },
  { month: 'Aug', budget: 4500, actual: 4100 },
  { month: 'Sep', budget: 4500, actual: 4300 },
  { month: 'Oct', budget: 4500, actual: 3120 },
]

function MiniBarChart() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <rect x="2" y="10" width="3" height="8" rx="0.5" />
      <rect x="7" y="6" width="3" height="12" rx="0.5" />
      <rect x="12" y="8" width="3" height="10" rx="0.5" />
    </svg>
  )
}

function BudgetOverviewSection() {
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
        title="Loading budget overview"
        description="Preparing your spending categories and budget history."
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load budget overview"
        description="Retry to refresh your budget data."
        onRetry={() => void refetch()}
      />
    )
  }

  if (!budgetData) {
    return (
      <EmptyState
        title="No budget data available"
        description="Create category budgets to unlock spending insights."
      />
    )
  }

  const totalSpent = 3120
  const totalBudget = 4500
  const spentPercent = Math.round((totalSpent / totalBudget) * 100)
  const remaining = totalBudget - totalSpent
  const remainingPercent = ((remaining / totalBudget) * 100).toFixed(1)
  const dailyBurn = 104

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600">
            Budget Overview
          </p>
          <h3 className="mt-1 text-[32px] font-bold tracking-tight text-slate-900 dark:text-white">
            Wealth Curator Summary
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
            Export Report
          </button>
          <button className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Adjust Budget
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="flex items-end gap-8">
              <div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Spent So Far</p>
                <p className="mt-1 text-[42px] font-bold leading-none text-slate-900 dark:text-white">
                  {formatCurrency(totalSpent)}
                  <span className="text-[24px] font-normal text-slate-300 dark:text-slate-600">.00</span>
                </p>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400">Total Monthly Budget</p>
                <p className="mt-1 text-[28px] font-semibold text-slate-700 dark:text-slate-300">
                  {formatCurrency(totalBudget, 2)}
                </p>
              </div>
            </div>
            <div className="mt-5">
              <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-3 rounded-full bg-blue-600"
                  style={{ width: `${spentPercent}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[12px]">
                <span className="text-slate-400">0% UTILIZATION</span>
                <span className="font-semibold text-blue-600">{spentPercent}% SPENT</span>
                <span className="text-slate-400">100% TARGET</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <article className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                Remaining
              </p>
              <p className="mt-2 text-[28px] font-bold text-blue-600">
                {formatCurrency(remaining)}
              </p>
              <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                {remainingPercent}% capacity
              </p>
            </article>
            <article className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                Daily Burn
              </p>
              <p className="mt-2 text-[28px] font-bold text-slate-900 dark:text-white">
                {formatCurrency(dailyBurn)}
              </p>
              <p className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                Avg. since Oct 1
              </p>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-[18px] font-semibold text-slate-900 dark:text-white">
            Spending Categories
          </h4>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SPENDING_CATEGORIES.map((cat) => {
            const leftAmount = cat.budget - cat.spent
            const usedPercent = Math.round((cat.spent / cat.budget) * 100)
            return (
              <article
                key={cat.name}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                    {cat.icon}
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-blue-600 dark:border-slate-700 dark:text-blue-400">
                    <MiniBarChart />
                  </div>
                </div>
                <p className="mt-3 text-[14px] font-semibold text-slate-900 dark:text-white">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
                  {formatCurrency(leftAmount)} left of {formatCurrency(cat.budget)}
                </p>
                <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${usedPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-[11px] text-slate-500 dark:text-slate-400">
                  {usedPercent}% Used
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-[18px] font-semibold text-slate-900 dark:text-white">
                Budget History
              </h4>
              <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
                Target vs. Actual (Last 6 Months)
              </p>
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-200 dark:bg-blue-900" />
                Budget
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                Actual
              </span>
            </div>
          </div>
          <div className="flex h-48 items-end justify-around gap-2">
            {BUDGET_HISTORY.map((entry) => {
              const budgetHeight = (entry.budget / 5000) * 100
              const actualHeight = (entry.actual / 5000) * 100
              return (
                <div key={entry.month} className="flex flex-col items-center gap-2">
                  <div className="flex items-end gap-1">
                    <div
                      className="w-6 rounded-t bg-blue-200 dark:bg-blue-900"
                      style={{ height: `${budgetHeight * 1.5}px` }}
                    />
                    <div
                      className="w-6 rounded-t bg-blue-600"
                      style={{ height: `${actualHeight * 1.5}px` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{entry.month}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="space-y-4">
          <article className="rounded-xl bg-blue-600 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-200">
              Curator&apos;s Note
            </p>
            <p className="mt-3 text-[17px] leading-relaxed text-white">
              You&apos;re tracking <span className="italic">12% better</span> than last month in
              &apos;Food &amp; Dining&apos;. Keep this pace to save an extra $400 by year-end.
            </p>
            <button className="mt-4 flex items-center gap-1 text-[13px] font-semibold text-white hover:underline">
              View optimization plan
              <span>→</span>
            </button>
          </article>

          <article className="flex items-center gap-3 rounded-xl bg-slate-800 p-4 dark:bg-slate-950">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white">Smart Allocation</p>
              <p className="text-[12px] text-slate-400">AI suggestion available</p>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}

export default BudgetOverviewSection
