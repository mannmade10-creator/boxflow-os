'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { GoogleMap, useLoadScript, MarkerF, PolylineF, InfoWindowF } from '@react-google-maps/api'
import { supabase } from '@/lib/supabase'

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

type DemoMode = 'admin' | 'client' | 'driver'

const OKC = { lat: 35.4676, lng: -97.5164 }

const DEMO_ORDERS: OrderRow[] = [
  {
    id: 'demo-1',
    order_number: 'ORD-1001',
    load_name: 'Corrugated Load A',
    assigned_truck_id: 'TRK-201',
    truck_lat: 35.4676,
    truck_lng: -97.5164,
    status: 'In Transit',
    client_name: 'Retail Packaging Co',
    pickup_location: 'OKC Hub',
    dropoff_location: 'Edmond Facility',
    priority: 'Standard',
    route_geometry: [[-97.5164, 35.4676], [-97.495, 35.505], [-97.478, 35.548]],
  },
  {
    id: 'demo-2',
    order_number: 'ORD-1002',
    load_name: 'Rush Packaging Load',
    assigned_truck_id: 'TRK-305',
    truck_lat: 35.395,
    truck_lng: -97.58,
    status: 'Dispatched',
    client_name: 'Industrial Paper Group',
    pickup_location: 'South OKC',
    dropoff_location: 'Norman Plant',
    priority: 'Rush',
    route_geometry: [[-97.58, 35.395], [-97.52, 35.36], [-97.44, 35.22]],
  },
  {
    id: 'demo-3',
    order_number: 'ORD-1003',
    load_name: 'Manufacturing Delivery',
    assigned_truck_id: 'TRK-412',
    truck_lat: 35.535,
    truck_lng: -97.62,
    status: 'In Transit',
    client_name: 'Retail Packaging Co',
    pickup_location: 'OKC Hub',
    dropoff_location: 'Yukon Facility',
    priority: 'Urgent',
    route_geometry: [[-97.62, 35.535], [-97.69, 35.51], [-97.74, 35.5]],
  },
]

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#020617' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2563eb' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020617' }] },
]

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
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

function sanitizeRouteGeometry(routeGeometry: unknown, currentLng: number, currentLat: number) {
  if (!Array.isArray(routeGeometry)) return [[currentLng, currentLat], [currentLng + 0.04, currentLat + 0.04]]

  const cleaned = routeGeometry
    .filter((point) => Array.isArray(point) && point.length >= 2)
    .map((point) => [Number(point[0]), Number(point[1])])
    .filter((point) => Number.isFinite(point[0]) && Number.isFinite(point[1]))

  return cleaned.length >= 2 ? cleaned : [[currentLng, currentLat], [currentLng + 0.04, currentLat + 0.04]]
}

function toGooglePath(route: number[][]) {
  return route.map(([lng, lat]) => ({ lat, lng }))
}

function buildLiveTruck(row: OrderRow): LiveTruck | null {
  const currentLat = normalizeNumber(row.truck_lat)
  const currentLng = normalizeNumber(row.truck_lng)
  if (currentLat === null || currentLng === null) return null

  const status = normalizeStatus(row.status)
  if (status === 'Pending' || status === 'Delivered') return null

  const routeGeometry = sanitizeRouteGeometry(row.route_geometry, currentLng, currentLat)
  const lastPoint = routeGeometry[routeGeometry.length - 1] || [currentLng, currentLat]
  const km = distanceKm(currentLat, currentLng, Number(lastPoint[1]), Number(lastPoint[0]))

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
    etaMin: Math.max(1, Math.round(km * 2.5)),
    distanceKm: Number(km.toFixed(1)),
    routeGeometry,
  }
}

