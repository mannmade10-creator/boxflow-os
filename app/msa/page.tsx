'use client'
import { useState } from 'react'

export default function MSAPage() {
  const [signed, setSigned] = useState(false)
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [agreed2, setAgreed2] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#020812', color: '#e2e8f0', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ height: 36 }} />
          <span style={{ color: '#475569', margin: '0 8px' }}>|</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#4f8ef7' }}>Master Services Agreement</span>
        </div>
        <a href="/ip-pitch" style={{ fontSize: 13, color: '#4f8ef7', textDecoration: 'none', fontWeight: 700 }}>← Back to Proposal</a>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.3)', color: '#4f8ef7', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 16 }}>Legal Agreement</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>Master Services Agreement</h1>
          <p style={{ color: '#475569', fontSize: 15 }}>BoxFlow OS Software License — M.A.D.E Technologies Inc. & International Paper Company</p>
        </div>

        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '14px 20px', marginBottom: 28, fontSize: 13, color: '#f59e0b' }}>
          ⚠️ This agreement should be reviewed by legal counsel before execution. This is a binding legal contract.
        </div>

        <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.15)', borderRadius: 16, padding: 32, marginBottom: 24 }}>
          {[
            { title: '1. License Grant', body: 'Provider grants Client a non-exclusive, non-transferable license to access and use BoxFlow OS solely for internal business operations at Licensed Facilities. Client receives only the limited license rights expressly stated herein.' },
            { title: '2. Intellectual Property — Provider Ownership', body: 'M.A.D.E Technologies Inc. exclusively owns all right, title, and interest in BoxFlow OS, including all modifications, enhancements, and derivative works. Client receives no ownership rights. All custom features developed for Client remain the exclusive property of M.A.D.E Technologies Inc.' },
            { title: '3. Pilot Program Terms', body: 'Licensed Facility: International Paper — Oklahoma City, OK. Duration: 90 days. Monthly License Fee: $4,499. Setup & Training: Included. Support: 24/7 for production-critical issues. Go-Live: Within 30 days of signing.' },
            { title: '4. Fees and Payment', body: 'License fees are billed monthly in advance. Payment due within 30 days of invoice. Late payments accrue 1.5% interest per month. Provider may suspend access upon 10 days written notice of non-payment. All fees are non-refundable.' },
            { title: '5. Support and Uptime SLA', body: 'Support: Monday-Friday 6AM-10PM CT. Emergency support: 24/7 for production-critical outages. Response: Critical = 2 hours, High = 4 hours, Standard = 1 business day. Uptime SLA: 99.5% monthly availability.' },
            { title: '6. Data and Security', body: 'Provider maintains commercially reasonable security measures. Provider shall not sell or disclose Client operational data to third parties without written consent. Client data retained for 90 days post-termination then deleted or returned upon request.' },
            { title: '7. Limitation of Liability', body: 'IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES. PROVIDER\'S TOTAL LIABILITY SHALL NOT EXCEED FEES PAID IN THE THREE MONTHS PRECEDING THE CLAIM.' },
            { title: '8. Term and Termination', body: 'Agreement commences on the Effective Date for the pilot period. Either Party may terminate for material breach upon 30 days written notice. Client may terminate for convenience with 30 days notice after the initial pilot period.' },
            { title: '9. Governing Law', body: 'Governed by the laws of the State of Oklahoma. Disputes subject to 30-day good-faith negotiation, then binding arbitration in Oklahoma County, Oklahoma under AAA rules.' },
          ].map(s => (
            <div key={s.title} style={{ marginBottom: 22, paddingBottom: 22, borderBottom: '1px solid rgba(99,132,255,0.08)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#4f8ef7', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.8 }}>{s.body}</div>
            </div>
          ))}
        </div>

        {!signed ? (
          <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.15)', borderRadius: 16, padding: 28 }}>
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
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Company</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="International Paper Company" style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(2,8,18,0.8)', color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
              <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>I have read and agree to the terms of this Master Services Agreement on behalf of International Paper Company.</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
              <input type="checkbox" checked={agreed2} onChange={e => setAgreed2(e.target.checked)} style={{ marginTop: 3 }} />
              <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>I certify that I am authorized to execute this agreement and bind International Paper Company to its terms.</span>
            </label>
            <button onClick={() => { if (name && title && company && agreed && agreed2) setSigned(true) }}
              style={{ width: '100%', padding: 16, borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: name && title && company && agreed && agreed2 ? 'pointer' : 'not-allowed', background: name && title && company && agreed && agreed2 ? '#4f8ef7' : 'rgba(79,142,247,0.3)', border: 'none', color: '#fff' }}>
              Execute Master Services Agreement →
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: 40, textAlign: 'center' as const }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', marginBottom: 12 }}>MSA Executed Successfully</h2>
            <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 24 }}>Thank you, {name}. The Master Services Agreement is now in effect. The BoxFlow OS OKC pilot program will begin within 30 days.</p>
            <div style={{ background: 'rgba(7,15,31,0.8)', border: '1px solid rgba(99,132,255,0.15)', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' as const }}>
              {[['Executed By', name], ['Title', title], ['Company', company], ['Licensed Facility', 'International Paper — Oklahoma City, OK'], ['Pilot Duration', '90 days'], ['Monthly License Fee', '$4,499'], ['Date', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Kenneth Covington will contact you within 2 business days to schedule the kickoff meeting.</p>
            <a href="/production-v2" style={{ display: 'inline-block', padding: '14px 32px', background: '#22c55e', borderRadius: 12, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>View BoxFlow OS Production System →</a>
          </div>
        )}
      </div>
    </div>
  )
}