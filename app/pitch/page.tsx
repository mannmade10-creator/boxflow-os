'use client'
import { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    type: 'cover',
    label: 'Introduction',
    title: 'BoxFlow OS',
    subtitle: 'The Enterprise Operations System for Paper Manufacturing & Logistics',
    body: 'Corrugator · Dispatch · Fleet · Production · AI · HR · Client Portal',
    note: 'One platform. Every operation. Built from the plant floor up.',
    color: '#3b82f6',
  },
  {
    id: 2,
    type: 'problem',
    label: 'The Problem',
    title: 'Box Plants Are Running on Legacy Systems From the 1980s',
    points: [
      '🖥️ KIWIPLAN — order queue terminal, green screen interface, deployed 1985',
      '🖥️ Qualitek — wet-end production control, separate hardware terminal',
      '📋 Dispatch software — $2,000/month, not connected to production',
      '🚛 Fleet tracking — $1,500/month, separate login, separate data',
      '👥 HR + Payroll — $800/month, no connection to floor operations',
      '📊 Analytics — spreadsheets, manual reports, always a day behind',
    ],
    total: 'Total: $7,200+/month for DISCONNECTED, OUTDATED tools',
    color: '#ef4444',
  },
  {
    id: 3,
    type: 'solution',
    label: 'The Solution',
    title: 'BoxFlow OS — Everything in One Modern Platform',
    points: [
      '✅ Corrugator Production System — replaces KIWIPLAN + Qualitek entirely',
      '✅ Real-time order queue with live completion timers per order',
      '✅ Roll stock tracker with splice timers and shortage alerts',
      '✅ Smart Dispatch with AI truck assignment and GPS routing',
      '✅ Live Fleet Map with real-time driver tracking',
      '✅ HR + Payroll Command Center',
      '✅ Client Portal — clients track their order from production to delivery',
    ],
    total: 'All of this: Starting at $599/month',
    color: '#22c55e',
  },
  {
    id: 4,
    type: 'corrugator',
    label: 'Corrugator Module',
    title: 'The KIWIPLAN & Qualitek Replacement',
    features: [
      { icon: '📋', title: 'Order Queue (AIAB)', desc: 'Full transmission queue — HIST, PROC, XMTD, RXMT with live countdown timers for every order based on current machine speed' },
      { icon: '🎞️', title: 'Roll Stock Timers', desc: 'Real-time remaining paper calculation, time-to-splice countdown, shortage alerts with color-coded urgency per station' },
      { icon: '📊', title: 'Shift Performance', desc: 'Elapsed time, run time, downtime, footage by flute B/C/BC, waste %, and number of order changes — all in real time' },
      { icon: '⬇️', title: 'Downtime Logging', desc: 'One-tap downtime event logging — paper break, splice, order change, mechanical, washup, scheduled break, no orders' },
      { icon: '⚡', title: 'DB Cruise Control', desc: 'Manager-only speed slider from 200-800 FPM. All order timers, roll timers, and completion estimates recalculate instantly' },
      { icon: '🔐', title: 'Role-Based Access', desc: 'Machine operators clock in on-site only. Production managers access the full dashboard from anywhere — including home' },
    ],
    color: '#a855f7',
  },
  {
    id: 5,
    type: 'demo',
    label: 'Live Demo',
    title: 'See It In Action',
    demos: [
      { icon: '🏭', title: 'Corrugator Dashboard', desc: 'Live order queue, roll stock timers, shift performance — all updating in real time at boxflowos.com/production-v2' },
      { icon: '🚀', title: 'Demo Mode', desc: 'Watch orders update, trucks move, and alerts fire in real time from the executive dashboard' },
      { icon: '🗺️', title: 'Fleet Map', desc: 'Live GPS tracking with route optimization and ETA predictions for every truck' },
      { icon: '📱', title: 'Mobile Apps', desc: 'Driver app and client order tracking app — both live on Android right now' },
    ],
    color: '#8b5cf6',
  },
  {
    id: 6,
    type: 'market',
    label: 'Market Size',
    title: 'Massive Market. Zero Modern Competition.',
    stats: [
      { value: '$52B', label: 'Global TMS Market by 2030', color: '#3b82f6' },
      { value: '1,400+', label: 'Corrugated box plants in the US', color: '#a855f7' },
      { value: '$7,200', label: 'Avg monthly spend on disconnected tools', color: '#f59e0b' },
      { value: '1985', label: 'Year KIWIPLAN was first deployed', color: '#ef4444' },
    ],
    color: '#0ea5e9',
  },
  {
    id: 7,
    type: 'revenue',
    label: 'Revenue Model',
    title: 'Multiple Revenue Streams',
    streams: [
      { name: 'Starter Plan', price: '$599/mo', desc: 'Small operations, 1 location', color: '#3b82f6' },
      { name: 'Professional Plan', price: '$1,899/mo', desc: 'Mid-size, up to 3 locations', color: '#8b5cf6' },
      { name: 'Enterprise Plan', price: '$4,499/mo', desc: 'Large operations, unlimited', color: '#22c55e' },
      { name: 'Per-Truck Add-on', price: '$15/truck/mo', desc: 'Scales with fleet size', color: '#f59e0b' },
      { name: 'White Label', price: '$799/mo', desc: 'Resellers and agencies', color: '#a855f7' },
      { name: 'API Access', price: '$299/mo', desc: 'Custom integrations', color: '#0ea5e9' },
    ],
    color: '#22c55e',
  },
  {
    id: 8,
    type: 'traction',
    label: 'Traction',
    title: 'Built. Tested. Ready to Scale.',
    metrics: [
      { value: '15+', label: 'Core modules built', color: '#3b82f6' },
      { value: '2', label: 'Live SaaS products', color: '#22c55e' },
      { value: '2', label: 'Android apps built', color: '#a855f7' },
      { value: '$0', label: 'Raised to date', color: '#f59e0b' },
    ],
    points: [
      'Full-stack SaaS built on Next.js 16 + Supabase — deployed on Vercel',
      'Corrugator Production System live at boxflowos.com/production-v2',
      'PropFlow OS property management platform live at propflowos.com',
      'Real-time GPS with Mapbox satellite imagery integration',
      'Stripe live payments — $63 rental application fee processing',
      'TransUnion SmartMove credit screening integration',
      'Android APK built — Google Play submission ready',
    ],
    color: '#f59e0b',
  },
  {
    id: 9,
    type: 'ask',
    label: 'The Ask',
    title: "We're Raising to Scale",
    ask: '$250,000',
    use: [
      { pct: '40%', label: 'Sales & Marketing', color: '#3b82f6' },
      { pct: '30%', label: 'Engineering & AI', color: '#8b5cf6' },
      { pct: '20%', label: 'Operations & Support', color: '#22c55e' },
      { pct: '10%', label: 'Legal & Infrastructure', color: '#f59e0b' },
    ],
    goal: 'Goal: 50 paying customers in 12 months = $570K ARR',
    color: '#a855f7',
  },
]

