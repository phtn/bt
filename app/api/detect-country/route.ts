import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get client IP from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || ''

    // Use a free IP geolocation service
    // You can replace this with a more reliable service if needed
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    
    if (!response.ok) {
      // Fallback to a default country code
      return NextResponse.json({ countryCode: 'US' })
    }

    const data = await response.json()
    const countryCode = data.country_code || 'US'

    return NextResponse.json({ countryCode })
  } catch (error) {
    console.error('Country detection error:', error)
    // Fallback to default
    return NextResponse.json({ countryCode: 'US' })
  }
}
