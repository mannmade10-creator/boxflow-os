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

const INSTRUCTORS = [
  { id: 'marcus', name: 'Marcus', style: 'Professional', langs: 'EN · ES', avatar: 'M' },
  { id: 'ava',    name: 'Ava',    style: 'Casual',       langs: 'EN · FR', avatar: 'A' },
  { id: 'sofia',  name: 'Sofia',  style: 'Energetic',    langs: 'ES · PT', avatar: 'S' },
  { id: 'james',  name: 'James',  style: 'Professional', langs: 'EN · FR', avatar: 'J' },
]

const LANGUAGES = ['English', 'Spanish', 'French', 'Portuguese']

const GENERATES = [
  { icon: 'V', title: 'AI video lesson',  sub: 'Live avatar instructor' },
  { icon: 'Q', title: 'Quiz',             sub: '8 auto-scored questions' },
  { icon: 'S', title: 'Summary',          sub: 'Key takeaways' },
  { icon: 'K', title: 'Key terms',        sub: '6 vocabulary cards' },
]

export default function ClassFlowCreate() {
  const [tab, setTab]               = useState<'type'|'upload'>('type')
  const [content, setContent]       = useState('')
  const [language, setLanguage]     = useState('English')
  const [instructor, setInstructor] = useState('marcus')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated]   = useState(false)

  async function handleGenerate() {
    if (!content.trim()) return
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2500))
    setGenerating(false)
    setGenerated(true)
  }

  const inp = { width: '100%', background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', fontSize: 13, color: C.txt, fontFamily: C.D, outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.txt, fontFamily: C.D }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap');
        .nav-link{padding:6px 12px;border-radius:8px;text-decoration:none;font-size:13px;color:#64748b;transition:color .15s}
        .nav-link:hover{color:#f1f5f9}
        .inst-card{cursor:pointer;transition:all .15s}
        .inst-card:hover{border-color:rgba(59,130,246,0.5)!important}
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
          <Link href="/classflow/create" className="nav-link" style={{ color: C.txt, background: 'rgba(59,130,246,0.1)', border: `0.5px solid rgba(59,130,246,0.3)` }}>Create lesson</Link>
          <Link href="/classflow/students" className="nav-link">Students</Link>
        </nav>
        <Link href="/" style={{ color: C.dim, fontSize: 13, textDecoration: 'none', padding: '6px 10px' }}>Back to Platform</Link>
      </header>

      <main style={{ padding: '28px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: C.txt, marginBottom: 6, letterSpacing: '-0.02em' }}>Create a lesson</h1>
        <p style={{ fontSize: 13, color: C.dim, marginBottom: 24 }}>Add your content and AI will build the full lesson package.</p>

        {generated ? (
          <div style={{ background: C.card, border: `0.5px solid rgba(34,197,94,0.3)`, borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>+</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.txt, marginBottom: 8 }}>Lesson Generated!</h2>
            <p style={{ color: C.dim, fontSize: 14, marginBottom: 28 }}>Your AI-powered lesson is ready. Video, quiz, summary, and key terms have been created.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/classflow/dashboard" style={{ padding: '11px 24px', background: C.blue, color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>View in Dashboard</Link>
              <button onClick={() => { setGenerated(false); setContent('') }} style={{ padding: '11px 24px', background: 'transparent', border: `0.5px solid ${C.border}`, color: C.dim, borderRadius: 10, cursor: 'pointer', fontSize: 14, fontFamily: C.D }}>Create Another</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${C.border}`, fontSize: 14, fontWeight: 700, color: C.txt }}>Lesson content</div>
                <div style={{ display: 'flex', gap: 8, padding: '12px 20px 0' }}>
                  {(['type', 'upload'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{ padding: '6px 14px', borderRadius: 8, border: `0.5px solid ${tab === t ? C.blue : C.border}`, background: tab === t ? 'rgba(59,130,246,0.1)' : 'transparent', color: tab === t ? C.blue : C.dim, fontSize: 12, cursor: 'pointer', fontFamily: C.D }}>
                      {t === 'type' ? 'Type content' : 'Upload file'}
                    </button>
                  ))}
                </div>
                <div style={{ padding: 20 }}>
                  {tab === 'type' ? (
                    <textarea style={{ ...inp, minHeight: 180 }} placeholder="Paste your notes, slides, outlines, or any lesson content here..." value={content} onChange={e => setContent(e.target.value)} />
                  ) : (
                    <div style={{ border: `2px dashed ${C.border}`, borderRadius: 10, padding: '40px 20px', textAlign: 'center', cursor: 'pointer' }}>
                      <p style={{ color: C.dim, fontSize: 13 }}>Drop a PDF, DOCX, or PPTX file here</p>
                      <p style={{ color: C.dim, fontSize: 11, marginTop: 4 }}>or click to browse</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.txt, marginBottom: 14 }}>Language</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {LANGUAGES.map(l => (
                    <button key={l} onClick={() => setLanguage(l)} style={{ padding: '7px 16px', borderRadius: 8, border: `0.5px solid ${language === l ? C.blue : C.border}`, background: language === l ? 'rgba(59,130,246,0.1)' : 'transparent', color: language === l ? C.blue : C.dim, fontSize: 13, cursor: 'pointer', fontFamily: C.D }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${C.border}`, fontSize: 14, fontWeight: 700, color: C.txt }}>AI Instructor</div>
                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {INSTRUCTORS.map(i => (
                    <div key={i.id} className="inst-card" onClick={() => setInstructor(i.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: `0.5px solid ${instructor === i.id ? C.blue : C.border}`, background: instructor === i.id ? 'rgba(59,130,246,0.08)' : 'transparent' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${C.blue}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: C.blue, flexShrink: 0 }}>{i.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.txt }}>{i.name}</div>
                        <div style={{ fontSize: 11, color: C.dim }}>{i.style} · {i.langs}</div>
                      </div>
                      {instructor === i.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.blue, flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${C.border}`, fontSize: 14, fontWeight: 700, color: C.txt }}>What gets generated</div>
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {GENERATES.map((g, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: `${C.blue}18`, border: `0.5px solid ${C.blue}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: C.blue, flexShrink: 0 }}>{g.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, color: C.txt, fontWeight: 500 }}>{g.title}</div>
                        <div style={{ fontSize: 11, color: C.dim }}>{g.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!generated && (
          <div style={{ marginTop: 20 }}>
            <button onClick={handleGenerate} disabled={!content.trim() || generating}
              style={{ width: '100%', padding: '15px', background: content.trim() ? C.blue : 'rgba(59,130,246,0.3)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700, cursor: content.trim() ? 'pointer' : 'not-allowed', fontFamily: C.D }}>
              {generating ? 'Generating lesson...' : 'Generate lesson'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}