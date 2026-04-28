function LoadingState({
  title = 'Loading dashboard data',
  description = 'Please wait while we prepare your financial overview.',
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-dashed border-secondary-300 bg-secondary-100 p-4"
    >
      <div className="mb-3 h-2 w-20 animate-pulse rounded bg-primary-300" />
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  )
}

export default LoadingState