export default function FleetMapInner() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  })

  const [orders, setOrders] = useState<OrderRow[]>([])
  const [selectedTrip, setSelectedTrip] = useState<LiveTruck | null>(null)
  const [hoveredTrip, setHoveredTrip] = useState<LiveTruck | null>(null)
  const [panelOpen, setPanelOpen] = useState(true)
  const [viewMode, setViewMode] = useState<'local' | 'national'>('local')
  const [demoMode, setDemoMode] = useState<DemoMode>('admin')
  const [optimizeMessage, setOptimizeMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOrders() {
      try {
        setError(null)
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
        if (error) throw error

        const rows = ((data as any[]) || []).map((row) => ({
          id: String(row.id),
          order_number: row.order_number || null,
          load_name: row.load_name || row.order_name || row.name || `Order ${row.id}`,
          assigned_truck_id: row.assigned_truck_id || row.truck_id || row.assigned_truck || null,
          truck_lat: normalizeNumber(row.truck_lat),
          truck_lng: normalizeNumber(row.truck_lng),
          status: row.status || 'Pending',
          client_name: row.client_name || row.client || null,
          pickup_location: row.pickup_location || row.pickup || row.origin || null,
          dropoff_location: row.dropoff_location || row.dropoff || row.destination || null,
          priority: row.priority || 'Standard',
          route_geometry: Array.isArray(row.route_geometry) ? row.route_geometry : null,
        })) as OrderRow[]

        setOrders(rows.length ? rows : DEMO_ORDERS)
      } catch (err: any) {
        console.error('Fleet map load error:', err)
        setError(err?.message || 'Using demo fleet data.')
        setOrders(DEMO_ORDERS)
      }
    }

    loadOrders()

    const channel = supabase
      .channel('fleet-google-live-redesign')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadOrders())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const allLiveTrucks = useMemo(() => {
    const live = orders.map((row) => buildLiveTruck(row)).filter((truck): truck is LiveTruck => truck !== null)
    return live.length ? live : DEMO_ORDERS.map((row) => buildLiveTruck(row)).filter((truck): truck is LiveTruck => truck !== null)
  }, [orders])

  const visibleTrucks = useMemo(() => {
    if (demoMode === 'driver') return allLiveTrucks.slice(0, 1)
    return allLiveTrucks
  }, [allLiveTrucks, demoMode])

  useEffect(() => {
    if (!selectedTrip && visibleTrucks.length > 0) setSelectedTrip(visibleTrucks[0])
  }, [visibleTrucks, selectedTrip])

  function handleOptimizeRoute() {
    if (!selectedTrip) return
    const fasterEta = Math.max(1, Math.round(selectedTrip.etaMin * 0.82))
    setOptimizeMessage(`${selectedTrip.truckId} optimized. ETA improved from ${selectedTrip.etaMin} min to ${fasterEta} min.`)
    setTimeout(() => setOptimizeMessage(null), 4500)
  }

  if (loadError) return <main style={errorPage}>Google Maps failed to load. Check API key and billing.</main>
  if (!isLoaded) return <main style={errorPage}>Loading Google Fleet Map...</main>

  const activePopup = hoveredTrip || selectedTrip

  return (
    <main style={{ height: '100vh', width: '100%', background: '#020617', color: '#fff', overflow: 'hidden', position: 'relative' }}>
      <div style={topBar}>
        <div>
          <div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 900, letterSpacing: 4 }}>BOXFLOW_OS</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>Fleet Command</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setDemoMode('admin')} style={demoMode === 'admin' ? activeBtn : btn}>Admin</button>
          <button onClick={() => setDemoMode('client')} style={demoMode === 'client' ? activeBtn : btn}>Client</button>
          <button onClick={() => setDemoMode('driver')} style={demoMode === 'driver' ? activeBtn : btn}>Driver</button>
          <button onClick={() => setViewMode(viewMode === 'local' ? 'national' : 'local')} style={btn}>
            {viewMode === 'local' ? 'National View' : 'Local View'}
          </button>
          <button onClick={handleOptimizeRoute} style={optimizeBtn}>AI Optimize</button>
          <a href="/dashboard" style={backBtn}>← Back</a>
        </div>
      </div>

      {error && <div style={errorBanner}>{error}</div>}
      {optimizeMessage && <div style={successBanner}>{optimizeMessage}</div>}

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={selectedTrip ? { lat: selectedTrip.currentLat, lng: selectedTrip.currentLng } : OKC}
        zoom={viewMode === 'national' ? 7 : 10}
        options={{
          styles: darkMapStyle,
          disableDefaultUI: false,
          fullscreenControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          zoomControl: true,
        }}
      >
        {visibleTrucks.map((truck) => {
          const isSelected = selectedTrip?.orderId === truck.orderId
          const path = toGooglePath(truck.routeGeometry)

          return (
            <React.Fragment key={truck.orderId}>
              <PolylineF
                path={path}
                options={{
                  strokeColor: isSelected ? '#22c55e' : '#60a5fa',
                  strokeOpacity: isSelected ? 0.95 : 0.55,
                  strokeWeight: isSelected ? 6 : 4,
                }}
              />

              <MarkerF
                position={{ lat: truck.currentLat, lng: truck.currentLng }}
                onMouseOver={() => setHoveredTrip(truck)}
                onMouseOut={() => setHoveredTrip(null)}
                onClick={() => {
                  setSelectedTrip(truck)
                  setPanelOpen(true)
                }}
                icon={{
                  url: truck.truckId === 'TRK-305' ? '/truck-yellow.png' : '/truck-blue.png',
                  scaledSize: new window.google.maps.Size(isSelected ? 72 : 54, isSelected ? 72 : 54),
                  anchor: new window.google.maps.Point(27, 27),
                }}
              />

              {activePopup?.orderId === truck.orderId && (
                <InfoWindowF
                  position={{ lat: truck.currentLat, lng: truck.currentLng }}
                  onCloseClick={() => {
                    setHoveredTrip(null)
                    setSelectedTrip(null)
                  }}
                >
                  <div style={{ color: '#111', minWidth: 190 }}>
                    <strong>{truck.truckId}</strong>
                    <div>{truck.orderNumber}</div>
                    <div>{truck.clientName}</div>
                    <div>Status: {truck.status}</div>
                    <div>ETA: {truck.etaMin} min</div>
                    <div>Distance: {truck.distanceKm} km</div>
                  </div>
                </InfoWindowF>
              )}
            </React.Fragment>
          )
        })}
      </GoogleMap>

      <div style={telemetryBox}>
        <div style={{ color: '#22c55e', fontWeight: 900 }}>● GEO SYNC ACTIVE</div>
        <div>TRUCKS: {visibleTrucks.length} ACTIVE</div>
        <div>REGION: OKC METRO</div>
      </div>

      <div style={bottomDock}>
        <button style={dockBtn}>⌖ Re-center</button>
        <button style={dockBtn}>⛶ Fit All</button>
        <button style={dockBtn}>▣ Route View</button>
        <button style={dockBtn} onClick={handleOptimizeRoute}>⚡ Optimize</button>
      </div>

      <div style={{ ...rightPanel, right: panelOpen ? 16 : -320 }}>
        <button onClick={() => setPanelOpen(!panelOpen)} style={panelToggle}>
          {panelOpen ? '→' : '←'}
        </button>

        <div style={panelTitle}>Active Fleet <span style={{ color: '#60a5fa' }}>{visibleTrucks.length} Units</span></div>

        <div style={{ display: 'grid', gap: 10 }}>
          {visibleTrucks.map((truck) => (
            <button
              key={truck.orderId}
              onMouseOver={() => setHoveredTrip(truck)}
              onMouseOut={() => setHoveredTrip(null)}
              onClick={() => setSelectedTrip(truck)}
              style={{
                textAlign: 'left',
                background: selectedTrip?.orderId === truck.orderId ? 'rgba(37,99,235,.28)' : 'rgba(15,23,42,.88)',
                border: selectedTrip?.orderId === truck.orderId ? '1px solid rgba(96,165,250,.55)' : '1px solid rgba(148,163,184,.12)',
                borderRadius: 14,
                padding: 12,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <strong>{truck.truckId}</strong>
                <span style={{ color: getStatusColor(truck.status), fontSize: 11, fontWeight: 900 }}>{truck.status}</span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>{truck.orderNumber}</div>
              <div style={{ color: '#cbd5e1', fontSize: 12, marginTop: 4 }}>{truck.clientName}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: '#94a3b8', fontSize: 12 }}>
                <span>ETA {truck.etaMin}m</span>
                <span>{truck.distanceKm} km</span>
              </div>
            </button>
          ))}
        </div>

        {selectedTrip && (
          <div style={{ ...panelCard, marginTop: 14 }}>
            <div style={panelTitle}>Selected Trip</div>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{selectedTrip.truckId}</div>
            <div style={{ color: '#94a3b8' }}>{selectedTrip.pickupLocation} → {selectedTrip.dropoffLocation}</div>
            <div style={{ marginTop: 10, color: '#22c55e', fontWeight: 800 }}>ETA: {selectedTrip.etaMin} min</div>
          </div>
        )}
      </div>
    </main>
  )
}

