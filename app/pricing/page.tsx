'use client'
import Link from 'next/link'
import { useState } from 'react'

const PLANS = [
  {
    name: 'Starter',
    price: { monthly: 599, annual: 499 },
    desc: '1 location · Up to 10 trucks',
    color: '#0ea5e9',
    features: [
      'Command Center Dashboard',
      'Production Monitoring',
      'Smart Dispatch',
      'Live Fleet Map',
      'Order Management',
      'Client Portal',
      'Up to 10 trucks',
      'Email support',
    ],
    addons: 'Add-ons: $15/truck/mo over limit',
    cta: 'Start Free Trial',
    href: '/onboarding/boxflow',
    popular: false,
  },
  {
    name: 'Professional',
    price: { monthly: 1899, annual: 1599 },
    desc: 'Up to 3 locations · Up to 50 trucks',
    color: '#8b5cf6',
    features: [
      'Everything in Starter',
      'AI Auto-Dispatch',
      'HR + Payroll Center',
      'Advanced Analytics',
      'Driver Management',
      'Equipment Dashboard',
      'Up to 50 trucks',
      'API Access ($299 value)',
      'Priority support',
    ],
    addons: 'Add-ons: $15/truck/mo · $299/mo API access',
    cta: 'Start Free Trial',
    href: '/onboarding/boxflow',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 4499, annual: 3799 },
    desc: 'Unlimited locations & trucks',
    color: '#f59e0b',
    features: [
      'Everything in Professional',
      'Unlimited locations',
      'Unlimited trucks',
      'White Label option',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Onboarding specialist',
    ],
    addons: 'Add-ons: White label $799/mo · API $299/mo',
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
]

