'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PropFlowHome() {
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => router.push('/propflow-login'), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#050d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, Arial, sans-serif' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, animation: 'fadeIn 0.8s ease forwards' }}>
        <div style={{ width: 110, height: 110, borderRadius: 28, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 900, color: '#fff', boxShadow: '0 0 60px rgba(245,158,11,0.5)' }}>🏠</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 10 }}>PropFlow<span style={{ color: '#F59E0B' }}>OS</span></div>
          <div style={{ fontSize: 16, color: '#475569', letterSpacing: 3, textTransform: 'uppercase' }}>Real Estate Operations Platform</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', animation: 'pulse 1.2s ease infinite' }} />
          <span style={{ fontSize: 15, color: '#334155' }}>by M.A.D.E Technologies Inc.</span>
        </div>
      </div>
    </main>
  )
}