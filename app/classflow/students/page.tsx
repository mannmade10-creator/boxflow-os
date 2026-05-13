'use client'
import { useState } from 'react'
import Link from 'next/link'

const C = {
  bg: '#07080d', panel: '#111318', card: '#161820',
  border: 'rgba(59,130,246,0.18)', blue: '#3b82f6',
  green: '#22c55e', purple: '#a78bfa', amber: '#f59e0b',
  red: '#f43f5e', dim: '#64748b', txt: '#f1f5f9',
  D: "'Outfit',sans-serif", M: "'Geist Mono',monospace",
}

const STUDENTS = [
  { id: 1, name: 'Emma Rodriguez',  grade: '10th', lessons: 3, avgScore: 92, status: 'Active',  lastSeen: '2 hrs ago',  courses: ['AI & Machine Learning', 'English Literature'] },
  { id: 2, name: 'James Thompson',  grade: '11th', lessons: 5, avgScore: 78, status: 'Active',  lastSeen: '1 hr ago',   courses: ['Calculus II', 'Data Science'] },
  { id: 3, name: 'Aisha Patel',     grade: '9th',  lessons: 2, avgScore: 88, status: 'Active',  lastSeen: '30 min ago', courses: ['AI & Machine Learning'] },
  { id: 4, name: 'Marcus Johnson',  grade: '10th', lessons: 4, avgScore: 61, status: 'At Risk', lastSeen: '7 days ago', courses: ['Business 101', 'English Literature'] },
  { id: 5, name: 'Sofia Chen',      grade: '12th', lessons: 6, avgScore: 95, status: 'Active',  lastSeen: '15 min ago', courses: ['Data Science', 'AI & Machine Learning'] },
  { id: 6, name: 'Liam Nguyen',     grade: '11th', lessons: 3, avgScore: 74, status: 'Active',  lastSeen: '3 hrs ago',  courses: ['Calculus II'] },
  { id: 7, name: 'Zara Williams',   grade: '9th',  lessons: 1, avgScore: 83, status: 'Active',  lastSeen: '1 day ago',  courses: ['English Literature'] },
  { id: 8, name: 'Daniel Kim',      grade: '12th', lessons: 5, avgScore: 55, status: 'At Risk', lastSeen: '5 days ago', courses: ['Business 101'] },
]

export default function ClassFlowStudents() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [modal, setModal]   = useState<any>(null)

  const filtered = STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || s.status === filter
    return matchSearch && matchFilter
  })

  const stats = [
    { label: 'Total Students', value: STUDENTS.length,                                           icon: 'U', color: C.blue   },
    { label: 'Active',         value: STUDENTS.filter(s => s.status === 'Active').length,        icon: '+', color: C.green  },
    { label: 'At Risk',        value: STUDENTS.filter(s => s.status === 'At Risk').length,       icon: '!', color: C.red    },
    { label: 'Avg Score',      value: Math.round(STUDENTS.reduce((a,s) => a + s.avgScore, 0) / STUDENTS.length) + '%', icon: '%', color: C.purple },
  ]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.txt, fontFamily: C.D }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
        .nav-link{padding:6px 12px;border-radius:8px;text-decoration:none;font-size:13px;color:#64748b;transition:color .15s}
        .nav-link:hover{color:#f1f5f9}
        .row-hover{transition:background .12s}
        .row-hover:hover{background:rgba(255,255,255,.02)!important}
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
          <Link href="/classflow/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/classflow/create" className="nav-link">Create lesson</Link>
          <Link href="/classflow/students" className="nav-link" style={{ color: C.txt, background: 'rgba(59,130,246,0.1)', border: `0.5px solid rgba(59,130,246,0.3)` }}>Students</Link>
        </nav>
        <Link href="/" style={{ color: C.dim, fontSize: 13, textDecoration: 'none', padding: '6px 10px' }}>Back to Platform</Link>
      </header>

      <main style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: C.txt, margin: 0, letterSpacing: '-0.02em' }}>Students</h1>
            <p style={{ fontSize: 13, color: C.dim, marginTop: 4 }}>{STUDENTS.length} enrolled across all courses</p>
          </div>
          <button style={{ padding: '10px 18px', background: C.blue, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: C.D }}>+ Invite Student</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {stats.map(({ label, value, icon, color }) => (
            <div key={label} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color, flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.txt, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `0.5px solid ${C.border}`, gap: 12, flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." style={{ background: '#0d0f14', border: `0.5px solid ${C.border}`, borderRadius: 8, padding: '8px 14px', fontSize: 13, color: C.txt, fontFamily: C.D, outline: 'none', width: 220 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Active', 'At Risk'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 8, border: `0.5px solid ${filter === f ? C.blue : C.border}`, background: filter === f ? 'rgba(59,130,246,0.1)' : 'transparent', color: filter === f ? C.blue : C.dim, fontSize: 12, cursor: 'pointer', fontFamily: C.D }}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, padding: '8px 20px', borderBottom: `0.5px solid ${C.border}` }}>
            {['Student', 'Grade', 'Lessons', 'Avg Score', 'Last Seen', 'Status', ''].map((h, i) => (
              <span key={h+i} style={{ ...(h==='Student'?{flex:1,minWidth:0}:h===''?{width:80,flexShrink:0}:{width:h==='Lessons'||h==='Grade'?70:h==='Last Seen'?100:80,flexShrink:0}), fontSize:9, color:C.dim, letterSpacing:1.8, fontFamily:C.M, textTransform:'uppercase' as const }}>{h}</span>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: C.dim, fontSize: 13 }}>No students found</div>
          ) : filtered.map((s, i) => (
            <div key={s.id} className="row-hover" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 20px', borderBottom: i < filtered.length-1 ? `0.5px solid ${C.border}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${C.blue}20`, border: `0.5px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.blue, flexShrink: 0 }}>{s.name.charAt(0)}</div>
                <span style={{ fontSize: 13, color: C.txt, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
              </div>
              <span style={{ width: 70, flexShrink: 0, fontSize: 12, color: C.dim }}>{s.grade}</span>
              <span style={{ width: 70, flexShrink: 0, fontSize: 12, color: C.txt, fontFamily: C.M }}>{s.lessons}</span>
              <div style={{ width: 80, flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.avgScore >= 85 ? C.green : s.avgScore >= 70 ? C.blue : C.amber }}>{s.avgScore}%</span>
              </div>
              <span style={{ width: 100, flexShrink: 0, fontSize: 11, color: C.dim, fontFamily: C.M }}>{s.lastSeen}</span>
              <div style={{ width: 80, flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontFamily: C.M, color: s.status==='Active'?C.green:C.red, background:`${s.status==='Active'?C.green:C.red}18`, border:`0.5px solid ${s.status==='Active'?C.green:C.red}38`, borderRadius:5, padding:'2px 7px' }}>{s.status.toUpperCase()}</span>
              </div>
              <button onClick={() => setModal(s)} style={{ width: 80, flexShrink: 0, background: 'transparent', border: `0.5px solid rgba(59,130,246,.3)`, borderRadius: 7, color: C.blue, fontSize: 10.5, fontFamily: C.M, padding: '5px 10px', cursor: 'pointer' }}>VIEW</button>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(4,5,10,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(5px)' }}>
          <div onClick={(e: any) => e.stopPropagation()} style={{ background: C.panel, border: `0.5px solid rgba(59,130,246,.3)`, borderRadius: 18, padding: '28px 30px', maxWidth: 420, width: '92%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${C.blue}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: C.blue }}>{modal.name.charAt(0)}</div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: C.txt, margin: 0 }}>{modal.name}</h2>
                <p style={{ fontSize: 12, color: C.dim, margin: 0, fontFamily: C.M }}>{modal.grade} · {modal.lessons} lessons · {modal.lastSeen}</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[['Avg Score', modal.avgScore + '%'], ['Status', modal.status], ['Lessons', modal.lessons], ['Grade', modal.grade]].map(([l, v]) => (
                <div key={l} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: C.dim, fontFamily: C.M, letterSpacing: 1.5, marginBottom: 4 }}>{String(l).toUpperCase()}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.txt }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9.5, color: C.dim, fontFamily: C.M, letterSpacing: 2, marginBottom: 8 }}>ENROLLED COURSES</div>
              {modal.courses.map((c: string) => (
                <div key={c} style={{ fontSize: 12, color: C.txt, background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', marginBottom: 6 }}>{c}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {['View Progress', 'Send Message', 'Assign Lesson', 'Flag for Review'].map(a => (
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