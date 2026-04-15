'use client'
import React, { useState } from 'react'
const tiers = [
  { amount: '$250,000', equity: '14.3%', valuation: '$1.75M', preValuation: '$1.5M', badge: 'LEAD INVESTOR', badgeColor: '#f59e0b', perks: ['Board observer seat', 'Quarterly investor briefings', 'Priority co-investment rights in Series A', 'Full platform data access', 'Named partner status'], allocation: [{ label: 'Sales & Marketing', amount: '$100,000', pct: 40 }, { label: 'Infrastructure', amount: '$80,000', pct: 32 }, { label: 'Talent & Ops', amount: '$70,000', pct: 28 }] },
  { amount: '$150,000', equity: '9.1%', valuation: '$1.65M', preValuation: '$1.5M', badge: 'STRATEGIC PARTNER', badgeColor: '#3b82f6', perks: ['Quarterly investor briefings', 'Series A co-investment rights', 'Full platform access', 'Named partner status'], allocation: [{ label: 'Sales & Marketing', amount: '$70,000', pct: 47 }, { label: 'Infrastructure', amount: '$50,000', pct: 33 }, { label: 'Operations', amount: '$30,000', pct: 20 }] },
  { amount: '$50,000', equity: '3.2%', valuation: '$1.55M', preValuation: '$1.5M', badge: 'ANGEL PARTNER', badgeColor: '#22c55e', perks: ['Annual investor briefings', 'Full platform access', 'Named partner status'], allocation: [{ label: 'Marketing & Outreach', amount: '$30,000', pct: 60 }, { label: 'Infrastructure', amount: '$20,000', pct: 40 }] },
]
const metrics = [
  { label: 'Pre-Money Valuation', value: '$1.5M', sub: 'Live platform + IP' },
  { label: 'Target Market', value: '$47B', sub: 'Logistics software 2024' },
  { label: 'Savings Per Client', value: '$14.5M', sub: 'vs. legacy software stack' },
  { label: 'Target Leads', value: '50+', sub: 'Fortune 500 + regional carriers' },
]
const milestones = [
  { q: 'Q2 2026', label: 'Seed Round Close', detail: 'Close $250K seed. Hire 2 sales reps.' },
  { q: 'Q3 2026', label: 'First 5 Clients', detail: 'Convert top leads to paid contracts.' },
  { q: 'Q4 2026', label: '$500K ARR', detail: 'Reach $500K annual recurring revenue.' },
  { q: 'Q1 2027', label: 'Series A Prep', detail: 'Raise $2M at $8M valuation.' },
]
export default function InvestorProposalPage() {
  const [sel, setSel] = useState(0)
  const t = tiers[sel]
  return (
    <div style={{ minHeight: '100vh', background: '#020817', color: '#e2e8f0', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/logo.png" style={{ width: 32, height: 32 }} alt="logo" />
          <span style={{ fontSize: 16, fontWeight: 800, color: '#2563eb', letterSpacing: 3, textTransform: 'uppercase' }}>BOXFLOW OS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 2 }}>CONFIDENTIAL INVESTMENT PROPOSAL</span>
          <a href="/investors" style={{ fontSize: 12, color: '#b4c5ff', textDecoration: 'none', fontWeight: 700, padding: '6px 14px', background: 'rgba(180,197,255,0.06)', borderRadius: 3, border: '1px solid rgba(180,197,255,0.12)' }}>BACK</a>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ display: 'inline-block', padding: '6px 18px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 2, fontSize: 11, color: '#93c5fd', fontWeight: 700, letterSpacing: 4, marginBottom: 24 }}>SEED ROUND 2026</div>
          <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, color: '#fff' }}>Replace $14.5M in Software.<br />One Platform.</h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>BoxFlow OS replaces McLeod, Samsara, SAP, Oracle, and 6+ other platforms with a single operating system for logistics and manufacturing companies.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="https://boxflow-os.vercel.app" target="_blank" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 3, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>VIEW LIVE PLATFORM</a>
            <a href="/pitch" style={{ padding: '12px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 3, color: '#e2e8f0', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>FULL PITCH DECK</a>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 80 }}>
          {metrics.map(m => (
            <div key={m.label} style={{ background: '#0c1324', padding: '28px 24px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: 'monospace', marginBottom: 6 }}>{m.value}</div>
              <div style={{ fontSize: 12, color: '#b4c5ff', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{m.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Investment Tiers</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Click a tier to see full details</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
            {tiers.map((tier, i) => (
              <button key={i} onClick={() => setSel(i)} style={{ padding: '24px', background: sel === i ? 'rgba(37,99,235,0.12)' : '#0c1324', border: sel === i ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)', borderRadius: 4, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: tier.badgeColor, textTransform: 'uppercase', marginBottom: 10 }}>{tier.badge}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: 'monospace', marginBottom: 6 }}>{tier.amount}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{tier.equity} equity</div>
              </button>
            ))}
          </div>
          <div style={{ background: '#0c1324', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Investment Terms</div>
                {[{ label: 'Investment Amount', value: t.amount }, { label: 'Equity Stake', value: t.equity }, { label: 'Pre-Money Valuation', value: t.preValuation }, { label: 'Post-Money Valuation', value: t.valuation }, { label: 'Investment Type', value: 'Common Equity' }, { label: 'Round Type', value: 'Seed' }].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Use of Funds</div>
                {t.allocation.map(a => (
                  <div key={a.label} style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{a.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{a.amount}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999 }}>
                      <div style={{ height: '100%', width: a.pct + '%', background: 'linear-gradient(90deg, #2563eb, #60a5fa)', borderRadius: 999 }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{a.pct}% of investment</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Investor Benefits</div>
                {t.perks.map(perk => (
                  <div key={perk} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', marginTop: 5, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 40, textAlign: 'center' }}>Growth Roadmap</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ background: '#0c1324', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: 24, position: 'relative' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: '#2563eb', textTransform: 'uppercase', marginBottom: 10 }}>{m.q}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{m.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{m.detail}</div>
                <div style={{ position: 'absolute', top: 24, right: 24, width: 28, height: 28, borderRadius: '50%', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#93c5fd' }}>{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 40px', background: '#0c1324', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 4 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Ready to Invest?</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16, marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>Schedule a call with Kenneth Covington to discuss terms and next steps.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="mailto:Kenneth.Covington@boxflowos.com" style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: 3, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>EMAIL KENNETH</a>
            <a href="https://boxflow-os.vercel.app" target="_blank" style={{ padding: '14px 32px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 3, color: '#e2e8f0', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>VIEW LIVE PLATFORM</a>
          </div>
          <div style={{ marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Confidential. Not for distribution.</div>
        </div>
      </div>
    </div>
  )
}