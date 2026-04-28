import { useMemo, useState } from 'react'
import Header from '../components/layout/Header'
import MainContent from '../components/layout/MainContent'
import Sidebar from '../components/layout/Sidebar'
import { useDebounce } from '../hooks'

function AppShell() {
  const [activeNavId, setActiveNavId] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 350)
  const isSearchPending = searchQuery !== debouncedSearchQuery

  const headerSubtitle = useMemo(() => {
    if (!debouncedSearchQuery) {
      return 'Track your personal finance activity in one place.'
    }

    return `Results for "${debouncedSearchQuery}"`
  }, [debouncedSearchQuery])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchPending={isSearchPending}
        subtitle={headerSubtitle}
      />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <Sidebar activeNavId={activeNavId} onNavChange={setActiveNavId} />
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
