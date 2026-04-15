'use client'
import React, { useState } from 'react'

const initialLoads = [
  { id: '1', orderNum: 'ORD-1012', client: 'Retail Packaging Co', route: 'OKC to Dallas', priority: 'Urgent', status: 'Pending', truck: 'Unassigned', driver: 'Unassigned', eta: 'Awaiting dispatch', alert: null },
  { id: '2', orderNum: 'ORD-1011', client: 'Lopez Foods', route: 'Tulsa to Fort Worth', priority: 'Rush', status: 'Assigned', truck: 'TRK-305', driver: 'Angela Brooks', eta: '3h 10m', alert: null },
  { id: '3', orderNum: 'ORD-1010', client: 'Amazon Vendor', route: 'Norman to Kansas City', priority: 'Standard', status: 'In Transit', truck: 'TRK-201', driver: 'Marcus Hill', eta: '2h 05m', alert: 'Heavy traffic on I-35. AI suggests HWY-270. Saves 18 min.' },
  { id: '4', orderNum: 'ORD-1009', client: 'ACME Corp', route: 'OKC to Little Rock', priority: 'Standard', status: 'Delivered', truck: 'TRK-114', driver: 'Derrick Stone', eta: 'Complete', alert: null },
  { id: '5', orderNum: 'ORD-1008', client: 'BoxMart', route: 'Edmond to Memphis', priority: 'Rush', status: 'Pending', truck: 'Unassigned', driver: 'Unassigned', eta: 'Awaiting dispatch', alert: null },
  { id: '6', orderNum: 'ORD-1007', client: 'SupplyHub', route: 'OKC to Houston', priority: 'Standard', status: 'Assigned', truck: 'TRK-412', driver: 'James Carter', eta: '4h 30m', alert: null },
  { id: '7', orderNum: 'ORD-1006', client: 'PackRight', route: 'Tulsa to St. Louis', priority: 'Urgent', status: 'In Transit', truck: 'TRK-518', driver: 'Lisa Monroe', eta: '1h 45m', alert: 'TRK-518 engine warning. AI rerouting to nearest service in Joplin MO.' },
  { id: '8', orderNum: 'ORD-1005', client: 'RetailCo', route: 'OKC to Denver', priority: 'Standard', status: 'Delivered', truck: 'TRK-305', driver: 'Angela Brooks', eta: 'Complete', alert: null },
]

const columns = ['Pending', 'Assigned', 'In Transit', 'Delivered']
const colColors = { 'Pending': '#f59e0b', 'Assigned': '#3b82f6', 'In Transit': '#8b5cf6', 'Delivered': '#22c55e' }
const priColors = { 'Urgent': { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5' }, 'Rush': { bg: 'rgba(245,158,11,0.15)', color: '#fde68a' }, 'Standard': { bg: 'rgba(148,163,184,0.15)', color: '#cbd5e1' } }

export default function DispatchPage() {
  const [loads, setLoads] = useState(initialLoads)
  const [dragId, setDragId] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [rerouted, setRerouted] = useState([])
  const [time, setTime] = useState(new Date())

  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const onDragStart = (e, id) => { setDragId(id); e.dataTransfer.effectAllowed = 'move' }
  const onDragOver = (e, col) => { e.preventDefault(); setDragOver(col) }
  const onDrop = (e, col) => {
    e.preventDefault()
    if (dragId) setLoads(prev => prev.map(l => l.id === dragId ? { ...l, status: col } : l))
    setDragId(null)
    setDragOver(null)
  }
  const applyReroute = (id) => {
    setRerouted(prev => [...prev, id])
    setLoads(prev => prev.map(l => l.id === id ? { ...l, alert: null } : l))
  }

  const alerts = loads.filter(l => l.alert)

  return (
    <div style={{ minHeight: '100vh', background: '#0c1324', color: '#dce1fb', fontFamily: 'Inter, Arial, sans-serif', display: 'flex' }}>
      <aside style={{ width: 200, background: '#151b2d', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }} className="dispatch-sidebar">
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(180,197,255,0.04)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
            <img src="/assets/logo.png" style={{ width: 28, height: 28 }} alt="logo" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase' }}>BOXFLOW</span>
          </a>
          <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Operations</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#dce1fb', letterSpacing: 1 }}>DISPATCH</div>
        </div>
        <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { icon: '📊', label: 'DASHBOARD', href: '/dashboard' },
            { icon: '⚙️', label: 'COMMAND', href: '/command-center' },
            { icon: '🚛', label: 'FLEET', href: '/fleet-map' },
            { icon: '📋', label: 'DISPATCH', href: '/dispatch', active: true },
            { icon: '🏭', label: 'PRODUCTION', href: '/production' },
            { icon: '🤖', label: 'AI PANEL', href: '/executive' },
            { icon: '📦', label: 'ORDERS', href: '/orders' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 2, background: item.active ? 'linear-gradient(135deg, rgba(37,99,235,0.85), rgba(29,78,216,0.75))' : 'transparent', color: item.active ? '#fff' : 'rgba(195,198,215,0.45)', textDecoration: 'none', fontWeight: item.active ? 800 : 500, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}
            </a>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(180,197,255,0.04)' }}>
          <button onClick={async () => { const { supabase } = await import('@/lib/supabase'); await supabase.auth.signOut(); window.location.href = '/'; }} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 2, color: 'rgba(252,165,165,0.5)', fontWeight: 700, cursor: 'pointer', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>SIGN OUT</button>
        </div>
      </aside>

      <main style={{ marginLeft: 200, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="dispatch-main">
        <header style={{ position: 'sticky', top: 0, zIndex: 40, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(12,19,36,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(180,197,255,0.06)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 10, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Operations Hub</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#dce1fb', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>DISPATCH CENTER</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {alerts.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 3, padding: '4px 12px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>{alerts.length} AI ALERTS</span>
              </div>
            )}
            <span style={{ fontSize: 13, color: 'rgba(195,198,215,0.4)', fontFamily: 'monospace' }}>{time.toLocaleTimeString()}</span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(180,197,255,0.04)', flexShrink: 0 }}>
          {[
            { label: 'TOTAL LOADS', value: loads.length, color: '#b4c5ff' },
            { label: 'IN TRANSIT', value: loads.filter(l => l.status === 'In Transit').length, color: '#8b5cf6' },
            { label: 'PENDING', value: loads.filter(l => l.status === 'Pending').length, color: '#f59e0b' },
            { label: 'DELIVERED', value: loads.filter(l => l.status === 'Delivered').length, color: '#22c55e' },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: '#151b2d', padding: '16px 18px' }}>
              <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{kpi.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: kpi.color, fontFamily: 'monospace', lineHeight: 1 }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {alerts.length > 0 && (
          <div style={{ padding: '12px 20px', background: 'rgba(239,68,68,0.04)', borderBottom: '1px solid rgba(239,68,68,0.1)', flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>AI REROUTING ALERTS</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {alerts.map(load => (
                <div key={load.id} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 3, padding: '10px 14px', flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#fca5a5' }}>{load.orderNum} - {load.truck}</span>
                    <span style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)' }}>{load.driver}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(195,198,215,0.6)', margin: '0 0 10px', lineHeight: 1.5 }}>{load.alert}</p>
                  <button onClick={() => applyReroute(load.id)} style={{ padding: '6px 16px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none', borderRadius: 2, color: '#fff', fontWeight: 800, fontSize: 11, cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase' }}>APPLY AI REROUTE</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowX: 'auto', padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(240px, 1fr))', gap: 12, minWidth: 960 }}>
            {columns.map(col => (
              <div key={col} onDragOver={e => onDragOver(e, col)} onDrop={e => onDrop(e, col)} style={{ background: dragOver === col ? 'rgba(37,99,235,0.05)' : '#151b2d', borderRadius: 4, padding: 12, border: dragOver === col ? '2px dashed rgba(37,99,235,0.4)' : '2px solid transparent', transition: 'all 0.2s', minHeight: 400 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colColors[col] }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#dce1fb', letterSpacing: 2, textTransform: 'uppercase' }}>{col}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colColors[col], background: colColors[col] + '20', padding: '2px 8px', borderRadius: 2 }}>{loads.filter(l => l.status === col).length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {loads.filter(l => l.status === col).map(load => (
                    <div key={load.id} draggable onDragStart={e => onDragStart(e, load.id)} style={{ background: dragId === load.id ? 'rgba(37,99,235,0.1)' : '#0c1324', borderRadius: 3, padding: 14, cursor: 'grab', border: '1px solid rgba(180,197,255,0.06)', borderLeft: '3px solid ' + colColors[col], opacity: dragId === load.id ? 0.5 : 1, transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>{load.orderNum}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: priColors[load.priority].bg, color: priColors[load.priority].color }}>{load.priority}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(195,198,215,0.8)', marginBottom: 4 }}>{load.client}</div>
                      <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', marginBottom: 8 }}>{load.route}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        <div style={{ background: 'rgba(180,197,255,0.04)', borderRadius: 2, padding: '4px 8px' }}>
                          <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', marginBottom: 1 }}>TRUCK</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#b4c5ff' }}>{load.truck}</div>
                        </div>
                        <div style={{ background: 'rgba(180,197,255,0.04)', borderRadius: 2, padding: '4px 8px' }}>
                          <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', marginBottom: 1 }}>ETA</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: load.status === 'Delivered' ? '#22c55e' : '#dce1fb' }}>{load.eta}</div>
                        </div>
                      </div>
                      {load.alert && <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(239,68,68,0.08)', borderRadius: 2, border: '1px solid rgba(239,68,68,0.15)' }}><span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700 }}>AI ALERT - SEE ABOVE</span></div>}
                      {rerouted.includes(load.id) && <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(34,197,94,0.08)', borderRadius: 2, border: '1px solid rgba(34,197,94,0.15)' }}><span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>REROUTED BY AI</span></div>}
                      <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(180,197,255,0.25)', textAlign: 'center' }}>DRAG TO MOVE</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .dispatch-sidebar { display: none !important; }
          .dispatch-main { margin-left: 0 !important; padding-bottom: 80px !important; }
        }
      `}</style>
    </div>
  )
}