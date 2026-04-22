'use client'
import { useEffect, useMemo, useState } from 'react'
import AppSidebar from '@/components/AppSidebar'

type LoadStatus = 'Unassigned' | 'Assigned' | 'Dispatched' | 'In Transit' | 'At Pickup' | 'At Delivery' | 'Delivered' | 'Cancelled'
type DriverStatus = 'Available' | 'Assigned' | 'Driving' | 'Off Duty'
type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

type Driver = {
  id: string; full_name: string; phone: string | null; email: string | null
  truck_number: string | null; equipment_type: string | null; current_location: string | null
  available: boolean; status: DriverStatus
}

type Load = {
  id: string; load_number: string; broker_name: string | null; broker_email: string | null
  broker_phone: string | null; customer_name: string | null; pickup_location: string
  dropoff_location: string; pickup_date: string | null; delivery_date: string | null
  equipment_type: string | null; weight_lbs: number | null; miles: number | null
  rate: number | null; status: LoadStatus; priority: Priority
  assigned_driver_id: string | null; notes: string | null; created_at: string
  dispatch_drivers?: Driver | null
}

const demoDrivers: Driver[] = [
  { id: 'driver-1', full_name: 'Marcus Hill', phone: '405-555-1001', email: 'marcus@boxflowos.com', truck_number: 'BF-201', equipment_type: 'Dry Van', current_location: 'Oklahoma City, OK', available: true, status: 'Available' },
  { id: 'driver-2', full_name: 'Angela Brooks', phone: '405-555-1002', email: 'angela@boxflowos.com', truck_number: 'BF-305', equipment_type: 'Reefer', current_location: 'Tulsa, OK', available: true, status: 'Available' },
  { id: 'driver-3', full_name: 'Darnell Price', phone: '405-555-1003', email: 'darnell@boxflowos.com', truck_number: 'BF-412', equipment_type: 'Flatbed', current_location: 'Dallas, TX', available: false, status: 'Assigned' },
]

const demoLoads: Load[] = [
  { id: 'load-1', load_number: 'LD-1001', broker_name: 'DAT Broker Network', broker_email: 'broker1@dat.com', broker_phone: '800-555-0001', customer_name: 'Amazon Regional', pickup_location: 'Oklahoma City, OK', dropoff_location: 'Dallas, TX', pickup_date: new Date(Date.now() + 3 * 3600000).toISOString(), delivery_date: new Date(Date.now() + 12 * 3600000).toISOString(), equipment_type: 'Dry Van', weight_lbs: 22000, miles: 205, rate: 1350, status: 'Unassigned', priority: 'High', assigned_driver_id: null, notes: 'Priority retail shipment', created_at: new Date().toISOString() },
  { id: 'load-2', load_number: 'LD-1002', broker_name: 'Navisphere Contract', broker_email: 'broker2@navisphere.com', broker_phone: '800-555-0002', customer_name: 'Lopez Foods', pickup_location: 'Tulsa, OK', dropoff_location: 'Kansas City, MO', pickup_date: new Date(Date.now() + 6 * 3600000).toISOString(), delivery_date: new Date(Date.now() + 24 * 3600000).toISOString(), equipment_type: 'Reefer', weight_lbs: 34000, miles: 270, rate: 1950, status: 'Assigned', priority: 'Medium', assigned_driver_id: 'driver-2', notes: 'Food-grade refrigerated load', created_at: new Date().toISOString(), dispatch_drivers: demoDrivers[1] },
  { id: 'load-3', load_number: 'LD-1003', broker_name: 'DAT Spot Market', broker_email: 'broker3@dat.com', broker_phone: '800-555-0003', customer_name: 'International Paper', pickup_location: 'Fort Worth, TX', dropoff_location: 'Houston, TX', pickup_date: new Date(Date.now() + 3600000).toISOString(), delivery_date: new Date(Date.now() + 10 * 3600000).toISOString(), equipment_type: 'Flatbed', weight_lbs: 41000, miles: 265, rate: 1800, status: 'In Transit', priority: 'Critical', assigned_driver_id: 'driver-3', notes: 'Late-sensitive manufacturing freight', created_at: new Date().toISOString(), dispatch_drivers: demoDrivers[2] },
]

function money(v?: number | null) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v || 0))
}

function shortDate(v?: string | null) {
  if (!v) return '—'
  return new Date(v).toLocaleString()
}

