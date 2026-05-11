'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const C = {
  bg: '#07080d', panel: '#111318', card: '#161820',
  border: 'rgba(59,130,246,0.18)', blue: '#3b82f6',
  green: '#22c55e', purple: '#a78bfa', amber: '#f59e0b',
  red: '#f43f5e', dim: '#64748b', txt: '#f1f5f9',
  D: "'Outfit',sans-serif", M: "'Geist Mono',monospace",
}

const LESSONS = [
  { title: 'Introduction to Algebra', subject: 'Mathematics', students: 42, status: 'Published', lang: 'EN', color: '#3b82f6' },
  { title: 'World History — Ancient Civilizations', subject: 'History', students: 38, status: 'Published', lang: 'EN/ES', color: '#a78bfa' },
  { title: 'Basic Chemistry Concepts', subject: 'Science', students: 55, status: 'Published', lang: 'EN', color: '#22c55e' },
  { title: 'Creative Writing Workshop', subject: 'English', students: 29, status: 'Draft', lang: 'EN', color: '#f59e0b' },
  { title: 'Introduction to Programming', subject: 'Technology', students: 0, status: 'Draft', lang: 'EN', color: '#3b82f6' },
]

export default function ClassFlowDashboard() {
  const [modal, setModal] = useState<any>(null)
  const [students, setStudents] = useState(164)
  useEffect(() => {
    const id = setInterval(() => setStudents(s => s + Math.floor((Math.random() - 0.5) * 3)), 4000)
    return () => clearInterval(id)
  }, [])

  const stats = [
    { label: 'Lessons Created', value: LESSONS.length, icon: '??', color: C.blue },
    { label: 'Published', value: LESSONS.filter(l => l.status === 'Published').length, icon: '?', color: C.green },
    { label: 'Active Students', value: students, icon: '??', color: C.purple },
    { label: 'Languages', value: 4, icon: '??', color: C.amber },
  ]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.txt, fontFamily: C.D }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        .nav-link{padding:6px 12px;border-radius:8px;text-decoration:none;font-size:13px;color:#64748b;transition:color .15s}
        .nav-link:hover{color:#f1f5f9}
        .row-hover{transition:background .12s}
        .row-hover:hover{background:rgba(255,255,255,.02)!important}
        .stat-card{transition:transform .2s}
        .stat-card:hover{transform:translateY(-2px)}
        .modal-act{background:transparent;border:0.5px solid rgba(59,130,246,.25);border-radius:9px;color:#f1f5f9;font-size:12px;font-family:'Outfit',sans-serif;padding:10px 14px;cursor:pointer;text-align:left;transition:all .15s}
        .modal-act:hover{background:rgba(59,130,246,.07);border-color:rgba(59,130,246,.5);color:#3b82f6}
      `}</style>

      <header style={{ background: C.panel, borderBottom: `0.5px solid ${C.border}`, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/classflow/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 2, background: C.panel, clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.blue, position: 'relative', zIndex: 1 }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: C.txt }}>Class<span style={{ color: C.blue }}>Flow</span> AI</span>
        </Link>
        <nav style={{ display: 'flex', gap: 4 }}>
          <Link href="/classflow/dashboard" className="nav-link" style={{ color: C.txt, background: 'rgba(59,130,246,0.1)', border: `0.5px solid rgba(59,130,246,0.3)` }}>Dashboard</Link>
          <Link href="/classflow/create" className="nav-link">Create lesson</Link>
          <Link href="/classflow/students" className="nav-link">Students</Link>
        </nav>
        <Link href="/" style={{ color: C.dim, fontSize: 13, textDecoration: 'none', padding: '6px 10px' }}>? Platform</Link>
      </header>

      <main style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: C.txt, margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: C.dim, marginTop: 4 }}>Welcome back — here is what is happening</p>
          </div>
          <Link href="/classflow/create" style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.blue, color: '#fff', textDecoration: 'none', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
            + New lesson
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {stats.map(({ label, value, icon, color }) => (
            <div key={label} className="stat-card" style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.txt, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `0.5px solid ${C.border}` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>Your Lessons</span>
            <span style={{ fontSize: 10, color: C.dim, fontFamily: C.M, letterSpacing: 1.5 }}>{LESSONS.length} TOTAL</span>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '8px 20px', borderBottom: `0.5px solid ${C.border}` }}>
            {['Title', 'Subject', 'Students', 'Language', 'Status', ''].map((h, i) => (
              <span key={h+i} style={{ ...(h==='Title'?{flex:1,minWidth:0}:h===''?{width:80,flexShrink:0}:{width:h==='Students'?70:80,flexShrink:0}), fontSize:9, color:C.dim, letterSpacing:1.8, fontFamily:C.M, textTransform:'uppercase' as const }}>{h}</span>
            ))}
          </div>
          {LESSONS.map((l, i) => (
            <div key={i} className="row-hover" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 20px', borderBottom: i < LESSONS.length-1 ? `0.5px solid ${C.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
              </div>
              <span style={{ width: 80, flexShrink: 0, fontSize: 11, color: C.dim }}>{l.subject}</span>
              <span style={{ width: 70, flexShrink: 0, fontSize: 12, color: C.txt, fontFamily: C.M }}>{l.students}</span>
              <span style={{ width: 80, flexShrink: 0, fontSize: 11, color: C.dim, fontFamily: C.M }}>{l.lang}</span>
              <div style={{ width: 80, flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontFamily: C.M, color: l.status==='Published'?C.green:C.amber, background: `${l.status==='Published'?C.green:C.amber}18`, border: `0.5px solid ${l.status==='Published'?C.green:C.amber}38`, borderRadius: 5, padding: '2px 7px' }}>{l.status.toUpperCase()}</span>
              </div>
              <button onClick={() => setModal(l)} style={{ width: 80, flexShrink: 0, background: 'transparent', border: `0.5px solid rgba(59,130,246,.3)`, borderRadius: 7, color: C.blue, fontSize: 10.5, fontFamily: C.M, padding: '5px 10px', cursor: 'pointer' }}>EDIT ?</button>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(4,5,10,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(5px)' }}>
          <div onClick={(e: any) => e.stopPropagation()} style={{ background: C.panel, border: `0.5px solid rgba(59,130,246,.3)`, borderRadius: 18, padding: '28px 30px', maxWidth: 420, width: '92%' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: C.txt, marginBottom: 7 }}>{modal.title}</h2>
            <p style={{ fontSize: 11.5, color: C.dim, fontFamily: C.M, marginBottom: 24 }}>{modal.subject} · {modal.students} students · {modal.lang}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {['Edit Content', 'View Students', 'Analytics', 'Add Language', 'Announcement', modal.status==='Draft'?'Publish':'Unpublish'].map(a => (
                <button key={a} className="modal-act">{a}</button>
              ))}
            </div>
            <button onClick={() => setModal(null)} style={{ width: '100%', background: 'transparent', border: `0.5px solid ${C.border}`, borderRadius: 9, color: C.dim, fontSize: 11.5, padding: '10px', cursor: 'pointer', fontFamily: C.M }}>DISMISS</button>
          </div>
        </div>
      )}
    </div>
  )
}
