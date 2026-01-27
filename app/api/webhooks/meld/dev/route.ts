import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { addWebhook } from '../../../../webhooks-meld/store'
import type { MeldWebhookEvent } from '../../../../webhooks-meld/store'

// Re-export types from store for backward compatibility
export type { MeldWebhookEvent, MeldEventType } from '../../../../webhooks-meld/store'

/**
 * Verify Meld webhook signature
 * Signature format: base64url(HMACSHA256(<TIMESTAMP>.<URL>.<BODY>))
 * Note: Meld uses base64url encoding WITH padding
 */
function verifyMeldSignature(
  timestamp: string,
  url: string,
  body: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Construct the string to sign
    const data = `${timestamp}.${url}.${body}`

    // Create HMAC SHA256 signature
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(data)
    
    // Get base64 encoding and convert to base64url with padding
    const base64 = hmac.digest('base64')
    // Convert base64 to base64url (replace + with -, / with _, keep = padding)
    const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_')
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(base64url)
    )
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

/**
 * Handle Meld webhook events
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from environment (should be set in .env.local)
    const webhookSecret = process.env.MELD_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('MELD_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Get signature headers
    const signature = request.headers.get('meld-signature')
    const signatureTimestamp = request.headers.get('meld-signature-timestamp')

    if (!signature || !signatureTimestamp) {
      console.error('Missing webhook signature headers')
      return NextResponse.json(
        { error: 'Missing signature headers' },
        { status: 401 }
      )
    }

    // Get the raw body (must be unformatted/compact JSON)
    const body = await request.text()
    const bodyJson = JSON.parse(body) as MeldWebhookEvent

    // Get the full URL where the webhook was sent
    const url = request.url

    // Verify the signature
    const isValid = verifyMeldSignature(
      signatureTimestamp,
      url,
      body,
      signature,
      webhookSecret
    )

    if (!isValid) {
      console.error('Invalid webhook signature', {
        eventId: bodyJson.eventId,
        eventType: bodyJson.eventType
      })
      // Store invalid webhook for debugging
      addWebhook(bodyJson, false)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Store the webhook event
    addWebhook(bodyJson, true)

    // Log the webhook event
    console.log('Meld Webhook Received:', {
      eventType: bodyJson.eventType,
      eventId: bodyJson.eventId,
      timestamp: bodyJson.timestamp,
      accountId: bodyJson.accountId,
      transactionId: bodyJson.payload.paymentTransactionId,
      status: bodyJson.payload.paymentTransactionStatus
    })

    // Handle different event types
    switch (bodyJson.eventType) {
      case 'TRANSACTION_CRYPTO_PENDING':
        await handleTransactionPending(bodyJson)
        break

      case 'TRANSACTION_CRYPTO_TRANSFERRING':
        await handleTransactionTransferring(bodyJson)
        break

      case 'TRANSACTION_CRYPTO_COMPLETE':
        await handleTransactionComplete(bodyJson)
        break

      case 'TRANSACTION_CRYPTO_FAILED':
        await handleTransactionFailed(bodyJson)
        break

      case 'WEBHOOK_TEST':
        console.log('Webhook test received - configuration is working!')
        break

      default:
        console.warn('Unknown webhook event type:', bodyJson.eventType)
    }

    // Return 200 OK to acknowledge receipt
    // Meld requires a 2xx status code
    return NextResponse.json(
      {
        received: true,
        eventId: bodyJson.eventId,
        eventType: bodyJson.eventType
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle TRANSACTION_CRYPTO_PENDING event
 * Triggered when user starts payment process (logged in, completed KYC)
 */
async function handleTransactionPending(event: MeldWebhookEvent) {
  const { payload } = event
  console.log('Transaction Pending:', {
    transactionId: payload.paymentTransactionId,
    customerId: payload.externalCustomerId,
    sessionId: payload.externalSessionId,
    status: payload.paymentTransactionStatus
  })

  // TODO: Update your database/state
  // - Mark transaction as pending
  // - Notify user that payment is being processed
  // - Update UI if needed
}

/**
 * Handle TRANSACTION_CRYPTO_TRANSFERRING event
 * Triggered when payment is approved and crypto transfer begins
 */
async function handleTransactionTransferring(event: MeldWebhookEvent) {
  const { payload } = event
  console.log('Transaction Transferring:', {
    transactionId: payload.paymentTransactionId,
    customerId: payload.externalCustomerId,
    sessionId: payload.externalSessionId,
    status: payload.paymentTransactionStatus
  })

  // TODO: Update your database/state
  // - Mark transaction as settling
  // - Notify user that crypto transfer is in progress
  // - Update UI to show "Processing" state
}

/**
 * Handle TRANSACTION_CRYPTO_COMPLETE event
 * Triggered when transaction completes successfully (crypto delivered)
 */
async function handleTransactionComplete(event: MeldWebhookEvent) {
  const { payload } = event
  console.log('Transaction Complete:', {
    transactionId: payload.paymentTransactionId,
    customerId: payload.externalCustomerId,
    sessionId: payload.externalSessionId,
    status: payload.paymentTransactionStatus,
    transactionType: payload.transactionType
  })

  // TODO: Update your database/state
  // - Mark transaction as completed/settled
  // - Update user balance/portfolio
  // - Send confirmation email/notification
  // - Update UI to show success state
  // - Trigger any post-completion workflows
}

/**
 * Handle TRANSACTION_CRYPTO_FAILED event
 * Triggered when transaction fails or encounters an error
 */
async function handleTransactionFailed(event: MeldWebhookEvent) {
  const { payload } = event
  console.log('Transaction Failed:', {
    transactionId: payload.paymentTransactionId,
    customerId: payload.externalCustomerId,
    sessionId: payload.externalSessionId,
    status: payload.paymentTransactionStatus,
    transactionType: payload.transactionType
  })

  // TODO: Update your database/state
  // - Mark transaction as failed/error
  // - Notify user of failure
  // - Update UI to show error state
  // - Allow user to retry if applicable
  // - Log error for debugging
}

// Also handle GET requests for webhook testing/verification
export async function GET() {
  return NextResponse.json({
    message: 'Meld webhook endpoint is active',
    path: '/api/webhooks/meld/dev',
    method: 'POST',
    headers: {
      'meld-signature': 'Required',
      'meld-signature-timestamp': 'Required'
    },
    note: 'Configure MELD_WEBHOOK_SECRET in .env.local'
  })
}
