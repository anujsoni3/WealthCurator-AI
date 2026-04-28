import { useCallback } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useFetch } from '../../../hooks'
import { getSummaryMetrics } from '../data/summaryMetrics'
import SummaryCard from './SummaryCard'

function SummaryCardsSection() {
  const fetchSummaryMetrics = useCallback(() => getSummaryMetrics(), [])
  const {
    data: metrics = [],
    error,
    isLoading,
    refetch,
  } = useFetch(fetchSummaryMetrics, {
    initialData: [],
    immediate: true,
  })

  const handleRetry = () => {
    void refetch()
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
