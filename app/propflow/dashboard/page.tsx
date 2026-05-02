'use client'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [units, setUnits] = useState<any[]>([])
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const headers = { 'apikey': key!, 'Authorization': `Bearer ${key}` }

    Promise.all([
      fetch(`${url}/rest/v1/units?select=*`, { headers }).then(r => r.json()),
      fetch(`${url}/rest/v1/work_orders?select=*&status=eq.Pending`, { headers }).then(r => r.json()),
      fetch(`${url}/rest/v1/tenants?select=*&status=eq.Active`, { headers }).then(r => r.json()),
    ]).then(([u, w, t]) => {
      setUnits(Array.isArray(u) ? u : [])
      setWorkOrders(Array.isArray(w) ? w : [])
      setTenants(Array.isArray(t) ? t : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const occupied = units.filter(u => u.status === 'Occupied').length
  const vacant = units.filter(u => u.status === 'Vacant').length
  const urgent = workOrders.filter(w => w.priority === 'Urgent').length

  return (
    <main style={{ minHeight: '100vh', background: '#050d1a', color: '#e2e8f0', fontFamily: 'Inter,Arial,sans-serif' }}>
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/assets/logo.png" alt="PropFlow OS" style={{ height: 44, objectFit: "contain" }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#4f8ef7', letterSpacing: 1 }}>PropFlow OS</div>
            <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>by M.A.D.E Technologies</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
          {['Dashboard', 'Units', 'Tenants', 'Maintenance', 'GPS', 'Finance', 'Community'].map(item => (
            <a key={item} href={`/${item === 'Dashboard' ? 'propflow/dashboard' : 'propflow/' + item.toLowerCase()}`}
              style={{ padding: '6px 12px', fontSize: 11, fontWeight: 700, color: item === 'Dashboard' ? '#4f8ef7' : '#475569', borderRadius: 7, textDecoration: 'none', background: item === 'Dashboard' ? 'rgba(79,142,247,0.1)' : 'transparent' }}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Good morning, Kenneth ðŸ‘‹</h1>
        <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Penn Station Apartments â€” 1920 Heritage Park Dr, OKC 73120</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 20 }}>
          {[
            { title: 'Total Units', value: loading ? '...' : units.length, sub: `${occupied} Occupied / ${vacant} Vacant`, color: '#4f8ef7' },
            { title: 'Active Tenants', value: loading ? '...' : tenants.length, sub: 'Current leases', color: '#22c55e' },
            { title: 'Open Work Orders', value: loading ? '...' : workOrders.length, sub: `${urgent} urgent`, color: '#f59e0b' },
            { title: 'Property Health', value: '91%', sub: 'Overall condition', color: '#a855f7' },
          ].map(k => (
            <div key={k.title} style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 16, borderTop: `3px solid ${k.color}` }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 }}>{k.title}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 6 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 14 }}>Property Overview</div>
          {[
            ['Address', '1920 Heritage Park Drive, OKC 73120'],
            ['Phone', '405-755-9246'],
            ['Buildings', '17 Buildings â€” 1900 through 1932'],
            ['Unit Types', 'A1 (504 sqft) â€¢ A2 (640 sqft) â€¢ A3 (816 sqft) â€¢ A4 (800 sqft) â€¢ B2/B3 (973â€“1,034 sqft) â€¢ C1 (1,240 sqft)'],
            ['Amenities', '2 Pools â€¢ Bark Park â€¢ 2 Playgrounds â€¢ Picnic Area â€¢ Leasing Center â€¢ 3 Mailbox Stations'],
            ['Managed By', 'Kenneth Covington â€” M.A.D.E Technologies'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(99,132,255,0.07)', flexWrap: 'wrap' as const, gap: 8 }}>
              <span style={{ fontSize: 12, color: '#475569' }}>{l}</span>
              <span style={{ fontSize: 12, color: '#cbd5e1', textAlign: 'right' as const, maxWidth: 500 }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 14 }}>Quick Actions</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {[
              { label: 'Create Work Order', color: '#4f8ef7', href: '/propflow/maintenance' },
              { label: 'Add Tenant', color: '#22c55e', href: '/propflow/tenants' },
              { label: 'Send Notice', color: '#a855f7', href: '/propflow/community' },
              { label: 'Run Payroll', color: '#f59e0b', href: '/propflow/finance' },
              { label: 'View GPS', color: '#ef4444', href: '/propflow/gps' },
              { label: 'New Application', color: '#22c55e', href: '/propflow/apply' },
            ].map(b => (
              <a key={b.label} href={b.href} style={{ padding: '9px 16px', borderRadius: 9, fontSize: 12, fontWeight: 700, color: '#fff', background: b.color, textDecoration: 'none' }}>
                {b.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 14 }}>Open Work Orders</div>
          {loading ? (
            <div style={{ fontSize: 13, color: '#475569', padding: '20px 0', textAlign: 'center' as const }}>Loading...</div>
          ) : workOrders.length === 0 ? (
            <div style={{ fontSize: 13, color: '#475569', padding: '20px 0', textAlign: 'center' as const }}>No open work orders â€” all clear!</div>
          ) : workOrders.slice(0, 5).map(wo => (
            <div key={wo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{wo.description}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{wo.assigned_to || 'Unassigned'}</div>
              </div>
              <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: wo.priority === 'Urgent' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: wo.priority === 'Urgent' ? '#ef4444' : '#f59e0b' }}>
                {wo.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

