'use client'

import React from 'react'

export default function DashboardPage() {
  const stats = [
    { label: 'Total Loads', value: '28' },
    { label: 'Active Trucks', value: '15' },
    { label: 'In Production', value: '8' },
    { label: 'AI Alerts', value: '3' },
  ]

  const quickLinks = [
    { label: 'Open Command Center', href: '/command-center' },
    { label: 'Open Production', href: '/production' },
    { label: 'Open Orders', href: '/orders' },
    { label: 'Open Fleet Map', href: '/fleet-map' },
  ]

  return (
    <main style={mainStyle}>
      <section style={{ display: 'grid', gap: 22 }}>
        <div>
          <div style={pillStyle}>BoxFlow OS Dashboard</div>
          <h1 style={titleStyle}>Operations Dashboard</h1>
          <p style={subtitleStyle}>
            High-level overview of production, fleet, orders, driver activity, and AI monitoring.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
          {stats.map((item) => (
            <div key={item.label} style={statCardStyle}>
              <div style={statLabelStyle}>{item.label}</div>
              <div style={statValueStyle}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 20, alignItems: 'start' }}>
          <div style={panelStyle}>
            <div style={sectionLabelStyle}>Executive Preview</div>
            <div style={imageFrameStyle}>
              <img src="/assets/command-center-bg.jpg" alt="Dashboard Preview" style={imageStyle} />
            </div>
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <div style={panelStyle}>
              <div style={sectionLabelStyle}>Quick Access</div>
              <div style={{ display: 'grid', gap: 12 }}>
                {quickLinks.map((item) => (
                  <a key={item.href} href={item.href} style={quickLinkStyle}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div style={panelStyle}>
              <div style={sectionLabelStyle}>System Notes</div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={noteItemStyle}>• Orders, production, and dispatch are routed correctly.</div>
                <div style={noteItemStyle}>• Sidebar is controlled by the main layout only.</div>
                <div style={noteItemStyle}>• This dashboard is the main starting point for the app.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const mainStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 40px)',
  background: 'radial-gradient(circle at top left, rgba(29,78,216,0.18), transparent 22%), linear-gradient(180deg, #050816 0%, #0b1220 100%)',
  color: '#fff',
  borderRadius: 24,
  padding: 28,
}
const pillStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', borderRadius: 999, padding: '8px 12px',
  background: 'rgba(59,130,246,0.14)', border: '1px solid rgba(59,130,246,0.3)',
  color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
}
const titleStyle: React.CSSProperties = { margin: '14px 0 10px', fontSize: 40, fontWeight: 900, lineHeight: 1.05 }
const subtitleStyle: React.CSSProperties = { margin: 0, color: '#94a3b8', fontSize: 16, lineHeight: 1.6 }
const panelStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.86)', border: '1px solid rgba(148,163,184,0.16)',
  borderRadius: 24, padding: 18, boxShadow: '0 18px 48px rgba(0,0,0,0.25)',
}
const sectionLabelStyle: React.CSSProperties = {
  fontSize: 12, color: '#94a3b8', textTransform: 'uppercase',
  letterSpacing: 0.7, marginBottom: 14, fontWeight: 700,
}
const imageFrameStyle: React.CSSProperties = {
  borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(148,163,184,0.14)', background: '#0b1220',
}
const imageStyle: React.CSSProperties = { width: '100%', display: 'block', maxHeight: 520, objectFit: 'cover', objectPosition: 'center top' }
const statCardStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.86)', border: '1px solid rgba(148,163,184,0.16)',
  borderRadius: 22, padding: 18, boxShadow: '0 18px 48px rgba(0,0,0,0.25)',
}
const statLabelStyle: React.CSSProperties = { color: '#64748b', fontSize: 12, marginBottom: 8 }
const statValueStyle: React.CSSProperties = { fontSize: 28, fontWeight: 900 }
const quickLinkStyle: React.CSSProperties = {
  textDecoration: 'none', color: '#fff', background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16, padding: '14px 16px', fontWeight: 700, display: 'block',
}
const noteItemStyle: React.CSSProperties = {
  color: '#cbd5e1', lineHeight: 1.6, background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16, padding: 14,
}
