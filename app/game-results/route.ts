import { NextRequest, NextResponse } from 'next/server'
import { addGameResult, getGameResults, getGameResultsSince } from './store'

export async function POST(req: NextRequest) {
  try {
    const results = await req.json()
    console.log('Game results received:', JSON.stringify(results, null, 2))

    // Store the result (only if unique roundId)
    const storedResult = addGameResult(results)
    
    if (!storedResult) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Game results received but skipped (duplicate roundId)',
          data: results,
        },
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
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
        },
      }
    )
  } catch (error) {
    console.error('Error processing game results:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// GET endpoint to retrieve stored results
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const since = searchParams.get('since')

    const results = since 
      ? getGameResultsSince(since)
      : getGameResults()

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
        },
      }
    )
  } catch (error) {
    console.error('Error retrieving game results:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

