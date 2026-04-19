'use client'
import { useState } from 'react'

export default function NDAPage() {
  const [signed, setSigned] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [agreed, setAgreed] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#020812', color: '#e2e8f0', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ height: 36 }} />
          <span style={{ color: '#475569', margin: '0 8px' }}>|</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#a855f7' }}>Mutual Non-Disclosure Agreement</span>
        </div>
        <a href="/ip-pitch" style={{ fontSize: 13, color: '#4f8ef7', textDecoration: 'none', fontWeight: 700 }}>← Back to Proposal</a>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 16 }}>Confidential Legal Document</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>Mutual Non-Disclosure Agreement</h1>
          <p style={{ color: '#475569', fontSize: 15 }}>Between M.A.D.E Technologies Inc. and International Paper Company</p>
        </div>

        {!signed ? (
          <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.15)', borderRadius: 16, padding: 32 }}>
            {[
              { title: '1. Purpose', body: 'The Parties desire to explore a potential business relationship involving the licensing of BoxFlow OS software platform. In connection with evaluating this relationship, each Party may disclose confidential and proprietary information.' },
              { title: '2. Confidential Information', body: 'Confidential Information includes software source code, algorithms, business plans, financial projections, customer lists, trade secrets, operational data, and any information related to BoxFlow OS platform capabilities and roadmap.' },
              { title: '3. Obligations', body: 'Each Party agrees to hold Confidential Information in strict confidence, not disclose to third parties without prior written consent, use solely for evaluating the proposed transaction, and limit access to employees with a need to know.' },
              { title: '4. Intellectual Property', body: 'Nothing in this Agreement grants either Party rights to the other\'s intellectual property. M.A.D.E Technologies Inc. retains full and exclusive ownership of all BoxFlow OS source code, platform architecture, algorithms, and related intellectual property.' },
              { title: '5. Term', body: 'This Agreement remains in effect for three (3) years from the Effective Date. Obligations with respect to trade secrets survive indefinitely.' },
              { title: '6. Governing Law', body: 'This Agreement is governed by the laws of the State of Oklahoma. Any disputes shall be resolved in state or federal courts in Oklahoma County, Oklahoma.' },
            ].map(s => (
              <div key={s.title} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid rgba(99,132,255,0.08)' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#4f8ef7', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8 }}>{s.body}</div>
              </div>
            ))}

            <div style={{ background: 'rgba(7,15,31,0.8)', border: '1px solid rgba(99,132,255,0.2)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Digital Signature — International Paper Representative</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                {[
                  { label: 'Full Name', val: name, set: setName, placeholder: 'Your full legal name' },
                  { label: 'Title', val: title, set: setTitle, placeholder: 'Your title at IP' },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(2,8,18,0.8)', color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Company</label>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="International Paper Company" style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(2,8,18,0.8)', color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
                <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>I have read and agree to the terms of this Mutual Non-Disclosure Agreement on behalf of International Paper Company. I certify that I am authorized to execute this agreement.</span>
              </label>
            </div>

            <button onClick={() => { if (name && title && company && agreed) setSigned(true) }}
              style={{ width: '100%', padding: 16, borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: name && title && company && agreed ? 'pointer' : 'not-allowed', background: name && title && company && agreed ? '#a855f7' : 'rgba(168,85,247,0.3)', border: 'none', color: '#fff' }}>
              Sign NDA Digitally →
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: 40, textAlign: 'center' as const }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', marginBottom: 12 }}>NDA Signed Successfully</h2>
            <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 24 }}>Thank you, {name}. This agreement is now in effect between M.A.D.E Technologies Inc. and International Paper Company.</p>
            <div style={{ background: 'rgba(7,15,31,0.8)', border: '1px solid rgba(99,132,255,0.15)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' as const }}>
              {[['Signed By', name], ['Title', title], ['Company', company], ['Date', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })], ['Governing Law', 'State of Oklahoma'], ['Term', '3 years']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>A copy of this agreement will be sent to Kenneth.Covington@madetechnologies.com. Please retain this page for your records.</p>
            <a href="/msa" style={{ display: 'inline-block', padding: '14px 32px', background: '#4f8ef7', borderRadius: 12, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>Continue to MSA →</a>
          </div>
        )}
      </div>
    </div>
  )
}