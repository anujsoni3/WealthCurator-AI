import { useMemo } from 'react'
import { DASHBOARD_SECTIONS } from '../../lib/constants'
import { SummaryCardsSection } from '../../features'
import EmptyState from '../ui/EmptyState'
import LoadingState from '../ui/LoadingState'

const NAV_TO_SECTION_IDS = {
  overview: null,
  transactions: ['transactions'],
  insights: ['insights'],
  budgets: [],
  portfolio: [],
}

function MainContent({ activeNavId, searchQuery, isSearchPending }) {
  const visibleSections = useMemo(() => {
    const scopedSectionIds = NAV_TO_SECTION_IDS[activeNavId] ?? []
    const normalizedQuery = searchQuery.trim().toLowerCase()

    const navScopedSections =
      scopedSectionIds === null
        ? DASHBOARD_SECTIONS
        : DASHBOARD_SECTIONS.filter((section) => scopedSectionIds.includes(section.id))

    if (!normalizedQuery) {
      return navScopedSections
    }

    return navScopedSections.filter((section) => {
      const haystack = `${section.title} ${section.description}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [activeNavId, searchQuery])

  if (isSearchPending) {
    return (
      <main className="w-full">
        <LoadingState
          title="Searching dashboard"
          description="Applying your search query to relevant dashboard sections."
        />
      </main>
    )
  }

  if (visibleSections.length === 0) {
    return (
      <main className="w-full">
        <EmptyState
          title="No matching sections"
          description="Try a different query or switch navigation tabs to broaden results."
        />
      </main>
    )
  }

  return (
    <main className="w-full space-y-6">
      {visibleSections.map((section) => (
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

          {section.id === 'summary' ? (
            <SummaryCardsSection />
          ) : (
            <EmptyState
              title={`${section.title} content pending`}
              description="This section is intentionally scaffolded and will be implemented in upcoming phases."
            />
          )}
        </section>
      ))}
    </main>
  )
}

export default MainContent
