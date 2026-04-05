'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { supabase } from '@/lib/supabase'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

type OrderRow = {
  id: string
  order_number?: string | null
  load_name?: string | null
  assigned_truck_id?: string | null
  truck_lat?: number | null
  truck_lng?: number | null
  status?: string | null
  client_name?: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
  priority?: string | null
  delivered_at?: string | null
  route_progress?: number | null
  route_geometry?: number[][] | null
}

type LiveTruck = {
  orderId: string
  orderNumber: string
  loadName: string
  truckId: string
  clientName: string
  status: string
  priority: string
  pickupLocation: string
  dropoffLocation: string
  currentLat: number
  currentLng: number
  etaMin: number
  distanceKm: number
  routeGeometry: number[][]
}

function normalizeNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function normalizeStatus(status?: string | null) {
  const value = String(status || '').toLowerCase()
  if (value.includes('deliver')) return 'Delivered'
  if (value.includes('transit')) return 'In Transit'
  if (value.includes('dispatch')) return 'Dispatched'
  if (value.includes('assign')) return 'Assigned'
  return 'Pending'
}

function getTruckImage(truckId?: string | null) {
  if (!truckId) return '/truck-blue.png'
  return truckId === 'TRK-305' ? '/truck-yellow.png' : '/truck-blue.png'
}

