'use client'
import React, { useState, useEffect } from 'react'

const slides = [
  {
    id: 1,
    type: 'cover',
    label: 'Confidential',
    title: 'International Paper',
    subtitle: 'A $14,500,000 Annual Savings Opportunity',
    note: 'Confidential — Prepared Exclusively for International Paper Executive Leadership',
    color: '#3b82f6',
  },
  {
    id: 2,
    type: 'facts',
    label: 'Company Profile',
    title: 'International Paper By The Numbers',
    stats: [
      { value: '$18.6B', label: 'Annual Revenue', color: '#3b82f6' },
      { value: '$500M+', label: 'Annual IT & Software Spend', color: '#8b5cf6' },
      { value: '65,000+', label: 'Employees Worldwide', color: '#0ea5e9' },
      { value: '350+', label: 'Facilities Globally', color: '#22c55e' },
    ],
    body: "International Paper is the world's largest paper and packaging company. Yet despite its scale and sophistication, IP is paying premium prices to multiple disconnected software vendors — none of which were built for paper and box manufacturing.",
    color: '#3b82f6',
  },
  {
    id: 3,
    type: 'spend',
    label: 'Current Software Spend',
    title: 'What International Paper Pays Today',
    vendors: [
      { name: 'SAP', category: 'ERP & Enterprise Operations', cost: '$5,000,000+', annual: true },
      { name: 'Oracle', category: 'Business Intelligence & Analytics', cost: '$3,000,000+', annual: true },
      { name: 'McLeod Software', category: 'Dispatch & Transportation Management', cost: '$2,000,000+', annual: true },
      { name: 'TMW Systems', category: 'Transportation Management System', cost: '$2,000,000+', annual: true },
      { name: 'Samsara', category: 'Fleet Tracking & GPS', cost: '$1,500,000+', annual: true },
      { name: 'Fishbowl', category: 'Inventory & Production Management', cost: '$1,000,000+', annual: true },
      { name: '10+ Additional Platforms', category: 'HR, Analytics, Client Tools, Reporting', cost: '$1,500,000+', annual: true },
    ],
    total: '$16,000,000+ Per Year',
    subtitle: 'Estimated Annual Software & Licensing Costs',
    color: '#ef4444',
  },
  {
    id: 4,
    type: 'hidden',
    label: 'The Hidden Costs',
    title: 'But The Invoice Is Only Half The Story',
    points: [
      { icon: '⏱', text: 'Employees spend 2-3 hours daily switching between 10+ platforms' },
      { icon: '📊', text: 'No single source of truth — leadership flies blind on real-time operations' },
      { icon: '🔄', text: 'Manual data re-entry between systems creates errors and delays' },
      { icon: '🚨', text: 'Production delays caused by disconnected dispatch and floor data' },
      { icon: '💸', text: 'Vendor lock-in means renewal fees increase every year' },
      { icon: '🤖', text: 'Zero AI optimization — every decision is still made manually' },
      { icon: '👥', text: 'HR and operations on completely separate systems with no integration' },
      { icon: '📍', text: 'No unified visibility across all 350+ facilities' },
    ],
    bottom: 'Conservative estimate: $3-5M in additional annual losses from inefficiency, delays, and manual processes.',
    color: '#f59e0b',
  },
  {
    id: 5,
    type: 'comparison',
    label: 'Side by Side',
    title: 'Current Stack vs BoxFlow OS',
    rows: [
      { feature: 'Dispatch & TMS', current: 'McLeod + TMW ($4M/yr)', boxflow: '✅ Built In', color: '#22c55e' },
      { feature: 'Fleet GPS Tracking', current: 'Samsara ($1.5M/yr)', boxflow: '✅ Built In', color: '#22c55e' },
      { feature: 'ERP & Operations', current: 'SAP ($5M/yr)', boxflow: '✅ Built In', color: '#22c55e' },
      { feature: 'Business Intelligence', current: 'Oracle ($3M/yr)', boxflow: '✅ Built In', color: '#22c55e' },
      { feature: 'Production Tracking', current: 'Fishbowl ($1M/yr)', boxflow: '✅ Built In', color: '#22c55e' },
      { feature: 'HR & Payroll', current: 'Standalone systems', boxflow: '✅ Built In', color: '#22c55e' },
      { feature: 'AI Optimization', current: '❌ Not available', boxflow: '✅ Built In', color: '#22c55e' },
      { feature: 'Client Portal', current: '❌ Not available', boxflow: '✅ Built In', color: '#22c55e' },
      { feature: 'Real-time Alerts', current: '❌ Not available', boxflow: '✅ Built In', color: '#22c55e' },
    ],
    color: '#22c55e',
  },
  {
    id: 6,
    type: 'demo',
    label: 'Live System',
    title: 'This Is Not A Concept. It Is Live Right Now.',
    demos: [
      { icon: '🏭', title: 'Production Floor Tracker', desc: 'Real-time machine status, output per hour, downtime alerts — built specifically for box and paper manufacturing operations' },
      { icon: '🚛', title: 'Live Fleet Dispatch', desc: 'GPS tracking, AI route optimization, driver management — replaces Samsara and McLeod in one screen' },
      { icon: '🤖', title: 'AI Control Panel', desc: 'One-click production optimization, driver reassignment, delay reduction — the AI layer IP does not currently have' },
      { icon: '📊', title: 'Executive Dashboard', desc: 'Single source of truth for leadership — orders, fleet, production, HR, all live in one unified view' },
    ],
    color: '#8b5cf6',
  },
  {
    id: 7,
    type: 'roi',
    label: 'The Math',
    title: 'The Financial Case Is Undeniable',
    current: [
      { label: 'SAP Annual License', value: '$5,000,000' },
      { label: 'Oracle Annual License', value: '$3,000,000' },
      { label: 'McLeod + TMW', value: '$4,000,000' },
      { label: 'Samsara Fleet Tracking', value: '$1,500,000' },
      { label: 'Fishbowl + Others', value: '$2,500,000' },
    ],
    currentTotal: '$16,000,000/year',
    savings: '$14,500,000+',
    savingsPct: '90%+',
    color: '#22c55e',
  },
  {
    id: 8,
    type: 'insider',
    label: 'The Insider',
    title: 'I Did Not Build This From The Outside',
    body: 'I work at International Paper. I have seen these inefficiencies firsthand — every day. I know which systems teams hate. I know where data gets lost between platforms. I know the frustration of switching between 6 different tools to get one answer.',
    points: [
      'I built BoxFlow OS specifically around the problems I see at IP daily',
      'I understand IP operations, workflows, and pain points from the inside',
      'I am not a vendor trying to sell you something you do not need',
      'I am an IP employee who built the solution IP actually needs',
    ],
    closing: 'No outside vendor could understand your operations the way I do. That insider knowledge is built into every feature of this platform.',
    color: '#f59e0b',
  },
  {
    id: 9,
    type: 'offer',
    label: 'The Ask',
    title: 'I Am Not Naming A Price',
    body: 'BoxFlow OS can replace every major software platform International Paper currently uses. The savings speak for themselves at $14,500,000+ per year.',
    question: 'What I am asking is simple:',
    points: [
      '🤝 Sign a mutual NDA to protect both parties',
      '👁 Give me 30 minutes for a live demo',
      '🧪 Run a pilot at one facility to prove the ROI',
      '💰 Then YOU tell me what this is worth to International Paper',
    ],
    closing: 'I am not here to sell you software. I am here because I know this company can operate better — and I built the tool to make it happen.',
    color: '#22c55e',
  },
  {
    id: 10,
    type: 'closing',
    label: 'One Question',
    title: 'One Question For Leadership',
    question: 'If BoxFlow OS saves International Paper $14,500,000 per year — what is that worth to this company?',
    subtext: 'Every year this conversation does not happen is another $14,500,000 spent unnecessarily.',
    contact: 'Ready to talk: schedule a demo at boxflow-os.vercel.app/contact',
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(148,163,184,0.1)', background: 'rgba(5,8,22,0.95)' }}>
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

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px, 4vw, 60px)', opacity: animating ? 0 : 1, transition: 'opacity 0.2s ease' }}>
        <div style={{ maxWidth: 1000, width: '100%' }}>
          <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 999, background: slide.color + '20', border: '1px solid ' + slide.color + '40', color: slide.color, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>
            {String(current + 1).padStart(2, '0')} — {slide.label}
          </div>

          {slide.type === 'cover' && (
            <div style={{ textAlign: 'center' }}>
              <img src="/assets/logo.png" style={{ width: 100, marginBottom: 24, filter: 'drop-shadow(0 0 40px rgba(37,99,235,0.6))' }} alt="logo" />
              <h1 style={{ fontSize: 'clamp(28px, 6vw, 80px)', fontWeight: 900, margin: '0 0 8px', background: 'linear-gradient(135deg, #fff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{slide.title}</h1>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#22c55e', margin: '16px 0 24px', lineHeight: 1.2 }}>{slide.subtitle}</div>
              <div style={{ padding: '14px 28px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 14, display: 'inline-block' }}>
                <span style={{ color: '#f59e0b', fontWeight: 800 }}>🔒 {slide.note}</span>
              </div>
            </div>
          )}

          {slide.type === 'facts' && (
            <div>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 44px)', fontWeight: 900, margin: '0 0 32px' }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
                {slide.stats?.map((stat, i) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid ' + stat.color, borderRadius: 18, padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: 40, fontWeight: 900, color: stat.color, marginBottom: 8 }}>{stat.value}</div>
                    <div style={{ color: '#94a3b8', fontSize: 14 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 18, padding: 24 }}>
                <p style={{ color: '#cbd5e1', fontSize: 17, lineHeight: 1.7, margin: 0 }}>{slide.body}</p>
              </div>
            </div>
          )}

          {slide.type === 'spend' && (
            <div>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 44px)', fontWeight: 900, margin: '0 0 8px' }}>{slide.title}</h1>
              <p style={{ color: '#64748b', marginBottom: 24, fontSize: 15 }}>{slide.subtitle}</p>
              <div style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
                {slide.vendors?.map((vendor, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(127,29,29,0.15)', border: '1px solid rgba(239,68,68,0.2)', borderLeft: '3px solid #ef4444', borderRadius: 12, padding: '12px 20px' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>{vendor.name}</div>
                      <div style={{ color: '#64748b', fontSize: 13 }}>{vendor.category}</div>
                    </div>
                    <div style={{ color: '#ef4444', fontWeight: 900, fontSize: 22 }}>{vendor.cost}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '18px 24px', background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.5)', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>Total Annual Software Spend</span>
                <span style={{ color: '#ef4444', fontWeight: 900, fontSize: 28 }}>{slide.total}</span>
              </div>
            </div>
          )}

          {slide.type === 'hidden' && (
            <div>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 44px)', fontWeight: 900, margin: '0 0 32px' }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 24 }}>
                {slide.points?.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '14px 16px' }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{point.icon}</span>
                    <span style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.5, fontWeight: 600 }}>{point.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '18px 24px', background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.3)', borderRadius: 14, color: '#fde68a', fontWeight: 700, fontSize: 16 }}>
                ⚠️ {slide.bottom}
              </div>
            </div>
          )}

          {slide.type === 'comparison' && (
            <div>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 44px)', fontWeight: 900, margin: '0 0 24px' }}>{slide.title}</h1>
              <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(2,6,23,0.5)', padding: '12px 20px', gap: 20 }}>
                  <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Feature</div>
                  <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Current (Costs Millions)</div>
                  <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>BoxFlow OS</div>
                </div>
                {slide.rows?.map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '12px 20px', gap: 20, borderTop: '1px solid rgba(148,163,184,0.08)' }}>
                    <div style={{ color: '#cbd5e1', fontWeight: 700, fontSize: 14 }}>{row.feature}</div>
                    <div style={{ color: '#ef4444', fontSize: 13 }}>{row.current}</div>
                    <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 14 }}>{row.boxflow}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {slide.type === 'demo' && (
            <div>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 48px)', fontWeight: 900, margin: '0 0 12px' }}>{slide.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: 17, marginBottom: 32 }}>Fully deployed. Real data. Real AI. Available for demo today.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                {slide.demos?.map((demo, i) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 18, padding: 24 }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>{demo.icon}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{demo.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>{demo.desc}</div>
                  </div>
                ))}
              </div>
              <a href="/dashboard" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>🚀 Launch Live Demo →</a>
            </div>
          )}

          {slide.type === 'roi' && (
            <div>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 48px)', fontWeight: 900, margin: '0 0 32px' }}>{slide.title}</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: 'rgba(127,29,29,0.15)', border: '2px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: 24 }}>
                  <div style={{ color: '#ef4444', fontWeight: 800, fontSize: 14, textTransform: 'uppercase', marginBottom: 16 }}>Current Annual Spend</div>
                  {slide.current?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
                      <span style={{ color: '#cbd5e1', fontSize: 14 }}>{item.label}</span>
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>{item.value}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px solid rgba(239,68,68,0.3)' }}>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Total</span>
                    <span style={{ color: '#ef4444', fontWeight: 900, fontSize: 22 }}>{slide.currentTotal}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.4)', borderRadius: 20, padding: 28, textAlign: 'center', flex: 1 }}>
                    <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>Annual Savings with BoxFlow OS</div>
                    <div style={{ fontSize: 'clamp(22px, 4vw, 56px)', fontWeight: 900, color: '#22c55e', lineHeight: 1 }}>{slide.savings}</div>
                    <div style={{ color: '#86efac', fontSize: 16, fontWeight: 700, marginTop: 8 }}>Per Year</div>
                  </div>
                  <div style={{ background: 'rgba(37,99,235,0.12)', border: '2px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
                    <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>Cost Reduction</div>
                    <div style={{ fontSize: 'clamp(18px, 4vw, 48px)', fontWeight: 900, color: '#3b82f6' }}>{slide.savingsPct}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {slide.type === 'insider' && (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 48px)', fontWeight: 900, margin: '0 0 24px' }}>{slide.title}</h1>
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: 28, marginBottom: 24 }}>
                <p style={{ color: '#fde68a', fontSize: 18, lineHeight: 1.8, margin: 0, fontWeight: 600 }}>{slide.body}</p>
              </div>
              <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
                {slide.points?.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.12)', borderLeft: '3px solid #f59e0b', borderRadius: 12, padding: '12px 18px', color: '#e2e8f0', fontSize: 15, fontWeight: 600 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
                    {point}
                  </div>
                ))}
              </div>
              <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.7, fontStyle: 'italic' }}>{slide.closing}</p>
            </div>
          )}

          {slide.type === 'offer' && (
            <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
              <h1 style={{ fontSize: 'clamp(20px, 4vw, 52px)', fontWeight: 900, margin: '0 0 16px' }}>{slide.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>{slide.body}</p>
              <div style={{ fontSize: 18, color: '#60a5fa', fontWeight: 700, marginBottom: 20 }}>{slide.question}</div>
              <div style={{ display: 'grid', gap: 12, marginBottom: 32, textAlign: 'left' }}>
                {slide.points?.map((point, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '16px 20px', fontSize: 17, color: '#e2e8f0', fontWeight: 700 }}>
                    {point}
                  </div>
                ))}
              </div>
              <div style={{ padding: '20px 28px', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', borderRadius: 16, color: '#86efac', fontSize: 16, lineHeight: 1.6 }}>
                {slide.closing}
              </div>
            </div>
          )}

          {slide.type === 'closing' && (
            <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
              <h1 style={{ fontSize: 'clamp(18px, 4vw, 48px)', fontWeight: 900, margin: '0 0 48px' }}>{slide.title}</h1>
              <div style={{ padding: '40px', background: 'rgba(37,99,235,0.1)', border: '2px solid rgba(59,130,246,0.3)', borderRadius: 24, marginBottom: 32 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.4, marginBottom: 24 }}>{slide.question}</div>
                <div style={{ fontSize: 16, color: '#ef4444', fontWeight: 700 }}>{slide.subtext}</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 16, color: '#60a5fa', fontSize: 16, fontWeight: 700 }}>
                📧 {slide.contact}
              </div>
            </div>
          )}

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 32px', borderTop: '1px solid rgba(148,163,184,0.1)', background: 'rgba(5,8,22,0.95)' }}>
        <button onClick={goPrev} disabled={current === 0} style={{ padding: '12px 28px', background: current === 0 ? 'rgba(148,163,184,0.05)' : 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, color: current === 0 ? '#334155' : '#fff', fontWeight: 700, cursor: current === 0 ? 'not-allowed' : 'pointer', fontSize: 15 }}>← Previous</button>
        <div style={{ color: '#64748b', fontSize: 13 }}>← → to navigate • 🔒 Confidential — International Paper Only</div>
        <button onClick={goNext} disabled={current === slides.length - 1} style={{ padding: '12px 28px', background: current === slides.length - 1 ? 'rgba(148,163,184,0.05)' : 'linear-gradient(135deg, ' + slide.color + ', ' + slide.color + 'cc)', border: 'none', borderRadius: 12, color: current === slides.length - 1 ? '#334155' : '#fff', fontWeight: 700, cursor: current === slides.length - 1 ? 'not-allowed' : 'pointer', fontSize: 15 }}>Next →</button>
      </div>
    </div>
  )
}