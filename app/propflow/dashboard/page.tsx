'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function dbGet(table: string, params: string) {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    })
    return res.json()
  } catch { return [] }
}

const NAV_SECTIONS = [
  {
    label: 'PROPERTY',
    links: [
      { href: '/propflow/dashboard',    label: 'Dashboard',    icon: '🏠' },
      { href: '/propflow/units',         label: 'Units',        icon: '🚪' },
      { href: '/propflow/tenants',       label: 'Tenants',      icon: '👥' },
      { href: '/propflow/maintenance',   label: 'Maintenance',  icon: '🔧' },
      { href: '/propflow/gps',           label: 'GPS Tracker',  icon: '🚌' },
    ]
  },
  {
    label: 'TENANT SERVICES',
    links: [
      { href: '/propflow/tenant-portal',       label: 'Tenant Portal',       icon: '📱' },
      { href: '/propflow/income-verification', label: 'Income Verification', icon: '📋' },
      { href: '/propflow/community',           label: 'Community Board',     icon: '💬' },
    ]
  },
  {
    label: 'FINANCE',
    links: [
      { href: '/propflow/accounting',    label: 'Accounting',   icon: '📊' },
      { href: '/propflow/ach-payments',  label: 'ACH Payments', icon: '🏦' },
      { href: '/propflow/payroll',       label: 'Payroll & HR', icon: '💸' },
    ]
  },
  {
    label: 'ANALYTICS',
    links: [
      { href: '/propflow/analytics',    label: 'Analytics',    icon: '📈' },
    ]
  },
  {
    label: 'ACCOUNT',
    links: [
      { href: '/propflow/plans',        label: 'Plans & Pricing', icon: '⭐' },
    ]
  },
]

