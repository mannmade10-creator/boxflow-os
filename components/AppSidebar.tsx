'use client'

import React, { useState } from 'react'
import NotificationSystem from '@/components/NotificationSystem'

type AppSidebarProps = {
  active?: string
}

const navItems = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'command-center', label: 'Command Center', href: '/command-center' },
  { key: 'production', label: 'Production', href: '/production' },
  { key: 'orders', label: 'Orders', href: '/orders' },
  { key: 'dispatch', label: 'Dispatch', href: '/dispatch' },
  { key: 'fleet-map', label: 'Fleet Map', href: '/fleet-map' },
  { key: 'driver', label: 'Driver', href: '/driver' },
  { key: 'client', label: 'Client', href: '/client' },
  { key: 'executive', label: 'AI Panel', href: '/executive' },
  { key: 'equipment', label: 'Equipment', href: '/equipment' },
  { key: 'hr', label: 'HR', href: '/hr' },
  { key: 'analytics', label: 'Analytics', href: '/analytics' },
  { key: 'contact', label: '📧 Contact', href: '/contact' },
  { key: 'pitch', label: 'Pitch Deck', href: '/pitch' },
  { key: 'settings', label: 'Settings', href: '/settings' },
]

export default function AppSidebar({ active }: AppSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-header { display: flex !important; }
        }
        @media (min-width: 769px) {
          .sidebar-desktop { display: block !important; }
          .mobile-header { display: none !important; }
          .mobile-nav-overlay { display: none !important; }
        }
        .nav-link:hover {
          background: rgba(37,99,235,0.15) !important;
          color: #ffffff !important;
        }
      `}</style>

      <div className="mobile-header" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(10,15,30,0.98)', borderBottom: '1px solid rgba(148,163,184,0.16)', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(12px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>BoxFlow OS</div>
        </a>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#fff', fontSize: 18 }}>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 280, background: 'rgba(10,15,30,0.99)', borderRight: '1px solid rgba(148,163,184,0.16)', padding: 20, overflowY: 'auto' }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
              <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 10 }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>BoxFlow OS</div>
                <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>Enterprise Operations Suite</div>
              </div>
            </a>
            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Operations</div>
            <nav style={{ display: 'grid', gap: 8 }}>
              {navItems.map(item => {
                const isActive = active === item.key
                return (
                  <a key={item.key} href={item.href} onClick={() => setMobileOpen(false)} className="nav-link" style={{ textDecoration: 'none', color: isActive ? '#ffffff' : '#cbd5e1', background: isActive ? 'rgba(37,99,235,0.2)' : 'rgba(2,6,23,0.4)', border: isActive ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(148,163,184,0.12)', borderRadius: 12, padding: '11px 14px', fontWeight: 700, display: 'block', fontSize: 14 }}>
                    {item.label}
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      <aside className="sidebar-desktop" style={{ width: 260, minHeight: 'calc(100vh - 40px)', background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 24, padding: 18, boxShadow: '0 18px 48px rgba(0,0,0,0.25)', position: 'sticky', top: 20, flexShrink: 0 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid rgba(148,163,184,0.12)' }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 10, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.3, color: '#ffffff', lineHeight: 1.1 }}>BoxFlow OS</div>
            <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>Enterprise Operations Suite</div>
          </div>
        </a>
        <div style={{ color: '#64748b', fontSize: 11, fontWeight: 800, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Operations</div>
        <nav style={{ display: 'grid', gap: 8 }}>
          {navItems.map(item => {
            const isActive = active === item.key
            return (
              <a key={item.key} href={item.href} className="nav-link" style={{ textDecoration: 'none', color: isActive ? '#ffffff' : '#cbd5e1', background: isActive ? 'rgba(37,99,235,0.2)' : 'rgba(2,6,23,0.4)', border: isActive ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(148,163,184,0.12)', borderRadius: 14, padding: '12px 14px', fontWeight: 700, display: 'block', transition: 'all 0.2s ease', boxShadow: isActive ? '0 8px 24px rgba(37,99,235,0.12)' : 'none' }}>
                {item.label}
              </a>
            )
          })}
        </nav>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(148,163,184,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: '#64748b', fontSize: 11, fontWeight: 700 }}>NOTIFICATIONS</div>
        <NotificationSystem />
      </div>
    </aside>
    </>
  )
}