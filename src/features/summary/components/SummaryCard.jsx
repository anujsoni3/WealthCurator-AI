import { memo } from 'react'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function SummaryCard({ title, value, delta, trend, helperText }) {
  const isPositive = trend === 'up'
  const deltaClassName = isPositive
    ? 'text-emerald-600 bg-emerald-50'
    : 'text-rose-600 bg-rose-50'
  const deltaLabel = `${isPositive ? '+' : '-'}${Math.abs(delta)}%`

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {formatCurrency(value)}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${deltaClassName}`}
        >
          {deltaLabel}
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      </div>
    </article>
  )
}

export default memo(SummaryCard)
