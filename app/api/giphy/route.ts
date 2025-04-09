// app/api/giphy/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'trending'
  const query = searchParams.get('query') || ''

  const API_KEY = process.env.GIPHY_API_KEY
  let endpoint = ''
  const params: Record<string, string> = {
    api_key: API_KEY!,
    limit: '20',
  }

  if (type === 'trending') {
    endpoint = 'https://api.giphy.com/v1/gifs/trending'
  } else if (type === 'search') {
    endpoint = 'https://api.giphy.com/v1/gifs/search'
    params.q = query
  } else if (type === 'stickers') {
    endpoint = 'https://api.giphy.com/v1/stickers/trending'
  } else if (type === 'stickers-search') {
    endpoint = 'https://api.giphy.com/v1/stickers/search'
    params.q = query
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  try {
    const response = await axios.get(endpoint, { params })
    console.log(response.data);
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Giphy API error:', error)
    return NextResponse.json({ error: 'Failed to fetch from Giphy' }, { status: 500 })
  }
}