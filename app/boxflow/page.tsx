'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BoxFlowHome() {
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => router.push('/login'), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#020917', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 60px rgba(37,99,235,0.5); } 50% { box-shadow: 0 0 100px rgba(37,99,235,0.8); } }
      `}</style>
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      {['tl','tr','bl','br'].map(c => (
        <div key={c} style={{ position: 'fixed', width: 28, height: 28, top: c.includes('t') ? 20 : 'auto', bottom: c.includes('b') ? 20 : 'auto', left: c.includes('l') ? 20 : 'auto', right: c.includes('r') ? 20 : 'auto', borderTop: c.includes('t') ? '1px solid rgba(37,99,235,0.3)' : 'none', borderBottom: c.includes('b') ? '1px solid rgba(37,99,235,0.3)' : 'none', borderLeft: c.includes('l') ? '1px solid rgba(37,99,235,0.3)' : 'none', borderRight: c.includes('r') ? '1px solid rgba(37,99,235,0.3)' : 'none' }} />
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, animation: 'fadeIn 0.8s ease forwards' }}>
        <div style={{ width: 110, height: 110, borderRadius: 28, background: 'linear-gradient(135deg, #1d4ed8, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, animation: 'glow 2s ease infinite' }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 70, height: 70, objectFit: 'contain' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#EEF6FB', letterSpacing: -1, marginBottom: 10 }}>
            BoxFlow<span style={{ color: '#2563EB' }}>OS</span>
          </div>
          <div style={{ fontSize: 16, color: '#4A6090', letterSpacing: 3, textTransform: 'uppercase', fontFamily: "'Geist Mono', monospace" }}>Enterprise Operations System</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563EB', animation: 'pulse 1.2s ease infinite' }} />
          <span style={{ fontSize: 15, color: '#2E5070', fontFamily: "'Geist Mono', monospace" }}>by M.A.D.E Technologies Inc.</span>
        </div>
      </div>
    </main>
  )
}