const errorPage: React.CSSProperties = {
  minHeight: '100vh',
  background: '#020617',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
}

const topBar: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  left: 16,
  right: 16,
  zIndex: 20,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  padding: '14px 18px',
  background: 'rgba(2,6,23,.78)',
  border: '1px solid rgba(148,163,184,.16)',
  borderRadius: 18,
  backdropFilter: 'blur(14px)',
}

const btn: React.CSSProperties = {
  border: '1px solid rgba(148,163,184,.25)',
  background: 'rgba(15,23,42,.88)',
  color: '#fff',
  borderRadius: 10,
  padding: '10px 12px',
  fontWeight: 800,
  cursor: 'pointer',
}

const activeBtn: React.CSSProperties = {
  ...btn,
  background: 'rgba(37,99,235,.8)',
  border: '1px solid rgba(96,165,250,.55)',
}

const optimizeBtn: React.CSSProperties = {
  ...btn,
  background: 'rgba(34,197,94,.18)',
  border: '1px solid rgba(34,197,94,.35)',
  color: '#bbf7d0',
}

const backBtn: React.CSSProperties = {
  ...btn,
  textDecoration: 'none',
}

const telemetryBox: React.CSSProperties = {
  position: 'absolute',
  left: 24,
  bottom: 96,
  zIndex: 20,
  background: 'rgba(2,6,23,.82)',
  border: '1px solid rgba(148,163,184,.18)',
  borderRadius: 16,
  padding: 16,
  color: '#7dd3fc',
  fontSize: 13,
  fontWeight: 800,
  lineHeight: 1.8,
}

