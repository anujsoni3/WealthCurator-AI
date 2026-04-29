import { memo } from 'react'

function Header({
  searchQuery,
  onSearchChange,
  isSearchPending,
  subtitle,
  theme,
  onThemeToggle,
}) {
  const topTabs = ['Portfolio', 'Analysis', 'Market']

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-[#080f1f]/90">
      <div className="mx-auto flex w-full max-w-[1260px] flex-col gap-2 px-3 py-2.5 sm:px-4 lg:px-5">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-600 dark:text-blue-400">
              Editorial Finance
            </p>
          </div>

          <div className="hidden items-center gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-900 md:flex">
            {topTabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`rounded px-2.5 py-1 text-xs font-medium ${
                  index === 0
                    ? 'bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onThemeToggle}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              aria-label="Open notifications"
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-primary-300 hover:text-primary-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
            >
              Alerts
            </button>
            <div
              role="img"
              aria-label="User profile avatar"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-blue-600/20 dark:text-blue-300"
            >
              AS
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-[26px] font-semibold leading-tight text-slate-900 dark:text-slate-100">
              Personal Finance Dashboard
            </h1>
            <p className="truncate text-[12px] text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
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
                placeholder="Search portfolio or markets..."
                autoComplete="off"
                enterKeyHint="search"
                aria-describedby="dashboard-search-status"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-20 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <span
                id="dashboard-search-status"
                aria-live="polite"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 dark:text-slate-500"
              >
                {isSearchPending ? 'Typing...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default memo(Header)
