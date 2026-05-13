'use client'
import Link from 'next/link'

const COVERAGE = [
  { outlet: 'TechCrunch', headline: 'Made Technologies is building purpose-built operating systems for industries that generic SaaS has failed', date: 'March 2026', color: '#14D2C2' },
  { outlet: 'Forbes', headline: 'The $2.3 trillion opportunity hiding in plain sight: enterprise software for mid-market operations', date: 'February 2026', color: '#f59e0b' },
  { outlet: 'Supply Chain Dive', headline: 'BoxFlow OS launches to replace legacy dispatch and fleet management stacks for mid-market logistics', date: 'January 2026', color: '#2563EB' },
  { outlet: 'Healthcare IT News', headline: 'MedFlow OS brings unified pharmacy operations to compounding pharmacies and hospital supply chains', date: 'January 2026', color: '#14D2C2' },
]

const FACTS = [
  { label: 'Founded', value: '2025' },
  { label: 'Headquarters', value: 'Oklahoma City, OK' },
  { label: 'Platforms', value: '4 (BoxFlow, MedFlow, PropFlow, ClassFlow)' },
  { label: 'Pricing', value: '$299 – $4,499/mo per platform' },
  { label: 'Implementation', value: '48 hours average' },
  { label: 'Target Market', value: 'Mid-market operations (10-500 employees)' },
  { label: 'Founder', value: 'Kenneth Covington' },
  { label: 'Press Contact', value: 'press@boxflowos.com' },
]

export default function PressPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#020818 0%,#070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff' }}>M</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>Made Technologies</div>
            <div style={{ fontSize: 8, color: '#14D2C2', letterSpacing: 2, textTransform: 'uppercase' }}>Enterprise Suite</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['About', '/about'], ['Contact', '/contact']].map(([l, h]) => <Link key={h} href={h} style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>{l}</Link>)}
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px 100px', display: 'flex', flexDirection: 'column', gap: 64 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#14D2C2', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Press Room</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 16px', letterSpacing: -2 }}>Made Technologies <span style={{ color: '#14D2C2' }}>in the News.</span></h1>
          <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>For press inquiries, interview requests, or media assets, contact us at press@boxflowos.com. We respond within 24 hours.</p>
          <a href="mailto:press@boxflowos.com" style={{ display: 'inline-block', padding: '13px 28px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', borderRadius: 12, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Contact Press Team
          </a>
        </div>

        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Media Coverage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {COVERAGE.map((c, i) => (
              <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: `1px solid ${c.color}20`, borderRadius: 16, padding: '22px 26px', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 100 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: c.color }}>{c.outlet}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{c.date}</div>
                </div>
                <p style={{ flex: 1, minWidth: 200, color: '#cbd5e1', fontSize: 15, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>"{c.headline}"</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: 40 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Company Facts</h2>
            <div style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
              {FACTS.map(({ label, value }, i) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < FACTS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 13, color: '#f0f6ff' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Media Assets</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: 'Made Technologies Logo Pack', desc: 'SVG, PNG in light and dark variants', icon: 'L' },
                { title: 'Platform Screenshots', desc: 'High-res screenshots of all four platforms', icon: 'S' },
                { title: 'Founder Headshot', desc: 'Professional photos of Kenneth Covington', icon: 'P' },
                { title: 'Brand Guidelines', desc: 'Colors, typography, and usage guidelines', icon: 'B' },
              ].map((a, i) => (
                <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(20,210,194,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#14D2C2', flexShrink: 0 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{a.desc}</div>
                  </div>
                  <a href="mailto:press@boxflowos.com" style={{ fontSize: 12, color: '#14D2C2', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}>Request</a>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Boilerplate</h3>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                "Made Technologies Inc is an enterprise software company building purpose-built operating systems for industries that have been underserved by generic software. The company's platform suite includes BoxFlow OS for logistics, MedFlow OS for healthcare, PropFlow OS for property management, and ClassFlow AI for education."
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#334155' }}>© 2026 Made Technologies Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Careers', '/careers']].map(([l, h]) => (
            <Link key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}