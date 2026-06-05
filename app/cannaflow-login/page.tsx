'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cannaSupabase } from '@/lib/cannaflowSupabase'

export default function CannaflowLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('owner@cannaflowos.com')
  const [password, setPassword] = useState('12345678')
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)

    const { error } = await cannaSupabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/cannaflow/delivery')
  }

  return (
    <main style={page}>
      <section style={box}>
        <img src="/assets/cannaflow-logo.png" alt="Cannaflow OS" style={logo} />

        <h1 style={title}>Cannaflow OS</h1>
        <p style={subtitle}>Secure dispensary operations login</p>

        <input
          style={input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} style={button}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </section>
    </main>
  )
}

const page = {
  minHeight: '100vh',
  background: '#020617',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const box = {
  width: 420,
  background: '#0f172a',
  border: '1px solid rgba(16,185,129,.35)',
  borderRadius: 24,
  padding: 32,
  textAlign: 'center' as const
}

const logo = {
  width: 130,
  height: 130,
  objectFit: 'contain' as const,
  filter: 'drop-shadow(0 0 22px rgba(16,185,129,.55))'
}

const title = {
  fontSize: 36,
  margin: '12px 0 0',
  fontWeight: 950
}

const subtitle = {
  color: '#94a3b8',
  marginBottom: 24
}

const input = {
  width: '100%',
  boxSizing: 'border-box' as const,
  background: '#020617',
  color: '#fff',
  border: '1px solid rgba(16,185,129,.25)',
  borderRadius: 12,
  padding: 14,
  marginBottom: 14,
  outline: 'none'
}

const button = {
  width: '100%',
  background: '#10b981',
  color: '#00130c',
  border: 'none',
  borderRadius: 14,
  padding: 14,
  fontWeight: 900,
  cursor: 'pointer'
}