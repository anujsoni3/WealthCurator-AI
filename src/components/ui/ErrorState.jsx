function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load the latest dashboard information.',
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-center"
    >
      <p className="text-sm font-semibold text-rose-700">{title}</p>
      <p className="mt-1 text-sm text-rose-600">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-rose-300 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorState
