'use client'

import React from 'react'
import AppSidebar from '@/components/AppSidebar'

export default function ProductionPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e', padding: 20, gap: 24 }}>
      <AppSidebar active="production" />
      <main style={{ flex: 1, color: '#fff' }}>
        <div style={{ display: 'inline-block', background: 'rgba(37,99,235,0.18)', border: '1px solid rgba(59,130,246,0.35)', color: '#60a5fa', borderRadius: 20, padding: '5px 16px', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>PRODUCTION CONTROL</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8, color: '#fff' }}>Production Flow Tracker</h1>
        <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 28 }}>Monitor machine status, queue volume, downtime alerts, and daily output.</p>
        <img src="/assets/production-flow.jpg" alt="Production Flow" style={{ width: '100%', borderRadius: 16, marginBottom: 24, maxHeight: 300, objectFit: 'cover' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.16)', padding: 24, borderRadius: 16 }}>
            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>Orders In Queue</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>128</div>
          </div>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.16)', padding: 24, borderRadius: 16 }}>
            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>Machines Running</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>6 / 8</div>
          </div>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.16)', padding: 24, borderRadius: 16 }}>
            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>Downtime Alerts</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#ef4444' }}>2 Issues</div>
          </div>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.16)', padding: 24, borderRadius: 16 }}>
            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>Completed Today</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>3,420 Units</div>
          </div>
        </div>
      </main>
    </div>
  )
}