const statusColors: Record<string, { bg: string; color: string; border: string }> = {
  Unassigned:   { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  Assigned:     { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  Dispatched:   { bg: 'rgba(14,165,233,0.1)',  color: '#38bdf8', border: 'rgba(14,165,233,0.3)' },
  'In Transit': { bg: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  'At Pickup':  { bg: 'rgba(168,85,247,0.1)',  color: '#c084fc', border: 'rgba(168,85,247,0.3)' },
  'At Delivery':{ bg: 'rgba(99,102,241,0.1)',  color: '#a5b4fc', border: 'rgba(99,102,241,0.3)' },
  Delivered:    { bg: 'rgba(34,197,94,0.1)',   color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  Cancelled:    { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
  Available:    { bg: 'rgba(34,197,94,0.1)',   color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  Driving:      { bg: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  'Off Duty':   { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
}

const priorityColors: Record<Priority, { bg: string; color: string; border: string }> = {
  Low:      { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' },
  Medium:   { bg: 'rgba(14,165,233,0.1)',  color: '#38bdf8', border: 'rgba(14,165,233,0.3)' },
  High:     { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  Critical: { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', border: 'rgba(239,68,68,0.3)' },
}

function StatusBadge({ status }: { status: string }) {
  const c = statusColors[status] || { bg: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)' }
  return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.border}`, whiteSpace: 'nowrap' as const }}>{status}</span>
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const c = priorityColors[priority]
  return <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.border}`, whiteSpace: 'nowrap' as const }}>{priority}</span>
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(99,132,255,0.07)', flexWrap: 'wrap' as const, gap: 8 }}>
      <span style={{ fontSize: 13, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: 0.5, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{value}</span>
    </div>
  )
}

export default function FreightDispatchPage() {
  const [loads, setLoads] = useState<Load[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selected, setSelected] = useState<Load | null>(null)
  const [loading, setLoading] = useState(true)
  const [dbReady, setDbReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  async function fetchData() {
    setLoading(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const [driversRes, loadsRes] = await Promise.all([
        supabase.from('dispatch_drivers').select('*').order('created_at', { ascending: false }),
        supabase.from('loads').select('*, dispatch_drivers:assigned_driver_id (id, full_name, phone, email, truck_number, equipment_type, current_location, available, status)').order('created_at', { ascending: false }),
      ])
      if (driversRes.error || loadsRes.error) throw new Error('DB error')
      setDrivers((driversRes.data || []) as Driver[])
      const dbLoads = (loadsRes.data || []) as Load[]
      setLoads(dbLoads)
      setSelected(prev => dbLoads.find(l => l.id === prev?.id) || dbLoads[0] || null)
      setDbReady(true)
    } catch {
      setDbReady(false)
      const joined = demoLoads.map(l => ({ ...l, dispatch_drivers: demoDrivers.find(d => d.id === l.assigned_driver_id) || null }))
      setDrivers(demoDrivers)
      setLoads(joined)
      setSelected(joined[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = useMemo(() => loads.filter(l => {
    const hay = [l.load_number, l.customer_name, l.broker_name, l.pickup_location, l.dropoff_location, l.equipment_type].filter(Boolean).join(' ').toLowerCase()
    return hay.includes(search.toLowerCase()) && (statusFilter === 'All' || l.status === statusFilter)
  }), [loads, search, statusFilter])

  const totalRev = loads.reduce((s, l) => s + Number(l.rate || 0), 0)
  const active = loads.filter(l => ['Assigned','Dispatched','In Transit','At Pickup','At Delivery'].includes(l.status)).length
  const unassigned = loads.filter(l => l.status === 'Unassigned').length
  const delivered = loads.filter(l => l.status === 'Delivered').length

  async function assignDriver(loadId: string, driverId: string) {
    setSaving(true)
    if (!dbReady) {
      const driver = drivers.find(d => d.id === driverId) || null
      const next = loads.map(l => l.id === loadId ? { ...l, assigned_driver_id: driverId, status: l.status === 'Unassigned' ? 'Assigned' as LoadStatus : l.status, dispatch_drivers: driver } : l)
      setLoads(next); setSelected(next.find(l => l.id === loadId) || null)
      setDrivers(drivers.map(d => d.id === driverId ? { ...d, available: false, status: 'Assigned' as DriverStatus } : d))
      setSaving(false); return
    }
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      await supabase.from('loads').update({ assigned_driver_id: driverId, status: 'Assigned' }).eq('id', loadId)
      await supabase.from('dispatch_drivers').update({ available: false, status: 'Assigned' }).eq('id', driverId)
      await fetchData()
    } catch { alert('Assignment failed') }
    setSaving(false)
  }

  async function updateStatus(loadId: string, status: LoadStatus) {
    setSaving(true)
    if (!dbReady) {
      const next = loads.map(l => l.id === loadId ? { ...l, status } : l)
      setLoads(next); setSelected(next.find(l => l.id === loadId) || null)
      setSaving(false); return
    }
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      await supabase.from('loads').update({ status }).eq('id', loadId)
      await fetchData()
    } catch { alert('Status update failed') }
    setSaving(false)
  }

  async function aiAssign(load: Load) {
    const pool = drivers.filter(d => d.available && (d.equipment_type||'').toLowerCase() === (load.equipment_type||'').toLowerCase())
    const fallback = drivers.filter(d => d.available)
    const best = (pool.length ? pool : fallback)[0]
    if (!best) { alert('No available drivers'); return }
    await assignDriver(load.id, best.id)
  }

  async function quickLoad() {
    const payload = { load_number: `LD-${Math.floor(1000 + Math.random() * 9000)}`, broker_name: 'Manual Entry', customer_name: 'New Customer', pickup_location: 'Oklahoma City, OK', dropoff_location: 'Dallas, TX', pickup_date: new Date(Date.now() + 4 * 3600000).toISOString(), delivery_date: new Date(Date.now() + 16 * 3600000).toISOString(), equipment_type: 'Dry Van', weight_lbs: 20000, miles: 210, rate: 1450, status: 'Unassigned' as LoadStatus, priority: 'Medium' as Priority, notes: 'Quick load entry' }
    if (!dbReady) {
      const local: Load = { id: crypto.randomUUID(), ...payload, broker_email: null, broker_phone: null, assigned_driver_id: null, created_at: new Date().toISOString() }
      setLoads([local, ...loads]); setSelected(local); return
    }
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      await supabase.from('loads').insert(payload)
      await fetchData()
    } catch { alert('Could not create load') }
  }

  const card: React.CSSProperties = { background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 16, padding: 20, marginBottom: 16 }
  const statuses: LoadStatus[] = ['Unassigned','Assigned','Dispatched','In Transit','At Pickup','At Delivery','Delivered','Cancelled']

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#e2e8f0', fontFamily: 'Arial, sans-serif' }}>
      <AppSidebar active="freight" />
      <div style={{ flex: 1, padding: 24, overflowX: 'hidden' as const }}>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 2, marginBottom: 6 }}>BoxFlow OS / Freight Dispatch</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Freight Dispatch Command Center</h1>
          <p style={{ fontSize: 15, color: '#475569' }}>Manage DAT & Navisphere loads, assign drivers, and dispatch freight operations.</p>
          {!dbReady && <div style={{ marginTop: 12, padding: '10px 16px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', fontSize: 13, color: '#fbbf24' }}>⚠ Demo mode — connect Supabase dispatch tables to go live.</div>}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' as const }}>
          <button onClick={quickLoad} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>+ Quick Load</button>
          <button onClick={fetchData} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', background: 'rgba(99,132,255,0.08)', border: '1px solid rgba(99,132,255,0.15)', color: '#94a3b8' }}>↻ Refresh</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Loads', value: String(loads.length), color: '#60a5fa' },
            { label: 'Active Loads', value: String(active), color: '#22c55e' },
            { label: 'Delivered', value: String(delivered), color: '#4ade80' },
            { label: 'Unassigned', value: String(unassigned), color: '#f87171' },
            { label: 'Revenue', value: money(totalRev), color: '#fbbf24' },
          ].map(k => (
            <div key={k.label} style={{ ...card, marginBottom: 0, borderTop: `3px solid ${k.color}` }}>
              <div style={{ fontSize: 12, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, alignItems: 'start' }}>

          <div style={card}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Dispatch Board</h2>
              <p style={{ fontSize: 14, color: '#475569' }}>Loads, routes, customers, brokers, and status.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' as const }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search loads, route, customer..." style={{ flex: 1, minWidth: 180, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(7,15,31,0.8)', color: '#e2e8f0', fontSize: 14, outline: 'none' }} />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(7,15,31,0.8)', color: '#e2e8f0', fontSize: 14, outline: 'none' }}>
                <option value="All">All Statuses</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr 0.8fr 0.7fr 0.7fr', gap: 8, padding: '8px 12px', background: 'rgba(99,132,255,0.08)', borderRadius: 8, marginBottom: 4 }}>
              {['Load','Route','Customer','Status','Priority','Rate'].map(h => <div key={h} style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1 }}>{h}</div>)}
            </div>
            {loading ? (
              <div style={{ textAlign: 'center' as const, color: '#475569', padding: 40, fontSize: 15 }}>Loading dispatch board...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center' as const, color: '#475569', padding: 40, fontSize: 15 }}>No loads found.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
                {filtered.map(load => {
                  const isSel = selected?.id === load.id
                  return (
                    <button key={load.id} onClick={() => setSelected(load)}
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr 0.8fr 0.7fr 0.7fr', gap: 8, padding: '12px 12px', borderRadius: 10, border: `1px solid ${isSel ? 'rgba(59,130,246,0.4)' : 'rgba(99,132,255,0.08)'}`, background: isSel ? 'rgba(59,130,246,0.08)' : 'rgba(15,23,42,0.4)', cursor: 'pointer', textAlign: 'left' as const }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{load.load_number}</div>
                        <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{load.equipment_type} • {load.miles}mi</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: '#e2e8f0' }}>{load.pickup_location}</div>
                        <div style={{ fontSize: 12, color: '#475569' }}>→ {load.dropoff_location}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: '#e2e8f0' }}>{load.customer_name || '—'}</div>
                        <div style={{ fontSize: 12, color: '#475569' }}>{load.broker_name || '—'}</div>
                      </div>
                      <div><StatusBadge status={load.status} /></div>
                      <div><PriorityBadge priority={load.priority} /></div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fbbf24' }}>{money(load.rate)}</div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16 }}>
            <div style={card}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Load Detail</h2>
              <p style={{ fontSize: 14, color: '#475569', marginBottom: 16 }}>Assign driver and update status.</p>
              {!selected ? (
                <div style={{ textAlign: 'center' as const, color: '#475569', padding: 40, border: '1px dashed rgba(99,132,255,0.2)', borderRadius: 12, fontSize: 15 }}>Select a load from the board</div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const, gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Load Number</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{selected.load_number}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <StatusBadge status={selected.status} />
                      <PriorityBadge priority={selected.priority} />
                    </div>
                  </div>
                  <InfoRow label="Customer" value={selected.customer_name || '—'} />
                  <InfoRow label="Broker" value={selected.broker_name || '—'} />
                  <InfoRow label="Pickup" value={selected.pickup_location} />
                  <InfoRow label="Delivery" value={selected.dropoff_location} />
                  <InfoRow label="Pickup Time" value={shortDate(selected.pickup_date)} />
                  <InfoRow label="Equipment" value={selected.equipment_type || '—'} />
                  <InfoRow label="Weight" value={`${selected.weight_lbs || 0} lbs`} />
                  <InfoRow label="Miles" value={`${selected.miles || 0} mi`} />
                  <InfoRow label="Rate" value={money(selected.rate)} />
                  <InfoRow label="RPM" value={`$${selected.miles ? (Number(selected.rate||0)/selected.miles).toFixed(2) : '0.00'}`} />
                  {selected.notes && <div style={{ marginTop: 12, padding: 12, background: 'rgba(99,132,255,0.06)', borderRadius: 8, fontSize: 13, color: '#94a3b8' }}>📝 {selected.notes}</div>}

                  <div style={{ marginTop: 20, padding: 16, background: 'rgba(7,15,31,0.6)', borderRadius: 12, border: '1px solid rgba(99,132,255,0.12)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Assignment Control</div>
                      <button onClick={() => aiAssign(selected)} disabled={saving} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>🤖 AI Assign</button>
                    </div>
                    <div style={{ fontSize: 12, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 8 }}>Assign Driver</div>
                    <select value={selected.assigned_driver_id || ''} onChange={e => { if (e.target.value) assignDriver(selected.id, e.target.value) }}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(2,8,18,0.8)', color: '#e2e8f0', fontSize: 14, outline: 'none', marginBottom: 10 }}>
                      <option value="">Select driver...</option>
                      {drivers.map(d => <option key={d.id} value={d.id}>{d.full_name} | {d.truck_number || 'No Truck'} | {d.equipment_type} | {d.status}</option>)}
                    </select>
                    <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(99,132,255,0.06)', fontSize: 13, color: '#94a3b8' }}>
                      <span style={{ color: '#fff', fontWeight: 700 }}>Assigned: </span>{selected.dispatch_drivers?.full_name || 'Not assigned'}
                    </div>
                  </div>

                  <div style={{ marginTop: 16, padding: 16, background: 'rgba(7,15,31,0.6)', borderRadius: 12, border: '1px solid rgba(99,132,255,0.12)' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Status Control</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {statuses.map(s => (
                        <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={saving}
                          style={{ padding: '9px 8px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1px solid ${selected.status === s ? 'rgba(59,130,246,0.4)' : 'rgba(99,132,255,0.15)'}`, background: selected.status === s ? 'rgba(59,130,246,0.15)' : 'rgba(99,132,255,0.05)', color: selected.status === s ? '#60a5fa' : '#64748b' }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={card}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Driver Availability</h2>
              <p style={{ fontSize: 14, color: '#475569', marginBottom: 16 }}>Dispatch-ready drivers and truck units.</p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {drivers.map(d => (
                  <div key={d.id} style={{ padding: 14, background: 'rgba(7,15,31,0.6)', borderRadius: 12, border: '1px solid rgba(99,132,255,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{d.full_name}</div>
                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{d.truck_number || 'No Truck'} • {d.equipment_type || 'N/A'}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>📍 {d.current_location || 'Unknown'}</div>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}