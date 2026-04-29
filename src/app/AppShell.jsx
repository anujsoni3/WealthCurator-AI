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
  const [theme, setTheme] = useLocalStorage('wealthcurator.theme', 'dark')
  const debouncedSearchQuery = useDebounce(searchQuery, 350)
  const isSearchPending = searchQuery !== debouncedSearchQuery
  const { trackEvent, trackPageView } = useAnalytics()

  const headerSubtitle = useMemo(() => {
    if (!debouncedSearchQuery) {
      return 'Track your personal finance activity in one place.'
    }

    return `Results for "${debouncedSearchQuery}"`
  }, [debouncedSearchQuery])

  const activeHeaderTab = useMemo(() => {
    if (activeNavId === 'insights') {
      return 'analysis'
    }
    if (activeNavId === 'transactions') {
      return 'market'
    }
    return 'portfolio'
  }, [activeNavId])

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

  const handleHeaderTabChange = useCallback(
    (tabId) => {
      const tabToNav = {
        portfolio: 'overview',
        analysis: 'insights',
        market: 'transactions',
      }
      const nextNavId = tabToNav[tabId] || 'overview'
      setActiveNavId(nextNavId)
      setSearchQuery('')
      trackEvent('top_nav_click', { tab_id: tabId })
    },
    [setActiveNavId, trackEvent]
  )

  const handleAlertsOpen = useCallback(() => {
    setActiveNavId('overview')
    setSearchQuery('')
    trackEvent('alerts_click', { source: 'header' })
  }, [setActiveNavId, trackEvent])

  const handleBrandClick = useCallback(() => {
    setActiveNavId('overview')
    setSearchQuery('')
  }, [setActiveNavId])

  const handleThemeToggle = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#060b18] dark:text-slate-100">
      <a
        href="#main-content"
        className="skip-link absolute left-4 top-4 z-50 -translate-y-16 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white focus:translate-y-0 dark:bg-slate-100 dark:text-slate-900"
      >
        Skip to main content
      </a>
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isSearchPending={isSearchPending}
        subtitle={headerSubtitle}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        activeTab={activeHeaderTab}
        onTabChange={handleHeaderTabChange}
        onAlertsOpen={handleAlertsOpen}
        onBrandClick={handleBrandClick}
      />
      <div className="mx-auto flex w-full max-w-[1260px] gap-3 px-3 pb-4 pt-3 sm:px-4 lg:px-5">
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
