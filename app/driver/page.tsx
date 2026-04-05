'use client'

import React, { useEffect, useMemo, useState } from 'react'
import AppSidebar from '@/components/AppSidebar'
import { supabase } from '@/lib/supabase'

type OrderRow = {
  id: string
  load_name?: string | null
  client_name?: string | null
  assigned_truck_id?: string | null
  truck_lat?: number | null
  truck_lng?: number | null
  status?: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
}

type DriverTruck = {
  id: string
  name: string
  lat: number
  lng: number
}

const TRUCKS: DriverTruck[] = [
  { id: 'TRK-201', name: 'Blue Truck 201', lat: 35.4676, lng: -97.5164 },
  { id: 'TRK-305', name: 'Yellow Truck 305', lat: 35.4822, lng: -97.4301 },
  { id: 'TRK-412', name: 'Silver Truck 412', lat: 35.5901, lng: -97.5487 },
  { id: 'TRK-518', name: 'Black Truck 518', lat: 35.3912, lng: -97.5234 },
]

function normalizeNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function normalizeOrder(row: any): OrderRow {
  return {
    id: String(row?.id ?? ''),
    load_name:
      row?.load_name ||
      row?.order_name ||
      row?.name ||
      row?.title ||
      `Order ${row?.id ?? ''}`,
    client_name: row?.client_name || row?.client || null,
    assigned_truck_id:
      row?.assigned_truck_id ||
      row?.truck_id ||
      row?.assigned_truck ||
      row?.truck ||
      null,
    truck_lat: normalizeNumber(row?.truck_lat),
    truck_lng: normalizeNumber(row?.truck_lng),
    status: row?.status || 'Pending',
    pickup_location:
      row?.pickup_location || row?.pickup || row?.origin || row?.from_location || null,
    dropoff_location:
      row?.dropoff_location || row?.dropoff || row?.destination || row?.to_location || null,
  }
}

