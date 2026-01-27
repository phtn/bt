import { NextRequest, NextResponse } from 'next/server'
import {
  getWebhooks,
  getWebhooksByEventType,
  getWebhooksSince,
  clearWebhooks,
  getWebhookCount,
  getWebhookCountByEventType,
} from '../../webhooks-meld/store'
import type { MeldEventType } from '../../webhooks-meld/store'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const eventType = searchParams.get('eventType') as MeldEventType | null
    const since = searchParams.get('since')
    const countOnly = searchParams.get('countOnly') === 'true'

    if (countOnly) {
      if (eventType) {
        return NextResponse.json({
          count: getWebhookCountByEventType(eventType),
          eventType,
        })
      }
      return NextResponse.json({
        count: getWebhookCount(),
      })
    }

    let webhooks
    if (eventType) {
      webhooks = getWebhooksByEventType(eventType)
    } else if (since) {
      webhooks = getWebhooksSince(since)
    } else {
      webhooks = getWebhooks()
    }

    return NextResponse.json({
      count: webhooks.length,
      webhooks,
    })
  } catch (error) {
    console.error('Error fetching webhooks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    clearWebhooks()
    return NextResponse.json({ success: true, message: 'All webhooks cleared' })
  } catch (error) {
    console.error('Error clearing webhooks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
