'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import NotificationSystem from '@/components/NotificationSystem'

type AppSidebarProps = {
  active?: string
}

type Industry = 'corrugated' | 'steel' | 'food' | 'trucking' | 'warehousing' | 'general'

const industryLabels: Record<Industry, string> = {
  corrugated: 'Corrugated & Paper',
  steel: 'Steel & Metal',
  food: 'Food & Beverage',
  trucking: 'Trucking & Freight',
  warehousing: 'Warehousing',
  general: 'Manufacturing',
}

const industryIcons: Record<Industry, string> = {
  corrugated: '📦',
  steel: '🏗️',
  food: '🍕',
  trucking: '🚛',
  warehousing: '🏪',
  general: '🏭',
}

function getNavItems(industry: Industry) {
  const base = [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { key: 'command-center', label: 'Command Center', href: '/command-center' },
  ]

  const productionModule = {
    corrugated: { key: 'corrugator', label: 'Corrugator Production', href: '/production-v2' },
    steel:      { key: 'production', label: 'Mill Production Floor', href: '/production-v2' },
    food:       { key: 'production', label: 'Batch Production Floor', href: '/production-v2' },
    trucking:   { key: 'freight', label: 'Freight Dispatch', href: '/dispatch-v2' },
    warehousing:{ key: 'production', label: 'Warehouse Floor', href: '/production-v2' },
    general:    { key: 'production', label: 'Production Floor', href: '/production-v2' },
  }

  const middle = [
    productionModule[industry],
    { key: 'orders', label: 'Orders', href: '/orders' },
    { key: 'dispatch', label: 'Dispatch', href: '/dispatch' },
    { key: 'fleet-map', label: 'Fleet Map', href: '/fleet-map' },
    { key: 'driver', label: 'Driver', href: '/driver' },
    { key: 'client', label: 'Client', href: '/client' },
    { key: 'freight', label: 'Freight Dispatch', href: '/dispatch-v2' },
    { key: 'executive', label: 'AI Panel', href: '/executive' },
    { key: 'equipment', label: 'Equipment', href: '/equipment' },
    { key: 'hr', label: 'HR', href: '/hr' },
    { key: 'analytics', label: 'Analytics', href: '/analytics' },
    { key: 'pitch', label: 'Pitch Deck', href: '/pitch' },
    { key: 'settings', label: 'Settings', href: '/settings' },
  ]

  // Remove duplicate freight for trucking industry
  const filtered = industry === 'trucking'
    ? middle.filter(item => item.key !== 'corrugator' && item.key !== 'dispatch')
    : middle.filter(item => item.key !== 'freight')

  return [...base, ...filtered]
}

export default function AppSidebar({ active }: AppSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [industry, setIndustry] = useState<Industry>('corrugated')
  const [companyName, setCompanyName] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { data } = await supabase
          .from('company_profiles')
          .select('industry, company_name')
          .eq('user_id', user.id)
          .single()
        if (data?.industry) setIndustry(data.industry as Industry)
        if (data?.company_name) setCompanyName(data.company_name)
      } catch {
        // fallback to corrugated
      }
    }
    loadProfile()
  }, [])

  const navItems = getNavItems(industry)

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

      {/* Mobile Header */}
      <div className="mobile-header" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(10,15,30,0.98)', borderBottom: '1px solid rgba(148,163,184,0.16)', padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(12px)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>BoxFlow OS</span>
        </a>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
          <div style={{ width: 22, height: 2, background: '#94a3b8', marginBottom: 5 }} />
          <div style={{ width: 22, height: 2, background: '#94a3b8', marginBottom: 5 }} />
          <div style={{ width: 22, height: 2, background: '#94a3b8' }} />
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.6)' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 260, background: '#0a0f1e', borderRight: '1px solid rgba(148,163,184,0.12)', overflowY: 'auto', paddingTop: 60 }}>
            {navItems.map(item => (
              <a key={item.key} href={item.href} className="nav-link" style={{ display: 'block', padding: '11px 20px', fontSize: 14, fontWeight: 600, color: active === item.key ? '#fff' : '#64748b', background: active === item.key ? 'rgba(37,99,235,0.18)' : 'transparent', textDecoration: 'none', borderLeft: active === item.key ? '3px solid #3b82f6' : '3px solid transparent', transition: 'all 0.15s ease' }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="sidebar-desktop" style={{ width: 220, minHeight: '100vh', background: 'rgba(10,15,30,0.98)', borderRight: '1px solid rgba(148,163,184,0.12)', display: 'flex', flexDirection: 'column' as const, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 12 }}>
            <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            <div>
              <div style={{ fontWeight: 900, color: '#fff', fontSize: 15, lineHeight: 1.2 }}>BoxFlow OS</div>
              <div style={{ fontSize: 10, color: '#334155', fontWeight: 600 }}>Enterprise Operations Suite</div>
            </div>
          </a>

          {/* Industry Badge */}
          <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{industryIcons[industry]}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {companyName || industryLabels[industry]}
              </div>
              <div style={{ fontSize: 10, color: '#334155' }}>{industryLabels[industry]}</div>
            </div>
            <a href="/industry-setup" title="Change industry" style={{ fontSize: 12, color: '#334155', textDecoration: 'none', flexShrink: 0 }}>⚙</a>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          <div style={{ padding: '8px 16px 4px', fontSize: 10, color: '#334155', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1.5 }}>Operations</div>
          {navItems.map(item => (
            <a key={item.key} href={item.href} className="nav-link" style={{ display: 'block', padding: '9px 16px', fontSize: 13, fontWeight: 600, color: active === item.key ? '#fff' : '#64748b', background: active === item.key ? 'rgba(37,99,235,0.18)' : 'transparent', textDecoration: 'none', borderLeft: active === item.key ? '3px solid #3b82f6' : '3px solid transparent', transition: 'all 0.15s ease', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Notifications */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(148,163,184,0.1)' }}>
          <div style={{ fontSize: 10, color: '#334155', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 8 }}>Notifications</div>
          <NotificationSystem />
        </div>
      </div>
    </>
  )
}