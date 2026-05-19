'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const PLANS = {
  boxflow: [
    { id: 'starter',      name: 'Starter',      monthly: 299,  annual: 249,  desc: 'Up to 10 trucks', color: '#2563EB', features: ['Fleet GPS Tracking','Order Management','Driver App','Basic Reporting','Email Support'] },
    { id: 'professional', name: 'Professional', monthly: 499,  annual: 415,  desc: 'Up to 50 trucks', color: '#2563EB', popular: true, features: ['Everything in Starter','AI Route Optimization','Production Board','HR & Payroll','Advanced Analytics','Priority Support'] },
    { id: 'enterprise',   name: 'Enterprise',   monthly: 999,  annual: 829,  desc: 'Unlimited trucks', color: '#2563EB', features: ['Everything in Professional','Unlimited vehicles','White label option','Custom integrations','Dedicated account manager','4hr SLA'] },
  ],
  medflow: [
    { id: 'starter',      name: 'Starter',      monthly: 499,  annual: 415,  desc: 'Up to 2 locations', color: '#14D2C2', features: ['Cold Chain Monitoring','Drug Inventory','Basic Compliance Docs','Email Support'] },
    { id: 'professional', name: 'Professional', monthly: 999,  annual: 829,  desc: 'Up to 10 locations', color: '#14D2C2', popular: true, features: ['Everything in Starter','USP 797/800 Compliance','Automated Reports','Supplier Management','Priority Support'] },
    { id: 'enterprise',   name: 'Enterprise',   monthly: 1999, annual: 1659, desc: 'Unlimited locations', color: '#14D2C2', features: ['Everything in Professional','Custom compliance workflows','API access','Dedicated CSM','4hr SLA'] },
  ],
  propflow: [
    { id: 'starter',      name: 'Starter',      monthly: 199,  annual: 165,  desc: 'Up to 50 units', color: '#a855f7', features: ['Unit & Tenant Management','Maintenance Tracking','Rent Collection','Tenant Portal','Basic Reporting'] },
    { id: 'professional', name: 'Professional', monthly: 499,  annual: 415,  desc: 'Up to 200 units', color: '#a855f7', popular: true, features: ['Everything in Starter','GPS Staff Tracker','AI Auto-Dispatch','Finance & Payroll','Community App','Applications & Leasing'] },
    { id: 'enterprise',   name: 'Enterprise',   monthly: 999,  annual: 829,  desc: 'Unlimited units', color: '#a855f7', features: ['Everything in Professional','Unlimited properties','White label option','Custom integrations','Dedicated support','SLA guarantee'] },
  ],
  classflow: [
    { id: 'starter',      name: 'Starter',      monthly: 99,   annual: 82,   desc: 'Up to 30 students', color: '#f59e0b', features: ['AI Lesson Creation','Student Management','Multi-Language Support','Basic Analytics'] },
    { id: 'professional', name: 'Professional', monthly: 199,  annual: 165,  desc: 'Up to 200 students', color: '#f59e0b', popular: true, features: ['Everything in Starter','Adaptive Learning','Parent Portal','Advanced Reports','Priority Support'] },
    { id: 'enterprise',   name: 'Enterprise',   monthly: 499,  annual: 415,  desc: 'Unlimited students', color: '#f59e0b', features: ['Everything in Professional','District-wide deployment','Custom branding','API access','Dedicated CSM'] },
  ],
}

const PLATFORM_META: Record<string, { name: string; color: string; loginHref: string }> = {
  boxflow:   { name: 'BoxFlow OS',   color: '#2563EB', loginHref: '/login' },
  medflow:   { name: 'MedFlow OS',   color: '#14D2C2', loginHref: '/medflow-login' },
  propflow:  { name: 'PropFlow OS',  color: '#a855f7', loginHref: '/propflow-login' },
  classflow: { name: 'ClassFlow AI', color: '#f59e0b', loginHref: '/classflow-login' },
}

