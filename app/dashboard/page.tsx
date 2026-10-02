'use client'
import React, { useEffect, useState, useRef } from 'react'
import AppSidebar from '@/components/AppSidebar'
import { supabase } from '@/lib/supabase'

type Industry = 'corrugated' | 'steel' | 'food' | 'trucking' | 'warehousing' | 'general'

const INDUSTRY_CONFIG: Record<Industry, {
  label: string
  icon: string
  color: string
  kpi1: string
  kpi2: string
  kpi3: string
  kpi4: string
  productionLink: string
  productionLabel: string
  alerts: { level: string; text: string }[]
}> = {
  corrugated: {
    label: 'Corrugated & Paper',
    icon: '📦',
    color: '#3b82f6',
    kpi1: 'Total Orders',
    kpi2: 'In Transit',
    kpi3: 'Pending',
    kpi4: 'Delivered',
    productionLink: '/production-v2',
    productionLabel: 'Corrugator Production',
    alerts: [
      { level: 'high', text: 'Machine R6 DOWN — feed issue detected. Maintenance dispatched.' },
      { level: 'warning', text: 'ORD-1003 delayed 2hrs — client notification sent automatically.' },
      { level: 'info', text: 'TRK-305 rerouted — AI saved 18 min on Nashville → Dallas run.' },
      { level: 'success', text: 'Production Line R8 running at 96% efficiency — above target.' },
      { level: 'warning', text: 'Driver Marcus Reed 22 min late — auto-alert sent to dispatch.' },
      { level: 'high', text: 'Inventory low: Corrugated board at 12% — reorder triggered.' },
      { level: 'success', text: 'ORD-1007 delivered on time — client satisfaction logged.' },
      { level: 'info', text: 'AI optimized 3 routes — estimated savings: $1,240 today.' },
    ],
  },
  steel: {
    label: 'Steel & Metal Fabrication',
    icon: '🏗️',
    color: '#64748b',
    kpi1: 'Total Orders',
    kpi2: 'In Production',
    kpi3: 'Pending',
    kpi4: 'Shipped',
    productionLink: '/production-v2',
    productionLabel: 'Mill Production Floor',
    alerts: [
      { level: 'high', text: 'Furnace #2 temperature out of range — operator alerted.' },
      { level: 'warning', text: 'ORD-2204 delayed — steel coil shortage, procurement notified.' },
      { level: 'info', text: 'TRK-305 rerouted — AI saved 22 min on Chicago → Dallas run.' },
      { level: 'success', text: 'Mill Line 3 running at 94% efficiency — above target.' },
      { level: 'warning', text: 'Scrap rate at 4.2% — above 3% threshold. Review in progress.' },
      { level: 'high', text: 'Inventory low: Hot-rolled coil at 8% — reorder triggered.' },
      { level: 'success', text: 'ORD-2198 shipped on time — client confirmation received.' },
      { level: 'info', text: 'AI optimized 2 routes — estimated savings: $980 today.' },
    ],
  },
  food: {
    label: 'Food & Beverage',
    icon: '🍕',
    color: '#f59e0b',
    kpi1: 'Total Batches',
    kpi2: 'In Production',
    kpi3: 'Pending',
    kpi4: 'Fulfilled',
    productionLink: '/production-v2',
    productionLabel: 'Batch Production Floor',
    alerts: [
      { level: 'high', text: 'Mixer #3 temperature alert — HACCP threshold exceeded. Line paused.' },
      { level: 'warning', text: 'Batch B-1042 delayed — ingredient shortage flagged by procurement.' },
      { level: 'info', text: 'Delivery TRK-201 rerouted — AI saved 15 min on route to Houston.' },
      { level: 'success', text: 'Line 2 batch yield at 97.4% — above 95% target.' },
      { level: 'warning', text: 'Cold storage Unit 4 at 38°F — approaching upper limit.' },
      { level: 'high', text: 'Inventory low: Packaging film at 11% — reorder triggered.' },
      { level: 'success', text: 'Order B-1038 delivered on time — client satisfaction logged.' },
      { level: 'info', text: 'AI optimized 4 delivery routes — savings: $1,580 today.' },
    ],
  },
  trucking: {
    label: 'Trucking & Freight',
    icon: '🚛',
    color: '#22c55e',
    kpi1: 'Total Loads',
    kpi2: 'In Transit',
    kpi3: 'Unassigned',
    kpi4: 'Delivered',
    productionLink: '/dispatch-v2',
    productionLabel: 'Freight Dispatch Board',
    alerts: [
      { level: 'high', text: 'TRK-412 breakdown on I-35 — roadside assistance dispatched.' },
      { level: 'warning', text: 'LD-1003 pickup window closing in 45 min — driver alerted.' },
      { level: 'info', text: 'TRK-305 rerouted — AI saved 28 min avoiding I-40 congestion.' },
      { level: 'success', text: 'Driver Angela Brooks delivered LD-1001 on time — 5-star rating.' },
      { level: 'warning', text: 'Marcus Reed HOS limit in 2 hours — dispatch notified.' },
      { level: 'high', text: '3 loads unassigned for next 6 hours — AI recommending drivers.' },
      { level: 'success', text: 'LD-998 rate confirmation received — $1,850 locked.' },
      { level: 'info', text: 'AI optimized 5 routes — fuel savings estimated at $2,100 today.' },
    ],
  },
  warehousing: {
    label: 'Warehousing & Distribution',
    icon: '🏪',
    color: '#a855f7',
    kpi1: 'Total Orders',
    kpi2: 'Picking',
    kpi3: 'Pending',
    kpi4: 'Shipped',
    productionLink: '/production-v2',
    productionLabel: 'Warehouse Floor',
    alerts: [
      { level: 'high', text: 'Dock Door 7 sensor offline — maintenance dispatched.' },
      { level: 'warning', text: 'ORD-5521 pick list error — supervisor review required.' },
      { level: 'info', text: 'TRK-201 rerouted — AI saved 19 min on outbound route.' },
      { level: 'success', text: 'Zone C pick rate at 112 units/hr — above 100 target.' },
      { level: 'warning', text: 'SKU-8821 inventory below reorder point — purchasing alerted.' },
      { level: 'high', text: 'Receiving dock backed up — 3 inbound trucks waiting.' },
      { level: 'success', text: 'ORD-5498 shipped same day — SLA met.' },
      { level: 'info', text: 'AI slot optimization complete — 8% pick efficiency gain projected.' },
    ],
  },
  general: {
    label: 'General Manufacturing',
    icon: '🏭',
    color: '#ef4444',
    kpi1: 'Total Orders',
    kpi2: 'In Production',
    kpi3: 'Pending',
    kpi4: 'Completed',
    productionLink: '/production-v2',
    productionLabel: 'Production Floor',
    alerts: [
      { level: 'high', text: 'Line 4 equipment fault — maintenance team dispatched.' },
      { level: 'warning', text: 'ORD-3301 delayed 3hrs — customer notification sent.' },
      { level: 'info', text: 'Delivery TRK-305 rerouted — AI saved 21 min.' },
      { level: 'success', text: 'Line 2 running at 98% OEE — best of week.' },
      { level: 'warning', text: 'Operator J. Smith running 18 min late — supervisor notified.' },
      { level: 'high', text: 'Raw material stock at 9% — procurement order triggered.' },
      { level: 'success', text: 'ORD-3289 completed on time — quality check passed.' },
      { level: 'info', text: 'AI optimized 3 production sequences — saves 2.4 hrs today.' },
    ],
  },
}

