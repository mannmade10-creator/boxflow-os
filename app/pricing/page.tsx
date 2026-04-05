'use client'

import React, { useState } from 'react'

export default function PricingPage() {
  const [annual, setAnnual] = useState(true)

  const plans = [
    {
      name: 'Starter',
      desc: 'Perfect for small logistics operations',
      monthly: 699,
      annual: 599,
      color: '#3b82f6',
      savings: 1200,
      features: [
        'Up to 5 users',
        'Order Management',
        'Basic Dispatch',
        'Fleet Map (up to 10 trucks)',
        'Client Portal (2 clients)',
        'Basic Analytics',
        'Email Support',
        '1 Location',
        '14-day free trial',
      ],
      cta: 'Start Free Trial',
      popular: false,
      note: null,
    },
    {
      name: 'Professional',
      desc: 'For growing operations that need full control',
      monthly: 2199,
      annual: 1899,
      color: '#8b5cf6',
      savings: 3600,
      features: [
        'Up to 20 users',
        'Everything in Starter',
        'AI Control Panel',
        'Fleet Map (unlimited trucks)',
        'HR + Payroll Module',
        'Equipment Dashboard',
        'Full Analytics Dashboard',
        'Demo Mode',
        'Client Portal (unlimited)',
        'Priority Support',
        'Up to 3 Locations',
        'Twilio SMS Alerts',
        '1,500 onboarding included',
      ],
      cta: 'Start Free Trial',
      popular: true,
      note: 'Most chosen by mid-size logistics companies',
    },
    {
      name: 'Enterprise',
      desc: 'Full platform for large-scale operations',
      monthly: 5499,
      annual: 4499,
      color: '#22c55e',
      savings: 12000,
      features: [
        'Unlimited users',
        'Everything in Professional',
        'White Label Option',
        'Custom AI Training',
        'Dedicated Account Manager',
        'Custom Integrations',
        'API Access',
        'SLA Guarantee (99.9%)',
        'Unlimited Locations',
        'On-site Training',
        'Custom Reports',
        'Reseller License Available',
        'Onboarding included',
      ],
      cta: 'Contact Sales',
      popular: false,
      note: null,
    },
  ]

  const addons = [
    { name: 'Per-Truck Tracking', price: '$15', per: 'truck/month', desc: 'Add GPS tracking per truck beyond plan limit', color: '#0ea5e9' },
    { name: 'Client Portal Seats', price: '$49', per: 'client/month', desc: 'Additional client accounts beyond plan limit', color: '#8b5cf6' },
    { name: 'SMS Alert Package', price: '$99', per: 'month', desc: 'Twilio-powered SMS alerts for drivers and clients', color: '#f59e0b' },
    { name: 'API Access', price: '$299', per: 'month', desc: 'Full REST API access for custom integrations', color: '#22c55e' },
    { name: 'Extra Location', price: '$199', per: 'location/month', desc: 'Add warehouse, hub, or production facility', color: '#ef4444' },
    { name: 'White Label', price: '$799', per: 'month', desc: 'Your brand, your domain, your software', color: '#a855f7' },
  ]

  const competitors = [
    { name: 'McLeod Software', price: '$2,000+', features: 'Dispatch only', verdict: '❌' },
    { name: 'Samsara', price: '$1,500+', features: 'Fleet only', verdict: '❌' },
    { name: 'TMW Systems', price: '$3,000+', features: 'TMS only', verdict: '❌' },
    { name: 'BoxFlow OS', price: '$1,899', features: 'Everything combined', verdict: '✅', highlight: true },
  ]

  const faqs = [
    { q: 'Is there a free trial?', a: 'Yes! All plans include a 14-day free trial with no credit card required.' },
    { q: 'Can I change plans later?', a: 'Absolutely. Upgrade or downgrade at any time. Changes take effect immediately.' },
    { q: 'What is a location?', a: 'A location is a physical facility — warehouse, dispatch hub, or production plant.' },
    { q: 'Is there a setup fee?', a: 'Professional includes a $1,500 onboarding package. Enterprise onboarding is fully included.' },
    { q: 'Do you offer custom pricing?', a: 'Yes. For 50+ trucks or special requirements, contact our sales team for a custom quote.' },
    { q: 'Is my data secure?', a: 'All data is encrypted at rest and in transit. We use enterprise-grade Supabase infrastructure.' },
    { q: 'What makes you different?', a: 'We combine dispatch, fleet, production, HR, AI, and client portals in ONE platform. Competitors charge $2K+ per module.' },
    { q: 'Can I white label this?', a: 'Yes! Enterprise and add-on white label lets you resell BoxFlow OS under your own brand.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(37,99,235,0.15), transparent 60%), linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif' }}>

      <div style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 40, height: 40 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>BoxFlow OS</span>
        </a>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Pricing</div>
        <h1 style={{ fontSize: 56, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>One Platform.<br />Every Operation.</h1>
        <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 640, margin: '0 auto 12px' }}>
          Dispatch + Fleet + Production + AI + HR + Client Portal — all in one platform.
          Competitors charge $2,000+ per module. We bundle everything.
        </p>
        <p style={{ color: '#22c55e', fontWeight: 800, fontSize: 15, marginBottom: 32 }}>✓ 14-day free trial &nbsp; ✓ No credit card required &nbsp; ✓ Cancel anytime</p>

        <div style={{ display: 'inline-flex', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 14, padding: 4, gap: 4, marginBottom: 48 }}>
          <button onClick={() => setAnnual(false)} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: !annual ? '#2563eb' : 'transparent', color: !annual ? '#fff' : '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Monthly</button>
          <button onClick={() => setAnnual(true)} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: annual ? '#2563eb' : 'transparent', color: annual ? '#fff' : '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            Annual <span style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>Save 20%</span>
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {plans.map(plan => (
          <div key={plan.name} style={{ position: 'relative', background: plan.popular ? 'rgba(139,92,246,0.08)' : 'rgba(15,23,42,0.92)', border: plan.popular ? '2px solid rgba(139,92,246,0.5)' : '1px solid rgba(148,163,184,0.14)', borderRadius: 28, padding: 32, display: 'flex', flexDirection: 'column' }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#fff', padding: '6px 20px', borderRadius: 999, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>⭐ Most Popular</div>
            )}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: plan.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20 }}>{plan.desc}</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1 }}>${(annual ? plan.annual : plan.monthly).toLocaleString()}</span>
                <span style={{ color: '#64748b', marginBottom: 10, fontSize: 15 }}>/mo</span>
              </div>
              {annual && <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>Billed annually — save ${plan.savings.toLocaleString()}/yr</div>}
              {plan.note && <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 700, marginTop: 6 }}>💡 {plan.note}</div>}
            </div>

            <a href="/login" style={{ display: 'block', textAlign: 'center', padding: '15px', background: plan.popular ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgba(2,6,23,0.6)', border: plan.popular ? 'none' : '1px solid ' + plan.color + '60', borderRadius: 14, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 15, marginBottom: 28, boxShadow: plan.popular ? '0 0 30px rgba(124,58,237,0.3)' : 'none' }}>
              {plan.cta} →
            </a>

            <div style={{ borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 24, flex: 1 }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>What's included</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: plan.color + '20', border: '1px solid ' + plan.color + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 10, color: plan.color, fontWeight: 900 }}>✓</div>
                    <span style={{ color: '#cbd5e1', fontSize: 13 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 12px' }}>How We Compare</h2>
          <p style={{ color: '#94a3b8' }}>Other platforms charge per module. We give you everything.</p>
        </div>
        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(2,6,23,0.5)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#94a3b8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Platform</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#94a3b8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Starting Price</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', color: '#94a3b8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>What You Get</th>
                <th style={{ padding: '16px 24px', textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>All-in-One</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map(c => (
                <tr key={c.name} style={{ borderTop: '1px solid rgba(148,163,184,0.1)', background: c.highlight ? 'rgba(37,99,235,0.08)' : 'transparent' }}>
                  <td style={{ padding: '16px 24px', fontWeight: c.highlight ? 900 : 700, color: c.highlight ? '#60a5fa' : '#cbd5e1', fontSize: 15 }}>{c.name}{c.highlight ? ' ⭐' : ''}</td>
                  <td style={{ padding: '16px 24px', color: c.highlight ? '#22c55e' : '#f59e0b', fontWeight: 800, fontSize: 15 }}>{c.price}/mo</td>
                  <td style={{ padding: '16px 24px', color: c.highlight ? '#cbd5e1' : '#64748b', fontSize: 14 }}>{c.features}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center', fontSize: 20 }}>{c.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 12px' }}>Power-Ups & Add-Ons</h2>
          <p style={{ color: '#94a3b8' }}>Customize your plan with exactly what you need</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {addons.map(addon => (
            <div key={addon.name} style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderLeft: '3px solid ' + addon.color, borderRadius: 18, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: 15 }}>{addon.name}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: addon.color, fontWeight: 900, fontSize: 18 }}>{addon.price}</div>
                  <div style={{ color: '#64748b', fontSize: 11 }}>/{addon.per}</div>
                </div>
              </div>
              <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5 }}>{addon.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 40px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 28, padding: '48px 40px' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 12px' }}>Ready to replace 4 tools with 1?</h2>
          <p style={{ color: '#94a3b8', fontSize: 16, margin: '0 0 28px' }}>Join logistics companies saving $3,000+/month by switching to BoxFlow OS.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/login" style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15, boxShadow: '0 0 30px rgba(37,99,235,0.3)' }}>Start Free Trial →</a>
            <a href="mailto:sales@boxflowos.com" style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>Contact Sales</a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, textAlign: 'center', marginBottom: 40 }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {faqs.map(faq => (
            <div key={faq.q} style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 18, padding: 24 }}>
              <div style={{ fontWeight: 800, color: '#fff', marginBottom: 8, fontSize: 15 }}>{faq.q}</div>
              <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid rgba(148,163,184,0.1)', color: '#334155', fontSize: 13 }}>
        © 2026 BoxFlow OS. All rights reserved. Enterprise Operations Suite.
      </div>
    </div>
  )
}