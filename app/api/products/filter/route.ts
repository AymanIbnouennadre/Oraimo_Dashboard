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

    const response = await fetch(`${BACKEND_URL}/api/products/filter?${params.toString()}`, {
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
    console.error('Error filtering products:', error)
    return NextResponse.json({ error: 'Failed to filter products' }, { status: 500 })
  }
}