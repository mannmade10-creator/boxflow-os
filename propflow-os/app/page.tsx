'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main style={{ minHeight: '100vh', background: '#050d1a', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, Arial, sans-serif' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 24, animation: 'fadeIn 0.8s ease forwards' }}>
        <div style={{ width: 100, height: 100, borderRadius: 24, background: '#4f8ef7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 900, color: '#fff', boxShadow: '0 0 60px rgba(79,142,247,0.4)' }}>P</div>
        <div style={{ textAlign: 'center' as const }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: -1, marginBottom: 8 }}>PropFlow OS</div>
          <div style={{ fontSize: 16, color: '#475569', letterSpacing: 3, textTransform: 'uppercase' as const }}>Property Management Platform</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f8ef7', animation: 'pulse 1.2s ease infinite' }} />
          <span style={{ fontSize: 14, color: '#334155' }}>by M.A.D.E Technologies Inc.</span>
        </div>
        <button
          onClick={() => router.push('/login')}
          style={{ marginTop: 16, padding: '18px 56px', background: '#4f8ef7', border: 'none', borderRadius: 16, color: '#fff', fontSize: 18, fontWeight: 800, cursor: 'pointer', boxShadow: '0 0 40px rgba(79,142,247,0.35)', letterSpacing: 0.5 }}>
          Sign In →
        </button>
        <a href="/apply" style={{ fontSize: 15, color: '#334155', textDecoration: 'none' }}>
          New resident? <span style={{ color: '#4f8ef7', fontWeight: 700 }}>Apply here →</span>
        </a>
      </div>
    </main>
  )
}