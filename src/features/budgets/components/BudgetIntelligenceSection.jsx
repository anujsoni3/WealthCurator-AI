import { useCallback } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useFetch } from '../../../hooks'
import { getBudgetIntelligence } from '../data/budgetData'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
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

  const totalSpent = budgetData.categories.reduce((sum, item) => sum + item.spent, 0)
  const totalBudget = budgetData.categories.reduce((sum, item) => sum + item.budget, 0)
  const utilization = totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0
  const remaining = Math.max(0, totalBudget - totalSpent)
  const dailyBurn = Math.round(totalSpent / 30)
  const curatorTip = budgetData.categories
    .slice()
    .sort((a, b) => a.spent / a.budget - b.spent / b.budget)[0]

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[10px] uppercase tracking-[0.14em] text-amber-500">
          Budget Overview
        </p>
        <h3 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Wealth Curator Summary
        </h3>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Spent So Far
            </p>
            <p className="mt-1 text-4xl font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalSpent)}
            </p>
            <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{ width: `${utilization}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              0% Utilization &nbsp; • &nbsp; {utilization}% Spent &nbsp; • &nbsp; 100%
              Target
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Remaining
            </p>
            <p className="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {formatCurrency(remaining)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {(remaining / totalBudget * 100).toFixed(1)}% capacity
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Daily Burn
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(dailyBurn)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Avg. since period start
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Spending Categories
            </h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {budgetData.categories.map((category) => {
                const usedPercent = Math.min(
                  100,
                  Math.round((category.spent / category.budget) * 100)
                )

                return (
                  <article
                    key={category.id}
                    className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {category.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatCurrency(Math.max(0, category.budget - category.spent))} left of{' '}
                      {formatCurrency(category.budget)}
                    </p>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className={`h-1.5 rounded-full ${
                          usedPercent >= 90 ? 'bg-rose-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${usedPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {usedPercent}% used
                    </p>
                  </article>
                )
              })}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Budget History
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Target vs. Actual (Last 6 Months)
            </p>
            <div className="mt-4 grid grid-cols-6 gap-2">
              {budgetData.history.map((entry) => {
                const ratio = Math.min(100, Math.round((entry.actual / entry.budget) * 100))
                return (
                  <div key={entry.month} className="text-center">
                    <div className="mx-auto flex h-24 w-full items-end rounded bg-slate-100 p-1 dark:bg-slate-800">
                      <div
                        className="w-full rounded bg-blue-500"
                        style={{ height: `${ratio}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      {entry.month}
                    </p>
                  </div>
                )
              })}
            </div>
          </article>
        </section>

        <section className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Curator&apos;s Note
            </h3>
            <p className="mt-3 text-xs leading-6 text-slate-600 dark:text-slate-400">
              You&apos;re tracking better than last month in{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {curatorTip?.name}
              </span>
              . Keep this pace to save an extra {formatCurrency(400)} by year-end.
            </p>
            <button className="mt-3 rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
              View optimization plan
            </button>
          </article>

          <article className="rounded-xl border border-slate-200 bg-blue-600 p-4 shadow-sm dark:border-blue-500/40">
            <p className="text-[10px] uppercase tracking-[0.14em] text-blue-100">
              Smart Allocation
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              A suggestion available
            </p>
            <p className="mt-2 text-xs leading-5 text-blue-100">
              Shift 8% of entertainment overflow into your long-term wealth bucket.
            </p>
          </article>
        </section>
      </div>
    </div>
  )
}

export default BudgetIntelligenceSection
