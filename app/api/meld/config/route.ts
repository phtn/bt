import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.MELD_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'MELD_API_KEY not found in environment variables' }, { status: 500 })
  }
  
  return NextResponse.json({ apiKey })
}
