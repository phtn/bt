export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, Math.trunc(value)))
}

export function clampFloat(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

export function pct(x: number): string {
  return `${(x * 100).toFixed(1)}%`
}

export function toProb(raw: number): number {
  // Heuristic: treat > 1 as a percent (0..100), else probability (0..1).
  const p = raw > 1 ? raw / 100 : raw
  return Math.max(0, Math.min(1, p))
}

export function toLocalISO(ts: string): string {
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return d.toLocaleString()
}

export function readLocalStorageString(key: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeNumberFromLocalStorage(key: string): number | null {
  const raw = readLocalStorageString(key)
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export function trySetLocalStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

