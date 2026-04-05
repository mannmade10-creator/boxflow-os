import { NextRequest, NextResponse } from 'next/server'

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

type Stop = {
  lng: number
  lat: number
}

export async function POST(req: NextRequest) {
  try {
    if (!mapboxToken) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_MAPBOX_TOKEN' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const stops = Array.isArray(body?.stops) ? body.stops : []

    if (stops.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 stops are required.' },
        { status: 400 }
      )
    }

    const cleanedStops: Stop[] = stops
      .map((stop: any) => ({
        lng: Number(stop?.lng),
        lat: Number(stop?.lat),
      }))
      .filter(
        (stop) =>
          Number.isFinite(stop.lng) &&
          Number.isFinite(stop.lat) &&
          Math.abs(stop.lng) <= 180 &&
          Math.abs(stop.lat) <= 90
      )

    if (cleanedStops.length < 2) {
      return NextResponse.json(
        { error: 'Stops contain invalid coordinates.' },
        { status: 400 }
      )
    }

    const coordinates = cleanedStops
      .map((stop) => `${stop.lng},${stop.lat}`)
      .join(';')

    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}` +
      `?geometries=geojson&overview=full&steps=false&access_token=${mapboxToken}`

    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || 'Mapbox directions request failed.' },
        { status: response.status }
      )
    }

    const route = data?.routes?.[0]?.geometry?.coordinates

    if (!Array.isArray(route) || route.length < 2) {
      return NextResponse.json(
        { error: 'No valid snapped route returned from Mapbox.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      route,
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
    route: '/api/route-snap',
    message: 'route-snap API is live',
  })
}