'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const PLANS = [
  {
    id: 'standard',
    name: 'Standard',
    price: { monthly: 299, annual: 249 },
    desc: '1 facility · Core modules',
    color: '#14D2C2',
    features: ['Temperature Monitoring', 'Drug Inventory', 'Compliance Logs', 'Compounding Batches', 'USP <797> / <800>'],
    addons: '$199/mo AI Panel add-on',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: { monthly: 799, annual: 669 },
    desc: 'Up to 3 facilities',
    color: '#0891B2',
    popular: true,
    features: ['Everything in Standard', 'AI Control Panel', 'Cold Chain Fleet', 'Hospital Logistics', 'Cleanrooms Monitoring', 'Real-time sync'],
    addons: '$149/mo Cold Chain Fleet add-on',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 1999, annual: 1679 },
    desc: 'Unlimited facilities',
    color: '#A78BFA',
    features: ['Everything in Professional', 'Unlimited facilities', 'Full USP compliance suite', 'FDA audit trail export', 'Dedicated pharmacist support', 'Custom reporting & SLA'],
    addons: 'Custom integrations available',
  },
];

export default function MedFlowLogin() {
  const router = useRouter();
  const [tab,      setTab]      = useState<'signin'|'signup'>('signin');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [plan,     setPlan]     = useState('standard');
  const [annual,   setAnnual]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [message,  setMessage]  = useState('');
  const [step,     setStep]     = useState<'plan'|'account'>('plan');

  async function signIn() {
    setLoading(true); setMessage('');
    await supabase.auth.signOut();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage('Sign in failed: ' + error.message); setLoading(false); return; }
    router.push('/medflow/dashboard');
  }

  async function signUp() {
    if (!name || !email || !password) { setMessage('Please fill in all fields.'); return; }
    setLoading(true); setMessage('');
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, plan, billing: annual ? 'annual' : 'monthly', product: 'medflow' } } });
    if (error) { setMessage('Sign up failed: ' + error.message); setLoading(false); return; }
    setMessage('Account created! Check your email to confirm, then sign in.');
    setLoading(false); setTab('signin');
  }

  const selectedPlan = PLANS.find(p => p.id === plan)!;
  const inp = { width:'100%', padding:'11px 14px', borderRadius:10, border:'1px solid #152840', background:'#060E16', color:'#EEF6FB', fontSize:14, fontFamily:"'Outfit',sans-serif", outline:'none', boxSizing:'border-box' as const };
  const lbl = { display:'block', fontSize:11, color:'#4A7090', fontFamily:"'Geist Mono',monospace", letterSpacing:1.5, marginBottom:7 };

  return (
    <main style={{ minHeight:'100vh', background:'#04080F', fontFamily:"'Outfit',sans-serif", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 16px', position:'relative', overflow:'hidden' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Geist+Mono:wght@400;500&display=swap');`}</style>
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(20,210,194,0.06) 0%,transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
      {['tl','tr','bl','br'].map(c => <div key={c} style={{ position:'fixed', width:28, height:28, top:c.includes('t')?20:'auto', bottom:c.includes('b')?20:'auto', left:c.includes('l')?20:'auto', right:c.includes('r')?20:'auto', borderTop:c.includes('t')?'1px solid rgba(20,210,194,0.25)':'none', borderBottom:c.includes('b')?'1px solid rgba(20,210,194,0.25)':'none', borderLeft:c.includes('l')?'1px solid rgba(20,210,194,0.25)':'none', borderRight:c.includes('r')?'1px solid rgba(20,210,194,0.25)':'none' }} />)}

      <div style={{ width:'100%', maxWidth: tab==='signup' && step==='plan' ? 960 : 440, transition:'max-width 0.3s ease' }}>

        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#0A6E68,#14D2C2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, margin:'0 auto 12px' }}>⚕</div>
          <h1 style={{ fontSize:26, fontWeight:900, color:'#EEF6FB', letterSpacing:-1, margin:0 }}>MedFlow<span style={{ color:'#14D2C2' }}>OS</span></h1>
          <p style={{ fontSize:10, color:'#2E5470', fontFamily:"'Geist Mono',monospace", letterSpacing:3, textTransform:'uppercase', marginTop:4 }}>Pharmacy Command Center</p>
        </div>

        <div style={{ display:'flex', background:'#0B1826', border:'1px solid #152840', borderRadius:12, padding:4, marginBottom:24 }}>
          {(['signin','signup'] as const).map(t => (
            <button key={t} onClick={()=>{ if(t === 'signup'){ router.push('/onboarding/medflow') } else { setTab(t); setStep('plan'); setMessage('') }}}
              style={{ flex:1, padding:'10px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, fontFamily:"'Outfit',sans-serif", background:tab===t?'#14D2C2':'transparent', color:tab===t?'#04080F':'#4A7090', transition:'all .2s' }}>
              {t==='signin'?'Sign In':'Sign Up'}
            </button>
          ))}
        </div>

        {tab === 'signin' && (
          <div style={{ background:'#0B1826', border:'1px solid #152840', borderRadius:18, padding:32 }}>
            <div style={{ marginBottom:14 }}><label style={lbl}>EMAIL</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp} placeholder="pharmacist@hospital.com" /></div>
            <div style={{ marginBottom:24 }}><label style={lbl}>PASSWORD</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&signIn()} style={inp} placeholder="••••••••" /></div>
            <button onClick={signIn} disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:11, background:'linear-gradient(135deg,#0A6E68,#14D2C2)', border:'none', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Outfit',sans-serif", opacity:loading?0.7:1 }}>
              {loading?'Signing in...':'Access MedFlowOS'}
            </button>
            {message && <div style={{ marginTop:14, color:'#F43F5E', fontSize:12, fontFamily:"'Geist Mono',monospace", textAlign:'center' }}>{message}</div>}
            <div style={{ marginTop:16, display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <a href="/medflow-os" style={{ color:'#14D2C2', fontSize:11, fontFamily:"'Geist Mono',monospace", textDecoration:'none', letterSpacing:1 }}>Learn More</a>
              <span style={{ color:'#1E3A40', fontSize:11 }}>·</span>
              <a href="/roi" style={{ color:'#14D2C2', fontSize:11, fontFamily:"'Geist Mono',monospace", textDecoration:'none', letterSpacing:1 }}>Request a Demo</a>
              <span style={{ color:'#1E3A40', fontSize:11 }}>·</span>
              <a href="/about" style={{ color:'#14D2C2', fontSize:11, fontFamily:"'Geist Mono',monospace", textDecoration:'none', letterSpacing:1 }}>About</a>
              <span style={{ color:'#1E3A40', fontSize:11 }}>·</span>
              <a href="/contact" style={{ color:'#14D2C2', fontSize:11, fontFamily:"'Geist Mono',monospace", textDecoration:'none', letterSpacing:1 }}>Contact</a>
            </div>
            <div style={{ marginTop:16, textAlign:'center' }}>
              <span style={{ fontSize:12, color:'#2E5470' }}>No subscription? </span>
              <button onClick={()=>router.push('/onboarding/medflow')} style={{ background:'none', border:'none', color:'#14D2C2', fontSize:12, cursor:'pointer', fontWeight:600 }}>View plans →</button>
            </div>
          </div>
        )}

        {tab === 'signup' && step === 'plan' && (
          <div>
            <div style={{ textAlign:'center', marginBottom:20 }}>
              <h2 style={{ fontSize:22, fontWeight:800, color:'#EEF6FB', margin:0, marginBottom:6 }}>Choose your plan</h2>
              <p style={{ fontSize:13, color:'#4A7090', marginBottom:16 }}>HIPAA compliant · USP &lt;797&gt; / &lt;800&gt; · Cancel anytime</p>

              {/* Billing toggle */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:'rgba(11,24,38,0.9)', border:'1px solid #152840', borderRadius:100, padding:4 }}>
                <button onClick={()=>setAnnual(false)} style={{ padding:'7px 18px', borderRadius:100, border:'none', background:!annual?'#14D2C2':'transparent', color:!annual?'#04080F':'#4A7090', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>Monthly</button>
                <button onClick={()=>setAnnual(true)} style={{ padding:'7px 18px', borderRadius:100, border:'none', background:annual?'#14D2C2':'transparent', color:annual?'#04080F':'#4A7090', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:"'Outfit',sans-serif", display:'flex', alignItems:'center', gap:8 }}>
                  Annual
                  <span style={{ background:'#10b981', color:'#fff', fontSize:10, fontWeight:800, padding:'1px 7px', borderRadius:100 }}>SAVE 17%</span>
                </button>
              </div>
              {annual && <p style={{ color:'#10b981', fontSize:12, marginTop:8, fontWeight:600 }}>Pay annually — lower monthly rate, billed as one yearly payment</p>}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:20 }}>
              {PLANS.map(p => (
                <div key={p.id} onClick={()=>setPlan(p.id)}
                  style={{ background:'#0B1826', border:`2px solid ${plan===p.id?p.color:'#152840'}`, borderRadius:16, padding:'20px 18px', cursor:'pointer', position:'relative', transition:'all .2s', boxShadow:plan===p.id?`0 0 20px ${p.color}30`:'none' }}>
                  {p.popular && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:p.color, color:'#fff', fontSize:9, fontWeight:700, fontFamily:"'Geist Mono',monospace", letterSpacing:1.5, padding:'3px 12px', borderRadius:20, whiteSpace:'nowrap' }}>MOST POPULAR</div>}
                  <div style={{ fontSize:26, fontWeight:900, color:p.color, marginBottom:2 }}>
                    ${(annual ? p.price.annual : p.price.monthly).toLocaleString()}
                    <span style={{ fontSize:12, fontWeight:400, color:'#4A7090' }}>/mo</span>
                  </div>
                  {annual && (
                    <div style={{ marginBottom:4 }}>
                      <div style={{ fontSize:11, color:'#10b981', fontWeight:600 }}>Billed ${(p.price.annual * 12).toLocaleString()}/yr</div>
                      <div style={{ fontSize:10, color:'#2E5470' }}>Save ${((p.price.monthly - p.price.annual) * 12).toLocaleString()}/yr</div>
                    </div>
                  )}
                  {!annual && <div style={{ fontSize:10, color:'#2E5070', marginBottom:4, fontFamily:"'Geist Mono',monospace" }}>Or ${p.price.annual}/mo billed annually</div>}
                  <div style={{ fontSize:14, fontWeight:700, color:'#EEF6FB', marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:'#4A7090', fontFamily:"'Geist Mono',monospace", marginBottom:14 }}>{p.desc}</div>
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
            <button onClick={()=>setStep('account')} style={{ width:'100%', padding:'13px', borderRadius:11, background:`linear-gradient(135deg,#0A6E68,${selectedPlan.color})`, border:'none', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
              Continue with {selectedPlan.name} {annual ? 'Annual' : 'Monthly'} Plan →
            </button>
          </div>
        )}

        {tab === 'signup' && step === 'account' && (
          <div style={{ background:'#0B1826', border:'1px solid #152840', borderRadius:18, padding:32 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:800, color:'#EEF6FB', margin:0 }}>Create your account</h2>
              <div style={{ background:`${selectedPlan.color}20`, border:`1px solid ${selectedPlan.color}50`, borderRadius:8, padding:'4px 12px', fontSize:12, color:selectedPlan.color, fontWeight:700 }}>
                {selectedPlan.name} · ${(annual ? selectedPlan.price.annual : selectedPlan.price.monthly).toLocaleString()}/mo {annual ? '(annual)' : '(monthly)'}
              </div>
            </div>
            <div style={{ marginBottom:14 }}><label style={lbl}>FULL NAME</label><input value={name} onChange={e=>setName(e.target.value)} style={inp} placeholder="Dr. Rivera" /></div>
            <div style={{ marginBottom:14 }}><label style={lbl}>WORK EMAIL</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={inp} placeholder="dr.rivera@pharmacy.com" /></div>
            <div style={{ marginBottom:24 }}><label style={lbl}>PASSWORD</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inp} placeholder="Min 8 characters" /></div>
            {annual && (
              <div style={{ marginBottom:16, padding:'12px 16px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:10 }}>
                <p style={{ color:'#10b981', fontSize:13, fontWeight:600, margin:0 }}>
                  Annual billing: ${(selectedPlan.price.annual * 12).toLocaleString()}/yr — save ${((selectedPlan.price.monthly - selectedPlan.price.annual) * 12).toLocaleString()}/yr
                </p>
              </div>
            )}
            <button onClick={signUp} disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:11, background:'linear-gradient(135deg,#0A6E68,#14D2C2)', border:'none', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Outfit',sans-serif", opacity:loading?0.7:1, marginBottom:10 }}>
              {loading?'Creating account...':'Start Free Trial'}
            </button>
            <button onClick={()=>setStep('plan')} style={{ width:'100%', padding:'10px', borderRadius:11, background:'transparent', border:'1px solid #152840', color:'#4A7090', fontSize:13, cursor:'pointer', fontFamily:"'Outfit',sans-serif" }}>
              ← Back to plans
            </button>
            {message && <div style={{ marginTop:14, color:message.includes('failed')?'#F43F5E':'#22D3A5', fontSize:12, fontFamily:"'Geist Mono',monospace", textAlign:'center' }}>{message}</div>}
            <p style={{ fontSize:10, color:'#2E5070', textAlign:'center', marginTop:16, lineHeight:1.6 }}>HIPAA compliant. Billing begins after your free trial. Cancel anytime.</p>
          </div>
        )}

        <div style={{ marginTop:20, textAlign:'center' }}>
          <button onClick={()=>router.push('/')} style={{ background:'transparent', border:'none', color:'#2E5070', fontSize:11, fontFamily:"'Geist Mono',monospace", cursor:'pointer', letterSpacing:1.5 }}>
            ← BACK TO PLATFORM SELECT
          </button>
        </div>
        <div style={{ textAlign:'center', marginTop:12, fontSize:9, color:'#152840', fontFamily:"'Geist Mono',monospace", letterSpacing:2 }}>
          HIPAA COMPLIANT · USP &lt;797&gt; / &lt;800&gt; · MADE TECHNOLOGIES INC
        </div>
      </div>
    </main>
  );
}