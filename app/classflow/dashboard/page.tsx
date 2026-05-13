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

const useClock = () => {
  const [t, set] = useState(new Date())
  useEffect(() => { const id = setInterval(() => set(new Date()), 1000); return () => clearInterval(id) }, [])
  return t
}

const useTick = (base: number, v: number, ms = 4000) => {
  const [val, set] = useState(base)
  useEffect(() => {
    const id = setInterval(() => set(Math.max(0, base + Math.floor((Math.random() - .5) * v))), ms)
    return () => clearInterval(id)
  }, [])
  return val
}

const LESSONS = [
  { title: 'Introduction to Algebra', subject: 'Mathematics', students: 42, status: 'Published', lang: 'EN', color: C.blue },
  { title: 'World History — Ancient Civilizations', subject: 'History', students: 38, status: 'Published', lang: 'EN/ES', color: C.purple },
  { title: 'Basic Chemistry Concepts', subject: 'Science', students: 55, status: 'Published', lang: 'EN', color: C.green },
  { title: 'Creative Writing Workshop', subject: 'English', students: 29, status: 'Draft', lang: 'EN', color: C.amber },
  { title: 'Introduction to Programming', subject: 'Technology', students: 0, status: 'Draft', lang: 'EN', color: C.blue },
]

const STUDENTS = [
  { name: 'Emma Rodriguez', grade: '10th', lessons: 3, avgScore: 92, status: 'Active' },
  { name: 'James Thompson', grade: '11th', lessons: 5, avgScore: 78, status: 'Active' },
  { name: 'Aisha Patel', grade: '9th', lessons: 2, avgScore: 88, status: 'Active' },
  { name: 'Marcus Johnson', grade: '10th', lessons: 4, avgScore: 61, status: 'At Risk' },
  { name: 'Sofia Chen', grade: '12th', lessons: 6, avgScore: 95, status: 'Active' },
]

const LANGUAGES = [
  { code: 'EN', name: 'English', lessons: 5, color: C.blue },
  { code: 'ES', name: 'Spanish', lessons: 2, color: C.purple },
  { code: 'FR', name: 'French', lessons: 1, color: C.green },
  { code: 'DE', name: 'German', lessons: 1, color: C.amber },
]

