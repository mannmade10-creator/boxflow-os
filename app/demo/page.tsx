'use client'
import React, { useEffect, useState, useRef } from 'react'

const SCENES = [
  {
    id: 1,
    title: 'Industry Setup',
    subtitle: 'BoxFlow OS configures itself for your industry in 60 seconds',
    duration: 10,
    color: '#3b82f6',
  },
  {
    id: 2,
    title: 'Corrugator Order Queue',
    subtitle: 'Real-time order tracking with live completion timers — replaces KIWIPLAN',
    duration: 10,
    color: '#a855f7',
  },
  {
    id: 3,
    title: 'Roll Stock & Splice Timers',
    subtitle: 'Real-time paper remaining, shortage alerts, time-to-splice per station',
    duration: 10,
    color: '#4f8ef7',
  },
  {
    id: 4,
    title: 'Fleet GPS — Live Tracking',
    subtitle: 'Every truck on the road with real-time GPS and AI routing',
    duration: 10,
    color: '#22c55e',
  },
  {
    id: 5,
    title: 'AI Dispatch Engine',
    subtitle: 'One click — AI assigns drivers, optimizes routes, fires alerts',
    duration: 10,
    color: '#f59e0b',
  },
  {
    id: 6,
    title: 'Shift Performance Dashboard',
    subtitle: 'Live footage, waste %, downtime log — everything in one screen',
    duration: 10,
    color: '#ef4444',
  },
]

const orders = [
  { id: 1, program: 7327, status: 'PROC', length: 68474, flute: 'B', width: 87, papers: 'L25,R24,L25', timeLeft: 228 },
  { id: 2, program: 7326, status: 'XMTD', length: 13508, flute: 'BC', width: 82, papers: 'K42,R30,L25,R30,K42', timeLeft: 45 },
  { id: 3, program: 7321, status: 'XMTD', length: 44394, flute: 'BC', width: 74, papers: 'L33,R24,L33,R24,L33', timeLeft: 147 },
  { id: 4, program: 7317, status: 'XMTD', length: 237496, flute: 'B', width: 85, papers: 'L25,R24,L25', timeLeft: 791 },
  { id: 5, program: 7330, status: 'XMTD', length: 16348, flute: 'C', width: 85, papers: '35L,R30,35L', timeLeft: 54 },
]

const trucks = [
  { id: 'TRK-201', driver: 'James Carter', from: 'OKC', to: 'Dallas', eta: '2h 10m', x: 55, y: 48 },
  { id: 'TRK-305', driver: 'Marcus Reed', from: 'Tulsa', to: 'Fort Worth', eta: '3h 25m', x: 38, y: 32 },
  { id: 'TRK-412', driver: 'D. Harris', from: 'OKC', to: 'Kansas City', eta: '4h 15m', x: 62, y: 28 },
  { id: 'TRK-518', driver: 'Angela Brooks', from: 'Norman', to: 'Little Rock', eta: '5h 00m', x: 72, y: 58 },
]

const industries = [
  { id: 'corrugated', icon: '📦', name: 'Corrugated & Paper', color: '#3b82f6' },
  { id: 'steel', icon: '🏗️', name: 'Steel & Metal', color: '#64748b' },
  { id: 'food', icon: '🍕', name: 'Food & Beverage', color: '#f59e0b' },
  { id: 'trucking', icon: '🚛', name: 'Trucking & Freight', color: '#22c55e' },
  { id: 'warehousing', icon: '🏪', name: 'Warehousing & 3PL', color: '#a855f7' },
  { id: 'general', icon: '🏭', name: 'General Manufacturing', color: '#ef4444' },
]

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

const statusColor: Record<string, string> = {
  PROC: '#22c55e', XMTD: '#4f8ef7', HIST: '#475569', RXMT: '#f59e0b'
}
const fluteColor: Record<string, string> = {
  B: '#4f8ef7', C: '#a855f7', BC: '#f59e0b'
}

