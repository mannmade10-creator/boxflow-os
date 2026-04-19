'use client'
import { useState } from 'react'

export default function InvestorsPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', firm: '', amount: '', message: '' })

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020812', color: '#e2e8f0', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ height: 36 }} />
          <span style={{ color: '#475569', margin: '0 8px' }}>|</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>Investor Relations</span>
        </div>
        <a href="/pitch" style={{ fontSize: 13, color: '#4f8ef7', textDecoration: 'none', fontWeight: 700 }}>View Pitch Deck →</a>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 60 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 16 }}>Investor Relations</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>Invest in M.A.D.E Technologies</h1>
          <p style={{ color: '#475569', fontSize: 18, maxWidth: 700, margin: '0 auto', lineHeight: 1.8 }}>
            We are building the operating system for the paper and packaging industry. Two live SaaS products. Two mobile apps. A $52B market. Raising $250,000 to scale.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 60 }}>
          {[
            { label: 'Raising', value: '$250,000', color: '#4f8ef7', sub: 'Pre-seed round' },
            { label: 'Use of Funds', value: '40% Sales', color: '#22c55e', sub: '30% Eng · 20% Ops · 10% Legal' },
            { label: 'Target ARR', value: '$570K', color: '#a855f7', sub: '50 customers in 12 months' },
            { label: 'Market Size', value: '$52B', color: '#f59e0b', sub: 'Global TMS market by 2030' },
            { label: 'IP Plants (US)', value: '1,400+', color: '#ef4444', sub: 'Corrugated facilities nationwide' },
            { label: 'Live Products', value: '2', color: '#22c55e', sub: 'BoxFlow OS + PropFlow OS' },
          ].map(k => (
            <div key={k.label} style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 20, borderTop: `3px solid ${k.color}` }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: k.color, marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: '#334155' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 60 }}>
          <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: '#fff' }}>What We\'ve Built</h2>
            {[
              '✅ BoxFlow OS — live at boxflowos.com',
              '✅ PropFlow OS — live at propflowos.com',
              '✅ Corrugator Production System — replaces KIWIPLAN + Qualitek',
              '✅ Android Driver & Client mobile app — APK built',
              '✅ Android Tenant mobile app — APK built',
              '✅ Stripe live payments integrated',
              '✅ Mapbox GPS satellite tracking integrated',
              '✅ TransUnion SmartMove credit screening integrated',
              '✅ International Paper pilot proposal submitted',
            ].map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: '#94a3b8', padding: '7px 0', borderBottom: '1px solid rgba(99,132,255,0.06)', lineHeight: 1.5 }}>{item}</div>
            ))}
          </div>

          <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: '#fff' }}>Revenue Projections</h2>
            {[
              { scenario: 'OKC Pilot (IP)', monthly: '$4,499', annual: '$53,988' },
              { scenario: '10 IP Plants', monthly: '$44,990', annual: '$539,880' },
              { scenario: '50 Customers (mixed)', monthly: '$47,450', annual: '$569,400' },
              { scenario: '70 IP Plants (nationwide)', monthly: '$314,930', annual: '$3,779,160' },
              { scenario: 'PropFlow (10 properties)', monthly: '$3,990', annual: '$47,880' },
            ].map(r => (
              <div key={r.scenario} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(99,132,255,0.06)' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>{r.scenario}</span>
                <div style={{ textAlign: 'right' as const }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>{r.monthly}/mo</div>
                  <div style={{ fontSize: 11, color: '#334155' }}>{r.annual}/yr</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, alignItems: 'start' }}>
          <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: '#fff' }}>Why M.A.D.E Technologies?</h2>
            {[
              { icon: '🏭', title: 'Insider Knowledge', desc: 'Built by someone who worked inside International Paper and watched KIWIPLAN and Qualitek waste millions every year.' },
              { icon: '✅', title: 'Live Products Today', desc: 'Not a pitch deck with promises. Two fully deployed SaaS platforms, two mobile apps, and a pilot proposal already submitted to IP.' },
              { icon: '🔒', title: 'IP Protected', desc: 'All source code and platform IP fully owned by M.A.D.E Technologies Inc. No open source dependencies that compromise ownership.' },
              { icon: '🌍', title: 'Massive Addressable Market', desc: '1,400+ US corrugated plants, 180K+ logistics companies, and a fragmented software landscape desperate for modernization.' },
              { icon: '📈', title: 'Clear Path to Scale', desc: 'One IP pilot → 70 IP plants → other paper companies → full logistics market. Each step is a clear, executable milestone.' },
            ].map(r => (
              <div key={r.title} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#4f8ef7', marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {!submitted ? (
            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, color: '#fff' }}>Request Investor Package</h2>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Submit your information and we\'ll send you our full investor package including financials, cap table, and term sheet.</p>
              {[
                { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Your name' },
                { label: 'Email Address', field: 'email', type: 'email', placeholder: 'your@email.com' },
                { label: 'Firm / Company', field: 'firm', type: 'text', placeholder: 'Investment firm or company' },
                { label: 'Investment Range', field: 'amount', type: 'text', placeholder: 'e.g. $25,000 - $100,000' },
              ].map(f => (
                <div key={f.field} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(2,8,18,0.8)', color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }} />
                </div>
              ))}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Message (Optional)</label>
                <textarea value={form.message} onChange={e => update('message', e.target.value)} placeholder="Any questions or context..." style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(2,8,18,0.8)', color: '#e2e8f0', fontSize: 13, outline: 'none', height: 80, resize: 'none' as const, boxSizing: 'border-box' as const }} />
              </div>
              <button onClick={() => { if (form.name && form.email) setSubmitted(true) }}
                style={{ width: '100%', padding: 14, borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: form.name && form.email ? 'pointer' : 'not-allowed', background: form.name && form.email ? '#22c55e' : 'rgba(34,197,94,0.3)', border: 'none', color: '#fff' }}>
                Request Investor Package →
              </button>
            </div>
          ) : (
            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: 28, textAlign: 'center' as const }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#22c55e', marginBottom: 12 }}>Request Received!</h2>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>Thank you, {form.name}. Kenneth Covington will send you the full investor package within 24 hours at {form.email}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}