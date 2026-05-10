'use client'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://irifwmikcugfxpfhyfrm.supabase.co',
  'sb_publishable_kpguCeakweBu2T5JIYxdjw_0WP6mMsj'
)

const DEMOS = [
  { id: 'boxflow', name: 'BoxFlow OS', color: '#2563EB', icon: '📦', desc: 'See fleet, dispatch, orders, production, and HR unified in one platform. Built for logistics, manufacturing, and distribution.' },
  { id: 'medflow', name: 'MedFlow OS', color: '#14D2C2', icon: '⚕️', desc: 'See live temperature monitoring, cold chain tracking, drug inventory, compliance, and compounding — all in one healthcare platform.' },
]

export default function DemoPage() {
  const [selected, setSelected] = useState('boxflow')
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', message: '' })
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
        phone: form.phone, message: form.message,
        interest: `${selected === 'boxflow' ? 'BoxFlow OS' : 'MedFlow OS'} Demo`,
      }])
      setStatus('sent')
    } catch { setStatus('error') }
  }

  const inp = { width: '100%', background: 'rgba(7,15,36,0.8)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 10, padding: '13px 16px', fontSize: 15, color: '#f0f6ff', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const }
  const lbl = { display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8 }
  const selectedDemo = DEMOS.find(d => d.id === selected)!

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
          <Link href="/contact" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>Contact</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 100, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>Book a Live Demo</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 16 }}>See It Running Inside a <span style={{ color: '#2563EB' }}>Business Like Yours.</span></h1>
          <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>30 minutes. We show you the platform live, walk through your specific workflows, and give you a custom ROI breakdown before the call ends.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Choose Your Demo</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {DEMOS.map(d => (
                <div key={d.id} onClick={() => setSelected(d.id)} style={{ background: selected === d.id ? 'rgba(12,26,56,0.9)' : 'rgba(7,15,36,0.6)', border: `2px solid ${selected === d.id ? d.color : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>{d.icon}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: d.color }}>{d.name}</span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{d.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(12,26,56,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>What to expect</h3>
              {['30-minute live walkthrough of your chosen platform', 'We configure it around your industry and workflows', 'Live Q&A — ask anything', 'Custom ROI breakdown before the call ends', 'No pressure. No obligation.'].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ color: '#2563EB', flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(12,26,56,0.9)', border: `1px solid ${selectedDemo.color}30`, borderRadius: 24, padding: 36 }}>
            {status === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
                <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>You're Booked!</h2>
                <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6 }}>We'll reach out within 24 hours to confirm your demo time. Check your inbox!</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Request Your {selectedDemo.name} Demo</h2>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>We'll reach out within 24 hours to schedule.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div><label style={lbl}>Your Name *</label><input style={inp} placeholder="Kenneth Covington" value={form.name} onChange={e => update('name', e.target.value)} /></div>
                  <div><label style={lbl}>Work Email *</label><input style={inp} type="email" placeholder="you@company.com" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                  <div><label style={lbl}>Company Name</label><input style={inp} placeholder="Your Company" value={form.company} onChange={e => update('company', e.target.value)} /></div>
                  <div><label style={lbl}>Phone Number</label><input style={inp} placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
                  <div><label style={lbl}>Tell us about your operation</label><textarea style={{ ...inp, minHeight: 90, resize: 'vertical' as const }} placeholder="Fleet size, locations, current software..." value={form.message} onChange={e => update('message', e.target.value)} /></div>
                </div>
                <button onClick={handleSubmit} disabled={status === 'sending' || !form.name || !form.email}
                  style={{ width: '100%', marginTop: 20, padding: '16px', background: `linear-gradient(135deg,${selectedDemo.color === '#14D2C2' ? '#0A6E68' : '#1d4ed8'},${selectedDemo.color})`, color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', opacity: (!form.name || !form.email) ? 0.6 : 1 }}>
                  {status === 'sending' ? 'Sending...' : `Book My ${selectedDemo.name} Demo →`}
                </button>
                {status === 'error' && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center', marginTop: 10 }}>Something went wrong. Try again.</p>}
                <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 12 }}>No spam. No pressure. Just a 30-minute demo.</p>
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