const bottomDock: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: 24,
  transform: 'translateX(-50%)',
  zIndex: 20,
  display: 'flex',
  gap: 8,
  padding: 10,
  background: 'rgba(2,6,23,.82)',
  border: '1px solid rgba(148,163,184,.18)',
  borderRadius: 18,
  backdropFilter: 'blur(14px)',
}

const dockBtn: React.CSSProperties = {
  border: 0,
  background: 'transparent',
  color: '#e2e8f0',
  padding: '10px 14px',
  cursor: 'pointer',
  fontWeight: 700,
}

const rightPanel: React.CSSProperties = {
  position: 'absolute',
  top: 100,
  bottom: 24,
  width: 300,
  zIndex: 25,
  transition: 'right .25s ease',
  background: 'rgba(2,6,23,.86)',
  border: '1px solid rgba(148,163,184,.18)',
  borderRadius: 18,
  padding: 14,
  overflowY: 'auto',
  backdropFilter: 'blur(14px)',
}

const panelToggle: React.CSSProperties = {
  position: 'absolute',
  left: -38,
  top: 20,
  width: 38,
  height: 74,
  border: 0,
  borderRadius: '12px 0 0 12px',
  background: '#2563eb',
  color: '#fff',
  fontSize: 20,
  cursor: 'pointer',
}

const panelTitle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 13,
  textTransform: 'uppercase',
  letterSpacing: 1.5,
  color: '#cbd5e1',
  fontWeight: 900,
  marginBottom: 12,
}

const panelCard: React.CSSProperties = {
  background: 'rgba(15,23,42,.88)',
  border: '1px solid rgba(148,163,184,.12)',
  borderRadius: 14,
  padding: 14,
}

const errorBanner: React.CSSProperties = {
  position: 'absolute',
  top: 100,
  left: 20,
  zIndex: 30,
  background: 'rgba(127,29,29,.9)',
  border: '1px solid rgba(248,113,113,.4)',
  color: '#fecaca',
  borderRadius: 14,
  padding: 12,
}

const successBanner: React.CSSProperties = {
  position: 'absolute',
  top: 100,
  left: 20,
  zIndex: 30,
  background: 'rgba(20,83,45,.9)',
  border: '1px solid rgba(74,222,128,.4)',
  color: '#bbf7d0',
  borderRadius: 14,
  padding: 12,
}