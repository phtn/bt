import type { NumericPathCandidate } from '../analysis'

export function InputsPanel(props: {
  windowSize: number
  onWindowSizeChange: (next: number) => void
  threshold: number
  onThresholdChange: (next: number) => void
  metricPath: string
  onMetricPathChange: (next: string) => void
  chancePath: string
  onChancePathChange: (next: string) => void
  maxK: number
  onMaxKChange: (next: number) => void
  minSamples: number
  onMinSamplesChange: (next: number) => void
  minDeltaPts: number
  onMinDeltaPtsChange: (next: number) => void
  candidates: NumericPathCandidate[]
}) {
  const {
    windowSize,
    onWindowSizeChange,
    threshold,
    onThresholdChange,
    metricPath,
    onMetricPathChange,
    chancePath,
    onChancePathChange,
    maxK,
    onMaxKChange,
    minSamples,
    onMinSamplesChange,
    minDeltaPts,
    onMinDeltaPtsChange,
    candidates,
  } = props

  return (
    <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
      <h2 className='text-xl font-bold mb-4'>Inputs</h2>

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Window size (rounds)</label>
          <input
            value={windowSize}
            onChange={(e) => onWindowSizeChange(Number(e.target.value))}
            type='number'
            min={0}
            max={1000}
            className='w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark'
          />
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Default: 100. Min: 20.</p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>“Win” threshold (target)</label>
          <input
            value={threshold}
            onChange={(e) => onThresholdChange(Number(e.target.value))}
            type='number'
            step='0.01'
            min={1.01}
            className='w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark'
          />
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            A round counts as a win if extracted value ≥ threshold (e.g. crash multiplier ≥ 2.00).
          </p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Metric path (what number we analyze)</label>
          <input
            value={metricPath}
            onChange={(e) => onMetricPathChange(e.target.value)}
            placeholder={candidates[0]?.path ? `Auto: ${candidates[0].path}` : 'e.g. multiplier'}
            className='w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark font-mono text-sm'
          />
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            Use dot/bracket notation (ex: <span className='font-mono'>result.multiplier</span> or{' '}
            <span className='font-mono'>rounds[0].crash</span>). We’ll auto-suggest common numeric fields below.
          </p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Predicted chance path (optional)</label>
          <input
            value={chancePath}
            onChange={(e) => onChancePathChange(e.target.value)}
            placeholder='custom.winningChance'
            className='w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark font-mono text-sm'
          />
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            Used to compare <span className='font-mono'>{chancePath || '—'}</span> vs actual win rate. Values &gt; 1 are
            treated as percent (0–100), else probability (0–1).
          </p>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Max streak depth (K)</label>
            <input
              value={maxK}
              onChange={(e) => onMaxKChange(Number(e.target.value))}
              type='number'
              min={1}
              max={30}
              className='w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Min samples</label>
            <input
              value={minSamples}
              onChange={(e) => onMinSamplesChange(Number(e.target.value))}
              type='number'
              min={5}
              max={500}
              className='w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Min edge (percentage points)</label>
          <input
            value={minDeltaPts}
            onChange={(e) => onMinDeltaPtsChange(Number(e.target.value))}
            type='number'
            step='0.1'
            min={0}
            max={50}
            className='w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark'
          />
          <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            How much conditional win-rate must beat baseline to call “BET”.
          </p>
        </div>
      </div>
    </div>
  )
}

