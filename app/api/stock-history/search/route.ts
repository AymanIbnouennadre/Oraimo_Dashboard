import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = 'https://oraimosmartscan-cbdfada7brfyfwbg.francecentral-01.azurewebsites.net'

export const dynamic = 'force-dynamic'

function getAuthToken(): string | null {
  const token = cookies().get('oraimo_token')?.value
  return token || null
}

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken()
    const { searchParams } = new URL(request.url)

    const params = new URLSearchParams()
    for (const [key, value] of searchParams) {
      params.append(key, value)
    }

    const queryString = params.toString()
    const endpoint = queryString ? `${BACKEND_URL}/api/history-stock/search?${queryString}` : `${BACKEND_URL}/api/history-stock/search`

    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error searching stock history:', error)
    return NextResponse.json({ error: 'Failed to search stock history' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken()
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/history-stock/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error searching stock history:', error)
    return NextResponse.json({ error: 'Failed to search stock history' }, { status: 500 })
  }
}