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
  const [selected, setSelected] = useState(null)
  const [time, setTime] = useState(new Date())
  const [showPanel, setShowPanel] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="fleet-map-page" style={{ width: "100vw", height: "100vh", background: "#0c1324", color: '#dce1fb', fontFamily: 'Inter, Arial, sans-serif', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <FleetMapInner />
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(37,99,235,0.01) 50%)', backgroundSize: '100% 3px' }} />
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(12,19,36,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(180,197,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/assets/logo.png" style={{ width: 28, height: 28 }} alt="logo" />
            <span style={{ fontSize: 14, fontWeight: 900, color: '#2563eb', letterSpacing: 3, textTransform: 'uppercase' }}>BOXFLOW_OS</span>
          </a>
          <span style={{ color: 'rgba(180,197,255,0.2)' }}>|</span>
          <span style={{ fontSize: 13, color: 'rgba(195,198,215,0.6)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>FLEET_COMMAND</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[{ label: 'ACTIVE', value: '3/8', color: '#b4c5ff' }, { label: 'ALERTS', value: '03', color: '#ef4444' }, { label: 'ON ROUTE', value: '3', color: '#22c55e' }].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            </div>
          ))}
          <span style={{ color: 'rgba(180,197,255,0.2)' }}>|</span>
          <span style={{ fontSize: 13, color: 'rgba(195,198,215,0.4)', fontFamily: 'monospace' }}>{time.toLocaleTimeString()}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 3, padding: '4px 12px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ color: '#22c55e', fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>GEO SYNC ACTIVE</span>
          </div>
          <a href="/dashboard" style={{ fontSize: 13, color: 'rgba(180,197,255,0.6)', textDecoration: 'none', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 14px', background: 'rgba(180,197,255,0.06)', borderRadius: 3, border: '1px solid rgba(180,197,255,0.1)' }}>← BACK</a>
          <button onClick={() => setFullscreen(!fullscreen)} style={{ fontSize: 12, color: "#b4c5ff", fontWeight: 700, letterSpacing: 1, padding: "6px 14px", background: "rgba(37,99,235,0.15)", borderRadius: 3, border: "1px solid rgba(37,99,235,0.3)", cursor: "pointer" }}>{fullscreen ? "EXIT FULLSCREEN" : "FULLSCREEN"}</button>
        </div>
      </header>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: showPanel && !fullscreen ? 320 : 0, zIndex: fullscreen ? -1 : 10, display: fullscreen ? "none" : "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: 'rgba(12,19,36,0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(180,197,255,0.08)' }}>
        {[{ label: 'ENGINE HEALTH', value: '98.2%', pct: 98, color: '#b4c5ff', change: '+0.4%' }, { label: 'FUEL RESERVES', value: '12.4k L', pct: 65, color: '#7bd0ff', change: 'AVG 82%' }, { label: 'MAINTENANCE', value: '3 UNITS', pct: 12, color: '#ef4444', change: 'CRITICAL' }].map(m => (
          <div key={m.label} style={{ padding: '12px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{m.label}</span>
              <span style={{ fontSize: 12, color: m.color, fontWeight: 700 }}>{m.change}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#dce1fb', marginBottom: 6 }}>{m.value}</div>
            <div style={{ height: 3, background: 'rgba(12,19,36,0.8)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: m.pct + '%', background: m.color, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 90, left: 20, zIndex: 10, pointerEvents: 'none', background: 'rgba(12,19,36,0.82)', backdropFilter: 'blur(20px)', padding: '10px 14px', borderRadius: 4, border: '1px solid rgba(180,197,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#b4c5ff' }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 3, textTransform: 'uppercase' }}>Live Telemetry</span>
        </div>
        <div style={{ fontSize: 12, color: '#7bd0ff', lineHeight: 2 }}>GEO SYNC: ACTIVE<br />TRUCKS: 3 ACTIVE<br />REGION: OKC METRO</div>
      </div>
      <button onClick={() => setShowPanel(!showPanel)} style={{ position: 'absolute', top: '50%', right: showPanel ? 320 : 0, transform: 'translateY(-50%)', zIndex: 15, background: 'rgba(37,99,235,0.9)', border: 'none', borderRadius: showPanel ? '4px 0 0 4px' : '0 4px 4px 0', padding: '12px 8px', color: '#fff', fontWeight: 800, fontSize: 11, cursor: 'pointer', letterSpacing: 1, writingMode: 'vertical-rl', textTransform: 'uppercase' }}>
        {showPanel ? 'HIDE ?' : '? DRIVERS'}
      </button>
      {showPanel && !fullscreen && (
        <div style={{ position: 'absolute', top: 56, right: 0, bottom: 0, width: 320, zIndex: 10, background: 'rgba(21,27,45,0.95)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(180,197,255,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(180,197,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#dce1fb' }}>Active Personnel</span>
            <span style={{ fontSize: 13, color: '#b4c5ff', fontWeight: 700 }}>{drivers.length} UNITS</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {drivers.map(d => (
              <div key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)} style={{ padding: '14px 16px', cursor: 'pointer', background: selected === d.id ? 'rgba(37,99,235,0.1)' : 'transparent', borderBottom: '1px solid rgba(180,197,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 3, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>??</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                      <span style={{ fontWeight: 800, color: '#dce1fb', fontSize: 13 }}>{d.name.toUpperCase()}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: d.bg, color: d.color }}>{d.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(195,198,215,0.4)' }}>{d.id}  {d.location}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                  <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '6px 10px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.35)', marginBottom: 2 }}>ETA</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#dce1fb' }}>{d.eta}</div>
                  </div>
                  <div style={{ background: 'rgba(12,19,36,0.5)', borderRadius: 2, padding: '6px 10px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.35)', marginBottom: 2 }}>FUEL</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: d.fuel < 60 ? '#ef4444' : '#22c55e' }}>{d.fuel}%</div>
                  </div>
                </div>
                {d.progress < 100 && (
                  <div style={{ height: 3, background: 'rgba(12,19,36,0.6)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: d.progress + '%', background: d.color, borderRadius: 999 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(180,197,255,0.06)', flexShrink: 0 }}>
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>??</span>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: '#dce1fb' }}>AI Optimization</span>
            </div>
            {[{ title: 'ROUTE ALPHA 9', badge: '+12% EFF', desc: 'Traffic on I-35. Alt via HWY-270. Saves 18 min.', color: '#b4c5ff' }, { title: 'BATCH MERGE', badge: 'OPT READY', desc: 'Merge TRK-201 + TRK-412 return. Saves 22L.', color: '#7bd0ff' }].map(a => (
              <div key={a.title} style={{ padding: '10px 16px', borderTop: '1px solid rgba(180,197,255,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: a.color, fontWeight: 700 }}>{a.title}</span>
                  <span style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700 }}>{a.badge}</span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(195,198,215,0.5)', lineHeight: 1.5, margin: '0 0 8px' }}>{a.desc}</p>
                <button style={{ width: '100%', padding: '6px', background: 'rgba(180,197,255,0.06)', border: '1px solid rgba(180,197,255,0.12)', borderRadius: 2, color: '#b4c5ff', fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>APPLY CHANGE</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <nav className="kinetic-mobile-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'none', justifyContent: 'space-around', alignItems: 'center', padding: '8px 0 20px', background: 'rgba(12,19,36,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(180,197,255,0.06)', zIndex: 100 }}>
        {[{ icon: '??', label: 'OPS', href: '/dashboard' }, { icon: '??', label: 'LOGS', href: '/orders' }, { icon: '??', label: 'FLEET', href: '/fleet-map', active: true }, { icon: '??', label: 'PROD', href: '/production' }, { icon: '??', label: 'AI', href: '/executive' }].map(item => (
          <a key={item.label} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: item.active ? '#b4c5ff' : 'rgba(195,198,215,0.35)', textDecoration: 'none', padding: '6px 16px', borderRadius: 2 }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>{item.label}</span>
          </a>
        ))}
      </nav>
      <style>{`
        @media (max-width: 768px) {
          .kinetic-mobile-nav { display: flex !important; }
        }
      `}</style>
    </div>
  )
}