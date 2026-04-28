import { DASHBOARD_SECTIONS } from '../../lib/constants'
import EmptyState from '../ui/EmptyState'

function MainContent() {
  return (
    <main className="w-full space-y-6">
      {DASHBOARD_SECTIONS.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-4 border-b border-slate-100 pb-4">
            <h2
              id={`${section.id}-heading`}
              className="text-lg font-semibold text-slate-900"
            >
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{section.description}</p>
          </div>

          <EmptyState
            title={`${section.title} content pending`}
            description="This section is intentionally scaffolded in Phase 1 and will be implemented in upcoming phases."
          />
        </section>
      ))}
    </main>
  )
}

export default MainContent
