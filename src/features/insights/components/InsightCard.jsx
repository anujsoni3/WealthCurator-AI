const PRIORITY_STYLES = {
  high: 'bg-rose-50 text-rose-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-emerald-50 text-emerald-700',
}

function InsightCard({ title, message, priority }) {
  const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.low

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${priorityStyle}`}
        >
          {priority}
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-600">{message}</p>
    </article>
  )
}

export default InsightCard
