'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

type OrderRow = {
  id: string
  load_name: string | null
  pickup_location: string | null
  dropoff_location: string | null
  pickup_lat: number | null
  pickup_lng: number | null
  dropoff_lat: number | null
  dropoff_lng: number | null
  status: string | null
  assigned_truck_id: string | null
  driver_response?: string | null
  created_at?: string
}

type TruckRow = {
  id: string
  truck_name: string
  driver_name: string | null
  status: string
  latitude: number
  longitude: number
  eta?: string | null
  current_load?: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
}

type DispatchHistoryRow = {
  id: string
  order_id: string | null
  truck_id: string | null
  decision_type: string | null
  score: number | null
  notes: string | null
  created_at?: string
}

type TruckScore = {
  truck: TruckRow
  score: number
  distance: number
  notes: string[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [trucks, setTrucks] = useState<TruckRow[]>([])
  const [dispatchHistory, setDispatchHistory] = useState<DispatchHistoryRow[]>([])

  const [loadName, setLoadName] = useState('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [selectedTruckByOrder, setSelectedTruckByOrder] = useState<Record<string, string>>({})
  const [aiPreviewByOrder, setAiPreviewByOrder] = useState<Record<string, TruckScore[]>>({})

  async function loadData() {
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: truckData } = await supabase
      .from('fleet')
      .select('*')
      .order('truck_name', { ascending: true })

    const { data: historyData } = await supabase
      .from('dispatch_history')
      .select('*')
      .order('created_at', { ascending: false })

    setOrders((orderData || []) as OrderRow[])
    setTrucks((truckData || []) as TruckRow[])
    setDispatchHistory((historyData || []) as DispatchHistoryRow[])
  }

  useEffect(() => {
    loadData()

    const ordersChannel = supabase
      .channel('dispatch-orders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => loadData()
      )
      .subscribe()

    const fleetChannel = supabase
      .channel('dispatch-fleet-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fleet' },
        () => loadData()
      )
      .subscribe()

    const historyChannel = supabase
      .channel('dispatch-history-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dispatch_history' },
        () => loadData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(fleetChannel)
      supabase.removeChannel(historyChannel)
    }
  }, [])

  function getDistance(aLat: number, aLng: number, bLat: number, bLng: number) {
    const dx = aLat - bLat
    const dy = aLng - bLng
    return Math.sqrt(dx * dx + dy * dy)
  }

  function getStatusColor(status: string | null) {
    if (status === 'delivered') return '#22c55e'
    if (status === 'assigned') return '#2563eb'
    if (status === 'pending') return '#facc15'
    if (status === 'cancelled') return '#ef4444'
    return '#94a3b8'
  }

  function getTruckRejectCount(truckId: string) {
    return dispatchHistory.filter(
      (row) => row.truck_id === truckId && row.decision_type === 'rejected'
    ).length
  }

  function scoreTrucksForOrder(order: OrderRow): TruckScore[] {
    const pickupLat = order.pickup_lat ?? 35.48
    const pickupLng = order.pickup_lng ?? -97.5

    const candidates = trucks.filter(
      (truck) =>
        typeof truck.latitude === 'number' &&
        typeof truck.longitude === 'number' &&
        truck.status !== 'delivering'
    )

    const scored = candidates.map((truck) => {
      const distance = getDistance(
        truck.latitude,
        truck.longitude,
        pickupLat,
        pickupLng
      )

      let score = distance
      const notes: string[] = []

      if (truck.status === 'idle') {
        score -= 1.5
        notes.push('Idle truck bonus')
      }

      if (!truck.current_load) {
        score -= 0.5
        notes.push('No active load bonus')
      }

      if (truck.status === 'assigned') {
        score += 1.5
        notes.push('Already assigned penalty')
      }

      if (truck.status === 'delayed') {
        score += 5
        notes.push('Delayed truck penalty')
      }

      const rejectCount = getTruckRejectCount(truck.id)
      if (rejectCount > 0) {
        score += rejectCount * 0.75
        notes.push(`Reject history penalty (${rejectCount})`)
      }

      if (distance < 0.03) {
        score -= 0.4
        notes.push('Nearby bonus')
      }

      return {
        truck,
        score,
        distance,
        notes,
      }
    })

    scored.sort((a, b) => a.score - b.score)
    return scored
  }

  async function createLoad() {
    if (!loadName || !pickup || !dropoff) {
      alert('Fill in Load Name, Pickup, and Dropoff.')
      return
    }

    await supabase.from('orders').insert({
      load_name: loadName,
      pickup_location: pickup,
      dropoff_location: dropoff,
      pickup_lat: 35.48,
      pickup_lng: -97.5,
      dropoff_lat: 35.52,
      dropoff_lng: -97.48,
      status: 'pending',
      driver_response: 'pending',
    })

    setLoadName('')
    setPickup('')
    setDropoff('')
  }

  async function writeDispatchHistory(params: {
    orderId: string
    truckId: string | null
    decisionType: string
    score?: number | null
    notes?: string | null
  }) {
    await supabase.from('dispatch_history').insert({
      order_id: params.orderId,
      truck_id: params.truckId,
      decision_type: params.decisionType,
      score: params.score ?? null,
      notes: params.notes ?? null,
    })
  }

  async function assignOrder(order: OrderRow, truckId: string) {
    if (!truckId) {
      alert('Select a truck first.')
      return
    }

    const truck = trucks.find((t) => t.id === truckId)
    if (!truck) return

    await supabase
      .from('fleet')
      .update({
        status: 'assigned',
        current_load: order.load_name,
        pickup_location: order.pickup_location,
        dropoff_location: order.dropoff_location,
        destination: order.dropoff_location,
        eta: 'Manual Dispatch',
      })
      .eq('id', truckId)

    await supabase
      .from('orders')
      .update({
        status: 'assigned',
        assigned_truck_id: truckId,
        driver_response: 'pending',
      })
      .eq('id', order.id)

    await writeDispatchHistory({
      orderId: order.id,
      truckId,
      decisionType: 'manual_assigned',
      notes: 'Manually assigned from dispatch panel',
    })
  }

  async function aiDispatch(order: OrderRow) {
    const scored = scoreTrucksForOrder(order)
    const best = scored[0]

    if (!best) {
      alert('AI Dispatch: no suitable trucks available.')
      return
    }

    await supabase
      .from('fleet')
      .update({
        status: 'assigned',
        current_load: order.load_name,
        pickup_location: order.pickup_location,
        dropoff_location: order.dropoff_location,
        destination: order.dropoff_location,
        eta: 'AI Assigned',
      })
      .eq('id', best.truck.id)

    await supabase
      .from('orders')
      .update({
        status: 'assigned',
        assigned_truck_id: best.truck.id,
        driver_response: 'pending',
      })
      .eq('id', order.id)

    await writeDispatchHistory({
      orderId: order.id,
      truckId: best.truck.id,
      decisionType: 'ai_assigned',
      score: best.score,
      notes: `Distance=${best.distance.toFixed(4)} | ${best.notes.join(', ')}`,
    })

    alert(`AI Dispatch assigned ${best.truck.truck_name}`)
  }

  async function markDelivered(order: OrderRow) {
    if (order.assigned_truck_id) {
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
        .eq('id', order.assigned_truck_id)
    }

    await supabase
      .from('orders')
      .update({
        status: 'delivered',
      })
      .eq('id', order.id)

    await writeDispatchHistory({
      orderId: order.id,
      truckId: order.assigned_truck_id,
      decisionType: 'delivered',
      notes: 'Order marked delivered',
    })
  }

  function truckLabel(truckId: string | null) {
    if (!truckId) return 'Unassigned'
    const truck = trucks.find((t) => t.id === truckId)
    return truck ? truck.truck_name : 'Unknown Truck'
  }

  const idleOrAvailableTrucks = useMemo(
    () => trucks.filter((t) => t.status === 'idle' || t.status === 'assigned'),
    [trucks]
  )

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #030712 0%, #0b1220 50%, #111827 100%)',
        color: 'white',
        padding: '24px',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '36px', margin: 0 }}>Smart AI Dispatch Panel</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Create loads, assign manually, or let AI choose the best truck by distance,
          availability, and rejection history
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        <div
          style={{
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '18px',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Create Load</h2>

          <input
            value={loadName}
            onChange={(e) => setLoadName(e.target.value)}
            placeholder="Load name"
            style={inputStyle}
          />

          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup location"
            style={inputStyle}
          />

          <input
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="Dropoff location"
            style={inputStyle}
          />

          <button onClick={createLoad} style={primaryButton}>
            Create Load
          </button>

          <div style={{ marginTop: '22px' }}>
            <h3 style={{ marginBottom: '10px' }}>Truck Pool</h3>

            <div style={{ display: 'grid', gap: '10px' }}>
              {trucks.map((truck) => (
                <div
                  key={truck.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{truck.truck_name}</div>
                  <div style={{ color: '#94a3b8', marginTop: '4px' }}>
                    Driver: {truck.driver_name || 'Unassigned'}
                  </div>
                  <div style={{ color: '#7dd3fc', marginTop: '4px' }}>
                    Coords: {truck.latitude}, {truck.longitude}
                  </div>
                  <div style={{ color: '#cbd5e1', marginTop: '4px' }}>
                    Status: {truck.status}
                  </div>
                  <div style={{ color: '#cbd5e1', marginTop: '4px' }}>
                    Rejections: {getTruckRejectCount(truck.id)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15,23,42,0.9)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '18px',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Loads</h2>

          {!orders.length ? (
            <div style={{ color: '#94a3b8' }}>No loads found.</div>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {orders.map((order) => {
                const preview = aiPreviewByOrder[order.id] || []
                const topChoice = preview[0]

                return (
                  <div
                    key={order.id}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '14px',
                      padding: '14px',
                    }}
                  >
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>
                      {order.load_name || 'Untitled Load'}
                    </div>

                    <div style={{ color: '#cbd5e1', marginTop: '6px' }}>
                      Pickup: {order.pickup_location || 'N/A'}
                    </div>

                    <div style={{ color: '#cbd5e1', marginTop: '4px' }}>
                      Dropoff: {order.dropoff_location || 'N/A'}
                    </div>

                    <div
                      style={{
                        color: getStatusColor(order.status),
                        marginTop: '6px',
                        fontWeight: 700,
                      }}
                    >
                      Status: {(order.status || 'unknown').toUpperCase()}
                    </div>

                    <div style={{ color: '#94a3b8', marginTop: '4px' }}>
                      Assigned Truck: {truckLabel(order.assigned_truck_id)}
                    </div>

                    {topChoice && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'rgba(168,85,247,0.12)',
                          border: '1px solid rgba(168,85,247,0.35)',
                        }}
                      >
                        <div style={{ fontWeight: 800, color: '#e9d5ff' }}>
                          AI Top Recommendation: {topChoice.truck.truck_name}
                        </div>
                        <div style={{ color: '#ddd6fe', marginTop: '6px' }}>
                          Score: {topChoice.score.toFixed(3)} | Distance: {topChoice.distance.toFixed(4)}
                        </div>
                        <div style={{ color: '#c4b5fd', marginTop: '6px', fontSize: '13px' }}>
                          {topChoice.notes.join(' • ')}
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        marginTop: '12px',
                      }}
                    >
                      <select
                        value={selectedTruckByOrder[order.id] || ''}
                        onChange={(e) =>
                          setSelectedTruckByOrder((prev) => ({
                            ...prev,
                            [order.id]: e.target.value,
                          }))
                        }
                        style={selectStyle}
                      >
                        <option value="">Select Truck</option>
                        {idleOrAvailableTrucks.map((truck) => (
                          <option key={truck.id} value={truck.id}>
                            {truck.truck_name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => assignOrder(order, selectedTruckByOrder[order.id] || '')}
                        style={secondaryButton}
                      >
                        Assign Truck
                      </button>

                      <button
                        onClick={() =>
                          setAiPreviewByOrder((prev) => ({
                            ...prev,
                            [order.id]: scoreTrucksForOrder(order).slice(0, 3),
                          }))
                        }
                        style={previewButton}
                      >
                        Preview AI
                      </button>

                      <button onClick={() => aiDispatch(order)} style={aiButton}>
                        AI Dispatch
                      </button>

                      <button onClick={() => markDelivered(order)} style={dangerButton}>
                        Mark Delivered
                      </button>
                    </div>

                    {preview.length > 1 && (
                      <div
                        style={{
                          marginTop: '12px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '12px',
                          padding: '12px',
                        }}
                      >
                        <div style={{ fontWeight: 800, marginBottom: '8px' }}>AI Ranking</div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {preview.map((item, idx) => (
                            <div key={item.truck.id} style={{ color: '#cbd5e1' }}>
                              {idx + 1}. {item.truck.truck_name} — score {item.score.toFixed(3)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0f172a',
  color: 'white',
}

const selectStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0f172a',
  color: 'white',
}

const primaryButton: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '10px',
  border: 'none',
  background: '#22c55e',
  color: 'black',
  fontWeight: 800,
  cursor: 'pointer',
}

const secondaryButton: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: 'none',
  background: '#2563eb',
  color: 'white',
  fontWeight: 800,
  cursor: 'pointer',
}

const previewButton: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: 'none',
  background: '#475569',
  color: 'white',
  fontWeight: 800,
  cursor: 'pointer',
}

const aiButton: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: 'none',
  background: '#a855f7',
  color: 'white',
  fontWeight: 800,
  cursor: 'pointer',
}

const dangerButton: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '10px',
  border: 'none',
  background: '#ef4444',
  color: 'white',
  fontWeight: 800,
  cursor: 'pointer',
}