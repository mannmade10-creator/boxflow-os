'use client'
import React from 'react'

export default function PressPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>

        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Press Kit</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px' }}>BoxFlow OS Press Kit</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>Everything journalists, analysts, and partners need to cover BoxFlow OS.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>Company Facts</h2>
            {[
              { label: 'Company Name', value: 'BoxFlow OS' },
              { label: 'Founded', value: '2026' },
              { label: 'Headquarters', value: 'Oklahoma City, OK' },
              { label: 'Industry', value: 'Enterprise SaaS — Logistics & Manufacturing' },
              { label: 'Target Market', value: 'Paper & Packaging, Logistics, Fleet Operations' },
              { label: 'Platform Type', value: 'All-in-One Enterprise Operations Suite' },
              { label: 'Website', value: 'boxflow-os.vercel.app' },
              { label: 'Contact', value: 'press@boxflowos.com' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>{item.label}</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 14, textAlign: 'right', maxWidth: 220 }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: '#60a5fa' }}>Key Statistics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { value: '18+', label: 'Platform Modules', color: '#3b82f6' },
                  { value: '$14.5M', label: 'Avg Annual Savings', color: '#22c55e' },
                  { value: '96%', label: 'Cost Reduction', color: '#8b5cf6' },
                  { value: '14 Days', label: 'Free Trial', color: '#f59e0b' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 12px', color: '#60a5fa' }}>Brand Assets</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(2,6,23,0.5)', borderRadius: 12, padding: '12px 16px' }}>
                  <img src="/assets/logo.png" alt="Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Primary Logo</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>PNG format — Dark background</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Brand Colors</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { color: '#2563eb', name: 'Primary Blue' },
                      { color: '#8b5cf6', name: 'Purple' },
                      { color: '#22c55e', name: 'Success Green' },
                      { color: '#020617', name: 'Dark Navy' },
                    ].map(c => (
                      <div key={c.name} style={{ textAlign: 'center' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: c.color, marginBottom: 4 }} />
                        <div style={{ color: '#64748b', fontSize: 10 }}>{c.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>Boilerplate Description</h2>
          <div style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>SHORT (50 words)</div>
            <p style={{ color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>BoxFlow OS is an enterprise operations platform built for logistics and paper manufacturing companies. It replaces 10+ disconnected software tools with one unified system covering dispatch, fleet tracking, production management, HR, AI optimization, and client portals — saving companies up to $14.5M annually.</p>
          </div>
          <div style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 16, padding: 24 }}>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>LONG (100 words)</div>
            <p style={{ color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>BoxFlow OS is a next-generation enterprise operations suite designed specifically for paper manufacturing, corrugated packaging, and logistics companies. Built by an industry insider who experienced firsthand the inefficiency of disconnected software systems, BoxFlow OS consolidates dispatch, live fleet tracking, production floor management, HR and payroll, AI-powered optimization, executive analytics, and client portals into a single unified platform. Enterprise companies currently spending $10M-$20M annually on multiple disconnected vendors can replace their entire software stack with BoxFlow OS — reducing costs by up to 96% while gaining capabilities no individual vendor provides.</p>
          </div>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>Press Contact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Press Inquiries', value: 'press@boxflowos.com', icon: '📧' },
              { label: 'Partnership Inquiries', value: 'partners@boxflowos.com', icon: '🤝' },
              { label: 'Enterprise Sales', value: 'sales@boxflowos.com', icon: '💼' },
              { label: 'General Contact', value: 'hello@boxflowos.com', icon: '💬' },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>{item.label}</div>
                  <div style={{ color: '#60a5fa', fontWeight: 700 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', color: '#334155', fontSize: 13, borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 32 }}>
          <a href="/about" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>About Us</a>
          <a href="/careers" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Careers</a>
          <a href="/contact" style={{ color: '#60a5fa', textDecoration: 'none' }}>Contact</a>
        </div>
      </div>
    </div>
  )
}