import { memo } from 'react'

function Header({ searchQuery, onSearchChange, isSearchPending, subtitle }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-primary-600">
            WealthCurator AI
          </p>
          <h1 className="text-lg font-semibold text-slate-900">
            Personal Finance Dashboard
          </h1>
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="flex flex-1 items-center gap-3 lg:max-w-xl">
          <label htmlFor="dashboard-search" className="sr-only">
            Search dashboard sections
          </label>
          <div className="relative w-full">
            <input
              id="dashboard-search"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search sections, insights, or transactions"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-20 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
              {isSearchPending ? 'Typing...' : 'Ready'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
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

export default memo(Header)
