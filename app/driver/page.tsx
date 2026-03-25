'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

type TruckRow = {
  id: string
  truck_name: string
  driver_name: string | null
  status: string
  latitude: number
  longitude: number
  current_load?: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
  eta?: string | null
}

type OrderRow = {
  id: string
  load_name: string | null
  pickup_location: string | null
  dropoff_location: string | null
  pickup_lat?: number | null
  pickup_lng?: number | null
  dropoff_lat?: number | null
  dropoff_lng?: number | null
  status: string | null
  assigned_truck_id: string | null
  driver_response?: string | null
  created_at?: string
}

export default function DriverApp() {
  const [fleet, setFleet] = useState<TruckRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [selectedTruck, setSelectedTruck] = useState<TruckRow | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [autoState, setAutoState] = useState('Waiting')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadData()

    const fleetChannel = supabase
      .channel('driver-fleet-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fleet' },
        () => loadData()
      )
      .subscribe()

    const ordersChannel = supabase
      .channel('driver-orders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => loadData()
      )
      .subscribe()

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      supabase.removeChannel(fleetChannel)
      supabase.removeChannel(ordersChannel)
    }
  }, [])

  async function loadData() {
    const { data: fleetData } = await supabase
      .from('fleet')
      .select('*')
      .order('truck_name', { ascending: true })

    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    const trucks = (fleetData || []) as TruckRow[]
    const loads = (ordersData || []) as OrderRow[]

    setFleet(trucks)
    setOrders(loads)

    if (selectedTruck) {
      const freshTruck = trucks.find((t) => t.id === selectedTruck.id) || null
      setSelectedTruck(freshTruck)
    }
  }

  const selectedOrder = useMemo(() => {
    if (!selectedTruck) return null

    return (
      orders.find(
        (order) =>
          order.assigned_truck_id === selectedTruck.id &&
          order.status !== 'delivered'
      ) || null
    )
  }, [orders, selectedTruck])

  function handleSelect(id: string) {
    const truck = fleet.find((t) => t.id === id) || null
    setSelectedTruck(truck)
  }

  function getDistance(aLat: number, aLng: number, bLat: number, bLng: number) {
    const dx = aLat - bLat
    const dy = aLng - bLng
    return Math.sqrt(dx * dx + dy * dy)
  }

  async function updateStatus(status: string) {
    if (!selectedTruck) return

    await supabase
      .from('fleet')
      .update({ status })
      .eq('id', selectedTruck.id)
  }

  async function acceptLoad() {
    if (!selectedTruck || !selectedOrder) return

    await supabase
      .from('orders')
      .update({
        driver_response: 'accepted',
        status: 'assigned',
      })
      .eq('id', selectedOrder.id)

    await supabase
      .from('fleet')
      .update({
        status: 'assigned',
        eta: 'Driver Accepted',
      })
      .eq('id', selectedTruck.id)
  }

  async function rejectLoad() {
    if (!selectedTruck || !selectedOrder) return

    await supabase
      .from('orders')
      .update({
        driver_response: 'rejected',
        status: 'pending',
      })
      .eq('id', selectedOrder.id)

    await supabase
      .from('fleet')
      .update({
        status: 'idle',
        current_load: null,
        pickup_location: null,
        dropoff_location: null,
        destination: null,
        eta: 'Rejected - Reassigning',
      })
      .eq('id', selectedTruck.id)

    await aiRedispatch(selectedOrder)
  }

  async function aiRedispatch(order: OrderRow) {
    const { data: trucks } = await supabase.from('fleet').select('*')
    if (!trucks) return

    const available = trucks.filter(
      (t: any) => t.status === 'idle' && typeof t.latitude === 'number'
    )

    if (!available.length) return

    const pickupLat = order.pickup_lat ?? 35.48
    const pickupLng = order.pickup_lng ?? -97.5

    const ranked = available.map((truck: any) => ({
      truck,
      score: getDistance(truck.latitude, truck.longitude, pickupLat, pickupLng),
    }))

    ranked.sort((a, b) => a.score - b.score)

    const best = ranked[0]?.truck
    if (!best) return

    await supabase
      .from('orders')
      .update({
        assigned_truck_id: best.id,
        driver_response: 'pending',
        status: 'assigned',
      })
      .eq('id', order.id)

    await supabase
      .from('fleet')
      .update({
        status: 'assigned',
        current_load: order.load_name,
        pickup_location: order.pickup_location,
        dropoff_location: order.dropoff_location,
        destination: order.dropoff_location,
        eta: 'AI Reassigned',
      })
      .eq('id', best.id)
  }

  async function startJob() {
    if (!selectedTruck || !selectedOrder) return

    await supabase
      .from('fleet')
      .update({
        status: 'delivering',
        eta: 'En Route To Pickup',
      })
      .eq('id', selectedTruck.id)
  }

  async function markDelivered() {
    if (!selectedTruck || !selectedOrder) return

    await supabase
      .from('orders')
      .update({
        status: 'delivered',
        driver_response: 'accepted',
      })
      .eq('id', selectedOrder.id)

    await supabase
      .from('fleet')
      .update({
        status: 'idle',
        current_load: null,
        pickup_location: null,
        dropoff_location: null,
        destination: null,
        eta: 'N/A',
      })
      .eq('id', selectedTruck.id)

    setAutoState('Delivered')
  }

  async function updateTruckCoords(lat: number, lng: number, etaText?: string) {
    if (!selectedTruck) return

    await supabase
      .from('fleet')
      .update({
        latitude: lat,
        longitude: lng,
        eta: etaText || 'Live GPS Active',
      })
      .eq('id', selectedTruck.id)
  }

  async function runAutoArrival(
    truckId: string,
    order: OrderRow,
    lat: number,
    lng: number
  ) {
    const pickupLat = order.pickup_lat ?? 35.48
    const pickupLng = order.pickup_lng ?? -97.5
    const dropoffLat = order.dropoff_lat ?? 35.52
    const dropoffLng = order.dropoff_lng ?? -97.48

    const pickupDistance = getDistance(lat, lng, pickupLat, pickupLng)
    const dropoffDistance = getDistance(lat, lng, dropoffLat, dropoffLng)

    if (order.status === 'assigned' && pickupDistance < 0.01) {
      await supabase
        .from('orders')
        .update({ status: 'at_pickup' })
        .eq('id', order.id)

      await supabase
        .from('fleet')
        .update({ eta: 'Arrived At Pickup', status: 'delivering' })
        .eq('id', truckId)

      setAutoState('Arrived at pickup')
      return 'pickup'
    }

    if (order.status === 'at_pickup' && pickupDistance > 0.015) {
      await supabase
        .from('orders')
        .update({ status: 'in_transit' })
        .eq('id', order.id)

      await supabase
        .from('fleet')
        .update({ eta: 'Loaded - En Route To Dropoff', status: 'delivering' })
        .eq('id', truckId)

      setAutoState('Picked up and leaving pickup')
      return 'transit'
    }

    if (
      (order.status === 'in_transit' || order.status === 'delivering' || order.status === 'at_pickup') &&
      dropoffDistance < 0.01
    ) {
      await supabase
        .from('orders')
        .update({ status: 'delivered', driver_response: 'accepted' })
        .eq('id', order.id)

      await supabase
        .from('fleet')
        .update({
          status: 'idle',
          current_load: null,
          pickup_location: null,
          dropoff_location: null,
          destination: null,
          eta: 'Delivered',
        })
        .eq('id', truckId)

      setAutoState('Delivered automatically')
      stopLiveGpsInternal()
      return 'delivered'
    }

    return null
  }

  function moveToward(
    currentLat: number,
    currentLng: number,
    targetLat: number,
    targetLng: number,
    step = 0.0035
  ) {
    const dLat = targetLat - currentLat
    const dLng = targetLng - currentLng
    const dist = Math.sqrt(dLat * dLat + dLng * dLng)

    if (dist <= step) {
      return { lat: targetLat, lng: targetLng }
    }

    const ratio = step / dist
    return {
      lat: currentLat + dLat * ratio,
      lng: currentLng + dLng * ratio,
    }
  }

  function stopLiveGpsInternal() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsTracking(false)
  }

  function startLiveGps() {
    if (!selectedTruck || !selectedOrder) return
    if (intervalRef.current) clearInterval(intervalRef.current)

    setIsTracking(true)
    setAutoState('Starting route logic')

    let lat = selectedTruck.latitude
    let lng = selectedTruck.longitude

    intervalRef.current = setInterval(async () => {
      const orderStatus = selectedOrder.status || 'assigned'

      const pickupLat = selectedOrder.pickup_lat ?? 35.48
      const pickupLng = selectedOrder.pickup_lng ?? -97.5
      const dropoffLat = selectedOrder.dropoff_lat ?? 35.52
      const dropoffLng = selectedOrder.dropoff_lng ?? -97.48

      const target =
        orderStatus === 'assigned'
          ? { lat: pickupLat, lng: pickupLng, eta: 'Heading to Pickup' }
          : orderStatus === 'at_pickup'
          ? { lat: pickupLat + 0.02, lng: pickupLng + 0.02, eta: 'Leaving Pickup' }
          : { lat: dropoffLat, lng: dropoffLng, eta: 'Heading to Dropoff' }

      const moved = moveToward(lat, lng, target.lat, target.lng)
      lat = moved.lat
      lng = moved.lng

      await updateTruckCoords(lat, lng, target.eta)
      await runAutoArrival(selectedTruck.id, selectedOrder, lat, lng)
      await loadData()
    }, 3000)
  }

  function stopLiveGps() {
    stopLiveGpsInternal()
    setAutoState('Tracking stopped')
  }

  async function useBrowserGps() {
    if (!selectedTruck) return
    if (!navigator.geolocation) {
      alert('Geolocation is not supported on this device/browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        await supabase
          .from('fleet')
          .update({
            latitude: lat,
            longitude: lng,
            eta: 'GPS Updated From Device',
          })
          .eq('id', selectedTruck.id)

        if (selectedOrder) {
          await runAutoArrival(selectedTruck.id, selectedOrder, lat, lng)
        }
      },
      () => {
        alert('Location access was denied or unavailable.')
      },
      { enableHighAccuracy: true }
    )
  }

  function responseColor(response?: string | null) {
    if (response === 'accepted') return '#22c55e'
    if (response === 'rejected') return '#ef4444'
    return '#facc15'
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #020617, #0f172a)',
        color: 'white',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(15,23,42,0.95)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>🚛 Driver App</h2>
        <p style={{ color: '#94a3b8' }}>
          Accept loads, send live GPS, and auto-complete pickups and deliveries
        </p>

        <select
          onChange={(e) => handleSelect(e.target.value)}
          value={selectedTruck?.id || ''}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            marginTop: '10px',
            marginBottom: '20px',
            background: '#020617',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <option value="">Choose your truck</option>
          {fleet.map((truck) => (
            <option key={truck.id} value={truck.id}>
              {truck.truck_name} - {truck.driver_name || 'Unassigned'}
            </option>
          ))}
        </select>

        {selectedTruck && (
          <div
            style={{
              background: '#020617',
              padding: '15px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{selectedTruck.truck_name}</h3>
            <p>Driver: {selectedTruck.driver_name || 'Unassigned'}</p>
            <p>Status: <strong>{selectedTruck.status}</strong></p>
            <p>Coordinates: {selectedTruck.latitude}, {selectedTruck.longitude}</p>
            <p>ETA: {selectedTruck.eta || 'N/A'}</p>

            <div
              style={{
                marginTop: '16px',
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>
                ASSIGNED LOAD
              </div>

              {selectedOrder ? (
                <>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>
                    {selectedOrder.load_name || 'Untitled Load'}
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    Pickup: {selectedOrder.pickup_location || 'N/A'}
                  </div>

                  <div style={{ marginTop: '4px' }}>
                    Dropoff: {selectedOrder.dropoff_location || 'N/A'}
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
                      fontWeight: 800,
                      color: responseColor(selectedOrder.driver_response),
                    }}
                  >
                    Driver Response: {(selectedOrder.driver_response || 'pending').toUpperCase()}
                  </div>

                  <div style={{ marginTop: '8px', color: '#7dd3fc', fontWeight: 700 }}>
                    Order Status: {(selectedOrder.status || 'unknown').toUpperCase()}
                  </div>

                  <div style={{ marginTop: '8px', color: '#22c55e', fontWeight: 700 }}>
                    Auto Logic: {autoState}
                  </div>
                </>
              ) : (
                <div style={{ color: '#94a3b8' }}>No load assigned.</div>
              )}
            </div>

            {selectedOrder && (
              <div style={{ display: 'grid', gap: '10px', marginTop: '15px' }}>
                <button onClick={acceptLoad} style={btn('#22c55e', 'black')}>
                  Accept Load
                </button>

                <button onClick={rejectLoad} style={btn('#ef4444', 'white')}>
                  Reject Load
                </button>

                <button onClick={startJob} style={btn('#2563eb', 'white')}>
                  Start Job
                </button>

                <button onClick={markDelivered} style={btn('#14b8a6', 'white')}>
                  Manual Deliver
                </button>
              </div>
            )}

            <div style={{ display: 'grid', gap: '10px', marginTop: '15px' }}>
              <button onClick={() => updateStatus('idle')} style={btn('#facc15', 'black')}>
                Set Idle
              </button>

              <button onClick={() => updateStatus('delayed')} style={btn('#ef4444', 'white')}>
                Report Delay
              </button>

              <button onClick={startLiveGps} style={btn('#2563eb', 'white')}>
                Start Auto Route GPS
              </button>

              <button onClick={stopLiveGps} style={btn('#64748b', 'white')}>
                Stop GPS
              </button>

              <button onClick={useBrowserGps} style={btn('#a855f7', 'white')}>
                Use Phone GPS
              </button>
            </div>

            <div style={{ marginTop: '12px', color: isTracking ? '#22c55e' : '#94a3b8' }}>
              {isTracking ? 'Live GPS tracking is running' : 'Live GPS tracking is stopped'}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function btn(background: string, color: string): React.CSSProperties {
  return {
    background,
    color,
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    fontWeight: 700,
    cursor: 'pointer',
  }
}