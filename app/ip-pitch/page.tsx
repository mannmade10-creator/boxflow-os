'use client'

import React, { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    type: 'cover',
    label: 'Confidential',
    title: 'International Paper',
    subtitle: 'A $14,000,000 Opportunity',
    body: 'Prepared exclusively for International Paper Executive Leadership',
    note: 'Confidential — Not for Distribution',
    color: '#3b82f6',
  },
  {
    id: 2,
    type: 'attention',
    label: 'The Opportunity',
    title: 'What If You Could Cut Your Software Bill by 96%?',
    body: 'International Paper is one of the most sophisticated paper and packaging companies in the world. Yet like most Fortune 500 companies, you are paying premium prices to multiple vendors for software that was never designed to work together.',
    highlight: 'This presentation shows you exactly where the money is going — and how to get most of it back.',
    color: '#f59e0b',
  },
  {
    id: 3,
    type: 'spend',
    label: 'Current Spend',
    title: 'What International Paper Pays Today',
    vendors: [
      { name: 'McLeod Software', category: 'Dispatch & TMS', cost: '$2,000,000+', color: '#ef4444' },
      { name: 'Samsara', category: 'Fleet Tracking', cost: '$1,500,000+', color: '#ef4444' },
      { name: 'SAP', category: 'ERP & Operations', cost: '$5,000,000+', color: '#ef4444' },
      { name: 'Oracle', category: 'Business Intelligence', cost: '$3,000,000+', color: '#ef4444' },
      { name: 'TMW Systems', category: 'Transportation Mgmt', cost: '$2,000,000+', color: '#ef4444' },
      { name: 'Fishbowl', category: 'Inventory Management', cost: '$1,000,000+', color: '#ef4444' },
      { name: 'Additional Platforms', category: '10+ other systems', cost: '$1,500,000+', color: '#ef4444' },
    ],
    total: 'Estimated Annual Software Spend: $16,000,000+',
    color: '#ef4444',
  },
  {
    id: 4,
    type: 'problem',
    label: 'The Real Cost',
    title: 'But The Money Is Only Half The Problem',
    points: [
      '🔄 Your teams switch between 6+ systems every single day',
      '⏱ Hours wasted daily on manual data re-entry between platforms',
      '📊 No single source of truth for operations leadership',
      '🚨 Production delays caused by disconnected dispatch and floor data',
      '👥 HR and operations managed on completely separate systems',
      '📍 No unified visibility across multiple facilities',
      '🤖 Zero AI optimization — everything is still manual',
      '💸 Vendors charge renewal fees knowing you are locked in',
    ],
    total: 'The hidden cost of disconnected software is measured in millions more — in lost productivity, delays, and missed optimization.',
    color: '#f59e0b',
  },
  {
    id: 5,
    type: 'solution',
    label: 'The Solution',
    title: 'One Platform Replaces All of It',
    points: [
      '✅ Replaces McLeod & TMW — Smart Dispatch + Route Optimization',
      '✅ Replaces Samsara — Live GPS Fleet Map + Driver Management',
      '✅ Replaces SAP & Oracle — Executive Dashboard + Full Analytics',
      '✅ Replaces Fishbowl — Production Flow Tracker + Inventory',
      '✅ Replaces HR Systems — Full HR + Payroll Module',
      '✅ Adds What None of Them Have — AI Control Panel',
      '✅ Adds What None of Them Have — Client Portal with Live Tracking',
      '✅ Adds What None of Them Have — Real-time Alerts + Notifications',
    ],
    total: 'BoxFlow OS — Built specifically for paper manufacturing and logistics operations.',
    color: '#22c55e',
  },
  {
    id: 6,
    type: 'demo',
    label: 'Live System',
    title: 'This Is Built. Right Now. Live.',
    demos: [
      { icon: '🏭', title: 'Production Floor Tracker', desc: 'Machine status, output per hour, downtime alerts, efficiency tracking — built for box and paper manufacturing' },
      { icon: '🚛', title: 'Live Fleet Dispatch', desc: 'Real GPS tracking, AI route optimization, driver assignment, delivery status — all in one screen' },
      { icon: '🤖', title: 'AI Control Panel', desc: 'One click to optimize production, reassign drivers, reduce delays — AI that actually takes action' },
      { icon: '📊', title: 'Executive Dashboard', desc: 'The single source of truth leadership needs — orders, fleet, production, HR, all live in one view' },
    ],
    color: '#8b5cf6',
  },
  {
    id: 7,
    type: 'savings',
    label: 'The Math',
    title: 'The Numbers Speak for Themselves',
    stats: [
      { value: '$16M+', label: 'Current estimated annual software spend', color: '#ef4444' },
      { value: '10+', label: 'Disconnected platforms currently in use', color: '#f59e0b' },
      { value: '$14M+', label: 'Potential annual savings with BoxFlow OS', color: '#22c55e' },
      { value: '96%', label: 'Cost reduction vs current software stack', color: '#3b82f6' },
    ],
    bottom: 'Every year International Paper continues with the current setup is another $14,000,000 that does not have to be spent.',
    color: '#22c55e',
  },
  {
    id: 8,
    type: 'custom',
    label: 'Built for IP',
    title: 'This Would Be Built Around International Paper',
    points: [
      '🎨 Fully branded as International Paper internal software',
      '🔗 Integrated with your existing legacy systems via API',
      '🏭 Production stages customized for corrugated manufacturing',
      '🚛 Fleet management built around IP vehicle specifications',
      '📍 Multi-facility support for every IP location nationwide',
      '🔒 Enterprise security meeting all IP compliance requirements',
      '👥 HR module mapped to IP workforce structure and policies',
      '📞 Dedicated development team for ongoing customization',
    ],
    color: '#0ea5e9',
  },
  {
    id: 9,
    type: 'offer',
    label: 'The Conversation',
    title: 'I Am Not Here to Sell You Software',
    body: 'I am here because I have worked at International Paper. I have seen firsthand how much time and money is lost every day to disconnected systems. I built the solution — not as an outside vendor trying to close a deal — but as someone who genuinely understands this company and wants to see it operate at its full potential.',
    points: [
      'I am not asking for a purchase order today',
      'I am asking for 30 minutes and an NDA',
      'Let me show you what I built',
      'Then you tell me what it is worth to International Paper',
    ],
    question: 'What would saving $14,000,000 per year be worth to this company?',
    color: '#22c55e',
  },
  {
    id: 10,
    type: 'next',
    label: 'Next Steps',
    title: 'Four Simple Steps',
    steps: [
      { num: '01', title: 'Sign an NDA', desc: 'Protect both parties during the evaluation process — standard mutual NDA' },
      { num: '02', title: 'Live Demo', desc: '30-minute walkthrough of the full platform — all modules, live data, real AI' },
      { num: '03', title: 'Pilot Program', desc: 'Start with one facility or one department — prove the ROI before full commitment' },
      { num: '04', title: 'You Make the Call', desc: 'After seeing the savings, International Paper decides what this partnership looks like' },
    ],
    goal: 'One conversation. $14,000,000 in potential annual savings.',
    color: '#3b82f6',
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

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 30% 20%, rgba(37,99,235,0.15), transparent 50%), linear-gradient(180deg, #020617 0%, #050e1f 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(148,163,184,0.1)', background: 'rgba(5,8,22,0.9)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ fontWeight: 900, color: '#fff', fontSize: 16 }}>BoxFlow OS</span>
          <span style={{ color: '#334155', margin: '0 8px' }}>|</span>
          <span style={{ color: '#f59e0b', fontSize: 13, fontWeight: 700 }}>🔒 Confidential — International Paper Executive Presentation</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 999, background: i === current ? slide.color : 'rgba(148,163,184,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
            ))}
          </div>
          <span style={{ color: '#64748b', fontSize: 13 }}>{current + 1} / {slides.length}</span>
          <a href="/dashboard" style={{ padding: '6px 14px', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>✕ Exit</a>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 60px', opacity: animating ? 0 : 1, transition: 'opacity 0.2s ease' }}>
        <div style={{ maxWidth: 1000, width: '100%' }}>
          <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 999, background: slide.color + '20', border: '1px solid ' + slide.color + '40', color: slide.color, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>
            {String(current + 1).padStart(2, '0')} — {slide.label}
          </div>

          {slide.type === 'cover' && (
            <div style={{ textAlign: 'center' }}>
              <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 100, marginBottom: 24, filter: 'drop-shadow(0 0 40px rgba(37,99,235,0.6))' }} />
              <h1 style={{ fontSize: 80, fontWeight: 900, margin: '0 0 8px', letterSpacing: -2, lineHeight: 1, background: 'linear-gradient(135deg, #fff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{slide.title}</h1>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#22c55e', margin: '16px 0 24px' }}>{slide.subtitle}</div>
              <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 32 }}>{slide.body}</p>
              <div style={{ padding: '16px 32px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 16, display: 'inline-block' }}>
                <span style={{ color: '#f59e0b', fontWeight: 800 }}>🔒 {slide.note}</span>
              </div>
            </div>
          )}

          {slide.type === 'attention' && (
            <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
              <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 32px', lineHeight: 1.1 }}>{slide.title}</h1>
              <p style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.8, marginBottom: 40 }}>{slide.body}</p>
              <div style={{ padding: '24px 36px', background: 'rgba(245,158,11,0.1)', border: '2px solid rgba(245,158,11,0.3)', borderRadius: 20 }}>
                <p style={{ fontSize: 20, color: '#fde68a', fontWeight: 700, margin: 0, lineHeight: 1.6 }}>{slide.highlight}</p>
              </div>
            </div>
          )}

          {slide.type === 'spend' && (
            <div>
              <h1 style={{ fontSize: 44, fontWeight: 900, margin: '0 0 32px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
                {slide.vendors?.map((vendor, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(127,29,29,0.15)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: '14px 24px' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>{vendor.name}</div>
                      <div style={{ color: '#64748b', fontSize: 13 }}>{vendor.category}</div>
                    </div>
                    <div style={{ color: '#ef4444', fontWeight: 900, fontSize: 20 }}>{vendor.cost}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '20px 28px', background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)', borderRadius: 16, fontSize: 22, fontWeight: 900, color: '#ef4444', textAlign: 'center' }}>
                {slide.total}
              </div>
            </div>
          )}

          {(slide.type === 'problem' || slide.type === 'solution') && (
            <div>
              <h1 style={{ fontSize: 44, fontWeight: 900, margin: '0 0 32px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
                {slide.points?.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: slide.color + '10', border: '1px solid ' + slide.color + '25', borderLeft: '3px solid ' + slide.color, borderRadius: 12, padding: '12px 20px', fontSize: 16, color: '#e2e8f0', fontWeight: 600 }}>
                    {point}
                  </div>
                ))}
              </div>
              <div style={{ padding: '18px 24px', background: slide.color + '15', border: '2px solid ' + slide.color + '40', borderRadius: 14, fontSize: 16, fontWeight: 700, color: slide.color }}>
                {slide.total}
              </div>
            </div>
          )}

          {slide.type === 'demo' && (
            <div>
              <h1 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 12px' }}>{slide.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 32 }}>Not a mockup. Not a concept. A fully deployed enterprise platform — live today.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                {slide.demos?.map((demo, i) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: 28 }}>
                    <div style={{ fontSize: 36, marginBottom: 12 }}>{demo.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{demo.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.5 }}>{demo.desc}</div>
                  </div>
                ))}
              </div>
              <a href="/dashboard" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>
                🚀 Launch Live Demo →
              </a>
            </div>
          )}

          {slide.type === 'savings' && (
            <div>
              <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 48px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
                {slide.stats?.map((stat, i) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid ' + stat.color, borderRadius: 20, padding: 28, textAlign: 'center' }}>
                    <div style={{ fontSize: 44, fontWeight: 900, color: stat.color, marginBottom: 8 }}>{stat.value}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
                <div style={{ color: '#cbd5e1', fontSize: 18, lineHeight: 1.6, fontWeight: 600 }}>{slide.bottom}</div>
              </div>
            </div>
          )}

          {slide.type === 'custom' && (
            <div>
              <h1 style={{ fontSize: 44, fontWeight: 900, margin: '0 0 32px', lineHeight: 1.1 }}>{slide.title}</h1>
              <div style={{ display: 'grid', gap: 10 }}>
                {slide.points?.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderLeft: '3px solid #0ea5e9', borderRadius: 12, padding: '12px 20px', fontSize: 16, color: '#e2e8f0', fontWeight: 600 }}>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'offer' && (
            <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
              <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 32px', lineHeight: 1.1 }}>{slide.title}</h1>
              <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.8, marginBottom: 40 }}>{slide.body}</p>
              <div style={{ display: 'grid', gap: 12, marginBottom: 40, textAlign: 'left' }}>
                {slide.points?.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '14px 20px', fontSize: 17, color: '#e2e8f0', fontWeight: 700 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                    {point}
                  </div>
                ))}
              </div>
              <div style={{ padding: '24px 36px', background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.4)', borderRadius: 20 }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#22c55e' }}>{slide.question}</div>
              </div>
            </div>
          )}

          {slide.type === 'next' && (
            <div>
              <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 48px', textAlign: 'center' }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 40 }}>
                {slide.steps?.map((step, i) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid ' + slide.color, borderRadius: 18, padding: 24 }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: slide.color, marginBottom: 12 }}>{step.num}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{step.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '24px', background: 'rgba(37,99,235,0.12)', border: '2px solid rgba(59,130,246,0.3)', borderRadius: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#60a5fa' }}>💰 {slide.goal}</div>
              </div>
            </div>
          )}

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderTop: '1px solid rgba(148,163,184,0.1)', background: 'rgba(5,8,22,0.9)' }}>
        <button onClick={goPrev} disabled={current === 0} style={{ padding: '12px 28px', background: current === 0 ? 'rgba(148,163,184,0.05)' : 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, color: current === 0 ? '#334155' : '#fff', fontWeight: 700, cursor: current === 0 ? 'not-allowed' : 'pointer', fontSize: 15 }}>← Previous</button>
        <div style={{ color: '#64748b', fontSize: 13 }}>← → to navigate • 🔒 Confidential — International Paper Only</div>
        <button onClick={goNext} disabled={current === slides.length - 1} style={{ padding: '12px 28px', background: current === slides.length - 1 ? 'rgba(148,163,184,0.05)' : 'linear-gradient(135deg, ' + slide.color + ', ' + slide.color + 'cc)', border: 'none', borderRadius: 12, color: current === slides.length - 1 ? '#334155' : '#fff', fontWeight: 700, cursor: current === slides.length - 1 ? 'not-allowed' : 'pointer', fontSize: 15 }}>Next →</button>
      </div>
    </div>
  )
}