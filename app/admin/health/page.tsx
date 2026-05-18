'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const headers = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }

const PLATFORMS = [
  { id: 'boxflow',   name: 'BoxFlow OS',   color: '#2563EB', url: 'https://www.boxflowos.com' },
  { id: 'medflow',   name: 'MedFlow OS',   color: '#14D2C2', url: 'https://www.boxflowos.com/medflow-os' },
  { id: 'propflow',  name: 'PropFlow OS',  color: '#a855f7', url: 'https://www.propflowos.com' },
  { id: 'classflow', name: 'ClassFlow AI', color: '#f59e0b', url: 'https://www.boxflowos.com/classflow-os' },
]

type HealthRow   = { platform: string; metric: string; value: number; status: string; recorded_at: string }
type DeviceRow   = { id: string; platform: string; device_id: string; name: string; status: string; device_type: string; last_ping: string }
type TicketRow   = { id: string; platform: string; title: string; priority: string; status: string; created_at: string }

export default function AdminHealthPage() {
  const [health,   setHealth]   = useState<HealthRow[]>([])
  const [devices,  setDevices]  = useState<DeviceRow[]>([])
  const [tickets,  setTickets]  = useState<TicketRow[]>([])
  const [contacts, setContacts] = useState<number>(0)
  const [lastRefresh, setLastRefresh] = useState('')
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  async function fetchAll() {
    try {
      const [hRes, dRes, tRes, cRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/system_health?select=*&order=recorded_at.desc&limit=100`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/edge_devices?select=*&order=last_ping.desc`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/support_tickets?select=*&order=created_at.desc&limit=20`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/contact_leads?select=id`, { headers }),
      ])
      const [h, d, t, c] = await Promise.all([hRes.json(), dRes.json(), tRes.json(), cRes.json()])
      if (Array.isArray(h)) setHealth(h)
      if (Array.isArray(d)) setDevices(d)
      if (Array.isArray(t)) setTickets(t)
      if (Array.isArray(c)) setContacts(c.length)
      const now = new Date()
      setLastRefresh(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    const id = setInterval(fetchAll, 30000)
    return () => clearInterval(id)
  }, [autoRefresh])

  function getMetric(platform: string, metric: string) {
    return health.find(h => h.platform === platform && h.metric === metric)
  }

  function getPlatformStatus(platform: string) {
    const rows = health.filter(h => h.platform === platform)
    if (rows.some(r => r.status === 'critical')) return 'critical'
    if (rows.some(r => r.status === 'warning'))  return 'warning'
    if (rows.length === 0) return 'unknown'
    return 'ok'
  }

  function statusColor(s: string) {
    if (s === 'ok')       return '#22c55e'
    if (s === 'warning')  return '#f59e0b'
    if (s === 'critical') return '#ef4444'
    return '#475569'
  }

  function statusBg(s: string) {
    if (s === 'ok')       return 'rgba(34,197,94,0.1)'
    if (s === 'warning')  return 'rgba(245,158,11,0.1)'
    if (s === 'critical') return 'rgba(239,68,68,0.1)'
    return 'rgba(71,85,105,0.1)'
  }

  function priorityColor(p: string) {
    if (p === 'critical') return '#ef4444'
    if (p === 'high')     return '#f59e0b'
    if (p === 'normal')   return '#4f8ef7'
    return '#475569'
  }

  const onlineDevices  = devices.filter(d => d.status === 'online').length
  const offlineDevices = devices.filter(d => d.status === 'offline').length
  const openTickets    = tickets.filter(t => t.status === 'open').length
  const critTickets    = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length
  const allOk          = PLATFORMS.every(p => getPlatformStatus(p.id) === 'ok')

  return (
    <div style={{ minHeight:'100vh', background:'#020818', color:'#f0f6ff', fontFamily:'system-ui,sans-serif' }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .stat-card{transition:transform 0.15s,border-color 0.15s}
        .stat-card:hover{transform:translateY(-2px)}
        .ticket-row:hover{background:rgba(255,255,255,0.03)!important}
      `}</style>

      {/* HEADER */}
      <header style={{ background:'#070f1f', borderBottom:'1px solid rgba(20,210,194,0.1)', padding:'0 32px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Link href="/" style={{ textDecoration:'none' }}>
            <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#0A6E68,#14D2C2)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#fff' }}>M</div>
          </Link>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:'#fff' }}>Admin Health Center</div>
            <div style={{ fontSize:9, color:'#14D2C2', letterSpacing:2, textTransform:'uppercase' }}>Made Technologies Enterprise</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color: allOk ? '#22c55e' : '#f59e0b' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background: allOk ? '#22c55e' : '#f59e0b', display:'inline-block', animation:'pulse 2s infinite' }} />
            {allOk ? 'All Systems Operational' : 'Degraded Performance Detected'}
          </div>
          <span style={{ fontSize:11, color:'#475569', fontFamily:'monospace' }}>Last: {lastRefresh || '--:--:--'}</span>
          <button onClick={fetchAll} style={{ padding:'6px 14px', background:'rgba(20,210,194,0.1)', border:'1px solid rgba(20,210,194,0.2)', borderRadius:8, color:'#14D2C2', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'system-ui' }}>
            Refresh
          </button>
          <button onClick={() => setAutoRefresh(a => !a)} style={{ padding:'6px 14px', background: autoRefresh ? 'rgba(34,197,94,0.1)' : 'rgba(71,85,105,0.1)', border:`1px solid ${autoRefresh ? 'rgba(34,197,94,0.2)' : 'rgba(71,85,105,0.2)'}`, borderRadius:8, color: autoRefresh ? '#22c55e' : '#475569', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'system-ui' }}>
            {autoRefresh ? 'Auto: ON' : 'Auto: OFF'}
          </button>
        </div>
      </header>

      <div style={{ maxWidth:1300, margin:'0 auto', padding:'28px 24px' }}>

        {/* TOP STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:14, marginBottom:28 }}>
          {[
            { label:'Platforms Online', value: loading ? '...' : `${PLATFORMS.filter(p => getPlatformStatus(p.id) === 'ok').length}/4`, color:'#22c55e', sub:'All systems checked' },
            { label:'Edge Devices Online', value: loading ? '...' : `${onlineDevices}/${devices.length}`, color:'#14D2C2', sub:`${offlineDevices} offline` },
            { label:'Open Tickets', value: loading ? '...' : openTickets.toString(), color: openTickets > 3 ? '#f59e0b' : '#22c55e', sub: critTickets > 0 ? `${critTickets} critical` : 'No critical issues' },
            { label:'Contact Leads', value: loading ? '...' : contacts.toString(), color:'#a855f7', sub:'Total pipeline' },
          ].map((s,i) => (
            <div key={i} className="stat-card" style={{ background:'rgba(12,26,56,0.8)', border:`1px solid ${s.color}20`, borderRadius:16, padding:'20px 18px' }}>
              <div style={{ fontSize:11, color:'#475569', fontWeight:700, letterSpacing:1, marginBottom:8, textTransform:'uppercase' }}>{s.label}</div>
              <div style={{ fontSize:32, fontWeight:900, color:s.color, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:11, color:'#475569' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* PLATFORM STATUS CARDS */}
        <div style={{ marginBottom:28 }}>
          <h2 style={{ fontSize:16, fontWeight:800, marginBottom:14, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1 }}>Platform Status</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:14 }}>
            {PLATFORMS.map(p => {
              const pStatus   = getPlatformStatus(p.id)
              const respTime  = getMetric(p.id, 'response_time_ms')
              const uptime    = getMetric(p.id, 'uptime_percent')
              const users     = getMetric(p.id, 'active_users')
              const errRate   = getMetric(p.id, 'error_rate')
              return (
                <div key={p.id} style={{ background:'rgba(12,26,56,0.8)', border:`1px solid ${p.color}20`, borderRadius:18, padding:22 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:`${p.color}18`, border:`1px solid ${p.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:p.color }}>
                        {p.name[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:800, color:'#f0f6ff' }}>{p.name}</div>
                        <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize:10, color:'#475569', textDecoration:'none' }}>{p.url.replace('https://','')}</a>
                      </div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:statusColor(pStatus), background:statusBg(pStatus), border:`1px solid ${statusColor(pStatus)}30`, borderRadius:20, padding:'3px 12px', textTransform:'uppercase', letterSpacing:0.5 }}>
                      {pStatus}
                    </span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[
                      { label:'Response', value: respTime ? `${respTime.value}ms` : 'N/A', good: (respTime?.value || 0) < 500 },
                      { label:'Uptime',   value: uptime   ? `${uptime.value}%`   : 'N/A', good: (uptime?.value   || 0) > 99 },
                      { label:'Users',    value: users    ? users.value.toString() : '0',  good: true },
                      { label:'Errors',   value: errRate  ? `${errRate.value}%`  : '0%',  good: (errRate?.value  || 0) < 1 },
                    ].map((m,i) => (
                      <div key={i} style={{ background:'rgba(7,15,36,0.6)', borderRadius:10, padding:'10px 12px' }}>
                        <div style={{ fontSize:10, color:'#475569', marginBottom:4, letterSpacing:0.5 }}>{m.label}</div>
                        <div style={{ fontSize:18, fontWeight:800, color: m.good ? '#22c55e' : '#f59e0b' }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28 }}>

          {/* EDGE DEVICES */}
          <div style={{ background:'rgba(12,26,56,0.8)', border:'1px solid rgba(20,210,194,0.12)', borderRadius:18, padding:22 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontSize:14, fontWeight:800, color:'#f0f6ff' }}>Edge Devices</h2>
              <div style={{ display:'flex', gap:10 }}>
                <span style={{ fontSize:11, color:'#22c55e', background:'rgba(34,197,94,0.1)', padding:'2px 10px', borderRadius:12, border:'1px solid rgba(34,197,94,0.2)' }}>{onlineDevices} Online</span>
                <span style={{ fontSize:11, color:'#ef4444', background:'rgba(239,68,68,0.1)', padding:'2px 10px', borderRadius:12, border:'1px solid rgba(239,68,68,0.2)' }}>{offlineDevices} Offline</span>
              </div>
            </div>
            {loading ? <div style={{ color:'#475569', fontSize:13 }}>Loading...</div> : devices.length === 0 ? (
              <div style={{ color:'#475569', fontSize:13, textAlign:'center', padding:'20px 0' }}>No devices registered yet</div>
            ) : devices.map(d => {
              const pColor = PLATFORMS.find(p => p.id === d.platform)?.color || '#475569'
              const ago = d.last_ping ? Math.round((Date.now() - new Date(d.last_ping).getTime()) / 1000) : null
              return (
                <div key={d.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background: d.status==='online'?'#22c55e':'#ef4444', flexShrink:0, boxShadow: d.status==='online'?'0 0 6px #22c55e':undefined }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#f0f6ff' }}>{d.name}</div>
                    <div style={{ fontSize:10, color:'#475569' }}>{d.device_id} · {d.device_type}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color:pColor, fontWeight:600 }}>{d.platform}</div>
                    <div style={{ fontSize:10, color:'#475569' }}>{ago !== null ? `${ago}s ago` : 'never'}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* SUPPORT TICKETS */}
          <div style={{ background:'rgba(12,26,56,0.8)', border:'1px solid rgba(20,210,194,0.12)', borderRadius:18, padding:22 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontSize:14, fontWeight:800, color:'#f0f6ff' }}>Support Tickets</h2>
              <div style={{ display:'flex', gap:10 }}>
                <span style={{ fontSize:11, color:'#f59e0b', background:'rgba(245,158,11,0.1)', padding:'2px 10px', borderRadius:12, border:'1px solid rgba(245,158,11,0.2)' }}>{openTickets} Open</span>
                {critTickets > 0 && <span style={{ fontSize:11, color:'#ef4444', background:'rgba(239,68,68,0.1)', padding:'2px 10px', borderRadius:12, border:'1px solid rgba(239,68,68,0.2)' }}>{critTickets} Critical</span>}
              </div>
            </div>
            {loading ? <div style={{ color:'#475569', fontSize:13 }}>Loading...</div> : tickets.length === 0 ? (
              <div style={{ color:'#475569', fontSize:13, textAlign:'center', padding:'20px 0' }}>No tickets yet</div>
            ) : tickets.slice(0,8).map(t => {
              const pColor = PLATFORMS.find(p => p.id === t.platform)?.color || '#475569'
              return (
                <div key={t.id} className="ticket-row" style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 6px', borderBottom:'1px solid rgba(255,255,255,0.05)', borderRadius:6, cursor:'pointer' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:priorityColor(t.priority), flexShrink:0, marginTop:4 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#f0f6ff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.title}</div>
                    <div style={{ fontSize:10, color:'#475569', marginTop:2 }}>{t.platform} · {t.priority}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, color: t.status==='resolved'?'#22c55e':t.status==='in_progress'?'#f59e0b':'#475569', background: t.status==='resolved'?'rgba(34,197,94,0.1)':t.status==='in_progress'?'rgba(245,158,11,0.1)':'rgba(71,85,105,0.1)', border:`1px solid ${t.status==='resolved'?'rgba(34,197,94,0.2)':t.status==='in_progress'?'rgba(245,158,11,0.2)':'rgba(71,85,105,0.2)'}`, borderRadius:8, padding:'2px 8px', whiteSpace:'nowrap', flexShrink:0 }}>
                    {t.status.replace('_',' ')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* PLATFORM LINKS */}
        <div style={{ background:'rgba(12,26,56,0.8)', border:'1px solid rgba(20,210,194,0.1)', borderRadius:18, padding:22 }}>
          <h2 style={{ fontSize:14, fontWeight:800, color:'#f0f6ff', marginBottom:16 }}>Quick Access — All Platforms</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12 }}>
            {[
              { name:'BoxFlow OS',    color:'#2563EB', links:[['Dashboard','/boxflow'],['Fleet Map','/boxflow'],['Orders','/boxflow']] },
              { name:'MedFlow OS',    color:'#14D2C2', links:[['Dashboard','/medflow/dashboard'],['Cold Chain','/medflow/cold-chain'],['Inventory','/medflow/inventory']] },
              { name:'PropFlow OS',   color:'#a855f7', links:[['Dashboard','/propflow/dashboard'],['GPS Tracker','/propflow/gps'],['Tenants','/propflow/tenants']] },
              { name:'ClassFlow AI',  color:'#f59e0b', links:[['Dashboard','/classflow/dashboard'],['Create Lesson','/classflow/create'],['Students','/classflow/students']] },
            ].map((p,i) => (
              <div key={i} style={{ background:'rgba(7,15,36,0.6)', borderRadius:12, padding:16 }}>
                <div style={{ fontSize:13, fontWeight:800, color:p.color, marginBottom:10 }}>{p.name}</div>
                {p.links.map(([label,href]) => (
                  <Link key={href} href={href} style={{ display:'block', fontSize:12, color:'#64748b', textDecoration:'none', padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    {label} →
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:24, fontSize:11, color:'#1e293b' }}>
          Made Technologies Inc — Enterprise Admin · Auto-refreshes every 30 seconds · kenneth.covington@boxflowos.com
        </div>
      </div>
    </div>
  )
}