'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ADDON_INFO, PLAN_INFO, type AddonKey } from '@/lib/usePlan'

const BLUE   = '#4f8ef7'
const PURPLE = '#a855f7'
const AMBER  = '#f59e0b'
const GREEN  = '#22c55e'

// Real Stripe payment links
const STRIPE_LINKS: Record<string, string> = {
  landlord:            'https://buy.stripe.com/3cIaEW3XQe4YdUp76UefC07',
  ach_payments:        'https://buy.stripe.com/cNicN49iaf92eYtgHuefC06',
  income_verification: 'https://buy.stripe.com/8x2fZggKC0e8dUp8aYefC05',
  gps_tracker:         'https://buy.stripe.com/eVqcN4fGy8KEg2x2QEefC04',
  community_board:     'https://buy.stripe.com/eVq3cuame2mg6rX9f2efC00',
  accounting:          'https://buy.stripe.com/3cIaEW1PI2mg03zdviefC03',
  payroll:             'https://buy.stripe.com/fZu6oGbqi0e87w12QEefC02',
  analytics:           'https://buy.stripe.com/bJe6oG9ia6Cw2bHezmefC01',
}

const LANDLORD_FEATURES = [
  '✓ Up to 10 units',
  '✓ Tenant portal (billing, lease, maintenance)',
  '✓ PropFlow Tenant mobile app',
  '✓ Maintenance request tracking',
  '✓ Tenant notices and notifications',
  '✓ 1 property manager user',
  '✓ Email support',
]

const PROFESSIONAL_FEATURES = [
  '✓ Up to 100 units',
  '✓ Everything in Landlord',
  '✓ Business Analytics dashboard',
  '✓ ACH Payments (free bank transfers)',
  '✓ Income Verification with doc uploads',
  '✓ Accounting & Insights (P&L, NOI)',
  '✓ Payroll & HR (pay stubs, 401k, taxes)',
  '✓ GPS Bus Tracker',
  '✓ Community Board',
  '✓ 5 staff user seats',
  '✓ Priority support',
]

const ENTERPRISE_FEATURES = [
  '✓ Unlimited units',
  '✓ Everything in Professional',
  '✓ White-label tenant app with your branding',
  '✓ QuickBooks integration',
  '✓ Unlimited user seats',
  '✓ Multi-property portfolio dashboard',
  '✓ Dedicated account manager',
  '✓ Custom onboarding & training',
  '✓ SLA-backed uptime guarantee',
]

const LANDLORD_ADDONS: AddonKey[] = [
  'ach_payments', 'income_verification', 'gps_tracker',
  'community_board', 'accounting', 'payroll', 'analytics'
]

