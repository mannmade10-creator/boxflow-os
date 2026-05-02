'use client'
import { useEffect, useState } from 'react'

export default function UnitsPage() {
  const [units, setUnits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    fetch(`${url}/rest/v1/units?select=*&order=building`, {
      headers: { 'apikey': key!, 'Authorization': `Bearer ${key}` }
    })
    .then(r => r.json())
    .then(data => { setUnits(Array.isArray(data) ? data : []); setLoading(false) })
    .catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? units : units.filter(u => u.status === filter)
  const occupied = units.filter(u => u.status === 'Occupied').length
  const vacant = units.filter(u => u.status === 'Vacant').length

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050d1a',color:'#4f8ef7',fontFamily:'Inter,Arial,sans-serif',fontSize:18}}>
      Loading units...
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
              style={{padding:'6px 12px',fontSize:11,fontWeight:700,color:item==='Units'?'#4f8ef7':'#475569',borderRadius:7,textDecoration:'none',background:item==='Units'?'rgba(79,142,247,0.1)':'transparent'}}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div style={{maxWidth:1200,margin:'0 auto',padding:24}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap' as const,gap:12}}>
          <div>
            <h1 style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:4}}>Unit Directory</h1>
            <p style={{fontSize:13,color:'#475569'}}>Penn Station — All 17 Buildings</p>
          </div>
          <div style={{display:'flex',gap:8}}>
            <span style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,background:'rgba(79,142,247,0.15)',color:'#4f8ef7'}}>{units.length} Total</span>
            <span style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,background:'rgba(34,197,94,0.15)',color:'#22c55e'}}>{occupied} Occupied</span>
            <span style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,background:'rgba(168,85,247,0.15)',color:'#a855f7'}}>{vacant} Vacant</span>
          </div>
        </div>

        <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap' as const}}>
          {['All','Occupied','Vacant','Renovating','Make-Ready'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{padding:'7px 14px',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',
                background:filter===f?'rgba(79,142,247,0.15)':'rgba(15,23,42,0.9)',
                border:filter===f?'1px solid rgba(79,142,247,0.4)':'1px solid rgba(99,132,255,0.15)',
                color:filter===f?'#4f8ef7':'#475569'}}>
              {f}
            </button>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:10}}>
          {filtered.map(unit => (
            <div key={unit.id} style={{background:'rgba(15,23,42,0.9)',
              border:`1px solid ${unit.status==='Occupied'?'rgba(34,197,94,0.3)':unit.status==='Vacant'?'rgba(79,142,247,0.3)':'rgba(245,158,11,0.3)'}`,
              borderRadius:12,padding:12,cursor:'pointer'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                <div style={{fontSize:13,fontWeight:800,color:'#4f8ef7'}}>Unit {unit.unit_number}</div>
                <span style={{padding:'2px 6px',borderRadius:4,fontSize:9,fontWeight:700,
                  background:unit.status==='Occupied'?'rgba(34,197,94,0.15)':'rgba(79,142,247,0.15)',
                  color:unit.status==='Occupied'?'#22c55e':'#4f8ef7'}}>
                  {unit.status==='Occupied'?'OCC':'VAC'}
                </span>
              </div>
              <div style={{fontSize:10,color:'#475569',marginBottom:2}}>Bldg {unit.building}</div>
              <div style={{fontSize:10,color:'#64748b',marginBottom:4}}>{unit.floor_plan} • {unit.sqft} sqft</div>
              <div style={{fontSize:13,fontWeight:700,color:'#22c55e'}}>${unit.monthly_rent}/mo</div>
              <div style={{fontSize:10,color:'#475569',marginTop:2}}>{unit.condition || 'Good'}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}