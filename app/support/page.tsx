'use client'
import { useState } from 'react'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }

const PLATFORMS = [
  { id: 'boxflow',   name: 'BoxFlow OS',   color: '#2563EB' },
  { id: 'medflow',   name: 'MedFlow OS',   color: '#14D2C2' },
  { id: 'propflow',  name: 'PropFlow OS',  color: '#a855f7' },
  { id: 'classflow', name: 'ClassFlow AI', color: '#f59e0b' },
  { id: 'general',   name: 'General / Other', color: '#64748b' },
]

const CATEGORIES = [
  'Login or Access Issue',
  'Feature Not Working',
  'Data Not Loading',
  'Mobile App Issue',
  'Billing Question',
  'Integration Help',
  'How-To Question',
  'Performance Issue',
  'Bug Report',
  'Feature Request',
  'Other',
]

const FAQS = [
  { q: 'How do I reset my password?', a: 'Go to your platform login page and click "Forgot password". You will receive an email with a reset link within 5 minutes.' },
  { q: 'How long does onboarding take?', a: 'Most customers are fully live within 48 hours. Our team handles data migration and setup for you.' },
  { q: 'Can I switch between monthly and annual billing?', a: 'Yes. Go to your account settings and select "Billing". You can switch at any time. Annual billing saves 17%.' },
  { q: 'Is my data secure?', a: 'All data is encrypted in transit (TLS) and at rest (AES-256). We use Supabase with Row Level Security so your data is completely isolated from other customers.' },
  { q: 'What is the SLA for enterprise support?', a: 'Enterprise plan customers receive a 4-hour response SLA. Professional plan is 24 hours. Starter plan is 48 hours.' },
  { q: 'Can I add multiple users to my account?', a: 'Yes. Enterprise plan includes unlimited users. Professional includes up to 10. Starter includes up to 3.' },
]

