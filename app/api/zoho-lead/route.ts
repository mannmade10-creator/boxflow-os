import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Get Zoho access token using refresh token
    const tokenRes = await fetch(
      `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=refresh_token`,
      { method: 'POST' }
    )
    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      console.error('Zoho token error:', tokenData)
      return NextResponse.json({ error: 'Failed to get Zoho token' }, { status: 500 })
    }

    // Create lead in Zoho CRM
    const zohoRes = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [body] }),
    })

    const zohoData = await zohoRes.json()
    return NextResponse.json({ ok: true, zoho: zohoData })

  } catch (err) {
    console.error('Zoho lead error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}