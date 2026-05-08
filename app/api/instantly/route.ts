import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const res = await fetch('https://api.instantly.ai/api/v2/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INSTANTLY_API_KEY}`,
      },
      body: JSON.stringify({
        campaign_id: '03855a25-fb18-40e1-9aea-dd58f4cf5a32',
        email: body.email,
        first_name: body.first_name || '',
        last_name: body.last_name || '',
        company_name: body.company_name || '',
        custom_variables: {
          industry: body.industry || '',
          trucks: body.trucks || '',
          employees: body.employees || '',
          estimated_savings: body.estimated_savings || '',
          lead_source: body.lead_source || 'Website',
        }
      }),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    console.error('Instantly error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}