export default function PropFlowDashboard() {
  const [units, setUnits]           = useState<any[]>([])
  const [tenants, setTenants]       = useState<any[]>([])
  const [maintenance, setMaintenance] = useState<any[]>([])
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeNav, setActiveNav]   = useState('/propflow/dashboard')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    Promise.all([
      dbGet('pf_units', 'select=*'),
      dbGet('pf_tenants', 'select=*&status=eq.active'),
      dbGet('pf_maintenance_requests', 'select=*&order=created_at.desc&limit=5'),
      dbGet('pf_maintenance_requests', 'select=*&status=in.(open,in_progress)'),
    ]).then(([u, t, m, w]) => {
      setUnits(Array.isArray(u) ? u : [])
      setTenants(Array.isArray(t) ? t : [])
      setMaintenance(Array.isArray(m) ? m : [])
      setWorkOrders(Array.isArray(w) ? w : [])
      setLoading(false)
    })
  }, [])

  const totalUnits   = units.length || 96
  const occupied     = units.filter(u => u.status === 'Occupied').length || 75
  const vacant       = units.filter(u => u.status === 'Vacant').length   || 21
  const occupancy    = Math.round((occupied / totalUnits) * 100)
  const urgent       = workOrders.filter(m => m.priority === 'urgent').length

  const quickActions = [
    { label: 'Create Work Order',    href: '/propflow/maintenance',          color: '#4f8ef7',  icon: '🔧' },
    { label: 'Add Tenant',           href: '/propflow/tenants',              color: '#22c55e',  icon: '👤' },
    { label: 'Send Notice',          href: '/propflow/tenant-portal',        color: '#a855f7',  icon: '📢' },
    { label: 'Run Payroll',          href: '/propflow/payroll',              color: '#f59e0b',  icon: '💸' },
    { label: 'View GPS',             href: '/propflow/gps',                  color: '#ef4444',  icon: '🚌' },
    { label: 'New Application',      href: '/propflow/income-verification',  color: '#22c55e',  icon: '📋' },
    { label: 'View Analytics',       href: '/propflow/analytics',            color: '#4f8ef7',  icon: '📈' },
    { label: 'ACH Payment',          href: '/propflow/ach-payments',         color: '#22c55e',  icon: '🏦' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: '#e2e8f0', fontFamily: 'system-ui,sans-serif', display: 'flex' }}>
      <style>{`
        .nav-link{transition:all 0.15s;text-decoration:none;display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:9px;font-size:13px;font-weight:600;color:#475569;cursor:pointer}
        .nav-link:hover{background:rgba(79,142,247,0.08);color:#94a3b8}
        .nav-link.active{background:rgba(79,142,247,0.12);color:#4f8ef7}
        .tab-btn{transition:all 0.15s;cursor:pointer;border:none;font-family:system-ui}
        .row{transition:background 0.12s}.row:hover{background:rgba(79,142,247,0.04)!important}
        .action-card{transition:transform 0.15s,border-color 0.15s}.action-card:hover{transform:translateY(-2px)}
        @media(max-width:768px){.sidebar{display:none}.sidebar.open{display:flex}}
      `}</style>

      {/* SIDEBAR */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}
        style={{ width: 220, background: '#070f1f', borderRight: '1px solid rgba(79,142,247,0.1)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', flexShrink: 0, zIndex: 40 }}>

        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(79,142,247,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/assets/logo.png" alt="PropFlow" style={{ height: 32 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#4f8ef7' }}>PropFlow OS</div>
              <div style={{ fontSize: 9, color: '#334155', letterSpacing: 1 }}>by M.A.D.E Technologies</div>
            </div>
          </div>
        </div>

        {/* Nav sections */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {NAV_SECTIONS.map((section, si) => (
            <div key={si}>
              <div style={{ fontSize: 9, color: '#1e3a5f', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', paddingLeft: 12, marginBottom: 6 }}>
                {section.label}
              </div>
              {section.links.map((link, li) => (
                <Link key={li} href={link.href}
                  className={`nav-link${activeNav === link.href ? ' active' : ''}`}
                  onClick={() => setActiveNav(link.href)}>
                  <span style={{ fontSize: 16 }}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(79,142,247,0.1)' }}>
          <Link href="/propflow/plans" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(29,78,216,0.15),rgba(168,85,247,0.1))', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: '#a855f7', fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>PROFESSIONAL PLAN</div>
              <div style={{ fontSize: 11, color: '#475569' }}>All features active</div>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top header */}
        <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(79,142,247,0.1)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30, flexShrink: 0, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="tab-btn" onClick={() => setSidebarOpen(o => !o)}
              style={{ display: 'none', padding: 8, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 8, color: '#4f8ef7', fontSize: 16 }}>
              ☰
            </button>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Penn Station Apartments</div>
              <div style={{ fontSize: 11, color: '#334155' }}>1920 Heritage Park Drive, OKC 73120 · 405-755-9246</div>
            </div>
          </div>

          {/* Top nav — scrollable on mobile */}
          <nav style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none' as any, WebkitOverflowScrolling: 'touch' as any, flexShrink: 1, minWidth: 0 }}>
            {[
              { href: '/propflow/analytics',  label: 'Analytics' },
              { href: '/propflow/accounting', label: 'Finance' },
              { href: '/propflow/payroll',    label: 'Payroll' },
              { href: '/propflow/plans',      label: '⭐ Plans' },
            ].map((l, i) => (
              <Link key={i} href={l.href}
                style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, color: '#475569', borderRadius: 7, textDecoration: 'none', background: 'transparent', flexShrink: 0, whiteSpace: 'nowrap' as const, transition: 'all 0.15s' }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', maxWidth: 1100, width: '100%' }}>

          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{greeting}, Kenneth</h1>
          <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Penn Station Apartments — 1920 Heritage Park Dr, OKC 73120</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'TOTAL UNITS',      value: totalUnits,             sub: `${occupied} Occupied / ${vacant} Vacant`, color: '#4f8ef7', href: '/propflow/units' },
              { label: 'ACTIVE TENANTS',   value: tenants.length || 10,  sub: 'Current leases',   color: '#22c55e', href: '/propflow/tenants' },
              { label: 'OPEN WORK ORDERS', value: workOrders.length || 5, sub: `${urgent} urgent`, color: '#f59e0b', href: '/propflow/maintenance' },
              { label: 'OCCUPANCY RATE',   value: `${occupancy}%`,        sub: 'Overall occupancy', color: '#a855f7', href: '/propflow/analytics' },
            ].map((s, i) => (
              <Link key={i} href={s.href} style={{ textDecoration: 'none' }}>
                <div className="action-card" style={{ background: '#070f1f', border: `1px solid ${s.color}25`, borderRadius: 14, padding: '18px 20px', cursor: 'pointer' }}>
                  <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>{s.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#334155' }}>{s.sub}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Property overview */}
          <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.12)', borderRadius: 14, padding: 22, marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' }}>Property Overview</div>
            {[
              ['Address',    '1920 Heritage Park Drive, OKC 73120'],
              ['Phone',      '405-755-9246'],
              ['Buildings',  '17 Buildings — 1900 through 1932'],
              ['Unit Types', 'A1 (504 sqft) · A2 (640 sqft) · A3 (816 sqft) · A4 (800 sqft) · B2/B3 (973-1,034 sqft) · C1 (1,240 sqft)'],
              ['Amenities',  '2 Pools · Bark Park · 2 Playgrounds · Picnic Area · Leasing Center · 3 Mailbox Stations'],
              ['Managed By', 'Kenneth Covington — M.A.D.E Technologies'],
            ].map(([label, value], i, arr) => (
              <div key={i} className="row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(79,142,247,0.07)' : 'none', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
                <span style={{ fontSize: 12, color: '#94a3b8', textAlign: 'right', maxWidth: '65%' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.12)', borderRadius: 14, padding: 22, marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' }}>Quick Actions</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {quickActions.map((a, i) => (
                <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
                  <div className="action-card" style={{ padding: '9px 16px', background: `${a.color}15`, border: `1px solid ${a.color}30`, borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{a.icon}</span>
                    <span style={{ color: a.color, fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>{a.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Feature links grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { icon: '📊', label: 'Business Analytics',   sub: 'Occupancy, leases, vacancy',    href: '/propflow/analytics',          color: '#4f8ef7' },
              { icon: '💸', label: 'Payroll & HR',         sub: 'Pay stubs, 401k, taxes',         href: '/propflow/payroll',             color: '#a855f7' },
              { icon: '🏦', label: 'ACH Payments',         sub: 'Free bank transfers',             href: '/propflow/ach-payments',        color: '#22c55e' },
              { icon: '📋', label: 'Income Verification',  sub: 'Document upload & review',        href: '/propflow/income-verification', color: '#f59e0b' },
              { icon: '📈', label: 'Accounting',           sub: 'P&L, NOI, ledger',               href: '/propflow/accounting',          color: '#22c55e' },
              { icon: '📱', label: 'Tenant Portal',        sub: 'Billing, lease, maintenance',    href: '/propflow/tenant-portal',       color: '#4f8ef7' },
            ].map((f, i) => (
              <Link key={i} href={f.href} style={{ textDecoration: 'none' }}>
                <div className="action-card" style={{ background: '#070f1f', border: `1px solid ${f.color}18`, borderRadius: 14, padding: '16px 18px', cursor: 'pointer', height: '100%' }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#f0f6ff', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{f.sub}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Open work orders */}
          <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.12)', borderRadius: 14, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>Recent Work Orders</div>
              <Link href="/propflow/maintenance" style={{ fontSize: 12, color: '#4f8ef7', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
            </div>
            {loading ? (
              <div style={{ color: '#475569', fontSize: 13 }}>Loading...</div>
            ) : maintenance.length === 0 ? (
              <div style={{ color: '#334155', fontSize: 13 }}>No maintenance requests yet.</div>
            ) : maintenance.map((m: any, i: number) => (
              <div key={i} className="row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < maintenance.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{m.title}</div>
                  <div style={{ fontSize: 10, color: '#334155' }}>{m.category} · {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: m.priority === 'urgent' ? '#ef4444' : m.priority === 'normal' ? '#f59e0b' : '#475569', background: 'rgba(255,255,255,0.04)', borderRadius: 4, padding: '2px 7px', textTransform: 'uppercase' }}>{m.priority}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: m.status === 'completed' ? '#22c55e' : m.status === 'in_progress' ? '#3b82f6' : '#f59e0b', background: 'rgba(255,255,255,0.04)', borderRadius: 4, padding: '2px 7px', textTransform: 'uppercase' }}>{m.status?.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}