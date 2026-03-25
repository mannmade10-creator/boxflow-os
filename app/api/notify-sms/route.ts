import { NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(req: Request) {
  try {
    const DEMO_MODE = process.env.DEMO_MODE === 'true'

    const body = await req.json()
    const to = body.to || process.env.ALERT_SMS_TO || 'Demo Number'
    const title = body.title || 'BoxFlow Alert'
    const message = body.message || 'No details provided.'
    const level = body.level || 'info'

    // 🚀 DEMO MODE
    if (DEMO_MODE) {
      console.log('📲 DEMO SMS SENT')
      console.log('TO:', to)
      console.log('MESSAGE:', `[${level.toUpperCase()}] ${title} - ${message}`)

      return NextResponse.json({
        ok: true,
        demo: true,
        message: 'SMS simulated successfully',
      })
    }

    // 🔴 LIVE MODE (real Twilio)
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_FROM_NUMBER

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { ok: false, error: 'Missing Twilio credentials' },
        { status: 500 }
      )
    }

    const client = twilio(accountSid, authToken)

    const sms = await client.messages.create({
      from: fromNumber,
      to,
      body: `[${level.toUpperCase()}] ${title} - ${message}`,
    })

    return NextResponse.json({
      ok: true,
      sid: sms.sid,
    })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'SMS failed' },
      { status: 500 }
    )
  }
}