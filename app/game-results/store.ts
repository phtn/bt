// In-memory store for game results
// In production, you'd want to use a database instead

interface GameResult {
  id: string
  roundId?: string | number
  timestamp: string
  data: unknown
}

const results: GameResult[] = []
const roundIdSet = new Set<string | number>()

export function addGameResult(data: unknown): GameResult | null {
  // Extract roundId from data
  let roundId: string | number | undefined
  if (typeof data === 'object' && data !== null) {
    const dataObj = data as Record<string, unknown>
    roundId = dataObj.roundId as string | number | undefined
    if (roundId === undefined) {
      roundId = dataObj.round_id as string | number | undefined
    }
  }

  // Skip if roundId already exists (only accumulate unique roundIds)
  if (roundId !== undefined) {
    const roundIdKey = String(roundId)
    if (roundIdSet.has(roundIdKey)) {
      console.log(`Skipping duplicate roundId: ${roundIdKey}`)
      return null
    }
    roundIdSet.add(roundIdKey)
  }

  const result: GameResult = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    roundId,
    timestamp: new Date().toISOString(),
    data,
  }
  results.push(result)
  // Keep only last 1000 results to prevent memory issues
  if (results.length > 1000) {
    const removed = results.shift()
    if (removed?.roundId !== undefined) {
      roundIdSet.delete(String(removed.roundId))
    }
  }
  return result
}

export function getGameResults(): GameResult[] {
  return [...results]
}

export function getGameResultsSince(timestamp: string): GameResult[] {
  return results.filter((r) => r.timestamp > timestamp)
}

export function clearGameResults(): void {
  results.length = 0
  roundIdSet.clear()
}

export function getUniqueRoundIds(): number {
  return roundIdSet.size
}

