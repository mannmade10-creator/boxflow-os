'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

type EquipmentRow = {
  id: string
  machine_name: string
  status: string
  alert?: string | null
}

type FleetRow = {
  id: string
  truck_name: string
  driver_name?: string | null
  status: string
  current_load?: string | null
  eta?: string | null
}

type OrderRow = {
  id: string
  load_name?: string | null
  status: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
}

type AlertDbRow = {
  id: number
  source_key: string | null
  title: string | null
  description: string | null
  type: string | null
  status: string | null
}

type AlertItem = {
  id: string
  type: 'equipment' | 'fleet' | 'order'
  level: 'critical' | 'warning' | 'info'
  title: string
  message: string
  href: string
  sourceKey: string
}

export default function AlertsPage() {
  const [equipment, setEquipment] = useState<EquipmentRow[]>([])
  const [fleet, setFleet] = useState<FleetRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [alertRows, setAlertRows] = useState<AlertDbRow[]>([])
  const sentRef = useRef<Set<string>>(new Set())

  async function loadData() {
    const { data: equipmentData } = await supabase.from('equipment').select('*')
    const { data: fleetData } = await supabase.from('fleet').select('*')
    const { data: ordersData } = await supabase.from('orders').select('*')
    const { data: alertsData } = await supabase.from('alerts').select('*')

    setEquipment((equipmentData || []) as EquipmentRow[])
    setFleet((fleetData || []) as FleetRow[])
    setOrders((ordersData || []) as OrderRow[])
    setAlertRows((alertsData || []) as AlertDbRow[])
  }

  useEffect(() => {
    loadData()

    const equipmentChannel = supabase
      .channel('alerts-equipment-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'equipment' },
        () => loadData()
      )
      .subscribe()

    const fleetChannel = supabase
      .channel('alerts-fleet-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fleet' },
        () => loadData()
      )
      .subscribe()

    const ordersChannel = supabase
      .channel('alerts-orders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => loadData()
      )
      .subscribe()

    const alertsChannel = supabase
      .channel('alerts-db-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        () => loadData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(equipmentChannel)
      supabase.removeChannel(fleetChannel)
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(alertsChannel)
    }
  }, [])

  const hiddenKeys = useMemo(() => {
    return new Set(
      alertRows
        .filter((row) => row.status === 'acknowledged')
        .map((row) => row.source_key)
        .filter(Boolean) as string[]
    )
  }, [alertRows])

  const alerts = useMemo(() => {
    const items: AlertItem[] = []

    equipment.forEach((machine) => {
      const sourceKey = `equipment-${machine.id}`

      if (machine.status === 'down' && !hiddenKeys.has(sourceKey)) {
        items.push({
          id: sourceKey,
          type: 'equipment',
          level: 'critical',
          title: `${machine.machine_name} is down`,
          message:
            machine.alert || 'Machine failure detected. Immediate review needed.',
          href: '/equipment',
          sourceKey,
        })
      }
    })

    fleet.forEach((truck) => {
      const sourceKey = `fleet-${truck.id}`

      if (truck.status === 'delayed' && !hiddenKeys.has(sourceKey)) {
        items.push({
          id: sourceKey,
          type: 'fleet',
          level: 'warning',
          title: `${truck.truck_name} is delayed`,
          message: `${truck.current_load || 'Assigned load'} may arrive late. ETA: ${truck.eta || 'Unknown'}.`,
          href: '/fleet',
          sourceKey,
        })
      }
    })

    orders.forEach((order) => {
      const sourceKey = `order-${order.id}`

      if (order.status === 'pending' && !hiddenKeys.has(sourceKey)) {
        items.push({
          id: sourceKey,
          type: 'order',
          level: 'info',
          title: `${order.load_name || 'Load'} is pending`,
          message: `Awaiting truck assignment for ${order.pickup_location || 'pickup'} → ${order.dropoff_location || 'dropoff'}.`,
          href: '/orders',
          sourceKey,
        })
      }
    })

    return items
  }, [equipment, fleet, orders, hiddenKeys])

  useEffect(() => {
    async function autoSend() {
      for (const alertItem of alerts) {
        if (alertItem.level === 'info') continue
        if (sentRef.current.has(alertItem.sourceKey)) continue

        try {
          const res = await fetch('/api/notify-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: alertItem.title,
              message: alertItem.message,
              level: alertItem.level,
            }),
          })

          const data = await res.json()

          if (data.ok) {
            sentRef.current.add(alertItem.sourceKey)
          }
        } catch {
          // keep quiet for demo
        }
      }
    }

    if (alerts.length) {
      autoSend()
    }
  }, [alerts])

  const criticalCount = alerts.filter((a) => a.level === 'critical').length
  const warningCount = alerts.filter((a) => a.level === 'warning').length
  const infoCount = alerts.filter((a) => a.level === 'info').length

  async function handleAcknowledge(alertItem: AlertItem) {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceKey: alertItem.sourceKey,
        title: alertItem.title,
        description: alertItem.message,
        type: alertItem.type,
        action: 'acknowledge',
      }),
    })

    sentRef.current.delete(alertItem.sourceKey)
  }

  async function handleOpen(alertItem: AlertItem) {
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceKey: alertItem.sourceKey,
        title: alertItem.title,
        description: alertItem.message,
        type: alertItem.type,
        action: 'open',
      }),
    })

    window.location.href = alertItem.href
  }

  function getAccent(level: AlertItem['level']) {
    if (level === 'critical') return '#ef4444'
    if (level === 'warning') return '#facc15'
    return '#38bdf8'
  }

  function getTypeLabel(type: AlertItem['type']) {
    if (type === 'equipment') return 'Equipment'
    if (type === 'fleet') return 'Fleet'
    return 'Order'
  }

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
        <h1 style={{ fontSize: '36px', margin: 0 }}>Alerts Center</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Live alerts for equipment failures, delayed trucks, and pending loads
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <SummaryCard title="Critical" value={criticalCount} color="#ef4444" />
        <SummaryCard title="Warnings" value={warningCount} color="#facc15" />
        <SummaryCard title="Info" value={infoCount} color="#38bdf8" />
      </div>

      <div
        style={{
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px',
          padding: '18px',
        }}
      >
        <h2 style={{ marginTop: 0 }}>Live Alerts</h2>

        {alerts.length === 0 ? (
          <div style={{ color: '#94a3b8' }}>No active alerts.</div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {alerts.map((alertItem) => {
              const accent = getAccent(alertItem.level)

              return (
                <div
                  key={alertItem.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${accent}`,
                    borderRadius: '14px',
                    padding: '14px',
                    boxShadow: `0 0 12px ${accent}22`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ fontSize: '18px', fontWeight: 800 }}>
                      {alertItem.title}
                    </div>
                    <div
                      style={{
                        padding: '6px 10px',
                        borderRadius: '999px',
                        background: accent,
                        color: '#020617',
                        fontWeight: 800,
                        fontSize: '12px',
                      }}
                    >
                      {getTypeLabel(alertItem.type)}
                    </div>
                  </div>

                  <div style={{ color: '#cbd5e1', marginBottom: '12px' }}>
                    {alertItem.message}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleOpen(alertItem)}
                      style={btn('#2563eb', 'white')}
                    >
                      Open
                    </button>

                    <button
                      onClick={() => handleAcknowledge(alertItem)}
                      style={btn('#22c55e', '#020617')}
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

function SummaryCard({
  title,
  value,
  color,
}: {
  title: string
  value: number
  color: string
}) {
  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
        padding: '18px',
      }}
    >
      <div style={{ color: '#94a3b8' }}>{title}</div>
      <div style={{ fontSize: '34px', fontWeight: 800, marginTop: '8px', color }}>
        {value}
      </div>
    </div>
  )
}

function btn(background: string, color: string): React.CSSProperties {
  return {
    background,
    color,
    border: 'none',
    padding: '10px 12px',
    borderRadius: '10px',
    fontWeight: 800,
    cursor: 'pointer',
  }
}