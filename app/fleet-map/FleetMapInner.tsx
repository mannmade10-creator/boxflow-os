'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  alerts: string[]
}

type DemoMode = 'admin' | 'client' | 'driver'

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

function getFallbackRoute(currentLng: number, currentLat: number) {
  return [
    [currentLng, currentLat],
    [currentLng + 0.01, currentLat + 0.01],
  ]
}

function sanitizeRouteGeometry(
  routeGeometry: unknown,
  currentLng: number,
  currentLat: number
): number[][] {
  if (!Array.isArray(routeGeometry)) {
    return getFallbackRoute(currentLng, currentLat)
  }

  const cleaned = routeGeometry
    .filter((point) => Array.isArray(point) && point.length >= 2)
    .map((point) => [Number(point[0]), Number(point[1])])
    .filter(
      (point) =>
        Number.isFinite(point[0]) &&
        Number.isFinite(point[1]) &&
        Math.abs(point[0]) <= 180 &&
        Math.abs(point[1]) <= 90
    )

  if (cleaned.length < 2) {
    return getFallbackRoute(currentLng, currentLat)
  }

  return cleaned
}

function buildAlerts(
  status: string,
  priority: string,
  etaMin: number,
  distanceKmValue: number
) {
  const alerts: string[] = []

  if (String(priority).toLowerCase().includes('rush') || String(priority).toLowerCase().includes('urgent')) {
    alerts.push('Priority')
  }

  if (status === 'Dispatched') {
    alerts.push('Queued')
  }

  if (status === 'In Transit') {
    alerts.push('Moving')
  }

  if (etaMin > 180) {
    alerts.push('Long Route')
  }

  if (distanceKmValue > 250) {
    alerts.push('National')
  }

  if (status === 'Delivered') {
    alerts.push('Complete')
  }

  return alerts
}

function buildLiveTruck(row: OrderRow): LiveTruck | null {
  const currentLat = normalizeNumber(row.truck_lat)
  const currentLng = normalizeNumber(row.truck_lng)

  if (currentLat === null || currentLng === null) return null

  const status = normalizeStatus(row.status)
  if (status === 'Pending' || status === 'Delivered') return null

  const routeGeometry = sanitizeRouteGeometry(row.route_geometry, currentLng, currentLat)
  const lastPoint = routeGeometry[routeGeometry.length - 1] || [currentLng, currentLat]
  const targetLng = Number(lastPoint[0])
  const targetLat = Number(lastPoint[1])

  const km = distanceKm(currentLat, currentLng, targetLat, targetLng)
  const eta = Math.max(1, Math.round(km * 2.5))
  const priority = row.priority || 'Standard'

  return {
    orderId: row.id,
    orderNumber: row.order_number || `ORD-${row.id.slice(0, 8)}`,
    loadName: row.load_name || `Order ${row.id}`,
    truckId: row.assigned_truck_id || 'Unassigned',
    clientName: row.client_name || 'No client',
    status,
    priority,
    pickupLocation: row.pickup_location || 'N/A',
    dropoffLocation: row.dropoff_location || 'N/A',
    currentLat,
    currentLng,
    etaMin: eta,
    distanceKm: Number(km.toFixed(1)),
    routeGeometry,
    alerts: buildAlerts(status, priority, eta, km),
  }
}

function alertBadgeStyle(label: string): React.CSSProperties {
  const lower = label.toLowerCase()

  if (lower.includes('priority')) {
    return {
      background: 'rgba(239,68,68,0.14)',
      color: '#fca5a5',
      border: '1px solid rgba(239,68,68,0.28)',
    }
  }

  if (lower.includes('moving')) {
    return {
      background: 'rgba(14,165,233,0.14)',
      color: '#7dd3fc',
      border: '1px solid rgba(14,165,233,0.28)',
    }
  }

  if (lower.includes('queued')) {
    return {
      background: 'rgba(245,158,11,0.14)',
      color: '#fcd34d',
      border: '1px solid rgba(245,158,11,0.28)',
    }
  }

  if (lower.includes('complete')) {
    return {
      background: 'rgba(34,197,94,0.14)',
      color: '#86efac',
      border: '1px solid rgba(34,197,94,0.28)',
    }
  }

  return {
    background: 'rgba(59,130,246,0.14)',
    color: '#93c5fd',
    border: '1px solid rgba(59,130,246,0.28)',
  }
}