export default function SupportPage() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', platform: 'boxflow',
    category: 'Feature Not Working', priority: 'normal',
    title: '', description: '',
  })
  const [step, setStep]       = useState<'form' | 'submitted'>('form')
  const [sending, setSending] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function update(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  async function submit() {
    if (!form.name || !form.email || !form.title || !form.description) return
    setSending(true)
    try {
      const id = `TKT-${Date.now().toString(36).toUpperCase()}`
      await fetch(`${supabaseUrl}/rest/v1/support_tickets`, {
        method: 'POST', headers,
        body: JSON.stringify({
          platform:    form.platform,
          title:       form.title,
          description: `From: ${form.name} (${form.email}) | Company: ${form.company}\nCategory: ${form.category}\n\n${form.description}`,
          priority:    form.priority,
          status:      'open',
          assigned_to: 'kenneth.covington@boxflowos.com',
        }),
      })
      setTicketId(id)
      setStep('submitted')
    } catch { setStep('submitted') }
    setSending(false)
  }

  const inp  = { width: '100%', background: 'rgba(7,15,36,0.8)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f0f6ff', fontFamily: 'system-ui', outline: 'none', boxSizing: 'border-box' as const }
  const lbl  = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 7 }
  const sel  = { ...inp, cursor: 'pointer' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#020818 0%,#070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid rgba(20,210,194,0.08)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.95)', backdropFilter: 'blur(12px)', zIndex: 100, flexWrap: 'wrap', gap: 12 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#fff' }}>M</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>Made Technologies</div>
            <div style={{ fontSize: 8, color: '#14D2C2', letterSpacing: 2, textTransform: 'uppercase' }}>Support Center</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/help"    style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>Help Center</Link>
          <Link href="/contact" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>Contact</Link>
          <Link href="/"        style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Back to Platform</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(20,210,194,0.08)', border: '1px solid rgba(20,210,194,0.2)', borderRadius: 100, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#14D2C2', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14D2C2', display: 'inline-block' }} />
          Enterprise Support — We Respond Personally
        </div>
        <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, margin: '0 0 14px', letterSpacing: -1 }}>
          How Can We Help?
        </h1>
        <p style={{ color: '#64748b', fontSize: 16, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
          Submit a ticket and we will respond within 24 hours. Critical issues get a 4-hour response. Every ticket goes directly to Kenneth.
        </p>

        {/* RESPONSE TIME BADGES */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Critical', time: '4 hrs', color: '#ef4444' },
            { label: 'High',     time: '12 hrs', color: '#f59e0b' },
            { label: 'Normal',   time: '24 hrs', color: '#14D2C2' },
            { label: 'Low',      time: '48 hrs', color: '#64748b' },
          ].map((t,i) => (
            <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: `1px solid ${t.color}25`, borderRadius: 12, padding: '10px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: t.color, fontWeight: 700, marginBottom: 2 }}>{t.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#f0f6ff' }}>{t.time}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>response SLA</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: 32, alignItems: 'start' }}>

          {/* TICKET FORM */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>Submit a Support Ticket</h2>

            {step === 'submitted' ? (
              <div style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(20,210,194,0.2)', borderRadius: 20, padding: 40, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(20,210,194,0.1)', border: '1px solid rgba(20,210,194,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, color: '#14D2C2', fontWeight: 900 }}>+</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Ticket Submitted!</h3>
                <div style={{ background: 'rgba(20,210,194,0.08)', border: '1px solid rgba(20,210,194,0.2)', borderRadius: 10, padding: '10px 20px', display: 'inline-block', marginBottom: 16 }}>
                  <span style={{ fontSize: 13, color: '#14D2C2', fontWeight: 700, fontFamily: 'monospace' }}>{ticketId}</span>
                </div>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  We received your ticket and will respond to <strong style={{ color: '#f0f6ff' }}>{form.email}</strong> within 24 hours. Critical issues get a 4-hour response.
                </p>
                <button onClick={() => { setStep('form'); setForm({ name:'', email:'', company:'', platform:'boxflow', category:'Feature Not Working', priority:'normal', title:'', description:'' }) }}
                  style={{ padding: '11px 28px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'system-ui' }}>
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <div style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(20,210,194,0.12)', borderRadius: 20, padding: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div><label style={lbl}>Your Name *</label><input style={inp} placeholder="Kenneth Covington" value={form.name} onChange={e => update('name', e.target.value)} /></div>
                    <div><label style={lbl}>Email *</label><input style={inp} type="email" placeholder="you@company.com" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                  </div>

                  <div><label style={lbl}>Company</label><input style={inp} placeholder="Your company name" value={form.company} onChange={e => update('company', e.target.value)} /></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={lbl}>Platform</label>
                      <select style={sel} value={form.platform} onChange={e => update('platform', e.target.value)}>
                        {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Priority</label>
                      <select style={sel} value={form.priority} onChange={e => update('priority', e.target.value)}>
                        <option value="low">Low — Not urgent</option>
                        <option value="normal">Normal — Standard</option>
                        <option value="high">High — Affecting work</option>
                        <option value="critical">Critical — Platform down</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Category</label>
                    <select style={sel} value={form.category} onChange={e => update('category', e.target.value)}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div><label style={lbl}>Subject *</label><input style={inp} placeholder="Brief description of your issue" value={form.title} onChange={e => update('title', e.target.value)} /></div>

                  <div>
                    <label style={lbl}>Full Description *</label>
                    <textarea style={{ ...inp, minHeight: 120, resize: 'vertical' as const }}
                      placeholder="Please describe the issue in detail. Include steps to reproduce, what you expected to happen, and what actually happened."
                      value={form.description} onChange={e => update('description', e.target.value)} />
                  </div>

                  {/* Priority indicator */}
                  {form.priority === 'critical' && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#ef4444' }}>
                      Critical tickets get a 4-hour response. Kenneth is notified immediately via SMS.
                    </div>
                  )}

                  <button onClick={submit} disabled={sending || !form.name || !form.email || !form.title || !form.description}
                    style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', opacity: !form.name || !form.email || !form.title || !form.description ? 0.6 : 1 }}>
                    {sending ? 'Submitting...' : 'Submit Support Ticket'}
                  </button>
                  <p style={{ color: '#334155', fontSize: 11, textAlign: 'center', margin: 0 }}>
                    Tickets go directly to kenneth.covington@boxflowos.com · We respond personally, not through a bot.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* CONTACT OPTIONS */}
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>Other Ways to Reach Us</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: 'E', label: 'Email Support', value: 'kenneth.covington@boxflowos.com', sub: 'Response within 24 hours', color: '#14D2C2', href: 'mailto:kenneth.covington@boxflowos.com' },
                  { icon: 'C', label: 'Contact Form', value: 'boxflowos.com/contact', sub: 'General inquiries and demos', color: '#2563EB', href: '/contact' },
                  { icon: 'D', label: 'Book a Demo', value: 'boxflowos.com/demo', sub: '30-minute live walkthrough', color: '#a855f7', href: '/demo' },
                ].map((c,i) => (
                  <a key={i} href={c.href} style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'rgba(12,26,56,0.8)', border: `1px solid ${c.color}18`, borderRadius: 14, padding: '16px 20px', textDecoration: 'none' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: `${c.color}12`, border: `1px solid ${c.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: c.color, flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 2 }}>{c.label}</div>
                      <div style={{ fontSize: 12, color: c.color }}>{c.value}</div>
                      <div style={{ fontSize: 11, color: '#475569' }}>{c.sub}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* SUPPORT TIERS */}
            <div style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.1)', borderRadius: 16, padding: 22 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Support Tiers</h3>
              {[
                { plan: 'Starter',      sla: '48 hrs', features: ['Email support','Knowledge base','Community forum'], color: '#64748b' },
                { plan: 'Professional', sla: '24 hrs', features: ['Priority email','Monthly check-in call','Video tutorials'], color: '#14D2C2' },
                { plan: 'Enterprise',   sla: '4 hrs',  features: ['Dedicated account manager','Direct SMS line','Quarterly business review','Custom onboarding'], color: '#2563EB' },
              ].map((t,i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.plan}</span>
                    <span style={{ fontSize: 12, color: '#f0f6ff', fontWeight: 600 }}>{t.sla} response</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {t.features.map(f => (
                      <span key={f} style={{ fontSize: 10, color: '#64748b', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '2px 8px' }}>{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Frequently Asked Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FAQS.map((f,i) => (
                  <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: '100%', padding: '14px 18px', background: 'none', border: 'none', color: '#f0f6ff', fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: 'system-ui' }}>
                      {f.q}
                      <span style={{ color: '#14D2C2', fontSize: 18, flexShrink: 0 }}>{openFaq === i ? '-' : '+'}</span>
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: '0 18px 14px', color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>{f.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#334155' }}>© 2026 Made Technologies Inc · Support Center</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy','/privacy'],['Terms','/terms'],['Contact','/contact']].map(([l,h]) => (
            <Link key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}