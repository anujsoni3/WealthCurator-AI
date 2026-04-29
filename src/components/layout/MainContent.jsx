import { Suspense, lazy, useMemo } from 'react'
import EmptyState from '../ui/EmptyState'
import LoadingState from '../ui/LoadingState'
import { getFilteredSections } from '../../lib/search/dashboardSections'

const SummaryCardsSection = lazy(() =>
  import('../../features/summary/components/SummaryCardsSection')
)
const InsightsSection = lazy(() =>
  import('../../features/insights/components/InsightsSection')
)
const TransactionsSection = lazy(() =>
  import('../../features/transactions/components/TransactionsSection')
)
const BudgetIntelligenceSection = lazy(() =>
  import('../../features/budgets/components/BudgetIntelligenceSection')
)
const BudgetOverviewSection = lazy(() =>
  import('../../features/budgets/components/BudgetOverviewSection')
)
const DesignSystemShowcase = lazy(() =>
  import('../../features/design-system/components/DesignSystemShowcase')
)
const PortfolioOverview = lazy(() =>
  import('../../features/portfolio/components/PortfolioOverview')
)

function MainContent({ activeNavId, searchQuery, isSearchPending }) {
  const normalizedSearchQuery = (searchQuery || '').trim()
  const isOverviewDefaultView = activeNavId === 'overview' && !normalizedSearchQuery
  const isPortfolioDefaultView = activeNavId === 'portfolio' && !normalizedSearchQuery
  const isInsightsDefaultView = activeNavId === 'insights' && !normalizedSearchQuery
  const isTransactionsDefaultView = activeNavId === 'transactions' && !normalizedSearchQuery
  const isBudgetsDefaultView = activeNavId === 'budgets' && !normalizedSearchQuery
  const visibleSections = useMemo(
    () => getFilteredSections(activeNavId, normalizedSearchQuery),
    [activeNavId, normalizedSearchQuery]
  )

  if (isSearchPending) {
    return (
      <main id="main-content" tabIndex={-1} className="w-full" aria-busy="true">
        <LoadingState
          title="Searching dashboard"
          description="Applying your search query to relevant dashboard sections."
        />
      </main>
    )
  }

  if (isOverviewDefaultView) {
    return (
      <main id="main-content" tabIndex={-1} className="w-full space-y-4">
        <Suspense
          fallback={
            <LoadingState
              title="Loading portfolio overview"
              description="Preparing your strategy-focused dashboard."
            />
          }
        >
          <PortfolioOverview />
        </Suspense>
      </main>
    )
  }

  if (isPortfolioDefaultView) {
    return (
      <main id="main-content" tabIndex={-1} className="w-full space-y-4">
        <Suspense
          fallback={
            <LoadingState
              title="Loading design system"
              description="Preparing typography, tokens, and component showcase."
            />
          }
        >
          <DesignSystemShowcase />
        </Suspense>
      </main>
    )
  }

  if (isInsightsDefaultView) {
    return (
      <main id="main-content" tabIndex={-1} className="w-full space-y-4">
        <Suspense
          fallback={
            <LoadingState
              title="Loading insights workspace"
              description="Preparing your personalized intelligence view."
            />
          }
        >
          <InsightsSection />
        </Suspense>
      </main>
    )
  }

  if (isTransactionsDefaultView) {
    return (
      <main id="main-content" tabIndex={-1} className="w-full space-y-4">
        <Suspense
          fallback={
            <LoadingState
              title="Loading transactions workspace"
              description="Preparing your monthly overview and category allocations."
            />
          }
        >
          <BudgetIntelligenceSection />
        </Suspense>
      </main>
    )
  }

  if (isBudgetsDefaultView) {
    return (
      <main id="main-content" tabIndex={-1} className="w-full space-y-4">
        <Suspense
          fallback={
            <LoadingState
              title="Loading budget workspace"
              description="Preparing your spending categories and budget history."
            />
          }
        >
          <BudgetOverviewSection />
        </Suspense>
      </main>
    )
  }

  if (visibleSections.length === 0) {
    return (
      <main id="main-content" tabIndex={-1} className="w-full">
        <EmptyState
          title="No matching sections"
          description="Try a different query or switch navigation tabs to broaden results."
        />
      </main>
    )
  }

  return (
    <main id="main-content" tabIndex={-1} className="w-full space-y-4">
      {visibleSections.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
        >
          <div className="mb-4 border-b border-slate-100 pb-4 dark:border-slate-800">
            <h2
              id={`${section.id}-heading`}
              className="text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              {section.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {section.description}
            </p>
          </div>

          <Suspense
            fallback={
              <LoadingState
                title={`Loading ${section.title}`}
                description="Preparing section components for display."
              />
            }
          >
            {section.id === 'summary' ? (
              <SummaryCardsSection />
            ) : section.id === 'designSystem' ? (
              <DesignSystemShowcase />
            ) : section.id === 'portfolio' ? (
              <PortfolioOverview />
            ) : section.id === 'budgets' ? (
              <BudgetIntelligenceSection />
            ) : section.id === 'insights' ? (
              <InsightsSection />
            ) : section.id === 'transactions' ? (
              <TransactionsSection />
            ) : (
              <EmptyState
                title={`${section.title} unavailable`}
                description="This section could not be rendered right now. Please try again."
              />
            )}
          </Suspense>
        </section>
      ))}
    </main>
  )
}

export default MainContent
