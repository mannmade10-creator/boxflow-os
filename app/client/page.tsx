'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

type OrderRow = {
  id: string
  load_name: string | null
  pickup_location: string | null
  dropoff_location: string | null
  status: string | null
  assigned_truck_id: string | null
  created_at?: string
}

type TruckRow = {
  id: string
  truck_name: string
  driver_name: string | null
  status: string
  eta?: string | null
  current_load?: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
  latitude?: number | null
  longitude?: number | null
}

export default function ClientPortalPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [fleet, setFleet] = useState<TruckRow[]>([])
  const [search, setSearch] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState<string>('')

  async function loadData() {
    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: fleetData } = await supabase
      .from('fleet')
      .select('*')
      .order('truck_name', { ascending: true })

    setOrders((orderData || []) as OrderRow[])
    setFleet((fleetData || []) as TruckRow[])
  }

  useEffect(() => {
    loadData()

    const ordersChannel = supabase
      .channel('client-orders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => loadData()
      )
      .subscribe()

    const fleetChannel = supabase
      .channel('client-fleet-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fleet' },
        () => loadData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(fleetChannel)
    }
  }, [])

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) return orders

    return orders.filter((order) => {
      const load = order.load_name?.toLowerCase() || ''
      const pickup = order.pickup_location?.toLowerCase() || ''
      const dropoff = order.dropoff_location?.toLowerCase() || ''

      return load.includes(q) || pickup.includes(q) || dropoff.includes(q)
    })
  }, [orders, search])

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) ||
    filteredOrders[0] ||
    null

  const assignedTruck =
    selectedOrder?.assigned_truck_id
      ? fleet.find((truck) => truck.id === selectedOrder.assigned_truck_id) || null
      : null

  function getStatusColor(status: string | null) {
    if (status === 'delivered') return '#22c55e'
    if (status === 'assigned') return '#2563eb'
    if (status === 'pending') return '#facc15'
    if (status === 'cancelled') return '#ef4444'
    return '#94a3b8'
  }

  function getProgress(status: string | null, truckStatus?: string | null) {
    if (status === 'delivered') return 100
    if (truckStatus === 'delivering') return 75
    if (status === 'assigned') return 50
    if (status === 'pending') return 20
    return 10
  }

  const progress = getProgress(selectedOrder?.status || null, assignedTruck?.status)

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
        <h1 style={{ fontSize: '36px', margin: 0 }}>Client Tracking Portal</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Live load visibility for customers, clients, and internal stakeholders
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
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '18px',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Find Load</h2>

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedOrderId('')
            }}
            placeholder="Search by load, pickup, or dropoff"
            style={inputStyle}
          />

          <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
            {filteredOrders.length === 0 ? (
              <div style={{ color: '#94a3b8' }}>No loads found.</div>
            ) : (
              filteredOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  style={{
                    textAlign: 'left',
                    background:
                      selectedOrder?.id === order.id
                        ? 'rgba(59,130,246,0.18)'
                        : 'rgba(255,255,255,0.04)',
                    color: 'white',
                    border:
                      selectedOrder?.id === order.id
                        ? '1px solid #3b82f6'
                        : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '14px',
                    padding: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '17px' }}>
                    {order.load_name || 'Untitled Load'}
                  </div>

                  <div style={{ color: '#94a3b8', marginTop: '6px', fontSize: '13px' }}>
                    {order.pickup_location || 'N/A'} → {order.dropoff_location || 'N/A'}
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
                      color: getStatusColor(order.status),
                      fontWeight: 800,
                    }}
                  >
                    {(order.status || 'unknown').toUpperCase()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '20px',
          }}
        >
          {!selectedOrder ? (
            <div style={{ color: '#94a3b8' }}>Select a load to view tracking details.</div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: '30px' }}>
                    {selectedOrder.load_name || 'Untitled Load'}
                  </h2>
                  <div style={{ color: '#94a3b8', marginTop: '8px' }}>
                    Live shipment visibility and delivery progress
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '999px',
                    background: getStatusColor(selectedOrder.status),
                    color: selectedOrder.status === 'pending' ? '#111827' : 'white',
                    fontWeight: 800,
                  }}
                >
                  {(selectedOrder.status || 'unknown').toUpperCase()}
                </div>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '16px',
                }}
              >
                <InfoCard title="Pickup" value={selectedOrder.pickup_location || 'N/A'} />
                <InfoCard title="Dropoff" value={selectedOrder.dropoff_location || 'N/A'} />
                <InfoCard
                  title="Assigned Truck"
                  value={assignedTruck?.truck_name || 'Waiting for assignment'}
                />
                <InfoCard title="Driver" value={assignedTruck?.driver_name || 'Unassigned'} />
                <InfoCard title="Truck Status" value={assignedTruck?.status || 'N/A'} />
                <InfoCard title="ETA" value={assignedTruck?.eta || 'Pending'} />
              </div>

              <div
                style={{
                  marginTop: '24px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '18px',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>
                  Delivery Progress
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '18px',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      background:
                        progress >= 100
                          ? '#22c55e'
                          : progress >= 75
                          ? '#38bdf8'
                          : progress >= 50
                          ? '#2563eb'
                          : '#facc15',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: '10px',
                    color: '#cbd5e1',
                    fontWeight: 700,
                  }}
                >
                  {progress}% complete
                </div>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '18px',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>
                  Shipment Timeline
                </div>

                <TimelineItem label="Load Created" active={true} done={true} />
                <TimelineItem
                  label="Truck Assigned"
                  active={
                    selectedOrder.status === 'assigned' ||
                    selectedOrder.status === 'delivered' ||
                    assignedTruck?.status === 'delivering'
                  }
                  done={
                    selectedOrder.status === 'assigned' ||
                    selectedOrder.status === 'delivered' ||
                    assignedTruck?.status === 'delivering'
                  }
                />
                <TimelineItem
                  label="In Transit"
                  active={
                    assignedTruck?.status === 'delivering' ||
                    selectedOrder.status === 'delivered'
                  }
                  done={
                    assignedTruck?.status === 'delivering' ||
                    selectedOrder.status === 'delivered'
                  }
                />
                <TimelineItem
                  label="Delivered"
                  active={selectedOrder.status === 'delivered'}
                  done={selectedOrder.status === 'delivered'}
                  isLast
                />
              </div>

              <div
                style={{
                  marginTop: '24px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '18px',
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>
                  Live Tracking Notes
                </div>
                <div style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                  {selectedOrder.status === 'pending' &&
                    'This load is waiting for truck assignment. Dispatch will assign the best available vehicle.'}

                  {selectedOrder.status === 'assigned' &&
                    'A truck has been assigned. Driver confirmation and route execution are in progress.'}

                  {assignedTruck?.status === 'delivering' &&
                    'Your shipment is actively moving. ETA and status update in real time through the fleet system.'}

                  {selectedOrder.status === 'delivered' &&
                    'This shipment has been delivered successfully and the job has been closed in BoxFlow OS.'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontWeight: 800, fontSize: '18px' }}>{value}</div>
    </div>
  )
}

function TimelineItem({
  label,
  active,
  done,
  isLast = false,
}: {
  label: string
  active: boolean
  done: boolean
  isLast?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: isLast ? 0 : '14px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: done ? '#22c55e' : active ? '#2563eb' : '#334155',
            marginTop: '2px',
          }}
        />
        {!isLast && (
          <div
            style={{
              width: '2px',
              height: '32px',
              background: done ? '#22c55e' : '#334155',
              marginTop: '4px',
            }}
          />
        )}
      </div>

      <div>
        <div style={{ fontWeight: 700, color: active || done ? 'white' : '#94a3b8' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0f172a',
  color: 'white',
  boxSizing: 'border-box',
}