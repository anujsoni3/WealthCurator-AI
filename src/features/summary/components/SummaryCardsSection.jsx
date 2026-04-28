import { useEffect, useState } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { getSummaryMetrics } from '../data/summaryMetrics'
import SummaryCard from './SummaryCard'

function SummaryCardsSection() {
  const [metrics, setMetrics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadMetrics = async () => {
    try {
      const response = await getSummaryMetrics()
      setMetrics(response)
    } catch (loadError) {
      setError(loadError)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadMetrics()
    }, 0)

    return () => {
      window.clearTimeout(loadTimer)
    }
  }, [])

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    void loadMetrics()
  }

  if (isLoading) {
    return (
      <LoadingState
        title="Loading summary cards"
        description="Preparing your latest net worth, spending, and savings overview."
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load summary metrics"
        description="Please retry to refresh financial summaries."
        onRetry={handleRetry}
      />
    )
  }

  if (metrics.length === 0) {
    return (
      <EmptyState
        title="No summary metrics available"
        description="Connect your data sources to populate summary cards."
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <SummaryCard key={metric.id} {...metric} />
      ))}
    </div>
  )
}

export default SummaryCardsSection
