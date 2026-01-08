import type { RecommendationTally } from '../analysis'
import { pct } from './utils'

export function RecommendationTallySection(props: { tally: RecommendationTally; usableRounds: number }) {
  const { tally, usableRounds } = props

  return (
    <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4'>
        <h2 className='text-xl font-bold'>Recommendation tally vs outcome (backtest)</h2>
        <div className='text-xs text-gray-500 dark:text-gray-400'>
          Replays signals using only prior rounds, then checks the next round’s outcome.
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='p-5 rounded-lg border border-green-500/20 bg-green-500/10'>
          <div className='text-sm text-gray-700 dark:text-gray-200'>BET calls</div>
          <div className='text-3xl font-bold text-green-600 dark:text-green-300'>{tally.betCalls}</div>
          <div className='text-xs text-gray-600 dark:text-gray-300 mt-1 font-mono'>
            wins: {tally.betWins} · losses: {tally.betLosses} · acc: {tally.betAccuracy === null ? '—' : pct(tally.betAccuracy)}
          </div>
        </div>
        <div className='p-5 rounded-lg border border-red-500/20 bg-red-500/10'>
          <div className='text-sm text-gray-700 dark:text-gray-200'>HOLD calls</div>
          <div className='text-3xl font-bold text-red-600 dark:text-red-300'>{tally.holdCalls}</div>
          <div className='text-xs text-gray-600 dark:text-gray-300 mt-1 font-mono'>
            correct holds (losses): {tally.holdLosses} · missed (wins): {tally.holdWins} · acc:{' '}
            {tally.holdAccuracy === null ? '—' : pct(tally.holdAccuracy)}
          </div>
        </div>
        <div className='p-5 rounded-lg border border-gray-500/20 bg-gray-500/10'>
          <div className='text-sm text-gray-700 dark:text-gray-200'>NO SIGNAL</div>
          <div className='text-3xl font-bold text-gray-700 dark:text-gray-200'>{tally.noSignalCalls}</div>
          <div className='text-xs text-gray-600 dark:text-gray-300 mt-1 font-mono'>
            wins: {tally.noSignalWins} · losses: {tally.noSignalLosses}
          </div>
        </div>
      </div>

      <div className='text-xs text-gray-500 dark:text-gray-400 mt-3'>
        Evaluated transitions: <span className='font-mono'>{tally.totalEvaluated}</span> (from{' '}
        <span className='font-mono'>{usableRounds}</span> usable rounds)
      </div>
    </div>
  )
}

