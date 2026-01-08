import type { ConditionalRow, WinRateStats } from '../analysis'
import { pct } from './utils'

export function ConditionalAfterLossesTable(props: {
  extractedMetricsCount: number
  conditionalRows: ConditionalRow[]
  baselineWinRate: WinRateStats['winRate']
  currentLossStreak: number
  maxK: number
}) {
  const { extractedMetricsCount, conditionalRows, baselineWinRate, currentLossStreak, maxK } = props

  return (
    <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4'>
        <h2 className='text-xl font-bold'>“After K losses” next-win rates</h2>
        <div className='text-xs text-gray-500 dark:text-gray-400'>Uses extracted rounds only. Prefer higher sample counts.</div>
      </div>

      {extractedMetricsCount === 0 ? (
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          No usable metric values. Pick the correct <strong>Metric path</strong> from the suggestions.
        </p>
      ) : (
        <div className='overflow-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='text-left border-b border-gray-200 dark:border-gray-700'>
                <th className='py-2 pr-4'>K</th>
                <th className='py-2 pr-4'>Samples</th>
                <th className='py-2 pr-4'>Next wins</th>
                <th className='py-2 pr-4'>Next win-rate</th>
                <th className='py-2 pr-0'>Δ vs baseline</th>
              </tr>
            </thead>
            <tbody>
              {conditionalRows.map((row) => {
                const next = row.nextWinRate
                const delta = next === null ? null : next - baselineWinRate
                const highlight =
                  row.k === Math.min(currentLossStreak, maxK) && currentLossStreak > 0 ? 'bg-primary/10' : ''
                return (
                  <tr key={row.k} className={`border-b border-gray-100 dark:border-gray-800 ${highlight}`}>
                    <td className='py-2 pr-4 font-mono'>{row.k}</td>
                    <td className='py-2 pr-4 font-mono'>{row.samples}</td>
                    <td className='py-2 pr-4 font-mono'>{row.nextWins}</td>
                    <td className='py-2 pr-4 font-mono'>{next === null ? '—' : pct(next)}</td>
                    <td className='py-2 pr-0 font-mono'>{delta === null ? '—' : `${(delta * 100).toFixed(1)} pts`}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