export default function PlansPage() {
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly')
  const discount = billing === 'annual' ? 0.8 : 1

  function getPrice(base: number) {
    return Math.round(base * discount)
  }

  const addonTotal = LANDLORD_ADDONS.reduce((a, k) => a + ADDON_INFO[k].price, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif', paddingBottom: 80 }}>
      <style>{`.tab-btn{transition:all 0.15s;cursor:pointer;border:none;font-family:system-ui} .card-hover{transition:transform 0.2s,border-color 0.2s} .card-hover:hover{transform:translateY(-4px)}`}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(79,142,247,0.12)', background: '#070f1f', flexWrap: 'wrap', gap: 10 }}>
        <Link href="/propflow/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/assets/logo.png" alt="PropFlow" style={{ height: 36 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: BLUE }}>PropFlow OS</div>
            <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>Plans & Pricing</div>
          </div>
        </Link>
        <Link href="/propflow/dashboard" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>← Back to Dashboard</Link>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 20px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>PropFlow OS Pricing</div>
          <h1 style={{ fontSize: 42, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 14 }}>
            Simple pricing for<br />every property size
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', maxWidth: 520, margin: '0 auto 28px' }}>
            Start with the Landlord plan at $89/mo and add features as you grow. Or get everything with Professional.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', background: '#070f1f', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 12, padding: 4, gap: 4 }}>
            {(['monthly', 'annual'] as const).map(b => (
              <button key={b} className="tab-btn" onClick={() => setBilling(b)}
                style={{ padding: '8px 20px', borderRadius: 9, background: billing === b ? BLUE : 'transparent', border: 'none', color: billing === b ? '#fff' : '#475569', fontWeight: 700, fontSize: 13 }}>
                {b === 'monthly' ? 'Monthly' : 'Annual (Save 20%)'}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, marginBottom: 64 }}>

          {/* LANDLORD */}
          <div className="card-hover" style={{ background: '#070f1f', border: `2px solid rgba(79,142,247,0.25)`, borderRadius: 20, padding: 32 }}>
            <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>🏠 Landlord</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: '#fff' }}>${getPrice(89)}</span>
              <span style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>/month</span>
            </div>
            {billing === 'annual' && <div style={{ fontSize: 12, color: GREEN, marginBottom: 6 }}>Save ${(89 - getPrice(89)) * 12}/year</div>}
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>
              Perfect for individual landlords managing a few homes or small buildings.
            </div>
            <div style={{ fontSize: 11, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>What's included</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {LANDLORD_FEATURES.map((f, i) => (
                <div key={i} style={{ fontSize: 13, color: '#94a3b8' }}>{f}</div>
              ))}
            </div>
            <a href={STRIPE_LINKS.landlord}
              style={{ display: 'block', textAlign: 'center', padding: '13px', background: 'rgba(79,142,247,0.12)', border: `1px solid rgba(79,142,247,0.4)`, borderRadius: 12, color: BLUE, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
              Get Started — ${getPrice(89)}/mo
            </a>
          </div>

          {/* PROFESSIONAL */}
          <div className="card-hover" style={{ background: '#0a0a1a', border: `2px solid ${PURPLE}`, borderRadius: 20, padding: 32, position: 'relative', transform: 'scale(1.02)' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#6b21a8,#a855f7)', borderRadius: 20, padding: '5px 18px', fontSize: 11, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
              ⭐ MOST POPULAR
            </div>
            <div style={{ fontSize: 11, color: PURPLE, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginTop: 8 }}>🏢 Professional</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: '#fff' }}>${getPrice(249)}</span>
              <span style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>/month</span>
            </div>
            {billing === 'annual' && <div style={{ fontSize: 12, color: GREEN, marginBottom: 6 }}>Save ${(249 - getPrice(249)) * 12}/year</div>}
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>
              Full-featured platform for property management companies. All features included.
            </div>
            <div style={{ fontSize: 11, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Everything in Landlord, plus</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {PROFESSIONAL_FEATURES.map((f, i) => (
                <div key={i} style={{ fontSize: 13, color: '#94a3b8' }}>{f}</div>
              ))}
            </div>
            <a href="mailto:kenneth.covington@boxflowos.com?subject=PropFlow Professional Plan"
              style={{ display: 'block', textAlign: 'center', padding: '13px', background: 'linear-gradient(135deg,#6b21a8,#a855f7)', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
              Contact Us — ${getPrice(249)}/mo
            </a>
          </div>

          {/* ENTERPRISE */}
          <div className="card-hover" style={{ background: '#070f1f', border: `2px solid ${AMBER}30`, borderRadius: 20, padding: 32 }}>
            <div style={{ fontSize: 11, color: AMBER, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>🏙 Enterprise</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: '#fff' }}>Custom</span>
            </div>
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>
              For large portfolios, REITs, and enterprise property management groups.
            </div>
            <div style={{ fontSize: 11, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Everything in Professional, plus</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {ENTERPRISE_FEATURES.map((f, i) => (
                <div key={i} style={{ fontSize: 13, color: '#94a3b8' }}>{f}</div>
              ))}
            </div>
            <a href="mailto:kenneth.covington@boxflowos.com?subject=PropFlow Enterprise Inquiry"
              style={{ display: 'block', textAlign: 'center', padding: '13px', background: `rgba(245,158,11,0.1)`, border: `1px solid ${AMBER}40`, borderRadius: 12, color: AMBER, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
              Contact Sales →
            </a>
          </div>
        </div>

        {/* LANDLORD ADD-ONS */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 11, color: BLUE, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>Landlord Plan Add-Ons</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 10 }}>Build your own plan</h2>
            <p style={{ fontSize: 14, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              Start at $89/mo and add only the features you need. Each add-on activates instantly after payment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {LANDLORD_ADDONS.map(key => {
              const addon = ADDON_INFO[key]
              return (
                <div key={key} className="card-hover" style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.12)', borderRadius: 16, padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 28 }}>{addon.icon}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>+${addon.price}</div>
                      <div style={{ fontSize: 10, color: '#475569' }}>/month</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#f0f6ff' }}>{addon.label}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, flex: 1 }}>{addon.description}</div>
                  <a href={STRIPE_LINKS[key]}
                    style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: 10, color: BLUE, fontWeight: 700, fontSize: 13, textDecoration: 'none', marginTop: 4 }}>
                    Add for +${addon.price}/mo →
                  </a>
                </div>
              )
            })}
          </div>

          {/* Total calculator */}
          <div style={{ marginTop: 24, padding: '20px 24px', background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 4 }}>💡 Landlord plan with all add-ons</div>
              <div style={{ fontSize: 12, color: '#475569' }}>
                $89 base + ${addonTotal} add-ons = ${89 + addonTotal}/mo total
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 249 - (89 + addonTotal) > 0 ? GREEN : '#ef4444', fontWeight: 700 }}>
                {249 - (89 + addonTotal) > 0
                  ? `Save $${249 - (89 + addonTotal)}/mo by upgrading to Professional`
                  : `Professional at $249/mo is the better deal`}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 28 }}>Full Feature Comparison</h2>
          <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 120px', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Feature</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, textAlign: 'center' }}>Landlord<br /><span style={{ fontSize: 11, color: '#334155' }}>$89/mo</span></div>
              <div style={{ fontSize: 12, fontWeight: 700, color: PURPLE, textAlign: 'center' }}>Professional<br /><span style={{ fontSize: 11, color: '#334155' }}>$249/mo</span></div>
              <div style={{ fontSize: 12, fontWeight: 700, color: AMBER, textAlign: 'center' }}>Enterprise<br /><span style={{ fontSize: 11, color: '#334155' }}>Custom</span></div>
            </div>
            {[
              ['Units',               'Up to 10',    'Up to 100',    'Unlimited'],
              ['User Seats',          '1 user',      '5 users',      'Unlimited'],
              ['Tenant Portal',       '✓',           '✓',            '✓'],
              ['Tenant Mobile App',   '✓',           '✓',            'White-label'],
              ['Maintenance Tracking','✓',           '✓',            '✓'],
              ['Billing Statements',  '✓',           '✓',            '✓'],
              ['ACH Payments',        '+$19/mo',     '✓ Included',   '✓ Included'],
              ['Income Verification', '+$14/mo',     '✓ Included',   '✓ Included'],
              ['Accounting & P&L',    '+$24/mo',     '✓ Included',   '✓ Included'],
              ['Payroll & HR',        '+$39/mo',     '✓ Included',   '✓ Included'],
              ['Business Analytics',  '+$19/mo',     '✓ Included',   '✓ Included'],
              ['GPS Bus Tracker',     '+$9/mo',      '✓ Included',   '✓ Included'],
              ['Community Board',     '+$9/mo',      '✓ Included',   '✓ Included'],
              ['QuickBooks Sync',     '—',           'Coming soon',  '✓ Included'],
              ['White-label App',     '—',           '—',            '✓ Included'],
              ['Support',             'Email',       'Priority',     'Dedicated'],
            ].map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 120px', padding: '12px 24px', borderBottom: i < 15 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>{row[0]}</div>
                <div style={{ textAlign: 'center', fontSize: 12, color: row[1].startsWith('+') ? BLUE : row[1] === '—' ? '#1e3a5f' : GREEN, fontWeight: row[1] === '✓' || row[1].startsWith('+') ? 700 : 400 }}>{row[1]}</div>
                <div style={{ textAlign: 'center', fontSize: 12, color: row[2].includes('Included') ? GREEN : row[2] === '—' ? '#1e3a5f' : '#94a3b8', fontWeight: row[2].includes('Included') ? 700 : 400 }}>{row[2]}</div>
                <div style={{ textAlign: 'center', fontSize: 12, color: row[3].includes('Included') || ['Unlimited','White-label','Dedicated'].includes(row[3]) ? GREEN : '#94a3b8', fontWeight: 600 }}>{row[3]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 28 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
            {[
              { q: 'Can I change plans anytime?',       a: 'Yes — upgrade or downgrade anytime. Upgrades take effect immediately. Downgrades take effect at the end of your billing period.' },
              { q: 'Do my tenants pay anything?',       a: 'No. The PropFlow Tenant app is completely free for tenants. You pay one monthly fee that covers everything.' },
              { q: 'How do add-ons work?',              a: 'Start at $89/mo and add features individually. Each add-on activates instantly after payment through Stripe.' },
              { q: 'What happens if I exceed my unit limit?', a: 'You will be prompted to upgrade. We never cut off your access — you get 7 days to upgrade.' },
              { q: 'Is there a setup fee?',             a: 'No setup fees, no contracts. Month-to-month on all plans. Annual plans get 20% off and are billed upfront.' },
              { q: 'When will QuickBooks be available?',a: 'QuickBooks sync is coming in Q3 2026. Enterprise customers get early access. All customers will be notified at launch.' },
            ].map((faq, i) => (
              <div key={i} style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '48px 32px', background: 'linear-gradient(135deg,rgba(29,78,216,0.12),rgba(168,85,247,0.08))', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 12 }}>Ready to get started?</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
            Join property managers and landlords who use PropFlow OS to run their properties better.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={STRIPE_LINKS.landlord}
              style={{ padding: '14px 28px', background: BLUE, borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
              Start Landlord Plan — $89/mo
            </a>
            <a href="mailto:kenneth.covington@boxflowos.com?subject=PropFlow Professional Plan"
              style={{ padding: '14px 28px', background: 'linear-gradient(135deg,#6b21a8,#a855f7)', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
              Get Professional — $249/mo
            </a>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: '#334155' }}>
            No setup fees · No contracts · Cancel anytime · Instant activation
          </div>
        </div>
      </div>
    </div>
  )
}