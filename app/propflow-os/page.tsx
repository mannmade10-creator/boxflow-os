'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const STATS = [
  { value: '96', label: 'Units Managed', sub: 'Per property avg' },
  { value: '48hrs', label: 'Go-Live Time', sub: 'From signup to live' },
  { value: '60%', label: 'Cost Reduction', sub: 'vs legacy software' },
  { value: '100%', label: 'Built for PM', sub: 'Purpose-built' },
]

const FEATURES = [
  {
    icon: 'U',
    color: '#4f8ef7',
    title: 'Unit & Tenant Management',
    desc: 'Every unit, every tenant, every lease — in one place. Track occupancy, vacancies, lease expirations, and rent collections with real-time dashboards.',
    items: ['Live occupancy dashboard', 'Lease tracking & renewals', 'Rent collection & late fees', 'Tenant portal access'],
  },
  {
    icon: 'W',
    color: '#22c55e',
    title: 'Maintenance & Work Orders',
    desc: 'Submit, assign, and track work orders from any device. AI auto-dispatches to the nearest available technician based on GPS location.',
    items: ['AI auto-dispatch', 'GPS-based routing', 'Photo documentation', 'Priority escalation'],
  },
  {
    icon: 'G',
    color: '#f59e0b',
    title: 'GPS Live Staff Tracker',
    desc: 'See every maintenance tech, make-ready crew, and security guard on a live map in real time. Know exactly who is on property and where.',
    items: ['Live staff map', 'Real-time locations', 'School bus alerts', 'Geofencing triggers'],
  },
  {
    icon: 'F',
    color: '#a855f7',
    title: 'Finance & Reporting',
    desc: 'Full financial overview — rent rolls, expense tracking, payroll, and P&L reports. Everything your accountant needs, built right in.',
    items: ['Rent roll reports', 'Expense tracking', 'Payroll management', 'P&L statements'],
  },
  {
    icon: 'C',
    color: '#14D2C2',
    title: 'Community & Tenant App',
    desc: 'Your tenants get a branded app to pay rent, submit maintenance requests, receive community announcements, and communicate directly with management.',
    items: ['Branded tenant app', 'Online rent payments', 'Push notifications', 'Community board'],
  },
  {
    icon: 'A',
    color: '#ef4444',
    title: 'Applications & Leasing',
    desc: 'Digital applications, background checks, lease signing, and move-in checklists — all paperless, all in one platform.',
    items: ['Digital applications', 'Background screening', 'E-signature leases', 'Move-in checklists'],
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: '$199',
    period: '/mo',
    desc: 'Up to 50 units',
    color: '#4f8ef7',
    features: ['Unit & Tenant Management', 'Maintenance Tracking', 'Rent Collection', 'Tenant Portal', 'Basic Reporting'],
  },
  {
    name: 'Professional',
    price: '$499',
    period: '/mo',
    desc: 'Up to 200 units',
    color: '#a855f7',
    popular: true,
    features: ['Everything in Starter', 'GPS Staff Tracker', 'AI Auto-Dispatch', 'Finance & Payroll', 'Community App', 'Applications & Leasing'],
  },
  {
    name: 'Enterprise',
    price: '$999',
    period: '/mo',
    desc: 'Unlimited units',
    color: '#22c55e',
    features: ['Everything in Professional', 'Unlimited properties', 'White label option', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
  },
]

const TESTIMONIALS = [
  { name: 'Marcus T.', role: 'Property Manager, OKC', quote: 'We went from 3 different tools to one. Work orders, GPS tracking, rent collection — all in one screen. Our maintenance response time dropped by 40%.', rating: 5 },
  { name: 'Sarah K.', role: 'Regional Manager, Dallas', quote: 'The GPS tracker alone is worth the price. I can see exactly where my maintenance team is at any moment and auto-dispatch to the closest tech.', rating: 5 },
  { name: 'James R.', role: 'Owner, 3 Properties', quote: 'Setup took 48 hours. Our tenants love the app. Maintenance requests are handled faster than ever. I wish I had found this two years ago.', rating: 5 },
]

const useTick = (base: number, v: number) => {
  const [val, set] = useState(base)
  useEffect(() => {
    const id = setInterval(() => set(Math.max(0, base + Math.floor((Math.random() - .5) * v))), 3000)
    return () => clearInterval(id)
  }, [])
  return val
}

export default function PropFlowOSLanding() {
  const [annual, setAnnual] = useState(false)
  const activeUnits = useTick(12847, 20)
  const workOrders = useTick(342, 8)

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: '#e2e8f0', fontFamily: 'system-ui,sans-serif' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 40px rgba(79,142,247,0.3)}50%{box-shadow:0 0 80px rgba(79,142,247,0.6)}}
        .feat-card{transition:transform 0.2s,border-color 0.2s}
        .feat-card:hover{transform:translateY(-4px)}
        .plan-card{transition:transform 0.2s}
        .plan-card:hover{transform:translateY(-4px)}
        .nav-link{color:#475569;text-decoration:none;font-size:13px;transition:color 0.15s}
        .nav-link:hover{color:#e2e8f0}
        .cta-btn{transition:all 0.2s;cursor:pointer}
        .cta-btn:hover{transform:translateY(-2px)}
      `}</style>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid rgba(79,142,247,0.12)', position: 'sticky', top: 0, background: 'rgba(5,13,26,0.95)', backdropFilter: 'blur(12px)', zIndex: 100, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3b6fd4,#4f8ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#fff', animation: 'glow 3s ease infinite' }}>P</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>PropFlow OS</div>
            <div style={{ fontSize: 8, color: '#4f8ef7', letterSpacing: 2, textTransform: 'uppercase' }}>by Made Technologies</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          <Link href="/propflow-login" style={{ padding: '9px 22px', background: 'linear-gradient(135deg,#3b6fd4,#4f8ef7)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
            Enter PropFlow OS
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center', animation: 'fadeUp 0.8s ease both' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: 100, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#4f8ef7', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f8ef7', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Property Management — Reimagined
        </div>
        <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px', letterSpacing: -2, color: '#fff' }}>
          Stop Managing Your<br />
          Properties. <span style={{ color: '#4f8ef7' }}>Start Running</span><br />
          <span style={{ color: '#4f8ef7' }}>Them.</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: 19, maxWidth: 620, margin: '0 auto 48px', lineHeight: 1.7 }}>
          PropFlow OS is the all-in-one operating system built exclusively for property managers. Units, tenants, maintenance, GPS tracking, finance, and a tenant app — unified in one platform.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/propflow-login" className="cta-btn" style={{ padding: '16px 36px', background: 'linear-gradient(135deg,#3b6fd4,#4f8ef7)', borderRadius: 14, color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 800 }}>
            Start Free Trial
          </Link>
          <Link href="/demo" className="cta-btn" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: 14, color: '#e2e8f0', textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
            Book a Demo
          </Link>
        </div>

        {/* LIVE COUNTERS */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 12, padding: '14px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#4f8ef7' }}>{activeUnits.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#475569', letterSpacing: 1 }}>Units Live on Platform</div>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: '14px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#22c55e' }}>{workOrders}</div>
            <div style={{ fontSize: 11, color: '#475569', letterSpacing: 1 }}>Work Orders Completed Today</div>
          </div>
          <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 12, padding: '14px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#a855f7' }}>48hrs</div>
            <div style={{ fontSize: 11, color: '#475569', letterSpacing: 1 }}>Average Go-Live Time</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#4f8ef7', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, marginBottom: 12, color: '#fff', letterSpacing: -1 }}>
            Everything You Need.<br /><span style={{ color: '#4f8ef7' }}>Nothing You Don't.</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>Six fully integrated modules — one login, one platform, zero integrations needed.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-card" style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid ${f.color}20`, borderRadius: 20, padding: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: f.color, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{f.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {f.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#94a3b8' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY PROPFLOW */}
      <section style={{ background: 'rgba(10,20,40,0.6)', borderTop: '1px solid rgba(79,142,247,0.08)', borderBottom: '1px solid rgba(79,142,247,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, marginBottom: 20, color: '#fff', letterSpacing: -1 }}>Why Property Managers Choose PropFlow OS</h2>
              {[
                { title: 'Built for PM — not adapted', desc: 'Every feature was designed for property managers. Not an ERP. Not a generic CRM. A purpose-built operating system.' },
                { title: 'Replace 5 tools with 1', desc: 'Rent collection, maintenance, GPS tracking, tenant communication, and finance — all in one login.' },
                { title: 'Live in 48 hours', desc: 'Our team handles setup and migration. You are fully operational in two days, not six months.' },
                { title: 'Mid-market pricing', desc: 'Enterprise-grade software at a price that makes sense for operations with 10-500 units.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f8ef7', fontSize: 12, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>+</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' }}>What You Replace</div>
              {[
                ['Property Management Software', '$300-800/mo'],
                ['Maintenance Tracking Tool', '$150-400/mo'],
                ['GPS Tracking Software', '$200-500/mo'],
                ['Tenant Communication App', '$100-300/mo'],
                ['Accounting Software', '$100-400/mo'],
                ['TOTAL LEGACY STACK', '$850 - $2,400/mo'],
              ].map(([label, cost], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(79,142,247,0.07)', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: i === 5 ? '#fff' : '#64748b', fontWeight: i === 5 ? 800 : 400 }}>{label}</span>
                  <span style={{ fontSize: 13, color: i === 5 ? '#ef4444' : '#475569', fontWeight: i === 5 ? 800 : 400 }}>{cost}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', marginTop: 4 }}>
                <span style={{ fontSize: 14, color: '#fff', fontWeight: 800 }}>PropFlow OS Professional</span>
                <span style={{ fontSize: 14, color: '#22c55e', fontWeight: 900 }}>$499/mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, marginBottom: 12, color: '#fff', letterSpacing: -1 }}>What Property Managers Say</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 18, padding: 28 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {[...Array(t.rating)].map((_, j) => <span key={j} style={{ color: '#f59e0b', fontSize: 14 }}>*</span>)}
              </div>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                <div style={{ fontSize: 12, color: '#475569' }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, marginBottom: 12, color: '#fff', letterSpacing: -1 }}>Simple, Transparent Pricing</h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 28 }}>14-day free trial. No credit card required. Cancel anytime.</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 100, padding: 4 }}>
            <button onClick={() => setAnnual(false)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', background: !annual ? '#4f8ef7' : 'transparent', color: !annual ? '#fff' : '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui' }}>Monthly</button>
            <button onClick={() => setAnnual(true)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', background: annual ? '#4f8ef7' : 'transparent', color: annual ? '#fff' : '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', gap: 8 }}>
              Annual <span style={{ background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 8px', borderRadius: 100 }}>SAVE 17%</span>
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {PLANS.map((p, i) => {
            const monthlyPrice = parseInt(p.price.replace('$', '').replace(',', ''))
            const annualPrice = Math.round(monthlyPrice * 0.83)
            return (
              <div key={i} className="plan-card" style={{ background: p.popular ? 'rgba(168,85,247,0.06)' : 'rgba(15,23,42,0.8)', border: `2px solid ${p.popular ? p.color : p.color + '25'}`, borderRadius: 22, padding: 30, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {p.popular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: p.color, color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 16px', borderRadius: 100, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Most Popular</div>}
                <h3 style={{ fontSize: 20, fontWeight: 900, color: p.color, marginBottom: 4 }}>{p.name}</h3>
                <p style={{ color: '#475569', fontSize: 13, marginBottom: 16 }}>{p.desc}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: annual ? 8 : 20 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: '#fff', lineHeight: 1 }}>${annual ? annualPrice : monthlyPrice}</span>
                  <span style={{ color: '#475569', fontSize: 14, marginBottom: 8 }}>/mo</span>
                </div>
                {annual && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>Billed ${annualPrice * 12}/yr</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>Save ${(monthlyPrice - annualPrice) * 12}/yr vs monthly</div>
                  </div>
                )}
                <div style={{ flex: 1, marginBottom: 24 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ color: p.color, flexShrink: 0, marginTop: 2, fontWeight: 700 }}>+</span>
                      <span style={{ color: '#94a3b8', fontSize: 13 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/propflow-login" style={{ display: 'block', textAlign: 'center', padding: '13px 24px', background: p.popular ? p.color : `rgba(${p.color === '#4f8ef7' ? '79,142,247' : p.color === '#22c55e' ? '34,197,94' : '168,85,247'},0.1)`, border: `1px solid ${p.color}`, borderRadius: 12, color: p.popular ? '#fff' : p.color, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
                  Start Free Trial
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(79,142,247,0.1), rgba(168,85,247,0.06))', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 24, padding: '56px 40px' }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, marginBottom: 16, color: '#fff', letterSpacing: -1 }}>
            Ready to Run Your Properties<br />Like a Real Business?
          </h2>
          <p style={{ color: '#64748b', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Join property managers across the country who replaced 5 tools with one. 14-day free trial. Setup in 48 hours.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/propflow-login" style={{ padding: '16px 36px', background: 'linear-gradient(135deg,#3b6fd4,#4f8ef7)', borderRadius: 14, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 16 }}>Start Free Trial</Link>
            <Link href="/demo" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: 14, color: '#e2e8f0', textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>Book a Demo</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(79,142,247,0.08)', padding: '32px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 12, color: '#334155' }}>© 2026 Made Technologies Inc. PropFlow OS. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Refund', '/refund'], ['Careers', '/careers'], ['Contact', '/contact']].map(([l, h]) => (
              <Link key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}