'use client'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://irifwmikcugfxpfhyfrm.supabase.co',
  'sb_publishable_kpguCeakweBu2T5JIYxdjw_0WP6mMsj'
)

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', trucks: '', message: '', interest: 'BoxFlow OS Demo' })
  const [status, setStatus] = useState<null | 'sending' | 'sent' | 'error'>(null)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.email) return
    setStatus('sending')
    try {
      await supabase.from('contact_leads').insert([{
        name: form.name, email: form.email, company: form.company,
        phone: form.phone, trucks: form.trucks ? Number(form.trucks) : null,
        message: form.message, interest: form.interest,
      }])
      setStatus('sent')
    } catch { setStatus('error') }
  }

  const inputStyle = { width: '100%', background: 'rgba(7,15,36,0.8)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 10, padding: '13px 16px', fontSize: 15, color: '#f0f6ff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8 }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020818 0%, #070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff' }}>M</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>Made Technologies</div>
            <div style={{ fontSize: 9, color: '#2563EB', letterSpacing: 2, textTransform: 'uppercase' }}>Enterprise Suite</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/about" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>About</Link>
          <Link href="/pricing" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>Pricing</Link>
          <Link href="/demo" style={{ padding: '9px 22px', background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Book a Demo</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 60, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 100, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Get in Touch</div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px' }}>Let's Talk About <span style={{ color: '#2563EB' }}>Your Operation.</span></h1>
            <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.6, marginBottom: 48 }}>Book a 30-minute demo, ask a question, or tell us about your operation. We respond personally — not through a ticket queue.</p>

            {[
              { icon: '📞', title: 'Book a Demo', desc: '30 minutes. We show you your platform live inside a business like yours. No pitch. Just the product.' },
              { icon: '💰', title: 'Get a Custom ROI Estimate', desc: 'Tell us your current stack and we will show you exactly what you would save.' },
              { icon: '🤝', title: 'Talk to Sales', desc: 'Ready to move forward? We will build a custom plan and get you live in 48 hours.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 28 }}>
                <div style={{ width: 44, height: 44, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}

            <div style={{ padding: 24, background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 16 }}>
              <p style={{ color: '#64748b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Direct Contact</p>
              <p style={{ color: '#cbd5e1', fontSize: 15, marginBottom: 8 }}>📧 kenneth.covington@boxflowos.com</p>
              <p style={{ color: '#cbd5e1', fontSize: 15 }}>🌐 Made Technologies Inc</p>
            </div>
          </div>

          <div style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 24, padding: 36 }}>
            {status === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
                <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>We Got Your Message!</h2>
                <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6 }}>Our team will reach out within 24 hours.</p>
                <Link href="/roi" style={{ display: 'inline-block', marginTop: 24, padding: '12px 28px', background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Calculate Your Savings →</Link>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Book a Demo or Get in Touch</h2>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>We respond within 24 hours.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div><label style={labelStyle}>Your Name *</label><input style={inputStyle} placeholder="Kenneth Covington" value={form.name} onChange={e => update('name', e.target.value)} /></div>
                  <div><label style={labelStyle}>Work Email *</label><input style={inputStyle} type="email" placeholder="you@company.com" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div><label style={labelStyle}>Company Name</label><input style={inputStyle} placeholder="Your Company" value={form.company} onChange={e => update('company', e.target.value)} /></div>
                  <div><label style={labelStyle}>Phone Number</label><input style={inputStyle} placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div><label style={labelStyle}>Number of Trucks</label><input style={inputStyle} type="number" placeholder="20" value={form.trucks} onChange={e => update('trucks', e.target.value)} /></div>
                  <div>
                    <label style={labelStyle}>I'm Interested In</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.interest} onChange={e => update('interest', e.target.value)}>
                      <option>BoxFlow OS Demo</option>
                      <option>MedFlow OS Demo</option>
                      <option>Pricing Information</option>
                      <option>Enterprise Plan</option>
                      <option>General Question</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={labelStyle}>Message</label>
                  <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' as const }} placeholder="Tell us about your operation..." value={form.message} onChange={e => update('message', e.target.value)} />
                </div>
                <button onClick={handleSubmit} disabled={status === 'sending' || !form.name || !form.email}
                  style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', opacity: (!form.name || !form.email) ? 0.6 : 1 }}>
                  {status === 'sending' ? 'Sending...' : 'Send Message →'}
                </button>
                {status === 'error' && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center', marginTop: 10 }}>Something went wrong. Please try again.</p>}
                <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 12 }}>We respond within 24 hours. No spam, ever.</p>
              </>
            )}
          </div>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 48px', textAlign: 'center' }}>
        <p style={{ color: '#334155', fontSize: 12, margin: 0 }}>© 2026 Made Technologies Inc · <Link href="/privacy" style={{ color: '#334155', textDecoration: 'none' }}>Privacy</Link> · <Link href="/terms" style={{ color: '#334155', textDecoration: 'none' }}>Terms</Link></p>
      </footer>
    </div>
  )
}