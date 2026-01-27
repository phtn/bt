'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import type { MeldEventType, StoredWebhook } from './store'

interface WebhookResponse {
  count: number
  webhooks: StoredWebhook[]
}

const EVENT_TYPE_COLORS: Record<MeldEventType, string> = {
  TRANSACTION_CRYPTO_PENDING:
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
  TRANSACTION_CRYPTO_TRANSFERRING:
    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700',
  TRANSACTION_CRYPTO_COMPLETE:
    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700',
  TRANSACTION_CRYPTO_FAILED:
    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700',
  WEBHOOK_TEST:
    'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700'
}

const EVENT_TYPE_LABELS: Record<MeldEventType, string> = {
  TRANSACTION_CRYPTO_PENDING: 'Pending',
  TRANSACTION_CRYPTO_TRANSFERRING: 'Transferring',
  TRANSACTION_CRYPTO_COMPLETE: 'Complete',
  TRANSACTION_CRYPTO_FAILED: 'Failed',
  WEBHOOK_TEST: 'Test'
}

export default function WebhooksMeldPage() {
  const [webhooks, setWebhooks] = useState<StoredWebhook[]>([])
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [selectedEventType, setSelectedEventType] = useState<MeldEventType | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedWebhook, setExpandedWebhook] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const webhooksRef = useRef<StoredWebhook[]>([])

  // Keep ref in sync with state
  useEffect(() => {
    webhooksRef.current = webhooks
  }, [webhooks])

  // Load webhooks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('meld-webhooks')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StoredWebhook[]
        setWebhooks(parsed)
        webhooksRef.current = parsed
      } catch (error) {
        console.error('Failed to load stored webhooks:', error)
      }
    }
  }, [])

  // Fetch latest webhooks
  const fetchWebhooks = useCallback(async (eventType?: MeldEventType | 'ALL') => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      setLoading(true)

      const url = eventType && eventType !== 'ALL' ? `/api/webhooks-meld?eventType=${eventType}` : '/api/webhooks-meld'

      const response = await fetch(url, { signal: abortController.signal })

      if (!abortController.signal.aborted) {
        if (response.ok) {
          const data = (await response.json()) as WebhookResponse

          if (data.webhooks && Array.isArray(data.webhooks)) {
            startTransition(() => {
              setWebhooks(data.webhooks)
              webhooksRef.current = data.webhooks
              localStorage.setItem('meld-webhooks', JSON.stringify(data.webhooks))
            })
          }
        } else {
          const errorText = await response.text().catch(() => 'Unknown error')
          console.error(`Failed to fetch webhooks: ${response.status} ${errorText}`)
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to fetch webhooks:', error)
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  // Set up polling to fetch latest webhooks
  useEffect(() => {
    fetchWebhooks(selectedEventType)

    const interval = setInterval(() => {
      fetchWebhooks(selectedEventType)
    }, 3000) // Poll every 3 seconds

    return () => {
      clearInterval(interval)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchWebhooks, selectedEventType])

  const clearWebhooks = async () => {
    if (!confirm('Are you sure you want to clear all webhooks?')) {
      return
    }

    try {
      const response = await fetch('/api/webhooks-meld', { method: 'DELETE' })
      if (response.ok) {
        setWebhooks([])
        webhooksRef.current = []
        localStorage.removeItem('meld-webhooks')
      }
    } catch (error) {
      console.error('Failed to clear webhooks:', error)
    }
  }

  const handleEventTypeFilter = (eventType: MeldEventType | 'ALL') => {
    setSelectedEventType(eventType)
    fetchWebhooks(eventType)
  }

  // Filter webhooks by search query
  const filteredWebhooks = webhooks.filter((webhook) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    const event = webhook.event

    return (
      event.eventId.toLowerCase().includes(query) ||
      event.eventType.toLowerCase().includes(query) ||
      event.accountId.toLowerCase().includes(query) ||
      event.payload.paymentTransactionId?.toLowerCase().includes(query) ||
      event.payload.externalCustomerId?.toLowerCase().includes(query) ||
      event.payload.externalSessionId?.toLowerCase().includes(query) ||
      JSON.stringify(event.payload).toLowerCase().includes(query)
    )
  })

  const eventTypeCounts = webhooks.reduce((acc, webhook) => {
    acc[webhook.event.eventType] = (acc[webhook.event.eventType] || 0) + 1
    return acc
  }, {} as Record<MeldEventType, number>)

  return (
    <div className='min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div>
            <h1 className='text-4xl font-bold mb-2 font-okxs'>Meld Webhooks</h1>
            <p className='text-zinc-600 dark:text-zinc-400 font-brk text-sm'>
              View and monitor webhook events received from Meld
            </p>
          </div>
          <div className='flex gap-4 items-center'>
            <button
              onClick={() => fetchWebhooks(selectedEventType)}
              disabled={loading || isPending}
              className='px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-okxs text-sm'>
              {loading ? 'Refresh' : 'Refresh'}
            </button>
            <button
              onClick={clearWebhooks}
              className='px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity font-okxs text-sm'>
              Clear All
            </button>
          </div>
        </div>

        {/* Stats and Filters */}
        <div className='mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
          {/* Total Count */}
          <div className='lg:col-span-2 p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg'>
            <p className='text-xs text-zinc-600 dark:text-zinc-400 font-brk mb-1'>Total Webhooks</p>
            <p className='text-2xl font-bold font-okxs'>{webhooks.length}</p>
          </div>

          {/* Event Type Filters */}
          {(
            [
              'ALL',
              'TRANSACTION_CRYPTO_PENDING',
              'TRANSACTION_CRYPTO_TRANSFERRING',
              'TRANSACTION_CRYPTO_COMPLETE',
              'TRANSACTION_CRYPTO_FAILED',
              'WEBHOOK_TEST'
            ] as const
          ).map((eventType) => {
            const count = eventType === 'ALL' ? webhooks.length : eventTypeCounts[eventType as MeldEventType] || 0

            return (
              <button
                key={eventType}
                onClick={() => handleEventTypeFilter(eventType)}
                className={`p-4 border rounded-lg transition-all font-okxs text-sm ${
                  selectedEventType === eventType
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                    : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600'
                }`}>
                <div className='text-xs font-brk mb-1 opacity-70'>
                  {eventType === 'ALL' ? 'All' : EVENT_TYPE_LABELS[eventType as MeldEventType]}
                </div>
                <div className='text-xl font-bold'>{count}</div>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className='mb-6'>
          <input
            type='text'
            placeholder='Search webhooks by event ID, transaction ID, customer ID, session ID...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 font-brk text-sm'
          />
        </div>

        {/* Webhooks List */}
        {filteredWebhooks.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-zinc-500 dark:text-zinc-400 text-lg font-okxs'>
              {webhooks.length === 0
                ? 'No webhooks received yet. Webhooks will appear here when received from Meld.'
                : 'No webhooks match your search criteria.'}
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredWebhooks.map((webhook) => {
              const isExpanded = expandedWebhook === webhook.id
              const eventType = webhook.event.eventType

              return (
                <div
                  key={webhook.id}
                  className='bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                  {/* Webhook Header */}
                  <div
                    className='p-6 cursor-pointer'
                    onClick={() => setExpandedWebhook(isExpanded ? null : webhook.id)}>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-3 mb-3'>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${EVENT_TYPE_COLORS[eventType]} font-okxs`}>
                            {EVENT_TYPE_LABELS[eventType]}
                          </span>
                          {!webhook.signatureValid && (
                            <span className='px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700 font-okxs'>
                              Invalid Signature
                            </span>
                          )}
                        </div>
                        <div className='space-y-1'>
                          <p className='text-sm font-brk text-zinc-600 dark:text-zinc-400'>
                            Event ID:{' '}
                            <span className='text-zinc-900 dark:text-zinc-100 font-mono'>{webhook.event.eventId}</span>
                          </p>
                          {webhook.event.payload.paymentTransactionId && (
                            <p className='text-sm font-brk text-zinc-600 dark:text-zinc-400'>
                              Transaction:{' '}
                              <span className='text-zinc-900 dark:text-zinc-100 font-mono'>
                                {webhook.event.payload.paymentTransactionId}
                              </span>
                            </p>
                          )}
                          {(webhook.event.payload.externalCustomerId || webhook.event.payload.externalSessionId) && (
                            <p className='text-sm font-brk text-zinc-600 dark:text-zinc-400'>
                              {webhook.event.payload.externalCustomerId && (
                                <>
                                  Customer:{' '}
                                  <span className='text-zinc-900 dark:text-zinc-100 font-mono'>
                                    {webhook.event.payload.externalCustomerId}
                                  </span>
                                </>
                              )}
                              {webhook.event.payload.externalCustomerId &&
                                webhook.event.payload.externalSessionId &&
                                ' • '}
                              {webhook.event.payload.externalSessionId && (
                                <>
                                  Session:{' '}
                                  <span className='text-zinc-900 dark:text-zinc-100 font-mono'>
                                    {webhook.event.payload.externalSessionId}
                                  </span>
                                </>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className='text-right flex-shrink-0'>
                        <p className='text-xs font-brk text-zinc-500 dark:text-zinc-500 mb-1'>
                          {new Date(webhook.receivedAt).toLocaleString()}
                        </p>
                        <p className='text-xs font-brk text-zinc-400 dark:text-zinc-600'>
                          {new Date(webhook.timestamp).toLocaleString()}
                        </p>
                        <button className='mt-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-brk'>
                          {isExpanded ? '▼ Hide' : '▶ Show'} Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className='border-t border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-900/50'>
                      <div className='space-y-4'>
                        {/* Event Metadata */}
                        <div>
                          <h3 className='text-sm font-semibold mb-2 font-okxs text-zinc-900 dark:text-zinc-100'>
                            Event Metadata
                          </h3>
                          <div className='grid grid-cols-2 gap-2 text-xs font-brk'>
                            <div>
                              <span className='text-zinc-600 dark:text-zinc-400'>Account ID:</span>
                              <span className='ml-2 text-zinc-900 dark:text-zinc-100 font-mono'>
                                {webhook.event.accountId}
                              </span>
                            </div>
                            <div>
                              <span className='text-zinc-600 dark:text-zinc-400'>Profile ID:</span>
                              <span className='ml-2 text-zinc-900 dark:text-zinc-100 font-mono'>
                                {webhook.event.profileId || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className='text-zinc-600 dark:text-zinc-400'>Version:</span>
                              <span className='ml-2 text-zinc-900 dark:text-zinc-100 font-mono'>
                                {webhook.event.version}
                              </span>
                            </div>
                            <div>
                              <span className='text-zinc-600 dark:text-zinc-400'>Signature:</span>
                              <span
                                className={`ml-2 font-mono ${
                                  webhook.signatureValid
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                {webhook.signatureValid ? 'Valid' : 'Invalid'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Full Payload */}
                        <div>
                          <h3 className='text-sm font-semibold mb-2 font-okxs text-zinc-900 dark:text-zinc-100'>
                            Full Payload
                          </h3>
                          <pre className='p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-auto text-xs font-mono max-h-96 text-zinc-900 dark:text-zinc-100'>
                            {JSON.stringify(webhook.event, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
