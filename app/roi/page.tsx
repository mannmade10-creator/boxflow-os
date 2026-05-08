'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://irifwmikcugfxpfhyfrm.supabase.co',
  'sb_publishable_kpguCeakweBu2T5JIYxdjw_0WP6mMsj'
)

async function sendToZoho(data: Record<string, unknown>) {
  try {
    await fetch('/api/zoho-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch (err) {
    console.error('Zoho sync error:', err)
  }
}

async function sendToInstantly({ name, email, company, inputs, results, leadType }: {
  name?: string; email: string; company?: string;
  inputs: Record<string, unknown>; results: Record<string, number>; leadType: string
}) {
  try {
    const nameParts = (name || '').split(' ')
    await fetch('/api/instantly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        company_name: company || '',
        industry: inputs.industry || '',
        trucks: String(inputs.trucks || ''),
        employees: String(inputs.employees || ''),
        estimated_savings: `$${Math.round(results.savings).toLocaleString()}/yr`,
        lead_source: leadType === 'demo_request' ? 'Demo Request' : 'ROI Calculator',
      }),
    })
  } catch (err) {
    console.error('Instantly error:', err)
  }
}

async function saveLead({
  name, email, company, leadType, inputs, results
}: {
  name?: string; email: string; company?: string; leadType: string;
  inputs: Record<string, unknown>; results: Record<string, number>
}) {
  const payload = {
    name: name || null,
    email,
    company: company || null,
    lead_type: leadType,
    industry: inputs.industry || null,
    trucks: inputs.trucks,
    employees: inputs.employees,
    locations: inputs.locations,
    orders_per_month: inputs.orders,
    other_annual_spend: inputs.otherSpend,
    estimated_current_spend: Math.round(results.total),
    estimated_boxflow_cost: Math.round(results.boxflowCost),
    estimated_annual_savings: Math.round(results.savings),
    estimated_total_benefit: Math.round(results.totalBenefit),
    payback_months: results.paybackMonths,
  }

  // 1️⃣ Supabase
  const { error } = await supabase.from('roi_leads').insert([payload])
  if (error) console.error('Supabase insert error:', error)

  // 2️⃣ Zoho CRM
  await sendToZoho({
    Last_Name: name?.split(' ').slice(1).join(' ') || 'Unknown',
    First_Name: name?.split(' ')[0] || '',
    Email: email,
    Company: company || '',
    Lead_Source: 'ROI Calculator',
    Description: `Industry: ${inputs.industry || 'N/A'} | Trucks: ${inputs.trucks} | Employees: ${inputs.employees} | Est. Savings: $${Math.round(results.savings).toLocaleString()}/yr`,
    Annual_Revenue: Math.round(results.total),
  })

  // 3️⃣ Instantly
  await sendToInstantly({ name, email, company, inputs, results, leadType })
}

function fmt(n: number): string {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K'
  return '$' + Math.round(n)
}
function fmtFull(n: number): string {
  return '$' + Math.round(n).toLocaleString()
}

const INDUSTRIES = [
  { id: 'logistics',     label: 'Logistics',     icon: '🚚', trucks: 40,  employees: 120, locations: 3, orders: 2000, otherSpend: 80000  },
  { id: 'manufacturing', label: 'Manufacturing', icon: '🏭', trucks: 15,  employees: 250, locations: 2, orders: 1500, otherSpend: 120000 },
  { id: 'healthcare',    label: 'Healthcare',    icon: '🏥', trucks: 20,  employees: 80,  locations: 4, orders: 3000, otherSpend: 60000  },
  { id: 'distribution',  label: 'Distribution',  icon: '📦', trucks: 60,  employees: 180, locations: 6, orders: 5000, otherSpend: 100000 },
  { id: 'warehouse',     label: 'Warehouse',     icon: '🏗️', trucks: 10,  employees: 90,  locations: 1, orders: 800,  otherSpend: 40000  },
]

