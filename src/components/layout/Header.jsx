import { memo } from 'react'

function Header({
  searchQuery,
  onSearchChange,
  isSearchPending,
  theme,
  onThemeToggle,
  activeNavId,
  activeTab,
  onTabChange,
  onAlertsOpen,
}) {
  const topTabs =
    activeNavId === 'insights' || activeNavId === 'transactions'
      ? [
          { id: 'overviewTab', label: 'Overview' },
          { id: 'portfolioTab', label: 'Portfolio' },
          { id: 'insightsTab', label: 'Insights' },
          { id: 'planningTab', label: 'Planning' },
        ]
      : [
          { id: 'portfolio', label: 'Portfolio' },
          { id: 'analysis', label: 'Analysis' },
          { id: 'market', label: 'Market' },
        ]

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-[#080f1f]/90">
      <div className="mx-auto flex w-full max-w-[1260px] items-center gap-4 px-3 py-2.5 sm:px-4 lg:px-5">
        <div className="relative hidden flex-1 items-center lg:flex">
          <label htmlFor="dashboard-search" className="sr-only">
            Search dashboard sections
          </label>
          <input
            id="dashboard-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search portfolio or markets..."
            autoComplete="off"
            enterKeyHint="search"
            aria-describedby="dashboard-search-status"
            className="w-full rounded-md border border-slate-200 bg-slate-50 px-10 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-primary-400 dark:border-slate-700 dark:bg-[#0f1729] dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>
          <span
            id="dashboard-search-status"
            aria-live="polite"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400 dark:text-slate-500"
          >
            {isSearchPending ? 'Typing...' : 'Ready'}
          </span>
        </div>

        <div className="flex items-center gap-1 rounded-md dark:bg-transparent">
          {topTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`border-b-2 px-3 py-1.5 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-300'
                  : 'border-transparent text-slate-500 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onAlertsOpen}
            aria-label="Open notifications"
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
          >
            🔔
          </button>
          <button
            type="button"
            onClick={onThemeToggle}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button className="text-sm font-medium text-slate-500 dark:text-slate-300">
            Settings
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
    </header>
  )
}

export default memo(Header)
