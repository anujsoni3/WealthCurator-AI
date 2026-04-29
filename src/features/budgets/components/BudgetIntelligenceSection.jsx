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

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
              Budget Overview
            </p>
            <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              of {formatCurrency(totalBudget)} allocated
            </p>
          </div>
          <div className="rounded-lg bg-blue-600 px-3 py-2 text-right text-white">
            <p className="text-[10px] uppercase tracking-[0.14em] text-blue-100">
              Utilization
            </p>
            <p className="text-xl font-semibold">{utilization}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Spending Categories
          </h3>
          <div className="mt-4 space-y-3">
            {budgetData.categories.map((category) => {
              const usedPercent = Math.min(
                100,
                Math.round((category.spent / category.budget) * 100)
              )

              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {category.name}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-1.5 rounded-full ${
                        usedPercent >= 90 ? 'bg-rose-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${usedPercent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Budget History
          </h3>
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
        </section>
      </div>
    </div>
  )
}

export default BudgetIntelligenceSection
