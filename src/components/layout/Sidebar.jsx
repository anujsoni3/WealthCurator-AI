import { memo } from 'react'

const NAV_ICONS = {
  overview: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  portfolio: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  transactions: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  budgets: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  insights: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  analytics: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
}

function Sidebar({ activeNavId, onNavChange }) {
  const isSpecialView = activeNavId === 'insights' || activeNavId === 'transactions' || activeNavId === 'budgets'
  const visibleNavItems = isSpecialView
    ? [
        { id: 'overview', label: 'Dashboard' },
        { id: 'portfolio', label: 'Accounts' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'budgets', label: 'Budgets' },
        { id: 'insights', label: 'Insights' },
      ]
    : [
        { id: 'overview', label: 'Dashboard' },
        { id: 'portfolio', label: 'Accounts' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'budgets', label: 'Budgets' },
        { id: 'insights', label: 'Insights' },
      ]

  return (
    <aside className="hidden w-56 shrink-0 self-stretch border-r border-slate-200 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-[#0a1628] lg:flex lg:min-h-[calc(100vh-72px)] lg:flex-col">
      <button type="button" onClick={() => onNavChange('overview')} className="text-left">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
            P
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-none text-slate-900 dark:text-slate-100">
              Wealth Curator
            </p>
          </div>
        </div>
      </button>

      <div className="mt-5">
        <ul className="space-y-1">
          {visibleNavItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavChange(item.id)}
                aria-current={activeNavId === item.id ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[13px] font-medium transition ${
                  activeNavId === item.id
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                {NAV_ICONS[item.id] || NAV_ICONS.overview}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto space-y-3">
        <div className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-3 dark:border-slate-700 dark:bg-[#111d30]">
          <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Upgrade to Premium
          </p>
          <p className="mt-1 text-[12px] leading-5 text-slate-600 dark:text-slate-300">
            Get advanced algorithmic insights and concierge planning.
          </p>
          <button className="mt-3 w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
            Upgrade Now
          </button>
        </div>

        <div className="space-y-1 text-[13px] text-slate-500 dark:text-slate-400">
          <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Support
          </button>
          <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 dark:border-slate-700 dark:bg-[#111d30]">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.12em] text-slate-400">Institutional Grade</p>
            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Proton Secured</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default memo(Sidebar)
