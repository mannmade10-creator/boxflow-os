'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AppSidebar from '@/components/AppSidebar'

type OrderRow = {
  id: string
  order_number?: string | null
  load_name?: string | null
  client_name?: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
  status?: string | null
  assigned_truck_id?: string | null
  priority?: string | null
  created_at?: string | null
  truck_lat?: number | null
  truck_lng?: number | null
}

type TruckOption = {
  id: string
  name: string
  zone: string
  available: boolean
  lat: number
  lng: number
  capacity: string
}

type AiRecommendation = {
  truck: TruckOption
  distanceKm: number
  reason: string
}

type DispatchFormState = {
  assigned_truck_id: string
  status: string
}

const STATUS_COLUMNS = [
  'Pending',
  'Assigned',
  'Dispatched',
  'In Transit',
  'Delivered',
] as const

const TRUCK_OPTIONS: TruckOption[] = [
  {
    id: 'TRK-201',
    name: 'Blue Truck 201',
    zone: 'OKC Core',
    available: true,
    lat: 35.4676,
    lng: -97.5164,
    capacity: 'Standard',
  },
  {
    id: 'TRK-305',
    name: 'Yellow Truck 305',
    zone: 'Metro East',
    available: true,
    lat: 35.4822,
    lng: -97.4301,
    capacity: 'High',
  },
  {
    id: 'TRK-412',
    name: 'Silver Truck 412',
    zone: 'North Route',
    available: true,
    lat: 35.5901,
    lng: -97.5487,
    capacity: 'Standard',
  },
  {
    id: 'TRK-518',
    name: 'Black Truck 518',
    zone: 'South Route',
    available: true,
    lat: 35.3912,
    lng: -97.5234,
    capacity: 'Rush',
  },
]

function normalizeNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function rowOrNull(value: unknown) {
  if (value === undefined || value === null || value === '') return null
  return String(value)
}

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

function normalizeOrder(order: any): OrderRow {
  return {
    id: String(order?.id ?? ''),
    order_number: rowOrNull(order?.order_number),
    load_name:
      order?.load_name ||
      order?.order_name ||
      order?.name ||
      order?.title ||
      `Order ${order?.id ?? ''}`,
    client_name: rowOrNull(order?.client_name || order?.client),
    pickup_location: rowOrNull(
      order?.pickup_location ||
        order?.pickup ||
        order?.origin ||
        order?.from_location ||
        order?.pickup_address
    ),
    dropoff_location: rowOrNull(
      order?.dropoff_location ||
        order?.dropoff ||
        order?.destination ||
        order?.to_location ||
        order?.dropoff_address
    ),
    status: normalizeStatus(order?.status),
    assigned_truck_id: rowOrNull(
      order?.assigned_truck_id ||
        order?.truck_id ||
        order?.assigned_truck ||
        order?.truck
    ),
    priority: rowOrNull(order?.priority) || 'Standard',
    created_at: rowOrNull(order?.created_at),
    truck_lat: normalizeNumber(order?.truck_lat),
    truck_lng: normalizeNumber(order?.truck_lng),
  }
}

function getStatusBadge(status?: string | null) {
  const value = normalizeStatus(status)

  if (value === 'Delivered') {
    return {
      bg: 'rgba(34,197,94,0.14)',
      color: '#86efac',
      border: '1px solid rgba(34,197,94,0.3)',
    }
  }

  if (value === 'In Transit') {
    return {
      bg: 'rgba(14,165,233,0.14)',
      color: '#7dd3fc',
      border: '1px solid rgba(14,165,233,0.3)',
    }
  }

  if (value === 'Dispatched' || value === 'Assigned') {
    return {
      bg: 'rgba(59,130,246,0.14)',
      color: '#93c5fd',
      border: '1px solid rgba(59,130,246,0.3)',
    }
  }

  return {
    bg: 'rgba(148,163,184,0.14)',
    color: '#cbd5e1',
    border: '1px solid rgba(148,163,184,0.25)',
  }
}

