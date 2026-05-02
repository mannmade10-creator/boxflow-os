'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MedFlowHome() {
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => router.push('/medflow-login'), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#04080F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 60px rgba(20,210,194,0.4); } 50% { box-shadow: 0 0 100px rgba(20,210,194,0.7); } }
      `}</style>
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,210,194,0.07) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
      {['tl','tr','bl','br'].map(c => (
        <div key={c} style={{ position: 'fixed', width: 28, height: 28, top: c.includes('t') ? 20 : 'auto', bottom: c.includes('b') ? 20 : 'auto', left: c.includes('l') ? 20 : 'auto', right: c.includes('r') ? 20 : 'auto', borderTop: c.includes('t') ? '1px solid rgba(20,210,194,0.25)' : 'none', borderBottom: c.includes('b') ? '1px solid rgba(20,210,194,0.25)' : 'none', borderLeft: c.includes('l') ? '1px solid rgba(20,210,194,0.25)' : 'none', borderRight: c.includes('r') ? '1px solid rgba(20,210,194,0.25)' : 'none' }} />
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, animation: 'fadeIn 0.8s ease forwards' }}>
        <div style={{ width: 110, height: 110, borderRadius: 28, background: 'linear-gradient(135deg, #0A6E68, #14D2C2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, animation: 'glow 2s ease infinite' }}>
          ⚕
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: '#EEF6FB', letterSpacing: -1, marginBottom: 10 }}>
            MedFlow<span style={{ color: '#14D2C2' }}>OS</span>
          </div>
          <div style={{ fontSize: 16, color: '#2E5470', letterSpacing: 3, textTransform: 'uppercase', fontFamily: "'Geist Mono', monospace" }}>Pharmacy Command Center</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#14D2C2', animation: 'pulse 1.2s ease infinite' }} />
          <span style={{ fontSize: 15, color: '#1A3040', fontFamily: "'Geist Mono', monospace" }}>by M.A.D.E Technologies Inc.</span>
        </div>
        <div style={{ marginTop: 8, padding: '6px 16px', borderRadius: 20, border: '1px solid rgba(20,210,194,0.2)', background: 'rgba(20,210,194,0.05)' }}>
          <span style={{ fontSize: 11, color: '#14D2C2', fontFamily: "'Geist Mono', monospace", letterSpacing: 2 }}>HIPAA COMPLIANT · USP &lt;797&gt; / &lt;800&gt;</span>
        </div>
      </div>
    </main>
  )
}