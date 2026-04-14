'use client'
import React, { useState, useEffect } from 'react'
import FleetMapInner from './FleetMapInner'

const drivers = [
  { id: 'TRK-201', name: 'Marcus Reed', status: 'ON ROUTE', color: '#b4c5ff', bg: 'rgba(180,197,255,0.12)', eta: '2:45 PM', progress: 75, fuel: 82, location: 'I-35 N' },
  { id: 'TRK-305', name: 'Angela Brooks', status: 'DELIVERED', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', eta: 'Complete', progress: 100, fuel: 91, location: 'Depot 02' },
  { id: 'TRK-412', name: 'James Carter', status: 'DISPATCHED', color: '#7bd0ff', bg: 'rgba(123,208,255,0.12)', eta: '4:30 PM', progress: 35, fuel: 67, location: 'OKC Hub' },
  { id: 'TRK-518', name: 'Lisa Monroe', status: 'IN TRANSIT', color: '#b4c5ff', bg: 'rgba(180,197,255,0.12)', eta: '3:15 PM', progress: 60, fuel: 54, location: 'HWY-270' },
]

export default function FleetMapPage() {
  const [fullscreen, setFullscreen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0c1324', color: '#dce1fb', fontFamily: 'Inter, Arial, sans-serif' }}>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(12,19,36,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(180,197,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/assets/logo.png" style={{ width: 28, height: 28 }} alt="logo" />
            <span style={{ fontSize: 14, fontWeight: 900, color: '#2563eb', letterSpacing: 3, textTransform: 'uppercase' }}>BOXFLOW_OS</span>
          </a>
          <span style={{ color: 'rgba(180,197,255,0.15)', margin: '0 8px' }}>|</span>
          <span style={{ fontSize: 9, color: 'rgba(195,198,215,0.5)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>FLEET_COMMAND</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontFamily: 'monospace' }}>{time.toLocaleTimeString()}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 3, padding: '3px 10px' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ color: '#22c55e', fontSize: 9, fontWeight: 700, letterSpacing: 2 }}>GEO SYNC ACTIVE</span>
          </div>
          <a href="/dashboard" style={{ fontSize: 9, color: 'rgba(180,197,255,0.5)', textDecoration: 'none', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>BACK</a>
        </div>
      </header>

      {!fullscreen && (
        <aside style={{ position: 'fixed', left: 0, top: 56, bottom: 0, width: 200, background: '#151b2d', zIndex: 50, display: 'flex', flexDirection: 'column' }} className="kinetic-sidebar">
          <div style={{ padding: '20px 16px 12px' }}>
            <div style={{ fontSize: 8, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Navigation</div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#dce1fb', letterSpacing: 1 }}>KINETIC COMMAND</div>
          </div>
          <nav style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { icon: '📊', label: 'DASHBOARD', href: '/dashboard' },
              { icon: '📋', label: 'DISPATCH', href: '/dispatch' },
              { icon: '🚛', label: 'FLEET', href: '/fleet-map', active: true },
              { icon: '🏭', label: 'PRODUCTION', href: '/production' },
              { icon: '🤖', label: 'AI INSIGHTS', href: '/executive' },
              { icon: '👥', label: 'HR', href: '/hr' },
              { icon: '📈', label: 'ANALYTICS', href: '/analytics' },
              { icon: '📦', label: 'ORDERS', href: '/orders' },
            ].map(item => (
              <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 2, background: item.active ? 'linear-gradient(135deg, rgba(37,99,235,0.85), rgba(29,78,216,0.75))' : 'transparent', color: item.active ? '#fff' : 'rgba(195,198,215,0.45)', textDecoration: 'none', fontWeight: item.active ? 800 : 500, fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div style={{ padding: '12px 8px' }}>
            <button onClick={async () => { const { supabase } = await import('@/lib/supabase'); await supabase.auth.signOut(); window.location.href = '/'; }} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 2, color: 'rgba(252,165,165,0.5)', fontWeight: 700, cursor: 'pointer', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase' }}>SIGN OUT</button>
          </div>
        </aside>
      )}

      <main style={{ marginLeft: fullscreen ? 0 : 200, paddingTop: 56, minHeight: '100vh' }} className="kinetic-main">
        <div style={{ display: 'grid', gridTemplateColumns: fullscreen ? '1fr' : '1fr 280px', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {!fullscreen && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: '#0c1324', flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: 8, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>System Status: Optimal</div>
                  <h1 style={{ fontSize: 20, fontWeight: 900, color: '#dce1fb', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>FLEET TRACKING</h1>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { label: 'ACTIVE', value: '3/8', color: '#b4c5ff' },
                    { label: 'ALERTS', value: '03', color: '#ef4444' },
                    { label: 'ON ROUTE', value: '3', color: '#22c55e' },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: '#151b2d', padding: '6px 12px', borderRadius: 3, textAlign: 'right' }}>
                      <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>{stat.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', background: '#191f31' }}>
              <FleetMapInner />
              <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(37,99,235,0.015) 50%)', backgroundSize: '100% 3px' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 10, pointerEvents: 'none', background: 'rgba(21,27,45,0.82)', backdropFilter: 'blur(20px)', padding: '10px 14px', borderRadius: 3, border: '1px solid rgba(180,197,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#b4c5ff' }} />
                  <span style={{ fontSize: 8, fontWeight: 800, color: '#fff', letterSpacing: 3, textTransform: 'uppercase' }}>Live Telemetry</span>
                </div>
                <div style={{ fontSize: 9, color: '#7bd0ff', lineHeight: 2 }}>GEO SYNC: ACTIVE<br/>TRUCKS: 3 ACTIVE<br/>REGION: OKC METRO</div>
              </div>
              <div style={{ position: 'absolute', bottom: 16, right: 16, zIndex: 10 }}>
                <button onClick={() => setFullscreen(!fullscreen)} style={{ background: 'rgba(21,27,45,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(180,197,255,0.12)', borderRadius: 3, padding: '8px 16px', color: '#b4c5ff', fontWeight: 800, fontSize: 9, cursor: 'pointer', letterSpacing: 2, textTransform: 'uppercase' }}>
                  {fullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN MAP'}
                </button>
              </div>
            </div>

            {!fullscreen && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(180,197,255,0.04)', flexShrink: 0 }}>
                {[
                  { label: 'ENGINE HEALTH', value: '98.2%', pct: 98, color: '#b4c5ff', change: '+0.4%' },
                  { label: 'FUEL RESERVES', value: '12.4k L', pct: 65, color: '#7bd0ff', change: 'AVG 82%' },
                  { label: 'MAINTENANCE', value: '3 UNITS', pct: 12, color: '#ef4444', change: 'CRITICAL' },
                ].map(m => (
                  <div key={m.label} style={{ background: '#151b2d', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{m.label}</span>
                      <span style={{ fontSize: 8, color: m.color, fontWeight: 700 }}>{m.change}</span>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#dce1fb', marginBottom: 6 }}>{m.value}</div>
                    <div style={{ height: 2, background: 'rgba(12,19,36,0.8)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: m.pct + '%', background: m.color, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!fullscreen && (
            <div style={{ background: '#151b2d', borderLeft: '1px solid rgba(180,197,255,0.04)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(180,197,255,0.04)', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#dce1fb' }}>Active Personnel</span>
                <span style={{ fontSize: 8, color: '#b4c5ff', fontWeight: 700 }}>{drivers.length} UNITS</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {drivers.map(d => (
                  <div key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)} style={{ padding: '14px 16px', cursor: 'pointer', background: selected === d.id ? 'rgba(37,99,235,0.08)' : 'transparent', borderBottom: '1px solid rgba(180,197,255,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 2, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🚛</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                          <span style={{ fontWeight: 800, color: '#dce1fb', fontSize: 11 }}>{d.name.toUpperCase()}</span>
                          <span style={{ fontSize: 7, fontWeight: 700, padding: '2px 5px', borderRadius: 2, background: d.bg, color: d.color }}>{d.status}</span>
                        </div>
                        <div style={{ fontSize: 8, color: 'rgba(195,198,215,0.4)' }}>{d.id} · {d.location}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
                      <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '4px 8px' }}>
                        <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', marginBottom: 1 }}>ETA</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#dce1fb' }}>{d.eta}</div>
                      </div>
                      <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '4px 8px' }}>
                        <div style={{ fontSize: 7, color: 'rgba(195,198,215,0.35)', marginBottom: 1 }}>FUEL</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: d.fuel < 60 ? '#ef4444' : '#22c55e' }}>{d.fuel}%</div>
                      </div>
                    </div>
                    {d.progress < 100 && (
                      <div style={{ height: 2, background: 'rgba(12,19,36,0.6)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: d.progress + '%', background: d.color, borderRadius: 999 }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid rgba(180,197,255,0.04)', flexShrink: 0 }}>
                <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🤖</span>
                  <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#dce1fb' }}>AI Optimization</span>
                </div>
                {[
                  { title: 'ROUTE ALPHA 9', badge: '+12% EFF', desc: 'Traffic on I-35. Alt via HWY-270. Saves 18 min.', color: '#b4c5ff' },
                  { title: 'BATCH MERGE', badge: 'OPT READY', desc: 'Merge TRK-201 + TRK-412 return. Saves 22L.', color: '#7bd0ff' },
                ].map(a => (
                  <div key={a.title} style={{ padding: '10px 16px', borderTop: '1px solid rgba(180,197,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 8, color: a.color, fontWeight: 700 }}>{a.title}</span>
                      <span style={{ fontSize: 7, color: 'rgba(195,198,215,0.4)', fontWeight: 700 }}>{a.badge}</span>
                    </div>
                    <p style={{ fontSize: 9, color: 'rgba(195,198,215,0.5)', lineHeight: 1.5, margin: '0 0 6px' }}>{a.desc}</p>
                    <button style={{ width: '100%', padding: '5px', background: 'rgba(180,197,255,0.05)', border: '1px solid rgba(180,197,255,0.1)', borderRadius: 2, color: '#b4c5ff', fontSize: 7, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>APPLY CHANGE</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <nav className="kinetic-mobile-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'none', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 20px', background: 'rgba(12,19,36,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(180,197,255,0.06)', zIndex: 100 }}>
        {[
          { icon: '📊', label: 'OPS', href: '/dashboard' },
          { icon: '📋', label: 'LOGS', href: '/orders' },
          { icon: '🚛', label: 'FLEET', href: '/fleet-map', active: true },
          { icon: '🏭', label: 'PROD', href: '/production' },
          { icon: '🤖', label: 'AI', href: '/executive' },
        ].map(item => (
          <a key={item.label} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: item.active ? '#b4c5ff' : 'rgba(195,198,215,0.35)', textDecoration: 'none', background: item.active ? 'rgba(37,99,235,0.12)' : 'transparent', padding: '6px 16px', borderRadius: 2 }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 7, fontWeight: 800, letterSpacing: 2 }}>{item.label}</span>
          </a>
        ))}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .kinetic-sidebar { display: none !important; }
          .kinetic-main { margin-left: 0 !important; padding-bottom: 70px; }
          .kinetic-mobile-nav { display: flex !important; }
          .kinetic-main > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}