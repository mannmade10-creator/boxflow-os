import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY

  if (!url || !serviceKey) {
    return null
  }

  return createClient(url, serviceKey)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const sourceKey = body.sourceKey || null
    const title = body.title || 'Alert'
    const description = body.description || ''
    const type = body.type || 'system'
    const action = body.action || 'open'

    const supabase = getAdminSupabase()

    // Demo-safe fallback so Vercel build won't crash
    if (!supabase) {
      return NextResponse.json({
        ok: true,
        demo: true,
        message: 'Alert simulated without Supabase server env vars.',
      })
    }

    if (action === 'acknowledge') {
      const { error } = await supabase.from('alerts').upsert(
        {
          source_key: sourceKey,
          title,
          description,
          type,
          status: 'acknowledged',
        },
        {
          onConflict: 'source_key',
        }
      )

      if (error) {
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
      }

      return NextResponse.json({ ok: true, action: 'acknowledged' })
    }

    const { error } = await supabase.from('alerts').upsert(
      {
        source_key: sourceKey,
        title,
        description,
        type,
        status: 'open',
      },
      {
        onConflict: 'source_key',
      }
    )

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, action: 'open' })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Alerts API failed.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = getAdminSupabase()

    if (!supabase) {
      return NextResponse.json({
        ok: true,
        demo: true,
        alerts: [],
      })
    }

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      alerts: data || [],
    })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Failed to fetch alerts.' },
      { status: 500 }
    )
  }
}