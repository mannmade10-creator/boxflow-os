'use client'
import React from 'react'
import AppSidebar from '@/components/AppSidebar'

export default function SettingsPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e', padding: 20, gap: 24 }}>
      <AppSidebar active="settings" />
      <main style={{ flex: 1, color: '#fff' }}>
        <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>Settings</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8, color: '#fff' }}>System Settings</h1>
        <p style={{ color: '#94a3b8', marginBottom: 28 }}>Manage your BoxFlow OS configuration and preferences.</p>
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 20, padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Account Settings</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                <span style={{ color: '#cbd5e1' }}>Company Name</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>BoxFlow OS</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                <span style={{ color: '#cbd5e1' }}>Plan</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>Enterprise</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ color: '#cbd5e1' }}>Status</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>Active</span>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 20, padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 16 }}>System Status</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                <span style={{ color: '#cbd5e1' }}>Database</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>Supabase Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                <span style={{ color: '#cbd5e1' }}>Map Provider</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>Mapbox Active</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ color: '#cbd5e1' }}>AI Engine</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>Online</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
