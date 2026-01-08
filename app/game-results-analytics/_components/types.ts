import type { GameResult, NumericPathCandidate } from '../analysis'

export type StreakFrequencyRow = {
  length: number
  winCount: number
  lossCount: number
  total: number
}

export type StreakStats = {
  longestWinStreak: number
  longestLossStreak: number
  winStreaksTotal: number
  lossStreaksTotal: number
  frequency: StreakFrequencyRow[]
}

export type LossStreakBarDatum = {
  length: string
  count: number
}

export type ExtractedMetrics = {
  metrics: number[]
  missing: number
  used: number
  total: number
}

export type ChanceComparison = {
  matched: number
  avgPredicted: number | null
  actualWinRate: number | null
  delta: number | null
}

export type CandidatesModel = {
  lastNResults: GameResult[]
  candidates: NumericPathCandidate[]
  effectiveMetricPath: string
}

