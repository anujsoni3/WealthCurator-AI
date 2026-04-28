import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import MainContent from '../components/layout/MainContent'
import Sidebar from '../components/layout/Sidebar'
import { useAnalytics, useDebounce, useLocalStorage } from '../hooks'
import { NAV_ITEMS } from '../lib/constants'

function AppShell() {
  const [activeNavId, setActiveNavId] = useLocalStorage(
    'wealthcurator.activeNavId',
    'overview'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 350)
  const isSearchPending = searchQuery !== debouncedSearchQuery
  const { trackEvent, trackPageView } = useAnalytics()

  const headerSubtitle = useMemo(() => {
    if (!debouncedSearchQuery) {
      return 'Track your personal finance activity in one place.'
    }

    return `Results for "${debouncedSearchQuery}"`
  }, [debouncedSearchQuery])

  useEffect(() => {
    trackPageView('dashboard')
  }, [trackPageView])

  useEffect(() => {
    const activeNavLabel =
      NAV_ITEMS.find((item) => item.id === activeNavId)?.label || 'Overview'
    document.title = `WealthCurator AI | ${activeNavLabel}`
  }, [activeNavId])

  useEffect(() => {
    if (!debouncedSearchQuery) {
      return
    }

    trackEvent('dashboard_search_used', { query: debouncedSearchQuery })
  }, [debouncedSearchQuery, trackEvent])

  const handleNavChange = useCallback((nextNavId) => {
    setActiveNavId(nextNavId)
    trackEvent('dashboard_navigation_click', { nav_id: nextNavId })
  }, [setActiveNavId, trackEvent])

  const handleSearchChange = useCallback((nextQuery) => {
    setSearchQuery(nextQuery)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="skip-link absolute left-4 top-4 z-50 -translate-y-16 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white focus:translate-y-0"
      >
        Skip to main content
      </a>
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isSearchPending={isSearchPending}
        subtitle={headerSubtitle}
      />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <Sidebar activeNavId={activeNavId} onNavChange={handleNavChange} />
        <MainContent
          activeNavId={activeNavId}
          searchQuery={debouncedSearchQuery}
          isSearchPending={isSearchPending}
        />
      </div>
    </div>
  )
}

export default AppShell
