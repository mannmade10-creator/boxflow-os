import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

type DestinationCoords = {
  lat: number
  lng: number
}

function normalizeText(value: unknown) {
  return String(value || '').trim().toLowerCase()
}

function resolveDestinationCoords(dropoff: string): DestinationCoords | null {
  const text = normalizeText(dropoff)

  if (!text) return null

  if (text.includes('dallas')) return { lat: 32.7767, lng: -96.7970 }
  if (text.includes('oklahoma city') || text.includes('okc')) return { lat: 35.4676, lng: -97.5164 }
  if (text.includes('nashville')) return { lat: 36.1627, lng: -86.7816 }
  if (text.includes('las vegas')) return { lat: 36.1699, lng: -115.1398 }
  if (text.includes('tulsa')) return { lat: 36.1540, lng: -95.9928 }
  if (text.includes('norman')) return { lat: 35.2226, lng: -97.4395 }
  if (text.includes('edmond')) return { lat: 35.6528, lng: -97.4781 }
  if (text.includes('el reno')) return { lat: 35.5323, lng: -97.9551 }

  return null
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase server environment variables.' },
        { status: 500 }
      )
    }

    const body = await req.json()

    const orderId = String(body?.orderId || '').trim()
    const truckId = String(body?.truckId || '').trim()
    const lat = Number(body?.lat)
    const lng = Number(body?.lng)
    const incomingStatus = body?.status ? String(body.status) : undefined

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required.' }, { status: 400 })
    }

    if (!truckId) {
      return NextResponse.json({ error: 'truckId is required.' }, { status: 400 })
    }

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return NextResponse.json({ error: 'Valid lat and lng are required.' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: rows, error: readError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .limit(1)

    if (readError) {
      return NextResponse.json({ error: readError.message }, { status: 500 })
    }

    const order = rows?.[0]
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    const dropoffLocation =
      order.dropoff_location ||
      order.dropoff ||
      order.destination ||
      order.to_location ||
      ''

    const destination = resolveDestinationCoords(dropoffLocation)

    let status = incomingStatus || String(order.status || 'Assigned')
    let deliveredAt: string | null = null

    if (destination) {
      const kmAway = distanceKm(lat, lng, destination.lat, destination.lng)

      if (kmAway <= 1.0) {
        status = 'Delivered'
        deliveredAt = new Date().toISOString()
      } else if (
        status !== 'Delivered' &&
        status !== 'In Transit' &&
        status !== 'Dispatched'
      ) {
        status = 'In Transit'
      }
    } else if (!incomingStatus) {
      status = status === 'Delivered' ? 'Delivered' : 'In Transit'
    }

    const updatePayload: Record<string, unknown> = {
      assigned_truck_id: truckId,
      truck_lat: lat,
      truck_lng: lng,
      status,
      last_location_update: new Date().toISOString(),
    }

    if (deliveredAt) {
      updatePayload.delivered_at = deliveredAt
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      status,
      delivered: status === 'Delivered',
      destination,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected server error.' },
      { status: 500 }
    )
  }
}