import { addGameResult, getGameResults, getGameResultsSince } from '@/app/game-results/store'
import { NextRequest, NextResponse } from 'next/server'

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    // Check if request has a body
    const contentType = req.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('POST request without JSON content-type:', contentType)
      return NextResponse.json(
        {
          success: false,
          error: 'Content-Type must be application/json'
        },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    const text = await req.text()
    if (!text || text.trim() === '') {
      console.warn('POST request with empty body')
      return NextResponse.json(
        {
          success: false,
          error: 'Request body is empty'
        },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    let results: unknown
    try {
      results = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body'
        },
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    console.log('Game results received:', JSON.stringify(results, null, 2))

    // Store the result (only if unique roundId)
    const storedResult = addGameResult(results)

    if (!storedResult) {
      return NextResponse.json(
        {
          success: true,
          message: 'Game results received but skipped (duplicate roundId)',
          data: results
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Game results received',
        data: results,
        id: storedResult.id,
        timestamp: storedResult.timestamp
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  } catch (error) {
    console.error('Error processing game results:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
}

// GET endpoint to retrieve stored results
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const since = searchParams.get('since')

    const results = since ? getGameResultsSince(since) : getGameResults()

    return NextResponse.json(
      {
        success: true,
        results,
        count: results.length
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  } catch (error) {
    console.error('Error retrieving game results:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    )
  }
}
