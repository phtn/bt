// In-memory store for Meld webhook events
// In production, you'd want to use a database instead

export type MeldEventType =
  | 'TRANSACTION_CRYPTO_PENDING'
  | 'TRANSACTION_CRYPTO_TRANSFERRING'
  | 'TRANSACTION_CRYPTO_COMPLETE'
  | 'TRANSACTION_CRYPTO_FAILED'
  | 'WEBHOOK_TEST'

interface MeldWebhookPayload {
  requestId?: string
  accountId: string
  paymentTransactionId?: string
  customerId?: string
  externalCustomerId?: string
  externalSessionId?: string
  paymentTransactionStatus?: string
  transactionType?: string
  sessionId?: string
}

export interface MeldWebhookEvent {
  eventType: MeldEventType
  eventId: string
  timestamp: string
  accountId: string
  profileId: string | null
  version: string
  payload: MeldWebhookPayload
}

export interface StoredWebhook {
  id: string
  timestamp: string
  receivedAt: string
  event: MeldWebhookEvent
  signatureValid: boolean
}

const webhooks: StoredWebhook[] = []
const eventIdSet = new Set<string>()

export function addWebhook(
  event: MeldWebhookEvent,
  signatureValid: boolean
): StoredWebhook {
  // Skip if eventId already exists (idempotency)
  if (eventIdSet.has(event.eventId)) {
    console.log(`Skipping duplicate eventId: ${event.eventId}`)
    // Find existing webhook and return it
    const existing = webhooks.find((w) => w.event.eventId === event.eventId)
    if (existing) {
      return existing
    }
  }

  eventIdSet.add(event.eventId)

  const stored: StoredWebhook = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    timestamp: event.timestamp,
    receivedAt: new Date().toISOString(),
    event,
    signatureValid,
  }

  webhooks.push(stored)
  
  // Keep only last 1000 webhooks to prevent memory issues
  if (webhooks.length > 1000) {
    const removed = webhooks.shift()
    if (removed) {
      eventIdSet.delete(removed.event.eventId)
    }
  }

  return stored
}

export function getWebhooks(): StoredWebhook[] {
  return [...webhooks].reverse() // Return newest first
}

export function getWebhooksByEventType(eventType: MeldEventType): StoredWebhook[] {
  return webhooks.filter((w) => w.event.eventType === eventType).reverse()
}

export function getWebhooksSince(timestamp: string): StoredWebhook[] {
  return webhooks.filter((w) => w.receivedAt > timestamp).reverse()
}

export function getWebhookById(id: string): StoredWebhook | undefined {
  return webhooks.find((w) => w.id === id)
}

export function clearWebhooks(): void {
  webhooks.length = 0
  eventIdSet.clear()
}

export function getWebhookCount(): number {
  return webhooks.length
}

export function getWebhookCountByEventType(eventType: MeldEventType): number {
  return webhooks.filter((w) => w.event.eventType === eventType).length
}
