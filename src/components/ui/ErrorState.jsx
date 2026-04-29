function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load the latest dashboard information.',
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-center dark:border-rose-500/40 dark:bg-rose-950/30"
    >
      <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">{title}</p>
      <p className="mt-1 text-sm text-rose-600 dark:text-rose-200">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/60 dark:text-rose-300 dark:hover:bg-rose-900/30"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorState
