'use client'
import React, { useState, useEffect } from 'react'

const trucks = [
  { id: 'TRK-201', driver: 'Marcus Reed', status: 'IN TRANSIT', route: 'OKC → Dallas', eta: '2:45 PM', progress: 75, fuel: 82, color: '#b4c5ff' },
  { id: 'TRK-305', driver: 'Angela Brooks', status: 'DELIVERED', route: 'Tulsa → FW', eta: 'Complete', progress: 100, fuel: 91, color: '#22c55e' },
  { id: 'TRK-412', driver: 'James Carter', status: 'DISPATCHED', route: 'OKC → Memphis', eta: '4:30 PM', progress: 35, fuel: 67, color: '#7bd0ff' },
  { id: 'TRK-518', driver: 'Lisa Monroe', status: 'IN TRANSIT', route: 'OKC → Houston', eta: '3:15 PM', progress: 60, fuel: 54, color: '#b4c5ff' },
]

const orders = [
  { id: 'ORD-1012', client: 'Retail Packaging Co', route: 'OKC → Dallas', status: 'Pending', priority: 'Urgent', color: '#ef4444' },
  { id: 'ORD-1011', client: 'Lopez Foods', route: 'Tulsa → Fort Worth', status: 'In Transit', priority: 'Rush', color: '#f59e0b' },
  { id: 'ORD-1010', client: 'Amazon Vendor', route: 'Norman → Kansas City', status: 'In Transit', priority: 'Standard', color: '#3b82f6' },
  { id: 'ORD-1009', client: 'ACME Corp', route: 'OKC → Little Rock', status: 'Delivered', priority: 'Standard', color: '#22c55e' },
  { id: 'ORD-1008', client: 'BoxMart', route: 'Edmond → Memphis', status: 'Pending', priority: 'Rush', color: '#f59e0b' },
]

const production = [
  { line: 'LINE_A', product: 'Corrugated B-Flute', output: 2840, target: 3000, status: 'RUNNING', efficiency: 94, color: '#22c55e' },
  { line: 'LINE_B', product: 'Double Wall C-Flute', output: 1920, target: 2400, status: 'RUNNING', efficiency: 80, color: '#b4c5ff' },
  { line: 'LINE_C', product: 'Heavy Duty E-Flute', output: 0, target: 1800, status: 'OFFLINE', efficiency: 0, color: '#ef4444' },
]

const alerts = [
  { type: 'CRITICAL', msg: 'LINE_C offline — maintenance required', time: '2m ago', color: '#ef4444' },
  { type: 'WARNING', msg: 'TRK-518 fuel at 54% — schedule refuel', time: '5m ago', color: '#f59e0b' },
  { type: 'AI', msg: 'Route optimization available for TRK-201', time: '8m ago', color: '#b4c5ff' },
  { type: 'INFO', msg: 'ORD-1012 awaiting truck assignment', time: '12m ago', color: '#7bd0ff' },
]

