'use client'
import { useEffect, useState } from 'react'

export default function MaintenancePage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    fetch(`${url}/rest/v1/work_orders?select=*&order=created_at.desc`, {
      headers: { 'apikey': key!, 'Authorization': `Bearer ${key}` }
    })
    .then(r => r.json())
    .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false) })
    .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? orders : orders.filter(o => o.priority === filter)
  const urgent = orders.filter(o => o.priority === 'Urgent').length
  const inProgress = orders.filter(o => o.status === 'In Progress').length
  const pending = orders.filter(o => o.status === 'Pending').length

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050d1a',color:'#4f8ef7',fontFamily:'Inter,Arial,sans-serif',fontSize:18}}>
      Loading maintenance...
    </div>
  )

  return (
    <main style={{minHeight:'100vh',background:'#050d1a',color:'#e2e8f0',fontFamily:'Inter,Arial,sans-serif'}}>
      <header style={{background:'#070f1f',borderBottom:'1px solid rgba(99,132,255,0.15)',padding:'0 24px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap' as const,gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:34,height:34,borderRadius:8,background:'#4f8ef7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:800,color:'#fff'}}>P</div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:'#4f8ef7',letterSpacing:1}}>PropFlow OS</div>
            <div style={{fontSize:9,color:'#475569',letterSpacing:1}}>by M.A.D.E Technologies</div>
          </div>
        </div>
        <nav style={{display:'flex',gap:4,flexWrap:'wrap' as const}}>
          {['Dashboard','Units','Tenants','Maintenance','GPS','Finance','Community'].map(item => (
            <a key={item} href={`/${item === 'Dashboard' ? 'propflow/dashboard' : 'propflow/' + item.toLowerCase()}`}
              style={{padding:'6px 12px',fontSize:11,fontWeight:700,
                color:item==='Maintenance'?'#4f8ef7':'#475569',borderRadius:7,textDecoration:'none',
                background:item==='Maintenance'?'rgba(79,142,247,0.1)':'transparent'}}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div style={{maxWidth:1200,margin:'0 auto',padding:24}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap' as const,gap:12}}>
          <div>
            <h1 style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:4}}>Maintenance</h1>
            <p style={{fontSize:13,color:'#475569'}}>Work orders & property upkeep</p>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
            <span style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,background:'rgba(239,68,68,0.15)',color:'#ef4444'}}>{urgent} Urgent</span>
            <span style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,background:'rgba(79,142,247,0.15)',color:'#4f8ef7'}}>{inProgress} In Progress</span>
            <span style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,background:'rgba(245,158,11,0.15)',color:'#f59e0b'}}>{pending} Pending</span>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:20}}>
          {[
            {title:'Total Orders',value:orders.length,color:'#4f8ef7'},
            {title:'Urgent',value:urgent,color:'#ef4444'},
            {title:'In Progress',value:inProgress,color:'#22c55e'},
            {title:'Pending',value:pending,color:'#f59e0b'},
          ].map(k => (
            <div key={k.title} style={{background:'rgba(15,23,42,0.9)',border:'1px solid rgba(99,132,255,0.12)',borderRadius:14,padding:16,borderTop:`3px solid ${k.color}`}}>
              <div style={{fontSize:10,color:'#475569',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:1,marginBottom:8}}>{k.title}</div>
              <div style={{fontSize:28,fontWeight:800,color:k.color}}>{k.value}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap' as const}}>
          {['All','Urgent','Normal','Low','Scheduled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{padding:'7px 14px',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',
                background:filter===f?'rgba(79,142,247,0.15)':'rgba(15,23,42,0.9)',
                border:filter===f?'1px solid rgba(79,142,247,0.4)':'1px solid rgba(99,132,255,0.15)',
                color:filter===f?'#4f8ef7':'#475569'}}>
              {f}
            </button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column' as const,gap:10}}>
          {filtered.length === 0 ? (
            <div style={{padding:30,textAlign:'center' as const,color:'#475569',fontSize:13,background:'rgba(15,23,42,0.9)',borderRadius:14}}>No work orders found</div>
          ) : filtered.map(o => (
            <div key={o.id} style={{background:'rgba(15,23,42,0.9)',border:`1px solid ${o.priority==='Urgent'?'rgba(239,68,68,0.25)':'rgba(99,132,255,0.12)'}`,borderRadius:14,padding:16}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap' as const}}>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap' as const}}>
                    <span style={{fontSize:14,fontWeight:700,color:'#fff'}}>{o.description}</span>
                    <span style={{padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,
                      background:o.priority==='Urgent'?'rgba(239,68,68,0.15)':o.priority==='Normal'?'rgba(245,158,11,0.15)':'rgba(100,116,139,0.15)',
                      color:o.priority==='Urgent'?'#ef4444':o.priority==='Normal'?'#f59e0b':'#64748b'}}>
                      {o.priority}
                    </span>
                    <span style={{padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,
                      background:o.status==='In Progress'?'rgba(79,142,247,0.15)':o.status==='Completed'?'rgba(34,197,94,0.15)':'rgba(100,116,139,0.15)',
                      color:o.status==='In Progress'?'#4f8ef7':o.status==='Completed'?'#22c55e':'#64748b'}}>
                      {o.status}
                    </span>
                  </div>
                  <div style={{fontSize:12,color:'#475569'}}>
                    Assigned to: {o.assigned_to || 'Unassigned'} &nbsp;â€¢&nbsp;
                    Type: {o.issue_type} &nbsp;â€¢&nbsp;
                    Urgency: {o.urgency_rating}
                  </div>
                  {(o.parts_cost || o.labor_cost) && (
                    <div style={{fontSize:12,color:'#64748b',marginTop:4}}>
                      Parts: ${o.parts_cost || 0} &nbsp;â€¢&nbsp; Labor: ${o.labor_cost || 0} &nbsp;â€¢&nbsp;
                      <span style={{color:'#22c55e',fontWeight:700}}>Total: ${(o.parts_cost || 0) + (o.labor_cost || 0)}</span>
                    </div>
                  )}
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button style={{padding:'6px 12px',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',background:'rgba(34,197,94,0.15)',border:'1px solid rgba(34,197,94,0.3)',color:'#22c55e'}}>
                    Complete
                  </button>
                  <button style={{padding:'6px 12px',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',background:'rgba(79,142,247,0.15)',border:'1px solid rgba(79,142,247,0.3)',color:'#4f8ef7'}}>
                    Reassign
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

