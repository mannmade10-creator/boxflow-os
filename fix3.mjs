import { writeFileSync } from 'fs';

const code = `'use client'
import React, { useState } from 'react'
import FleetMapInner from './FleetMapInner'

const drivers = [
  { id: 'TRK-201', name: 'Marcus Reed', status: 'ON ROUTE', statusColor: '#b4c5ff', statusBg: 'rgba(37,99,235,0.2)', eta: '2:45 PM', progress: 75 },
  { id: 'TRK-305', name: 'Angela Brooks', status: 'DELIVERED', statusColor: '#22c55e', statusBg: 'rgba(34,197,94,0.15)', eta: 'Complete', progress: 100 },
  { id: 'TRK-412', name: 'James Carter', status: 'DISPATCHED', statusColor: '#7bd0ff', statusBg: 'rgba(123,208,255,0.15)', eta: '4:30 PM', progress: 35 },
  { id: 'TRK-518', name: 'Lisa Monroe', status: 'IN TRANSIT', statusColor: '#b4c5ff', statusBg: 'rgba(37,99,235,0.2)', eta: '3:15 PM', progress: 60 },
]

const alerts = [
  { id: 'ROUTE_ALPHA', title: 'ROUTE_ALPHA_9', badge: '+12% EFFICIENCY', desc: 'Traffic delay detected on I-35. Alternate route via HWY-270. Potential saving: 18 mins.', color: '#b4c5ff' },
  { id: 'BATCH', title: 'BATCH_CONSOLIDATION', badge: 'OPT_READY', desc: 'Combine TRK-201 and TRK-412 return legs at Point C. Fuel savings: 22L.', color: '#7bd0ff' },
]

const metrics = [
  { label: 'ENGINE_HEALTH', value: '98.2%', pct: 98, color: '#b4c5ff', icon: '⚡', change: '+0.4%' },
  { label: 'FUEL_RESERVES', value: '12.4k L', pct: 65, color: '#7bd0ff', icon: '⛽', change: 'AVG: 82%' },
  { label: 'MAINTENANCE', value: '3 UNITS', pct: 12, color: '#ef4444', icon: '🔧', change: 'CRITICAL' },
]

export default function FleetMapPage() {
  const [showDriverPanel, setShowDriverPanel] = useState(false)
  const [activeTab, setActiveTab] = useState('fleet')
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0c1324', 
      color: '#dce1fb',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* TOP BAR */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px', height: 64,
        background: 'rgba(12,19,36,0.95)',
        borderBottom: '1px solid rgba(37,99,235,0.2)',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ fontSize: 18, fontWeight: 900, color: '#60a5fa', letterSpacing: 2, textTransform: 'uppercase' }}>BOXFLOW_OS</span>
        </div>
        <nav style={{ display: 'flex', gap: 32 }}>
          {['DASHBOARD', 'LOGISTICS', 'FLEET', 'INSIGHTS'].map(item => (
            <a key={item} href={item === 'DASHBOARD' ? '/dashboard' : '#'} style={{
              color: item === 'FLEET' ? '#60a5fa' : '#64748b',
              fontWeight: item === 'FLEET' ? 800 : 600,
              fontSize: 13,
              textDecoration: 'none',
              letterSpacing: 1,
              borderBottom: item === 'FLEET' ? '2px solid #3b82f6' : 'none',
              paddingBottom: 2,
            }}>{item}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 999, padding: '4px 12px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 1s infinite' }} />
            <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 700 }}>GEO_SYNC: ACTIVE</span>
          </div>
          <a href="/dashboard" style={{ color: '#94a3b8', fontSize: 13, textDecoration: 'none', fontWeight: 700 }}>← BACK</a>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 220,
        background: '#151b2d',
        paddingTop: 80,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '0 24px', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Command Center</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>FLEET_COMMAND</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
          {[
            { icon: '📊', label: 'DASHBOARD', href: '/dashboard', active: false },
            { icon: '📋', label: 'LOGISTICS', href: '/orders', active: false },
            { icon: '🚛', label: 'FLEET', href: '/fleet-map', active: true },
            { icon: '🏭', label: 'PRODUCTION', href: '/production', active: false },
            { icon: '🤖', label: 'AI_INSIGHTS', href: '/executive', active: false },
            { icon: '👥', label: 'HR', href: '/hr', active: false },
            { icon: '📈', label: 'ANALYTICS', href: '/analytics', active: false },
          ].map(item => (
            <a key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 16px',
              borderRadius: 8,
              background: item.active ? 'linear-gradient(135deg, rgba(37,99,235,0.8), rgba(29,78,216,0.8))' : 'transparent',
              color: item.active ? '#fff' : '#64748b',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
              boxShadow: item.active ? '0 0 20px rgba(37,99,235,0.3)' : 'none',
            }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 12px', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
          <button
            onClick={async () => {
              const { supabase } = await import('@/lib/supabase')
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            style={{
              width: '100%', padding: '10px', background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8,
              color: '#fca5a5', fontWeight: 700, cursor: 'pointer',
              fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
            }}
          >
            🚪 SIGN_OUT
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: 220, paddingTop: 64, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, flex: 1 }}>

          {/* LEFT - Map + Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: 10, color: '#60a5fa', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>System Status: Optimal</div>
                <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>FLEET_TRACKING</h1>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ background: '#151b2d', padding: '12px 20px', borderRadius: 12, textAlign: 'right', border: '1px solid rgba(180,197,255,0.1)' }}>
                  <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Active Units</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#b4c5ff', fontFamily: 'monospace' }}>5/8</div>
                </div>
                <div style={{ background: '#151b2d', padding: '12px 20px', borderRadius: 12, textAlign: 'right', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Active Alerts</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>03</div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(37,99,235,0.2)', flex: 1, minHeight: 480 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                <FleetMapInner />
              </div>
              
              {/* HUD Overlay */}
              <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, pointerEvents: 'none' }}>
                <div style={{ background: 'rgba(46,52,71,0.85)', backdropFilter: 'blur(12px)', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(37,99,235,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#b4c5ff' }} />
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', letterSpacing: 2, textTransform: 'uppercase' }}>Live Telemetry</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#7bd0ff', fontFamily: 'monospace' }}>GEO_SYNC: ACTIVE</div>
                  <div style={{ fontSize: 10, color: '#7bd0ff', fontFamily: 'monospace' }}>TRUCKS: 5 ACTIVE</div>
                  <div style={{ fontSize: 10, color: '#7bd0ff', fontFamily: 'monospace' }}>REGION: OKC_METRO</div>
                </div>
              </div>

              {/* Scanline effect */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(37,99,235,0.03) 50%)', backgroundSize: '100% 4px', opacity: 0.5 }} />
            </div>

            {/* Bottom Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {metrics.map(metric => (
                <div key={metric.label} style={{ background: '#191f31', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{ fontSize: 9, color: '#64748b', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{metric.label}</span>
                    <span style={{ fontSize: 18 }}>{metric.icon}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8, fontFamily: 'monospace' }}>{metric.value}</div>
                      <div style={{ height: 4, background: '#0c1324', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: metric.pct + '%', background: metric.color, borderRadius: 999 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 9, color: metric.color, fontFamily: 'monospace', fontWeight: 700 }}>{metric.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Active Personnel */}
            <div style={{ background: '#191f31', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16, overflow: 'hidden', flex: 1 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#dce1fb' }}>Active Personnel</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>▼</span>
              </div>
              <div>
                {drivers.map(driver => (
                  <div
                    key={driver.id}
                    onClick={() => setSelectedDriver(selectedDriver === driver.id ? null : driver.id)}
                    style={{
                      padding: '14px 20px',
                      borderBottom: '1px solid rgba(148,163,184,0.06)',
                      cursor: 'pointer',
                      background: selectedDriver === driver.id ? 'rgba(37,99,235,0.08)' : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                        🚛
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontWeight: 800, color: '#fff', fontSize: 13 }}>{driver.name}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: driver.statusBg, color: driver.statusColor }}>
                            {driver.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace' }}>V-ID: {driver.id} | ETA: {driver.eta}</div>
                      </div>
                    </div>
                    {driver.progress < 100 && (
                      <div style={{ marginTop: 10, height: 3, background: '#0c1324', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: driver.progress + '%', background: driver.statusColor, borderRadius: 999 }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Optimization */}
            <div style={{ background: '#151b2d', borderLeft: '4px solid #b4c5ff', borderRadius: 16, padding: 20, border: '1px solid rgba(180,197,255,0.15)', borderLeftColor: '#b4c5ff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#fff' }}>AI Optimization</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {alerts.map(alert => (
                  <div key={alert.id} style={{ background: '#191f31', border: '1px solid rgba(180,197,255,0.15)', borderRadius: 12, padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 9, color: alert.color, fontFamily: 'monospace', fontWeight: 700 }}>{alert.title}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b' }}>{alert.badge}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, margin: '0 0 10px' }}>{alert.desc}</p>
                    <button style={{ width: '100%', padding: '8px', background: 'rgba(180,197,255,0.08)', border: '1px solid rgba(180,197,255,0.2)', borderRadius: 8, color: '#b4c5ff', fontSize: 9, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer' }}>
                      APPLY CHANGE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '8px 0 16px',
        background: 'rgba(12,19,36,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(37,99,235,0.2)',
        zIndex: 50,
      }} className="mobile-bottom-nav">
        {[
          { icon: '📊', label: 'OPS', href: '/dashboard' },
          { icon: '📋', label: 'LOGS', href: '/orders' },
          { icon: '🚛', label: 'FLEET', href: '/fleet-map', active: true },
          { icon: '🏭', label: 'PROD', href: '/production' },
          { icon: '🤖', label: 'AI', href: '/executive' },
        ].map(item => (
          <a key={item.label} href={item.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            color: item.active ? '#60a5fa' : '#64748b',
            textDecoration: 'none',
            background: item.active ? 'rgba(37,99,235,0.2)' : 'transparent',
            padding: '6px 16px',
            borderRadius: 10,
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2 }}>{item.label}</span>
          </a>
        ))}
      </nav>

      <style>{\`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (min-width: 769px) {
          .mobile-bottom-nav { display: none !important; }
        }
        @media (max-width: 768px) {
          aside { display: none !important; }
          main { margin-left: 0 !important; padding-bottom: 80px !important; }
          .mobile-bottom-nav { display: flex !important; }
          main > div { grid-template-columns: 1fr !important; }
        }
      \`}</style>
    </div>
  )
}`;

writeFileSync('app/fleet-map/page.tsx', code, 'utf8');
console.log('Fleet map rebuilt - HUD style!');