const COMPARISON = [
  { feature: 'Fleet Tracking (standalone)', cost: '$8,000 – $45,000/yr' },
  { feature: 'Dispatch Management', cost: '$12,000 – $60,000/yr' },
  { feature: 'Warehouse Management (WMS)', cost: '$15,000 – $80,000/yr' },
  { feature: 'HR & Workforce System', cost: '$6,000 – $30,000/yr' },
  { feature: 'Analytics Platform', cost: '$8,000 – $40,000/yr' },
  { feature: 'Client Portal', cost: '$6,000 – $24,000/yr' },
  { feature: 'TOTAL CURRENT STACK', cost: '$55,000 – $279,000/yr' },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020818 0%, #070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(14,165,233,0.1)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>BoxFlow OS</span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/blog" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>Blog</Link>
          <Link href="/roi" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none' }}>ROI Calculator</Link>
          <Link href="/login" style={{ padding: '8px 20px', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, color: '#0ea5e9', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
        </div>
      </nav>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>
          Simple, Transparent Pricing
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 16px' }}>
          Replace <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>$7,200/mo</span> in Legacy Tools.<br />
          <span style={{ color: '#0ea5e9' }}>Pay a Fraction Instead.</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
          One platform. Every module. No hidden fees. Cancel anytime.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 100, padding: '4px' }}>
          <button onClick={() => setAnnual(false)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', background: !annual ? '#0ea5e9' : 'transparent', color: !annual ? '#fff' : '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Monthly</button>
          <button onClick={() => setAnnual(true)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', background: annual ? '#0ea5e9' : 'transparent', color: annual ? '#fff' : '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
            Annual
            <span style={{ background: '#10b981', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100 }}>SAVE 17%</span>
          </button>
        </div>
        {annual && <p style={{ color: '#10b981', fontSize: 13, marginTop: 12, fontWeight: 600 }}>Pay annually — lower monthly rate, higher total commitment</p>}
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{ background: plan.popular ? 'rgba(139,92,246,0.06)' : 'rgba(12,26,56,0.9)', border: `2px solid ${plan.popular ? '#8b5cf6' : 'rgba(14,165,233,0.15)'}`, borderRadius: 24, padding: 32, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#8b5cf6', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 16px', borderRadius: 100, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: plan.color, marginBottom: 4 }}>{plan.name}</h3>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>{plan.desc}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, color: '#f0f6ff', lineHeight: 1 }}>
                    ${(annual ? plan.price.annual : plan.price.monthly).toLocaleString()}
                  </span>
                  <span style={{ color: '#64748b', fontSize: 15, marginBottom: 8 }}>/mo</span>
                </div>
                {annual && (
                  <div style={{ marginTop: 8 }}>
                    <p style={{ color: '#10b981', fontSize: 13, fontWeight: 600, margin: 0 }}>
                      Billed ${(plan.price.annual * 12).toLocaleString()}/yr
                    </p>
                    <p style={{ color: '#64748b', fontSize: 12, margin: '2px 0 0' }}>
                      Save ${((plan.price.monthly - plan.price.annual) * 12).toLocaleString()}/yr vs monthly
                    </p>
                  </div>
                )}
                {!annual && (
                  <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>
                    Or ${plan.price.annual.toLocaleString()}/mo billed annually
                  </p>
                )}
              </div>

              <div style={{ flex: 1, marginBottom: 24 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ color: plan.color, flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span style={{ color: '#cbd5e1', fontSize: 14 }}>{f}</span>
                  </div>
                ))}
              </div>

              <p style={{ color: '#475569', fontSize: 12, marginBottom: 20 }}>{plan.addons}</p>

              <Link href={plan.href} style={{ display: 'block', textAlign: 'center', padding: '14px 24px', background: plan.popular ? '#8b5cf6' : `rgba(${plan.name === 'Enterprise' ? '245,158,11' : '14,165,233'},0.12)`, border: `1px solid ${plan.popular ? '#8b5cf6' : plan.color}`, borderRadius: 12, color: plan.popular ? '#fff' : plan.color, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: 14, marginTop: 32 }}>
          14-day free trial · No credit card required · Setup in 48 hours · Cancel anytime
        </p>
      </section>

      <section style={{ background: 'rgba(7,15,36,0.6)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 900, marginBottom: 12 }}>What You'd Pay Without BoxFlow OS</h2>
            <p style={{ color: '#94a3b8', fontSize: 16 }}>The average operations stack costs 5–10x more than BoxFlow OS.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {COMPARISON.map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderRadius: 10, background: i === COMPARISON.length - 1 ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${i === COMPARISON.length - 1 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                <span style={{ color: i === COMPARISON.length - 1 ? '#f0f6ff' : '#94a3b8', fontSize: 14, fontWeight: i === COMPARISON.length - 1 ? 700 : 400 }}>{row.feature}</span>
                <span style={{ color: '#ef4444', fontWeight: 700, fontSize: i === COMPARISON.length - 1 ? 18 : 14 }}>{row.cost}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', marginTop: 8 }}>
              <span style={{ color: '#f0f6ff', fontSize: 14, fontWeight: 700 }}>BoxFlow OS Professional (monthly)</span>
              <span style={{ color: '#10b981', fontWeight: 800, fontSize: 18 }}>$1,899/mo</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderRadius: 10, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <span style={{ color: '#f0f6ff', fontSize: 14, fontWeight: 700 }}>BoxFlow OS Professional (annual)</span>
              <span style={{ color: '#10b981', fontWeight: 800, fontSize: 18 }}>$1,599/mo · $19,188/yr</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, textAlign: 'center', marginBottom: 48 }}>Common Questions</h2>
        {[
          { q: 'Is there really a free trial?', a: 'Yes — 14 days, full platform access, no credit card required. You get everything in your chosen plan from day one.' },
          { q: 'How does annual billing work?', a: 'Annual billing charges you a lower monthly rate, billed as one payment for the full year. For example, the Starter plan is $499/mo on annual — billed as $5,988 once per year instead of $599/mo. You save 17% vs monthly billing.' },
          { q: 'How long does setup take?', a: 'Most operations are fully live within 48 hours. Our team handles data migration and configuration.' },
          { q: 'Can I switch plans later?', a: 'Absolutely. Upgrade or downgrade anytime. Changes take effect on your next billing cycle.' },
          { q: 'What happens if I exceed my truck limit?', a: 'Additional trucks are billed at $15/truck/mo. No surprise charges — you will get a notification before anything is added.' },
          { q: 'Do you offer custom pricing for larger operations?', a: 'Yes. If you need more than Enterprise covers, contact us and we will build a custom plan around your operation.' },
        ].map((faq, i) => (
          <div key={i} style={{ padding: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0f6ff', marginBottom: 10 }}>{faq.q}</h3>
            <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 100px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.06))', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 24, padding: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Not Sure Which Plan Is Right?</h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 28, lineHeight: 1.6 }}>Book a 30-minute demo and we will recommend the right plan for your operation — no pressure.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>Book a Demo →</Link>
            <Link href="/roi" style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>Calculate Your Savings</Link>
          </div>
        </div>
      </section>
    </div>
  )
}