function getPriorityBadge(priority?: string | null) {
  const value = String(priority || '').toLowerCase()

  if (value.includes('rush') || value.includes('urgent')) {
    return {
      bg: 'rgba(239,68,68,0.14)',
      color: '#fca5a5',
      border: '1px solid rgba(239,68,68,0.3)',
    }
  }

  if (value.includes('high')) {
    return {
      bg: 'rgba(245,158,11,0.14)',
      color: '#fcd34d',
      border: '1px solid rgba(245,158,11,0.3)',
    }
  }

  return {
    bg: 'rgba(59,130,246,0.14)',
    color: '#93c5fd',
    border: '1px solid rgba(59,130,246,0.3)',
  }
}

function getColumnAccent(status: string) {
  if (status === 'Delivered') return 'rgba(34,197,94,0.35)'
  if (status === 'In Transit') return 'rgba(14,165,233,0.35)'
  if (status === 'Dispatched') return 'rgba(59,130,246,0.35)'
  if (status === 'Assigned') return 'rgba(245,158,11,0.35)'
  return 'rgba(148,163,184,0.25)'
}

function getAiRecommendation(order: OrderRow): AiRecommendation {
  const pickup = resolveLocationCoords(order.pickup_location)
  const priority = String(order.priority || '').toLowerCase()

  const ranked = [...TRUCK_OPTIONS]
    .map((truck) => {
      let score = distanceKm(truck.lat, truck.lng, pickup.lat, pickup.lng)
      let reason = `Closest to ${pickup.label}`

      if (priority.includes('rush') || priority.includes('urgent')) {
        if (truck.capacity === 'Rush') {
          score -= 3
          reason = 'Rush-capable and near pickup'
        }
      }

      if (priority.includes('high')) {
        if (truck.capacity === 'High' || truck.capacity === 'Rush') {
          score -= 1.2
          reason = 'Higher capacity and near pickup'
        }
      }

      return { truck, distanceKm: Math.max(0.1, Number(score.toFixed(1))), reason }
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)

  return ranked[0]
}

export default function DispatchPage() {
  const router = useRouter()

  const [orders, setOrders] = useState<OrderRow[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null)
  const [form, setForm] = useState<DispatchFormState>({
    assigned_truck_id: '',
    status: 'Assigned',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [movingId, setMovingId] = useState<string | null>(null)
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null)
  const [dropStatus, setDropStatus] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return orders

    return orders.filter((order) =>
      [
        order.order_number,
        order.load_name,
        order.client_name,
        order.pickup_location,
        order.dropoff_location,
        order.status,
        order.assigned_truck_id,
        order.priority,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [orders, search])

  const groupedOrders = useMemo(() => {
    return STATUS_COLUMNS.reduce(
      (acc, status) => {
        acc[status] = filteredOrders.filter(
          (order) => normalizeStatus(order.status) === status
        )
        return acc
      },
      {} as Record<(typeof STATUS_COLUMNS)[number], OrderRow[]>
    )
  }, [filteredOrders])

  const aiRecommendation = useMemo(() => {
    if (!selectedOrder) return null
    return getAiRecommendation(selectedOrder)
  }, [selectedOrder])

  async function loadOrders(showRefreshing = false) {
    try {
      if (showRefreshing) setRefreshing(true)
      setError(null)

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const normalized = ((data as any[]) || []).map(normalizeOrder)
      setOrders(normalized)

      if (selectedOrder) {
        const freshSelected = normalized.find((o) => o.id === selectedOrder.id) || null
        setSelectedOrder(freshSelected)

        if (freshSelected) {
          setForm({
            assigned_truck_id: freshSelected.assigned_truck_id || '',
            status: normalizeStatus(freshSelected.status),
          })
        }
      }
    } catch (err: any) {
      console.error('Dispatch load error:', err)
      setError(err?.message || 'Failed to load dispatch orders.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('dispatch-phase-13-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => loadOrders(true)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedOrder])

  function handleSelectOrder(order: OrderRow) {
    setSelectedOrder(order)
    setError(null)
    setSuccess(null)
    setForm({
      assigned_truck_id: order.assigned_truck_id || '',
      status: normalizeStatus(order.status),
    })
  }

  async function handleAssignSave() {
    if (!selectedOrder) {
      setError('Select an order first.')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const truck = TRUCK_OPTIONS.find((t) => t.id === form.assigned_truck_id)

      const payload = {
        assigned_truck_id: form.assigned_truck_id.trim() || null,
        status: form.status,
        truck_lat: truck ? truck.lat : null,
        truck_lng: truck ? truck.lng : null,
      }

      const { error } = await supabase
        .from('orders')
        .update(payload)
        .eq('id', selectedOrder.id)

      if (error) throw error

      setSuccess('Dispatch updated successfully.')
      await loadOrders(true)
    } catch (err: any) {
      console.error('Dispatch update error:', err)
      setError(err?.message || 'Failed to update dispatch.')
    } finally {
      setSaving(false)
    }
  }

  async function moveOrderStatus(order: OrderRow, nextStatus: string) {
    setMovingId(order.id)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', order.id)

      if (error) throw error

      if (selectedOrder?.id === order.id) {
        setForm((prev) => ({ ...prev, status: nextStatus }))
      }

      setSuccess(`${order.order_number || order.load_name || 'Order'} moved to ${nextStatus}.`)
      await loadOrders(true)
    } catch (err: any) {
      console.error('Move order error:', err)
      setError(err?.message || 'Failed to move order.')
    } finally {
      setMovingId(null)
      setDraggedOrderId(null)
      setDropStatus(null)
    }
  }

  async function handleAiDispatchOne(order: OrderRow) {
    try {
      setError(null)
      setSuccess(null)

      const recommendation = getAiRecommendation(order)
      const truck = recommendation.truck

      const nextStatus =
        normalizeStatus(order.status) === 'Pending'
          ? 'Assigned'
          : normalizeStatus(order.status)

      const { error } = await supabase
        .from('orders')
        .update({
          assigned_truck_id: truck.id,
          truck_lat: truck.lat,
          truck_lng: truck.lng,
          status: nextStatus,
        })
        .eq('id', order.id)

      if (error) throw error

      setSuccess(
        `AI assigned ${order.order_number || order.load_name || 'order'} to ${truck.id} (${recommendation.distanceKm} km).`
      )
      await loadOrders(true)
    } catch (err: any) {
      console.error('AI dispatch error:', err)
      setError(err?.message || 'Failed AI dispatch.')
    }
  }

  async function handleOneClickDispatch(order: OrderRow) {
    try {
      setError(null)
      setSuccess(null)

      const recommendation = getAiRecommendation(order)
      const truck = recommendation.truck

      const { error } = await supabase
        .from('orders')
        .update({
          assigned_truck_id: truck.id,
          truck_lat: truck.lat,
          truck_lng: truck.lng,
          status: 'Dispatched',
        })
        .eq('id', order.id)

      if (error) throw error

      setSuccess(
        `One-click dispatch complete: ${order.order_number || order.load_name || 'order'} -> ${truck.id}.`
      )
      await loadOrders(true)
    } catch (err: any) {
      console.error('One-click dispatch error:', err)
      setError(err?.message || 'Failed one-click dispatch.')
    }
  }

  async function handleAiDispatchAll() {
    try {
      setError(null)
      setSuccess(null)

      const pendingOrders = orders.filter(
        (o) => normalizeStatus(o.status) === 'Pending'
      )

      for (const order of pendingOrders) {
        const recommendation = getAiRecommendation(order)
        const truck = recommendation.truck

        const { error } = await supabase
          .from('orders')
          .update({
            assigned_truck_id: truck.id,
            truck_lat: truck.lat,
            truck_lng: truck.lng,
            status: 'Assigned',
          })
          .eq('id', order.id)

        if (error) throw error
      }

      setSuccess(`AI dispatched ${pendingOrders.length} pending orders.`)
      await loadOrders(true)
    } catch (err: any) {
      console.error('AI bulk dispatch error:', err)
      setError(err?.message || 'Failed AI bulk dispatch.')
    }
  }

  function openTruckOnMap(order: OrderRow) {
    const truckId = order.assigned_truck_id || form.assigned_truck_id
    router.push(`/fleet-map?truck=${encodeURIComponent(truckId || '')}`)
  }

  const totalOrders = orders.length
  const activeOrders = orders.filter(
    (o) => normalizeStatus(o.status) !== 'Delivered'
  ).length
  const movingOrders = orders.filter((o) =>
    ['Assigned', 'Dispatched', 'In Transit'].includes(normalizeStatus(o.status))
  ).length

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
            maxWidth: 1750,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: 18,
          }}
        >

          <section>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 20,
              }}
            >
              <div>
                <div style={pillStyle}>Phase 13 AI Dispatch</div>
                <h1 style={{ margin: '14px 0 8px', fontSize: 32 }}>
                  Smart Dispatch Control
                </h1>
                <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.65 }}>
                  AI truck assignment, one-click dispatch, and map-linked workflow.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={handleAiDispatchAll} style={aiBtn}>
                  AI Dispatch All Pending
                </button>
                <button onClick={() => loadOrders(true)} style={primaryBtn}>
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {error && <div style={errorStyle}>{error}</div>}
            {success && <div style={successStyle}>{success}</div>}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 14,
                marginBottom: 18,
              }}
            >
              <div style={cardStyle}>
                <div style={cardLabel}>Total Orders</div>
                <div style={cardValue}>{totalOrders}</div>
              </div>
              <div style={cardStyle}>
                <div style={cardLabel}>Open / Active</div>
                <div style={cardValue}>{activeOrders}</div>
              </div>
              <div style={cardStyle}>
                <div style={cardLabel}>Assigned / Moving</div>
                <div style={cardValue}>{movingOrders}</div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 400px',
                gap: 18,
                alignItems: 'start',
              }}
            >
              <section style={panelStyle}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div style={sectionLabel}>Workflow Board</div>
                    <div style={{ color: '#94a3b8', fontSize: 14 }}>
                      Drag cards between statuses or let AI assign them
                    </div>
                  </div>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search orders..."
                    style={{ ...inputStyle, width: 260 }}
                  />
                </div>

                {loading ? (
                  <div style={{ color: '#94a3b8' }}>Loading dispatch board...</div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, minmax(240px, 1fr))',
                      gap: 14,
                      overflowX: 'auto',
                      alignItems: 'start',
                    }}
                  >
                    {STATUS_COLUMNS.map((status) => (
                      <div
                        key={status}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDropStatus(status)
                        }}
                        onDragLeave={() => {
                          if (dropStatus === status) setDropStatus(null)
                        }}
                        onDrop={async (e) => {
                          e.preventDefault()
                          const orderId = e.dataTransfer.getData('text/plain')
                          const order = orders.find((o) => o.id === orderId)
                          if (order) {
                            await moveOrderStatus(order, status)
                          }
                        }}
                        style={{
                          minWidth: 240,
                          background:
                            dropStatus === status
                              ? 'rgba(37,99,235,0.12)'
                              : 'rgba(2,6,23,0.42)',
                          border: `1px solid ${getColumnAccent(status)}`,
                          borderRadius: 20,
                          padding: 12,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 12,
                            gap: 8,
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: 15 }}>{status}</div>
                          <div
                            style={{
                              background: 'rgba(148,163,184,0.12)',
                              border: '1px solid rgba(148,163,184,0.2)',
                              borderRadius: 999,
                              padding: '5px 9px',
                              fontSize: 12,
                              color: '#cbd5e1',
                              fontWeight: 800,
                            }}
                          >
                            {groupedOrders[status].length}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gap: 10 }}>
                          {groupedOrders[status].length === 0 ? (
                            <div
                              style={{
                                color: '#64748b',
                                fontSize: 13,
                                border: '1px dashed rgba(148,163,184,0.18)',
                                borderRadius: 14,
                                padding: 14,
                              }}
                            >
                              No orders here
                            </div>
                          ) : (
                            groupedOrders[status].map((order) => {
                              const isSelected = selectedOrder?.id === order.id
                              const statusBadge = getStatusBadge(order.status)
                              const priorityBadge = getPriorityBadge(order.priority)

                              return (
                                <div
                                  key={order.id}
                                  draggable
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', order.id)
                                    setDraggedOrderId(order.id)
                                  }}
                                  onDragEnd={() => {
                                    setDraggedOrderId(null)
                                    setDropStatus(null)
                                  }}
                                  onClick={() => handleSelectOrder(order)}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault()
                                      handleSelectOrder(order)
                                    }
                                  }}
                                  style={{
                                    textAlign: 'left',
                                    background: isSelected
                                      ? 'rgba(30,41,59,0.96)'
                                      : 'rgba(15,23,42,0.92)',
                                    border: isSelected
                                      ? '1px solid rgba(59,130,246,0.4)'
                                      : '1px solid rgba(148,163,184,0.12)',
                                    borderRadius: 16,
                                    padding: 14,
                                    color: '#fff',
                                    cursor: 'grab',
                                    opacity: draggedOrderId === order.id ? 0.75 : 1,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'flex-start',
                                      gap: 8,
                                      marginBottom: 10,
                                    }}
                                  >
                                    <div style={{ fontWeight: 800, fontSize: 15 }}>
                                      {order.order_number || order.load_name || order.id}
                                    </div>
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        borderRadius: 999,
                                        padding: '5px 8px',
                                        background: priorityBadge.bg,
                                        color: priorityBadge.color,
                                        border: priorityBadge.border,
                                        fontSize: 11,
                                        fontWeight: 800,
                                      }}
                                    >
                                      {order.priority || 'Standard'}
                                    </span>
                                  </div>

                                  <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>
                                    {order.client_name || 'No client'}
                                  </div>

                                  <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
                                    <div>
                                      <span style={miniLabel}>Pickup:</span>{' '}
                                      <span style={miniValue}>{order.pickup_location || 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span style={miniLabel}>Dropoff:</span>{' '}
                                      <span style={miniValue}>{order.dropoff_location || 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span style={miniLabel}>Truck:</span>{' '}
                                      <span style={miniValue}>
                                        {order.assigned_truck_id || 'Unassigned'}
                                      </span>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      gap: 8,
                                      marginBottom: 10,
                                    }}
                                  >
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        borderRadius: 999,
                                        padding: '5px 8px',
                                        background: statusBadge.bg,
                                        color: statusBadge.color,
                                        border: statusBadge.border,
                                        fontSize: 11,
                                        fontWeight: 800,
                                      }}
                                    >
                                      {normalizeStatus(order.status)}
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleAiDispatchOne(order)
                                      }}
                                      style={smallAiBtn}
                                    >
                                      AI
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleOneClickDispatch(order)
                                      }}
                                      style={smallPrimaryBtn}
                                    >
                                      Dispatch
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openTruckOnMap(order)
                                      }}
                                      style={smallMapBtn}
                                    >
                                      Map
                                    </button>
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section style={{ display: 'grid', gap: 18 }}>
                <div style={panelStyle}>
                  <div style={sectionLabel}>AI Recommendation</div>

                  {!selectedOrder || !aiRecommendation ? (
                    <div style={{ color: '#94a3b8' }}>
                      Select an order to see the best truck recommendation.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                      <div style={dispatchInfoCard}>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>
                          {selectedOrder.order_number || selectedOrder.load_name || selectedOrder.id}
                        </div>
                        <div style={{ color: '#94a3b8', marginTop: 6 }}>
                          {selectedOrder.client_name || 'No client assigned'}
                        </div>
                      </div>

                      <div style={infoRow}>
                        <div style={miniLabel}>Recommended Truck</div>
                        <div style={miniValue}>
                          {aiRecommendation.truck.id} - {aiRecommendation.truck.name}
                        </div>
                      </div>

                      <div style={infoRow}>
                        <div style={miniLabel}>Distance</div>
                        <div style={miniValue}>{aiRecommendation.distanceKm} km</div>
                      </div>

                      <div style={infoRow}>
                        <div style={miniLabel}>Reason</div>
                        <div style={miniValue}>{aiRecommendation.reason}</div>
                      </div>

                      <div style={infoRow}>
                        <div style={miniLabel}>Zone</div>
                        <div style={miniValue}>{aiRecommendation.truck.zone}</div>
                      </div>

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              assigned_truck_id: aiRecommendation.truck.id,
                              status: 'Assigned',
                            }))
                          }}
                          style={aiBtn}
                        >
                          Use Recommendation
                        </button>

                        <button
                          onClick={() => handleAiDispatchOne(selectedOrder)}
                          style={primaryBtn}
                        >
                          AI Assign Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div style={panelStyle}>
                  <div style={sectionLabel}>Dispatch Editor</div>

                  {!selectedOrder ? (
                    <div style={{ color: '#94a3b8' }}>
                      Select an order card from the board to edit and dispatch.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: 14 }}>
                      <div style={dispatchInfoCard}>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>
                          {selectedOrder.order_number || selectedOrder.load_name || selectedOrder.id}
                        </div>
                        <div style={{ color: '#94a3b8', marginTop: 6 }}>
                          {selectedOrder.client_name || 'No client assigned'}
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Assigned Truck ID</label>
                        <select
                          value={form.assigned_truck_id}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              assigned_truck_id: e.target.value,
                            }))
                          }
                          style={inputStyle}
                        >
                          <option value="">Select truck</option>
                          {TRUCK_OPTIONS.map((truck) => (
                            <option key={truck.id} value={truck.id}>
                              {truck.id} - {truck.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={labelStyle}>Dispatch Status</label>
                        <select
                          value={form.status}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, status: e.target.value }))
                          }
                          style={inputStyle}
                        >
                          <option>Pending</option>
                          <option>Assigned</option>
                          <option>Dispatched</option>
                          <option>In Transit</option>
                          <option>Delivered</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button onClick={handleAssignSave} disabled={saving} style={primaryBtn}>
                          {saving ? 'Saving...' : 'Save Dispatch'}
                        </button>

                        <button
                          onClick={() => handleOneClickDispatch(selectedOrder)}
                          type="button"
                          style={smallPrimaryBtn}
                        >
                          One-Click Dispatch
                        </button>

                        <button
                          onClick={() => openTruckOnMap(selectedOrder)}
                          type="button"
                          style={mapBtn}
                        >
                          Open Truck on Map
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

const cardStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.86)',
  border: '1px solid rgba(148,163,184,0.16)',
  borderRadius: 22,
  padding: 18,
}

const cardLabel: React.CSSProperties = {
  color: '#64748b',
  fontSize: 12,
  marginBottom: 8,
}

const cardValue: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
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

const aiBtn: React.CSSProperties = {
  border: '1px solid rgba(168,85,247,0.35)',
  background: 'rgba(168,85,247,0.18)',
  color: '#e9d5ff',
  borderRadius: 12,
  padding: '12px 16px',
  fontWeight: 800,
  cursor: 'pointer',
}

const mapBtn: React.CSSProperties = {
  border: '1px solid rgba(16,185,129,0.35)',
  background: 'rgba(16,185,129,0.16)',
  color: '#a7f3d0',
  borderRadius: 12,
  padding: '12px 16px',
  fontWeight: 800,
  cursor: 'pointer',
}

const smallPrimaryBtn: React.CSSProperties = {
  border: '1px solid rgba(59,130,246,0.35)',
  background: '#2563eb',
  color: '#fff',
  borderRadius: 10,
  padding: '8px 10px',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: 12,
}

const smallAiBtn: React.CSSProperties = {
  border: '1px solid rgba(168,85,247,0.35)',
  background: 'rgba(168,85,247,0.18)',
  color: '#e9d5ff',
  borderRadius: 10,
  padding: '8px 10px',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: 12,
}

const smallMapBtn: React.CSSProperties = {
  border: '1px solid rgba(16,185,129,0.35)',
  background: 'rgba(16,185,129,0.16)',
  color: '#a7f3d0',
  borderRadius: 10,
  padding: '8px 10px',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: 12,
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

const miniLabel: React.CSSProperties = {
  color: '#64748b',
  fontSize: 12,
}

const miniValue: React.CSSProperties = {
  color: '#e2e8f0',
  fontSize: 13,
}

const dispatchInfoCard: React.CSSProperties = {
  background: 'rgba(2,6,23,0.5)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 18,
  padding: 14,
}

const infoRow: React.CSSProperties = {
  background: 'rgba(2,6,23,0.5)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 16,
  padding: 12,
}
