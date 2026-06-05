'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import { canAccess } from '@/lib/cannaRoles'

const nav = [
  ['Dashboard', '/cannaflow/dashboard'],
  ['Inventory', '/cannaflow/inventory'],
  ['Compliance', '/cannaflow/compliance'],
  ['Customers', '/cannaflow/customers'],
  ['Sales', '/cannaflow/sales'],
  ['Delivery', '/cannaflow/delivery'],
  ['Analytics', '/cannaflow/analytics'],
  ['Loyalty', '/cannaflow/loyalty'],
  ['Users', '/cannaflow/users'],
  ['Settings', '/cannaflow/settings'],
]

export default function CannaLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const router = useRouter()
  const [currentRole, setCurrentRole] = useState('Loading...')
  const [email, setEmail] = useState('')

  useEffect(() => {
    loadUserRole()
  }, [])

  async function loadUserRole() {
    const { data: authData } = await cannaSupabase.auth.getUser()

    const userEmail = authData.user?.email

    if (!userEmail) {
      router.push('/cannaflow-login')
      return
    }

    setEmail(userEmail)

    const { data, error } = await cannaSupabase
      .from('canna_users')
      .select('role')
      .eq('email', userEmail)
      .single()

    if (error || !data) {
      setCurrentRole('Budtender')
      return
    }

    setCurrentRole(data.role)
  }

  async function logout() {
    await cannaSupabase.auth.signOut()
    router.push('/cannaflow-login')
  }

  const visibleNav = nav.filter(([name]) => canAccess(currentRole, name))

  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: '#fff', display: 'flex' }}>
      <aside style={sidebar}>
        <div style={brand}>
          <img src="/assets/cannaflow-logo.png" alt="Cannaflow OS" style={logo} />
          <h2 style={{ margin: 0 }}>Cannaflow OS</h2>
          <p style={{ color: '#6ee7b7', fontSize: 12 }}>Role: {currentRole}</p>
          <p style={{ color: '#94a3b8', fontSize: 11 }}>{email}</p>
        </div>

        {visibleNav.map(([label, path]) => (
          <button key={label} onClick={() => router.push(path)} style={navBtn}>
            {label}
          </button>
        ))}

        <button onClick={logout} style={logoutBtn}>
          Logout
        </button>
      </aside>

      <section style={{ flex: 1, padding: 32 }}>
        <h1 style={{ fontSize: 42, marginTop: 0 }}>{title}</h1>
        {children}
      </section>
    </main>
  )
}

const sidebar = {
  width: 300,
  padding: 24,
  background: '#020b07',
  borderRight: '1px solid rgba(16,185,129,.25)'
}

const brand = {
  marginBottom: 28
}

const logo = {
  width: 120,
  height: 120,
  objectFit: 'contain' as const,
  filter: 'drop-shadow(0 0 18px rgba(16,185,129,.55))'
}

const navBtn = {
  display: 'block',
  width: '100%',
  textAlign: 'left' as const,
  marginBottom: 10,
  padding: '14px 16px',
  borderRadius: 14,
  background: 'rgba(15,23,42,.8)',
  color: '#d1fae5',
  border: '1px solid rgba(16,185,129,.18)',
  fontWeight: 800,
  cursor: 'pointer'
}

const logoutBtn = {
  ...navBtn,
  marginTop: 24,
  background: 'rgba(239,68,68,.15)',
  color: '#fca5a5',
  border: '1px solid rgba(239,68,68,.3)'
}