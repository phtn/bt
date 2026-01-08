import type { WinRateStats } from '../analysis'
import { pct } from './utils'

export function StatsCards(props: {
  winStats: WinRateStats
  wins: number
  losses: number
  currentLossStreak: number
  extractedUsed: number
  extractedTotal: number
  extractedMissing: number
}) {
  const { winStats, wins, losses, currentLossStreak, extractedUsed, extractedTotal, extractedMissing } = props

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <div className='bg-surface-light dark:bg-surface-dark p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
        <div className='text-sm text-gray-600 dark:text-gray-400'>Baseline win-rate</div>
        <div className='text-3xl font-bold text-primary'>{pct(winStats.winRate)}</div>
        <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
          95% CI: {pct(winStats.wilsonLow)}–{pct(winStats.wilsonHigh)} (n={winStats.n})
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono'>
          wins: {wins} · losses: {losses}
        </div>
      </div>

      <div className='bg-surface-light dark:bg-surface-dark p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
        <div className='text-sm text-gray-600 dark:text-gray-400'>Current loss streak</div>
        <div className='text-3xl font-bold text-orange-500'>{currentLossStreak}</div>
        <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Based on extracted metric vs threshold.</div>
      </div>

      <div className='bg-surface-light dark:bg-surface-dark p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
        <div className='text-sm text-gray-600 dark:text-gray-400'>Data quality</div>
        <div className='text-3xl font-bold text-blue-500'>
          {extractedUsed}/{extractedTotal}
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
          {extractedMissing > 0 ? `${extractedMissing} rounds missing metric` : 'All rounds usable'}
        </div>
      </div>
    </div>
  )
}