function getStatusColor(status: string) {
  const value = status.toLowerCase()
  if (value.includes('delivered')) return '#22c55e'
  if (value.includes('transit')) return '#38bdf8'
  if (value.includes('dispatch')) return '#3b82f6'
  if (value.includes('assign')) return '#f59e0b'
  return '#94a3b8'
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

function buildLiveTruck(row: OrderRow): LiveTruck | null {
  const currentLat = normalizeNumber(row.truck_lat)
  const currentLng = normalizeNumber(row.truck_lng)

  if (currentLat === null || currentLng === null) return null

  const status = normalizeStatus(row.status)
  if (status === 'Pending' || status === 'Delivered') return null

  const routeGeometry =
    Array.isArray(row.route_geometry) && row.route_geometry.length > 1
      ? row.route_geometry
      : [[currentLng, currentLat]]

  const lastPoint = routeGeometry[routeGeometry.length - 1] || [currentLng, currentLat]
  const targetLng = Number(lastPoint[0])
  const targetLat = Number(lastPoint[1])

  const km = distanceKm(currentLat, currentLng, targetLat, targetLng)
  const eta = Math.max(1, Math.round(km * 2.5))

  return {
    orderId: row.id,
    orderNumber: row.order_number || `ORD-${row.id.slice(0, 8)}`,
    loadName: row.load_name || `Order ${row.id}`,
    truckId: row.assigned_truck_id || 'Unassigned',
    clientName: row.client_name || 'No client',
    status,
    priority: row.priority || 'Standard',
    pickupLocation: row.pickup_location || 'N/A',
    dropoffLocation: row.dropoff_location || 'N/A',
    currentLat,
    currentLng,
    etaMin: eta,
    distanceKm: Number(km.toFixed(1)),
    routeGeometry,
  }
}

export default function FleetMapPage() {
  const searchParams = useSearchParams()
  const selectedTruckId = searchParams.get('truck')

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({})

  const [mapReady, setMapReady] = useState(false)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [selectedTrip, setSelectedTrip] = useState<LiveTruck | null>(null)
  const [error, setError] = useState<string | null>(null)

  const liveTrucks = useMemo(() => {
    return orders
      .map((row) => buildLiveTruck(row))
      .filter((truck): truck is LiveTruck => truck !== null)
  }, [orders])

  const deliveredCount = useMemo(() => {
    return orders.filter((o) => normalizeStatus(o.status) === 'Delivered').length
  }, [orders])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-97.5164, 35.4676],
      zoom: 9.2,
      pitch: 42,
      bearing: -14,
      antialias: true,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.on('load', () => {
      mapRef.current = map
      setMapReady(true)
    })

    return () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove())
      markersRef.current = {}
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapReady) return

    async function loadOrders() {
      try {
        setError(null)

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        const rows = ((data as any[]) || []).map((row) => ({
          id: String(row.id),
          order_number: row.order_number || null,
          load_name: row.load_name || row.order_name || row.name || `Order ${row.id}`,
          assigned_truck_id:
            row.assigned_truck_id || row.truck_id || row.assigned_truck || null,
          truck_lat: normalizeNumber(row.truck_lat),
          truck_lng: normalizeNumber(row.truck_lng),
          status: row.status || 'Pending',
          client_name: row.client_name || row.client || null,
          pickup_location:
            row.pickup_location || row.pickup || row.origin || row.from_location || null,
          dropoff_location:
            row.dropoff_location || row.dropoff || row.destination || row.to_location || null,
          priority: row.priority || 'Standard',
          delivered_at: row.delivered_at || null,
          route_progress: normalizeNumber(row.route_progress),
          route_geometry: Array.isArray(row.route_geometry) ? row.route_geometry : null,
        })) as OrderRow[]

        setOrders(rows)
      } catch (err: any) {
        console.error('Fleet map load error:', err)
        setError(err?.message || 'Failed to load fleet orders.')
      }
    }

    loadOrders()

    const channel = supabase
      .channel('fleet-phase-17-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => loadOrders()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mapReady])

  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map) return

    Object.values(markersRef.current).forEach((marker) => marker.remove())
    markersRef.current = {}

    const keepLayerIds = liveTrucks.map((t) => `route-layer-${t.orderId}`)
    const keepSourceIds = liveTrucks.map((t) => `route-source-${t.orderId}`)

    liveTrucks.forEach((truck) => {
      const sourceId = `route-source-${truck.orderId}`
      const layerId = `route-layer-${truck.orderId}`

      if (map.getLayer(layerId)) map.removeLayer(layerId)
      if (map.getSource(sourceId)) map.removeSource(sourceId)

      if (truck.routeGeometry.length > 1) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: truck.routeGeometry,
            },
            properties: {},
          },
        })

        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color':
              selectedTruckId && truck.truckId === selectedTruckId ? '#38bdf8' : '#60a5fa',
            'line-width': selectedTruckId && truck.truckId === selectedTruckId ? 5 : 3,
            'line-opacity': 0.8,
          },
        })
      }

      const el = document.createElement('div')
      const isSelected = selectedTruckId && truck.truckId === selectedTruckId

      el.style.width = isSelected ? '58px' : '46px'
      el.style.height = isSelected ? '58px' : '46px'
      el.style.backgroundImage = `url("${getTruckImage(truck.truckId)}")`
      el.style.backgroundSize = 'contain'
      el.style.backgroundRepeat = 'no-repeat'
      el.style.backgroundPosition = 'center'
      el.style.cursor = 'pointer'
      el.style.filter = isSelected
        ? 'drop-shadow(0 0 16px rgba(56,189,248,0.95))'
        : 'drop-shadow(0 8px 16px rgba(0,0,0,0.45))'

      const popup = new mapboxgl.Popup({ offset: 14 }).setHTML(`
        <div style="color:#111;padding:4px 6px;">
          <div style="font-weight:700;">${truck.truckId}</div>
          <div>${truck.orderNumber}</div>
          <div>${truck.clientName}</div>
          <div>Status: ${truck.status}</div>
          <div>ETA: ${truck.etaMin} min</div>
          <div>Distance: ${truck.distanceKm} km</div>
        </div>
      `)

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([truck.currentLng, truck.currentLat])
        .setPopup(popup)
        .addTo(map)

      el.addEventListener('click', () => {
        setSelectedTrip(truck)
      })

      markersRef.current[truck.orderId] = marker
    })

    const style = map.getStyle()
    if (style?.layers) {
      style.layers.forEach((layer) => {
        const id = layer.id
        if (id.startsWith('route-layer-') && !keepLayerIds.includes(id)) {
          if (map.getLayer(id)) map.removeLayer(id)
        }
      })
    }

    Object.keys((map as any).style?.sourceCaches || {}).forEach((id) => {
      const sourceId = String(id)
      if (
        sourceId.startsWith('route-source-') &&
        !keepSourceIds.includes(sourceId) &&
        map.getSource(sourceId)
      ) {
        map.removeSource(sourceId)
      }
    })

    if (selectedTruckId) {
      const found = liveTrucks.find((t) => t.truckId === selectedTruckId) || null
      setSelectedTrip(found)
    } else if (!selectedTrip && liveTrucks.length > 0) {
      setSelectedTrip(liveTrucks[0])
    }

    const bounds = new mapboxgl.LngLatBounds()
    liveTrucks.forEach((truck) => {
      bounds.extend([truck.currentLng, truck.currentLat])
      truck.routeGeometry.forEach((point) => {
        if (Array.isArray(point) && point.length >= 2) {
          bounds.extend([Number(point[0]), Number(point[1])])
        }
      })
    })

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: 80,
        maxZoom: 11.4,
        duration: 1200,
      })
    }
  }, [mapReady, liveTrucks, selectedTruckId])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: '#fff',
        padding: 20,
      }}
    >
      <div style={{ maxWidth: 1600, margin: '0 auto' }}>
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800 }}>Fleet Map</h1>
            <p style={{ marginTop: 8, color: '#94a3b8' }}>
              Phase 17 real road-route playback with live truck movement.
            </p>
          </div>
        </div>

        {error ? (
          <div
            style={{
              marginBottom: 14,
              background: 'rgba(127,29,29,0.28)',
              border: '1px solid rgba(248,113,113,0.36)',
              color: '#fecaca',
              borderRadius: 16,
              padding: 14,
            }}
          >
            {error}
          </div>
        ) : null}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: 18,
            alignItems: 'start',
          }}
        >
          <div
            style={{
              height: '78vh',
              borderRadius: 24,
              overflow: 'hidden',
              border: '1px solid rgba(148,163,184,0.16)',
              background: '#0f172a',
            }}
          >
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gap: 16,
              maxHeight: '78vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                background: 'rgba(15,23,42,0.86)',
                border: '1px solid rgba(148,163,184,0.16)',
                borderRadius: 24,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: 0.7,
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
                Selected Trip
              </div>

              {!selectedTrip ? (
                <div style={{ color: '#94a3b8' }}>Select an active truck.</div>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{selectedTrip.truckId}</div>
                  <div style={{ color: '#cbd5e1', fontWeight: 700 }}>
                    {selectedTrip.orderNumber}
                  </div>
                  <div style={{ color: '#94a3b8' }}>{selectedTrip.clientName}</div>
                  <div style={{ color: getStatusColor(selectedTrip.status), fontWeight: 800 }}>
                    Status: {selectedTrip.status}
                  </div>
                  <div style={{ color: '#e2e8f0' }}>ETA: {selectedTrip.etaMin} min</div>
                  <div style={{ color: '#e2e8f0' }}>
                    Distance: {selectedTrip.distanceKm} km
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>
                    Pickup: {selectedTrip.pickupLocation}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 13 }}>
                    Dropoff: {selectedTrip.dropoffLocation}
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                background: 'rgba(15,23,42,0.86)',
                border: '1px solid rgba(148,163,184,0.16)',
                borderRadius: 24,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: 0.7,
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
                Active Trucks
              </div>

              {liveTrucks.length === 0 ? (
                <div style={{ color: '#94a3b8' }}>No active trucks on map.</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {liveTrucks.map((truck) => {
                    const isSelected = selectedTrip?.orderId === truck.orderId
                    return (
                      <button
                        key={truck.orderId}
                        onClick={() => setSelectedTrip(truck)}
                        style={{
                          textAlign: 'left',
                          background: 'rgba(2,6,23,0.5)',
                          border: isSelected
                            ? '1px solid rgba(56,189,248,0.45)'
                            : '1px solid rgba(148,163,184,0.12)',
                          borderRadius: 16,
                          padding: 14,
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: 15 }}>{truck.truckId}</div>
                        <div style={{ color: '#cbd5e1', marginTop: 6 }}>{truck.orderNumber}</div>
                        <div style={{ color: '#94a3b8', marginTop: 6, fontSize: 13 }}>
                          {truck.clientName}
                        </div>
                        <div
                          style={{
                            color: getStatusColor(truck.status),
                            marginTop: 6,
                            fontSize: 13,
                            fontWeight: 800,
                          }}
                        >
                          Status: {truck.status}
                        </div>
                        <div style={{ color: '#94a3b8', marginTop: 6, fontSize: 13 }}>
                          ETA: {truck.etaMin} min
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div
              style={{
                background: 'rgba(15,23,42,0.86)',
                border: '1px solid rgba(148,163,184,0.16)',
                borderRadius: 24,
                padding: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: 0.7,
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
                Fleet Summary
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ color: '#e2e8f0' }}>Tracked trucks: {liveTrucks.length}</div>
                <div style={{ color: '#e2e8f0' }}>
                  Assigned: {orders.filter((o) => normalizeStatus(o.status) === 'Assigned').length}
                </div>
                <div style={{ color: '#e2e8f0' }}>
                  Dispatched: {orders.filter((o) => normalizeStatus(o.status) === 'Dispatched').length}
                </div>
                <div style={{ color: '#e2e8f0' }}>
                  In transit: {orders.filter((o) => normalizeStatus(o.status) === 'In Transit').length}
                </div>
                <div style={{ color: '#e2e8f0' }}>Delivered: {deliveredCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}