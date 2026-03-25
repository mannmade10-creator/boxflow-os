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

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export async function POST() {
  try {
    const supabase = getAdminSupabase()

    // Demo-safe fallback so build does not crash
    if (!supabase) {
      return NextResponse.json({
        ok: true,
        demo: true,
        message: 'Demo tick simulated without Supabase server env vars.',
      })
    }

    const { data: fleet } = await supabase.from('fleet').select('*')
    const { data: equipment } = await supabase.from('equipment').select('*')
    const { data: orders } = await supabase.from('orders').select('*')

    const fleetRows = fleet || []
    const equipmentRows = equipment || []
    const orderRows = orders || []

    for (const truck of fleetRows.slice(0, 5)) {
      const newLat = (truck.latitude || 35.46) + randomBetween(-0.003, 0.003)
      const newLng = (truck.longitude || -97.51) + randomBetween(-0.003, 0.003)

      const possibleStatus =
        Math.random() < 0.1
          ? 'delayed'
          : truck.current_load
          ? 'delivering'
          : pick(['idle', 'assigned', 'delivering'])

      await supabase
        .from('fleet')
        .update({
          latitude: newLat,
          longitude: newLng,
          status: possibleStatus,
          eta:
            possibleStatus === 'delayed'
              ? 'Delayed'
              : possibleStatus === 'delivering'
              ? 'En Route'
              : 'Standby',
        })
        .eq('id', truck.id)
    }

    for (const machine of equipmentRows.slice(0, 6)) {
      const roll = Math.random()
      const status =
        roll < 0.1 ? 'down' : roll < 0.25 ? 'idle' : 'running'

      await supabase
        .from('equipment')
        .update({
          status,
          output_percent:
            status === 'running'
              ? Math.round(randomBetween(72, 99))
              : status === 'idle'
              ? Math.round(randomBetween(20, 55))
              : Math.round(randomBetween(0, 10)),
          alert:
            status === 'down'
              ? pick([
                  'Maintenance needed',
                  'Sensor fault detected',
                  'Machine jam reported',
                ])
              : null,
        })
        .eq('id', machine.id)
    }

    if (Math.random() < 0.35) {
      const loadName = pick([
        'Paper Rolls - A12',
        'Corrugated Sheets - B19',
        'Retail Display Boxes - C44',
        'Packaging Materials - D07',
        'Industrial Cartons - E88',
      ])

      await supabase.from('orders').insert({
        load_name: loadName,
        pickup_location: pick([
          'IP Warehouse OKC',
          'North Plant Yard',
          'South Dock',
        ]),
        dropoff_location: pick([
          'RetailCo Distribution',
          'SupplyHub - Mustang',
          'BoxMart - Edmond',
          'PackRight - Moore',
        ]),
        pickup_lat: 35.48,
        pickup_lng: -97.5,
        dropoff_lat: 35.52,
        dropoff_lng: -97.48,
        status: 'pending',
        driver_response: 'pending',
      })
    }

    for (const order of orderRows.slice(0, 4)) {
      if (order.status === 'pending' && Math.random() < 0.3) {
        await supabase
          .from('orders')
          .update({ status: 'assigned' })
          .eq('id', order.id)
      } else if (order.status === 'assigned' && Math.random() < 0.25) {
        await supabase
          .from('orders')
          .update({ status: 'in_transit' })
          .eq('id', order.id)
      } else if (
        (order.status === 'in_transit' || order.status === 'at_pickup') &&
        Math.random() < 0.2
      ) {
        await supabase
          .from('orders')
          .update({ status: 'delivered' })
          .eq('id', order.id)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || 'Demo tick failed' },
      { status: 500 }
    )
  }
}