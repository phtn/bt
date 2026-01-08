'use client'

import { useState, useSyncExternalStore, useTransition } from 'react'
import { AutoDetectedFields } from './_components/AutoDetectedFields'
import { ChanceComparisonSection } from './_components/ChanceComparisonSection'
import { ConditionalAfterLossesTable } from './_components/ConditionalAfterLossesTable'
import { InputsPanel } from './_components/InputsPanel'
import { RecentRounds } from './_components/RecentRounds'
import { RecommendationPanel } from './_components/RecommendationPanel'
import { RecommendationTallySection } from './_components/RecommendationTallySection'
import { StatsCards } from './_components/StatsCards'
import { StreaksSection } from './_components/StreaksSection'
import { useAnalyticsModel } from './_components/useAnalyticsModel'
import { clampFloat, clampInt, readLocalStorageString, safeNumberFromLocalStorage, toLocalISO, trySetLocalStorage } from './_components/utils'
import { resultsStore } from './resultsStore'

export default function GameResultsAnalyticsPage() {
  const snap = useSyncExternalStore(resultsStore.subscribe, resultsStore.getSnapshot, resultsStore.getServerSnapshot)

  const [isPending, startTransition] = useTransition()

  const [windowSize, setWindowSize] = useState<number>(() => {
    const fromLs = safeNumberFromLocalStorage('gr_analytics_window_size')
    return clampInt(fromLs ?? 100, 20, 1000)
  })

  const [threshold, setThreshold] = useState<number>(() => {
    const fromLs = safeNumberFromLocalStorage('gr_analytics_threshold')
    return clampFloat(fromLs ?? 2, 1.01, 1000)
  })

  const [metricPath, setMetricPath] = useState<string>(() => {
    const fromLs = readLocalStorageString('gr_analytics_metric_path')
    return fromLs ?? ''
  })

  const [chancePath, setChancePath] = useState<string>(() => {
    const fromLs = readLocalStorageString('gr_analytics_chance_path')
    return fromLs ?? 'custom.winningChance'
  })

  const [maxK, setMaxK] = useState<number>(() => {
    const fromLs = safeNumberFromLocalStorage('gr_analytics_max_k')
    return clampInt(fromLs ?? 12, 1, 30)
  })

  const [minSamples, setMinSamples] = useState<number>(() => {
    const fromLs = safeNumberFromLocalStorage('gr_analytics_min_samples')
    return clampInt(fromLs ?? 20, 5, 500)
  })

  const [minDeltaPts, setMinDeltaPts] = useState<number>(() => {
    const fromLs = safeNumberFromLocalStorage('gr_analytics_min_delta_pts')
    return clampFloat(fromLs ?? 7.5, 0, 50)
  })

  const model = useAnalyticsModel({
    allResults: snap.results,
    windowSize,
    threshold,
    metricPath,
    chancePath,
    maxK,
    minSamples,
    minDeltaPts,
  })

  const handleSetMetricPath = (path: string) => {
    startTransition(() => {
      setMetricPath(path)
    })
    trySetLocalStorage('gr_analytics_metric_path', path)
  }

  const handleSetChancePath = (path: string) => {
    startTransition(() => {
      setChancePath(path)
    })
    trySetLocalStorage('gr_analytics_chance_path', path)
  }

  const handleSetThreshold = (next: number) => {
    const v = clampFloat(next, 1.01, 1000)
    startTransition(() => {
      setThreshold(v)
    })
    trySetLocalStorage('gr_analytics_threshold', String(v))
  }

  const handleSetWindowSize = (next: number) => {
    const v = clampInt(next, 20, 1000)
    startTransition(() => {
      setWindowSize(v)
    })
    trySetLocalStorage('gr_analytics_window_size', String(v))
  }

  const handleSetMaxK = (next: number) => {
    const v = clampInt(next, 1, 30)
    startTransition(() => {
      setMaxK(v)
    })
    trySetLocalStorage('gr_analytics_max_k', String(v))
  }

  const handleSetMinSamples = (next: number) => {
    const v = clampInt(next, 5, 500)
    startTransition(() => {
      setMinSamples(v)
    })
    trySetLocalStorage('gr_analytics_min_samples', String(v))
  }

  const handleSetMinDeltaPts = (next: number) => {
    const v = clampFloat(next, 0, 50)
    startTransition(() => {
      setMinDeltaPts(v)
    })
    trySetLocalStorage('gr_analytics_min_delta_pts', String(v))
  }

  return (
    <div className='min-h-screen bg-background-light dark:bg-background-dark p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='text-4xl font-bold mb-1'>Bet Timing Analytics</h1>
            <p className='text-gray-600 dark:text-gray-400'>
              Based on your last <strong suppressHydrationWarning>{windowSize}</strong> rounds, this page estimates your
              hit-rate for a chosen target and suggests <strong>BET vs HOLD</strong> (with confidence).
            </p>
          </div>
          <div className='flex gap-3 items-center'>
            <button
              onClick={() => void resultsStore.refresh()}
              disabled={snap.loading}
              className='px-4 py-2 bg-primary disabled:scale-50 disabled:opacity-20 transition-all duration-500 ease-in-out text-background rounded-lg font-medium hover:opacity-90'>
              {snap.loading ? 'Refresh' : 'Refresh'}
            </button>
            <button
              onClick={() => resultsStore.clear()}
              className='px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity'>
              Clear All
            </button>
          </div>
        </div>

        {snap.lastError ? (
          <div className='mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200'>
            <div className='font-semibold mb-1'>Error</div>
            <div className='text-sm'>{snap.lastError}</div>
          </div>
        ) : null}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-1 space-y-6'>
            <InputsPanel
              windowSize={windowSize}
              onWindowSizeChange={handleSetWindowSize}
              threshold={threshold}
              onThresholdChange={handleSetThreshold}
              metricPath={metricPath}
              onMetricPathChange={handleSetMetricPath}
              chancePath={chancePath}
              onChancePathChange={handleSetChancePath}
              maxK={maxK}
              onMaxKChange={handleSetMaxK}
              minSamples={minSamples}
              onMinSamplesChange={handleSetMinSamples}
              minDeltaPts={minDeltaPts}
              onMinDeltaPtsChange={handleSetMinDeltaPts}
              candidates={model.candidates}
            />

            <AutoDetectedFields
              candidates={model.candidates}
              effectiveMetricPath={model.effectiveMetricPath}
              onPickPath={handleSetMetricPath}
            />
          </div>

          <div className='lg:col-span-2 space-y-6'>
            <RecommendationPanel signal={model.stats.signal} />

            <StatsCards
              winStats={model.stats.winStats}
              wins={model.stats.wins}
              losses={model.stats.losses}
              currentLossStreak={model.stats.lossStreak}
              extractedUsed={model.extracted.used}
              extractedTotal={model.extracted.total}
              extractedMissing={model.extracted.missing}
            />

            <ChanceComparisonSection chancePath={chancePath} chanceComparison={model.chanceComparison} />

            <RecommendationTallySection tally={model.stats.tally} usableRounds={model.extracted.metrics.length} />

            <StreaksSection windowSize={windowSize} streaks={model.stats.streaks} lossStreakBarData={model.lossStreakBarData} />

            <ConditionalAfterLossesTable
              extractedMetricsCount={model.extracted.metrics.length}
              conditionalRows={model.stats.conditionalRows}
              baselineWinRate={model.stats.winStats.winRate}
              currentLossStreak={model.stats.lossStreak}
              maxK={maxK}
            />

            <RecentRounds lastNResults={model.lastNResults} effectiveMetricPath={model.effectiveMetricPath} threshold={threshold} />

            <div className='text-xs text-gray-500 dark:text-gray-400'>
              {isPending ? 'Recomputing…' : null}
              {snap.lastUpdatedAt ? (
                <span>
                  {isPending ? ' ' : ''}Last updated: {toLocalISO(snap.lastUpdatedAt)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
