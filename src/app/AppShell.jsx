import Header from '../components/layout/Header'
import MainContent from '../components/layout/MainContent'
import Sidebar from '../components/layout/Sidebar'

function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 pb-6 pt-4 sm:px-6 lg:px-8">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  )
}

export default AppShell
