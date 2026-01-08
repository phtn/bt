export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json }

export type GameResult = {
  id: string
  roundId?: string | number
  timestamp: string
  data: unknown
}

export type NumericPathCandidate = {
  path: string
  count: number
  exampleValue: number
  score: number
}

export type WinRateStats = {
  n: number
  wins: number
  winRate: number
  wilsonLow: number
  wilsonHigh: number
}

export type ConditionalRow = {
  k: number
  samples: number
  nextWins: number
  nextWinRate: number | null
}

export type BetSignal =
  | {
      action: 'BET' | 'HOLD'
      reason: string
      confidence: 'low' | 'medium' | 'high'
      usedK: number
      usedSamples: number
      baselineWinRate: number
      conditionalWinRate: number | null
      currentLossStreak: number
    }
  | {
      action: 'NO_SIGNAL'
      reason: string
      confidence: 'low'
      usedK: number | null
      usedSamples: number | null
      baselineWinRate: number
      conditionalWinRate: number | null
      currentLossStreak: number
    }

export type RecommendationTally = {
  totalEvaluated: number
  betCalls: number
  betWins: number
  betLosses: number
  betAccuracy: number | null
  holdCalls: number
  holdWins: number // times it would have won if you bet (missed)
  holdLosses: number // times it lost (good hold)
  holdAccuracy: number | null // "correct holds" / holds => losses / holds
  noSignalCalls: number
  noSignalWins: number
  noSignalLosses: number
}

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function parsePathSegments(path: string): Array<string | number> {
  const trimmed = path.trim()
  if (trimmed === '') return []

  // Accept either "foo.bar[0].baz" or "data.foo" (we handle stripping "data." elsewhere)
  const segments: Array<string | number> = []
  let buf = ''
  let i = 0

  const pushBuf = () => {
    const s = buf.trim()
    if (s !== '') segments.push(s)
    buf = ''
  }

  while (i < trimmed.length) {
    const ch = trimmed[i]
    if (ch === '.') {
      pushBuf()
      i += 1
      continue
    }
    if (ch === '[') {
      pushBuf()
      const closeIdx = trimmed.indexOf(']', i + 1)
      if (closeIdx === -1) {
        // Invalid bracket, treat remainder as a single segment
        buf = trimmed.slice(i)
        break
      }
      const inside = trimmed.slice(i + 1, closeIdx).trim()
      const asNum = Number(inside)
      if (inside !== '' && Number.isInteger(asNum)) {
        segments.push(asNum)
      } else if (inside !== '') {
        // allow string keys in brackets: ["key"] or ['key'] or [key]
        const unquoted = inside.replace(/^['"]|['"]$/g, '')
        if (unquoted !== '') segments.push(unquoted)
      }
      i = closeIdx + 1
      continue
    }
    buf += ch
    i += 1
  }

  pushBuf()
  return segments
}

export function resolveNumericPath(base: unknown, path: string): number | null {
  const normalized = path.trim().replace(/^data\./, '')
  const segments = parsePathSegments(normalized)
  if (segments.length === 0) return null

  let cur: unknown = base
  for (const seg of segments) {
    if (typeof seg === 'number') {
      if (!Array.isArray(cur)) return null
      cur = cur[seg]
      continue
    }
    if (!isRecord(cur) && !Array.isArray(cur)) return null
    if (Array.isArray(cur)) {
      const idx = Number(seg)
      if (!Number.isInteger(idx)) return null
      cur = cur[idx]
      continue
    }
    cur = cur[seg]
  }

  return isFiniteNumber(cur) ? cur : null
}

type CollectedPath = {
  path: string
  value: number
  score: number
}

const PREFERRED_KEYS = [
  'multiplier',
  'crashpoint',
  'crash_point',
  'crash',
  'bust',
  'payoutmultiplier',
  'payout_multiplier',
  'cashout',
  'cash_out',
  'profit',
  'payout',
] as const

function scoreKey(key: string): number {
  const k = key.toLowerCase()
  const preferredIdx = PREFERRED_KEYS.findIndex((x) => x === k)
  if (preferredIdx !== -1) return 100 - preferredIdx
  if (k.includes('mult')) return 40
  if (k.includes('crash') || k.includes('bust')) return 35
  if (k.includes('payout') || k.includes('profit')) return 25
  return 0
}

export function collectNumericPathsFromUnknown(
  value: unknown,
  options?: { maxDepth?: number; maxNodes?: number }
): CollectedPath[] {
  const maxDepth = options?.maxDepth ?? 6
  const maxNodes = options?.maxNodes ?? 400
  const out: CollectedPath[] = []
  const seen = new WeakSet<object>()
  let nodes = 0

  const walk = (v: unknown, prefix: string, depth: number) => {
    if (nodes >= maxNodes) return
    if (depth > maxDepth) return
    if (!isRecord(v) && !Array.isArray(v)) return
    if (typeof v === 'object' && v !== null) {
      if (seen.has(v)) return
      seen.add(v)
    }

    nodes += 1

    if (Array.isArray(v)) {
      const take = Math.min(v.length, 5)
      for (let idx = 0; idx < take; idx += 1) {
        const nextPrefix = `${prefix}[${idx}]`
        const item = v[idx]
        if (isFiniteNumber(item)) {
          out.push({ path: nextPrefix, value: item, score: 5 })
        } else {
          walk(item, nextPrefix, depth + 1)
        }
      }
      return
    }

    for (const [k, child] of Object.entries(v)) {
      const nextPrefix = prefix ? `${prefix}.${k}` : k
      if (isFiniteNumber(child)) {
        out.push({ path: nextPrefix, value: child, score: scoreKey(k) })
      } else {
        walk(child, nextPrefix, depth + 1)
      }
    }
  }

  walk(value, '', 0)
  return out
}

export function summarizeNumericCandidates(
  results: GameResult[],
  limit: number,
  options?: { maxDepth?: number; maxNodes?: number }
): NumericPathCandidate[] {
  const map = new Map<string, { count: number; exampleValue: number; scoreSum: number }>()
  for (const r of results) {
    const paths = collectNumericPathsFromUnknown(r.data, options)
    for (const p of paths) {
      const cur = map.get(p.path)
      if (!cur) {
        map.set(p.path, { count: 1, exampleValue: p.value, scoreSum: p.score })
      } else {
        cur.count += 1
        // Keep a stable, non-NaN example
        if (!Number.isFinite(cur.exampleValue)) cur.exampleValue = p.value
        cur.scoreSum += p.score
      }
    }
  }

  return Array.from(map.entries())
    .map(([path, v]) => ({
      path,
      count: v.count,
      exampleValue: v.exampleValue,
      score: v.scoreSum / v.count,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return b.score - a.score
    })
    .slice(0, limit)
}

export function computeWinRateWithWilson(
  metrics: number[],
  threshold: number
): WinRateStats {
  const n = metrics.length
  if (n === 0) {
    return { n: 0, wins: 0, winRate: 0, wilsonLow: 0, wilsonHigh: 0 }
  }
  const wins = metrics.reduce((acc, x) => acc + (x >= threshold ? 1 : 0), 0)
  const phat = wins / n
  const z = 1.96
  const z2 = z * z
  const denom = 1 + z2 / n
  const center = (phat + z2 / (2 * n)) / denom
  const margin =
    (z * Math.sqrt((phat * (1 - phat)) / n + z2 / (4 * n * n))) / denom
  return {
    n,
    wins,
    winRate: phat,
    wilsonLow: Math.max(0, center - margin),
    wilsonHigh: Math.min(1, center + margin),
  }
}

export function computeCurrentLossStreak(
  metrics: number[],
  threshold: number
): number {
  let streak = 0
  for (let i = metrics.length - 1; i >= 0; i -= 1) {
    if (metrics[i] >= threshold) break
    streak += 1
  }
  return streak
}

export function computeConditionalNextWinRates(
  metrics: number[],
  threshold: number,
  maxK: number
): ConditionalRow[] {
  const rows: ConditionalRow[] = []
  for (let k = 1; k <= maxK; k += 1) {
    let samples = 0
    let nextWins = 0
    for (let i = k; i < metrics.length; i += 1) {
      // Need k previous outcomes to be "loss" (< threshold)
      let ok = true
      for (let j = 1; j <= k; j += 1) {
        if (metrics[i - j] >= threshold) {
          ok = false
          break
        }
      }
      if (!ok) continue
      samples += 1
      if (metrics[i] >= threshold) nextWins += 1
    }
    rows.push({
      k,
      samples,
      nextWins,
      nextWinRate: samples === 0 ? null : nextWins / samples,
    })
  }
  return rows
}

export function pickBetSignal(args: {
  metrics: number[]
  threshold: number
  maxK: number
  minSamples: number
  minDelta: number
}): BetSignal {
  const { metrics, threshold, maxK, minSamples, minDelta } = args
  const base = computeWinRateWithWilson(metrics, threshold)
  const currentLossStreak = computeCurrentLossStreak(metrics, threshold)

  if (metrics.length < 20) {
    return {
      action: 'NO_SIGNAL',
      reason: 'Need at least 20 rounds to estimate anything useful.',
      confidence: 'low',
      usedK: null,
      usedSamples: null,
      baselineWinRate: base.winRate,
      conditionalWinRate: null,
      currentLossStreak,
    }
  }

  if (currentLossStreak === 0) {
    return {
      action: 'NO_SIGNAL',
      reason:
        'No current loss-streak context (last round met threshold). Use baseline win rate + confidence interval.',
      confidence: 'low',
      usedK: null,
      usedSamples: null,
      baselineWinRate: base.winRate,
      conditionalWinRate: null,
      currentLossStreak,
    }
  }

  const rows = computeConditionalNextWinRates(metrics, threshold, maxK)
  const effectiveK = Math.min(currentLossStreak, maxK)
  const row = rows.find((r) => r.k === effectiveK) ?? null
  if (!row || row.nextWinRate === null) {
    return {
      action: 'NO_SIGNAL',
      reason: `No historical samples for “after ${effectiveK} losses”.`,
      confidence: 'low',
      usedK: null,
      usedSamples: null,
      baselineWinRate: base.winRate,
      conditionalWinRate: null,
      currentLossStreak,
    }
  }
  if (row.samples < minSamples) {
    return {
      action: 'NO_SIGNAL',
      reason: `Not enough samples for “after ${effectiveK} losses” (${row.samples}/${minSamples}).`,
      confidence: 'low',
      usedK: effectiveK,
      usedSamples: row.samples,
      baselineWinRate: base.winRate,
      conditionalWinRate: row.nextWinRate,
      currentLossStreak,
    }
  }

  const delta = row.nextWinRate - base.winRate
  const confidence: 'low' | 'medium' | 'high' =
    row.samples >= minSamples * 3 ? 'high' : row.samples >= minSamples * 2 ? 'medium' : 'low'

  if (delta >= minDelta) {
    return {
      action: 'BET',
      reason: `Historically, after ${effectiveK} losses your next-round hit-rate is higher than baseline (+${(delta * 100).toFixed(1)} pts).`,
      confidence,
      usedK: effectiveK,
      usedSamples: row.samples,
      baselineWinRate: base.winRate,
      conditionalWinRate: row.nextWinRate,
      currentLossStreak,
    }
  }
  if (delta <= -minDelta) {
    return {
      action: 'HOLD',
      reason: `Historically, after ${effectiveK} losses your next-round hit-rate is lower than baseline (${(delta * 100).toFixed(1)} pts).`,
      confidence,
      usedK: effectiveK,
      usedSamples: row.samples,
      baselineWinRate: base.winRate,
      conditionalWinRate: row.nextWinRate,
      currentLossStreak,
    }
  }

  return {
    action: 'NO_SIGNAL',
    reason:
      'Conditional hit-rate is too close to baseline (no meaningful edge in this dataset).',
    confidence: 'low',
    usedK: effectiveK,
    usedSamples: row.samples,
    baselineWinRate: base.winRate,
    conditionalWinRate: row.nextWinRate,
    currentLossStreak,
  }
}

export function computeRecommendationTally(args: {
  metrics: number[]
  threshold: number
  maxK: number
  minSamples: number
  minDelta: number
}): RecommendationTally {
  const { metrics, threshold, maxK, minSamples, minDelta } = args

  let totalEvaluated = 0

  let betCalls = 0
  let betWins = 0
  let betLosses = 0

  let holdCalls = 0
  let holdWins = 0
  let holdLosses = 0

  let noSignalCalls = 0
  let noSignalWins = 0
  let noSignalLosses = 0

  // Backtest without lookahead: for each t, compute signal using history [0..t-1],
  // then compare against outcome at t.
  for (let t = 1; t < metrics.length; t += 1) {
    const history = metrics.slice(0, t)
    const outcome = metrics[t]
    const outcomeWin = outcome >= threshold

    const signal = pickBetSignal({ metrics: history, threshold, maxK, minSamples, minDelta })
    totalEvaluated += 1

    if (signal.action === 'BET') {
      betCalls += 1
      if (outcomeWin) betWins += 1
      else betLosses += 1
      continue
    }

    if (signal.action === 'HOLD') {
      holdCalls += 1
      if (outcomeWin) holdWins += 1
      else holdLosses += 1
      continue
    }

    noSignalCalls += 1
    if (outcomeWin) noSignalWins += 1
    else noSignalLosses += 1
  }

  const betAccuracy = betCalls === 0 ? null : betWins / betCalls
  const holdAccuracy = holdCalls === 0 ? null : holdLosses / holdCalls

  return {
    totalEvaluated,
    betCalls,
    betWins,
    betLosses,
    betAccuracy,
    holdCalls,
    holdWins,
    holdLosses,
    holdAccuracy,
    noSignalCalls,
    noSignalWins,
    noSignalLosses,
  }
}

export function computeStreakStats(metrics: number[], threshold: number): StreakStats {
  let longestWinStreak = 0
  let longestLossStreak = 0
  let winStreaksTotal = 0
  let lossStreaksTotal = 0

  const winFreq = new Map<number, number>()
  const lossFreq = new Map<number, number>()

  type Kind = 'win' | 'loss' | 'none'
  let curKind: Kind = 'none'
  let curLen = 0

  const commit = () => {
    if (curKind === 'none' || curLen <= 0) return
    if (curKind === 'win') {
      longestWinStreak = Math.max(longestWinStreak, curLen)
      winStreaksTotal += 1
      winFreq.set(curLen, (winFreq.get(curLen) ?? 0) + 1)
      return
    }
    longestLossStreak = Math.max(longestLossStreak, curLen)
    lossStreaksTotal += 1
    lossFreq.set(curLen, (lossFreq.get(curLen) ?? 0) + 1)
  }

  for (const v of metrics) {
    const nextKind: Kind = v >= threshold ? 'win' : 'loss'
    if (curKind === 'none') {
      curKind = nextKind
      curLen = 1
      continue
    }
    if (nextKind === curKind) {
      curLen += 1
      continue
    }
    commit()
    curKind = nextKind
    curLen = 1
  }
  commit()

  const lengths = new Set<number>([...winFreq.keys(), ...lossFreq.keys()])
  const frequency: StreakFrequencyRow[] = Array.from(lengths)
    .sort((a, b) => a - b)
    .map((length) => {
      const winCount = winFreq.get(length) ?? 0
      const lossCount = lossFreq.get(length) ?? 0
      return { length, winCount, lossCount, total: winCount + lossCount }
    })

  return {
    longestWinStreak,
    longestLossStreak,
    winStreaksTotal,
    lossStreaksTotal,
    frequency,
  }
}
