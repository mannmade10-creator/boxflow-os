'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' }

const PLATFORMS = ['all','boxflow','medflow','propflow','classflow','general']
const STATUSES  = ['all','open','in_progress','resolved','closed']
const PRIORITIES = ['all','critical','high','normal','low']

type Ticket = {
  id: string; platform: string; title: string; description: string;
  priority: string; status: string; assigned_to: string;
  resolution: string; created_at: string; updated_at: string;
}

export default function AdminSupportPage() {
  const [tickets, setTickets]   = useState<Ticket[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [filterPlatform, setFilterPlatform] = useState('all')
  const [filterStatus,   setFilterStatus]   = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [resolution, setResolution] = useState('')
  const [saving, setSaving] = useState(false)

  async function fetchTickets() {
    setLoading(true)
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/support_tickets?select=*&order=created_at.desc`, { headers })
      const data = await res.json()
      if (Array.isArray(data)) setTickets(data)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchTickets() }, [])

  async function updateTicket(id: string, updates: Partial<Ticket>) {
    setSaving(true)
    await fetch(`${supabaseUrl}/rest/v1/support_tickets?id=eq.${id}`, {
      method: 'PATCH', headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
    })
    await fetchTickets()
    if (selected?.id === id) setSelected(t => t ? { ...t, ...updates } : null)
    setSaving(false)
  }

  function priorityColor(p: string) {
    if (p === 'critical') return '#ef4444'
    if (p === 'high')     return '#f59e0b'
    if (p === 'normal')   return '#4f8ef7'
    return '#475569'
  }

  function statusColor(s: string) {
    if (s === 'open')        return '#f59e0b'
    if (s === 'in_progress') return '#4f8ef7'
    if (s === 'resolved')    return '#22c55e'
    if (s === 'closed')      return '#475569'
    return '#475569'
  }

  function platformColor(p: string) {
    if (p === 'boxflow')   return '#2563EB'
    if (p === 'medflow')   return '#14D2C2'
    if (p === 'propflow')  return '#a855f7'
    if (p === 'classflow') return '#f59e0b'
    return '#64748b'
  }

  const filtered = tickets.filter(t =>
    (filterPlatform === 'all' || t.platform === filterPlatform) &&
    (filterStatus   === 'all' || t.status   === filterStatus)   &&
    (filterPriority === 'all' || t.priority === filterPriority)
  )

  const open     = tickets.filter(t => t.status === 'open').length
  const progress = tickets.filter(t => t.status === 'in_progress').length
  const critical = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved' && t.status !== 'closed').length
  const resolved = tickets.filter(t => t.status === 'resolved').length

  const sel = { background: 'rgba(7,15,36,0.8)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#f0f6ff', fontFamily: 'system-ui', outline: 'none', cursor: 'pointer' }

  return (
    <div style={{ minHeight: '100vh', background: '#020818', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>

      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(20,210,194,0.1)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/admin/health" style={{ textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff' }}>M</div>
          </Link>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Support Ticket Manager</div>
            <div style={{ fontSize: 9, color: '#14D2C2', letterSpacing: 2, textTransform: 'uppercase' }}>Admin — Made Technologies</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/admin/health" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>Health Dashboard</Link>
          <Link href="/support" style={{ padding: '7px 16px', background: 'rgba(20,210,194,0.1)', border: '1px solid rgba(20,210,194,0.2)', borderRadius: 8, color: '#14D2C2', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Customer View</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Open',        value: open,     color: '#f59e0b' },
            { label: 'In Progress', value: progress, color: '#4f8ef7' },
            { label: 'Critical',    value: critical, color: '#ef4444' },
            { label: 'Resolved',    value: resolved, color: '#22c55e' },
            { label: 'Total',       value: tickets.length, color: '#14D2C2' },
          ].map((s,i) => (
            <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: `1px solid ${s.color}20`, borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#475569', fontWeight: 700 }}>Filter:</span>
          <select style={sel} value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}>
            {PLATFORMS.map(p => <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>)}
          </select>
          <select style={sel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace('_',' ')}</option>)}
          </select>
          <select style={sel} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            {PRIORITIES.map(p => <option key={p} value={p}>{p === 'all' ? 'All Priorities' : p}</option>)}
          </select>
          <button onClick={fetchTickets} style={{ padding: '8px 16px', background: 'rgba(20,210,194,0.1)', border: '1px solid rgba(20,210,194,0.2)', borderRadius: 8, color: '#14D2C2', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui' }}>
            Refresh
          </button>
          <span style={{ fontSize: 12, color: '#475569', marginLeft: 'auto' }}>{filtered.length} tickets</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 420px' : '1fr', gap: 20 }}>

          {/* TICKET LIST */}
          <div style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.1)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 100px 120px', gap: 0, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
              <span>Subject</span><span>Platform</span><span>Priority</span><span>Status</span><span>Date</span>
            </div>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#475569', fontSize: 13 }}>Loading tickets...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#475569', fontSize: 13 }}>No tickets match your filters</div>
            ) : filtered.map(t => (
              <div key={t.id} onClick={() => { setSelected(t); setResolution(t.resolution || '') }}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 100px 120px', gap: 0, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: selected?.id === t.id ? 'rgba(20,210,194,0.05)' : 'transparent', transition: 'background 0.15s' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontSize: 10, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description?.substring(0, 60)}...</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: platformColor(t.platform), fontWeight: 600 }}>{t.platform}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: priorityColor(t.priority), background: `${priorityColor(t.priority)}14`, borderRadius: 6, padding: '2px 8px' }}>{t.priority}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(t.status), background: `${statusColor(t.status)}14`, borderRadius: 6, padding: '2px 8px' }}>{t.status.replace('_',' ')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: '#475569' }}>
                  {new Date(t.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {/* TICKET DETAIL */}
          {selected && (
            <div style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f6ff', lineHeight: 1.4, flex: 1, marginRight: 12 }}>{selected.title}</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 20, lineHeight: 1, flexShrink: 0 }}>x</button>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: platformColor(selected.platform), background: `${platformColor(selected.platform)}14`, borderRadius: 6, padding: '3px 10px' }}>{selected.platform}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: priorityColor(selected.priority), background: `${priorityColor(selected.priority)}14`, borderRadius: 6, padding: '3px 10px' }}>{selected.priority}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(selected.status), background: `${statusColor(selected.status)}14`, borderRadius: 6, padding: '3px 10px' }}>{selected.status.replace('_',' ')}</span>
              </div>

              <div style={{ background: 'rgba(7,15,36,0.6)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Description</div>
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selected.description}</div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Update Status</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['open','in_progress','resolved','closed'].map(s => (
                    <button key={s} onClick={() => updateTicket(selected.id, { status: s as any })} disabled={saving}
                      style={{ padding: '9px', background: selected.status === s ? `${statusColor(s)}20` : 'rgba(7,15,36,0.6)', border: `1px solid ${selected.status === s ? statusColor(s) : 'rgba(255,255,255,0.06)'}`, borderRadius: 9, color: selected.status === s ? statusColor(s) : '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui' }}>
                      {s.replace('_',' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Update Priority</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {['low','normal','high','critical'].map(p => (
                    <button key={p} onClick={() => updateTicket(selected.id, { priority: p as any })} disabled={saving}
                      style={{ padding: '7px', background: selected.priority === p ? `${priorityColor(p)}20` : 'rgba(7,15,36,0.6)', border: `1px solid ${selected.priority === p ? priorityColor(p) : 'rgba(255,255,255,0.06)'}`, borderRadius: 9, color: selected.priority === p ? priorityColor(p) : '#475569', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'system-ui' }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Resolution Notes</div>
                <textarea value={resolution} onChange={e => setResolution(e.target.value)}
                  placeholder="Add resolution notes visible to the customer..."
                  style={{ width: '100%', background: 'rgba(7,15,36,0.8)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f0f6ff', fontFamily: 'system-ui', outline: 'none', resize: 'vertical', minHeight: 90, boxSizing: 'border-box' }} />
                <button onClick={() => updateTicket(selected.id, { resolution, status: 'resolved', resolved_at: new Date().toISOString() } as any)} disabled={saving || !resolution}
                  style={{ marginTop: 8, width: '100%', padding: '11px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'system-ui', opacity: !resolution ? 0.6 : 1 }}>
                  {saving ? 'Saving...' : 'Save Resolution & Mark Resolved'}
                </button>
              </div>

              <div style={{ fontSize: 11, color: '#334155' }}>
                Created: {new Date(selected.created_at).toLocaleString()} · ID: {selected.id.substring(0,8)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}