function calcSpend(trucks: number, employees: number, locations: number, orders: number, otherSpend: number) {
  return {
    dispatch:   Math.max(6000,  trucks * 600),
    fleet:      Math.max(4800,  trucks * 450),
    hr:         Math.max(3600,  employees * 240),
    analytics:  Math.max(6000,  locations * 8000),
    portal:     Math.max(4800,  locations * 6000),
    production: Math.max(9600,  (orders / 1000) * 14400 + locations * 4800),
    other:      otherSpend,
  }
}

function calcResults(spend: Record<string, number>) {
  const total = Object.values(spend).reduce((a, b) => a + b, 0)
  const boxflowCost = Math.max(24000, total * 0.19)
  const savings = total - boxflowCost
  const totalBenefit = savings * 1.42
  const paybackMonths = Math.max(1, Math.round((boxflowCost / 12) / (savings / 12) * 2))
  return { total, boxflowCost, savings, totalBenefit, paybackMonths }
}

function AnimNum({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const ref = useRef(value)
  useEffect(() => {
    const start = ref.current, end = value, dur = 600, t0 = performance.now()
    const step = (now: number) => {
      const p = Math.min((now - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(start + (end - start) * eased))
      if (p < 1) requestAnimationFrame(step)
      else ref.current = end
    }
    requestAnimationFrame(step)
  }, [value])
  return <span>{fmt(display)}</span>
}

function Slider({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 500 }}>{label}</span>
        <span style={{ color: '#0ea5e9', fontSize: 15, fontWeight: 700, background: 'rgba(14,165,233,0.12)', padding: '3px 10px', borderRadius: 6, border: '1px solid rgba(14,165,233,0.2)', minWidth: 70, textAlign: 'center' }}>{format(value)}</span>
      </div>
      <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 100 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, background: 'linear-gradient(90deg, #0ea5e9, #22d3ee)', borderRadius: 100 }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}

