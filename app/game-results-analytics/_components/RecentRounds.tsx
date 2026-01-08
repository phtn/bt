import type { GameResult } from '../analysis'
import { resolveNumericPath } from '../analysis'
import { toLocalISO } from './utils'

export function RecentRounds(props: {
  lastNResults: GameResult[]
  effectiveMetricPath: string
  threshold: number
}) {
  const { lastNResults, effectiveMetricPath, threshold } = props

  return (
    <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
      <h2 className='text-xl font-bold mb-3'>Recent rounds (last {Math.min(20, lastNResults.length)})</h2>
      {lastNResults.length === 0 ? (
        <p className='text-sm text-gray-500 dark:text-gray-400'>No results yet.</p>
      ) : (
        <div className='space-y-3'>
          {lastNResults
            .slice(-20)
            .reverse()
            .map((r) => {
              const v = effectiveMetricPath ? resolveNumericPath(r.data, effectiveMetricPath) : null
              const isWin = v !== null ? v >= threshold : null
              return (
                <div
                  key={r.id}
                  className='p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-background-light/30 dark:bg-background-dark/30'>
                  <div className='flex items-center justify-between gap-4'>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>{toLocalISO(r.timestamp)}</div>
                    <div className='text-xs font-mono text-gray-600 dark:text-gray-300'>
                      {effectiveMetricPath || '(no metric path)'}: {v === null ? '—' : v}
                    </div>
                  </div>
                  <div className='mt-1 text-sm'>
                    {isWin === null ? (
                      <span className='text-gray-500 dark:text-gray-400'>Unknown (metric missing)</span>
                    ) : isWin ? (
                      <span className='text-green-600 dark:text-green-300 font-semibold'>WIN</span>
                    ) : (
                      <span className='text-red-600 dark:text-red-300 font-semibold'>LOSS</span>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

