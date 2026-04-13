import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await fetch('https://api.instantly.ai/api/v2/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer N2RjYTJlOGYtMWE2NC00NGU1LTg0OTUtOThiOTA3MTkxYWU3OlVxZFNOcGprWmdieQ==',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