export default function FleetMapInner({ embedded = false }: { embedded?: boolean }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<Record<string, mapboxgl.Marker>>({})
  const [mapReady, setMapReady] = useState(false)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [selectedTrip, setSelectedTrip] = useState<LiveTruck | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'local' | 'national'>('local')
  const [demoMode, setDemoMode] = useState<DemoMode>('admin')
  const [clientFilter, setClientFilter] = useState('Retail Packaging Co')
  const [driverFilter, setDriverFilter] = useState('TRK-305')
  const [optimizeMessage, setOptimizeMessage] = useState<string | null>(null)
  const [optimizedTripId, setOptimizedTripId] = useState<string | null>(null)

  const allLiveTrucks = useMemo(() => {
    return orders
      .map((row) => buildLiveTruck(row))
      .filter((truck): truck is LiveTruck => truck !== null)
  }, [orders])

  const visibleTrucks = useMemo(() => {
    if (demoMode === 'client') {
      return allLiveTrucks.filter((truck) => truck.clientName === clientFilter)
    }

    if (demoMode === 'driver') {
      return allLiveTrucks.filter((truck) => truck.truckId === driverFilter)
    }

    return allLiveTrucks
  }, [allLiveTrucks, demoMode, clientFilter, driverFilter])

  const deliveredCount = useMemo(() => {
    return orders.filter((o) => normalizeStatus(o.status) === 'Delivered').length
  }, [orders])

  const movingCount = useMemo(() => {
    return orders.filter((o) => normalizeStatus(o.status) === 'In Transit').length
  }, [orders])

  const priorityCount = useMemo(() => {
    return visibleTrucks.filter((truck) =>
      String(truck.priority).toLowerCase().match(/rush|urgent/)
    ).length
  }, [visibleTrucks])

  const uniqueClients = useMemo(() => {
    return Array.from(new Set(allLiveTrucks.map((truck) => truck.clientName))).filter(Boolean)
  }, [allLiveTrucks])

  const uniqueDrivers = useMemo(() => {
    return Array.from(new Set(allLiveTrucks.map((truck) => truck.truckId))).filter(Boolean)
  }, [allLiveTrucks])

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
      .channel('fleet-phase-20-live')
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
    if (!selectedTrip && visibleTrucks.length > 0) {
      setSelectedTrip(visibleTrucks[0])
      return
    }

    if (selectedTrip) {
      const refreshed = visibleTrucks.find((truck) => truck.orderId === selectedTrip.orderId)
      if (refreshed) {
        setSelectedTrip(refreshed)
      } else {
        setSelectedTrip(visibleTrucks[0] || null)
      }
    }
  }, [visibleTrucks, selectedTrip])

  useEffect(() => {
    if (demoMode === 'client' && uniqueClients.length > 0 && !uniqueClients.includes(clientFilter)) {
      setClientFilter(uniqueClients[0])
    }
  }, [demoMode, uniqueClients, clientFilter])

  useEffect(() => {
    if (demoMode === 'driver' && uniqueDrivers.length > 0 && !uniqueDrivers.includes(driverFilter)) {
      setDriverFilter(uniqueDrivers[0])
    }
  }, [demoMode, uniqueDrivers, driverFilter])

  useEffect(() => {
    if (!mapReady) return
    const map = mapRef.current
    if (!map) return

    Object.values(markersRef.current).forEach((marker) => marker.remove())
    markersRef.current = {}

    const keepLayerIds = visibleTrucks.map((t) => `route-layer-${t.orderId}`)
    const keepSourceIds = visibleTrucks.map((t) => `route-source-${t.orderId}`)

    visibleTrucks.forEach((truck) => {
      const sourceId = `route-source-${truck.orderId}`
      const layerId = `route-layer-${truck.orderId}`
      const isSelected = selectedTrip?.orderId === truck.orderId
      const isOptimized = optimizedTripId === truck.orderId

      if (map.getLayer(layerId)) map.removeLayer(layerId)
      if (map.getSource(sourceId)) map.removeSource(sourceId)

      const routeGeometry = sanitizeRouteGeometry(
        truck.routeGeometry,
        truck.currentLng,
        truck.currentLat
      )

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: routeGeometry,
          },
          properties: {},
        },
      })

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': isOptimized ? '#22c55e' : isSelected ? '#38bdf8' : '#60a5fa',
          'line-width': isOptimized ? 7 : isSelected ? 6 : 3,
          'line-opacity': isSelected || isOptimized ? 0.95 : 0.45,
        },
      })

      const el = document.createElement('div')
      el.className = 'truck-marker'
      el.style.width = isSelected ? '74px' : demoMode === 'driver' ? '72px' : '56px'
      el.style.height = isSelected ? '74px' : demoMode === 'driver' ? '72px' : '56px'
      el.style.zIndex = isSelected ? '9999' : '999'
      el.style.filter = isSelected
        ? 'drop-shadow(0 0 18px rgba(56,189,248,0.95)) drop-shadow(0 10px 20px rgba(0,0,0,0.7))'
        : isOptimized
        ? 'drop-shadow(0 0 14px rgba(34,197,94,0.85)) drop-shadow(0 10px 20px rgba(0,0,0,0.7))'
        : 'drop-shadow(0 10px 20px rgba(0,0,0,0.7))'
      el.style.backgroundImage =
        truck.truckId === 'TRK-305'
          ? 'url("/truck-yellow.png")'
          : 'url("/truck-blue.png")'
      el.style.backgroundSize = 'contain'
      el.style.backgroundRepeat = 'no-repeat'
      el.style.backgroundPosition = 'center'
      el.style.cursor = 'pointer'
      el.style.transition = 'all 0.2s ease'

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
        setViewMode('local')
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

    if (selectedTrip && viewMode === 'local') {
      const truck = visibleTrucks.find((item) => item.orderId === selectedTrip.orderId)
      if (truck) {
        const localBounds = new mapboxgl.LngLatBounds()
        localBounds.extend([truck.currentLng, truck.currentLat])

        truck.routeGeometry.forEach((point) => {
          if (Array.isArray(point) && point.length >= 2) {
            localBounds.extend([Number(point[0]), Number(point[1])])
          }
        })

        if (!localBounds.isEmpty()) {
          map.fitBounds(localBounds, {
            padding: demoMode === 'driver' ? 160 : 120,
            maxZoom: demoMode === 'driver' ? 10.8 : 9.8,
            duration: 900,
          })
          return
        }
      }
    }

    const nationalBounds = new mapboxgl.LngLatBounds()
    visibleTrucks.forEach((truck) => {
      nationalBounds.extend([truck.currentLng, truck.currentLat])
      truck.routeGeometry.forEach((point) => {
        if (Array.isArray(point) && point.length >= 2) {
          nationalBounds.extend([Number(point[0]), Number(point[1])])
        }
      })
    })

    if (!nationalBounds.isEmpty()) {
      map.fitBounds(nationalBounds, {
        padding: 80,
        maxZoom: viewMode === 'national' ? 7.2 : 9.2,
        duration: 1200,
      })
    }
  }, [mapReady, visibleTrucks, selectedTrip, viewMode, demoMode, optimizedTripId])

  function handleOptimizeRoute() {
    if (!selectedTrip) return

    const fasterEta = Math.max(1, Math.round(selectedTrip.etaMin * 0.82))
    setOptimizedTripId(selectedTrip.orderId)
    setOptimizeMessage(
      `${selectedTrip.truckId} optimized. ETA improved from ${selectedTrip.etaMin} min to ${fasterEta} min.`
    )

    setTimeout(() => {
      setOptimizeMessage(null)
    }, 4500)
  }

  const visibleSummaryLabel =
    demoMode === 'client'
      ? `Client: ${clientFilter}`
      : demoMode === 'driver'
      ? `Driver: ${driverFilter}`
      : 'All Operations'

  return (
    <main style={{ height: "100%", background: "#020617", color: "#fff", padding: 0, overflow: "hidden", position: "relative" }}
    >
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        

        <div
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            
            
            
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
          </div>

          <div
            style={{
              display: 'grid',
              gap: 16,
              maxHeight: demoMode === 'driver' ? '82vh' : '80vh',
              overflowY: 'auto',
            }}
          >
            <div style={panelStyle}>
              <div style={sectionLabel}>Mode Snapshot</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={summaryRow}>
                  <span style={summaryLabel}>Viewing</span>
                  <span style={summaryValue}>{visibleSummaryLabel}</span>
                </div>
                <div style={summaryRow}>
                  <span style={summaryLabel}>Visible Trucks</span>
                  <span style={summaryValue}>{visibleTrucks.length}</span>
                </div>
                <div style={summaryRow}>
                  <span style={summaryLabel}>In Transit</span>
                  <span style={summaryValue}>{movingCount}</span>
                </div>
                <div style={summaryRow}>
                  <span style={summaryLabel}>Priority Loads</span>
                  <span style={summaryValue}>{priorityCount}</span>
                </div>
                <div style={summaryRow}>
                  <span style={summaryLabel}>Delivered</span>
                  <span style={summaryValue}>{deliveredCount}</span>
                </div>
              </div>
            </div>

            <div
              style={{
                ...panelStyle,
                border:
                  demoMode === 'driver'
                    ? '1px solid rgba(34,197,94,0.22)'
                    : '1px solid rgba(148,163,184,0.16)',
              }}
            >
              <div style={sectionLabel}>
                {demoMode === 'driver' ? 'Driver Live Card' : 'Selected Trip'}
              </div>

              {!selectedTrip ? (
                <div style={{ color: '#94a3b8' }}>Select an active truck.</div>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ fontSize: demoMode === 'driver' ? 34 : 28, fontWeight: 900 }}>
                    {selectedTrip.truckId}
                  </div>
                  <div style={{ color: '#cbd5e1', fontWeight: 800 }}>
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

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                    {selectedTrip.alerts.map((alert) => (
                      <span
                        key={alert}
                        style={{
                          ...alertBadgeStyle(alert),
                          borderRadius: 999,
                          padding: '6px 10px',
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {alert}
                      </span>
                    ))}
                  </div>

                  {demoMode === 'driver' ? (
                    <div
                      style={{
                        marginTop: 8,
                        background: 'rgba(34,197,94,0.12)',
                        border: '1px solid rgba(34,197,94,0.22)',
                        borderRadius: 16,
                        padding: 14,
                        color: '#bbf7d0',
                        fontWeight: 700,
                      }}
                    >
                      Driver mobile mode is active. This view is stripped down for road use and focused on one assigned truck.
                    </div>
                  ) : null}

                  {demoMode === 'client' ? (
                    <div
                      style={{
                        marginTop: 8,
                        background: 'rgba(59,130,246,0.12)',
                        border: '1px solid rgba(59,130,246,0.22)',
                        borderRadius: 16,
                        padding: 14,
                        color: '#bfdbfe',
                        fontWeight: 700,
                      }}
                    >
                      Client mode only shows loads and routes for the selected customer account.
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div style={panelStyle}>
              <div style={sectionLabel}>
                {demoMode === 'driver' ? 'Assigned Truck Feed' : 'Active Trucks'}
              </div>

              {visibleTrucks.length === 0 ? (
                <div style={{ color: '#94a3b8' }}>No active trucks in this view.</div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {visibleTrucks.map((truck) => {
                    const isSelected = selectedTrip?.orderId === truck.orderId
                    const isOptimized = optimizedTripId === truck.orderId

                    return (
                      <button
                        key={truck.orderId}
                        onClick={() => {
                          setSelectedTrip(truck)
                          setViewMode('local')
                        }}
                        style={{
                          textAlign: 'left',
                          background: 'rgba(2,6,23,0.5)',
                          border: isSelected
                            ? '1px solid rgba(56,189,248,0.45)'
                            : isOptimized
                            ? '1px solid rgba(34,197,94,0.35)'
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

                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                          {truck.alerts.slice(0, 3).map((alert) => (
                            <span
                              key={alert}
                              style={{
                                ...alertBadgeStyle(alert),
                                borderRadius: 999,
                                padding: '4px 8px',
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              {alert}
                            </span>
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.86)',
  border: '1px solid rgba(148,163,184,0.16)',
  borderRadius: 24,
  padding: 18,
  boxShadow: '0 18px 48px rgba(0,0,0,0.25)',
}

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 999,
  padding: '8px 12px',
  background: 'rgba(59,130,246,0.14)',
  border: '1px solid rgba(59,130,246,0.3)',
  color: '#93c5fd',
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
}

const sectionLabel: React.CSSProperties = {
  fontSize: 12,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: 0.7,
  marginBottom: 14,
  fontWeight: 700,
}

const topBtn: React.CSSProperties = {
  border: '1px solid rgba(148,163,184,0.25)',
  background: 'rgba(15,23,42,0.88)',
  color: '#fff',
  borderRadius: 12,
  padding: '12px 16px',
  fontWeight: 700,
  cursor: 'pointer',
}

const activeTopBtn: React.CSSProperties = {
  border: '1px solid rgba(59,130,246,0.35)',
  background: '#2563eb',
  color: '#fff',
  borderRadius: 12,
  padding: '12px 16px',
  fontWeight: 800,
  cursor: 'pointer',
}

const modeBtn: React.CSSProperties = {
  border: '1px solid rgba(148,163,184,0.25)',
  background: 'rgba(15,23,42,0.88)',
  color: '#fff',
  borderRadius: 12,
  padding: '10px 14px',
  fontWeight: 700,
  cursor: 'pointer',
}

const activeModeBtn: React.CSSProperties = {
  border: '1px solid rgba(168,85,247,0.35)',
  background: 'rgba(168,85,247,0.2)',
  color: '#f3e8ff',
  borderRadius: 12,
  padding: '10px 14px',
  fontWeight: 800,
  cursor: 'pointer',
}

const optimizeBtn: React.CSSProperties = {
  border: '1px solid rgba(34,197,94,0.35)',
  background: 'rgba(34,197,94,0.2)',
  color: '#bbf7d0',
  borderRadius: 12,
  padding: '12px 16px',
  fontWeight: 800,
  cursor: 'pointer',
}

const selectStyle: React.CSSProperties = {
  border: '1px solid rgba(148,163,184,0.25)',
  background: 'rgba(15,23,42,0.88)',
  color: '#fff',
  borderRadius: 12,
  padding: '10px 14px',
  fontWeight: 700,
  outline: 'none',
}

const successStyle: React.CSSProperties = {
  background: 'rgba(20,83,45,0.32)',
  border: '1px solid rgba(74,222,128,0.28)',
  color: '#bbf7d0',
  borderRadius: 16,
  padding: 14,
  marginBottom: 14,
}

const errorStyle: React.CSSProperties = {
  background: 'rgba(127,29,29,0.28)',
  border: '1px solid rgba(248,113,113,0.36)',
  color: '#fecaca',
  borderRadius: 16,
  padding: 14,
  marginBottom: 14,
}

const summaryRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
  padding: '10px 0',
  borderBottom: '1px solid rgba(148,163,184,0.08)',
}

const summaryLabel: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: 14,
}

const summaryValue: React.CSSProperties = {
  color: '#fff',
  fontSize: 16,
  fontWeight: 800,
}
