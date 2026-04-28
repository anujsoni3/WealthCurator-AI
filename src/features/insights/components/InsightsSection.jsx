import { useCallback } from 'react'
import EmptyState from '../../../components/ui/EmptyState'
import ErrorState from '../../../components/ui/ErrorState'
import LoadingState from '../../../components/ui/LoadingState'
import { useFetch } from '../../../hooks'
import { getSummaryMetrics } from '../../summary/data/summaryMetrics'
import { getTransactions } from '../../transactions/data/transactions'
import { generateInsights } from '../engine/generateInsights'
import InsightCard from './InsightCard'

async function loadInsightsData() {
  const [metrics, transactions] = await Promise.all([
    getSummaryMetrics(),
    getTransactions(),
  ])

  return generateInsights({ metrics, transactions })
}

function InsightsSection() {
  const fetchInsights = useCallback(() => loadInsightsData(), [])
  const {
    data: insights = [],
    error,
    isLoading,
    refetch,
  } = useFetch(fetchInsights, {
    initialData: [],
    immediate: true,
  })

  if (isLoading) {
    return (
      <LoadingState
        title="Generating AI insights"
        description="Analyzing your financial activity to produce strategy recommendations."
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to generate insights"
        description="Retry to run the insights engine again."
        onRetry={() => void refetch()}
      />
    )
  }

  if (insights.length === 0) {
    return (
      <EmptyState
        title="No insights available"
        description="We need more finance activity data to generate meaningful insights."
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {insights.map((insight) => (
        <InsightCard key={insight.id} {...insight} />
      ))}
    </div>
  )
}

export default InsightsSection
