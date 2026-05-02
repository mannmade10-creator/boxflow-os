'use client'
import { useEffect, useState } from 'react'

export default function FinancePage() {
  const [payments, setPayments] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const headers = { 'apikey': key!, 'Authorization': `Bearer ${key}` }
    Promise.all([
      fetch(`${url}/rest/v1/rent_payments?select=*&order=created_at.desc`, { headers }).then(r => r.json()),
      fetch(`${url}/rest/v1/staff?select=*`, { headers }).then(r => r.json()),
    ]).then(([p, s]) => {
      setPayments(Array.isArray(p) ? p : [])
      setStaff(Array.isArray(s) ? s : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const paid = payments.filter(p => p.status === 'Paid')
  const overdue = payments.filter(p => p.status === 'Overdue')
  const totalCollected = paid.reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalOverdue = overdue.reduce((sum, p) => sum + (p.amount || 0), 0)
  const payrollTotal = staff.reduce((sum, s) => sum + ((s.hourly_rate || 0) * 80), 0)

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050d1a',color:'#4f8ef7',fontFamily:'Inter,Arial,sans-serif',fontSize:18}}>
      Loading finance...
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
                color:item==='Finance'?'#4f8ef7':'#475569',borderRadius:7,textDecoration:'none',
                background:item==='Finance'?'rgba(79,142,247,0.1)':'transparent'}}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div style={{maxWidth:1200,margin:'0 auto',padding:24}}>
        <h1 style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:4}}>Finance</h1>
        <p style={{fontSize:13,color:'#475569',marginBottom:20}}>Rent collection, payroll & expenses</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:20}}>
          {[
            {title:'Collected',value:`$${totalCollected.toLocaleString()}`,color:'#22c55e'},
            {title:'Overdue',value:`$${totalOverdue.toLocaleString()}`,color:'#ef4444'},
            {title:'Payroll Est.',value:`$${payrollTotal.toLocaleString()}`,color:'#f59e0b'},
            {title:'Net Revenue',value:`$${(totalCollected - payrollTotal).toLocaleString()}`,color:'#a855f7'},
          ].map(k => (
            <div key={k.title} style={{background:'rgba(15,23,42,0.9)',border:'1px solid rgba(99,132,255,0.12)',borderRadius:14,padding:16,borderTop:`3px solid ${k.color}`}}>
              <div style={{fontSize:10,color:'#475569',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:1,marginBottom:8}}>{k.title}</div>
              <div style={{fontSize:28,fontWeight:800,color:k.color}}>{k.value}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
          <div style={{background:'rgba(15,23,42,0.9)',border:'1px solid rgba(99,132,255,0.12)',borderRadius:14,padding:18}}>
            <div style={{fontSize:10,color:'#475569',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:1.5,marginBottom:14}}>Rent Payments</div>
            {payments.length === 0 ? (
              <div style={{color:'#475569',fontSize:13}}>No payments found</div>
            ) : payments.map(p => (
              <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid rgba(99,132,255,0.07)'}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>${p.amount}</div>
                  <div style={{fontSize:11,color:'#475569'}}>{p.method} â€¢ {p.due_date ? new Date(p.due_date).toLocaleDateString() : 'â€”'}</div>
                </div>
                <span style={{padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,
                  background:p.status==='Paid'?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',
                  color:p.status==='Paid'?'#22c55e':'#ef4444'}}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>

          <div style={{background:'rgba(15,23,42,0.9)',border:'1px solid rgba(99,132,255,0.12)',borderRadius:14,padding:18}}>
            <div style={{fontSize:10,color:'#475569',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:1.5,marginBottom:14}}>Payroll â€” Staff</div>
            {staff.length === 0 ? (
              <div style={{color:'#475569',fontSize:13}}>No staff found</div>
            ) : staff.map(s => {
              const gross = (s.hourly_rate || 0) * 80
              return (
                <div key={s.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:'1px solid rgba(99,132,255,0.07)'}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>{s.name}</div>
                    <div style={{fontSize:11,color:'#475569'}}>{s.role} â€¢ ${s.hourly_rate}/hr â€¢ {s.pay_method}</div>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:'#22c55e'}}>${gross.toLocaleString()}</div>
                </div>
              )
            })}
            <div style={{display:'flex',justifyContent:'space-between',padding:'12px 0 0',marginTop:4}}>
              <span style={{fontSize:13,fontWeight:700,color:'#fff'}}>Total Payroll</span>
              <span style={{fontSize:15,fontWeight:800,color:'#f59e0b'}}>${payrollTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

