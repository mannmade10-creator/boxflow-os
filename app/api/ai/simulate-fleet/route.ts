import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

type OrderRow = {
  id: string
  pickup_location?: string | null
  dropoff_location?: string | null
  status?: string | null
  assigned_truck_id?: string | null
  truck_lat?: number | null
  truck_lng?: number | null
  delivered_at?: string | null
  route_progress?: number | null
  route_geometry?: number[][] | null
}

function normalizeNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function normalizeText(value: unknown) {
  return String(value || '').trim().toLowerCase()
}

function normalizeStatus(status?: string | null) {
  const value = String(status || '').toLowerCase()
  if (value.includes('deliver')) return 'Delivered'
  if (value.includes('transit')) return 'In Transit'
  if (value.includes('dispatch')) return 'Dispatched'
  if (value.includes('assign')) return 'Assigned'
  return 'Pending'
}

function resolveLocationCoords(text?: string | null) {
  const value = normalizeText(text)

  if (!value) return { lat: 35.4676, lng: -97.5164, label: 'Oklahoma City' }
  if (value.includes('dallas')) return { lat: 32.7767, lng: -96.797, label: 'Dallas' }
  if (value.includes('oklahoma city') || value.includes('okc')) return { lat: 35.4676, lng: -97.5164, label: 'Oklahoma City' }
  if (value.includes('nashville')) return { lat: 36.1627, lng: -86.7816, label: 'Nashville' }
  if (value.includes('las vegas')) return { lat: 36.1699, lng: -115.1398, label: 'Las Vegas' }
  if (value.includes('tulsa')) return { lat: 36.154, lng: -95.9928, label: 'Tulsa' }
  if (value.includes('norman')) return { lat: 35.2226, lng: -97.4395, label: 'Norman' }
  if (value.includes('edmond')) return { lat: 35.6528, lng: -97.4781, label: 'Edmond' }
  if (value.includes('el reno')) return { lat: 35.5323, lng: -97.9551, label: 'El Reno' }

  return { lat: 35.4676, lng: -97.5164, label: 'Oklahoma City' }
}

function hashString(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getStartCoords(order: OrderRow) {
  const pickup = resolveLocationCoords(order.pickup_location)
  const truckId = String(order.assigned_truck_id || '')
  const seed = hashString(`${truckId}-${order.id}`)

  const latOffset = ((seed % 9) - 4) * 0.01
  const lngOffset = ((Math.floor(seed / 10) % 9) - 4) * 0.01

  return {
    lat: pickup.lat + latOffset,
    lng: pickup.lng + lngOffset,
  }
}

async function fetchRouteGeometry(
  startLng: number,
  startLat: number,
  endLng: number,
  endLat: number
): Promise<number[][] | null> {
  if (!mapboxToken) return null

  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${startLng},${startLat};${endLng},${endLat}` +
    `?geometries=geojson&overview=full&access_token=${mapboxToken}`

  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null

    const json = await res.json()
    const coords = json?.routes?.[0]?.geometry?.coordinates

    if (!Array.isArray(coords) || coords.length < 2) return null
    return coords
  } catch {
    return null
  }
}

export async function POST() {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase server environment variables.' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const orders = ((data as any[]) || []) as OrderRow[]

    let movedCount = 0
    let deliveredCount = 0
    let dispatchedCount = 0

    for (const order of orders) {
      const status = normalizeStatus(order.status)
      const truckId = String(order.assigned_truck_id || '').trim()

      if (!truckId) continue
      if (status === 'Pending' || status === 'Delivered') continue

      const destination = resolveLocationCoords(order.dropoff_location)
      const currentLat = normalizeNumber(order.truck_lat) ?? getStartCoords(order).lat
      const currentLng = normalizeNumber(order.truck_lng) ?? getStartCoords(order).lng

      let routeGeometry = Array.isArray(order.route_geometry) ? order.route_geometry : null
      let routeProgress = normalizeNumber(order.route_progress) ?? 0

      if (!routeGeometry || routeGeometry.length < 2) {
        routeGeometry = await fetchRouteGeometry(
          currentLng,
          currentLat,
          destination.lng,
          destination.lat
        )

        if (!routeGeometry) {
          routeGeometry = [
            [currentLng, currentLat],
            [destination.lng, destination.lat],
          ]
        }

        routeProgress = 0
      }

      if (status === 'Assigned') {
        const { error: promoteError } = await supabase
          .from('orders')
          .update({
            status: 'Dispatched',
            truck_lat: currentLat,
            truck_lng: currentLng,
            route_progress: 0,
            route_geometry: routeGeometry,
            last_location_update: new Date().toISOString(),
          })
          .eq('id', order.id)

        if (!promoteError) dispatchedCount += 1
        continue
      }

      const totalPoints = routeGeometry.length
      const stepSize = Math.max(1, Math.floor(totalPoints * 0.08))
      const nextProgress = Math.min(totalPoints - 1, Math.floor(routeProgress + stepSize))
      const nextPoint = routeGeometry[nextProgress]
      const finalPoint = routeGeometry[totalPoints - 1]

      const nextLng = Array.isArray(nextPoint) ? Number(nextPoint[0]) : currentLng
      const nextLat = Array.isArray(nextPoint) ? Number(nextPoint[1]) : currentLat

      const finalLng = Array.isArray(finalPoint) ? Number(finalPoint[0]) : destination.lng
      const finalLat = Array.isArray(finalPoint) ? Number(finalPoint[1]) : destination.lat

      const atEnd = nextProgress >= totalPoints - 1

      if (atEnd) {
        const { error: deliveredError } = await supabase
          .from('orders')
          .update({
            status: 'Delivered',
            truck_lat: finalLat,
            truck_lng: finalLng,
            delivered_at: new Date().toISOString(),
            last_location_update: new Date().toISOString(),
            route_progress: totalPoints - 1,
            route_geometry: routeGeometry,
          })
          .eq('id', order.id)

        if (!deliveredError) deliveredCount += 1
      } else {
        const { error: moveError } = await supabase
          .from('orders')
          .update({
            status: 'In Transit',
            truck_lat: nextLat,
            truck_lng: nextLng,
            last_location_update: new Date().toISOString(),
            route_progress: nextProgress,
            route_geometry: routeGeometry,
          })
          .eq('id', order.id)

        if (!moveError) movedCount += 1
      }
    }

    return NextResponse.json({
      ok: true,
      movedCount,
      deliveredCount,
      dispatchedCount,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected server error.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/ai/simulate-fleet',
    message: 'simulate-fleet route is live',
  })
}