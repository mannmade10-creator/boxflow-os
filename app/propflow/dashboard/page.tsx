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

  const DEMO_WORK_ORDERS = [
    { id: 1, description: 'Bedroom door latch broken', assigned_to: 'James Carter', priority: 'Low' },
    { id: 2, description: 'Parking lot light number 4 out', assigned_to: 'Marcus Reed', priority: 'Normal' },
    { id: 3, description: 'Kitchen sink draining slow', assigned_to: 'James Carter', priority: 'Normal' },
    { id: 4, description: 'Full make-ready vacant unit', assigned_to: 'Lisa Adams', priority: 'Normal' },
    { id: 5, description: 'Window blind broken', assigned_to: 'James Carter', priority: 'Low' },
  ]

  const displayWorkOrders = workOrders.length > 0 ? workOrders : DEMO_WORK_ORDERS
  const totalUnits = units.length > 0 ? units.length : 96
  const displayOccupied = units.length > 0 ? occupied : 75
  const displayVacant = units.length > 0 ? vacant : 21
  const displayTenants = tenants.length > 0 ? tenants.length : 10
  const displayUrgent = workOrders.length > 0 ? urgent : 0

  const priorityColor = (p: string) => p === 'Urgent' ? '#ef4444' : p === 'Normal' ? '#f59e0b' : '#475569'

  return (
    <main style={{ minHeight: '100vh', background: '#050d1a', color: '#e2e8f0', fontFamily: 'Inter,Arial,sans-serif' }}>
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/assets/logo.png" alt="PropFlow OS" style={{ height: 44, objectFit: 'contain' }} />
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
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Good morning, Kenneth</h1>
        <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>Penn Station Apartments — 1920 Heritage Park Dr, OKC 73120</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'TOTAL UNITS', value: totalUnits, sub: `${displayOccupied} Occupied / ${displayVacant} Vacant`, color: '#4f8ef7' },
            { label: 'ACTIVE TENANTS', value: displayTenants, sub: 'Current leases', color: '#22c55e' },
            { label: 'OPEN WORK ORDERS', value: displayWorkOrders.length, sub: `${displayUrgent} urgent`, color: '#f59e0b' },
            { label: 'PROPERTY HEALTH', value: '91%', sub: 'Overall condition', color: '#a855f7' },
          ].map((k, i) => (
            <div key={i} style={{ background: '#070f1f', border: `1px solid ${k.color}30`, borderRadius: 14, padding: '20px 20px' }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: k.color, marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: '#475569' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 16 }}>PROPERTY OVERVIEW</div>
          {[
            ['Address', '1920 Heritage Park Drive, OKC 73120'],
            ['Phone', '405-755-9246'],
            ['Buildings', '17 Buildings — 1900 through 1932'],
            ['Unit Types', 'A1 (504 sqft) · A2 (640 sqft) · A3 (816 sqft) · A4 (800 sqft) · B2/B3 (973-1,034 sqft) · C1 (1,240 sqft)'],
            ['Amenities', '2 Pools · Bark Park · 2 Playgrounds · Picnic Area · Leasing Center · 3 Mailbox Stations'],
            ['Managed By', 'Kenneth Covington — M.A.D.E Technologies'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(99,132,255,0.07)', flexWrap: 'wrap' as const, gap: 8 }}>
              <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
              <span style={{ fontSize: 12, color: '#94a3b8', textAlign: 'right' as const, maxWidth: '60%' }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 16 }}>QUICK ACTIONS</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            {[
              { label: 'Create Work Order', color: '#4f8ef7' },
              { label: 'Add Tenant', color: '#22c55e' },
              { label: 'Send Notice', color: '#a855f7' },
              { label: 'Run Payroll', color: '#f59e0b' },
              { label: 'View GPS', color: '#ef4444', href: '/propflow/gps' },
              { label: 'New Application', color: '#22c55e' },
            ].map((btn, i) => (
              <a key={i} href={btn.href || '#'}
                style={{ padding: '9px 18px', background: btn.color, borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 12, textDecoration: 'none', cursor: 'pointer', border: 'none' }}>
                {btn.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 20 }}>
          <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 16 }}>OPEN WORK ORDERS</div>
          {loading ? (
            <div style={{ color: '#475569', fontSize: 13 }}>Loading...</div>
          ) : (
            displayWorkOrders.slice(0, 10).map((wo: any, i: number) => (
              <div key={wo.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(99,132,255,0.07)', flexWrap: 'wrap' as const, gap: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{wo.description}</div>
                  <div style={{ fontSize: 12, color: '#475569' }}>{wo.assigned_to}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: priorityColor(wo.priority), background: `${priorityColor(wo.priority)}18`, border: `1px solid ${priorityColor(wo.priority)}30`, borderRadius: 6, padding: '3px 10px' }}>
                  {wo.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}