export default function DriverPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [selectedTruckId, setSelectedTruckId] = useState('TRK-201')
  const [driverName, setDriverName] = useState('Angela Brooks')
  const [tracking, setTracking] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [manualLat, setManualLat] = useState('35.4676')
  const [manualLng, setManualLng] = useState('-97.5164')

  const selectedTruck = useMemo(
    () => TRUCKS.find((t) => t.id === selectedTruckId) || TRUCKS[0],
    [selectedTruckId]
  )

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  )

  async function loadOrders() {
    try {
      setError(null)

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const rows = ((data as any[]) || []).map(normalizeOrder)
      setOrders(rows)

      if (!selectedOrderId && rows.length > 0) {
        setSelectedOrderId(rows[0].id)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load driver orders.')
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('driver-orders-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedOrderId])

  async function pushLocation(lat: number, lng: number, status = 'In Transit') {
    if (!selectedOrderId) {
      setError('Select an order first.')
      return
    }

    setSending(true)
    setError(null)
    setMessage(null)

    try {
      const response = await fetch('/api/fleet/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrderId,
          truckId: selectedTruckId,
          lat,
          lng,
          status,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || 'Failed to update location.')
      }

      setMessage(`Location sent for ${selectedTruckId}.`)
      await loadOrders()
    } catch (err: any) {
      setError(err?.message || 'Failed to send location.')
    } finally {
      setSending(false)
    }
  }

  function startBrowserGpsTracking() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device/browser.')
      return
    }

    setTracking(true)
    setError(null)
    setMessage('GPS tracking started.')

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setManualLat(String(lat))
        setManualLng(String(lng))
        await pushLocation(lat, lng, 'In Transit')
      },
      (geoError) => {
        setError(geoError.message || 'Failed to read GPS position.')
        setTracking(false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      }
    )

    ;(window as any).__boxflowWatchId = watchId
  }

  function stopBrowserGpsTracking() {
    const watchId = (window as any).__boxflowWatchId
    if (watchId !== undefined && watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      ;(window as any).__boxflowWatchId = null
    }
    setTracking(false)
    setMessage('GPS tracking stopped.')
  }

  async function sendManualLocation() {
    const lat = Number(manualLat)
    const lng = Number(manualLng)

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError('Enter valid latitude and longitude.')
      return
    }

    await pushLocation(lat, lng, 'In Transit')
  }

  return (
    
      <main
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top left, rgba(29,78,216,0.18), transparent 22%), linear-gradient(180deg, #050816 0%, #0b1220 100%)',
          color: '#fff',
          padding: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1500,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: 18,
          }}
        >

          <section>
            <div style={{ marginBottom: 18 }}>
              <div style={pillStyle}>Driver GPS Mode</div>
              <h1 style={{ margin: '14px 0 8px', fontSize: 32 }}>Driver Live Tracking</h1>
              <p style={{ margin: 0, color: '#94a3b8' }}>
                Send real truck location updates from device GPS or manual coordinates.
              </p>
            </div>

            {error && <div style={errorStyle}>{error}</div>}
            {message && <div style={successStyle}>{message}</div>}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '420px 1fr',
                gap: 18,
                alignItems: 'start',
              }}
            >
              <section style={panelStyle}>
                <div style={sectionLabel}>Driver Control</div>

                <div style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Driver Name</label>
                    <input
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Truck</label>
                    <select
                      value={selectedTruckId}
                      onChange={(e) => setSelectedTruckId(e.target.value)}
                      style={inputStyle}
                    >
                      {TRUCKS.map((truck) => (
                        <option key={truck.id} value={truck.id}>
                          {truck.id} - {truck.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Assigned Order</label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      style={inputStyle}
                    >
                      {orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          {order.load_name || order.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      onClick={startBrowserGpsTracking}
                      disabled={tracking || sending}
                      style={primaryBtn}
                    >
                      Start Real GPS
                    </button>

                    <button
                      onClick={stopBrowserGpsTracking}
                      disabled={!tracking}
                      style={secondaryBtn}
                    >
                      Stop GPS
                    </button>
                  </div>

                  <div style={{ marginTop: 8, borderTop: '1px solid rgba(148,163,184,0.12)', paddingTop: 14 }}>
                    <div style={sectionLabel}>Manual Backup Mode</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Latitude</label>
                        <input
                          value={manualLat}
                          onChange={(e) => setManualLat(e.target.value)}
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>Longitude</label>
                        <input
                          value={manualLng}
                          onChange={(e) => setManualLng(e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <button
                      onClick={sendManualLocation}
                      disabled={sending}
                      style={{ ...primaryBtn, marginTop: 12 }}
                    >
                      {sending ? 'Sending...' : 'Send Manual Location'}
                    </button>
                  </div>
                </div>
              </section>

              <section style={panelStyle}>
                <div style={sectionLabel}>Current Assignment</div>

                {!selectedOrder ? (
                  <div style={{ color: '#94a3b8' }}>No order selected.</div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={infoCard}>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>
                        {selectedOrder.load_name || selectedOrder.id}
                      </div>
                      <div style={{ color: '#94a3b8', marginTop: 6 }}>
                        {selectedOrder.client_name || 'No client'}
                      </div>
                    </div>

                    <div style={infoCard}>
                      <div style={miniLabel}>Truck</div>
                      <div style={miniValue}>
                        {selectedTruck.id} - {selectedTruck.name}
                      </div>
                    </div>

                    <div style={infoCard}>
                      <div style={miniLabel}>Pickup</div>
                      <div style={miniValue}>{selectedOrder.pickup_location || 'N/A'}</div>
                    </div>

                    <div style={infoCard}>
                      <div style={miniLabel}>Dropoff</div>
                      <div style={miniValue}>{selectedOrder.dropoff_location || 'N/A'}</div>
                    </div>

                    <div style={infoCard}>
                      <div style={miniLabel}>Last Saved Coordinates</div>
                      <div style={miniValue}>
                        {selectedOrder.truck_lat ?? 'N/A'}, {selectedOrder.truck_lng ?? 'N/A'}
                      </div>
                    </div>

                    <div style={infoCard}>
                      <div style={miniLabel}>Status</div>
                      <div style={miniValue}>{selectedOrder.status || 'Pending'}</div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </section>
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  color: '#cbd5e1',
  fontSize: 13,
  fontWeight: 700,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 14,
  border: '1px solid rgba(148,163,184,0.18)',
  background: 'rgba(2,6,23,0.55)',
  color: '#fff',
  padding: '12px 14px',
  outline: 'none',
  fontSize: 14,
}

const primaryBtn: React.CSSProperties = {
  border: '1px solid rgba(59,130,246,0.35)',
  background: '#2563eb',
  color: '#fff',
  borderRadius: 12,
  padding: '12px 16px',
  fontWeight: 800,
  cursor: 'pointer',
}

const secondaryBtn: React.CSSProperties = {
  border: '1px solid rgba(148,163,184,0.22)',
  background: 'rgba(15,23,42,0.88)',
  color: '#fff',
  borderRadius: 12,
  padding: '12px 16px',
  fontWeight: 700,
  cursor: 'pointer',
}

const errorStyle: React.CSSProperties = {
  background: 'rgba(127,29,29,0.28)',
  border: '1px solid rgba(248,113,113,0.36)',
  color: '#fecaca',
  borderRadius: 16,
  padding: 14,
  marginBottom: 14,
}

const successStyle: React.CSSProperties = {
  background: 'rgba(20,83,45,0.32)',
  border: '1px solid rgba(74,222,128,0.28)',
  color: '#bbf7d0',
  borderRadius: 16,
  padding: 14,
  marginBottom: 14,
}

const infoCard: React.CSSProperties = {
  background: 'rgba(2,6,23,0.5)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 16,
  padding: 14,
}

const miniLabel: React.CSSProperties = {
  color: '#64748b',
  fontSize: 12,
  marginBottom: 6,
}

const miniValue: React.CSSProperties = {
  color: '#e2e8f0',
  fontSize: 14,
  fontWeight: 700,
}
