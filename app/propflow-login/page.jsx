'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PropFlowLogin() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [message,  setMessage]  = useState('');

  async function signIn() {
    setLoading(true); setMessage('');
    await supabase.auth.signOut();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMessage('Sign in failed: ' + error.message); setLoading(false); return; }
    router.push('/propflow/dashboard');
  }

  return (
    <main style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0A0800', fontFamily:"'Outfit',sans-serif", position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.06) 0%,transparent 70%)', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:20, left:20, width:30, height:30, borderTop:'1px solid rgba(245,158,11,0.3)', borderLeft:'1px solid rgba(245,158,11,0.3)' }} />
      <div style={{ position:'absolute', top:20, right:20, width:30, height:30, borderTop:'1px solid rgba(245,158,11,0.3)', borderRight:'1px solid rgba(245,158,11,0.3)' }} />
      <div style={{ position:'absolute', bottom:20, left:20, width:30, height:30, borderBottom:'1px solid rgba(245,158,11,0.3)', borderLeft:'1px solid rgba(245,158,11,0.3)' }} />
      <div style={{ position:'absolute', bottom:20, right:20, width:30, height:30, borderBottom:'1px solid rgba(245,158,11,0.3)', borderRight:'1px solid rgba(245,158,11,0.3)' }} />

      <div style={{ width:'100%', maxWidth:420, background:'#120F02', border:'1px solid #2A2000', borderRadius:20, padding:36, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:14, background:'linear-gradient(135deg,#92400E,#F59E0B)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, margin:'0 auto 14px' }}>🏠</div>
          <h1 style={{ fontSize:28, fontWeight:900, color:'#EEF6FB', letterSpacing:-1, margin:0 }}>PropFlow<span style={{ color:'#F59E0B' }}>OS</span></h1>
          <p style={{ fontSize:11, color:'#6B5A30', fontFamily:"'Geist Mono',monospace", letterSpacing:3, marginTop:6, textTransform:'uppercase' }}>Real Estate Operations</p>
        </div>

        <div style={{ fontSize:11, color:'#3D2E10', fontFamily:"'Geist Mono',monospace", letterSpacing:2, marginBottom:20, textAlign:'center' }}>SUBSCRIBER LOGIN</div>

        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:11, color:'#6B5A30', fontFamily:"'Geist Mono',monospace", letterSpacing:1.5, marginBottom:7 }}>EMAIL</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
            style={{ width:'100%', padding:'12px 14px', borderRadius:10, border:'1px solid #3D2A00', background:'#080600', color:'#EEF6FB', fontSize:14, fontFamily:"'Outfit',sans-serif", outline:'none', boxSizing:'border-box' }} />
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={{ display:'block', fontSize:11, color:'#6B5A30', fontFamily:"'Geist Mono',monospace", letterSpacing:1.5, marginBottom:7 }}>PASSWORD</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&signIn()}
            style={{ width:'100%', padding:'12px 14px', borderRadius:10, border:'1px solid #3D2A00', background:'#080600', color:'#EEF6FB', fontSize:14, fontFamily:"'Outfit',sans-serif", outline:'none', boxSizing:'border-box' }} />
        </div>

        <button onClick={signIn} disabled={loading}
          style={{ width:'100%', padding:'14px', borderRadius:11, background:'linear-gradient(135deg,#92400E,#F59E0B)', border:'none', color:'#fff', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:"'Outfit',sans-serif", opacity:loading?0.7:1 }}>
          {loading ? 'Signing in...' : 'Access PropFlowOS'}
        </button>

        {message && <div style={{ marginTop:16, color:'#F43F5E', fontSize:12, fontFamily:"'Geist Mono',monospace", textAlign:'center' }}>{message}</div>}

        <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid #2A2000', textAlign:'center' }}>
          <button onClick={()=>router.push('/')} style={{ background:'transparent', border:'none', color:'#3D2E10', fontSize:11, fontFamily:"'Geist Mono',monospace", cursor:'pointer', letterSpacing:1.5 }}>
            ← BACK TO PLATFORM SELECT
          </button>
        </div>

        <div style={{ textAlign:'center', marginTop:16, fontSize:9, color:'#2A2000', fontFamily:"'Geist Mono',monospace", letterSpacing:2 }}>
          MADE TECHNOLOGIES INC · ENTERPRISE SUITE · v2026.1
        </div>
      </div>
    </main>
  );
}