import type { NumericPathCandidate } from '../analysis'

export function AutoDetectedFields(props: {
  candidates: NumericPathCandidate[]
  effectiveMetricPath: string
  onPickPath: (path: string) => void
}) {
  const { candidates, effectiveMetricPath, onPickPath } = props

  return (
    <div className='bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700'>
      <h2 className='text-xl font-bold mb-3'>Auto-detected numeric fields</h2>
      {candidates.length === 0 ? (
        <p className='text-sm text-gray-500 dark:text-gray-400'>No results yet (or nothing numeric found).</p>
      ) : (
        <div className='space-y-2'>
          {candidates.map((c) => (
            <button
              key={c.path}
              onClick={() => onPickPath(c.path)}
              className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                effectiveMetricPath === c.path
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-muted/40'
              }`}>
              <div className='flex items-center justify-between gap-4'>
                <div className='font-mono text-sm truncate'>{c.path}</div>
                <div className='text-xs text-gray-500 dark:text-gray-400 shrink-0'>seen {c.count}×</div>
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                example: <span className='font-mono'>{c.exampleValue}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

