import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

async function getZohoToken() {
  const res = await fetch(
    `https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=refresh_token`,
    { method: 'POST' }
  )
  const data = await res.json()
  return data.access_token
}

async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'kenneth.covington@boxflowos.com',
      pass: process.env.ZOHO_SMTP_PASSWORD,
    },
  })

  try {
    const info = await transporter.sendMail({
      from: '"BoxFlow OS" <kenneth.covington@boxflowos.com>',
      to,
      subject,
      html,
    })
    console.log('Email sent successfully to:', to, 'MessageID:', info.messageId)
    return info
  } catch (err: unknown) {
    console.error('SMTP send error to:', to, JSON.stringify(err))
    throw err
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Received lead:', body.Email, body.First_Name, body.Last_Name)

    // 1️⃣ Get Zoho token
    const accessToken = await getZohoToken()
    if (!accessToken) {
      console.error('Failed to get Zoho access token')
      return NextResponse.json({ error: 'Failed to get Zoho token' }, { status: 500 })
    }

    // 2️⃣ Create lead in Zoho CRM
    const zohoRes = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
      method: 'POST',
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [body] }),
    })
    const zohoData = await zohoRes.json()
    console.log('CRM result:', JSON.stringify(zohoData))

    const leadName = `${body.First_Name || ''} ${body.Last_Name || ''}`.trim() || 'Unknown'
    const leadEmail = body.Email || ''
    const leadCompany = body.Company || 'No company'
    const savings = body.Description?.match(/Est\. Savings: (.+?)\/yr/)?.[1] || 'N/A'
    const industry = body.Description?.match(/Industry: (.+?) \|/)?.[1] || 'N/A'

    // 3️⃣ Notify Kenneth
    console.log('Sending notification to kenneth...')
    await sendEmail(
      'kenneth.covington@boxflowos.com',
      `🔥 New BoxFlow OS Lead — ${leadName} from ${leadCompany}`,
      `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#0ea5e9;padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:22px;">🔥 New Lead — BoxFlow OS</h1>
        </div>
        <div style="background:#f8fafc;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;color:#64748b;font-size:14px;width:140px;">Name</td><td style="padding:10px 0;font-weight:700;color:#0f172a;">${leadName}</td></tr>
            <tr><td style="padding:10px 0;color:#64748b;font-size:14px;">Email</td><td style="padding:10px 0;font-weight:700;color:#0ea5e9;"><a href="mailto:${leadEmail}">${leadEmail}</a></td></tr>
            <tr><td style="padding:10px 0;color:#64748b;font-size:14px;">Company</td><td style="padding:10px 0;font-weight:700;color:#0f172a;">${leadCompany}</td></tr>
            <tr><td style="padding:10px 0;color:#64748b;font-size:14px;">Industry</td><td style="padding:10px 0;font-weight:700;color:#0f172a;">${industry}</td></tr>
            <tr><td style="padding:10px 0;color:#64748b;font-size:14px;">Est. Savings</td><td style="padding:10px 0;font-weight:900;color:#10b981;font-size:18px;">${savings}/yr</td></tr>
            <tr><td style="padding:10px 0;color:#64748b;font-size:14px;">Lead Source</td><td style="padding:10px 0;font-weight:700;color:#0f172a;">${body.Lead_Source || 'Website'}</td></tr>
          </table>
          <div style="margin-top:20px;">
            <a href="https://crm.zoho.com" style="background:#0ea5e9;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">View in Zoho CRM →</a>
          </div>
        </div>
      </div>
      `
    )

    // 4️⃣ Auto-reply to lead
    if (leadEmail) {
      console.log('Sending auto-reply to lead:', leadEmail)
      await sendEmail(
        leadEmail,
        `Your BoxFlow OS Savings Report — ${savings}/yr`,
        `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#0f172a;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:#0ea5e9;margin:0;font-size:24px;">BoxFlow OS</h1>
            <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;">Your personalized savings report</p>
          </div>
          <div style="background:#ffffff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;">
            <h2 style="color:#0f172a;font-size:20px;margin:0 0 8px;">Hi ${body.First_Name || 'there'},</h2>
            <p style="color:#475569;font-size:15px;line-height:1.6;">Thanks for using the BoxFlow OS ROI Calculator. Based on your operation details, here is your personalized savings estimate:</p>
            <div style="background:#f0fdf4;border:2px solid #10b981;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
              <p style="color:#64748b;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Your Estimated Annual Savings</p>
              <p style="color:#10b981;font-size:42px;font-weight:900;margin:0;">${savings}/yr</p>
            </div>
            <p style="color:#475569;font-size:15px;line-height:1.6;">This is what BoxFlow OS could save your operation by replacing your disconnected software stack with one unified platform.</p>
            <p style="color:#475569;font-size:15px;line-height:1.6;">I would love to show you BoxFlow OS running inside a business like yours — 30 minutes, no pressure, just the product.</p>
            <div style="text-align:center;margin:32px 0 24px;">
              <a href="https://www.boxflowos.com/roi" style="background:linear-gradient(135deg,#0ea5e9,#22d3ee);color:white;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:800;font-size:16px;display:inline-block;">Book a Live Demo</a>
            </div>
            <p style="color:#475569;font-size:14px;line-height:1.6;">Questions? Just reply to this email. I respond personally.</p>
            <div style="border-top:1px solid #e2e8f0;margin-top:24px;padding-top:20px;">
              <p style="color:#0f172a;font-weight:700;margin:0;font-size:14px;">Kenneth Covington</p>
              <p style="color:#64748b;margin:4px 0 0;font-size:13px;">BoxFlow OS | Made Technologies Inc</p>
              <p style="color:#0ea5e9;margin:4px 0 0;font-size:13px;">kenneth.covington@boxflowos.com</p>
            </div>
          </div>
        </div>
        `
      )
    }

    return NextResponse.json({ ok: true, zoho: zohoData })

  } catch (err: unknown) {
    console.error('Zoho lead route error:', JSON.stringify(err))
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}