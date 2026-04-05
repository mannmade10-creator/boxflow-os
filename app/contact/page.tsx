'use client'

import React, { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', trucks: '', message: '', plan: 'Professional' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!form.name || !form.email || !form.company) {
      alert('Please fill in name, email, and company.')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', fontFamily: 'Arial' }}>
        <div style={{ textAlign: 'center', maxWidth: 500, padding: 40 }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🎉</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', margin: '0 0 16px' }}>You're on the list!</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 32, lineHeight: 1.6 }}>
            Thanks {form.name}! We'll reach out to <strong style={{ color: '#60a5fa' }}>{form.email}</strong> within 24 hours to schedule your demo.
          </p>
          <div style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: 20, marginBottom: 28 }}>
            <div style={{ color: '#22c55e', fontWeight: 800, fontSize: 16, marginBottom: 8 }}>What happens next:</div>
            <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.8 }}>
              ✓ You'll receive a confirmation email<br/>
              ✓ Our team will contact you within 24hrs<br/>
              ✓ We'll schedule a live demo of BoxFlow OS<br/>
              ✓ 14-day free trial starts immediately
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard" style={{ padding: '14px 28px', background: '#2563eb', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800 }}>View Live Demo</a>
            <a href="/pricing" style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800 }}>See Pricing</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(37,99,235,0.15), transparent 60%), linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
            <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 40, height: 40 }} />
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>BoxFlow OS</span>
          </a>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Get Started</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>Start Your Free Trial</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
            14 days free. No credit card. Full access to every feature. Our team will set you up personally.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          <div>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 24px', color: '#fff' }}>Tell us about your operation</h2>

              <div style={{ display: 'grid', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Full Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Smith" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Work Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@company.com" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Company Name *</label>
                  <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Acme Logistics Co." style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Number of Trucks</label>
                  <select value={form.trucks} onChange={e => setForm({...form, trucks: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' }}>
                    <option value="">Select fleet size</option>
                    <option>1-5 trucks</option>
                    <option>6-15 trucks</option>
                    <option>16-50 trucks</option>
                    <option>50+ trucks</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Interested Plan</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {['Starter', 'Professional', 'Enterprise'].map(plan => (
                      <button key={plan} onClick={() => setForm({...form, plan})} style={{ padding: '10px', borderRadius: 10, border: form.plan === plan ? '2px solid #2563eb' : '1px solid rgba(148,163,184,0.2)', background: form.plan === plan ? 'rgba(37,99,235,0.2)' : 'rgba(2,6,23,0.5)', color: form.plan === plan ? '#60a5fa' : '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{plan}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Tell us about your needs</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="We currently manage 20 trucks and need better dispatch and client visibility..." rows={4} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(2,6,23,0.5)', color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Arial' }} />
                </div>
                <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, boxShadow: '0 0 30px rgba(37,99,235,0.3)' }}>
                  {loading ? 'Submitting...' : 'Start My Free Trial →'}
                </button>
                <p style={{ color: '#64748b', fontSize: 12, textAlign: 'center', margin: 0 }}>
                  ✓ 14-day free trial &nbsp; ✓ No credit card &nbsp; ✓ Cancel anytime
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 28 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 20px', color: '#fff' }}>What you get immediately</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                {[
                  { icon: '🚀', title: 'Full Platform Access', desc: 'Every module unlocked from day one' },
                  { icon: '🤖', title: 'AI Control Panel', desc: 'Optimize production and dispatch instantly' },
                  { icon: '🗺️', title: 'Live Fleet Map', desc: 'Real GPS tracking for all your trucks' },
                  { icon: '👥', title: 'Client Portal', desc: 'Give clients live order visibility' },
                  { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time KPIs and efficiency metrics' },
                  { icon: '🎯', title: 'Personal Onboarding', desc: 'Our team sets you up step by step' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: 15, marginBottom: 2 }}>{item.title}</div>
                      <div style={{ color: '#94a3b8', fontSize: 13 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 28 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>Trusted by logistics companies</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                {[
                  { quote: 'Replaced 4 tools with BoxFlow OS. Saving $3,200/month.', author: 'Mike R., Fleet Manager' },
                  { quote: 'Our clients love the real-time tracking portal. Game changer.', author: 'Sarah K., Operations Director' },
                  { quote: 'The AI dispatch alone paid for the entire subscription in week one.', author: 'James T., Logistics Owner' },
                ].map(t => (
                  <div key={t.author} style={{ background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 14, padding: 16 }}>
                    <div style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.5, marginBottom: 8 }}>"{t.quote}"</div>
                    <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700 }}>— {t.author}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📞</div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 16, marginBottom: 4 }}>Prefer to talk first?</div>
              <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>Schedule a 15-min call with our team</div>
              <a href="mailto:sales@boxflowos.com" style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>Email Sales Team</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}