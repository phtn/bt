import type { BetSignal } from '../analysis'

export function RecommendationPanel(props: { signal: BetSignal }) {
  const { signal } = props

  const actionTone =
    signal.action === 'BET'
      ? 'border-green-400/40 bg-green-500/10'
      : signal.action === 'HOLD'
        ? 'border-red-400/40 bg-red-500/10'
        : 'border-gray-400/30 bg-gray-500/10'

  return (
    <div className={`p-6 rounded-lg shadow-lg border ${actionTone}`}>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>
            Recommendation:{' '}
            <span className='font-black'>{signal.action === 'NO_SIGNAL' ? 'NO SIGNAL' : signal.action}</span>
          </h2>
          <p className='text-gray-700 dark:text-gray-200 mt-1'>{signal.reason}</p>
        </div>
        <div className='text-sm text-gray-700 dark:text-gray-200'>
          <div>
            <strong>Confidence:</strong> {signal.confidence}
          </div>
          {signal.usedK !== null ? (
            <div>
              <strong>K:</strong> {signal.usedK}{' '}
              {signal.usedSamples !== null ? (
                <span className='text-gray-600 dark:text-gray-300'>(samples: {signal.usedSamples})</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

