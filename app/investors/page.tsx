'use client'
import React, { useState } from 'react'

export default function InvestorsPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'financials', label: 'Financials' },
    { id: 'market', label: 'Market' },
    { id: 'ask', label: 'The Ask' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(37,99,235,0.15), transparent 60%), linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Investor Relations</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>Invest in BoxFlow OS</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 700, margin: '0 auto 32px', lineHeight: 1.7 }}>
            A live enterprise SaaS platform replacing $16M/year in disconnected software for paper manufacturers and logistics companies. Pre-revenue. Fortune 500 pilot in progress.
          </p>
          <div style={{ display: 'inline-flex', gap: 24, background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: '20px 40px' }}>
            {[
              { value: '$250K', label: 'Raising', color: '#22c55e' },
              { value: '12 mo', label: 'Runway', color: '#3b82f6' },
              { value: '$14.5M', label: 'Client Savings', color: '#8b5cf6' },
              { value: '1', label: 'Fortune 500 Pilot', color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 32, background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 14, padding: 4 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: activeTab === tab.id ? '#2563eb' : 'transparent', color: activeTab === tab.id ? '#fff' : '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>What We Built</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 16 }}>BoxFlow OS is a fully deployed enterprise operations platform that consolidates dispatch, fleet tracking, production management, HR, AI optimization, analytics, and client portals into one system.</p>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 20 }}>Built by an insider who works at a Fortune 500 paper manufacturer and experienced firsthand the $16M/year inefficiency of disconnected software systems.</p>
                <div style={{ display: 'grid', gap: 10 }}>
                  {[
                    '✅ Live, deployed platform — not a mockup',
                    '✅ 44 pages and modules built',
                    '✅ Real Supabase database + Mapbox GPS',
                    '✅ AI optimization engine built in',
                    '✅ Fortune 500 pilot conversation in progress',
                    '✅ Full legal package — NDA, MSA, Privacy Policy',
                  ].map(item => (
                    <div key={item} style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.5 }}>{item}</div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 28 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: '#60a5fa' }}>The Opportunity</h2>
                  <div style={{ display: 'grid', gap: 12 }}>
                    {[
                      { label: 'Global TMS Market by 2030', value: '$52B', color: '#3b82f6' },
                      { label: 'US Logistics Companies', value: '180K+', color: '#8b5cf6' },
                      { label: 'Avg Annual Software Waste', value: '$7,200/mo', color: '#f59e0b' },
                      { label: 'Target Fortune 500 Pilot', value: 'In Progress', color: '#22c55e' },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                        <span style={{ color: '#94a3b8', fontSize: 14 }}>{item.label}</span>
                        <span style={{ color: item.color, fontWeight: 800, fontSize: 14 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 28 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: '#60a5fa' }}>Competitive Advantage</h2>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {[
                      { label: 'Industry insider knowledge', icon: '🏭' },
                      { label: 'All-in-one vs point solutions', icon: '🔗' },
                      { label: '96% cheaper than competitors', icon: '💰' },
                      { label: 'AI optimization built in', icon: '🤖' },
                      { label: 'Fortune 500 pilot ready', icon: '🎯' },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#cbd5e1', fontSize: 14 }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>Business Model</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { name: 'SaaS Subscriptions', desc: 'Monthly and annual platform licenses per client', revenue: '$2,999 - $24,999/mo', color: '#3b82f6' },
                  { name: 'Enterprise Contracts', desc: 'Custom annual contracts for Fortune 500 companies', revenue: '$500K - $1M+/yr', color: '#8b5cf6' },
                  { name: 'Implementation Fees', desc: 'One-time setup and onboarding per client', revenue: '$50K - $150K', color: '#22c55e' },
                  { name: 'Per-Truck Add-ons', desc: 'Additional revenue per vehicle tracked', revenue: '$15/truck/mo', color: '#f59e0b' },
                  { name: 'White Label', desc: 'License platform to resellers and agencies', revenue: '$799 - $5,000/mo', color: '#0ea5e9' },
                  { name: 'Annual Support', desc: 'Ongoing support and maintenance contracts', revenue: '$50K - $100K/yr', color: '#a855f7' },
                ].map(item => (
                  <div key={item.name} style={{ background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(148,163,184,0.1)', borderLeft: '3px solid ' + item.color, borderRadius: 14, padding: 18 }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 15, marginBottom: 6 }}>{item.name}</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>{item.desc}</div>
                    <div style={{ color: item.color, fontWeight: 900, fontSize: 14 }}>{item.revenue}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 24px', color: '#60a5fa' }}>Revenue Projections</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                  { year: 'Year 1', clients: '1-3', arr: '$500K - $1.5M', color: '#3b82f6', note: 'Fortune 500 pilot + 2 SMB clients' },
                  { year: 'Year 2', clients: '5-10', arr: '$2M - $5M', color: '#8b5cf6', note: 'Expand to regional logistics companies' },
                  { year: 'Year 3', clients: '15-25', arr: '$8M - $15M', color: '#22c55e', note: 'Series A + dedicated sales team' },
                  { year: 'Year 5', clients: '50+', arr: '$30M - $50M', color: '#f59e0b', note: 'Market leader in paper/packaging SaaS' },
                ].map(item => (
                  <div key={item.year} style={{ background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(148,163,184,0.1)', borderTop: '3px solid ' + item.color, borderRadius: 18, padding: 20, textAlign: 'center' }}>
                    <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>{item.year}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: item.color, marginBottom: 6 }}>{item.arr}</div>
                    <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 8 }}>ARR</div>
                    <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.4 }}>{item.note}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16, padding: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>Unit Economics</h3>
                  {[
                    { label: 'Avg Enterprise Contract Value', value: '$750,000/yr' },
                    { label: 'Avg SMB Contract Value', value: '$36,000/yr' },
                    { label: 'Gross Margin (SaaS)', value: '85-92%' },
                    { label: 'Customer Acquisition Cost', value: '~$0 (pilot via insider)' },
                    { label: 'Customer Lifetime Value', value: '$2.5M+ (5yr enterprise)' },
                    { label: 'Payback Period', value: '< 3 months' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>{item.label}</span>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16, padding: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>Current Financials</h3>
                  {[
                    { label: 'Revenue', value: 'Pre-revenue', color: '#f59e0b' },
                    { label: 'Stage', value: 'Pilot in progress', color: '#3b82f6' },
                    { label: 'Monthly Burn', value: '< $500/mo', color: '#22c55e' },
                    { label: 'Infrastructure Cost', value: '~$200/mo', color: '#22c55e' },
                    { label: 'Months of Runway', value: '12+ (self-funded)', color: '#22c55e' },
                    { label: 'Equity Offered', value: 'Negotiable', color: '#8b5cf6' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>{item.label}</span>
                      <span style={{ color: item.color || '#fff', fontWeight: 700, fontSize: 13 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 24px', color: '#60a5fa' }}>Market Opportunity</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
                {[
                  { value: '$52B', label: 'Global TMS Market 2030', color: '#3b82f6' },
                  { value: '180K+', label: 'US Logistics Companies', color: '#8b5cf6' },
                  { value: '$16M', label: 'Avg Fortune 500 Software Waste', color: '#ef4444' },
                  { value: '2.3M', label: 'Commercial Trucks in US', color: '#22c55e' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(148,163,184,0.1)', borderTop: '3px solid ' + stat.color, borderRadius: 18, padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: stat.color, marginBottom: 8 }}>{stat.value}</div>
                    <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>Competitive Landscape</h3>
              <div style={{ background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(2,6,23,0.8)' }}>
                      <th style={{ padding: '12px 20px', textAlign: 'left', color: '#94a3b8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Platform</th>
                      <th style={{ padding: '12px 20px', textAlign: 'left', color: '#94a3b8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Price</th>
                      <th style={{ padding: '12px 20px', textAlign: 'left', color: '#94a3b8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>What You Get</th>
                      <th style={{ padding: '12px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>All-in-One</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'SAP', price: '$5M+/yr', features: 'ERP only', allInOne: false },
                      { name: 'Oracle', price: '$3M+/yr', features: 'BI only', allInOne: false },
                      { name: 'McLeod', price: '$2M+/yr', features: 'Dispatch only', allInOne: false },
                      { name: 'Samsara', price: '$1.5M+/yr', features: 'Fleet only', allInOne: false },
                      { name: 'BoxFlow OS', price: 'Custom', features: 'Everything combined', allInOne: true, highlight: true },
                    ].map(row => (
                      <tr key={row.name} style={{ borderTop: '1px solid rgba(148,163,184,0.08)', background: row.highlight ? 'rgba(37,99,235,0.08)' : 'transparent' }}>
                        <td style={{ padding: '14px 20px', color: row.highlight ? '#60a5fa' : '#cbd5e1', fontWeight: row.highlight ? 900 : 600 }}>{row.name}{row.highlight ? ' ⭐' : ''}</td>
                        <td style={{ padding: '14px 20px', color: row.highlight ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{row.price}</td>
                        <td style={{ padding: '14px 20px', color: row.highlight ? '#cbd5e1' : '#64748b', fontSize: 14 }}>{row.features}</td>
                        <td style={{ padding: '14px 20px', textAlign: 'center', fontSize: 18 }}>{row.allInOne ? '✅' : '❌'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ask' && (
          <div style={{ display: 'grid', gap: 24 }}>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#60a5fa' }}>We Are Raising $250,000</h2>
              <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>A pre-seed round to cover 12 months of runway while closing our Fortune 500 pilot and hiring our first enterprise sales representative.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                <div style={{ background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 20, padding: 28 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 20px' }}>Use of Funds</h3>
                  {[
                    { pct: '40%', amount: '$100,000', label: 'Sales & Marketing', desc: 'Enterprise sales rep + outreach to 50 target companies', color: '#3b82f6' },
                    { pct: '30%', amount: '$75,000', label: 'Engineering', desc: 'Additional AI features + mobile app development', color: '#8b5cf6' },
                    { pct: '20%', amount: '$50,000', label: 'Operations', desc: 'Legal, accounting, insurance, compliance', color: '#22c55e' },
                    { pct: '10%', amount: '$25,000', label: 'Infrastructure', desc: 'Scaling servers, security, and enterprise hosting', color: '#f59e0b' },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{item.label}</span>
                        <span style={{ color: item.color, fontWeight: 900 }}>{item.pct} — {item.amount}</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(148,163,184,0.1)', borderRadius: 999, overflow: 'hidden', marginBottom: 4 }}>
                        <div style={{ height: '100%', width: item.pct, background: item.color, borderRadius: 999 }} />
                      </div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'rgba(2,6,23,0.5)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 20, padding: 28 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>What Investors Get</h3>
                    {[
                      { label: 'Investment Type', value: 'SAFE Note or Equity' },
                      { label: 'Round Size', value: '$250,000' },
                      { label: 'Min Investment', value: '$25,000' },
                      { label: 'Valuation Cap', value: 'Negotiable' },
                      { label: 'Use of Funds', value: '12 months runway' },
                      { label: 'Expected Milestone', value: 'First enterprise client signed' },
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                        <span style={{ color: '#94a3b8', fontSize: 13 }}>{item.label}</span>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'rgba(34,197,94,0.08)', border: '2px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#22c55e', margin: '0 0 12px' }}>12 Month Milestones</h3>
                    {[
                      { num: '1', text: 'Close Fortune 500 pilot ($500K+ contract)', done: false },
                      { num: '2', text: 'Hire enterprise sales representative', done: false },
                      { num: '3', text: 'Sign 3-5 additional enterprise clients', done: false },
                      { num: '4', text: 'Reach $1M+ ARR', done: false },
                      { num: '5', text: 'Raise Series A at 10x valuation', done: false },
                    ].map(item => (
                      <div key={item.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{item.num}</div>
                        <span style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.5 }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 24, padding: '40px', textAlign: 'center' }}>
              <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 16px' }}>Ready to Invest?</h2>
              <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 28, maxWidth: 600, margin: '0 auto 28px' }}>
                We are in active conversation with a Fortune 500 company. The window to invest at pre-revenue valuations is closing.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="mailto:investors@boxflowos.com" style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 16, boxShadow: '0 0 30px rgba(37,99,235,0.3)' }}>Contact Investor Relations →</a>
                <a href="/pitch" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 16 }}>View Pitch Deck</a>
              </div>
              <p style={{ color: '#334155', fontSize: 13, marginTop: 20 }}>investors@boxflowos.com • Oklahoma City, Oklahoma</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}