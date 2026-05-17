'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 199, annual: 165 },
    desc: 'Up to 50 units',
    color: '#4f8ef7',
    features: ['Unit & Tenant Management', 'Maintenance Tracking', 'Rent Collection', 'Tenant Portal', 'Basic Reporting'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: { monthly: 499, annual: 415 },
    desc: 'Up to 200 units',
    color: '#a855f7',
    popular: true,
    features: ['Everything in Starter', 'GPS Staff Tracker', 'AI Auto-Dispatch', 'Finance & Payroll', 'Community App', 'Applications & Leasing'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 999, annual: 829 },
    desc: 'Unlimited units',
    color: '#22c55e',
    features: ['Everything in Professional', 'Unlimited properties', 'White label option', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
  },
]

export default function PropFlowLogin() {
  const router = useRouter()
  const [tab,      setTab]      = useState<'signin'|'signup'>('signin')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [plan,     setPlan]     = useState('professional')
  const [annual,   setAnnual]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [message,  setMessage]  = useState('')
  const [step,     setStep]     = useState<'plan'|'account'>('plan')

  async function signIn() {
    setLoading(true); setMessage('')
    await supabase.auth.signOut()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMessage('Sign in failed: ' + error.message); setLoading(false); return }
    router.push('/propflow/dashboard')
  }

  async function signUp() {
    if (!name || !email || !password) { setMessage('Please fill in all fields.'); return }
    setLoading(true); setMessage('')
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, plan, billing: annual ? 'annual' : 'monthly', product: 'propflow' } } })
    if (error) { setMessage('Sign up failed: ' + error.message); setLoading(false); return }
    setMessage('Account created! Check your email to confirm, then sign in.')
    setLoading(false); setTab('signin')
  }

  const selectedPlan = PLANS.find(p => p.id === plan)!
  const inp = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #1e293b', background: '#0d1117', color: '#f0f6ff', fontSize: 14, fontFamily: 'system-ui', outline: 'none', boxSizing: 'border-box' as const }
  const lbl = { display: 'block', fontSize: 11, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 7 }

  return (
    <main style={{ minHeight: '100vh', background: '#050d1a', fontFamily: 'system-ui,sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,142,247,0.06) 0%,transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      {['tl','tr','bl','br'].map(c => <div key={c} style={{ position: 'fixed', width: 28, height: 28, top: c.includes('t') ? 20 : 'auto', bottom: c.includes('b') ? 20 : 'auto', left: c.includes('l') ? 20 : 'auto', right: c.includes('r') ? 20 : 'auto', borderTop: c.includes('t') ? '1px solid rgba(79,142,247,0.2)' : 'none', borderBottom: c.includes('b') ? '1px solid rgba(79,142,247,0.2)' : 'none', borderLeft: c.includes('l') ? '1px solid rgba(79,142,247,0.2)' : 'none', borderRight: c.includes('r') ? '1px solid rgba(79,142,247,0.2)' : 'none' }} />)}

      <div style={{ width: '100%', maxWidth: tab === 'signup' && step === 'plan' ? 960 : 440, transition: 'max-width 0.3s ease' }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#3b6fd4,#4f8ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 auto 12px' }}>P</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f0f6ff', letterSpacing: -1, margin: 0 }}>PropFlow<span style={{ color: '#4f8ef7' }}>OS</span></h1>
          <p style={{ fontSize: 10, color: '#475569', letterSpacing: 3, textTransform: 'uppercase', marginTop: 4 }}>Property Management Platform</p>
        </div>

        <div style={{ display: 'flex', background: '#0d1117', border: '1px solid #1e293b', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {(['signin', 'signup'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setStep('plan'); setMessage('') }}
              style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'system-ui', background: tab === t ? '#4f8ef7' : 'transparent', color: tab === t ? '#fff' : '#475569', transition: 'all .2s' }}>
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {tab === 'signin' && (
          <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 18, padding: 32 }}>
            <div style={{ marginBottom: 14 }}><label style={lbl}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="manager@property.com" /></div>
            <div style={{ marginBottom: 24 }}><label style={lbl}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && signIn()} style={inp} placeholder="Enter your password" /></div>
            <button onClick={signIn} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 11, background: 'linear-gradient(135deg,#3b6fd4,#4f8ef7)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Access PropFlow OS'}
            </button>
            {message && <div style={{ marginTop: 14, color: '#ef4444', fontSize: 12, textAlign: 'center' }}>{message}</div>}
            <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/propflow-os" style={{ color: '#4f8ef7', fontSize: 11, textDecoration: 'none', letterSpacing: 1 }}>Learn More</a>
              <span style={{ color: '#1e293b', fontSize: 11 }}>·</span>
              <a href="/demo" style={{ color: '#4f8ef7', fontSize: 11, textDecoration: 'none', letterSpacing: 1 }}>Request a Demo</a>
              <span style={{ color: '#1e293b', fontSize: 11 }}>·</span>
              <a href="/about" style={{ color: '#4f8ef7', fontSize: 11, textDecoration: 'none', letterSpacing: 1 }}>About</a>
              <span style={{ color: '#1e293b', fontSize: 11 }}>·</span>
              <a href="/contact" style={{ color: '#4f8ef7', fontSize: 11, textDecoration: 'none', letterSpacing: 1 }}>Contact</a>
            </div>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <span style={{ fontSize: 12, color: '#475569' }}>No subscription? </span>
              <button onClick={() => setTab('signup')} style={{ background: 'none', border: 'none', color: '#4f8ef7', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>View plans</button>
            </div>
          </div>
        )}

        {tab === 'signup' && step === 'plan' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f0f6ff', margin: 0, marginBottom: 6 }}>Choose your plan</h2>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>14-day free trial · Cancel anytime · Setup in 48 hours</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#0d1117', border: '1px solid #1e293b', borderRadius: 100, padding: 4 }}>
                <button onClick={() => setAnnual(false)} style={{ padding: '7px 18px', borderRadius: 100, border: 'none', background: !annual ? '#4f8ef7' : 'transparent', color: !annual ? '#fff' : '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui' }}>Monthly</button>
                <button onClick={() => setAnnual(true)} style={{ padding: '7px 18px', borderRadius: 100, border: 'none', background: annual ? '#4f8ef7' : 'transparent', color: annual ? '#fff' : '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Annual <span style={{ background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 100 }}>SAVE 17%</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
              {PLANS.map(p => (
                <div key={p.id} onClick={() => setPlan(p.id)}
                  style={{ background: '#0d1117', border: `2px solid ${plan === p.id ? p.color : '#1e293b'}`, borderRadius: 16, padding: '20px 18px', cursor: 'pointer', position: 'relative', transition: 'all .2s', boxShadow: plan === p.id ? `0 0 20px ${p.color}30` : 'none' }}>
                  {p.popular && <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: p.color, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                  <div style={{ fontSize: 26, fontWeight: 900, color: p.color, marginBottom: 2 }}>
                    ${(annual ? p.price.annual : p.price.monthly).toLocaleString()}
                    <span style={{ fontSize: 12, fontWeight: 400, color: '#475569' }}>/mo</span>
                  </div>
                  {annual && (
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Billed ${(p.price.annual * 12).toLocaleString()}/yr</div>
                      <div style={{ fontSize: 10, color: '#475569' }}>Save ${((p.price.monthly - p.price.annual) * 12).toLocaleString()}/yr</div>
                    </div>
                  )}
                  {!annual && <div style={{ fontSize: 10, color: '#475569', marginBottom: 4 }}>Or ${p.price.annual}/mo annually</div>}
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginBottom: 14 }}>{p.desc}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {p.features.map(f => (
                      <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: p.color, fontSize: 12, flexShrink: 0 }}>+</span>
                        <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('account')} style={{ width: '100%', padding: 14, borderRadius: 11, background: `linear-gradient(135deg,#3b6fd4,${selectedPlan.color})`, border: 'none', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui' }}>
              Continue with {selectedPlan.name} {annual ? 'Annual' : 'Monthly'} Plan
            </button>
          </div>
        )}

        {tab === 'signup' && step === 'account' && (
          <div style={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 18, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f0f6ff', margin: 0 }}>Create your account</h2>
              <div style={{ background: `${selectedPlan.color}20`, border: `1px solid ${selectedPlan.color}50`, borderRadius: 8, padding: '4px 12px', fontSize: 12, color: selectedPlan.color, fontWeight: 700 }}>
                {selectedPlan.name} · ${(annual ? selectedPlan.price.annual : selectedPlan.price.monthly)}/mo
              </div>
            </div>
            <div style={{ marginBottom: 14 }}><label style={lbl}>Full Name</label><input value={name} onChange={e => setName(e.target.value)} style={inp} placeholder="Kenneth Covington" /></div>
            <div style={{ marginBottom: 14 }}><label style={lbl}>Work Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="you@property.com" /></div>
            <div style={{ marginBottom: 24 }}><label style={lbl}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inp} placeholder="Min 8 characters" /></div>
            {annual && (
              <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10 }}>
                <p style={{ color: '#22c55e', fontSize: 13, fontWeight: 600, margin: 0 }}>Annual billing: ${(selectedPlan.price.annual * 12).toLocaleString()}/yr — save ${((selectedPlan.price.monthly - selectedPlan.price.annual) * 12).toLocaleString()}/yr</p>
              </div>
            )}
            <button onClick={signUp} disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 11, background: 'linear-gradient(135deg,#3b6fd4,#4f8ef7)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', opacity: loading ? 0.7 : 1, marginBottom: 10 }}>
              {loading ? 'Creating account...' : 'Start Free Trial'}
            </button>
            <button onClick={() => setStep('plan')} style={{ width: '100%', padding: '10px', borderRadius: 11, background: 'transparent', border: '1px solid #1e293b', color: '#475569', fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui' }}>
              Back to plans
            </button>
            {message && <div style={{ marginTop: 14, color: message.includes('failed') ? '#ef4444' : '#22c55e', fontSize: 12, textAlign: 'center' }}>{message}</div>}
            <p style={{ fontSize: 10, color: '#475569', textAlign: 'center', marginTop: 16 }}>14-day free trial. Billing begins after trial. Cancel anytime.</p>
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', color: '#334155', fontSize: 11, cursor: 'pointer', letterSpacing: 1.5, fontFamily: 'system-ui' }}>
            BACK TO PLATFORM SELECT
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 9, color: '#1e293b', letterSpacing: 2 }}>
          PROPFLOW OS · MADE TECHNOLOGIES INC · v2026.1
        </div>
      </div>
    </main>
  )
}