'use client'

import React, { useEffect, useState, useRef } from 'react'
import AppSidebar from '@/components/AppSidebar'
import { supabase } from '@/lib/supabase'

const DEMO_ALERTS = [
  { level: 'high', text: 'Machine R6 DOWN — feed issue detected. Maintenance dispatched.' },
  { level: 'warning', text: 'ORD-1003 delayed 2hrs — client notification sent automatically.' },
  { level: 'info', text: 'TRK-305 rerouted — AI saved 18 min on Nashville → Dallas run.' },
  { level: 'success', text: 'Production Line R8 running at 96% efficiency — above target.' },
  { level: 'warning', text: 'Driver Marcus Reed 22 min late — auto-alert sent to dispatch.' },
  { level: 'high', text: 'Inventory low: Corrugated board at 12% — reorder triggered.' },
  { level: 'success', text: 'ORD-1007 delivered on time — client satisfaction logged.' },
  { level: 'info', text: 'AI optimized 3 routes — estimated savings: $1,240 today.' },
]

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
  const demoRef = useRef<any>(null)
  const alertIndexRef = useRef(0)
  const truckPositionsRef = useRef(TRUCK_POSITIONS.map(t => ({ ...t })))

  async function loadDashboard() {
    const [ordersRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ])
    setOrders(ordersRes.data || [])
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

      // Add rotating alert
      const alert = DEMO_ALERTS[alertIndexRef.current % DEMO_ALERTS.length]
      alertIndexRef.current++
      setDemoAlerts(prev => [{ ...alert, id: Date.now() }, ...prev].slice(0, 5))

      // Move trucks
      truckPositionsRef.current = truckPositionsRef.current.map(truck => ({
        ...truck,
        lat: truck.lat + (Math.random() - 0.5) * 0.008,
        lng: truck.lng + (Math.random() - 0.5) * 0.008,
      }))

      // Update random order status in Supabase
      const { data: allOrders } = await supabase.from('orders').select('id, status').limit(8)
      if (allOrders && allOrders.length > 0) {
        const randomOrder = allOrders[Math.floor(Math.random() * allOrders.length)]
        const currentIndex = STATUSES.indexOf(randomOrder.status) 
        const nextStatus = STATUSES[Math.min(currentIndex + 1, STATUSES.length - 1)]
        const truck = truckPositionsRef.current[Math.floor(Math.random() * truckPositionsRef.current.length)]
        
        await supabase.from('orders').update({
          status: nextStatus,
          truck_lat: truck.lat,
          truck_lng: truck.lng,
        }).eq('id', randomOrder.id)
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
  const inTransit = orders.filter(o => ['in transit','dispatched'].includes((o.status||'').toLowerCase())).length
  const pending = orders.filter(o => (o.status||'').toLowerCase().includes('pending')).length
  const delivered = orders.filter(o => (o.status||'').toLowerCase().includes('delivered')).length

  function alertColor(level: string) {
    if (level === 'high') return { bg: 'rgba(127,29,29,0.4)', border: 'rgba(248,113,113,0.4)', color: '#fecaca', dot: '#ef4444' }
    if (level === 'warning') return { bg: 'rgba(120,53,15,0.4)', border: 'rgba(251,191,36,0.4)', color: '#fde68a', dot: '#f59e0b' }
    if (level === 'success') return { bg: 'rgba(20,83,45,0.4)', border: 'rgba(74,222,128,0.4)', color: '#bbf7d0', dot: '#22c55e' }
    return { bg: 'rgba(30,64,175,0.4)', border: 'rgba(96,165,250,0.4)', color: '#bfdbfe', dot: '#3b82f6' }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #050816 0%, #0b1220 100%)', padding: 20, gap: 24 }}>
      <AppSidebar active="dashboard" />
      <main style={{ flex: 1, color: '#fff', minWidth: 0 }}>

        {demoRunning && (
          <div style={{ marginBottom: 16, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 16, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e', animation: 'pulse 1s infinite' }} />
              <span style={{ fontWeight: 800, color: '#60a5fa', fontSize: 14, letterSpacing: 1 }}>DEMO MODE ACTIVE — Live simulation running</span>
            </div>
            <button onClick={stopDemo} style={{ padding: '6px 16px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Stop Demo</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>BoxFlow OS Dashboard</div>
            <h1 style={{ margin: '0 0 8px', fontSize: 40, fontWeight: 900, color: '#fff' }}>Executive Dashboard</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 15 }}>Live operations overview — orders, fleet, production, and workforce.</p>
          </div>
          {!demoRunning ? (
            <button onClick={startDemo} style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', border: '1px solid rgba(139,92,246,0.4)', color: '#fff', borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}>
              🚀 Start Demo Mode
            </button>
          ) : (
            <div style={{ color: '#94a3b8', fontSize: 13 }}>Pulse: {demoPulse} updates sent</div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 24 }}>
          <div style={{ background: 'rgba(15,23,42,0.92)', borderTop: '3px solid #3b82f6', borderRadius: 20, padding: 20 }}>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontWeight: 700 }}>TOTAL ORDERS</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#3b82f6' }}>{loading ? '...' : total}</div>
            <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 700, marginTop: 6 }}>All time</div>
          </div>
          <div style={{ background: 'rgba(15,23,42,0.92)', borderTop: '3px solid #38bdf8', borderRadius: 20, padding: 20 }}>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontWeight: 700 }}>IN TRANSIT</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#38bdf8' }}>{loading ? '...' : inTransit}</div>
            <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 700, marginTop: 6 }}>Active deliveries</div>
          </div>
          <div style={{ background: 'rgba(15,23,42,0.92)', borderTop: '3px solid #f59e0b', borderRadius: 20, padding: 20 }}>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontWeight: 700 }}>PENDING</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#f59e0b' }}>{loading ? '...' : pending}</div>
            <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 700, marginTop: 6 }}>Needs dispatch</div>
          </div>
          <div style={{ background: 'rgba(15,23,42,0.92)', borderTop: '3px solid #22c55e', borderRadius: 20, padding: 20 }}>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontWeight: 700 }}>DELIVERED</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#22c55e' }}>{loading ? '...' : delivered}</div>
            <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 700, marginTop: 6 }}>Completed</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: demoRunning ? '1fr 1fr' : '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {demoRunning && (
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20, gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.7 }}>🔴 Live AI Alerts</div>
              <div style={{ display: 'grid', gap: 10 }}>
                {demoAlerts.length === 0 ? (
                  <div style={{ color: '#94a3b8' }}>Initializing demo alerts...</div>
                ) : demoAlerts.map((alert, i) => {
                  const c = alertColor(alert.level)
                  return (
                    <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: c.bg, border: '1px solid ' + c.border, borderRadius: 12, padding: '12px 16px', opacity: 1 - i * 0.15 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0, boxShadow: '0 0 8px ' + c.dot }} />
                      <span style={{ color: c.color, fontWeight: 700, fontSize: 14 }}>{alert.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 14, textTransform: 'uppercase' }}>Quick Access</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <a href="/command-center" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12, padding: 12, color: '#3b82f6', fontWeight: 700 }}>Command Center</a>
              <a href="/orders" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: 12, color: '#6366f1', fontWeight: 700 }}>Orders</a>
              <a href="/dispatch" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 12, padding: 12, color: '#8b5cf6', fontWeight: 700 }}>Dispatch</a>
              <a href="/fleet-map" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 12, padding: 12, color: '#0ea5e9', fontWeight: 700 }}>Fleet Map</a>
              <a href="/driver" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(20,184,166,0.25)', borderRadius: 12, padding: 12, color: '#14b8a6', fontWeight: 700 }}>Driver</a>
              <a href="/production" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: 12, color: '#22c55e', fontWeight: 700 }}>Production</a>
              <a href="/equipment" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: 12, color: '#f59e0b', fontWeight: 700 }}>Equipment</a>
              <a href="/hr" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: 12, color: '#ef4444', fontWeight: 700 }}>HR</a>
              <a href="/executive" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 12, padding: 12, color: '#a855f7', fontWeight: 700 }}>AI Panel</a>
              <a href="/settings" style={{ display: 'block', textDecoration: 'none', background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(100,116,139,0.25)', borderRadius: 12, padding: 12, color: '#94a3b8', fontWeight: 700 }}>Settings</a>
            </div>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 14, textTransform: 'uppercase' }}>System Status</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}><span style={{ color: '#cbd5e1', fontWeight: 700 }}>Database</span><span style={{ color: '#22c55e', fontWeight: 900 }}>Supabase Connected</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}><span style={{ color: '#cbd5e1', fontWeight: 700 }}>Map Provider</span><span style={{ color: '#22c55e', fontWeight: 900 }}>Mapbox Active</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}><span style={{ color: '#cbd5e1', fontWeight: 700 }}>Realtime</span><span style={{ color: '#22c55e', fontWeight: 900 }}>Live</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}><span style={{ color: '#cbd5e1', fontWeight: 700 }}>Demo Engine</span><span style={{ color: demoRunning ? '#22c55e' : '#64748b', fontWeight: 900 }}>{demoRunning ? 'RUNNING' : 'Standby'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}><span style={{ color: '#cbd5e1', fontWeight: 700 }}>AI Engine</span><span style={{ color: '#22c55e', fontWeight: 900 }}>Online</span></div>
          </div>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, overflow: 'hidden' }}>
          <div style={{ padding: '18px', borderBottom: '1px solid rgba(148,163,184,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Recent Orders</div>
            {demoRunning && <div style={{ color: '#22c55e', fontSize: 13, fontWeight: 700 }}>● Live updating</div>}
          </div>
          {loading ? <div style={{ padding: 24, color: '#94a3b8' }}>Loading...</div> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: 'rgba(2,6,23,0.35)' }}>
                  <th style={{ padding: '12px 18px', fontSize: 12, color: '#94a3b8', textAlign: 'left', fontWeight: 800 }}>LOAD</th>
                  <th style={{ padding: '12px 18px', fontSize: 12, color: '#94a3b8', textAlign: 'left', fontWeight: 800 }}>CLIENT</th>
                  <th style={{ padding: '12px 18px', fontSize: 12, color: '#94a3b8', textAlign: 'left', fontWeight: 800 }}>TRUCK</th>
                  <th style={{ padding: '12px 18px', fontSize: 12, color: '#94a3b8', textAlign: 'left', fontWeight: 800 }}>STATUS</th>
                </tr></thead>
                <tbody>
                  {orders.slice(0, 8).map(order => {
                    const s = (order.status || '').toLowerCase()
                    const statusStyle = s.includes('transit') || s.includes('dispatch') ? { bg: 'rgba(59,130,246,0.14)', color: '#93c5fd', border: 'rgba(59,130,246,0.3)' } : s.includes('deliver') ? { bg: 'rgba(34,197,94,0.14)', color: '#86efac', border: 'rgba(34,197,94,0.3)' } : s.includes('pending') ? { bg: 'rgba(148,163,184,0.14)', color: '#cbd5e1', border: 'rgba(148,163,184,0.3)' } : { bg: 'rgba(245,158,11,0.14)', color: '#fcd34d', border: 'rgba(245,158,11,0.3)' }
                    return (
                      <tr key={order.id} style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                        <td style={{ padding: '14px 18px', color: '#fff', fontWeight: 700 }}>{order.load_name || order.id?.slice(0,8)}</td>
                        <td style={{ padding: '14px 18px', color: '#e2e8f0' }}>{order.client_name || 'N/A'}</td>
                        <td style={{ padding: '14px 18px', color: '#e2e8f0' }}>{order.assigned_truck_id || 'Unassigned'}</td>
                        <td style={{ padding: '14px 18px' }}><span style={{ padding: '5px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800, background: statusStyle.bg, color: statusStyle.color, border: '1px solid ' + statusStyle.border }}>{order.status || 'Pending'}</span></td>
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