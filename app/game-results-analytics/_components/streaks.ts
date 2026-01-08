import type { StreakFrequencyRow, StreakStats } from './types'

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

