'use client'
import { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    type: 'cover',
    label: 'Introduction',
    title: 'BoxFlow OS',
    subtitle: 'Modernizing Corrugator Operations at International Paper',
    body: 'Corrugator · Dispatch · Fleet · Production · AI · HR',
    note: 'Replacing KIWIPLAN & Qualitek — Starting at OKC, Expanding Nationwide',
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
      '📋 Dispatch software — not connected to production data',
      '🚛 Fleet tracking — separate login, separate data, no integration',
      '👥 HR & Payroll — disconnected from floor operations entirely',
      '📊 Analytics — spreadsheets, manual reports, always a day behind',
    ],
    total: 'Total: $7,200+/month per plant for DISCONNECTED, OUTDATED tools',
    color: '#ef4444',
  },
  {
    id: 3,
    type: 'solution',
    label: 'The Solution',
    title: 'BoxFlow OS — One Modern Platform for Everything',
    points: [
      '✅ Corrugator Production System — direct KIWIPLAN + Qualitek replacement',
      '✅ Real-time order queue with live completion timers per order',
      '✅ Roll stock tracker — splice timers, shortage alerts, per station',
      '✅ Shift performance — run time, downtime, footage, waste % live',
      '✅ Smart Dispatch with AI truck assignment and GPS routing',
      '✅ Client Portal — customers track orders from production to delivery',
      '✅ HR, Payroll, Analytics — all in one platform',
    ],
    total: 'All of this: $4,499/month — saving IP $2,701/month per plant',
    color: '#22c55e',
  },
  {
    id: 4,
    type: 'corrugator',
    label: 'Corrugator Module',
    title: 'The KIWIPLAN & Qualitek Replacement — Live Today',
    features: [
      { icon: '📋', title: 'Order Queue (AIAB)', desc: 'Full transmission queue — HIST, PROC, XMTD, RXMT with live countdown timers for every order based on current machine speed' },
      { icon: '🎞️', title: 'Roll Stock Timers', desc: 'Real-time remaining paper, time-to-splice countdown, shortage alerts with color-coded urgency per station (SF1-B, SF2-C, WEB1, WEB2)' },
      { icon: '📊', title: 'Shift Performance', desc: 'Elapsed time, run time, downtime, footage by flute B/C/BC, waste %, number of order changes — all live' },
      { icon: '⬇️', title: 'Downtime Logging', desc: 'One-tap downtime event logging — paper break, splice, order change, mechanical, washup, scheduled break, no orders' },
      { icon: '⚡', title: 'DB Cruise Control', desc: 'Manager-only speed slider 200-800 FPM — all order timers, roll timers, and estimates recalculate instantly' },
      { icon: '🔐', title: 'Role-Based Access', desc: 'Machine operators clock in on-site only. Production managers access the full dashboard from anywhere — including home or corporate' },
    ],
    color: '#a855f7',
  },
  {
    id: 5,
    type: 'roi',
    label: 'ROI',
    title: 'The Financial Case — Per Plant & Nationwide',
    rows: [
      { label: 'KIWIPLAN License', current: '$2,500/mo', boxflow: '✅ Included', save: '$2,500/mo' },
      { label: 'Qualitek System', current: '$2,200/mo', boxflow: '✅ Included', save: '$2,200/mo' },
      { label: 'Dispatch & Fleet', current: '$1,500/mo', boxflow: '✅ Included', save: '$1,500/mo' },
      { label: 'HR & Payroll', current: '$1,000/mo', boxflow: '✅ Included', save: '$1,000/mo' },
      { label: 'TOTAL', current: '$7,200/mo', boxflow: '$4,499/mo', save: '$2,701/mo' },
    ],
    nationwide: '70 IP Plants × $2,701 savings = $2,268,840/year saved by IP',
    color: '#22c55e',
  },
  {
    id: 6,
    type: 'pilot',
    label: 'Pilot Proposal',
    title: '90-Day OKC Pilot — Then Nationwide',
    phase1: [
      { label: 'Facility', value: 'International Paper — Oklahoma City, OK' },
      { label: 'Duration', value: '90 days' },
      { label: 'License Fee', value: '$4,499/month' },
      { label: 'Setup & Training', value: 'Included at no charge' },
      { label: 'Support', value: '24/7 for production-critical issues' },
      { label: 'Go-Live', value: 'Within 30 days of agreement signing' },
    ],
    phase2: [
      { label: 'Plants', value: '70+ IP corrugated facilities' },
      { label: 'Per Plant (standard)', value: '$4,499/month' },
      { label: '25+ plants (volume)', value: '$3,499/month per plant' },
      { label: '50+ plants (volume)', value: '$2,999/month per plant' },
      { label: 'IP Annual Savings', value: '$2,268,840/year (70 plants)' },
    ],
    color: '#3b82f6',
  },
  {
    id: 7,
    type: 'ip',
    label: 'IP Ownership',
    title: 'M.A.D.E Technologies Retains Full IP Ownership',
    points: [
      '🔒 M.A.D.E Technologies owns 100% of BoxFlow OS source code and platform',
      '🔒 International Paper receives a non-exclusive facility license only',
      '🔒 No source code transfer — ever',
      '🔒 Custom features developed for IP remain property of M.A.D.E Technologies',
      '🔒 License is facility-based — not a company-wide perpetual license',
      '✅ Full NDA and MSA provided and ready for review',
      '✅ Oklahoma governing law — disputes resolved in Oklahoma County',
    ],
    color: '#a855f7',
  },
  {
    id: 8,
    type: 'next',
    label: 'Next Steps',
    title: 'Ready to Start — 30 Days to Go-Live',
    steps: [
      { num: '01', title: 'Execute NDA', desc: '5 business days — protect both parties during evaluation' },
      { num: '02', title: 'Review & Sign MSA', desc: '10 business days — pilot addendum at $4,499/month' },
      { num: '03', title: 'Kickoff Meeting', desc: 'OKC plant management + M.A.D.E Technologies — Day 1' },
      { num: '04', title: 'Configuration & Training', desc: 'System setup + operator and manager training — Days 1-7' },
      { num: '05', title: 'Go Live', desc: 'BoxFlow OS live on the corrugator floor — Day 8' },
      { num: '06', title: 'Nationwide Review', desc: '90-day pilot review + expansion discussion' },
    ],
    color: '#22c55e',
  },
]

