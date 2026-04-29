import { memo } from 'react'
import { NAV_ITEMS } from '../../lib/constants'

function Sidebar({ activeNavId, onNavChange }) {
  return (
    <aside className="hidden h-[calc(100vh-96px)] w-56 shrink-0 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-[#070f20] lg:flex lg:flex-col">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400">
          Wealth Curator
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Premium management
        </p>
      </div>

      <nav aria-label="Sidebar Navigation" className="mt-5">
        <ul className="space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavChange(item.id)}
                aria-current={activeNavId === item.id ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
                className={`w-full rounded-md px-3 py-2 text-left text-[12px] font-medium transition ${
                  activeNavId === item.id
                    ? 'bg-primary-50 text-primary-700 dark:bg-blue-600/20 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-lg border border-blue-400/30 bg-blue-600 px-3 py-3 text-white">
          <p className="text-[10px] uppercase tracking-[0.14em] text-blue-100">Pro Access</p>
          <p className="mt-1 text-xs text-blue-50">Unlock AI strategy insights</p>
          <button className="mt-3 w-full rounded bg-white px-2 py-1.5 text-xs font-semibold text-blue-700">
            Upgrade to Premium
          </button>
        </div>

        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <button className="w-full rounded px-2 py-1 text-left hover:bg-slate-100 dark:hover:bg-slate-800">
            Support
          </button>
          <button className="w-full rounded px-2 py-1 text-left hover:bg-slate-100 dark:hover:bg-slate-800">
            Log Out
          </button>
        </div>
      </div>
    </aside>
  )
}

export default memo(Sidebar)
