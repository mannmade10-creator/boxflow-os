'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const industries = [
  { icon: '📦', name: 'Corrugated & Paper', pain: 'KIWIPLAN terminals, Qualitek systems, disconnected order queues', color: '#3b82f6' },
  { icon: '🏗️', name: 'Steel & Metal', pain: 'Mill scheduling software, separate quality systems, manual shift logs', color: '#64748b' },
  { icon: '🍕', name: 'Food & Beverage', pain: 'Batch tracking in spreadsheets, HACCP paper logs, disconnected dispatch', color: '#f59e0b' },
  { icon: '🚛', name: 'Trucking & Freight', pain: 'Multiple load boards, separate TMS, no real-time client visibility', color: '#22c55e' },
  { icon: '🏪', name: 'Warehousing & 3PL', pain: 'Legacy WMS systems, paper pick lists, disconnected shipping software', color: '#a855f7' },
  { icon: '🏭', name: 'General Manufacturing', pain: 'Disconnected ERP, manual reporting, no mobile access for operators', color: '#ef4444' },
]

const modules = [
  { icon: '🏭', title: 'Production Floor', desc: 'Real-time machine status, order queue, shift performance — configured for your industry terminology' },
  { icon: '🚛', title: 'Dispatch & Fleet GPS', desc: 'AI-optimized routing, live truck tracking, driver mobile app, real-time ETA' },
  { icon: '📦', title: 'Order Management', desc: 'From production floor to delivery confirmation — every step tracked' },
  { icon: '👥', title: 'Client Portal', desc: 'Customers see their order status live — reduces inbound calls by 60%' },
  { icon: '🤖', title: 'AI Command Center', desc: 'One-click optimization — AI assigns drivers, flags delays, suggests routes' },
  { icon: '👤', title: 'HR & Payroll', desc: 'Workforce management, time tracking, payroll — connected to floor operations' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Live KPIs, shift reports, trend analysis — no more day-old spreadsheets' },
  { icon: '📱', title: 'Mobile Apps', desc: 'Native Android and iOS apps for drivers, operators, and clients' },
]

const tiers = [
  { name: 'Starter', price: '$599', period: '/month', units: 'Up to 1 location', color: '#3b82f6', features: ['All core modules', 'Up to 10 users', 'Mobile apps', 'Email support'] },
  { name: 'Professional', price: '$1,899', period: '/month', units: 'Up to 3 locations', color: '#8b5cf6', highlight: true, features: ['Everything in Starter', 'Up to 50 users', 'AI dispatch engine', 'Priority support', 'Custom KPI dashboard'] },
  { name: 'Enterprise', price: '$4,499', period: '/month', units: 'Unlimited locations', color: '#22c55e', features: ['Everything in Pro', 'Unlimited users', 'Dedicated success manager', 'Custom integrations', 'SLA guarantee', 'On-site training'] },
]

export default function EnterprisePage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', industry: '', size: '', message: '' })

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid rgba(99,132,255,0.2)',
    background: 'rgba(7,15,31,0.8)',
    color: '#e2e8f0',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#e2e8f0', fontFamily: 'Arial, sans-serif' }}>

      {/* Nav */}
      <nav style={{ padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,132,255,0.1)', background: 'rgba(2,6,18,0.9)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>BoxFlow OS</span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/pitch" style={{ fontSize: 14, color: '#475569', textDecoration: 'none', fontWeight: 600 }}>Pitch Deck</Link>
          <Link href="/demo" style={{ fontSize: 14, color: '#475569', textDecoration: 'none', fontWeight: 600 }}>Live Demo</Link>
          <Link href="/dashboard" style={{ padding: '8px 20px', background: '#3b82f6', borderRadius: 10, fontSize: 14, color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Enter Platform</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' as const }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 24 }}>
          Enterprise Operations System
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
          One Platform.<br />Every Industry.<br />Every Operation.
        </h1>
        <p style={{ fontSize: 18, color: '#475569', maxWidth: 700, margin: '0 auto 40px', lineHeight: 1.8 }}>
          BoxFlow OS replaces the patchwork of legacy software your team is using today — production terminals, dispatch tools, fleet trackers, HR systems — with one modern platform configured for your industry.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <a href="#contact" style={{ padding: '16px 36px', background: '#3b82f6', borderRadius: 14, fontSize: 16, fontWeight: 800, color: '#fff', textDecoration: 'none' }}>Request a Demo →</a>
          <Link href="/demo" style={{ padding: '16px 36px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 14, fontSize: 16, fontWeight: 800, color: '#ef4444', textDecoration: 'none' }}>▶ Watch 60-Second Demo</Link>
        </div>
      </div>

      {/* Industries */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Built for Your Industry</h2>
          <p style={{ fontSize: 16, color: '#475569' }}>Select your industry at setup — BoxFlow OS configures itself with the right tools, terminology, and KPIs.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {industries.map(ind => (
            <div key={ind.name} style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid ${ind.color}20`, borderLeft: `4px solid ${ind.color}`, borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{ind.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: ind.color }}>{ind.name}</span>
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>Today: </span>{ind.pain}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: '#22c55e', fontWeight: 700 }}>
                ✓ BoxFlow OS replaces all of it
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div style={{ background: 'rgba(15,23,42,0.4)', borderTop: '1px solid rgba(99,132,255,0.1)', borderBottom: '1px solid rgba(99,132,255,0.1)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Everything in One Platform</h2>
            <p style={{ fontSize: 16, color: '#475569' }}>Every module works together. No more switching between systems.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {modules.map(m => (
              <div key={m.title} style={{ background: 'rgba(7,15,31,0.8)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 16, padding: 22 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#60a5fa', marginBottom: 6 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Simple, Transparent Pricing</h2>
          <p style={{ fontSize: 16, color: '#475569' }}>No long-term contracts required. Cancel anytime. 30-day free trial available.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {tiers.map(tier => (
            <div key={tier.name} style={{ background: tier.highlight ? `rgba(139,92,246,0.1)` : 'rgba(15,23,42,0.8)', border: `2px solid ${tier.highlight ? tier.color : 'rgba(99,132,255,0.12)'}`, borderRadius: 20, padding: 28, position: 'relative' as const }}>
              {tier.highlight && (
                <div style={{ position: 'absolute' as const, top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', background: tier.color, borderRadius: 999, fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase' as const, letterSpacing: 1, whiteSpace: 'nowrap' as const }}>
                  Most Popular
                </div>
              )}
              <div style={{ fontSize: 16, fontWeight: 800, color: tier.color, marginBottom: 8 }}>{tier.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: '#fff' }}>{tier.price}</span>
                <span style={{ fontSize: 14, color: '#475569' }}>{tier.period}</span>
              </div>
              <div style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>{tier.units}</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 24 }}>
                {tier.features.map(f => (
                  <div key={f} style={{ fontSize: 14, color: '#94a3b8', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: tier.color, fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <a href="#contact" style={{ display: 'block', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, textAlign: 'center' as const, textDecoration: 'none', background: tier.highlight ? tier.color : 'rgba(99,132,255,0.1)', color: tier.highlight ? '#fff' : tier.color, border: tier.highlight ? 'none' : `1px solid ${tier.color}30` }}>
                Get Started →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div id="contact" style={{ background: 'rgba(15,23,42,0.4)', borderTop: '1px solid rgba(99,132,255,0.1)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Request a Demo</h2>
            <p style={{ fontSize: 16, color: '#475569' }}>Tell us about your operation and we'll set up a personalized demo within 24 hours.</p>
          </div>

          {submitted ? (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 40, textAlign: 'center' as const }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e', marginBottom: 8 }}>Request Received!</div>
              <div style={{ fontSize: 15, color: '#94a3b8' }}>Thank you, {form.name}. We'll be in touch within 24 hours to schedule your personalized demo.</div>
            </div>
          ) : (
            <div style={{ background: 'rgba(7,15,31,0.8)', border: '1px solid rgba(99,132,255,0.15)', borderRadius: 20, padding: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                {[
                  { label: 'Full Name', field: 'name', placeholder: 'Your name' },
                  { label: 'Company', field: 'company', placeholder: 'Company name' },
                  { label: 'Email Address', field: 'email', placeholder: 'your@email.com' },
                  { label: 'Phone Number', field: 'phone', placeholder: 'Optional' },
                ].map(f => (
                  <div key={f.field}>
                    <label style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)} placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Industry</label>
                  <select value={form.industry} onChange={e => update('industry', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select your industry</option>
                    <option value="corrugated">Corrugated & Paper Manufacturing</option>
                    <option value="steel">Steel & Metal Fabrication</option>
                    <option value="food">Food & Beverage Production</option>
                    <option value="trucking">Trucking & Freight</option>
                    <option value="warehousing">Warehousing & Distribution</option>
                    <option value="general">General Manufacturing</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Company Size</label>
                  <select value={form.size} onChange={e => update('size', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select size</option>
                    <option value="1-10">1–10 employees</option>
                    <option value="11-50">11–50 employees</option>
                    <option value="51-200">51–200 employees</option>
                    <option value="201-500">201–500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Tell us about your current setup (optional)</label>
                <textarea value={form.message} onChange={e => update('message', e.target.value)} placeholder="What software are you currently using? What's your biggest operational challenge?" style={{ ...inputStyle, height: 100, resize: 'none' as const }} />
              </div>
              <button
                onClick={() => { if (form.name && form.email && form.industry) setSubmitted(true) }}
                disabled={!form.name || !form.email || !form.industry}
                style={{ width: '100%', padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: form.name && form.email && form.industry ? 'pointer' : 'not-allowed', background: form.name && form.email && form.industry ? '#3b82f6' : 'rgba(59,130,246,0.3)', border: 'none', color: '#fff' }}>
                Request Demo →
              </button>
              <div style={{ marginTop: 14, textAlign: 'center' as const, fontSize: 13, color: '#334155' }}>
                No commitment required. We'll respond within 24 hours.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(99,132,255,0.1)', padding: '32px 24px', textAlign: 'center' as const }}>
        <div style={{ fontSize: 13, color: '#334155', marginBottom: 8 }}>BoxFlow OS — Enterprise Operations System</div>
        <div style={{ fontSize: 12, color: '#1e3a5f' }}>by M.A.D.E Technologies Inc. • Make Anything Do Everything • boxflowos.com</div>
      </div>
    </div>
  )
}
