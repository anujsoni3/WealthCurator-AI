import { useEffect, useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import MainContent from '../components/layout/MainContent'
import Sidebar from '../components/layout/Sidebar'
import { useAnalytics, useDebounce, useLocalStorage } from '../hooks'

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
    if (!debouncedSearchQuery) {
      return
    }

    trackEvent('dashboard_search_used', { query: debouncedSearchQuery })
  }, [debouncedSearchQuery, trackEvent])

  const handleNavChange = (nextNavId) => {
    setActiveNavId(nextNavId)
    trackEvent('dashboard_navigation_click', { nav_id: nextNavId })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
