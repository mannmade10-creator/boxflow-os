'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$599',
    period: '/mo',
    desc: '1 location · Up to 10 trucks',
    color: '#2563EB',
    features: ['Corrugator Production System', 'Smart Dispatch', 'Live Fleet Map', 'Client Portal', 'Up to 10 trucks'],
    addons: '$15/truck/mo over limit',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$1,899',
    period: '/mo',
    desc: 'Up to 3 locations · Up to 50 trucks',
    color: '#7C3AED',
    popular: true,
    features: ['Everything in Starter', 'AI Auto-Dispatch', 'HR + Payroll Center', 'Advanced Analytics', 'Up to 50 trucks', 'API Access ($299 value)'],
    addons: '$15/truck/mo · $299/mo API access',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$4,499',
    period: '/mo',
    desc: 'Unlimited locations & trucks',
    color: '#F59E0B',
    features: ['Everything in Professional', 'Unlimited locations', 'Unlimited trucks', 'White Label option', 'Dedicated support', 'Custom integrations'],
    addons: 'White label $799/mo · API $299/mo',
  },
];

export default function BoxFlowLogin() {
  const router = useRouter();
  const [tab,      setTab]      = useState<'signin'|'signup'>('signin');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [plan,     setPlan]     = useState('starter');
  const [loading,  setLoading]  = useState(false);
  const [message,  setMessage]  = useState('');
  const [step,     setStep]     = useState<'plan'|'account'>('plan');

  async function signIn() {
    setLoading(true); setMessage('');
    await supabase.auth.signOut();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage('Sign in failed: ' + error.message); setLoading(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage('No user found.'); setLoading(false); return; }
    const { data: profile } = await supabase.from('profiles').select('role,approved').eq('id', user.id).single();
    if (!profile?.approved) { setMessage('Account pending approval.'); await supabase.auth.signOut(); setLoading(false); return; }
    if (profile.role === 'client') { router.push('/client'); return; }
    if (profile.role === 'driver') { router.push('/driver'); return; }
    router.push('/dashboard');
  }

  async function signUp() {
    if (!name || !email || !password) { setMessage('Please fill in all fields.'); return; }
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, plan } } });
    if (error) { setMessage('Sign up failed: ' + error.message); setLoading(false); return; }
    setMessage('Account created! Check your email to confirm, then sign in.');
    setLoading(false);
    setTab('signin');
  }

  const selectedPlan = PLANS.find(p => p.id === plan)!;

  const inp = { width:'100%', padding:'11px 14px', borderRadius:10, border:'1px solid #1E3D6A', background:'#060E1C', color:'#EEF6FB', fontSize:14, fontFamily:"'Outfit',sans-serif", outline:'none', boxSizing:'border-box' as const };
  const lbl = { display:'block', fontSize:11, color:'#4A6090', fontFamily:"'Geist Mono',monospace", letterSpacing:1.5, marginBottom:7 };

  return (
    <main style={{ minHeight:'100vh', background:'#020917', fontFamily:"'Outfit',sans-serif", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 16px', position:'relative', overflow:'hidden' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500&display=swap');`}</style>
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
      {['tl','tr','bl','br'].map(c => <div key={c} style={{ position:'fixed', width:28, height:28, top:c.includes('t')?20:'auto', bottom:c.includes('b')?20:'auto', left:c.includes('l')?20:'auto', right:c.includes('r')?20:'auto', borderTop:c.includes('t')?'1px solid rgba(37,99,235,0.3)':'none', borderBottom:c.includes('b')?'1px solid rgba(37,99,235,0.3)':'none', borderLeft:c.includes('l')?'1px solid rgba(37,99,235,0.3)':'none', borderRight:c.includes('r')?'1px solid rgba(37,99,235,0.3)':'none' }} />)}

      <div style={{ width:'100%', maxWidth: tab==='signup' && step==='plan' ? 900 : 440, transition:'max-width 0.3s ease' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:6 }}>
            <img src="/assets/logo.png" alt="BoxFlow OS" style={{ height:40 }} />
            <h1 style={{ fontSize:26, fontWeight:900, color:'#EEF6FB', letterSpacing:-1, margin:0 }}>BoxFlow<span style={{ color:'#2563EB' }}>OS</span></h1>
          </div>
          <p style={{ fontSize:10, color:'#2E5070', fontFamily:"'Geist Mono',monospace", letterSpacing:3, textTransform:'uppercase' }}>Enterprise Operations System</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', background:'#0B1628', border:'1px solid #152840', borderRadius:12, padding:4, marginBottom:24 }}>
          {(['signin','signup'] as const).map(t => (
            <button key={t} onClick={()=>{ setTab(t); setStep('plan'); setMessage(''); }}
              style={{ flex:1, padding:'10px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:"'Outfit',sans-serif", background:tab===t?'#2563EB':'transparent', color:tab===t?'#fff':'#4A6090', transition:'all .2s' }}>
              {t==='signin'?'Sign In':'Sign Up'}
            </button>
          ))}
        </div>

        {/* SIGN IN */}
        {tab === 'signin' && (
          <div style={{ background:'#0B1628', border:'1px solid #152840', borderRadius:18, padding:32 }}>
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>EMAIL</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp} placeholder="you@company.com" />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={lbl}>PASSWORD</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&signIn()} style={inp} placeholder="••••••••" />
            </div>
            <button onClick={signIn} disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:11, background:'linear-gradient(135deg,#1d4ed8,#2563EB)', border:'none', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Outfit',sans-serif", opacity:loading?.7:1 }}>
              {loading?'Signing in...':'Sign In to BoxFlow OS'}
            </button>
            {message && <div style={{ marginTop:14, color:message.includes('failed')?'#F43F5E':'#22D3A5', fontSize:12, fontFamily:"'Geist Mono',monospace", textAlign:'center' }}>{message}</div>}
            <div style={{ marginTop:20, textAlign:'center' }}>
              <span style={{ fontSize:12, color:'#2E5070' }}>Don't have an account? </span>
              <button onClick={()=>setTab('signup')} style={{ background:'none', border:'none', color:'#2563EB', fontSize:12, cursor:'pointer', fontWeight:600 }}>Start free trial →</button>
            </div>
          </div>
        )}

        {/* SIGN UP — STEP 1: Plan Selection */}
        {tab === 'signup' && step === 'plan' && (
          <div>
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#EEF6FB', margin:0, marginBottom:6 }}>Choose your plan</h2>
              <p style={{ fontSize:13, color:'#4A6090' }}>Replace $7,200/mo in legacy tools. Cancel anytime.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
              {PLANS.map(p => (
                <div key={p.id} onClick={()=>setPlan(p.id)}
                  style={{ background:'#0B1628', border:`2px solid ${plan===p.id?p.color:'#152840'}`, borderRadius:16, padding:'20px 18px', cursor:'pointer', position:'relative', transition:'all .2s', boxShadow:plan===p.id?`0 0 20px ${p.color}30`:'none' }}>
                  {p.popular && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:p.color, color:'#fff', fontSize:9, fontWeight:700, fontFamily:"'Geist Mono',monospace", letterSpacing:1.5, padding:'3px 12px', borderRadius:20, whiteSpace:'nowrap' }}>MOST POPULAR</div>}
                  <div style={{ fontSize:22, fontWeight:900, color:p.color, marginBottom:2 }}>{p.price}<span style={{ fontSize:12, fontWeight:400, color:'#4A6090' }}>{p.period}</span></div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#EEF6FB', marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'#4A6090', fontFamily:"'Geist Mono',monospace", marginBottom:14 }}>{p.desc}</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {p.features.map(f => <div key={f} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                      <span style={{ color:p.color, fontSize:12, flexShrink:0 }}>✓</span>
                      <span style={{ fontSize:11.5, color:'#C8DDE9' }}>{f}</span>
                    </div>)}
                  </div>
                  {p.addons && <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid #152840', fontSize:10, color:'#2E5070', fontFamily:"'Geist Mono',monospace" }}>Add-ons: {p.addons}</div>}
                </div>
              ))}
            </div>
            <button onClick={()=>setStep('account')}
              style={{ width:'100%', padding:'13px', borderRadius:11, background:`linear-gradient(135deg,#1d4ed8,${selectedPlan.color})`, border:'none', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
              Continue with {selectedPlan.name} Plan →
            </button>
          </div>
        )}

        {/* SIGN UP — STEP 2: Account Details */}
        {tab === 'signup' && step === 'account' && (
          <div style={{ background:'#0B1628', border:'1px solid #152840', borderRadius:18, padding:32 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:'#EEF6FB', margin:0 }}>Create your account</h2>
              <div style={{ background:`${selectedPlan.color}20`, border:`1px solid ${selectedPlan.color}50`, borderRadius:8, padding:'4px 12px', fontSize:12, color:selectedPlan.color, fontWeight:700 }}>{selectedPlan.name} · {selectedPlan.price}/mo</div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>FULL NAME</label>
              <input value={name} onChange={e=>setName(e.target.value)} style={inp} placeholder="Kenneth Covington" />
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>WORK EMAIL</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp} placeholder="you@company.com" />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={lbl}>PASSWORD</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inp} placeholder="Min 8 characters" />
            </div>
            <button onClick={signUp} disabled={loading}
              style={{ width:'100%', padding:'13px', borderRadius:11, background:`linear-gradient(135deg,#1d4ed8,${selectedPlan.color})`, border:'none', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Outfit',sans-serif", opacity:loading?.7:1, marginBottom:10 }}>
              {loading?'Creating account...':'Start Free Trial'}
            </button>
            <button onClick={()=>setStep('plan')} style={{ width:'100%', padding:'10px', borderRadius:11, background:'transparent', border:'1px solid #152840', color:'#4A6090', fontSize:13, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
              ← Back to plan selection
            </button>
            {message && <div style={{ marginTop:14, color:message.includes('failed')?'#F43F5E':'#22D3A5', fontSize:12, fontFamily:"'Geist Mono',monospace", textAlign:'center' }}>{message}</div>}
            <p style={{ fontSize:10, color:'#2E5070', textAlign:'center', marginTop:16, lineHeight:1.6 }}>By creating an account you agree to our Terms of Service. Billing begins after your free trial.</p>
          </div>
        )}

        <div style={{ marginTop:20, textAlign:'center' }}>
          <button onClick={()=>router.push('/')} style={{ background:'transparent', border:'none', color:'#2E5070', fontSize:11, fontFamily:"'Geist Mono',monospace", cursor:'pointer', letterSpacing:1.5 }}>← BACK TO PLATFORM SELECT</button>
        </div>
        <div style={{ textAlign:'center', marginTop:12, fontSize:9, color:'#152840', fontFamily:"'Geist Mono',monospace", letterSpacing:2 }}>MADE TECHNOLOGIES INC · ENTERPRISE SUITE · v2026.1</div>
      </div>
    </main>
  );
}