export default function PitchPage() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
      if (e.key === 'Escape') window.location.href = '/dashboard'
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [current])

  function goNext() {
    if (current < slides.length - 1 && !animating) {
      setAnimating(true)
      setTimeout(() => { setCurrent(c => c + 1); setAnimating(false) }, 200)
    }
  }

  function goPrev() {
    if (current > 0 && !animating) {
      setAnimating(true)
      setTimeout(() => { setCurrent(c => c - 1); setAnimating(false) }, 200)
    }
  }

  const slide = slides[current]

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 30% 20%, rgba(37,99,235,0.2), transparent 50%), radial-gradient(circle at 70% 80%, rgba(139,92,246,0.15), transparent 50%), linear-gradient(180deg, #020617 0%, #050e1f 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column' as const }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(148,163,184,0.1)', background: 'rgba(5,8,22,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ fontWeight: 900, color: '#fff', fontSize: 16 }}>BoxFlow OS</span>
          <span style={{ color: '#334155', margin: '0 8px' }}>|</span>
          <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 700 }}>Investor Pitch Deck</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/demo" style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>▶ Live Demo</a>
          <div style={{ display: 'flex', gap: 6 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 999, background: i === current ? slide.color : 'rgba(148,163,184,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
            ))}
          </div>
          <span style={{ color: '#64748b', fontSize: 13 }}>{current + 1} / {slides.length}</span>
          <a href="/dashboard" style={{ padding: '6px 14px', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>✕ Exit</a>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 4vw, 60px)', opacity: animating ? 0 : 1, transition: 'opacity 0.2s ease' }}>
        <div style={{ maxWidth: 1000, width: '100%' }}>

          <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 999, background: slide.color + '20', border: '1px solid ' + slide.color + '40', color: slide.color, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 24 }}>
            {String(current + 1).padStart(2, '0')} — {slide.label}
          </div>

          {slide.type === 'cover' && (
            <div style={{ textAlign: 'center' as const }}>
              <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 120, marginBottom: 24 }} />
              <h1 style={{ fontSize: 'clamp(32px, 7vw, 80px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: -2, lineHeight: 1 }}>{slide.title}</h1>
              <p style={{ fontSize: 22, color: '#94a3b8', margin: '0 0 16px' }}>{slide.subtitle}</p>
              <p style={{ fontSize: 16, color: slide.color, fontWeight: 700, letterSpacing: 2 }}>{slide.body}</p>
              <div style={{ marginTop: 40, padding: '16px 32px', background: slide.color + '15', border: '1px solid ' + slide.color + '30', borderRadius: 16, display: 'inline-block' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{slide.note}</span>
              </div>
              <div style={{ marginTop: 24 }}>
                <a href="/demo" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 16, boxShadow: '0 0 30px rgba(239,68,68,0.3)' }}>▶ Watch 60-Second Live Demo</a>
              </div>
            </div>
          )}

          {(slide.type === 'problem' || slide.type === 'solution') && (
            <div>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 48px)', fontWeight: 900, margin: '0 0 40px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gap: 14, marginBottom: 32 }}>
                {slide.points?.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.12)', borderLeft: '3px solid ' + slide.color, borderRadius: 14, padding: '16px 20px', fontSize: 18, color: '#e2e8f0', fontWeight: 600 }}>
                    {point}
                  </div>
                ))}
              </div>
              <div style={{ padding: '20px 28px', background: slide.color + '15', border: '2px solid ' + slide.color + '40', borderRadius: 16, fontSize: 20, fontWeight: 900, color: slide.color }}>
                {slide.total}
              </div>
            </div>
          )}

          {slide.type === 'corrugator' && (
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 48px)', fontWeight: 900, margin: '0 0 12px' }}>{slide.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 32 }}>Live at boxflowos.com/production-v2 — replacing KIWIPLAN and Qualitek on the International Paper Oklahoma City corrugator floor.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {slide.features?.map((f: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(168,85,247,0.2)', borderTop: '3px solid ' + slide.color, borderRadius: 16, padding: 24 }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#c084fc', marginBottom: 8 }}>{f.title}</div>
                    <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'demo' && (
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 56px)', fontWeight: 900, margin: '0 0 12px' }}>{slide.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 32 }}>Live system — not a mockup. Real data. Real production floor.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
                {slide.demos?.map((demo: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: 28 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>{demo.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{demo.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{demo.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
                <a href="/demo" style={{ display: 'inline-block', padding: '16px 36px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 16, boxShadow: '0 0 30px rgba(239,68,68,0.3)' }}>▶ Watch 60-Second Live Demo</a>
                <a href="/dashboard" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>Launch BoxFlow OS →</a>
                <a href="/production-v2" style={{ display: 'inline-block', padding: '14px 32px', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>View Corrugator →</a>
              </div>
            </div>
          )}

          {slide.type === 'market' && (
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 4vw, 52px)', fontWeight: 900, margin: '0 0 48px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                {slide.stats?.map((stat: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid ' + stat.color, borderRadius: 20, padding: 28, textAlign: 'center' as const }}>
                    <div style={{ fontSize: 44, fontWeight: 900, color: stat.color, marginBottom: 8 }}>{stat.value}</div>
                    <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'revenue' && (
            <div>
              <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 40px' }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {slide.streams?.map((stream: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderLeft: '3px solid ' + stream.color, borderRadius: 18, padding: 24 }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: stream.color, marginBottom: 6 }}>{stream.price}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{stream.name}</div>
                    <div style={{ color: '#64748b', fontSize: 13 }}>{stream.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'traction' && (
            <div>
              <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 40px' }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                {slide.metrics?.map((metric: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid ' + metric.color, borderRadius: 18, padding: 24, textAlign: 'center' as const }}>
                    <div style={{ fontSize: 40, fontWeight: 900, color: metric.color, marginBottom: 6 }}>{metric.value}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13 }}>{metric.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {slide.points?.map((point: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#cbd5e1', fontSize: 15, padding: '8px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: slide.color, flexShrink: 0 }} />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'ask' && (
            <div style={{ textAlign: 'center' as const }}>
              <h1 style={{ fontSize: 56, fontWeight: 900, margin: '0 0 12px' }}>{slide.title}</h1>
              <div style={{ fontSize: 96, fontWeight: 900, margin: '20px 0', color: '#a855f7' }}>{slide.ask}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, margin: '32px 0' }}>
                {slide.use?.map((item: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid ' + item.color, borderRadius: 18, padding: 24 }}>
                    <div style={{ fontSize: 32, fontWeight: 900, color: item.color, marginBottom: 6 }}>{item.pct}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '20px 32px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 16, display: 'inline-block', fontSize: 18, fontWeight: 800, color: '#c4b5fd', marginBottom: 24 }}>
                🎯 {slide.goal}
              </div>
              <div style={{ marginTop: 8 }}>
                <a href="/investors" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15, marginRight: 12 }}>Request Investor Package →</a>
                <a href="/demo" style={{ display: 'inline-block', padding: '14px 36px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>▶ Watch Live Demo</a>
              </div>
            </div>
          )}

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderTop: '1px solid rgba(148,163,184,0.1)', background: 'rgba(5,8,22,0.8)' }}>
        <button onClick={goPrev} disabled={current === 0} style={{ padding: '12px 28px', background: current === 0 ? 'rgba(148,163,184,0.05)' : 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, color: current === 0 ? '#334155' : '#fff', fontWeight: 700, cursor: current === 0 ? 'not-allowed' : 'pointer', fontSize: 15 }}>
          ← Previous
        </button>
        <div style={{ color: '#64748b', fontSize: 13 }}>Use ← → arrow keys to navigate • M.A.D.E Technologies Inc.</div>
        <button onClick={goNext} disabled={current === slides.length - 1} style={{ padding: '12px 28px', background: current === slides.length - 1 ? 'rgba(148,163,184,0.05)' : 'linear-gradient(135deg, ' + slide.color + ', ' + slide.color + 'cc)', border: 'none', borderRadius: 12, color: current === slides.length - 1 ? '#334155' : '#fff', fontWeight: 700, cursor: current === slides.length - 1 ? 'not-allowed' : 'pointer', fontSize: 15 }}>
          Next →
        </button>
      </div>
    </div>
  )
}