export default function ROIPage() {
  const [industry, setIndustry]     = useState<string | null>(null)
  const [trucks, setTrucks]         = useState(20)
  const [employees, setEmployees]   = useState(50)
  const [locations, setLocations]   = useState(3)
  const [orders, setOrders]         = useState(200)
  const [otherSpend, setOtherSpend] = useState(500000)
  const [email, setEmail]           = useState('')
  const [emailStatus, setEmailStatus] = useState<null | 'sending' | 'sent' | 'error'>(null)
  const [showModal, setShowModal]   = useState(false)
  const [modalShown, setModalShown] = useState(false)
  const [demoName, setDemoName]     = useState('')
  const [demoEmail, setDemoEmail]   = useState('')
  const [demoCompany, setDemoCompany] = useState('')
  const [demoStatus, setDemoStatus] = useState<null | 'sending' | 'booked' | 'error'>(null)

  const spend   = calcSpend(trucks, employees, locations, orders, otherSpend)
  const results = calcResults(spend)
  const inputs  = { industry, trucks, employees, locations, orders, otherSpend }

  useEffect(() => {
    if (!modalShown && (trucks !== 20 || employees !== 50 || locations !== 3)) {
      const t = setTimeout(() => { setShowModal(true); setModalShown(true) }, 1400)
      return () => clearTimeout(t)
    }
  }, [trucks, employees, locations, modalShown])

  function applyIndustry(ind: typeof INDUSTRIES[0]) {
    setIndustry(ind.id); setTrucks(ind.trucks); setEmployees(ind.employees)
    setLocations(ind.locations); setOrders(ind.orders); setOtherSpend(ind.otherSpend)
  }

  async function handleEmailSend() {
    if (!email.includes('@')) return
    setEmailStatus('sending')
    try {
      await saveLead({ email, leadType: 'email_report', inputs, results })
      setEmailStatus('sent')
    } catch { setEmailStatus('error') }
  }

  async function handleDemoBook() {
    if (!demoEmail.includes('@') || !demoName.trim()) return
    setDemoStatus('sending')
    try {
      await saveLead({ name: demoName, email: demoEmail, company: demoCompany, leadType: 'demo_request', inputs, results })
      setDemoStatus('booked')
      setTimeout(() => setShowModal(false), 2500)
    } catch { setDemoStatus('error') }
  }

  const spendItems = [
    { label: 'Dispatch Software', value: spend.dispatch },
    { label: 'Fleet Tracking',    value: spend.fleet    },
    { label: 'HR Systems',        value: spend.hr       },
    { label: 'Analytics Tools',   value: spend.analytics},
    { label: 'Client Portal',     value: spend.portal   },
    { label: 'Production Mgmt',   value: spend.production},
    { label: 'Other Software',    value: spend.other    },
  ]

  const inputStyle = { width: '100%', background: 'rgba(7,15,36,0.8)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#f0f6ff', fontFamily: 'inherit', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse 80% 50% at 20% -10%, rgba(14,165,233,0.08), transparent 60%), linear-gradient(180deg, #020818 0%, #070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '60px 20px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9', display: 'inline-block' }} />
            Live ROI Calculator
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>
            Stop Overpaying for <span style={{ color: '#0ea5e9' }}>Disconnected Software.</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Tell us about your operation and see exactly how much BoxFlow OS saves you — every year.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
          {INDUSTRIES.map(ind => (
            <button key={ind.id} onClick={() => applyIndustry(ind)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 100, border: `1px solid ${industry === ind.id ? '#0ea5e9' : 'rgba(14,165,233,0.18)'}`, background: industry === ind.id ? 'rgba(14,165,233,0.12)' : 'rgba(7,15,36,0.8)', color: industry === ind.id ? '#0ea5e9' : '#94a3b8', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              <span>{ind.icon}</span>{ind.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 20 }}>
          <div style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: 24 }}>⚙️  Your Operation</div>
            <Slider label="Trucks / Vehicles"     value={trucks}     min={1}  max={200}      step={1}     format={v => String(v)}                                         onChange={setTrucks} />
            <Slider label="Employees"             value={employees}  min={5}  max={500}      step={5}     format={v => String(v)}                                         onChange={setEmployees} />
            <Slider label="Locations"             value={locations}  min={1}  max={50}       step={1}     format={v => String(v)}                                         onChange={setLocations} />
            <Slider label="Orders Per Month"      value={orders}     min={10} max={10000}    step={10}    format={v => v >= 1000 ? `${(v/1000).toFixed(1)}K` : String(v)} onChange={setOrders} />
            <Slider label="Other Annual SW Spend" value={otherSpend} min={0}  max={10000000} step={10000} format={v => fmt(v)}                                            onChange={setOtherSpend} />
            <div style={{ marginTop: 8, padding: 20, background: 'rgba(2,8,24,0.5)', borderRadius: 16 }}>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 14 }}>💸  Estimated Current Annual Spend</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {spendItems.map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: '#94a3b8', fontSize: 13 }}>{item.label}</span>
                    <span style={{ color: '#f0f6ff', fontWeight: 600, fontSize: 13 }}>{fmt(item.value)}/yr</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 14, borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginTop: 4 }}>
                  <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 13 }}>Total Current Spend</span>
                  <span style={{ color: '#ef4444', fontWeight: 900, fontSize: 18 }}><AnimNum value={results.total} /></span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 16, padding: 20, textAlign: 'center', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>Annual Savings with BoxFlow OS</div>
                <div style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, color: '#10b981', lineHeight: 1 }}><AnimNum value={results.savings} /></div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>per year</div>
              </div>
              {[
                { label: 'Monthly Savings',      value: Math.round(results.savings / 12), color: '#0ea5e9' },
                { label: 'Payback Period',        value: results.paybackMonths,            color: '#f59e0b', suffix: ' mo' },
                { label: 'BoxFlow OS Cost',       value: results.boxflowCost,              color: '#8b5cf6' },
                { label: 'Total Annual Benefit',  value: results.totalBenefit,             color: '#22d3ee' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(7,15,36,0.9)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: 14, padding: 18, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>
                    {s.suffix ? `${s.value}${s.suffix}` : <AnimNum value={s.value} />}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(7,15,36,0.9)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>BoxFlow OS vs Your Current Stack</div>
              {[
                { label: 'Current Stack', value: results.total,       color: '#ef4444', pct: 100 },
                { label: 'BoxFlow OS',    value: results.boxflowCost, color: '#10b981', pct: (results.boxflowCost / results.total) * 100 },
              ].map(row => (
                <div key={row.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: '#94a3b8' }}>{row.label}</span>
                    <span style={{ color: row.color, fontWeight: 700 }}>{fmtFull(row.value)}/yr</span>
                  </div>
                  <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 100 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.06))', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 18, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>📩 Send Your Results to Your Inbox</div>
              <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 18, lineHeight: 1.5 }}>Get your personalized savings report — share it with your team before your demo call.</p>
              {emailStatus === 'sent' ? (
                <p style={{ color: '#10b981', fontWeight: 600 }}>✅ Report sent! Check your inbox.</p>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto' }}>
                    <input style={{ ...inputStyle, flex: 1 }} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    <button style={{ background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 22px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }} onClick={handleEmailSend} disabled={emailStatus === 'sending'}>
                      {emailStatus === 'sending' ? 'Sending…' : 'Send →'}
                    </button>
                  </div>
                  {emailStatus === 'error' && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>Something went wrong. Please try again.</p>}
                </>
              )}
            </div>

            <button onClick={() => setShowModal(true)}
              style={{ width: '100%', padding: '18px 24px', background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', color: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
              🚀 Book a Live Demo — See BoxFlow OS in Action
            </button>
            <p style={{ color: '#64748b', fontSize: 13, textAlign: 'center', marginTop: -8 }}>No credit card required · 14-day free trial · Setup in 48 hours</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(2,8,24,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0c1a38', border: '1px solid rgba(14,165,233,0.35)', borderRadius: 24, padding: 40, maxWidth: 480, width: '100%', position: 'relative' }}>
            <button onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: 16, textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#10b981' }}>{fmtFull(results.savings)}/yr</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>your estimated annual savings with BoxFlow OS</div>
            </div>
            {demoStatus === 'booked' ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>You&apos;re Booked!</h2>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>Check your inbox for confirmation. We&apos;ll see you on the call, {demoName.split(' ')[0]}!</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>See It Live in Your Operation</h2>
                <p style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>30-minute demo. We&apos;ll show BoxFlow OS inside a business like yours — plus a custom ROI breakdown before you hang up.</p>
                {[
                  { label: 'Your Name',    placeholder: 'First Last',         value: demoName,    onChange: setDemoName,    type: 'text'  },
                  { label: 'Work Email',   placeholder: 'you@company.com',    value: demoEmail,   onChange: setDemoEmail,   type: 'email' },
                  { label: 'Company Name', placeholder: 'Your Company',       value: demoCompany, onChange: setDemoCompany, type: 'text'  },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{f.label}</label>
                    <input style={{ ...inputStyle, background: 'rgba(7,15,36,0.9)' }} type={f.type} placeholder={f.placeholder} value={f.value} onChange={e => f.onChange(e.target.value)} />
                  </div>
                ))}
                <button onClick={handleDemoBook} disabled={demoStatus === 'sending'}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', color: '#fff', border: 'none', borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' }}>
                  {demoStatus === 'sending' ? 'Booking…' : 'Book My Free Demo →'}
                </button>
                {demoStatus === 'error' && <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center', marginTop: 10 }}>Something went wrong. Please try again.</p>}
                <p style={{ fontSize: 11, color: '#475569', textAlign: 'center', marginTop: 12 }}>No spam. No pressure. Just a 30-minute demo on your schedule.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}