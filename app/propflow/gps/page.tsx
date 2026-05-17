'use client'
import { useEffect, useState } from 'react'

const staffData = [
  { id: 1, name: 'Marcus Reed',   role: 'Maintenance',    color: '#4f8ef7', top: '45%', left: '52%' },
  { id: 2, name: 'James Carter',  role: 'Maintenance',    color: '#4f8ef7', top: '62%', left: '38%' },
  { id: 3, name: 'Lisa Adams',    role: 'Make-Ready',     color: '#22c55e', top: '32%', left: '61%' },
  { id: 4, name: 'D. Harris',     role: 'Security',       color: '#ef4444', top: '50%', left: '28%' },
  { id: 5, name: 'Angela Brooks', role: 'Office Manager', color: '#a855f7', top: '70%', left: '22%' },
]

export default function GPSPage() {
  const [timeStr, setTimeStr] = useState('--:--:--')
  const [busOnRoute, setBusOnRoute] = useState(false)
  const [busArrived, setBusArrived] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<typeof staffData[0] | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      const s = String(now.getSeconds()).padStart(2, '0')
      setTimeStr(`${h}:${m}:${s}`)
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  function activateBus() {
    if (busOnRoute) return
    setBusOnRoute(true)
    setBusArrived(false)
    setTimeout(() => { setBusOnRoute(false); setBusArrived(true) }, 5000)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#050d1a', color: '#e2e8f0', fontFamily: 'system-ui,Arial,sans-serif' }}>
      <style>{`
        @keyframes ping2{0%{transform:scale(1);opacity:0.7}100%{transform:scale(2.4);opacity:0}}
        .staff-pin{cursor:pointer}
        .staff-pin:hover .pin-dot{transform:scale(1.15)}
        .pin-dot{transition:transform 0.15s}
        nav a{text-decoration:none}
      `}</style>

      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#4f8ef7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>P</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#4f8ef7', letterSpacing: 1 }}>PropFlow OS</div>
            <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>by M.A.D.E Technologies</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {['Dashboard','Units','Tenants','Maintenance','GPS','Finance','Community'].map(item => (
            <a key={item} href={item === 'Dashboard' ? '/propflow/dashboard' : `/propflow/${item.toLowerCase()}`}
              style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, color: item === 'GPS' ? '#4f8ef7' : '#475569', borderRadius: 7, background: item === 'GPS' ? 'rgba(79,142,247,0.1)' : 'transparent' }}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: 24 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>GPS Live Tracker</h1>
            <p style={{ fontSize: 13, color: '#475569' }}>Penn Station — 1920 Heritage Park Dr, OKC 73120</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, background: 'rgba(34,197,94,0.1)', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(34,197,94,0.2)' }}>GEO SYNC ACTIVE</span>
            <span style={{ fontFamily: 'monospace', color: '#4f8ef7', fontSize: 12 }}>{timeStr}</span>
          </div>
        </div>

        {busArrived && (
          <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#f59e0b', fontSize: 10, flexShrink: 0 }}>BUS</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>School Bus Arrived at Penn Station!</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>All parents notified via PropFlow tenant app</div>
            </div>
          </div>
        )}

        {busOnRoute && (
          <div style={{ background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 12, padding: '14px 20px', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#4f8ef7' }}>School bus is en route — ETA 5 minutes...</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 20, alignItems: 'start' }}>

          {/* MAP */}
          <div style={{ background: '#0a1628', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 16, overflow: 'hidden', position: 'relative', minHeight: 480 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(79,142,247,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(79,142,247,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

            <div style={{ position: 'absolute', top: '12%', left: '8%', right: '8%', bottom: '8%', border: '2px dashed rgba(34,197,94,0.22)', borderRadius: 8, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: -10, left: 12, background: '#0a1628', padding: '0 6px', fontSize: 9, color: '#22c55e', fontWeight: 700, letterSpacing: 1 }}>PENN STATION PROPERTY</div>
            </div>

            {([
              { w: '17%', h: '11%', t: '18%', l: '12%',  label: 'Bldg 1900' },
              { w: '17%', h: '11%', t: '18%', l: '38%',  label: 'Bldg 1910' },
              { w: '17%', h: '11%', t: '18%', l: '64%',  label: 'Bldg 1920' },
              { w: '17%', h: '11%', t: '38%', l: '12%',  label: 'Bldg 1930' },
              { w: '17%', h: '11%', t: '38%', l: '64%',  label: 'Bldg 1932' },
              { w: '24%', h: '9%',  t: '60%', l: '38%',  label: 'Leasing Office' },
              { w: '10%', h: '8%',  t: '75%', l: '12%',  label: 'Pool A' },
              { w: '10%', h: '8%',  t: '75%', l: '76%',  label: 'Pool B' },
            ] as const).map((b, i) => (
              <div key={i} style={{ position: 'absolute', top: b.t, left: b.l, width: b.w, height: b.h, background: 'rgba(79,142,247,0.07)', border: '1px solid rgba(79,142,247,0.22)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: 8, color: '#4f8ef7', fontWeight: 700, textAlign: 'center' }}>{b.label}</span>
              </div>
            ))}

            <div style={{ position: 'absolute', top: '53%', left: '8%', right: '8%', height: 7, background: 'rgba(100,116,139,0.18)', borderRadius: 4, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '12%', bottom: '8%', left: '33%', width: 7, background: 'rgba(100,116,139,0.18)', borderRadius: 4, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '12%', bottom: '8%', left: '59%', width: 7, background: 'rgba(100,116,139,0.18)', borderRadius: 4, pointerEvents: 'none' }} />

            {staffData.map(s => (
              <div key={s.id} className="staff-pin"
                onClick={() => setSelectedStaff(selectedStaff?.id === s.id ? null : s)}
                style={{ position: 'absolute', top: s.top, left: s.left, transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: 34, height: 34 }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${s.color}`, animation: 'ping2 2s ease-out infinite' }} />
                    <div className="pin-dot" style={{ width: 34, height: 34, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', border: '2px solid rgba(255,255,255,0.8)', boxShadow: `0 0 12px ${s.color}80`, position: 'relative', zIndex: 1 }}>
                      {s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div style={{ fontSize: 9, color: '#fff', marginTop: 3, textShadow: '0 1px 4px rgba(0,0,0,0.9)', fontWeight: 700, whiteSpace: 'nowrap' }}>{s.name.split(' ')[0]}</div>
                </div>
              </div>
            ))}

            <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(2,8,18,0.88)', padding: '6px 10px', borderRadius: 6, pointerEvents: 'none' }}>
              <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>Penn Station Apartment Homes</div>
              <div style={{ fontSize: 9, color: '#475569' }}>1920 Heritage Park Dr, OKC</div>
            </div>
            <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(2,8,18,0.88)', padding: '6px 10px', borderRadius: 6, fontSize: 10, color: '#22c55e', fontWeight: 700, pointerEvents: 'none' }}>
              {staffData.length} ON PROPERTY
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(2,8,18,0.88)', padding: '8px 12px', borderRadius: 8, pointerEvents: 'none' }}>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>LEGEND</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {(['Maintenance','#4f8ef7'],['Make-Ready','#22c55e'],['Security','#ef4444'],['Admin','#a855f7']) && [['Maintenance','#4f8ef7'],['Make-Ready','#22c55e'],['Security','#ef4444'],['Admin','#a855f7']].map(([label,color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: 9, color: '#94a3b8' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Staff On Property</div>
              {staffData.map(s => (
                <div key={s.id} onClick={() => setSelectedStaff(selectedStaff?.id === s.id ? null : s)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 6px', borderBottom: '1px solid rgba(99,132,255,0.07)', cursor: 'pointer', borderRadius: 6, background: selectedStaff?.id === s.id ? `${s.color}14` : 'transparent' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 7, background: `${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: s.color, flexShrink: 0 }}>
                    {s.name.split(' ').map(n => n[0]).join('')}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: selectedStaff.color }}>{selectedStaff.name}</div>
                  <button onClick={() => setSelectedStaff(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>x</button>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>{selectedStaff.role}</div>
                <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, marginBottom: 10 }}>On Property</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ flex: 1, padding: '7px', background: `${selectedStaff.color}18`, border: `1px solid ${selectedStaff.color}40`, borderRadius: 8, color: selectedStaff.color, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui' }}>Message</button>
                  <button style={{ flex: 1, padding: '7px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, color: '#22c55e', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui' }}>Assign</button>
                </div>
              </div>
            )}

            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginBottom: 8 }}>School Bus Alert</div>
              <div style={{ fontSize: 12, color: '#475569', marginBottom: 14, lineHeight: 1.6 }}>When activated, all parents receive an instant push notification through the PropFlow tenant app.</div>
              <button onClick={activateBus} disabled={busOnRoute}
                style={{ width: '100%', padding: '11px', background: busOnRoute ? 'rgba(245,158,11,0.25)' : 'linear-gradient(135deg,#b45309,#f59e0b)', border: 'none', borderRadius: 9, color: busOnRoute ? '#f59e0b' : '#000', fontWeight: 800, fontSize: 12, cursor: busOnRoute ? 'not-allowed' : 'pointer', fontFamily: 'system-ui' }}>
                {busOnRoute ? 'Bus En Route...' : 'Simulate Bus Arrival'}
              </button>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>AI Auto-Dispatch</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>New work order submitted — PropFlow OS routes to the nearest available technician automatically based on GPS location.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}