'use client'
import Link from 'next/link'
import { useState } from 'react'

const STATS = [
  { value: '4', label: 'Enterprise Platforms' },
  { value: '$2.3T', label: 'Total Addressable Market' },
  { value: '60-80%', label: 'Cost Savings vs Legacy Stack' },
  { value: '48hrs', label: 'Average Time to Go Live' },
]

const MARKETS = [
  { name: 'Logistics & Distribution', tam: '$847B', color: '#2563EB', desc: 'BoxFlow OS targets mid-market logistics, fleet, and manufacturing operations currently running on fragmented legacy tools.' },
  { name: 'Healthcare Supply Chain', tam: '$612B', color: '#14D2C2', desc: 'MedFlow OS targets pharmacy operations, hospital supply chains, and cold chain logistics under-served by generic ERP systems.' },
  { name: 'Property Management', tam: '$519B', color: '#8b5cf6', desc: 'PropFlow OS targets property management companies, REITs, and commercial operators lacking unified operational software.' },
  { name: 'Education Operations', tam: '$340B', color: '#f59e0b', desc: 'ClassFlow AI targets K-12, higher education, and professional training institutions needing AI-powered learning infrastructure.' },
]

export default function InvestorsPage() {
  const [form, setForm] = useState({ name: '', email: '', firm: '', message: '' })
  const [sent, setSent] = useState(false)

  function update(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

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
          <div style={{ fontSize: 11, color: '#14D2C2', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Investor Relations</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 16px', letterSpacing: -2 }}>Building the Operating System <span style={{ color: '#14D2C2' }}>for Every Industry.</span></h1>
          <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>Made Technologies is building purpose-built enterprise software for industries that have never had great operational software. We are targeting a combined $2.3T addressable market across four verticals.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.12)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#14D2C2', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Market Opportunity</h2>
          <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 28, lineHeight: 1.7 }}>Each of our four platforms targets a distinct vertical where legacy software is fragmented, expensive, and built for the wrong buyer. We enter each market as the first purpose-built solution.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MARKETS.map((m, i) => (
              <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: `1px solid ${m.color}20`, borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: m.color }}>{m.tam}</div>
                  <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 1 }}>TAM</div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: m.color, marginBottom: 6 }}>{m.name}</h3>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Our Model</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
            {[
              { title: 'SaaS Subscription', desc: 'Monthly and annual subscriptions from $299/mo to $4,499/mo depending on platform and plan. Predictable, recurring revenue with strong net retention.' },
              { title: 'Fast Time to Value', desc: '48-hour implementation vs 6-18 months for enterprise competitors. Lower CAC, faster revenue recognition, and higher customer satisfaction.' },
              { title: 'Multi-Platform Expansion', desc: 'Customers who start on one platform can expand to others. Cross-sell opportunity across all four verticals with a single account relationship.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#14D2C2', marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: 40, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>Connect With Us</h2>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>We are selectively speaking with investors who understand enterprise SaaS and the mid-market opportunity. If that is you, we would like to talk.</p>
            {[['Pitch Deck', 'Available upon request after NDA'],['Financials', 'Available to qualified investors'],['References', 'Customer references available'],].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 14, color: '#f0f6ff', fontWeight: 600 }}>{l}</span>
                <span style={{ fontSize: 13, color: '#64748b' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 20, padding: 32 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>+</div>
                <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Message Received</h3>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>We will follow up within 48 hours.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>Investor Inquiry</h3>
                {[['Your Name', 'name', 'text', 'Kenneth Covington'], ['Email', 'email', 'email', 'you@firm.com'], ['Firm / Fund', 'firm', 'text', 'Acme Ventures'], ['Message', 'message', 'textarea', 'Tell us about your investment focus...']].map(([label, field, type, ph]) => (
                  <div key={field} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: 1.5, marginBottom: 7, textTransform: 'uppercase' as const }}>{label}</label>
                    {type === 'textarea' ? (
                      <textarea value={(form as any)[field]} onChange={e => update(field, e.target.value)} placeholder={ph} rows={3}
                        style={{ width: '100%', background: 'rgba(7,15,36,0.8)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#f0f6ff', outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const, fontFamily: 'system-ui' }} />
                    ) : (
                      <input type={type} value={(form as any)[field]} onChange={e => update(field, e.target.value)} placeholder={ph}
                        style={{ width: '100%', background: 'rgba(7,15,36,0.8)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#f0f6ff', outline: 'none', boxSizing: 'border-box' as const }} />
                    )}
                  </div>
                ))}
                <button onClick={() => { if (form.name && form.email) setSent(true) }}
                  style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', border: 'none', borderRadius: 11, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                  Send Inquiry
                </button>
              </>
            )}
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