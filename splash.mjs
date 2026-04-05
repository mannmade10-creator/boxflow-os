import { writeFileSync } from 'fs';
const code = `'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function signIn() {
    setLoading(true)
    setMessage('')
    await supabase.auth.signOut()

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setMessage('Sign in failed: ' + error.message); setLoading(false); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setMessage('No user found.'); setLoading(false); return }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, approved')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) { setMessage('Profile not found.'); setLoading(false); return }
    if (!profile.approved) { setMessage('Account not approved.'); await supabase.auth.signOut(); setLoading(false); return }

    if (profile.role === 'client') { router.push('/client'); return }
    if (profile.role === 'driver') { router.push('/driver'); return }
    router.push('/dashboard')
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #020617 0%, #0b1220 45%, #111827 100%)', color: 'white', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '520px', background: 'rgba(15,23,42,0.94)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', paddi