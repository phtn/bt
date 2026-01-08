'use client'

import { useMemo } from 'react'
import type { GameResult } from '../analysis'
import {
  computeConditionalNextWinRates,
  computeCurrentLossStreak,
  computeRecommendationTally,
  computeWinRateWithWilson,
  pickBetSignal,
  resolveNumericPath,
  summarizeNumericCandidates,
} from '../analysis'
import type { ChanceComparison, ExtractedMetrics, LossStreakBarDatum, StreakStats } from './types'
import { computeStreakStats } from './streaks'
import { toProb } from './utils'

export type AnalyticsModel = {
  lastNResults: GameResult[]
  candidates: ReturnType<typeof summarizeNumericCandidates>
  effectiveMetricPath: string
  extracted: ExtractedMetrics
  chanceComparison: ChanceComparison
  stats: {
    winStats: ReturnType<typeof computeWinRateWithWilson>
    wins: number
    losses: number
    lossStreak: number
    conditionalRows: ReturnType<typeof computeConditionalNextWinRates>
    signal: ReturnType<typeof pickBetSignal>
    tally: ReturnType<typeof computeRecommendationTally>
    streaks: StreakStats
  }
  lossStreakBarData: LossStreakBarDatum[]
}

export function useAnalyticsModel(args: {
  allResults: GameResult[]
  windowSize: number
  threshold: number
  metricPath: string
  chancePath: string
  maxK: number
  minSamples: number
  minDeltaPts: number
}): AnalyticsModel {
  const { allResults, windowSize, threshold, metricPath, chancePath, maxK, minSamples, minDeltaPts } = args

  const lastNResults = useMemo<GameResult[]>(() => {
    if (allResults.length === 0) return []
    return allResults.slice(-windowSize)
  }, [allResults, windowSize])

  const candidates = useMemo(() => {
    if (lastNResults.length === 0) return []
    return summarizeNumericCandidates(lastNResults, 12)
  }, [lastNResults])

  const effectiveMetricPath = useMemo<string>(() => {
    if (metricPath.trim() !== '') return metricPath.trim()
    return candidates[0]?.path ?? ''
  }, [metricPath, candidates])

  const extracted = useMemo<ExtractedMetrics>(() => {
    const metrics: number[] = []
    let missing = 0
    for (const r of lastNResults) {
      const v = effectiveMetricPath ? resolveNumericPath(r.data, effectiveMetricPath) : null
      if (v === null) {
        missing += 1
        continue
      }
      metrics.push(v)
    }
    return { metrics, missing, used: metrics.length, total: lastNResults.length }
  }, [lastNResults, effectiveMetricPath])

  const chanceComparison = useMemo<ChanceComparison>(() => {
    let matched = 0
    let predictedSum = 0
    let wins = 0

    if (!chancePath.trim() || !effectiveMetricPath.trim()) {
      return { matched: 0, avgPredicted: null, actualWinRate: null, delta: null }
    }

    for (const r of lastNResults) {
      const metric = resolveNumericPath(r.data, effectiveMetricPath)
      const rawChance = resolveNumericPath(r.data, chancePath)
      if (metric === null || rawChance === null) continue
      const predicted = toProb(rawChance)
      matched += 1
      predictedSum += predicted
      if (metric >= threshold) wins += 1
    }

    if (matched === 0) {
      return { matched: 0, avgPredicted: null, actualWinRate: null, delta: null }
    }

    const avgPredicted = predictedSum / matched
    const actualWinRate = wins / matched
    return { matched, avgPredicted, actualWinRate, delta: actualWinRate - avgPredicted }
  }, [lastNResults, effectiveMetricPath, chancePath, threshold])

  const stats = useMemo(() => {
    const winStats = computeWinRateWithWilson(extracted.metrics, threshold)
    const lossStreak = computeCurrentLossStreak(extracted.metrics, threshold)
    const conditionalRows = computeConditionalNextWinRates(extracted.metrics, threshold, maxK)
    const signal = pickBetSignal({
      metrics: extracted.metrics,
      threshold,
      maxK,
      minSamples,
      minDelta: minDeltaPts / 100,
    })
    const tally = computeRecommendationTally({
      metrics: extracted.metrics,
      threshold,
      maxK,
      minSamples,
      minDelta: minDeltaPts / 100,
    })
    const streaks = computeStreakStats(extracted.metrics, threshold)
    const wins = winStats.wins
    const losses = Math.max(0, winStats.n - winStats.wins)
    return { winStats, wins, losses, lossStreak, conditionalRows, signal, tally, streaks }
  }, [extracted.metrics, threshold, maxK, minSamples, minDeltaPts])

  const lossStreakBarData = useMemo<LossStreakBarDatum[]>(() => {
    return stats.streaks.frequency
      .filter((r) => r.lossCount > 0)
      .map((r) => ({
        length: String(r.length),
        count: r.lossCount,
      }))
  }, [stats.streaks.frequency])

  return { lastNResults, candidates, effectiveMetricPath, extracted, chanceComparison, stats, lossStreakBarData }
}

