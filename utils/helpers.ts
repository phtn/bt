import crypto from 'crypto'
import type { Dispatch, ReactElement, SetStateAction } from 'react'
export function generateUID(): string {
  const uuid: string = crypto.randomUUID() // e.g., "9e107d9d-372b-4f99-a567-16e0c3b8a8d3"
  const hex: string = uuid.replace(/-/g, '') // dash delete

  const bytes: number[] = []
  const re = /[a-fA-F0-9]{2}/g
  let match
  while ((match = re.exec(hex)) !== null) {
    bytes.push(parseInt(match[0], 16))
  }

  let base64: string = btoa(String.fromCharCode(...bytes))
  base64 = base64.replace(/[+/=]/g, '')

  return base64.slice(0, 20)
}
// Webhook verification (recommended for security)
export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const digest = `sha256=${hmac.digest('hex')}`
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
}

export const opts = (...args: (ReactElement | null)[]) => {
  return new Map([
    [true, args[0]],
    [false, args[1]]
  ])
}

export type CopyFnParams = {
  name: string
  text: string
  limit?: number
}
type CopyFn = (params: CopyFnParams) => Promise<boolean> // Return success

export const charLimit = (text: string | undefined, chars?: number): string | undefined => {
  if (!text) return
  return text.substring(0, chars ?? 35)
}
export const copyFn: CopyFn = async ({ name, text }) => {
  if (!navigator?.clipboard) {
    // onWarn('Clipboard not supported')
    return false
  }
  if (!text) return false

  return await navigator.clipboard
    .writeText(text)
    .then(() => {
      // onSuccess(`${name ? 'Copied: ' + name : 'Copied.'}`)
      return true
    })
    .catch((e) => {
      // onError(`Copy failed. ${e}`)
      return false
    })
}

export const Err =
  <T extends Error | null | undefined>(setLoading: Dispatch<SetStateAction<boolean>>, msg?: string) =>
  (e: T) => {
    // onError(msg ?? `Error: ${e?.name}`)
    console.log(e)
    setLoading(false)
  }

export const Ok =
  (setLoading: Dispatch<SetStateAction<boolean>>, ...args: string[]) =>
  () => {
    setLoading(false)
    // onSuccess(`${args[0]} ${args[1] ?? ''}`)
  }

// export const tsToDate = (st?: Timestamp | null, format = 'PPpp') => {
//   if (st && st instanceof Timestamp) {
//     const date = st.toDate()
//     return _format(date, format)
//   }
//   return ''
// }
