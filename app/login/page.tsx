'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user?.email) {
        setUserEmail(user.email)
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || '')
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function signIn() {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Signed in successfully.')
    setLoading(false)
    window.location.href = '/executive'
  }

  async function signUp() {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Account created. Check email if confirmation is enabled.')
    setLoading(false)
  }

  async function signOut() {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signOut()

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Signed out.')
    setLoading(false)
    window.location.href = '/login'
  }

  return (
    <main style={container}>
      <div style={card}>
        <div style={badge}>SECURE ACCESS</div>
        <h1 style={title}>BoxFlow OS Login</h1>
        <p style={subtitle}>
          Sign in to access the operational dashboard, HR tools, and secure role-based areas.
        </p>

        {userEmail ? (
          <div style={signedInBox}>
            <div style={{ fontWeight: 800 }}>Currently signed in</div>
            <div style={{ color: '#94a3b8', marginTop: 6 }}>{userEmail}</div>

            <button
              onClick={signOut}
              disabled={loading}
              style={secondaryButton}
            >
              {loading ? 'Working...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <label style={label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={input}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={input}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={signIn}
                disabled={loading}
                style={primaryButton}
              >
                {loading ? 'Working...' : 'Sign In'}
              </button>

              <button
                onClick={signUp}
                disabled={loading}
                style={secondaryButton}
              >
                {loading ? 'Working...' : 'Create Account'}
              </button>
            </div>
          </>
        )}

        {message ? <div style={messageStyle}>{message}</div> : null}

        <div style={footerBox}>
          <div style={footerTitle}>Recommended Flow</div>
          <div style={footerText}>1. Create account</div>
          <div style={footerText}>2. Make your user an admin in Supabase</div>
          <div style={footerText}>3. Sign in</div>
          <div style={footerText}>4. Open Executive, HR, ROI, and Close screens</div>
        </div>
      </div>
    </main>
  )
}

const container: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  background: 'linear-gradient(135deg, #020617 0%, #0b1220 45%, #111827 100%)',
  color: 'white',
}

const card: React.CSSProperties = {
  width: '100%',
  maxWidth: '520px',
  background: 'rgba(15,23,42,0.94)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
  padding: '28px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
}

const badge: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(56,189,248,0.16)',
  color: '#7dd3fc',
  padding: '6px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 900,
  marginBottom: '12px',
}

const title: React.CSSProperties = {
  fontSize: '34px',
  fontWeight: 900,
  margin: 0,
}

const subtitle: React.CSSProperties = {
  color: '#cbd5e1',
  lineHeight: 1.7,
  marginTop: '10px',
  marginBottom: '22px',
}

const label: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  color: '#94a3b8',
  fontSize: '14px',
}

const input: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#0f172a',
  color: 'white',
  boxSizing: 'border-box',
}

const primaryButton: React.CSSProperties = {
  background: '#22c55e',
  color: '#020617',
  border: 'none',
  padding: '12px 16px',
  borderRadius: '12px',
  fontWeight: 800,
  cursor: 'pointer',
}

const secondaryButton: React.CSSProperties = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  padding: '12px 16px',
  borderRadius: '12px',
  fontWeight: 800,
  cursor: 'pointer',
}

const messageStyle: React.CSSProperties = {
  marginTop: '18px',
  color: '#fcd34d',
  lineHeight: 1.6,
}

const signedInBox: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '14px',
  padding: '16px',
}

const footerBox: React.CSSProperties = {
  marginTop: '24px',
  paddingTop: '18px',
  borderTop: '1px solid rgba(255,255,255,0.08)',
}

const footerTitle: React.CSSProperties = {
  fontWeight: 800,
  marginBottom: '8px',
}

const footerText: React.CSSProperties = {
  color: '#94a3b8',
  marginBottom: '4px',
}