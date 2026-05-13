'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ClassFlowLogin() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function signIn() {
    if (!email || !password) return
    setLoading(true); setError('')
    await supabase.auth.signOut()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Sign in failed: ' + error.message); setLoading(false); return }
    router.push('/classflow/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#07080d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)', margin: '0 auto 16px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 3, background: '#07080d', clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6', position: 'relative', zIndex: 1 }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f1f5f9', margin: 0 }}>
            Class<span style={{ color: '#3b82f6' }}>Flow</span> AI
          </h1>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 6, letterSpacing: 2, textTransform: 'uppercase' as const }}>
            Intelligent Learning Platform
          </p>
        </div>

        <div style={{ background: '#111318', border: '0.5px solid rgba(59,130,246,0.2)', borderRadius: 16, padding: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: 1.5, marginBottom: 7, textTransform: 'uppercase' as const }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="teacher@school.com"
              style={{ width: '100%', background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: 1.5, marginBottom: 7, textTransform: 'uppercase' as const }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && signIn()}
              placeholder="Enter your password"
              style={{ width: '100%', background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' as const }} />
          </div>
          <button onClick={signIn} disabled={loading || !email || !password}
            style={{ width: '100%', padding: '13px', background: '#3b82f6', border: 'none', borderRadius: 11, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', opacity: loading || !email || !password ? 0.6 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In to ClassFlow AI'}
          </button>
          {error && <p style={{ color: '#f43f5e', fontSize: 12, textAlign: 'center', marginTop: 12 }}>{error}</p>}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <a href="/" style={{ color: '#64748b', fontSize: 12, textDecoration: 'none' }}>Back to Platform</a>
          </div>
        </div>
      </div>
    </div>
  )
}