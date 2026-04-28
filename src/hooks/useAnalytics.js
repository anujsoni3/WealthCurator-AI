import { useCallback } from 'react'

function useAnalytics() {
  const trackEvent = useCallback((eventName, params = {}) => {
    if (typeof window === 'undefined') {
      return
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params)
      return
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params })
    }
  }, [])

  const trackPageView = useCallback(
    (pageName) => {
      trackEvent('page_view', { page_name: pageName })
    },
    [trackEvent]
  )

  return {
    trackEvent,
    trackPageView,
  }
}

export default useAnalytics
