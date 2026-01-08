'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface GameResult {
  id: string
  timestamp: string
  data: unknown
}

export default function GameResultsViewPage() {
  const [results, setResults] = useState<GameResult[]>([])
  const [loading, setLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const resultsRef = useRef<GameResult[]>([])

  // Keep ref in sync with state
  useEffect(() => {
    resultsRef.current = results
  }, [results])

  // Load results from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('game-results')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as GameResult[]
        setResults(parsed)
        resultsRef.current = parsed
      } catch (error) {
        console.error('Failed to load stored results:', error)
      }
    }
  }, [])

  // Fetch latest results with proper cleanup
  const fetchLatestResults = useCallback(async () => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController for this request
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      setLoading(true)

      // Use ref to get latest results value without stale closure
      const currentResults = resultsRef.current
      const since = currentResults[currentResults.length - 1]?.timestamp || ''
      const url = `/api/results?since=${since}`

      const response = await fetch(url, { signal: abortController.signal })

      if (!abortController.signal.aborted) {
        // Handle 204 No Content response
        if (response.status === 204) {
          console.warn('Received 204 No Content response from /api/results')
          return
        }

        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (!contentType || !contentType.includes('application/json')) {
            console.warn('Response is not JSON:', contentType)
            return
          }

          const data = await response.json()
          console.log('Fetched results:', { count: data.count, resultsLength: data.results?.length })
          
          if (data.results && Array.isArray(data.results)) {
            if (data.results.length > 0) {
              // Merge with existing results, avoiding duplicates
              setResults((prev) => {
                const existingIds = new Set(prev.map((r) => r.id))
                const newResults = data.results.filter((r: GameResult) => !existingIds.has(r.id))
                const merged = [...prev, ...newResults]
                localStorage.setItem('game-results', JSON.stringify(merged))
                return merged
              })
            } else {
              console.log('No new results to add')
            }
          } else {
            console.warn('Response data.results is not an array:', data)
          }
        } else {
          const errorText = await response.text().catch(() => 'Unknown error')
          console.error(`Failed to fetch results: ${response.status} ${response.statusText}`, errorText)
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to fetch results:', error)
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Set up polling to fetch latest results
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestResults()
    }, 2000) // Poll every 2 seconds

    return () => {
      clearInterval(interval)
      // Cancel any pending fetch on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchLatestResults])

  const clearResults = () => {
    if (confirm('Are you sure you want to clear all results?')) {
      setResults([])
      resultsRef.current = []
      localStorage.removeItem('game-results')
    }
  }

  return (
    <div className='min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>Game Results</h1>
            <p className='text-gray-600 dark:text-gray-400'>View and accumulate game results</p>
          </div>
          <div className='flex gap-4 items-center'>
            <button
              onClick={fetchLatestResults}
              disabled={loading}
              className='px-4 py-2 bg-primary disabled:scale-50 disabled:opacity-20 transition-all duration-500 ease-in-out text-background rounded-lg font-medium hover:opacity-90'>
              Refresh
            </button>
            <button
              onClick={clearResults}
              className='px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity'>
              Clear All
            </button>
          </div>
        </div>

        <div className='mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
          <p className='text-sm text-blue-800 dark:text-blue-200'>
            <strong>Total Results:</strong> {results.length}
          </p>
        </div>

        {results.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-gray-500 dark:text-gray-400 text-lg'>
              No results yet. Game results will appear here when games are played.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {results.map((result) => (
              <div
                key={result.id}
                className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                    <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>ID: {result.id}</p>
                  </div>
                </div>
                <pre className='p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto text-sm font-mono max-h-96'>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