export default function DemoPage() {
  const [scene, setScene] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [timeLeftArr, setTimeLeftArr] = useState(orders.map(o => o.timeLeft))
  const [remPaper, setRemPaper] = useState(68230)
  const [speed] = useState(539)
  const [aiStep, setAiStep] = useState(0)
  const [truckX, setTruckX] = useState(trucks.map(t => t.x))
  const [footage, setFootage] = useState(200665)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [industryConfirmed, setIndustryConfirmed] = useState(false)
  const intervalRef = useRef<any>(null)
  const sceneRef = useRef(0)
  const elapsedRef = useRef(0)

  const TOTAL = SCENES.reduce((a, s) => a + s.duration, 0)

  useEffect(() => { return () => clearInterval(intervalRef.current) }, [])

  function startDemo() {
    setPlaying(true)
    setScene(0)
    setElapsed(0)
    setSelectedIndustry(null)
    setIndustryConfirmed(false)
    setAiStep(0)
    sceneRef.current = 0
    elapsedRef.current = 0
    setTimeLeftArr(orders.map(o => o.timeLeft))
    setRemPaper(68230)
    setTruckX(trucks.map(t => t.x))

    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 1
      setTimeLeftArr(prev => prev.map(t => Math.max(0, t - 1)))
      setRemPaper(prev => Math.max(0, prev - Math.floor(speed / 60)))
      setFootage(prev => prev + Math.floor(speed / 60))
      setTruckX(prev => prev.map((x, i) => x + (i % 2 === 0 ? 0.3 : -0.2)))
      setAiStep(prev => Math.min(prev + 1, 5))

      // Auto-select industry in scene 0
      if (elapsedRef.current === 3) setSelectedIndustry('corrugated')
      if (elapsedRef.current === 7) setIndustryConfirmed(true)

      let cumulative = 0
      for (let i = 0; i < SCENES.length; i++) {
        cumulative += SCENES[i].duration
        if (elapsedRef.current < cumulative) {
          if (sceneRef.current !== i) { sceneRef.current = i; setScene(i) }
          break
        }
      }
      setElapsed(elapsedRef.current)
      if (elapsedRef.current >= TOTAL) {
        clearInterval(intervalRef.current)
        setPlaying(false)
        setScene(0)
        elapsedRef.current = 0
      }
    }, 1000)
  }

  function stopDemo() {
    clearInterval(intervalRef.current)
    setPlaying(false)
    setElapsed(0)
    sceneRef.current = 0
    elapsedRef.current = 0
  }

  const progress = (elapsed / TOTAL) * 100
  const currentScene = SCENES[scene]

  return (
    <div style={{ minHeight: '100vh', background: '#020812', color: '#e2e8f0', fontFamily: 'Arial, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ height: 32 }} />
          <span style={{ color: '#475569', margin: '0 8px' }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#4f8ef7' }}>Live Product Demo</span>
          <span style={{ fontSize: 11, color: '#475569', marginLeft: 8 }}>60 seconds • BoxFlow OS — Enterprise Operations System</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/pitch" style={{ padding: '6px 14px', background: 'rgba(99,132,255,0.1)', border: '1px solid rgba(99,132,255,0.2)', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>Pitch Deck</a>
          <a href="/enterprise" style={{ padding: '6px 14px', background: 'rgba(99,132,255,0.1)', border: '1px solid rgba(99,132,255,0.2)', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>Enterprise</a>
          <a href="/dashboard" style={{ padding: '6px 14px', background: 'rgba(99,132,255,0.1)', border: '1px solid rgba(99,132,255,0.2)', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>✕ Exit</a>
        </div>
      </header>

      {!playing ? (
        /* START SCREEN */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 56px)', flexDirection: 'column' as const, gap: 24, padding: 40 }}>
          <div style={{ textAlign: 'center' as const, maxWidth: 700 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🏭</div>
            <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12, lineHeight: 1.1 }}>BoxFlow OS — Live Demo</h1>
            <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.8, marginBottom: 8 }}>
              Watch a 60-second live walkthrough of BoxFlow OS — the Enterprise Operations System for any manufacturing or logistics company.
            </p>
            <p style={{ color: '#334155', fontSize: 14, marginBottom: 32 }}>
              Industry setup → Corrugator production → Roll stock → Fleet GPS → AI dispatch → Shift performance
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
              {SCENES.map((s, i) => (
                <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid ${s.color}33`, borderRadius: 12, padding: '12px 16px', textAlign: 'left' as const }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: s.color, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>{s.duration}s</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.4 }}>{s.subtitle}</div>
                </div>
              ))}
            </div>
            <button onClick={startDemo} style={{ padding: '20px 60px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', border: 'none', borderRadius: 16, color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 40px rgba(37,99,235,0.4)' }}>
              ▶ Start Live Demo
            </button>
            <div style={{ marginTop: 16, fontSize: 13, color: '#334155' }}>60 seconds • No signup required • Real platform data</div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
              <a href="/enterprise" style={{ padding: '10px 24px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, color: '#60a5fa', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Request a Demo Call →</a>
              <a href="/industry-setup" style={{ padding: '10px 24px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, color: '#22c55e', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Try Industry Setup →</a>
            </div>
          </div>
        </div>
      ) : (
        /* DEMO PLAYER */
        <div style={{ padding: 20 }}>
          {/* Progress */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: currentScene.color }}>{currentScene.title}</span>
                <span style={{ fontSize: 12, color: '#475569' }}>— {currentScene.subtitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#4f8ef7' }}>{elapsed}s / {TOTAL}s</span>
                <button onClick={stopDemo} style={{ padding: '5px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>■ Stop</button>
              </div>
            </div>
            <div style={{ height: 4, background: 'rgba(99,132,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, #4f8ef7, ${currentScene.color})`, borderRadius: 999, transition: 'width 1s linear' }} />
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
              {SCENES.map((s, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 999, background: i < scene ? s.color : i === scene ? s.color + '88' : 'rgba(99,132,255,0.1)' }} />
              ))}
            </div>
          </div>

          {/* Scene 0 — Industry Setup */}
          {scene === 0 && (
            <div style={{ background: '#070f1f', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 }}>BoxFlow OS — Industry Setup</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 20 }}>What type of operation do you run?</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {industries.map(ind => (
                  <div key={ind.id} style={{ padding: 16, borderRadius: 12, border: `2px solid ${selectedIndustry === ind.id ? ind.color : 'rgba(99,132,255,0.15)'}`, background: selectedIndustry === ind.id ? `${ind.color}15` : 'rgba(15,23,42,0.6)', transition: 'all 0.3s ease' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{ind.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selectedIndustry === ind.id ? ind.color : '#64748b' }}>{ind.name}</div>
                  </div>
                ))}
              </div>
              {industryConfirmed && (
                <div style={{ padding: '14px 20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, fontSize: 15, fontWeight: 700, color: '#22c55e' }}>
                  ✅ Corrugated & Paper selected — launching your configured dashboard...
                </div>
              )}
            </div>
          )}

          {/* Scene 1 — Order Queue */}
          {scene === 1 && (
            <div style={{ background: '#070f1f', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', background: 'rgba(168,85,247,0.1)', borderBottom: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#a855f7', textTransform: 'uppercase' as const, letterSpacing: 1 }}>Oklahoma Corrugator — AIAB Order Queue — Live</span>
              </div>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(99,132,255,0.15)' }}>
                    {['Program', 'Status', 'Length', 'Flute', 'Width', 'Papers Required', 'Est. Completion'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left' as const, fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(99,132,255,0.06)', background: o.status === 'PROC' ? 'rgba(34,197,94,0.05)' : 'transparent' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff', fontSize: 14 }}>{o.program}</td>
                      <td style={{ padding: '12px 14px' }}><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${statusColor[o.status]}22`, color: statusColor[o.status] }}>{o.status}</span></td>
                      <td style={{ padding: '12px 14px', color: '#cbd5e1', fontFamily: 'monospace' }}>{o.length.toLocaleString()}</td>
                      <td style={{ padding: '12px 14px' }}><span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${fluteColor[o.flute]}22`, color: fluteColor[o.flute] }}>{o.flute}</span></td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{o.width}"</td>
                      <td style={{ padding: '12px 14px', color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}>{o.papers}</td>
                      <td style={{ padding: '12px 14px', color: o.status === 'PROC' ? '#22c55e' : '#4f8ef7', fontWeight: 700, fontFamily: 'monospace' }}>{formatTime(timeLeftArr[i])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Scene 2 — Roll Stock */}
          {scene === 2 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {[
                { id: '6B02293A', grade: 'L25', station: 'SF1 - B Flute', position: 'Left', rem: remPaper, shortage: 43135 },
                { id: '6C16152A', grade: 'R24', station: 'SF1 - B Flute', position: 'Right', rem: 90627, shortage: 63193 },
                { id: '6B02303A', grade: 'L25', station: 'SF2 - C Flute', position: 'Left', rem: 68108, shortage: 50099 },
                { id: '6B21191A', grade: 'K42', station: 'SF2 - C Flute', position: 'Right', rem: 0, shortage: 0 },
              ].map(r => {
                const pct = Math.min(100, (r.rem / 90000) * 100)
                return (
                  <div key={r.id} style={{ background: '#070f1f', border: `1px solid ${r.shortage > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(79,142,247,0.2)'}`, borderRadius: 14, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#4f8ef7' }}>{r.id}</div>
                        <div style={{ fontSize: 11, color: '#475569' }}>{r.station} — {r.position}</div>
                      </div>
                      <span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700, background: 'rgba(168,85,247,0.15)', color: '#a855f7', alignSelf: 'flex-start' as const }}>{r.grade}</span>
                    </div>
                    {[['REM Paper', `${r.rem.toLocaleString()} ft`], ['Shortage', `${r.shortage.toLocaleString()} ft`]].map(([l, v]) => (
                      <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(99,132,255,0.06)' }}>
                        <span style={{ fontSize: 11, color: '#475569' }}>{l}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ height: 6, background: 'rgba(99,132,255,0.1)', borderRadius: 999, overflow: 'hidden', marginBottom: 6 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct < 30 ? '#ef4444' : pct < 60 ? '#f59e0b' : '#22c55e', borderRadius: 999, transition: 'width 1s linear' }} />
                      </div>
                      <div style={{ fontSize: 11, color: '#4f8ef7', fontWeight: 700 }}>⏱ {formatTime(Math.floor(r.rem / speed))} remaining at {speed} FPM</div>
                      {r.shortage > 0 && <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444', fontWeight: 700 }}>⚠ Shortage: {r.shortage.toLocaleString()} ft</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Scene 3 — Fleet GPS */}
          {scene === 3 && (
            <div style={{ background: '#070f1f', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', background: 'rgba(34,197,94,0.08)', borderBottom: '1px solid rgba(34,197,94,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#22c55e', textTransform: 'uppercase' as const, letterSpacing: 1 }}>● Fleet GPS — Live Tracking</span>
                <span style={{ fontSize: 11, color: '#475569' }}>{trucks.length} trucks active</span>
              </div>
              <div style={{ position: 'relative' as const, height: 280, background: '#0a1628', overflow: 'hidden' }}>
                <svg width="100%" height="100%" style={{ position: 'absolute' as const, inset: 0 }}>
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#1e3a5f" strokeWidth="8" />
                  <line x1="30%" y1="0" x2="70%" y2="100%" stroke="#1e3a5f" strokeWidth="6" />
                  <line x1="0" y1="30%" x2="100%" y2="70%" stroke="#1e3a5f" strokeWidth="5" />
                  <text x="10" y="20" fontSize="11" fill="rgba(99,132,255,0.4)" fontWeight="700">Oklahoma City</text>
                  <text x="75%" y="90%" fontSize="11" fill="rgba(99,132,255,0.4)" fontWeight="700">Dallas</text>
                  <text x="60%" y="15%" fontSize="11" fill="rgba(99,132,255,0.4)" fontWeight="700">Kansas City</text>
                </svg>
                {trucks.map((t, i) => (
                  <div key={t.id} style={{ position: 'absolute' as const, left: `${truckX[i]}%`, top: `${t.y}%`, transform: 'translate(-50%,-50%)', transition: 'left 1s linear' }}>
                    <div style={{ fontSize: 20 }}>🚛</div>
                    <div style={{ background: 'rgba(2,8,18,0.9)', padding: '2px 6px', borderRadius: 4, fontSize: 9, color: '#22c55e', fontWeight: 700, whiteSpace: 'nowrap' as const, marginTop: 2 }}>{t.id}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid rgba(99,132,255,0.1)' }}>
                {trucks.map((t, i) => (
                  <div key={t.id} style={{ padding: '12px 14px', borderRight: i < 3 ? '1px solid rgba(99,132,255,0.08)' : 'none' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#4f8ef7', marginBottom: 4 }}>{t.id}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{t.driver}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{t.from} → {t.to}</div>
                    <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, marginTop: 4 }}>ETA: {t.eta}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scene 4 — AI Dispatch */}
          {scene === 4 && (
            <div style={{ background: '#070f1f', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>AI Dispatch Engine</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>One Click — AI Optimizes Everything</div>
                </div>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: aiStep > 3 ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)', border: `2px solid ${aiStep > 3 ? '#22c55e' : '#f59e0b'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {aiStep > 3 ? '✅' : '⚡'}
                </div>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {[
                  { action: 'Analyzed 4 active orders vs available fleet capacity', done: aiStep >= 1 },
                  { action: 'Assigned TRK-201 to ORD-1007 — Rush priority — Dallas route optimized', done: aiStep >= 2 },
                  { action: 'Rerouted TRK-305 — saved 18 minutes on Tulsa → Fort Worth run', done: aiStep >= 3 },
                  { action: 'Flagged ORD-1005 for manual review — capacity constraint detected', done: aiStep >= 4 },
                  { action: 'Estimated savings: $1,240 in fuel and time today', done: aiStep >= 5 },
                ].map((a, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, background: a.done ? 'rgba(34,197,94,0.08)' : 'rgba(99,132,255,0.05)', border: `1px solid ${a.done ? 'rgba(34,197,94,0.2)' : 'rgba(99,132,255,0.1)'}`, transition: 'all 0.5s ease' }}>
                    <span style={{ fontSize: 16 }}>{a.done ? '✅' : '⏳'}</span>
                    <span style={{ fontSize: 13, color: a.done ? '#e2e8f0' : '#475569' }}>{a.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scene 5 — Shift Performance */}
          {scene === 5 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#070f1f', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 16 }}>Shift 3 — Time Breakdown</div>
                {[
                  { label: 'Elapsed Time', value: '07:53:28', color: '#fff' },
                  { label: 'Run Time', value: '06:11:41', color: '#22c55e' },
                  { label: 'Down Time', value: '01:43:00', color: '#ef4444' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{r.label}</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: r.color, fontFamily: 'monospace' }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, marginBottom: 6 }}>EFFICIENCY</div>
                  <div style={{ height: 8, background: 'rgba(99,132,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '78%', background: '#22c55e', borderRadius: 999 }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 700, marginTop: 6 }}>78% Run Efficiency</div>
                </div>
              </div>
              <div style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.15)', borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 16 }}>Production Output</div>
                {[
                  { label: 'Speed (FPM)', value: `${speed}`, color: '#22c55e' },
                  { label: 'Total Footage', value: footage.toLocaleString(), color: '#4f8ef7' },
                  { label: 'C Flute', value: '79,889 ft', color: '#a855f7' },
                  { label: 'B Flute', value: '120,776 ft', color: '#4f8ef7' },
                  { label: 'Waste % Trim', value: '3.14%', color: '#f59e0b' },
                  { label: 'Order Changes', value: '5', color: '#94a3b8' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(99,132,255,0.06)' }}>
                    <span style={{ fontSize: 12, color: '#64748b' }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.color, fontFamily: 'monospace' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
            {[
              { label: 'Speed', value: `${speed} FPM`, color: '#22c55e' },
              { label: 'REM Paper', value: `${remPaper.toLocaleString()} ft`, color: '#4f8ef7' },
              { label: 'Total Footage', value: footage.toLocaleString(), color: '#a855f7' },
              { label: 'Scene', value: `${scene + 1} of ${SCENES.length}`, color: currentScene.color },
            ].map(k => (
              <div key={k.label} style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.1)', borderRadius: 10, padding: '10px 14px', borderTop: `2px solid ${k.color}` }}>
                <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: k.color, fontFamily: 'monospace' }}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}