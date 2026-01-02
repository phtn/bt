'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface GameResult {
  id: string
  roundId?: string | number
  timestamp: string
  data: unknown
}

interface ChartDataPoint {
  time: string
  count: number
  timestamp: number
}

interface HourlyDataPoint {
  hour: string
  count: number
}

interface DailyDataPoint {
  date: string
  count: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

export default function GameResultsAnalyticsPage() {
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
      const url = `/game-results?since=${since}`

      const response = await fetch(url, { signal: abortController.signal })

      if (response.ok && !abortController.signal.aborted) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          // Merge with existing results, avoiding duplicates
          setResults((prev) => {
            const existingIds = new Set(prev.map((r) => r.id))
            const newResults = data.results.filter(
              (r: GameResult) => !existingIds.has(r.id)
            )
            const merged = [...prev, ...newResults]
            localStorage.setItem('game-results', JSON.stringify(merged))
            return merged
          })
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

  // Process data for time series chart
  const timeSeriesData = useMemo<ChartDataPoint[]>(() => {
    if (results.length === 0) return []

    // Group by minute for better visualization
    const grouped = new Map<string, number>()
    results.forEach((result) => {
      const date = new Date(result.timestamp)
      const key = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
      grouped.set(key, (grouped.get(key) || 0) + 1)
    })

    return Array.from(grouped.entries())
      .map(([time, count]) => ({
        time,
        count,
        timestamp: new Date(`2000-01-01 ${time}`).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-50) // Last 50 data points
  }, [results])

  // Process data for hourly chart
  const hourlyData = useMemo<HourlyDataPoint[]>(() => {
    if (results.length === 0) return []

    const hourlyCounts = new Map<number, number>()
    results.forEach((result) => {
      const hour = new Date(result.timestamp).getHours()
      hourlyCounts.set(hour, (hourlyCounts.get(hour) || 0) + 1)
    })

    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      count: hourlyCounts.get(i) || 0,
    }))
  }, [results])

  // Process data for daily chart
  const dailyData = useMemo<DailyDataPoint[]>(() => {
    if (results.length === 0) return []

    const dailyCounts = new Map<string, number>()
    results.forEach((result) => {
      const date = new Date(result.timestamp)
      const dateKey = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      dailyCounts.set(dateKey, (dailyCounts.get(dateKey) || 0) + 1)
    })

    return Array.from(dailyCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      .slice(-7) // Last 7 days
  }, [results])

  // Calculate statistics
  const stats = useMemo(() => {
    if (results.length === 0) {
      return {
        total: 0,
        today: 0,
        thisHour: 0,
        averagePerHour: 0,
        uniqueRounds: 0,
      }
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours()
    )

    const todayCount = results.filter(
      (r) => new Date(r.timestamp) >= today
    ).length

    const thisHourCount = results.filter(
      (r) => new Date(r.timestamp) >= thisHour
    ).length

    const uniqueRounds = new Set(
      results.filter((r) => r.roundId !== undefined).map((r) => r.roundId)
    ).size

    // Calculate average per hour (based on time span of data)
    const firstResult = results[0]
    const lastResult = results[results.length - 1]
    const timeSpanHours =
      (new Date(lastResult.timestamp).getTime() -
        new Date(firstResult.timestamp).getTime()) /
      (1000 * 60 * 60)
    const averagePerHour =
      timeSpanHours > 0 ? results.length / timeSpanHours : 0

    return {
      total: results.length,
      today: todayCount,
      thisHour: thisHourCount,
      averagePerHour: Math.round(averagePerHour * 10) / 10,
      uniqueRounds,
    }
  }, [results])

  return (
    <div className='min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>Game Results Analytics</h1>
            <p className='text-gray-600 dark:text-gray-400'>
              Visualize and analyze game results data with interactive charts
            </p>
          </div>
          <div className='flex gap-4 items-center'>
            <button
              onClick={fetchLatestResults}
              disabled={loading}
              className='px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity'>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={clearResults}
              className='px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity'>
              Clear All
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8'>
          <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
              Total Results
            </p>
            <p className='text-3xl font-bold text-primary'>{stats.total}</p>
          </div>
          <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
              Today
            </p>
            <p className='text-3xl font-bold text-green-500'>{stats.today}</p>
          </div>
          <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
              This Hour
            </p>
            <p className='text-3xl font-bold text-blue-500'>
              {stats.thisHour}
            </p>
          </div>
          <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
              Avg/Hour
            </p>
            <p className='text-3xl font-bold text-purple-500'>
              {stats.averagePerHour}
            </p>
          </div>
          <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
              Unique Rounds
            </p>
            <p className='text-3xl font-bold text-orange-500'>
              {stats.uniqueRounds}
            </p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-gray-500 dark:text-gray-400 text-lg'>
              No results yet. Game results will appear here when games are
              played.
            </p>
          </div>
        ) : (
          <div className='space-y-8'>
            {/* Time Series Chart */}
            <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
              <h2 className='text-2xl font-bold mb-4'>
                Results Over Time (Last 50 Minutes)
              </h2>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='time' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='count'
                    stroke='#0088FE'
                    strokeWidth={2}
                    name='Results'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Hourly Distribution Chart */}
            <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
              <h2 className='text-2xl font-bold mb-4'>
                Results by Hour of Day
              </h2>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='hour' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' fill='#00C49F' name='Results' />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Distribution Chart */}
            <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
              <h2 className='text-2xl font-bold mb-4'>
                Results by Day (Last 7 Days)
              </h2>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='count' fill='#FFBB28' name='Results' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

