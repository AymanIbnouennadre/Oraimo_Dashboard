import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const BACKEND_URL = 'https://oraimosmartscan-cbdfada7brfyfwbg.francecentral-01.azurewebsites.net'

export const dynamic = 'force-dynamic'

function getAuthToken(): string | null {
  const token = cookies().get('oraimo_token')?.value
  return token || null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken()
    const id = params.id

    const response = await fetch(`${BACKEND_URL}/api/history-stock/${id}`, {
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
    console.error('Error fetching stock history by ID:', error)
    return NextResponse.json({ error: 'Failed to fetch stock history' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken()
    const id = params.id
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/history-stock/${id}`, {
      method: 'PUT',
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
    console.error('Error updating stock history:', error)
    return NextResponse.json({ error: 'Failed to update stock history' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthToken()
    const id = params.id

    const response = await fetch(`${BACKEND_URL}/api/history-stock/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${await response.text()}`)
    }

    return NextResponse.json({ message: 'Stock history deleted successfully' })
  } catch (error) {
    console.error('Error deleting stock history:', error)
    return NextResponse.json({ error: 'Failed to delete stock history' }, { status: 500 })
  }
}