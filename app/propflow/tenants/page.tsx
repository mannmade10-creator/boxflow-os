'use client'
import { useEffect, useState } from 'react'

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    fetch(`${url}/rest/v1/tenants?select=*&order=last_name`, {
      headers: { 'apikey': key!, 'Authorization': `Bearer ${key}` }
    })
    .then(r => r.json())
    .then(data => { setTenants(Array.isArray(data) ? data : []); setLoading(false) })
    .catch(() => setLoading(false))
  }, [])

  const filtered = tenants.filter(t =>
    `${t.first_name} ${t.last_name}`.toLowerCase().includes(search.toLowerCase())
  )
  const active = tenants.filter(t => t.status === 'Active').length

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050d1a',color:'#4f8ef7',fontFamily:'Inter,Arial,sans-serif',fontSize:18}}>
      Loading tenants...
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
            <a key={item} href={`/${item === 'Dashboard' ? 'dashboard' : item.toLowerCase()}`}
              style={{padding:'6px 12px',fontSize:11,fontWeight:700,
                color:item==='Tenants'?'#4f8ef7':'#475569',borderRadius:7,textDecoration:'none',
                background:item==='Tenants'?'rgba(79,142,247,0.1)':'transparent'}}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div style={{maxWidth:1200,margin:'0 auto',padding:24}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap' as const,gap:12}}>
          <div>
            <h1 style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:4}}>Tenant Directory</h1>
            <p style={{fontSize:13,color:'#475569'}}>Penn Station â€” All Active Leases</p>
          </div>
          <span style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,background:'rgba(34,197,94,0.15)',color:'#22c55e'}}>{active} Active</span>
        </div>

        <input placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)}
          style={{width:'100%',padding:'10px 16px',borderRadius:10,border:'1px solid rgba(99,132,255,0.2)',background:'rgba(15,23,42,0.9)',color:'#e2e8f0',fontSize:13,marginBottom:20,outline:'none'}}
        />

        <div style={{background:'rgba(15,23,42,0.9)',border:'1px solid rgba(99,132,255,0.12)',borderRadius:14,overflow:'hidden'}}>
          {filtered.length === 0 ? (
            <div style={{padding:30,textAlign:'center' as const,color:'#475569',fontSize:13}}>No tenants found</div>
          ) : filtered.map(t => (
            <div key={t.id} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr',padding:'12px 16px',borderBottom:'1px solid rgba(99,132,255,0.06)',alignItems:'center',gap:8}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:32,height:32,borderRadius:8,background:'rgba(79,142,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#4f8ef7',flexShrink:0}}>
                  {t.first_name?.[0]}{t.last_name?.[0]}
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'#fff'}}>{t.first_name} {t.last_name}</div>
                  <div style={{fontSize:11,color:'#475569'}}>{t.email}</div>
                </div>
              </div>
              <div style={{fontSize:12,color:'#94a3b8'}}>{t.phone}</div>
              <div style={{fontSize:12,color:'#94a3b8'}}>{t.lease_end ? new Date(t.lease_end).toLocaleDateString() : 'â€”'}</div>
              <div style={{fontSize:13,fontWeight:700,color:'#22c55e'}}>${t.monthly_rent}/mo</div>
              <span style={{padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,display:'inline-block',
                background:t.status==='Active'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',
                color:t.status==='Active'?'#22c55e':'#ef4444'}}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