export default function ClassFlowDashboard() {
  const clock = useClock()
  const activeStudents = useTick(164, 5)
  const [modal, setModal] = useState<any>(null)

  const stats = [
    { label: 'Lessons Created', value: LESSONS.length, icon: '📚', color: C.blue },
    { label: 'Published', value: LESSONS.filter(l => l.status === 'Published').length, icon: '✅', color: C.green },
    { label: 'Active Students', value: activeStudents, icon: '👥', color: C.purple },
    { label: 'Languages', value: LANGUAGES.length, icon: '🌐', color: C.amber },
  ]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.txt, fontFamily: C.D, overflowY: 'auto' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .stat-card{animation:fadeUp .4s ease both;transition:transform .2s,box-shadow .2s}
        .stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.4)}
        .row-hover{transition:background .12s}
        .row-hover:hover{background:rgba(255,255,255,.02)!important}
        .act-btn{background:transparent;border:0.5px solid rgba(59,130,246,.3);border-radius:7px;color:${C.blue};font-size:10.5px;font-family:'Geist Mono',monospace;padding:5px 10px;cursor:pointer;white-space:nowrap;transition:all .15s}
        .act-btn:hover{background:rgba(59,130,246,.1);border-color:rgba(59,130,246,.6)}
        .nav-link{padding:6px 12px;border-radius:8px;text-decoration:none;font-size:13px;color:${C.dim};transition:color .15s}
        .nav-link:hover{color:${C.txt}}
        .modal-act{background:transparent;border:0.5px solid rgba(59,130,246,.25);border-radius:9px;color:${C.txt};font-size:12px;font-family:'Outfit',sans-serif;font-weight:500;padding:11px 14px;cursor:pointer;text-align:left;transition:all .15s}
        .modal-act:hover{background:rgba(59,130,246,.07);border-color:rgba(59,130,246,.5);color:${C.blue}}
      `}</style>

      {/* Header */}
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
          <Link href="/classflow/create" className="nav-link">Create Lesson</Link>
          <Link href="/classflow/students" className="nav-link">Students</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: C.dim, fontFamily: C.M }}>{clock.toLocaleTimeString('en-US', { hour12: false })}</span>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: C.dim, fontSize: 13, padding: '6px 10px', borderRadius: 8, textDecoration: 'none' }}>
            ← Platform
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: C.txt, letterSpacing: '-0.02em', margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: C.dim, marginTop: 4 }}>Welcome back — here's what's happening with your courses</p>
          </div>
          <Link href="/classflow/create" style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.blue, color: '#fff', textDecoration: 'none', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
            + New Lesson
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {stats.map(({ label, value, icon, color }, i) => (
            <div key={label} className="stat-card" style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, animationDelay: `${i * 60}ms` }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.txt, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Lessons table */}
        <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `0.5px solid ${C.border}` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>Your Lessons</span>
            <span style={{ fontSize: 10, color: C.dim, fontFamily: C.M, letterSpacing: 1.5 }}>{LESSONS.length} TOTAL</span>
          </div>
          {LESSONS.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: C.dim, marginBottom: 16 }}>No lessons yet</div>
              <Link href="/classflow/create" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(59,130,246,0.1)', color: C.blue, border: `0.5px solid rgba(59,130,246,0.3)`, textDecoration: 'none', padding: '9px 18px', borderRadius: 8, fontSize: 13 }}>
                + Create your first lesson
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 12, padding: '8px 20px', borderBottom: `0.5px solid ${C.border}` }}>
                {['Title', 'Subject', 'Students', 'Language', 'Status', ''].map((h, i) => (
                  <span key={h + i} style={{ ...(h === 'Title' ? { flex: 1, minWidth: 0 } : h === '' ? { width: 80, flexShrink: 0 } : { width: h === 'Students' ? 70 : 80, flexShrink: 0 }), fontSize: 9, color: C.dim, letterSpacing: 1.8, fontFamily: C.M, textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>
              {LESSONS.map((l, i) => (
                <div key={i} className="row-hover" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 20px', borderBottom: i < LESSONS.length - 1 ? `0.5px solid ${C.border}` : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.txt, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                  </div>
                  <span style={{ width: 80, flexShrink: 0, fontSize: 11, color: C.dim }}>{l.subject}</span>
                  <span style={{ width: 70, flexShrink: 0, fontSize: 12, color: C.txt, fontFamily: C.M }}>{l.students}</span>
                  <span style={{ width: 80, flexShrink: 0, fontSize: 11, color: C.dim, fontFamily: C.M }}>{l.lang}</span>
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontFamily: C.M, color: l.status === 'Published' ? C.green : C.amber, background: `${l.status === 'Published' ? C.green : C.amber}18`, border: `0.5px solid ${l.status === 'Published' ? C.green : C.amber}38`, borderRadius: 5, padding: '2px 7px' }}>{l.status.toUpperCase()}</span>
                  </div>
                  <button className="act-btn" style={{ width: 80 }} onClick={() => setModal(l)}>EDIT →</button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Students + Languages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: 16 }}>

          {/* Students */}
          <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `0.5px solid ${C.border}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>Recent Students</span>
              <span style={{ fontSize: 10, color: C.dim, fontFamily: C.M, letterSpacing: 1.5 }}>{activeStudents} ACTIVE</span>
            </div>
            {STUDENTS.map((s, i) => (
              <div key={i} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', borderBottom: i < STUDENTS.length - 1 ? `0.5px solid ${C.border}` : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${C.blue}20`, border: `0.5px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.blue, flexShrink: 0 }}>
                  {s.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: C.txt, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: C.dim }}>{s.grade} · {s.lessons} lessons</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: s.avgScore >= 85 ? C.green : s.avgScore >= 70 ? C.blue : C.amber }}>{s.avgScore}%</div>
                  <div style={{ fontSize: 9.5, color: s.status === 'Active' ? C.green : C.red, fontFamily: C.M }}>{s.status.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Languages */}
          <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${C.border}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>Languages Available</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LANGUAGES.map((l, i) => (
                <div key={i} style={{ background: `${l.color}08`, border: `0.5px solid ${l.color}25`, borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, fontFamily: C.M, fontWeight: 700, color: l.color, background: `${l.color}18`, border: `0.5px solid ${l.color}38`, borderRadius: 5, padding: '2px 7px' }}>{l.code}</span>
                      <span style={{ fontSize: 13, color: C.txt, fontWeight: 600 }}>{l.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: C.dim, fontFamily: C.M }}>{l.lessons} lessons</span>
                  </div>
                  <div style={{ height: 4, background: '#060e1c', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${(l.lessons / 5) * 100}%`, height: '100%', background: l.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
              <Link href="/classflow/create" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(59,130,246,0.06)', border: `0.5px solid rgba(59,130,246,0.25)`, borderRadius: 10, padding: 12, color: C.blue, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                + Add Language
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(4,5,10,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(5px)' }}>
          <div onClick={(e: any) => e.stopPropagation()} style={{ background: C.panel, border: `0.5px solid rgba(59,130,246,.3)`, borderRadius: 18, padding: '28px 30px', maxWidth: 420, width: '92%', boxShadow: '0 30px 80px rgba(0,0,0,.65)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: modal.color }} />
              <span style={{ fontSize: 10, color: modal.color, fontFamily: C.M, letterSpacing: 2 }}>{modal.status.toUpperCase()}</span>
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: C.txt, marginBottom: 7, lineHeight: 1.35 }}>{modal.title}</h2>
            <p style={{ fontSize: 11.5, color: C.dim, fontFamily: C.M, marginBottom: 24 }}>{modal.subject} · {modal.students} students · {modal.lang}</p>
            <div style={{ fontSize: 9.5, color: C.dim, fontFamily: C.M, letterSpacing: 2, marginBottom: 11 }}>ACTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {['📝 Edit Content', '👥 View Students', '📊 Analytics', '🌐 Add Language', '📣 Announcement', modal.status === 'Draft' ? '✅ Publish' : '📦 Unpublish'].map(a => (
                <button key={a} className="modal-act">{a}</button>
              ))}
            </div>
            <button onClick={() => setModal(null)} style={{ width: '100%', background: 'transparent', border: `0.5px solid ${C.border}`, borderRadius: 9, color: C.dim, fontSize: 11.5, padding: '10px', cursor: 'pointer', fontFamily: C.M, letterSpacing: 1 }}>DISMISS</button>
          </div>
        </div>
      )}
    </div>
  )
}