export default function IPPitchPage() {
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

  const row = (label: string, current: string, boxflow: string, save: string, isTotal = false) => (
    <div key={label} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, borderBottom: '1px solid rgba(99,132,255,0.1)' }}>
      {[
        { text: label, color: isTotal ? '#fff' : '#94a3b8', bg: isTotal ? 'rgba(99,132,255,0.15)' : 'transparent' },
        { text: current, color: isTotal ? '#ef4444' : '#ef4444', bg: isTotal ? 'rgba(239,68,68,0.1)' : 'transparent' },
        { text: boxflow, color: isTotal ? '#22c55e' : '#22c55e', bg: isTotal ? 'rgba(34,197,94,0.1)' : 'transparent' },
        { text: save, color: isTotal ? '#4f8ef7' : '#4f8ef7', bg: isTotal ? 'rgba(79,142,247,0.1)' : 'transparent' },
      ].map((cell, i) => (
        <div key={i} style={{ padding: '12px 16px', background: cell.bg, fontWeight: isTotal ? 800 : 400, fontSize: isTotal ? 16 : 14, color: cell.color }}>
          {cell.text}
        </div>
      ))}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 30% 20%, rgba(37,99,235,0.2), transparent 50%), radial-gradient(circle at 70% 80%, rgba(139,92,246,0.15), transparent 50%), linear-gradient(180deg, #020617 0%, #050e1f 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column' as const }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(148,163,184,0.1)', background: 'rgba(5,8,22,0.9)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ fontWeight: 900, fontSize: 16 }}>BoxFlow OS</span>
          <span style={{ color: '#334155', margin: '0 8px' }}>|</span>
          <span style={{ color: '#93c5fd', fontSize: 13, fontWeight: 700 }}>International Paper Proposal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 999, background: i === current ? slide.color : 'rgba(148,163,184,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
            ))}
          </div>
          <a href="/demo" style={{ padding: "6px 14px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#ef4444", textDecoration: "none", fontSize: 12, fontWeight: 700 }}>? Live Demo</a><span style={{ color: "#64748b", fontSize: 13 }}>{current + 1} / {slides.length}</span>
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
              <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 100, marginBottom: 24 }} />
              <h1 style={{ fontSize: 'clamp(32px, 7vw, 72px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: -2, lineHeight: 1 }}>{slide.title}</h1>
              <p style={{ fontSize: 20, color: '#94a3b8', margin: '0 0 12px' }}>{slide.subtitle}</p>
              <p style={{ fontSize: 15, color: slide.color, fontWeight: 700, letterSpacing: 2 }}>{slide.body}</p>
              <div style={{ marginTop: 40, padding: '16px 32px', background: slide.color + '15', border: '1px solid ' + slide.color + '30', borderRadius: 16, display: 'inline-block' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{slide.note}</span>
              </div>
              <div style={{ marginTop: 24, fontSize: 13, color: '#475569' }}>
                Kenneth Covington — Founder & CEO, M.A.D.E Technologies Inc. | Kenneth.Covington@madetechnologies.com
              </div>
            </div>
          )}

          {(slide.type === 'problem' || slide.type === 'solution') && (
            <div>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 44px)', fontWeight: 900, margin: '0 0 36px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gap: 12, marginBottom: 28 }}>
                {slide.points?.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.12)', borderLeft: '3px solid ' + slide.color, borderRadius: 12, padding: '14px 18px', fontSize: 16, color: '#e2e8f0', fontWeight: 500 }}>
                    {point}
                  </div>
                ))}
              </div>
              <div style={{ padding: '18px 24px', background: slide.color + '15', border: '2px solid ' + slide.color + '40', borderRadius: 14, fontSize: 18, fontWeight: 900, color: slide.color }}>
                {slide.total}
              </div>
            </div>
          )}

          {slide.type === 'corrugator' && (
            <div>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 44px)', fontWeight: 900, margin: '0 0 8px' }}>{slide.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 28 }}>Live now at boxflowos.com/production-v2</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                {slide.features?.map((f: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(168,85,247,0.2)', borderTop: '3px solid ' + slide.color, borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{f.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#c084fc', marginBottom: 6 }}>{f.title}</div>
                    <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'roi' && (
            <div>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 44px)', fontWeight: 900, margin: '0 0 28px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,132,255,0.15)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: 'rgba(99,132,255,0.15)', padding: '10px 16px' }}>
                  {['System', 'Current Cost', 'BoxFlow OS', 'Monthly Saving'].map(h => (
                    <div key={h} style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: 1 }}>{h}</div>
                  ))}
                </div>
                {slide.rows?.map((r: any, i: number) => row(r.label, r.current, r.boxflow, r.save, r.label === 'TOTAL'))}
              </div>
              <div style={{ padding: '18px 24px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, fontSize: 16, fontWeight: 800, color: '#22c55e' }}>
                🌍 {slide.nationwide}
              </div>
            </div>
          )}

          {slide.type === 'pilot' && (
            <div>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 44px)', fontWeight: 900, margin: '0 0 28px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 12, color: '#4f8ef7', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 16 }}>Phase 1 — OKC Pilot</div>
                  {slide.phase1?.map((r: any) => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(99,132,255,0.08)', flexWrap: 'wrap' as const, gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#475569' }}>{r.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 16 }}>Phase 2 — Nationwide</div>
                  {slide.phase2?.map((r: any) => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(99,132,255,0.08)', flexWrap: 'wrap' as const, gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#475569' }}>{r.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {slide.type === 'ip' && (
            <div>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 44px)', fontWeight: 900, margin: '0 0 36px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gap: 12 }}>
                {slide.points?.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(168,85,247,0.15)', borderLeft: '3px solid ' + slide.color, borderRadius: 12, padding: '14px 18px', fontSize: 16, color: '#e2e8f0', fontWeight: 500 }}>
                    {point}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
                <a href="/nda" style={{ padding: '12px 24px', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>View NDA →</a>
                <a href="/msa" style={{ padding: '12px 24px', background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.3)', color: '#4f8ef7', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>View MSA →</a>
              </div>
            </div>
          )}

          {slide.type === 'next' && (
            <div>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 44px)', fontWeight: 900, margin: '0 0 28px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
                {slide.steps?.map((s: any) => (
                  <div key={s.num} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: slide.color, marginBottom: 8 }}>{s.num}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '20px 24px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 14, textAlign: 'center' as const }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e', marginBottom: 6 }}>Ready to move forward?</div>
                <div style={{ fontSize: 14, color: '#475569' }}>Kenneth.Covington@madetechnologies.com | boxflowos.com</div>
              </div>
            </div>
          )}

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderTop: '1px solid rgba(148,163,184,0.1)', background: 'rgba(5,8,22,0.8)' }}>
        <button onClick={goPrev} disabled={current === 0} style={{ padding: '12px 28px', background: current === 0 ? 'rgba(148,163,184,0.05)' : 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, color: current === 0 ? '#334155' : '#fff', fontWeight: 700, cursor: current === 0 ? 'not-allowed' : 'pointer', fontSize: 15 }}>
          ← Previous
        </button>
        <div style={{ color: '#64748b', fontSize: 12 }}>Use ← → arrow keys • M.A.D.E Technologies Inc. — CONFIDENTIAL</div>
        <button onClick={goNext} disabled={current === slides.length - 1} style={{ padding: '12px 28px', background: current === slides.length - 1 ? 'rgba(148,163,184,0.05)' : 'linear-gradient(135deg, ' + slide.color + ', ' + slide.color + 'cc)', border: 'none', borderRadius: 12, color: current === slides.length - 1 ? '#334155' : '#fff', fontWeight: 700, cursor: current === slides.length - 1 ? 'not-allowed' : 'pointer', fontSize: 15 }}>
          Next →
        </button>
      </div>
    </div>
  )
}