export default function CommandCenterPage() {
  const [time, setTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0c1324', color: '#dce1fb', fontFamily: 'Inter, Arial, sans-serif', display: 'flex' }}>

      {/* SIDEBAR */}
      <aside style={{ width: 200, background: '#151b2d', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }} className="cmd-sidebar">
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(180,197,255,0.04)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
            <img src="/assets/logo.png" style={{ width: 28, height: 28 }} alt="logo" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase' }}>BOXFLOW</span>
          </a>
          <div style={{ fontSize: 8, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Operations Hub</div>
          <div style={{ fontSize: 11, fontWeight: 900, color: '#dce1fb', letterSpacing: 1 }}>COMMAND_CENTER</div>
        </div>
        <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { icon: '📊', label: 'DASHBOARD', href: '/dashboard' },
            { icon: '⚙️', label: 'COMMAND', href: '/command-center', active: true },
            { icon: '🚛', label: 'FLEET', href: '/fleet-map' },
            { icon: '📋', label: 'DISPATCH', href: '/dispatch' },
            { icon: '🏭', label: 'PRODUCTION', href: '/production' },
            { icon: '🤖', label: 'AI PANEL', href: '/executive' },
            { icon: '👥', label: 'HR', href: '/hr' },
            { icon: '📈', label: 'ANALYTICS', href: '/analytics' },
            { icon: '📦', label: 'ORDERS', href: '/orders' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 2, background: item.active ? 'linear-gradient(135deg, rgba(37,99,235,0.85), rgba(29,78,216,0.75))' : 'transparent', color: item.active ? '#fff' : 'rgba(195,198,215,0.45)', textDecoration: 'none', fontWeight: item.active ? 800 : 500, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', boxShadow: item.active ? '0 0 16px rgba(37,99,235,0.2)' : 'none' }}>
              <span style={{ fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(180,197,255,0.04)' }}>
          <button onClick={async () => { const { supabase } = await import('@/lib/supabase'); await supabase.auth.signOut(); window.location.href = '/'; }} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 2, color: 'rgba(252,165,165,0.5)', fontWeight: 700, cursor: 'pointer', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' }}>🚪 SIGN_OUT</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: 200, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="cmd-main">

        {/* TOP BAR */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(12,19,36,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(180,197,255,0.06)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 8, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Operations Hub</div>
            <h1 style={{ fontSize: 18, fontWeight: 900, color: '#dce1fb', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>COMMAND_CENTER</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontFamily: 'monospace' }}>{time.toLocaleTimeString()}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 3, padding: '3px 10px' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ color: '#22c55e', fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>ALL SYSTEMS ONLINE</span>
            </div>
          </div>
        </header>

        {/* KPI ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: 'rgba(180,197,255,0.04)', flexShrink: 0 }}>
          {[
            { label: 'ACTIVE TRUCKS', value: '3', sub: 'of 8 fleet', color: '#b4c5ff' },
            { label: 'ORDERS TODAY', value: '24', sub: '5 pending', color: '#7bd0ff' },
            { label: 'PRODUCTION', value: '94%', sub: 'Line A efficiency', color: '#22c55e' },
            { label: 'ON TIME', value: '87%', sub: 'delivery rate', color: '#22c55e' },
            { label: 'ALERTS', value: '4', sub: '1 critical', color: '#ef4444' },
            { label: 'REVENUE TODAY', value: '$48K', sub: 'vs $52K target', color: '#b4c5ff' },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: '#151b2d', padding: '14px 16px' }}>
              <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{kpi.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: kpi.color, fontFamily: 'monospace', lineHeight: 1, marginBottom: 3 }}>{kpi.value}</div>
              <div style={{ fontSize: 8, color: 'rgba(195,198,215,0.3)' }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 0, background: '#151b2d', borderBottom: '1px solid rgba(180,197,255,0.04)', flexShrink: 0 }}>
          {[
            { id: 'overview', label: 'OVERVIEW' },
            { id: 'fleet', label: 'FLEET STATUS' },
            { id: 'orders', label: 'LIVE ORDERS' },
            { id: 'production', label: 'PRODUCTION' },
            { id: 'alerts', label: 'ALERTS' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '12px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === tab.id ? '#b4c5ff' : 'rgba(195,198,215,0.35)', fontWeight: activeTab === tab.id ? 800 : 500, fontSize: 9, cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>

              {/* Fleet Summary */}
              <div style={{ background: '#151b2d', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(180,197,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#dce1fb' }}>Fleet Status</span>
                  <a href="/fleet-map" style={{ fontSize: 8, color: '#b4c5ff', textDecoration: 'none', fontWeight: 700, letterSpacing: 1 }}>VIEW MAP →</a>
                </div>
                {trucks.map(t => (
                  <div key={t.id} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(180,197,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#dce1fb', fontFamily: 'monospace' }}>{t.id}</span>
                      <span style={{ fontSize: 7, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: t.color + '20', color: t.color }}>{t.status}</span>
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(195,198,215,0.4)', marginBottom: 4 }}>{t.driver} · {t.route}</div>
                    <div style={{ height: 2, background: 'rgba(12,19,36,0.6)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: t.progress + '%', background: t.color, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Orders Summary */}
              <div style={{ background: '#151b2d', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(180,197,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#dce1fb' }}>Live Orders</span>
                  <a href="/orders" style={{ fontSize: 8, color: '#b4c5ff', textDecoration: 'none', fontWeight: 700, letterSpacing: 1 }}>VIEW ALL →</a>
                </div>
                {orders.map(o => (
                  <div key={o.id} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(180,197,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#dce1fb', fontFamily: 'monospace' }}>{o.id}</span>
                      <span style={{ fontSize: 7, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: o.color + '20', color: o.color }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(195,198,215,0.4)', marginBottom: 2 }}>{o.client}</div>
                    <div style={{ fontSize: 8, color: 'rgba(195,198,215,0.25)' }}>{o.route}</div>
                  </div>
                ))}
              </div>

              {/* Production + Alerts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#151b2d', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(180,197,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#dce1fb' }}>Production Lines</span>
                    <a href="/production" style={{ fontSize: 8, color: '#b4c5ff', textDecoration: 'none', fontWeight: 700, letterSpacing: 1 }}>VIEW →</a>
                  </div>
                  {production.map(p => (
                    <div key={p.line} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(180,197,255,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#dce1fb', fontFamily: 'monospace' }}>{p.line}</span>
                        <span style={{ fontSize: 7, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: p.color + '20', color: p.color }}>{p.status}</span>
                      </div>
                      <div style={{ fontSize: 9, color: 'rgba(195,198,215,0.4)', marginBottom: 6 }}>{p.product} · {p.efficiency}% eff</div>
                      <div style={{ height: 2, background: 'rgba(12,19,36,0.6)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: (p.output / p.target * 100) + '%', background: p.color, borderRadius: 999 }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                        <span style={{ fontSize: 7, color: 'rgba(195,198,215,0.25)', fontFamily: 'monospace' }}>{p.output.toLocaleString()} units</span>
                        <span style={{ fontSize: 7, color: 'rgba(195,198,215,0.25)', fontFamily: 'monospace' }}>target: {p.target.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#151b2d', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(180,197,255,0.04)' }}>
                    <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#dce1fb' }}>Live Alerts</span>
                  </div>
                  {alerts.map((a, i) => (
                    <div key={i} style={{ padding: '8px 16px', borderBottom: '1px solid rgba(180,197,255,0.03)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: a.color, marginTop: 4, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 7, color: a.color, fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>{a.type}</div>
                        <div style={{ fontSize: 9, color: 'rgba(195,198,215,0.6)', lineHeight: 1.4 }}>{a.msg}</div>
                      </div>
                      <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.25)', flexShrink: 0 }}>{a.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FLEET TAB */}
          {activeTab === 'fleet' && (
            <div style={{ display: 'grid', gap: 12 }}>
              {trucks.map(t => (
                <div key={t.id} style={{ background: '#151b2d', borderRadius: 3, padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace', marginBottom: 4 }}>{t.id}</div>
                    <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.4)' }}>{t.driver}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>Route</div>
                    <div style={{ fontSize: 11, color: '#dce1fb', fontWeight: 700 }}>{t.route}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>ETA</div>
                    <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, fontFamily: 'monospace' }}>{t.eta}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>Fuel</div>
                    <div style={{ fontSize: 11, color: t.fuel < 60 ? '#ef4444' : '#22c55e', fontWeight: 700, fontFamily: 'monospace' }}>{t.fuel}%</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '4px 10px', borderRadius: 2, background: t.color + '20', color: t.color, letterSpacing: 1 }}>{t.status}</span>
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <a href="/fleet-map" style={{ display: 'inline-block', padding: '10px 24px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 3, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>OPEN LIVE FLEET MAP →</a>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div style={{ display: 'grid', gap: 12 }}>
              {orders.map(o => (
                <div key={o.id} style={{ background: '#151b2d', borderRadius: 3, padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace', marginBottom: 4 }}>{o.id}</div>
                    <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.4)' }}>{o.client}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>Route</div>
                    <div style={{ fontSize: 11, color: '#dce1fb', fontWeight: 700 }}>{o.route}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 3 }}>Priority</div>
                    <div style={{ fontSize: 11, color: o.color, fontWeight: 700 }}>{o.priority}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: '4px 10px', borderRadius: 2, background: o.color + '20', color: o.color, letterSpacing: 1 }}>{o.status}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <a href="/dispatch" style={{ fontSize: 8, color: '#b4c5ff', textDecoration: 'none', fontWeight: 700, letterSpacing: 1 }}>DISPATCH →</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRODUCTION TAB */}
          {activeTab === 'production' && (
            <div style={{ display: 'grid', gap: 12 }}>
              {production.map(p => (
                <div key={p.line} style={{ background: '#151b2d', borderRadius: 3, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace', marginBottom: 4 }}>{p.line}</div>
                      <div style={{ fontSize: 12, color: 'rgba(195,198,215,0.5)' }}>{p.product}</div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '4px 12px', borderRadius: 2, background: p.color + '20', color: p.color, letterSpacing: 1 }}>{p.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                    {[
                      { label: 'Output', value: p.output.toLocaleString() + ' units', color: '#dce1fb' },
                      { label: 'Target', value: p.target.toLocaleString() + ' units', color: 'rgba(195,198,215,0.4)' },
                      { label: 'Efficiency', value: p.efficiency + '%', color: p.color },
                    ].map(stat => (
                      <div key={stat.label} style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '10px 14px' }}>
                        <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{stat.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: stat.color, fontFamily: 'monospace' }}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 4, background: 'rgba(12,19,36,0.6)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: (p.output / p.target * 100) + '%', background: 'linear-gradient(90deg, ' + p.color + '60, ' + p.color + ')', borderRadius: 999 }} />
                  </div>
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <a href="/production" style={{ display: 'inline-block', padding: '10px 24px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 3, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>OPEN PRODUCTION FLOOR →</a>
              </div>
            </div>
          )}

          {/* ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div style={{ display: 'grid', gap: 12 }}>
              {alerts.map((a, i) => (
                <div key={i} style={{ background: '#151b2d', borderRadius: 3, padding: 20, display: 'flex', alignItems: 'flex-start', gap: 16, borderLeft: '3px solid ' + a.color }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, boxShadow: '0 0 8px ' + a.color, marginTop: 2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, color: a.color, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{a.type}</div>
                    <div style={{ fontSize: 14, color: '#dce1fb', fontWeight: 700, marginBottom: 4 }}>{a.msg}</div>
                    <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)' }}>{a.time}</div>
                  </div>
                  <button style={{ padding: '6px 14px', background: 'rgba(180,197,255,0.08)', border: '1px solid rgba(180,197,255,0.12)', borderRadius: 2, color: '#b4c5ff', fontSize: 8, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>RESOLVE</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <nav className="cmd-mobile-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'none', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 20px', background: 'rgba(12,19,36,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(180,197,255,0.06)', zIndex: 100 }}>
        {[
          { icon: '📊', label: 'HOME', href: '/dashboard' },
          { icon: '⚙️', label: 'CMD', href: '/command-center', active: true },
          { icon: '🚛', label: 'FLEET', href: '/fleet-map' },
          { icon: '🏭', label: 'PROD', href: '/production' },
          { icon: '🤖', label: 'AI', href: '/executive' },
        ].map(item => (
          <a key={item.label} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: item.active ? '#b4c5ff' : 'rgba(195,198,215,0.35)', textDecoration: 'none', background: item.active ? 'rgba(37,99,235,0.12)' : 'transparent', padding: '6px 14px', borderRadius: 2 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 7, fontWeight: 800, letterSpacing: 2 }}>{item.label}</span>
          </a>
        ))}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .cmd-sidebar { display: none !important; }
          .cmd-main { margin-left: 0 !important; padding-bottom: 70px; }
          .cmd-mobile-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}