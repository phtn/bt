import type { GameResult } from './analysis'

type ResultsSnapshot = {
  results: GameResult[]
  loading: boolean
  lastError: string | null
  lastUpdatedAt: string | null
}

type Listener = () => void

const SERVER_SNAPSHOT: ResultsSnapshot = {
  results: [],
  loading: false,
  lastError: null,
  lastUpdatedAt: null,
}

function safeParseGameResults(raw: string): GameResult[] | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    const out: GameResult[] = []
    for (const item of parsed) {
      if (typeof item !== 'object' || item === null) continue
      const rec = item as Record<string, unknown>
      const id = rec.id
      const timestamp = rec.timestamp
      const data = rec.data
      const roundId = rec.roundId
      if (typeof id !== 'string' || typeof timestamp !== 'string') continue
      out.push({
        id,
        timestamp,
        data,
        roundId:
          typeof roundId === 'string' || typeof roundId === 'number'
            ? roundId
            : undefined,
      })
    }
    return out
  } catch {
    return null
  }
}

type ResultsApiResponse =
  | { success: true; results: GameResult[]; count: number }
  | { success: false; error: string }

function isResultsApiResponse(value: unknown): value is ResultsApiResponse {
  if (typeof value !== 'object' || value === null) return false
  const rec = value as Record<string, unknown>
  if (rec.success === true) {
    return Array.isArray(rec.results) && typeof rec.count === 'number'
  }
  if (rec.success === false) {
    return typeof rec.error === 'string'
  }
  return false
}

function mergeById(prev: GameResult[], next: GameResult[]): GameResult[] {
  if (next.length === 0) return prev
  const ids = new Set(prev.map((r) => r.id))
  const toAdd = next.filter((r) => !ids.has(r.id))
  if (toAdd.length === 0) return prev
  return [...prev, ...toAdd]
}

function createResultsStore() {
  let snapshot: ResultsSnapshot = {
    results: [],
    loading: false,
    lastError: null,
    lastUpdatedAt: null,
  }

  const listeners = new Set<Listener>()

  let intervalId: number | null = null
  let abortController: AbortController | null = null
  let started = false

  const emit = () => {
    for (const l of listeners) l()
  }

  const setSnapshot = (next: ResultsSnapshot) => {
    snapshot = next
    emit()
  }

  const hydrateFromLocalStorage = () => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem('game-results')
    if (!raw) return
    const parsed = safeParseGameResults(raw)
    if (!parsed) return
    setSnapshot({
      ...snapshot,
      results: parsed,
      lastError: null,
      lastUpdatedAt: snapshot.lastUpdatedAt ?? new Date().toISOString(),
    })
  }

  const persistToLocalStorage = (results: GameResult[]) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem('game-results', JSON.stringify(results))
    } catch {
      // ignore quota errors
    }
  }

  const refresh = async () => {
    if (typeof window === 'undefined') return
    if (snapshot.loading) return

    // cancel in-flight
    if (abortController) abortController.abort()
    abortController = new AbortController()

    setSnapshot({ ...snapshot, loading: true, lastError: null })

    try {
      const since = snapshot.results[snapshot.results.length - 1]?.timestamp ?? ''
      const res = await fetch(`/api/results?since=${encodeURIComponent(since)}`, {
        signal: abortController.signal,
      })
      if (abortController.signal.aborted) return

      // allow empty/204
      if (res.status === 204) {
        setSnapshot({
          ...snapshot,
          loading: false,
          lastUpdatedAt: new Date().toISOString(),
        })
        return
      }

      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        setSnapshot({
          ...snapshot,
          loading: false,
          lastError: `Unexpected response content-type: ${contentType ?? 'unknown'}`,
        })
        return
      }

      const json: unknown = await res.json()
      if (!isResultsApiResponse(json)) {
        setSnapshot({
          ...snapshot,
          loading: false,
          lastError: 'Unexpected response shape from /api/results',
        })
        return
      }

      if (json.success === false) {
        setSnapshot({ ...snapshot, loading: false, lastError: json.error })
        return
      }

      const merged = mergeById(snapshot.results, json.results)
      if (merged !== snapshot.results) persistToLocalStorage(merged)
      setSnapshot({
        results: merged,
        loading: false,
        lastError: null,
        lastUpdatedAt: new Date().toISOString(),
      })
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setSnapshot({
        ...snapshot,
        loading: false,
        lastError: err instanceof Error ? err.message : 'Failed to refresh results',
      })
    }
  }

  const clear = () => {
    const ok =
      typeof window === 'undefined'
        ? false
        : window.confirm('Are you sure you want to clear all results?')
    if (!ok) return
    snapshot = {
      results: [],
      loading: false,
      lastError: null,
      lastUpdatedAt: new Date().toISOString(),
    }
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('game-results')
      } catch {
        // ignore
      }
    }
    emit()
  }

  const start = () => {
    if (typeof window === 'undefined') return
    if (started) return
    started = true
    hydrateFromLocalStorage()
    // initial refresh + polling
    void refresh()
    intervalId = window.setInterval(() => {
      void refresh()
    }, 2000)
  }

  const stop = () => {
    if (intervalId !== null && typeof window !== 'undefined') {
      window.clearInterval(intervalId)
    }
    intervalId = null
    if (abortController) abortController.abort()
    abortController = null
    started = false
  }

  return {
    getSnapshot: () => snapshot,
    // Must be referentially stable for useSyncExternalStore to avoid SSR infinite loops.
    getServerSnapshot: (): ResultsSnapshot => SERVER_SNAPSHOT,
    subscribe: (listener: Listener) => {
      listeners.add(listener)
      start()
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) stop()
      }
    },
    refresh,
    clear,
  }
}

export const resultsStore = createResultsStore()

