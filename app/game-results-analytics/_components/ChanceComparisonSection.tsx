import type { ChanceComparison } from './types'
import { pct } from './utils'

export function ChanceComparisonSection(props: {
  chancePath: string
  chanceComparison: ChanceComparison
}) {
  const { chancePath, chanceComparison } = props

  return (
    <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4'>
        <h2 className='text-xl font-bold'>Actual win rate vs {chancePath || 'predicted chance'}</h2>
        <div className='text-xs text-gray-500 dark:text-gray-400'>Compares only rounds where both metric + predicted chance exist.</div>
      </div>

      {chanceComparison.matched === 0 ? (
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          No matches yet for <span className='font-mono'>{chancePath || '—'}</span>. Confirm the path exists in your payload (example:{' '}
          <span className='font-mono'>custom.winningChance</span>).
        </p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-5 rounded-lg border border-gray-200 dark:border-gray-700'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>Avg predicted chance</div>
            <div className='text-3xl font-bold text-purple-500'>
              {chanceComparison.avgPredicted === null ? '—' : pct(chanceComparison.avgPredicted)}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono'>matched: {chanceComparison.matched}</div>
          </div>
          <div className='p-5 rounded-lg border border-gray-200 dark:border-gray-700'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>Actual win rate (matched subset)</div>
            <div className='text-3xl font-bold text-primary'>
              {chanceComparison.actualWinRate === null ? '—' : pct(chanceComparison.actualWinRate)}
            </div>
          </div>
          <div className='p-5 rounded-lg border border-gray-200 dark:border-gray-700'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>Difference (actual − predicted)</div>
            <div className='text-3xl font-bold text-blue-500'>
              {chanceComparison.delta === null ? '—' : `${(chanceComparison.delta * 100).toFixed(1)} pts`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

