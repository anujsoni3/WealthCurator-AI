import { memo } from 'react'
import { NAV_ITEMS } from '../../lib/constants'

function Sidebar({ activeNavId, onNavChange }) {
  return (
    <aside className="hidden w-60 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
      <nav aria-label="Sidebar Navigation">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Navigation
        </p>
        <ul className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavChange(item.id)}
                aria-current={activeNavId === item.id ? 'page' : undefined}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                  activeNavId === item.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default memo(Sidebar)
