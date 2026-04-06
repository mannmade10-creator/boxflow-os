'use client'
import React from 'react'
export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 40%, rgba(37,99,235,0.2), transparent 60%), linear-gradient(180deg, #020617 0%, #0b1220 100%)' }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 300, marginBottom: 8, filter: 'drop-shadow(0 0 40px rgba(37,99,235,0.7))' }} />
        <h1 style={{ fontSize: 72, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: -2, textShadow: '0 0 40px rgba(37,99,235,0.4)' }}>BoxFlow OS</h1>
        <div style={{ color: '#60a5fa', fontSize: 16, letterSpacing: 4, textTransform: 'uppercase' }}>Enterprise Operations Suite</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {['Logistics', 'Production', 'Dispatch', 'Fleet', 'AI'].map(item => (
            <div key={item} style={{ padding: '6px 14px', borderRadius: 999, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd', fontSize: 12, fontWeight: 700 }}>{item}</div>
          ))}
        </div>
        <a href="/login" style={{ marginTop: 16, padding: '18px 56px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff', borderRadius: 16, textDecoration: 'none', fontWeight: 800, fontSize: 20, boxShadow: '0 0 40px rgba(37,99,235,0.5), 0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(96,165,250,0.3)' }}>Enter System →</a>
        <div style={{ color: '#1e3a5f', fontSize: 12, marginTop: 8 }}>Powered by BoxFlow OS v2.0</div>
      </div>
    </div>
  )
}