export default function BillingPage() {
  const [platform, setPlatform] = useState('boxflow')
  const [annual,   setAnnual]   = useState(false)
  const [loading,  setLoading]  = useState<string | null>(null)
  const [user,     setUser]     = useState<any>(null)
  const [sub,      setSub]      = useState<any>(null)

  const plans     = PLANS[platform as keyof typeof PLANS]
  const platMeta  = PLATFORM_META[platform]

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user)
        // Load existing subscription
        const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        fetch(`${url}/rest/v1/subscriptions?platform=eq.${platform}&order=created_at.desc&limit=1`, {
          headers: { apikey: key, Authorization: `Bearer ${key}` }
        }).then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setSub(d[0]) })
      }
    })
  }, [platform])

  async function startCheckout(planId: string) {
    setLoading(planId)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const res = await fetch('https://irifwmikcugfxpfhyfrm.supabase.co/functions/v1/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          plan: planId,
          billing: annual ? 'annual' : 'monthly',
          email: user?.email || '',
          name:  user?.user_metadata?.full_name || '',
          user_id: user?.id || '',
          success_url: `${window.location.origin}/billing/success`,
          cancel_url:  `${window.location.origin}/billing`,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Checkout error: ' + (data.error || 'Unknown error'))
      }
    } catch(e: any) {
      alert('Error: ' + e.message)
    }
    setLoading(null)
  }

  function statusColor(s: string) {
    if (s === 'active') return '#22c55e'
    if (s === 'trial')  return '#14D2C2'
    if (s === 'past_due') return '#ef4444'
    return '#475569'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#020818 0%,#070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>
      <style>{`
        .plan-card{transition:transform 0.2s,box-shadow 0.2s}
        .plan-card:hover{transform:translateY(-4px)}
        .plat-btn{transition:all 0.15s;cursor:pointer;border:none;font-family:system-ui}
      `}</style>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 48px', borderBottom:'1px solid rgba(20,210,194,0.08)', position:'sticky', top:0, background:'rgba(2,8,24,0.95)', backdropFilter:'blur(12px)', zIndex:100, flexWrap:'wrap', gap:12 }}>
        <Link href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(135deg,#0A6E68,#14D2C2)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, color:'#fff' }}>M</div>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:'#fff' }}>Made Technologies</div>
            <div style={{ fontSize:8, color:'#14D2C2', letterSpacing:2, textTransform:'uppercase' }}>Billing & Plans</div>
          </div>
        </Link>
        <div style={{ display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
          {user && <span style={{ fontSize:13, color:'#64748b' }}>{user.email}</span>}
          <Link href="/support" style={{ color:'#64748b', fontSize:13, textDecoration:'none' }}>Support</Link>
          <Link href="/" style={{ padding:'8px 20px', background:'linear-gradient(135deg,#0A6E68,#14D2C2)', borderRadius:10, color:'#fff', textDecoration:'none', fontSize:13, fontWeight:700 }}>Dashboard</Link>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'56px 24px 80px' }}>

        {/* CURRENT SUBSCRIPTION */}
        {sub && (
          <div style={{ background:'rgba(12,26,56,0.9)', border:`1px solid ${statusColor(sub.status)}30`, borderRadius:16, padding:'20px 28px', marginBottom:40, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:12, color:'#475569', marginBottom:4, textTransform:'uppercase', letterSpacing:1 }}>Current Subscription</div>
              <div style={{ fontSize:18, fontWeight:800, color:'#f0f6ff' }}>{sub.platform} — {sub.plan} — {sub.billing_cycle}</div>
              {sub.trial_ends_at && sub.status === 'trial' && (
                <div style={{ fontSize:12, color:'#14D2C2', marginTop:4 }}>Trial ends {new Date(sub.trial_ends_at).toLocaleDateString()}</div>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:13, fontWeight:700, color:statusColor(sub.status), background:`${statusColor(sub.status)}14`, border:`1px solid ${statusColor(sub.status)}30`, borderRadius:20, padding:'4px 14px', textTransform:'uppercase', letterSpacing:0.5 }}>
                {sub.status}
              </span>
              <a href="mailto:billing@boxflowos.com" style={{ fontSize:12, color:'#64748b', textDecoration:'none' }}>Manage →</a>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:11, color:'#14D2C2', letterSpacing:3, textTransform:'uppercase', fontWeight:700, marginBottom:14 }}>Pricing</div>
          <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:900, margin:'0 0 14px', letterSpacing:-1 }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ color:'#64748b', fontSize:16, maxWidth:500, margin:'0 auto 28px', lineHeight:1.7 }}>
            14-day free trial on all plans. No credit card required to start. Cancel anytime.
          </p>

          {/* BILLING TOGGLE */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(12,26,56,0.9)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:100, padding:4, marginBottom:28 }}>
            <button onClick={() => setAnnual(false)} className="plat-btn"
              style={{ padding:'8px 22px', borderRadius:100, background:!annual?'#14D2C2':'transparent', color:!annual?'#000':'#475569', fontWeight:700, fontSize:13 }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)} className="plat-btn"
              style={{ padding:'8px 22px', borderRadius:100, background:annual?'#14D2C2':'transparent', color:annual?'#000':'#475569', fontWeight:700, fontSize:13, display:'flex', alignItems:'center', gap:8 }}>
              Annual
              <span style={{ background:'#22c55e', color:'#fff', fontSize:10, fontWeight:800, padding:'1px 8px', borderRadius:100 }}>SAVE 17%</span>
            </button>
          </div>
        </div>

        {/* PLATFORM TABS */}
        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:40, flexWrap:'wrap' }}>
          {Object.entries(PLATFORM_META).map(([id, meta]) => (
            <button key={id} className="plat-btn" onClick={() => setPlatform(id)}
              style={{ padding:'10px 24px', background: platform===id ? meta.color : 'rgba(12,26,56,0.8)', border:`1px solid ${platform===id ? meta.color : 'rgba(255,255,255,0.08)'}`, borderRadius:100, color: platform===id ? '#fff' : '#64748b', fontWeight:700, fontSize:13 }}>
              {meta.name}
            </button>
          ))}
        </div>

        {/* PLAN CARDS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20, marginBottom:48 }}>
          {plans.map(plan => {
            const price = annual ? plan.annual : plan.monthly
            const annualTotal = plan.annual * 12
            const monthlySavings = (plan.monthly - plan.annual) * 12
            return (
              <div key={plan.id} className="plan-card"
                style={{ background: plan.popular ? `rgba(${plan.color === '#2563EB' ? '37,99,235' : plan.color === '#14D2C2' ? '20,210,194' : plan.color === '#a855f7' ? '168,85,247' : '245,158,11'},0.06)` : 'rgba(12,26,56,0.8)', border:`2px solid ${plan.popular ? plan.color : plan.color + '25'}`, borderRadius:22, padding:30, position:'relative', display:'flex', flexDirection:'column' }}>
                {plan.popular && (
                  <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:plan.color, color:'#fff', fontSize:10, fontWeight:800, padding:'4px 18px', borderRadius:100, letterSpacing:'0.08em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize:20, fontWeight:900, color:plan.color, marginBottom:4 }}>{plan.name}</h3>
                <p style={{ color:'#475569', fontSize:13, marginBottom:16 }}>{plan.desc}</p>
                <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom: annual ? 6 : 20 }}>
                  <span style={{ fontSize:48, fontWeight:900, color:'#fff', lineHeight:1 }}>${price}</span>
                  <span style={{ color:'#475569', fontSize:14, marginBottom:8 }}>/mo</span>
                </div>
                {annual && (
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:12, color:'#22c55e', fontWeight:600 }}>Billed ${annualTotal.toLocaleString()}/yr</div>
                    <div style={{ fontSize:11, color:'#475569' }}>Save ${monthlySavings.toLocaleString()}/yr vs monthly</div>
                  </div>
                )}
                <div style={{ flex:1, marginBottom:24 }}>
                  {plan.features.map((f,i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                      <span style={{ color:plan.color, flexShrink:0, marginTop:2, fontWeight:700, fontSize:14 }}>+</span>
                      <span style={{ color:'#94a3b8', fontSize:13 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => startCheckout(plan.id)} disabled={loading === plan.id}
                  style={{ width:'100%', padding:'14px', background: plan.popular ? plan.color : `${plan.color}18`, border:`1px solid ${plan.color}`, borderRadius:12, color: plan.popular ? '#fff' : plan.color, fontWeight:800, fontSize:14, cursor:'pointer', fontFamily:'system-ui', opacity: loading === plan.id ? 0.7 : 1 }}>
                  {loading === plan.id ? 'Redirecting...' : 'Start Free Trial'}
                </button>
                <p style={{ textAlign:'center', fontSize:11, color:'#334155', marginTop:10 }}>14-day free trial · No credit card required</p>
              </div>
            )
          })}
        </div>

        {/* COMPARISON TABLE */}
        <div style={{ background:'rgba(12,26,56,0.8)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, overflow:'hidden', marginBottom:48 }}>
          <div style={{ padding:'20px 28px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize:18, fontWeight:800 }}>What's included — {platMeta.name}</h2>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <th style={{ padding:'14px 24px', textAlign:'left', color:'#475569', fontWeight:700 }}>Feature</th>
                  {plans.map(p => <th key={p.id} style={{ padding:'14px 20px', textAlign:'center', color:p.color, fontWeight:800 }}>{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  ['14-day free trial',          true, true, true],
                  ['Core platform access',        true, true, true],
                  ['Mobile app',                  true, true, true],
                  ['Email support',               true, true, true],
                  ['Advanced features',           false, true, true],
                  ['AI automation',               false, true, true],
                  ['Priority support (24hr SLA)', false, true, true],
                  ['Unlimited capacity',          false, false, true],
                  ['White label option',          false, false, true],
                  ['Dedicated account manager',   false, false, true],
                  ['4-hour SLA',                  false, false, true],
                  ['Custom integrations',         false, false, true],
                ].map(([feature, s, p, e], i) => (
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', background: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding:'12px 24px', color:'#94a3b8' }}>{feature}</td>
                    {[s, p, e].map((v, j) => (
                      <td key={j} style={{ padding:'12px 20px', textAlign:'center', color: v ? '#22c55e' : '#334155', fontWeight:700, fontSize:16 }}>
                        {v ? '+' : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:20, marginBottom:48 }}>
          {[
            { q:'Do I need a credit card to start?', a:'No. Your 14-day free trial starts immediately with no payment required. You only enter payment details when you decide to subscribe.' },
            { q:'Can I switch plans anytime?', a:'Yes. Upgrade or downgrade at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the next billing cycle.' },
            { q:'What happens after the trial?', a:'After 14 days your trial ends. If you have added a payment method your subscription starts automatically. If not, your account is paused until you subscribe.' },
            { q:'Is there an annual discount?', a:'Yes — annual billing saves 17% compared to monthly. Billed once per year. You can switch from monthly to annual at any time.' },
            { q:'How do I cancel?', a:'Email billing@boxflowos.com anytime to cancel. Your access continues until the end of your current billing period. No cancellation fees.' },
            { q:'Do you offer refunds?', a:'Annual subscriptions cancelled within 30 days of initial purchase are eligible for a full refund. See our full refund policy at boxflowos.com/refund.' },
          ].map((item,i) => (
            <div key={i} style={{ background:'rgba(12,26,56,0.8)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'20px 22px' }}>
              <h3 style={{ fontSize:14, fontWeight:800, marginBottom:8, color:'#f0f6ff' }}>{item.q}</h3>
              <p style={{ color:'#64748b', fontSize:13, lineHeight:1.7, margin:0 }}>{item.a}</p>
            </div>
          ))}
        </div>

        {/* ENTERPRISE CTA */}
        <div style={{ background:'linear-gradient(135deg,rgba(20,210,194,0.08),rgba(37,99,235,0.06))', border:'1px solid rgba(20,210,194,0.15)', borderRadius:20, padding:'44px 40px', textAlign:'center' }}>
          <h2 style={{ fontSize:28, fontWeight:900, marginBottom:12 }}>Need a custom plan?</h2>
          <p style={{ color:'#64748b', fontSize:15, marginBottom:28, lineHeight:1.7, maxWidth:480, margin:'0 auto 28px' }}>
            Enterprise teams with specific requirements get custom pricing, dedicated support, SLA guarantees, and white label options.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/contact" style={{ padding:'13px 28px', background:'linear-gradient(135deg,#0A6E68,#14D2C2)', borderRadius:12, color:'#fff', textDecoration:'none', fontWeight:700, fontSize:14 }}>Talk to Sales</Link>
            <Link href="/demo"    style={{ padding:'13px 28px', background:'rgba(20,210,194,0.08)', border:'1px solid rgba(20,210,194,0.2)', borderRadius:12, color:'#14D2C2', textDecoration:'none', fontWeight:700, fontSize:14 }}>Book a Demo</Link>
          </div>
        </div>
      </div>

      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'24px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div style={{ fontSize:12, color:'#334155' }}>© 2026 Made Technologies Inc · Secure payments via Stripe</div>
        <div style={{ display:'flex', gap:20 }}>
          {[['Privacy','/privacy'],['Terms','/terms'],['Refund','/refund'],['Support','/support']].map(([l,h]) => (
            <Link key={h} href={h} style={{ color:'#334155', fontSize:12, textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}