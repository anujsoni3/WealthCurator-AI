function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
            WealthCurator AI
          </p>
          <h1 className="text-lg font-semibold text-slate-900">
            Personal Finance Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-primary-300 hover:text-primary-700"
          >
            Notifications
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            AS
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
