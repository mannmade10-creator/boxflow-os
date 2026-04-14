'use client'
import React, { useState, useEffect } from 'react'

const machines = [
  {
    id: 'MCH-001',
    name: 'Atlas Corrugator',
    type: 'Corrugator',
    status: 'RUNNING',
    color: '#22c55e',
    operator: 'James Carter',
    shift: 'Day Shift',
    speed: 420,
    maxSpeed: 500,
    paperRoll: {
      id: 'ROLL-A142',
      type: 'B-Flute Liner',
      width: 98,
      diameter: 60,
      weight: 2400,
      remaining: 68,
      rolloutTime: 47,
    },
    output: { today: 2840, target: 3000, unit: 'boxes' },
    efficiency: 94,
    temp: 182,
    pressure: 42,
    nextMaintenance: '3 days',
    currentOrder: 'ORD-1011',
    paperUsedPerOrder: 340,
  },
  {
    id: 'MCH-002',
    name: 'Titan Flexo',
    type: 'Flexo Folder Gluer',
    status: 'RUNNING',
    color: '#b4c5ff',
    operator: 'Angela Brooks',
    shift: 'Day Shift',
    speed: 280,
    maxSpeed: 350,
    paperRoll: {
      id: 'ROLL-B089',
      type: 'C-Flute Double Wall',
      width: 110,
      diameter: 72,
      weight: 3100,
      remaining: 42,
      rolloutTime: 28,
    },
    output: { today: 1920, target: 2400, unit: 'boxes' },
    efficiency: 80,
    temp: 175,
    pressure: 38,
    nextMaintenance: '1 week',
    currentOrder: 'ORD-1010',
    paperUsedPerOrder: 520,
  },
  {
    id: 'MCH-003',
    name: 'Hercules Die Cutter',
    type: 'Rotary Die Cutter',
    status: 'OFFLINE',
    color: '#ef4444',
    operator: 'Unassigned',
    shift: 'N/A',
    speed: 0,
    maxSpeed: 300,
    paperRoll: {
      id: 'ROLL-C034',
      type: 'E-Flute Heavy Duty',
      width: 85,
      diameter: 48,
      weight: 1800,
      remaining: 91,
      rolloutTime: 0,
    },
    output: { today: 0, target: 1800, unit: 'boxes' },
    efficiency: 0,
    temp: 0,
    pressure: 0,
    nextMaintenance: 'OVERDUE',
    currentOrder: 'None',
    paperUsedPerOrder: 0,
  },
  {
    id: 'MCH-004',
    name: 'Zeus Printer',
    type: 'Digital Printer',
    status: 'IDLE',
    color: '#f59e0b',
    operator: 'Marcus Reed',
    shift: 'Day Shift',
    speed: 0,
    maxSpeed: 200,
    paperRoll: {
      id: 'ROLL-D201',
      type: 'Kraft Liner Premium',
      width: 76,
      diameter: 54,
      weight: 2100,
      remaining: 85,
      rolloutTime: 0,
    },
    output: { today: 640, target: 1200, unit: 'sheets' },
    efficiency: 53,
    temp: 92,
    pressure: 0,
    nextMaintenance: '2 weeks',
    currentOrder: 'Standby',
    paperUsedPerOrder: 180,
  },
]

const warehouse = [
  { id: 'ROLL-A142', type: 'B-Flute Liner', width: 98, diameter: 60, weight: 2400, qty: 12, location: 'Bay A-1', status: 'IN USE', color: '#22c55e' },
  { id: 'ROLL-B089', type: 'C-Flute Double Wall', width: 110, diameter: 72, weight: 3100, qty: 8, location: 'Bay B-2', status: 'IN USE', color: '#b4c5ff' },
  { id: 'ROLL-C034', type: 'E-Flute Heavy Duty', width: 85, diameter: 48, weight: 1800, qty: 15, location: 'Bay C-3', status: 'STORED', color: '#94a3b8' },
  { id: 'ROLL-D201', type: 'Kraft Liner Premium', width: 76, diameter: 54, weight: 2100, qty: 6, location: 'Bay D-1', status: 'LOW', color: '#f59e0b' },
  { id: 'ROLL-E055', type: 'White Top Liner', width: 102, diameter: 66, weight: 2800, qty: 20, location: 'Bay E-2', status: 'STORED', color: '#94a3b8' },
  { id: 'ROLL-F112', type: 'Recycled Medium', width: 92, diameter: 58, weight: 2200, qty: 3, location: 'Bay F-1', status: 'CRITICAL', color: '#ef4444' },
]

const orders = [
  { id: 'ORD-1011', client: 'Lopez Foods', product: 'B-Flute Box 12x10x8', qty: 5000, paperNeeded: 1700, machine: 'MCH-001', status: 'IN PRODUCTION', progress: 68, color: '#22c55e' },
  { id: 'ORD-1010', client: 'Amazon Vendor', product: 'C-Flute Box 18x14x12', qty: 3000, paperNeeded: 1560, machine: 'MCH-002', status: 'IN PRODUCTION', progress: 42, color: '#b4c5ff' },
  { id: 'ORD-1012', client: 'Retail Packaging', product: 'E-Flute Display Box', qty: 2000, paperNeeded: 680, machine: 'Pending', status: 'QUEUED', progress: 0, color: '#f59e0b' },
  { id: 'ORD-1009', client: 'ACME Corp', product: 'Kraft Mailer Box', qty: 1500, paperNeeded: 270, machine: 'MCH-004', status: 'COMPLETE', progress: 100, color: '#22c55e' },
]

export default function ProductionPage() {
  const [time, setTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('machines')
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const selected = machines.find(m => m.id === selectedMachine)

  return (
    <div style={{ minHeight: '100vh', background: '#0c1324', color: '#dce1fb', fontFamily: 'Inter, Arial, sans-serif', display: 'flex' }}>

      {/* SIDEBAR */}
      <aside style={{ width: 200, background: '#151b2d', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }} className="prod-sidebar">
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(180,197,255,0.04)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
            <img src="/assets/logo.png" style={{ width: 28, height: 28 }} alt="logo" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase' }}>BOXFLOW</span>
          </a>
          <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Production</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#dce1fb', letterSpacing: 1 }}>FLOOR_CONTROL</div>
        </div>
        <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { icon: '📊', label: 'DASHBOARD', href: '/dashboard' },
            { icon: '⚙️', label: 'COMMAND', href: '/command-center' },
            { icon: '🚛', label: 'FLEET', href: '/fleet-map' },
            { icon: '📋', label: 'DISPATCH', href: '/dispatch' },
            { icon: '🏭', label: 'PRODUCTION', href: '/production', active: true },
            { icon: '🤖', label: 'AI PANEL', href: '/executive' },
            { icon: '👥', label: 'HR', href: '/hr' },
            { icon: '📈', label: 'ANALYTICS', href: '/analytics' },
            { icon: '📦', label: 'ORDERS', href: '/orders' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 2, background: item.active ? 'linear-gradient(135deg, rgba(37,99,235,0.85), rgba(29,78,216,0.75))' : 'transparent', color: item.active ? '#fff' : 'rgba(195,198,215,0.45)', textDecoration: 'none', fontWeight: item.active ? 800 : 500, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', boxShadow: item.active ? '0 0 16px rgba(37,99,235,0.2)' : 'none' }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(180,197,255,0.04)' }}>
          <button onClick={async () => { const { supabase } = await import('@/lib/supabase'); await supabase.auth.signOut(); window.location.href = '/'; }} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 2, color: 'rgba(252,165,165,0.5)', fontWeight: 700, cursor: 'pointer', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>🚪 SIGN OUT</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 200, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="prod-main">

        {/* TOP BAR */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(12,19,36,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(180,197,255,0.06)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 10, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Production Floor</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#dce1fb', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>FLOOR_CONTROL</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, color: 'rgba(195,198,215,0.4)', fontFamily: 'monospace' }}>{time.toLocaleTimeString()}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 3, padding: '4px 12px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>2 OF 4 LINES ACTIVE</span>
            </div>
          </div>
        </header>

        {/* KPI ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'rgba(180,197,255,0.04)', flexShrink: 0 }}>
          {[
            { label: 'MACHINES ACTIVE', value: '2/4', color: '#22c55e' },
            { label: 'TOTAL OUTPUT TODAY', value: '5,400', color: '#b4c5ff' },
            { label: 'FLOOR EFFICIENCY', value: '67%', color: '#f59e0b' },
            { label: 'PAPER ROLLS IN USE', value: '2', color: '#7bd0ff' },
            { label: 'ROLLS IN WAREHOUSE', value: '64', color: '#b4c5ff' },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: '#151b2d', padding: '16px 18px' }}>
              <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{kpi.label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: kpi.color, fontFamily: 'monospace', lineHeight: 1 }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', background: '#151b2d', borderBottom: '1px solid rgba(180,197,255,0.04)', flexShrink: 0 }}>
          {[
            { id: 'machines', label: '🏭 MACHINES' },
            { id: 'warehouse', label: '📦 PAPER WAREHOUSE' },
            { id: 'orders', label: '📋 ORDER PRODUCTION' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === tab.id ? '#b4c5ff' : 'rgba(195,198,215,0.35)', fontWeight: activeTab === tab.id ? 800 : 500, fontSize: 13, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* MACHINES TAB */}
          {activeTab === 'machines' && (
            <div style={{ display: 'grid', gridTemplateColumns: selectedMachine ? '1fr 1fr' : 'repeat(2, 1fr)', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignContent: 'start' }}>
                {machines.map(m => (
                  <div key={m.id} onClick={() => setSelectedMachine(selectedMachine === m.id ? null : m.id)} style={{ background: selectedMachine === m.id ? 'rgba(37,99,235,0.08)' : '#151b2d', borderRadius: 3, padding: 20, cursor: 'pointer', border: selectedMachine === m.id ? '1px solid rgba(180,197,255,0.2)' : '1px solid transparent', transition: 'all 0.2s', borderLeft: '3px solid ' + m.color }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace', marginBottom: 3 }}>{m.id}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(195,198,215,0.6)' }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.35)', marginTop: 2 }}>{m.type}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 2, background: m.color + '20', color: m.color, letterSpacing: 1 }}>{m.status}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '8px 12px' }}>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Operator</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#dce1fb' }}>{m.operator}</div>
                      </div>
                      <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '8px 12px' }}>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Speed</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#dce1fb', fontFamily: 'monospace' }}>{m.speed}/{m.maxSpeed} <span style={{ fontSize: 10, color: 'rgba(195,198,215,0.4)' }}>fpm</span></div>
                      </div>
                      <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '8px 12px' }}>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Order</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#b4c5ff', fontFamily: 'monospace' }}>{m.currentOrder}</div>
                      </div>
                      <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '8px 12px' }}>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Next Service</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: m.nextMaintenance === 'OVERDUE' ? '#ef4444' : '#dce1fb' }}>{m.nextMaintenance}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)' }}>Output: {m.output.today.toLocaleString()} / {m.output.target.toLocaleString()} {m.output.unit}</span>
                        <span style={{ fontSize: 11, color: m.color, fontWeight: 700, fontFamily: 'monospace' }}>{m.efficiency}%</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(12,19,36,0.6)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: m.efficiency + '%', background: 'linear-gradient(90deg, ' + m.color + '60, ' + m.color + ')', borderRadius: 999 }} />
                      </div>
                    </div>

                    <div style={{ background: 'rgba(12,19,36,0.4)', borderRadius: 2, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Active Roll: {m.paperRoll.id}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#dce1fb', marginBottom: 2 }}>{m.paperRoll.type}</div>
                          <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)' }}>{m.paperRoll.width}" wide · {m.paperRoll.diameter}" dia · {m.paperRoll.weight}lbs</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 20, fontWeight: 900, color: m.paperRoll.remaining < 30 ? '#ef4444' : '#22c55e', fontFamily: 'monospace' }}>{m.paperRoll.remaining}%</div>
                          <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)' }}>{m.paperRoll.rolloutTime > 0 ? m.paperRoll.rolloutTime + ' min left' : 'Idle'}</div>
                        </div>
                      </div>
                      <div style={{ marginTop: 8, height: 3, background: 'rgba(12,19,36,0.8)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: m.paperRoll.remaining + '%', background: m.paperRoll.remaining < 30 ? '#ef4444' : '#22c55e', borderRadius: 999 }} />
                      </div>
                    </div>

                    {selectedMachine !== m.id && (
                      <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(180,197,255,0.4)', textAlign: 'center' }}>TAP FOR FULL DETAILS →</div>
                    )}
                  </div>
                ))}
              </div>

              {/* MACHINE DETAIL PANEL */}
              {selected && (
                <div style={{ background: '#151b2d', borderRadius: 3, padding: 24, position: 'sticky', top: 20, alignSelf: 'start' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>{selected.id}</div>
                      <div style={{ fontSize: 15, color: 'rgba(195,198,215,0.5)' }}>{selected.name} · {selected.type}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 2, background: selected.color + '20', color: selected.color }}>{selected.status}</span>
                  </div>

                  <div style={{ fontSize: 12, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Machine Vitals</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
                    {[
                      { label: 'Speed', value: selected.speed + ' fpm', sub: 'max ' + selected.maxSpeed, color: '#b4c5ff' },
                      { label: 'Temp', value: selected.temp + '°F', sub: 'operating', color: selected.temp > 200 ? '#ef4444' : '#22c55e' },
                      { label: 'Pressure', value: selected.pressure + ' PSI', sub: 'operating', color: '#7bd0ff' },
                      { label: 'Efficiency', value: selected.efficiency + '%', sub: 'current rate', color: selected.efficiency > 80 ? '#22c55e' : '#f59e0b' },
                      { label: 'Output', value: selected.output.today.toLocaleString(), sub: selected.output.unit + ' today', color: '#b4c5ff' },
                      { label: 'Target', value: selected.output.target.toLocaleString(), sub: selected.output.unit, color: 'rgba(195,198,215,0.4)' },
                    ].map(v => (
                      <div key={v.label} style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{v.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: v.color, fontFamily: 'monospace', lineHeight: 1, marginBottom: 2 }}>{v.value}</div>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.3)' }}>{v.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: 12, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Active Paper Roll</div>
                  <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: 16, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace', marginBottom: 3 }}>{selected.paperRoll.id}</div>
                        <div style={{ fontSize: 13, color: 'rgba(195,198,215,0.5)' }}>{selected.paperRoll.type}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: selected.paperRoll.remaining < 30 ? '#ef4444' : '#22c55e', fontFamily: 'monospace' }}>{selected.paperRoll.remaining}%</div>
                        <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.35)' }}>remaining</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
                      {[
                        { label: 'Width', value: selected.paperRoll.width + '"' },
                        { label: 'Diameter', value: selected.paperRoll.diameter + '"' },
                        { label: 'Weight', value: selected.paperRoll.weight + ' lbs' },
                        { label: 'Rollout', value: selected.paperRoll.rolloutTime > 0 ? selected.paperRoll.rolloutTime + ' min' : 'Idle' },
                      ].map(d => (
                        <div key={d.label} style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '8px 10px', textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', marginBottom: 3 }}>{d.label}</div>
                          <div style={{ fontSize: 15, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>{d.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ height: 6, background: 'rgba(12,19,36,0.8)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: selected.paperRoll.remaining + '%', background: selected.paperRoll.remaining < 30 ? 'linear-gradient(90deg, #ef444460, #ef4444)' : 'linear-gradient(90deg, #22c55e60, #22c55e)', borderRadius: 999, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Current Order</div>
                  <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: 16, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>{selected.currentOrder}</span>
                      <span style={{ fontSize: 12, color: 'rgba(195,198,215,0.4)' }}>Paper per unit: {selected.paperUsedPerOrder} sq ft</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(195,198,215,0.4)', marginBottom: 8 }}>Operator: {selected.operator} · {selected.shift}</div>
                    <div style={{ fontSize: 12, color: 'rgba(195,198,215,0.4)' }}>Next maintenance: <span style={{ color: selected.nextMaintenance === 'OVERDUE' ? '#ef4444' : '#22c55e', fontWeight: 700 }}>{selected.nextMaintenance}</span></div>
                  </div>

                  <button onClick={() => setSelectedMachine(null)} style={{ width: '100%', padding: '10px', background: 'rgba(180,197,255,0.06)', border: '1px solid rgba(180,197,255,0.12)', borderRadius: 2, color: '#b4c5ff', fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>CLOSE DETAILS</button>
                </div>
              )}
            </div>
          )}

          {/* WAREHOUSE TAB */}
          {activeTab === 'warehouse' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'TOTAL ROLLS IN STOCK', value: '64', color: '#b4c5ff' },
                  { label: 'ROLLS IN USE', value: '2', color: '#22c55e' },
                  { label: 'LOW STOCK ALERTS', value: '2', color: '#ef4444' },
                ].map(s => (
                  <div key={s.label} style={{ background: '#151b2d', borderRadius: 3, padding: '16px 20px' }}>
                    <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {warehouse.map(roll => (
                  <div key={roll.id} style={{ background: '#151b2d', borderRadius: 3, padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', gap: 16, alignItems: 'center', borderLeft: '3px solid ' + roll.color }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace', marginBottom: 3 }}>{roll.id}</div>
                      <div style={{ fontSize: 12, color: 'rgba(195,198,215,0.4)' }}>{roll.type}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Width</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>{roll.width}"</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Diameter</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>{roll.diameter}"</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Weight</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>{roll.weight} lbs</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Qty in Stock</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: roll.qty <= 3 ? '#ef4444' : roll.qty <= 6 ? '#f59e0b' : '#22c55e', fontFamily: 'monospace' }}>{roll.qty}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', marginBottom: 4 }}>{roll.location}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 2, background: roll.color + '20', color: roll.color }}>{roll.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div style={{ display: 'grid', gap: 16 }}>
              {orders.map(o => (
                <div key={o.id} style={{ background: '#151b2d', borderRadius: 3, padding: 24, borderLeft: '3px solid ' + o.color }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace', marginBottom: 4 }}>{o.id}</div>
                      <div style={{ fontSize: 14, color: 'rgba(195,198,215,0.5)', marginBottom: 2 }}>{o.client}</div>
                      <div style={{ fontSize: 13, color: 'rgba(195,198,215,0.35)' }}>{o.product}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 2, background: o.color + '20', color: o.color }}>{o.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
                    {[
                      { label: 'Order Qty', value: o.qty.toLocaleString() + ' units', color: '#dce1fb' },
                      { label: 'Paper Required', value: o.paperNeeded + ' lbs', color: '#7bd0ff' },
                      { label: 'Machine', value: o.machine, color: '#b4c5ff' },
                      { label: 'Progress', value: o.progress + '%', color: o.color },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '12px 14px' }}>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'rgba(195,198,215,0.4)' }}>Production Progress</span>
                      <span style={{ fontSize: 12, color: o.color, fontWeight: 700, fontFamily: 'monospace' }}>{o.progress}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(12,19,36,0.6)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: o.progress + '%', background: 'linear-gradient(90deg, ' + o.color + '60, ' + o.color + ')', borderRadius: 999 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <nav className="prod-mobile-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'none', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 20px', background: 'rgba(12,19,36,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(180,197,255,0.06)', zIndex: 100 }}>
        {[
          { icon: '📊', label: 'HOME', href: '/dashboard' },
          { icon: '⚙️', label: 'CMD', href: '/command-center' },
          { icon: '🚛', label: 'FLEET', href: '/fleet-map' },
          { icon: '🏭', label: 'PROD', href: '/production', active: true },
          { icon: '🤖', label: 'AI', href: '/executive' },
        ].map(item => (
          <a key={item.label} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: item.active ? '#b4c5ff' : 'rgba(195,198,215,0.35)', textDecoration: 'none', background: item.active ? 'rgba(37,99,235,0.12)' : 'transparent', padding: '6px 14px', borderRadius: 2 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2 }}>{item.label}</span>
          </a>
        ))}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .prod-sidebar { display: none !important; }
          .prod-main { margin-left: 0 !important; padding-bottom: 70px; }
          .prod-mobile-nav { display: flex !important; }
        }
      `}</style>
          <nav className="mobile-bottom-nav">
        <a href="/dashboard"><span className="icon">??</span>HOME</a>
        <a href="/command-center"><span className="icon">??</span>CMD</a>
        <a href="/fleet-map"><span className="icon">??</span>FLEET</a>
        <a href="/production" className="active"><span className="icon">??</span>PROD</a>
        <a href="/executive"><span className="icon">??</span>AI</a>
      </nav>
          <nav className="mobile-bottom-nav"><a href="/dashboard"><span>??</span>HOME</a><a href="/command-center"><span>??</span>CMD</a><a href="/fleet-map"><span>??</span>FLEET</a><a href="/production" className="active"><span>??</span>PROD</a><a href="/executive"><span>??</span>AI</a></nav></div>)}