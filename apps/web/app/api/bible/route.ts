/**
 * Bible API Proxy Route
 *
 * This API route acts as a proxy to bible-api.com to avoid CORS issues
 * when making requests from the browser.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const translation = searchParams.get('translation') || 'web'

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing reference parameter' },
        { status: 400 }
      )
    }

    // Make the request to bible-api.com from the server side
    const bibleApiUrl = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${translation}`

    const response = await fetch(bibleApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Cache the response for 1 hour
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        {
          error: 'Failed to fetch from Bible API',
          details: errorText || response.statusText
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Return the data with CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Bible API proxy error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
