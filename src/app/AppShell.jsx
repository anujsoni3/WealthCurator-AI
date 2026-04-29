import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from '../components/layout/Header'
import MainContent from '../components/layout/MainContent'
import Sidebar from '../components/layout/Sidebar'
import { useAnalytics, useDebounce, useLocalStorage } from '../hooks'
import { ALERT_ITEMS, NAV_ITEMS } from '../lib/constants'

function AppShell() {
  const [activeNavId, setActiveNavId] = useLocalStorage(
    'wealthcurator.activeNavId',
    'overview'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useLocalStorage('wealthcurator.theme', 'dark')
  const [isAlertsOpen, setIsAlertsOpen] = useState(false)
  const alertsPanelRef = useRef(null)
  const debouncedSearchQuery = useDebounce(searchQuery, 350)
  const isSearchPending = searchQuery !== debouncedSearchQuery
  const { trackEvent, trackPageView } = useAnalytics()
  const validNavIds = useMemo(() => NAV_ITEMS.map((item) => item.id), [])
  const resolvedActiveNavId = validNavIds.includes(activeNavId) ? activeNavId : 'overview'

  const activeHeaderTab = useMemo(() => {
    if (resolvedActiveNavId === 'insights') {
      return 'insightsTab'
    }
    if (resolvedActiveNavId === 'transactions') {
      return 'insightsTab'
    }
    if (resolvedActiveNavId === 'portfolio') {
      return 'portfolio'
    }
    return 'portfolio'
  }, [resolvedActiveNavId])

  useEffect(() => {
    trackPageView('dashboard')
  }, [trackPageView])

  useEffect(() => {
    if (resolvedActiveNavId !== activeNavId) {
      setActiveNavId('overview')
    }
  }, [activeNavId, resolvedActiveNavId, setActiveNavId])

  useEffect(() => {
    const activeNavLabel =
      NAV_ITEMS.find((item) => item.id === resolvedActiveNavId)?.label || 'Overview'
    document.title = `WealthCurator AI | ${activeNavLabel}`
  }, [resolvedActiveNavId])

  useEffect(() => {
    if (!debouncedSearchQuery) {
      return
    }

    trackEvent('dashboard_search_used', { query: debouncedSearchQuery })
  }, [debouncedSearchQuery, trackEvent])

  const handleNavChange = useCallback((nextNavId) => {
    setActiveNavId(nextNavId)
    setSearchQuery('')
    setIsAlertsOpen(false)
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
        overviewTab: 'overview',
        portfolioTab: 'portfolio',
        insightsTab: 'insights',
        planningTab: 'budgets',
      }
      const nextNavId = tabToNav[tabId] || 'overview'
      setActiveNavId(nextNavId)
      setSearchQuery('')
      setIsAlertsOpen(false)
      trackEvent('top_nav_click', { tab_id: tabId })
    },
    [setActiveNavId, trackEvent]
  )

  const handleAlertsOpen = useCallback(() => {
    setIsAlertsOpen(true)
    trackEvent('alerts_click', { source: 'header' })
  }, [trackEvent])

  const handleAlertsClose = useCallback(() => {
    setIsAlertsOpen(false)
  }, [])

  const handleBrandClick = useCallback(() => {
    setActiveNavId('overview')
    setSearchQuery('')
    setIsAlertsOpen(false)
  }, [setActiveNavId])

  const handleThemeToggle = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (!isAlertsOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panelNode = alertsPanelRef.current
    const focusableElements = panelNode
      ? Array.from(
          panelNode.querySelectorAll(
            'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
          )
        )
      : []
    const firstFocusable = focusableElements[0] || panelNode
    firstFocusable?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsAlertsOpen(false)
        return
      }

      if (event.key !== 'Tab' || focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isAlertsOpen])

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
        theme={theme}
        onThemeToggle={handleThemeToggle}
        activeNavId={resolvedActiveNavId}
        activeTab={activeHeaderTab}
        onTabChange={handleHeaderTabChange}
        onAlertsOpen={handleAlertsOpen}
        onBrandClick={handleBrandClick}
      />
      <div className="mx-auto flex w-full max-w-[1260px] gap-3 px-3 pb-4 pt-3 sm:px-4 lg:px-5">
        <Sidebar activeNavId={resolvedActiveNavId} onNavChange={handleNavChange} />
        <MainContent
          activeNavId={resolvedActiveNavId}
          searchQuery={debouncedSearchQuery}
          isSearchPending={isSearchPending}
        />
      </div>

      {isAlertsOpen && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Close alerts panel"
            onClick={handleAlertsClose}
            className="absolute inset-0 bg-slate-900/45"
          />

          <aside
            ref={alertsPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Active alerts panel"
            tabIndex={-1}
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-200 bg-white p-4 shadow-2xl transition-transform duration-200 dark:border-slate-800 dark:bg-[#0b1326]"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Active Alerts
              </h2>
              <button
                type="button"
                onClick={handleAlertsClose}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {ALERT_ITEMS.map((alert) => (
                <article
                  key={alert.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {alert.title}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        alert.severity === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                          : alert.severity === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    {alert.message}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                    {alert.time}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

export default AppShell
