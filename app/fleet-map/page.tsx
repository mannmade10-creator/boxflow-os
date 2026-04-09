'use client'
import React, { useState } from 'react'
import FleetMapInner from './FleetMapInner'

export default function FleetMapPage() {
  const [fullscreen, setFullscreen] = useState(false)
  return (
    <div style={{ minHeight: '100vh', background: '#0c1324', color: '#dce1fb' }}>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 28px', height: 60, background: 'rgba(12,19,36,0.95)', borderBottom: '1px solid rgba(67,70,85,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src="/assets/logo.png" style={{ width: 30, height: 30 }} alt="logo" />
          <span style={{ fontSize: 16, fontWeight: 900, color: '#2563eb', letterSpacing: 3, textTransform: 'uppercase' }}>BOXFLOW_OS</span>
        </div>
        <a href="/dashboard" style={{ color: '#64748b', fontSize: 11, textDecoration: 'none', fontWeight: 700, letterSpacing: 2 }}>BACK TO DASHBOARD</a>
      </header>
      <main style={{ paddingTop: 60, minHeight: '100vh' }}>
        <div style={{ position: 'relative', height: fullscreen ? 'calc(100vh - 60px)' : '70vh', margin: 20, borderRadius: 4, overflow: 'hidden', background: '#191f31' }}>
          <FleetMapInner />
          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 10, pointerEvents: 'none', background: 'rgba(46,52,71,0.85)', backdropFilter: 'blur(20px)', padding: '10px 14px', borderRadius: 4, border: '1px solid rgba(180,197,255,0.1)' }}>
            <div style={{ fontSize: 9, color: '#7bd0ff', lineHeight: 1.8 }}>GEO SYNC: ACTIVE<br/>TRUCKS: 5 ACTIVE<br/>REGION: OKC METRO</div>
          </div>
          <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 10 }}>
            <button onClick={() => setFullscreen(!fullscreen)} style={{ background: 'rgba(46,52,71,0.85)', border: '1px solid rgba(180,197,255,0.2)', borderRadius: 4, padding: '8px 14px', color: '#b4c5ff', fontWeight: 800, fontSize: 11, cursor: 'pointer', letterSpacing: 2 }}>
              {fullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN MAP'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
