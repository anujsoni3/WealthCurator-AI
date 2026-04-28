import { useCallback, useEffect, useRef, useState } from 'react'

function useFetch(fetcher, options = {}) {
  const { immediate = true, initialData = null } = options
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(immediate)
  const mountedRef = useRef(true)

  const execute = useCallback(async () => {
    if (mountedRef.current) {
      setIsLoading(true)
      setError(null)
    }

    try {
      const result = await fetcher()
      if (mountedRef.current) {
        setData(result)
      }
      return { data: result, error: null }
    } catch (requestError) {
      if (mountedRef.current) {
        setError(requestError)
      }
      return { data: null, error: requestError }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [fetcher])

  useEffect(() => {
    mountedRef.current = true

    if (!immediate) {
      return () => {
        mountedRef.current = false
      }
    }

    const initialFetchTimer = window.setTimeout(() => {
      void execute()
    }, 0)

    return () => {
      window.clearTimeout(initialFetchTimer)
      mountedRef.current = false
    }
  }, [execute, immediate])

  return {
    data,
    error,
    isLoading,
    refetch: execute,
    setData,
  }
}

export default useFetch
