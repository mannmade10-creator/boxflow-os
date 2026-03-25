'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [equipment, setEquipment] = useState<any[]>([])

  async function loadData() {
    const { data: orderData } = await supabase.from('orders').select('*')
    const { data: equipmentData } = await supabase.from('equipment').select('*')

    setOrders(orderData || [])
    setEquipment(equipmentData || [])
  }

  useEffect(() => {
    loadData()

    const ordersChannel = supabase
      .channel('orders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          loadData()
        }
      )
      .subscribe()

    const equipmentChannel = supabase
      .channel('analytics-equipment-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'equipment' },
        () => {
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(equipmentChannel)
    }
  }, [])

  const totalOrders = orders.length
  const delayedOrders = orders.filter((o) => o.status === 'delayed').length
  const runningMachines = equipment.filter((m) => m.status === 'running').length
  const downMachines = equipment.filter((m) => m.status === 'down').length
  const avgOutput = equipment.length
    ? Math.round(
        equipment.reduce((sum, m) => sum + (m.output_percent ?? 0), 0) /
          equipment.length
      )
    : 0

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
        <h1 style={{ fontSize: '36px', margin: 0 }}>AI Control Panel</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Live realtime analytics and machine intelligence
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>Efficiency</div>
          <div style={valueStyle}>{avgOutput}%</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Total Orders</div>
          <div style={valueStyle}>{totalOrders}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Predicted Delays</div>
          <div style={{ ...valueStyle, color: '#fde68a' }}>{delayedOrders}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Risk Alerts</div>
          <div style={{ ...valueStyle, color: '#fca5a5' }}>{downMachines}</div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr 1fr',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        <div style={panelStyle}>
          <h2 style={panelTitle}>AI Recommendations</h2>

          <ActionBox
            title="Reassign workload"
            body="Move 30% of die cutting demand to the strongest available line."
            button="Execute"
          />
          <ActionBox
            title="Adjust material order"
            body="Increase corrugated board reserves for delayed and loading orders."
            button="Review"
          />
          <ActionBox
            title="Optimize shift schedule"
            body="Add maintenance coverage to hours with highest downtime risk."
            button="Apply"
          />
        </div>

        <div style={panelStyle}>
          <h2 style={panelTitle}>Predictive Analytics</h2>

          <div
            style={{
              height: '280px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.06)',
              background:
                'linear-gradient(180deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))',
              position: 'relative',
              overflow: 'hidden',
              padding: '20px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(circle at 20% 70%, rgba(239,68,68,0.20), transparent 20%), radial-gradient(circle at 45% 50%, rgba(250,204,21,0.18), transparent 20%), radial-gradient(circle at 75% 40%, rgba(34,197,94,0.16), transparent 18%), radial-gradient(circle at 88% 25%, rgba(56,189,248,0.18), transparent 18%)',
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ color: '#94a3b8', marginBottom: '14px' }}>
                Next 7 Days Forecast
              </div>

              <div style={{ display: 'grid', gap: '12px' }}>
                <StatRow label="Downtime Risk" value={`${downMachines * 12}%`} />
                <StatRow label="Expected Delay" value={`${delayedOrders + 2} hrs`} />
                <StatRow label="Output Stability" value={`${avgOutput}%`} />
                <StatRow
                  label="Machine Availability"
                  value={`${runningMachines}/${equipment.length || 0}`}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '12px',
              marginTop: '16px',
            }}
          >
            <MiniCard title="Production Forecast" value="+12%" color="#86efac" />
            <MiniCard title="Cost Savings" value="-8%" color="#7dd3fc" />
            <MiniCard title="Downtime Reduction" value="-2.5h" color="#fde68a" />
          </div>
        </div>

        <div style={panelStyle}>
          <h2 style={panelTitle}>Anomaly Detection</h2>

          {equipment
            .filter((m) => m.status === 'down' || m.alert)
            .slice(0, 3)
            .map((machine) => (
              <div
                key={machine.id}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  marginBottom: '12px',
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.35)',
                }}
              >
                <div style={{ fontWeight: 700 }}>{machine.machine_name}</div>
                <div style={{ color: '#fca5a5', marginTop: '6px' }}>
                  {machine.alert || 'Machine status anomaly detected'}
                </div>
              </div>
            ))}

          <div
            style={{
              marginTop: '18px',
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(56,189,248,0.08)',
              border: '1px solid rgba(56,189,248,0.2)',
              color: '#cbd5e1',
            }}
          >
            AI is monitoring order delays, equipment failures, and production output in real time.
          </div>
        </div>
      </div>
    </main>
  )
}

const cardStyle = {
  background: 'rgba(15,23,42,0.88)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '18px',
  padding: '18px',
} as const

const labelStyle = {
  color: '#94a3b8',
  marginBottom: '8px',
} as const

const valueStyle = {
  fontSize: '34px',
  fontWeight: 800,
} as const

const panelStyle = {
  background: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '18px',
  padding: '18px',
} as const

const panelTitle = {
  marginTop: 0,
  marginBottom: '16px',
  fontSize: '24px',
} as const

function ActionBox({
  title,
  body,
  button,
}: {
  title: string
  body: string
  button: string
}) {
  return (
    <div
      style={{
        padding: '14px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '12px',
      }}
    >
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ color: '#cbd5e1', marginTop: '8px', marginBottom: '10px' }}>{body}</div>
      <button
        style={{
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          padding: '8px 14px',
          cursor: 'pointer',
        }}
      >
        {button}
      </button>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function MiniCard({
  title,
  value,
  color,
}: {
  title: string
  value: string
  color: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '14px',
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: '13px' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: 800, marginTop: '8px', color }}>
        {value}
      </div>
    </div>
  )
}