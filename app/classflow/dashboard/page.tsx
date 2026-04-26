'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Play, TrendingUp, Users, Globe } from 'lucide-react'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  // supabase client ready
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    })
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const stats = [
    { label: 'Lessons created', value: 0, icon: Play, color: '#3b82f6' },
    { label: 'Published', value: 0, icon: TrendingUp, color: '#22c55e' },
    { label: 'Students', value: 0, icon: Users, color: '#a78bfa' },
    { label: 'Languages', value: 4, icon: Globe, color: '#f59e0b' },
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#07080d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: '#64748b' }}>Loadingâ€¦</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#07080d' }}>
      <header style={{
        background: '#111318', borderBottom: '0.5px solid rgba(59,130,246,0.18)',
        height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
            clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <div style={{ position: 'absolute', inset: 2, background: '#111318', clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', position: 'relative', zIndex: 1 }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>
            Class<span style={{ color: '#3b82f6' }}>Flow</span> AI
          </span>
        </Link>
        <nav style={{ display: 'flex', gap: 4 }}>
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/create', label: 'Create lesson' },
            { href: '/students', label: 'Students' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: '6px 12px', borderRadius: 8, textDecoration: 'none',
              fontSize: 13, color: href === '/dashboard' ? '#3b82f6' : '#64748b',
              background: href === '/dashboard' ? 'rgba(59,130,246,0.1)' : 'transparent',
            }}>{label}</Link>
          ))}
        </nav>
        <button onClick={handleSignOut} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#64748b', fontSize: 13, padding: '6px 10px', borderRadius: 8,
        }}>Sign out</button>
      </header>
      <main style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Welcome back â€” here's what's happening</p>
          </div>
          <Link href="/create" style={{
            display: 'flex', alignItems: 'center', gap: 8, background: '#2563eb',
            color: '#fff', textDecoration: 'none', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 500,
          }}>
            <PlusCircle size={15} /> New lesson
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} style={{
              background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)',
              borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>{value}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{
          background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)',
          borderRadius: 14, padding: '48px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>No lessons yet</div>
          <Link href="/create" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(59,130,246,0.1)', color: '#3b82f6',
            border: '0.5px solid rgba(59,130,246,0.3)',
            textDecoration: 'none', padding: '9px 18px', borderRadius: 8, fontSize: 13,
          }}>
            <PlusCircle size={14} /> Create your first lesson
          </Link>
        </div>
      </main>
    </div>
  )
}