const STATUSES = ['Pending', 'Assigned', 'Dispatched', 'In Transit', 'Delivered']

const TRUCK_POSITIONS = [
  { id: 'TRK-201', lat: 35.4676, lng: -97.5164 },
  { id: 'TRK-305', lat: 35.4822, lng: -97.4301 },
  { id: 'TRK-412', lat: 35.5901, lng: -97.5487 },
  { id: 'TRK-518', lat: 35.3912, lng: -97.5234 },
]

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [demoRunning, setDemoRunning] = useState(false)
  const [demoAlerts, setDemoAlerts] = useState<any[]>([])
  const [demoPulse, setDemoPulse] = useState(0)
  const [industry, setIndustry] = useState<Industry>('corrugated')
  const [companyName, setCompanyName] = useState('')
  const demoRef = useRef<any>(null)
  const alertIndexRef = useRef(0)
  const truckPositionsRef = useRef(TRUCK_POSITIONS.map(t => ({ ...t })))

  const config = INDUSTRY_CONFIG[industry]

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
      } catch { /* use default */ }
    }
    loadProfile()
  }, [])

  async function loadDashboard() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadDashboard()
    const channel = supabase.channel('dashboard-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadDashboard())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  function startDemo() {
    setDemoRunning(true)
    setDemoAlerts([])
    alertIndexRef.current = 0
    demoRef.current = setInterval(async () => {
      setDemoPulse(p => p + 1)
      const alert = config.alerts[alertIndexRef.current % config.alerts.length]
      alertIndexRef.current++
      setDemoAlerts(prev => [{ ...alert, id: Date.now() }, ...prev].slice(0, 5))
      truckPositionsRef.current = truckPositionsRef.current.map(truck => ({
        ...truck,
        lat: truck.lat + (Math.random() - 0.5) * 0.008,
        lng: truck.lng + (Math.random() - 0.5) * 0.008,
      }))
      const { data: allOrders } = await supabase.from('orders').select('id, status').limit(8)
      if (allOrders && allOrders.length > 0) {
        const randomOrder = allOrders[Math.floor(Math.random() * allOrders.length)]
        const currentIndex = STATUSES.indexOf(randomOrder.status)
        const nextStatus = STATUSES[Math.min(currentIndex + 1, STATUSES.length - 1)]
        const truck = truckPositionsRef.current[Math.floor(Math.random() * truckPositionsRef.current.length)]
        await supabase.from('orders').update({ status: nextStatus, truck_lat: truck.lat, truck_lng: truck.lng }).eq('id', randomOrder.id)
      }
      await loadDashboard()
    }, 3000)
  }

  function stopDemo() {
    setDemoRunning(false)
    setDemoAlerts([])
    if (demoRef.current) { clearInterval(demoRef.current); demoRef.current = null }
  }

  useEffect(() => { return () => { if (demoRef.current) clearInterval(demoRef.current) } }, [])

  const total = orders.length
  const inTransit = orders.filter(o => ['in transit', 'dispatched'].includes((o.status || '').toLowerCase())).length
  const pending = orders.filter(o => (o.status || '').toLowerCase().includes('pending')).length
  const delivered = orders.filter(o => (o.status || '').toLowerCase().includes('delivered')).length

  function alertColor(level: string) {
    if (level === 'high') return { bg: 'rgba(127,29,29,0.4)', border: 'rgba(248,113,113,0.4)', color: '#fecaca', dot: '#ef4444' }
    if (level === 'warning') return { bg: 'rgba(120,53,15,0.4)', border: 'rgba(251,191,36,0.4)', color: '#fde68a', dot: '#f59e0b' }
    if (level === 'success') return { bg: 'rgba(20,83,45,0.4)', border: 'rgba(74,222,128,0.4)', color: '#bbf7d0', dot: '#22c55e' }
    return { bg: 'rgba(30,64,175,0.4)', border: 'rgba(96,165,250,0.4)', color: '#bfdbfe', dot: '#3b82f6' }
  }

  const quickLinks = [
    { href: '/command-center', label: 'Command Center', color: '#3b82f6' },
    { href: '/orders', label: 'Orders', color: '#6366f1' },
    { href: '/dispatch', label: 'Dispatch', color: '#8b5cf6' },
    { href: '/fleet-map', label: 'Fleet Map', color: '#0ea5e9' },
    { href: '/driver', label: 'Driver', color: '#14b8a6' },
    { href: config.productionLink, label: config.productionLabel, color: config.color },
    { href: '/equipment', label: 'Equipment', color: '#f59e0b' },
    { href: '/hr', label: 'HR', color: '#ef4444' },
    { href: '/executive', label: 'AI Panel', color: '#a855f7' },
    { href: '/settings', label: 'Settings', color: '#94a3b8' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #050816 0%, #0b1220 100%)', padding: 20, gap: 24 }}>
      <AppSidebar active="dashboard" />
      <main style={{ flex: 1, color: '#fff', minWidth: 0 }}>

        {demoRunning && (
          <div style={{ marginBottom: 16, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 16, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
              <span style={{ fontWeight: 800, color: '#60a5fa', fontSize: 14, letterSpacing: 1 }}>DEMO MODE ACTIVE — Live simulation running</span>
            </div>
            <button onClick={stopDemo} style={{ padding: '6px 16px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Stop Demo</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap' as const, gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{config.icon}</span>
              <div style={{ padding: '4px 12px', borderRadius: 999, background: `${config.color}15`, border: `1px solid ${config.color}30`, color: config.color, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1 }}>
                {companyName || config.label}
              </div>
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 900, color: '#fff' }}>Executive Dashboard</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 15 }}>Live operations overview — orders, fleet, production, and workforce.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
            <a href="/industry-setup" style={{ padding: '10px 18px', background: 'rgba(99,132,255,0.08)', border: '1px solid rgba(99,132,255,0.2)', color: '#64748b', borderRadius: 12, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>⚙ Change Industry</a>
            {!demoRunning ? (
              <button onClick={startDemo} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', border: '1px solid rgba(139,92,246,0.4)', color: '#fff', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                🚀 Start Demo
              </button>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: 13, paddingTop: 8 }}>Pulse: {demoPulse} updates</div>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: config.kpi1, value: total, color: config.color },
            { label: config.kpi2, value: inTransit, color: '#38bdf8' },
            { label: config.kpi3, value: pending, color: '#f59e0b' },
            { label: config.kpi4, value: delivered, color: '#22c55e' },
          ].map(k => (
            <div key={k.label} style={{ background: 'rgba(15,23,42,0.92)', borderTop: `3px solid ${k.color}`, borderRadius: 20, padding: 20 }}>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontWeight: 700, textTransform: 'uppercase' as const }}>{k.label}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: k.color }}>{loading ? '...' : k.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {demoRunning && (
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20, gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 14, textTransform: 'uppercase' as const, letterSpacing: 0.7 }}>🔴 Live AI Alerts — {config.label}</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {demoAlerts.length === 0 ? (
                  <div style={{ color: '#94a3b8' }}>Initializing alerts...</div>
                ) : demoAlerts.map((alert, i) => {
                  const c = alertColor(alert.level)
                  return (
                    <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: '12px 16px', opacity: 1 - i * 0.15 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0, boxShadow: `0 0 8px ${c.dot}` }} />
                      <span style={{ color: c.color, fontWeight: 700, fontSize: 14 }}>{alert.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 14, textTransform: 'uppercase' as const }}>Quick Access</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {quickLinks.map(link => (
                <a key={link.href} href={link.href} style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: `1px solid ${link.color}25`, borderRadius: 12, padding: 12, color: link.color, fontWeight: 700, fontSize: 13 }}>{link.label}</a>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 14, textTransform: 'uppercase' as const }}>System Status</div>
            {[
              { label: 'Database', value: 'Supabase Connected', ok: true },
              { label: 'Map Provider', value: 'Mapbox Active', ok: true },
              { label: 'Realtime', value: 'Live', ok: true },
              { label: 'Demo Engine', value: demoRunning ? 'RUNNING' : 'Standby', ok: demoRunning },
              { label: 'AI Engine', value: 'Online', ok: true },
              { label: 'Industry', value: config.label, ok: true },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                <span style={{ color: '#cbd5e1', fontWeight: 700, fontSize: 14 }}>{s.label}</span>
                <span style={{ color: s.ok ? '#22c55e' : '#64748b', fontWeight: 900, fontSize: 14 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, overflow: 'hidden' }}>
          <div style={{ padding: '18px', borderBottom: '1px solid rgba(148,163,184,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Recent {industry === 'trucking' ? 'Loads' : industry === 'food' ? 'Batches' : 'Orders'}</div>
            {demoRunning && <div style={{ color: '#22c55e', fontSize: 13, fontWeight: 700 }}>● Live updating</div>}
          </div>
          {loading ? <div style={{ padding: 24, color: '#94a3b8' }}>Loading...</div> : (
            <div style={{ overflowX: 'auto' as const }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ background: 'rgba(2,6,23,0.35)' }}>
                    <th style={{ padding: '12px 18px', fontSize: 12, color: '#94a3b8', textAlign: 'left' as const, fontWeight: 800 }}>
                      {industry === 'trucking' ? 'LOAD' : industry === 'food' ? 'BATCH' : 'ORDER'}
                    </th>
                    <th style={{ padding: '12px 18px', fontSize: 12, color: '#94a3b8', textAlign: 'left' as const, fontWeight: 800 }}>CLIENT</th>
                    <th style={{ padding: '12px 18px', fontSize: 12, color: '#94a3b8', textAlign: 'left' as const, fontWeight: 800 }}>
                      {industry === 'trucking' ? 'TRUCK' : 'ASSIGNED TO'}
                    </th>
                    <th style={{ padding: '12px 18px', fontSize: 12, color: '#94a3b8', textAlign: 'left' as const, fontWeight: 800 }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 8).map(order => {
                    const s = (order.status || '').toLowerCase()
                    const statusStyle = s.includes('transit') || s.includes('dispatch')
                      ? { bg: 'rgba(59,130,246,0.14)', color: '#93c5fd', border: 'rgba(59,130,246,0.3)' }
                      : s.includes('deliver') || s.includes('complet') || s.includes('fulfill')
                      ? { bg: 'rgba(34,197,94,0.14)', color: '#86efac', border: 'rgba(34,197,94,0.3)' }
                      : s.includes('pending')
                      ? { bg: 'rgba(148,163,184,0.14)', color: '#cbd5e1', border: 'rgba(148,163,184,0.3)' }
                      : { bg: 'rgba(245,158,11,0.14)', color: '#fcd34d', border: 'rgba(245,158,11,0.3)' }
                    return (
                      <tr key={order.id} style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                        <td style={{ padding: '14px 18px', color: '#fff', fontWeight: 700 }}>
                          {order.order_number ? 'ORD-' + order.order_number : order.load_name || ('ORD-' + (order.id || '').slice(0, 8))}
                        </td>
                        <td style={{ padding: '14px 18px', color: '#e2e8f0' }}>{order.client_name || 'N/A'}</td>
                        <td style={{ padding: '14px 18px', color: '#e2e8f0' }}>{order.assigned_truck_id || 'Unassigned'}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ padding: '5px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800, background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}