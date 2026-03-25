'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [running, setRunning] = useState(false)
  const [lastRun, setLastRun] = useState<string>('Not started')
  const [presentationMode, setPresentationMode] = useState(true)

  const [fleetCount, setFleetCount] = useState(0)
  const [activeLoads, setActiveLoads] = useState(0)
  const [delayedTrucks, setDelayedTrucks] = useState(0)
  const [machinesDown, setMachinesDown] = useState(0)

  async function loadStats() {
    const { data: fleet } = await supabase.from('fleet').select('*')
    const { data: orders } = await supabase.from('orders').select('*')
    const { data: equipment } = await supabase.from('equipment').select('*')

    const fleetRows = fleet || []
    const orderRows = orders || []
    const equipmentRows = equipment || []

    setFleetCount(fleetRows.length)
    setActiveLoads(
      orderRows.filter(
        (o: any) => o.status === 'assigned' || o.status === 'in_transit' || o.status === 'at_pickup'
      ).length
    )
    setDelayedTrucks(fleetRows.filter((t: any) => t.status === 'delayed').length)
    setMachinesDown(equipmentRows.filter((m: any) => m.status === 'down').length)
  }

  useEffect(() => {
    loadStats()

    const fleetChannel = supabase
      .channel('dashboard-fleet-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fleet' }, () => loadStats())
      .subscribe()

    const ordersChannel = supabase
      .channel('dashboard-orders-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadStats())
      .subscribe()

    const equipmentChannel = supabase
      .channel('dashboard-equipment-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, () => loadStats())
      .subscribe()

    return () => {
      supabase.removeChannel(fleetChannel)
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(equipmentChannel)
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (running) {
      interval = setInterval(async () => {
        try {
          await fetch('/api/demo-tick', { method: 'POST' })
          setLastRun(new Date().toLocaleTimeString())
          await loadStats()
        } catch {}
      }, 6000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [running])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #020617 0%, #0b1220 45%, #111827 100%)',
        color: 'white',
        padding: presentationMode ? '32px' : '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: presentationMode ? '46px' : '36px',
              margin: 0,
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            BoxFlow OS
          </h1>
          <div
            style={{
              color: '#94a3b8',
              marginTop: '10px',
              fontSize: presentationMode ? '18px' : '15px',
            }}
          >
            Executive Presentation Mode
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Badge text={presentationMode ? 'PRESENTATION MODE' : 'STANDARD MODE'} color="#22c55e" />
          <Badge text={running ? 'DEMO RUNNING' : 'DEMO STOPPED'} color={running ? '#2563eb' : '#f59e0b'} />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '18px',
          marginBottom: '28px',
        }}
      >
        <KpiCard title="Fleet Units" value={fleetCount} accent="#38bdf8" big={presentationMode} />
        <KpiCard title="Active Loads" value={activeLoads} accent="#22c55e" big={presentationMode} />
        <KpiCard title="Delayed Trucks" value={delayedTrucks} accent="#facc15" big={presentationMode} />
        <KpiCard title="Machines Down" value={machinesDown} accent="#ef4444" big={presentationMode} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: presentationMode ? '1.2fr 0.8fr' : '1fr 1fr',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        <section style={panelStyle}>
          <div style={panelTitleStyle}>Command Summary</div>

          <div
            style={{
              fontSize: presentationMode ? '19px' : '16px',
              lineHeight: 1.7,
              color: '#cbd5e1',
            }}
          >
            BoxFlow OS is actively simulating real-time fleet movement, dispatch execution,
            equipment monitoring, and live order flow. This mode is designed for executive
            walkthroughs, investor presentations, and enterprise sales demos.
          </div>

          <div
            style={{
              marginTop: '20px',
              display: 'grid',
              gap: '12px',
            }}
          >
            <FeatureRow label="AI Dispatch" value="Active" />
            <FeatureRow label="Driver App" value="Connected" />
            <FeatureRow label="Client Portal" value="Live" />
            <FeatureRow label="Alerts & SMS" value="Demo Ready" />
            <FeatureRow label="Fleet Tracking" value="Realtime" />
          </div>
        </section>

        <section style={panelStyle}>
          <div style={panelTitleStyle}>Demo Controls</div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <button
              onClick={() => setRunning(true)}
              style={buttonStyle('#22c55e', '#020617')}
            >
              Start Demo Mode
            </button>

            <button
              onClick={() => setRunning(false)}
              style={buttonStyle('#ef4444', 'white')}
            >
              Stop Demo Mode
            </button>

            <button
              onClick={async () => {
                await fetch('/api/demo-tick', { method: 'POST' })
                setLastRun(new Date().toLocaleTimeString())
                await loadStats()
              }}
              style={buttonStyle('#2563eb', 'white')}
            >
              Run One Demo Tick
            </button>

            <button
              onClick={() => setPresentationMode((v) => !v)}
              style={buttonStyle('#64748b', 'white')}
            >
              Toggle Presentation Layout
            </button>
          </div>

          <div style={{ marginTop: '18px', color: '#94a3b8' }}>
            Last update: {lastRun}
          </div>
        </section>
      </div>

      <div
        style={{
          marginTop: '22px',
          ...panelStyle,
        }}
      >
        <div style={panelTitleStyle}>Presentation Talking Points</div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '14px',
          }}
        >
          <MiniPanel
            title="Operational Visibility"
            body="Monitor trucks, machines, and load status in one unified system."
          />
          <MiniPanel
            title="AI Decision Support"
            body="Use smart dispatch logic to assign the best truck faster and reduce delays."
          />
          <MiniPanel
            title="Client Experience"
            body="Give customers live tracking, better updates, and stronger trust."
          />
        </div>
      </div>
    </main>
  )
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        background: color,
        color: '#020617',
        padding: '8px 12px',
        borderRadius: '999px',
        fontWeight: 900,
        fontSize: '12px',
      }}
    >
      {text}
    </div>
  )
}

function KpiCard({
  title,
  value,
  accent,
  big,
}: {
  title: string
  value: number
  accent: string
  big: boolean
}) {
  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
        padding: big ? '24px' : '18px',
        boxShadow: `0 0 20px ${accent}18`,
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: big ? '15px' : '13px' }}>{title}</div>
      <div
        style={{
          fontSize: big ? '48px' : '34px',
          fontWeight: 900,
          marginTop: '10px',
          color: accent,
        }}
      >
        {value}
      </div>
    </div>
  )
}

function FeatureRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: '8px',
      }}
    >
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function MiniPanel({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '14px',
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: '8px' }}>{title}</div>
      <div style={{ color: '#cbd5e1', lineHeight: 1.6 }}>{body}</div>
    </div>
  )
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '18px',
  padding: '20px',
}

const panelTitleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 900,
  marginBottom: '14px',
}

function buttonStyle(background: string, color: string): React.CSSProperties {
  return {
    width: '100%',
    background,
    color,
    border: 'none',
    padding: '12px 14px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 800,
  }
}