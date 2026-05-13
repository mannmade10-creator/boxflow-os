'use client'
import { useEffect, useState } from 'react'

const staffData = [
  { id: 1, name: 'Marcus Reed',    role: 'Maintenance',    color: '#4f8ef7', top: '45%', left: '52%' },
  { id: 2, name: 'James Carter',   role: 'Maintenance',    color: '#4f8ef7', top: '62%', left: '38%' },
  { id: 3, name: 'Lisa Adams',     role: 'Make-Ready',     color: '#22c55e', top: '32%', left: '61%' },
  { id: 4, name: 'D. Harris',      role: 'Security',       color: '#ef4444', top: '50%', left: '28%' },
  { id: 5, name: 'Angela Brooks',  role: 'Office Manager', color: '#a855f7', top: '70%', left: '22%' },
]

export default function GPSPage() {
  const [time, setTime] = useState<Date | null>(null)
  const [busOnRoute, setBusOnRoute] = useState(false)
  const [busArrived, setBusArrived] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<any>(null)

  useEffect(() => {
    setTime(new Date())
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  function activateBus() {
    if (busOnRoute) return
    setBusOnRoute(true)
    setBusArrived(false)
    setTimeout(() => {
      setBusOnRoute(false)
      setBusArrived(true)
    }, 5000)
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-97.5572,35.5938,16,0/900x540?access_token=${token}`

  return (
    <main style={{ minHeight: '100vh', background: '#050d1a', color: '#e2e8f0', fontFamily: 'Inter,Arial,sans-serif' }}>
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#4f8ef7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>P</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#4f8ef7', letterSpacing: 1 }}>PropFlow OS</div>
            <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>by M.A.D.E Technologies</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
          {['Dashboard', 'Units', 'Tenants', 'Maintenance', 'GPS', 'Finance', 'Community'].map(item => (
            <a key={item} href={`/${item === 'Dashboard' ? 'propflow/dashboard' : 'propflow/' + item.toLowerCase()}`}
              style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, color: item === 'GPS' ? '#4f8ef7' : '#475569', borderRadius: 7, textDecoration: 'none', background: item === 'GPS' ? 'rgba(79,142,247,0.1)' : 'transparent' }}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap' as const, gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>GPS Live Tracker</h1>
            <p style={{ fontSize: 13, color: '#475569' }}>Penn Station — 1920 Heritage Park Dr, OKC 73120</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, background: 'rgba(34,197,94,0.1)', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(34,197,94,0.2)' }}>
              GEO SYNC ACTIVE
            </span>
            <span style={{ fontFamily: 'monospace', color: '#4f8ef7', fontSize: 12 }}>
              {time ? time.toLocaleTimeString() : ''}
            </span>
          </div>
        </div>

        {busArrived && (
          <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>B</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>School Bus Arrived at Penn Station!</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>All parents notified via PropFlow tenant app</div>
            </div>
          </div>
        )}

        {busOnRoute && (
          <div style={{ background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 12, padding: '14px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#4f8ef7' }}>School bus is en route — ETA 5 minutes</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
          <div style={{ position: 'relative' as const, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(99,132,255,0.15)' }}>
            <img
              src={mapUrl}
              alt="Property Map"
              style={{ width: '100%', display: 'block', minHeight: 400, objectFit: 'cover' as const, background: '#0a1628' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />

            <div style={{ position: 'absolute' as const, inset: 0, background: token ? 'transparent' : '#0a1628', display: token ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' as const, color: '#475569', fontSize: 13 }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>M</div>
                <div>Map requires Mapbox token</div>
              </div>
            </div>

            <div style={{ position: 'absolute' as const, top: 10, left: 10, background: 'rgba(2,8,18,0.85)', padding: '6px 10px', borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>Penn Station Apartment Homes</div>
              <div style={{ fontSize: 9, color: '#475569' }}>1920 Heritage Park Dr, OKC</div>
            </div>

            <div style={{ position: 'absolute' as const, bottom: 10, left: 10, background: 'rgba(2,8,18,0.85)', padding: '8px 12px', borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>LEGEND</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
                {[['Maintenance', '#4f8ef7'], ['Make-Ready', '#22c55e'], ['Security', '#ef4444'], ['Admin', '#a855f7']].map(([label, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: 9, color: '#94a3b8' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {staffData.map(s => (
              <div key={s.id} onClick={() => setSelectedStaff(selectedStaff?.id === s.id ? null : s)}
                style={{ position: 'absolute' as const, top: s.top, left: s.left, transform: 'translate(-50%,-50%)', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', border: '2px solid #fff', boxShadow: `0 0 12px ${s.color}` }}>
                  {s.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontSize: 9, color: '#fff', textAlign: 'center' as const, marginTop: 3, textShadow: '0 1px 4px rgba(0,0,0,0.8)', fontWeight: 700 }}>{s.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 12 }}>Staff On Property</div>
              {staffData.map(s => (
                <div key={s.id} onClick={() => setSelectedStaff(selectedStaff?.id === s.id ? null : s)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 6px', borderBottom: '1px solid rgba(99,132,255,0.07)', cursor: 'pointer', borderRadius: 6, background: selectedStaff?.id === s.id ? `${s.color}11` : 'transparent' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0 }}>
                    {s.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: '#475569' }}>{s.role}</div>
                  </div>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                </div>
              ))}
            </div>

            {selectedStaff && (
              <div style={{ background: 'rgba(15,23,42,0.9)', border: `1px solid ${selectedStaff.color}44`, borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selectedStaff.color }}>{selectedStaff.name}</div>
                  <button onClick={() => setSelectedStaff(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>x</button>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{selectedStaff.role}</div>
                <div style={{ fontSize: 11, color: '#22c55e' }}>On Property</div>
              </div>
            )}

            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>School Bus Alert</div>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 12, lineHeight: 1.5 }}>When activated, all parents receive an instant push notification through the PropFlow tenant app.</div>
              <button onClick={activateBus} disabled={busOnRoute}
                style={{ width: '100%', padding: '10px', background: busOnRoute ? 'rgba(245,158,11,0.3)' : '#f59e0b', border: 'none', borderRadius: 8, color: '#000', fontWeight: 800, fontSize: 12, cursor: busOnRoute ? 'not-allowed' : 'pointer' }}>
                {busOnRoute ? 'Bus En Route...' : 'Simulate Bus Arrival'}
              </button>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>AI AUTO-DISPATCH</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>New work order submitted — PropFlow OS routes to the nearest available technician automatically based on GPS location.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}