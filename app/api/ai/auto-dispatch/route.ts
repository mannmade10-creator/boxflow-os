import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

type OrderRow = {
  id: string
  order_number?: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
  priority?: string | null
  status?: string | null
  assigned_truck_id?: string | null
  created_at?: string | null
}

type TruckOption = {
  id: string
  name: string
  zone: string
  lat: number
  lng: number
  capacity: string
}

const TRUCK_OPTIONS: TruckOption[] = [
  {
    id: 'TRK-201',
    name: 'Blue Truck 201',
    zone: 'OKC Core',
    lat: 35.4676,
    lng: -97.5164,
    capacity: 'Standard',
  },
  {
    id: 'TRK-305',
    name: 'Yellow Truck 305',
    zone: 'Metro East',
    lat: 35.4822,
    lng: -97.4301,
    capacity: 'High',
  },
  {
    id: 'TRK-412',
    name: 'Silver Truck 412',
    zone: 'North Route',
    lat: 35.5901,
    lng: -97.5487,
    capacity: 'Standard',
  },
  {
    id: 'TRK-518',
    name: 'Black Truck 518',
    zone: 'South Route',
    lat: 35.3912,
    lng: -97.5234,
    capacity: 'Rush',
  },
]

function normalizeStatus(status?: string | null) {
  const value = String(status || '').toLowerCase()
  if (value.includes('deliver')) return 'Delivered'
  if (value.includes('transit')) return 'In Transit'
  if (value.includes('dispatch')) return 'Dispatched'
  if (value.includes('assign')) return 'Assigned'
  return 'Pending'
}

function resolveLocationCoords(text?: string | null) {
  const value = String(text || '').trim().toLowerCase()

  if (!value) return { lat: 35.4676, lng: -97.5164, label: 'OKC default' }
  if (value.includes('dallas')) return { lat: 32.7767, lng: -96.797, label: 'Dallas' }
  if (value.includes('oklahoma city') || value.includes('okc')) return { lat: 35.4676, lng: -97.5164, label: 'Oklahoma City' }
  if (value.includes('nashville')) return { lat: 36.1627, lng: -86.7816, label: 'Nashville' }
  if (value.includes('las vegas')) return { lat: 36.1699, lng: -115.1398, label: 'Las Vegas' }
  if (value.includes('tulsa')) return { lat: 36.154, lng: -95.9928, label: 'Tulsa' }
  if (value.includes('norman')) return { lat: 35.2226, lng: -97.4395, label: 'Norman' }
  if (value.includes('edmond')) return { lat: 35.6528, lng: -97.4781, label: 'Edmond' }
  if (value.includes('el reno')) return { lat: 35.5323, lng: -97.9551, label: 'El Reno' }

  return { lat: 35.4676, lng: -97.5164, label: 'OKC fallback' }
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

function hoursSince(dateString?: string | null) {
  if (!dateString) return 0
  return (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60)
}

function chooseTruck(order: OrderRow, activeTruckCounts: Map<string, number>) {
  const pickup = resolveLocationCoords(order.pickup_location)
  const priority = String(order.priority || '').toLowerCase()

  const ranked = TRUCK_OPTIONS.map((truck) => {
    let score = distanceKm(truck.lat, truck.lng, pickup.lat, pickup.lng)
    const currentLoad = activeTruckCounts.get(truck.id) || 0

    score += currentLoad * 2.5

    if ((priority.includes('rush') || priority.includes('urgent')) && truck.capacity === 'Rush') {
      score -= 4
    }

    if (priority.includes('high') && (truck.capacity === 'High' || truck.capacity === 'Rush')) {
      score -= 1.5
    }

    return { truck, score }
  }).sort((a, b) => a.score - b.score)

  return ranked[0].truck
}

export async function POST(_req: NextRequest) {
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

    const activeTruckCounts = new Map<string, number>()

    orders.forEach((order) => {
      const status = normalizeStatus(order.status)
      const truckId = String(order.assigned_truck_id || '').trim()
      if (truckId && ['Assigned', 'Dispatched', 'In Transit'].includes(status)) {
        activeTruckCounts.set(truckId, (activeTruckCounts.get(truckId) || 0) + 1)
      }
    })

    let assignedCount = 0
    let dispatchedCount = 0
    let flaggedCount = 0

    for (const order of orders) {
      const status = normalizeStatus(order.status)
      const ageHours = hoursSince(order.created_at)

      if (status === 'Pending') {
        const truck = chooseTruck(order, activeTruckCounts)

        const { error: updateError } = await supabase
          .from('orders')
          .update({
            assigned_truck_id: truck.id,
            truck_lat: truck.lat,
            truck_lng: truck.lng,
            status: 'Assigned',
          })
          .eq('id', order.id)

        if (!updateError) {
          assignedCount += 1
          activeTruckCounts.set(truck.id, (activeTruckCounts.get(truck.id) || 0) + 1)
        }
      } else if (status === 'Assigned' && ageHours >= 0.03) {
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'Dispatched' })
          .eq('id', order.id)

        if (!updateError) {
          dispatchedCount += 1
        }
      } else if (
        (status === 'Assigned' || status === 'Dispatched' || status === 'In Transit') &&
        ageHours > 18
      ) {
        flaggedCount += 1
      }
    }

    return NextResponse.json({
      ok: true,
      assignedCount,
      dispatchedCount,
      flaggedCount,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unexpected server error.' },
      { status: 500 }
    )
  }
}