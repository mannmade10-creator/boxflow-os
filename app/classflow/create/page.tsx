'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Upload, Loader2, CheckCircle, ChevronRight, Video } from 'lucide-react'

const INSTRUCTORS = [
  { id: 'marcus', name: 'Marcus', style: 'Professional', langs: 'EN Â· ES', emoji: 'ðŸ‘¨ðŸ¾' },
  { id: 'ava', name: 'Ava', style: 'Casual', langs: 'EN Â· FR', emoji: 'ðŸ‘©ðŸ»' },
  { id: 'sofia', name: 'Sofia', style: 'Energetic', langs: 'ES Â· PT', emoji: 'ðŸ‘©ðŸ½' },
  { id: 'james', name: 'James', style: 'Professional', langs: 'EN Â· FR', emoji: 'ðŸ‘¨ðŸ¼' },
]

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'pt', label: 'Portuguese' },
]

export default function CreatePage() {
  const [step, setStep] = useState<'input' | 'generating' | 'review' | 'video' | 'done'>('input')
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text')
  const [textContent, setTextContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState('en')
  const [instructor, setInstructor] = useState('marcus')
  const [result, setResult] = useState<any>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoStatus, setVideoStatus] = useState('')
  const [error, setError] = useState('')
  const supabase = supabase

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const btnStyle = (active: boolean) => ({
    padding: '7px 16px', borderRadius: 8, border: '0.5px solid',
    borderColor: active ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)',
    background: active ? 'rgba(59,130,246,0.1)' : 'transparent',
    color: active ? '#3b82f6' : '#64748b',
    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
  } as React.CSSProperties)

  async function handleGenerate() {
    const content = inputMode === 'text' ? textContent : file ? await file.text() : ''
    if (!content.trim()) { setError('Please add some content first.'); return }
    setError('')
    setStep('generating')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, language, instructor }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setResult(data)
      setStep('review')
    } catch (err: any) {
      setError(err.message)
      setStep('input')
    }
  }

  async function handleGenerateVideo() {
    setStep('video')
    setVideoStatus('Submitting to D-IDâ€¦')
    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: result.script, instructor }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Video generation failed')
      setVideoStatus('Renderingâ€¦ checking every 8 seconds.')
      pollVideoStatus(data.video_id)
    } catch (err: any) {
      setError(err.message)
      setStep('review')
    }
  }

  function pollVideoStatus(id: string) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/generate-video?video_id=${id}`)
        const data = await res.json()
        setVideoStatus(`Status: ${data.status}`)
        if ((data.status === 'completed' || data.status === 'done') && data.video_url) {
          clearInterval(interval)
          setVideoUrl(data.video_url)
          setStep('done')
        }
        if (data.status === 'error' || data.status === 'failed') {
          clearInterval(interval)
          setError('Video generation failed. Please try again.')
          setStep('review')
        }
      } catch {
        clearInterval(interval)
      }
    }, 8000)
  }

  const topbar = (
    <header style={{
      background: '#111318', borderBottom: '0.5px solid rgba(59,130,246,0.18)',
      height: 52, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28, height: 28, background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)',
          clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 2, background: '#111318', clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)' }} />
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', position: 'relative', zIndex: 1 }} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>
          Class<span style={{ color: '#3b82f6' }}>Flow</span> AI
        </span>
      </Link>
      <nav style={{ display: 'flex', gap: 4 }}>
        {[{ href: '/dashboard', label: 'Dashboard' }, { href: '/create', label: 'Create lesson' }, { href: '/students', label: 'Students' }].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            padding: '6px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 13,
            color: href === '/create' ? '#3b82f6' : '#64748b',
            background: href === '/create' ? 'rgba(59,130,246,0.1)' : 'transparent',
          }}>{label}</Link>
        ))}
      </nav>
      <button onClick={handleSignOut} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13, padding: '6px 10px', borderRadius: 8 }}>
        Sign out
      </button>
    </header>
  )

  if (step === 'generating') return (
    <div style={{ minHeight: '100vh', background: '#07080d' }}>
      {topbar}
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Loader2 size={40} color="#3b82f6" style={{ margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Building your lessonâ€¦</h2>
        <p style={{ fontSize: 13, color: '#64748b' }}>AI is generating your script, quiz, and summary.</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  if (step === 'video') return (
    <div style={{ minHeight: '100vh', background: '#07080d' }}>
      {topbar}
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Video size={40} color="#3b82f6" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>Generating AI videoâ€¦</h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Your AI instructor is being rendered. This takes 2â€“5 minutes.</p>
        <div style={{
          display: 'inline-block', padding: '10px 20px',
          background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.3)',
          borderRadius: 8, fontSize: 13, color: '#3b82f6',
        }}>{videoStatus}</div>
      </div>
    </div>
  )

  if (step === 'done' && videoUrl) return (
    <div style={{ minHeight: '100vh', background: '#07080d' }}>
      {topbar}
      <main style={{ padding: '28px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <CheckCircle size={22} color="#22c55e" />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Your AI lesson is ready!</h1>
        </div>
        <div style={{
          background: '#000', borderRadius: 14, overflow: 'hidden',
          border: '0.5px solid rgba(59,130,246,0.2)', marginBottom: 20,
          aspectRatio: '16/9',
        }}>
          <video src={videoUrl} controls autoPlay style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>TITLE</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>{result.title}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>DESCRIPTION</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{result.description}</div>
          </div>
          <div style={{ background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>QUIZ PREVIEW</div>
            {result.quiz?.slice(0, 2).map((q: any, i: number) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0', marginBottom: 4 }}>{i + 1}. {q.question}</div>
                <div style={{ fontSize: 11, color: '#22c55e' }}>âœ“ {q.options?.[q.correct_index]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setStep('input'); setResult(null); setVideoUrl(null) }} style={{
            padding: '12px 20px', borderRadius: 10, border: '0.5px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#64748b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>Create another</button>
          <Link href="/dashboard" style={{
            flex: 1, padding: '12px', borderRadius: 10, background: '#2563eb',
            color: '#fff', fontSize: 14, fontWeight: 500, textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>Go to dashboard</Link>
        </div>
      </main>
    </div>
  )

  if (step === 'review' && result) return (
    <div style={{ minHeight: '100vh', background: '#07080d' }}>
      {topbar}
      <main style={{ padding: '28px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <CheckCircle size={22} color="#22c55e" />
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>Lesson script ready!</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>TITLE</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>{result.title}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>DESCRIPTION</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{result.description}</div>
          </div>
          <div style={{ background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>QUIZ PREVIEW</div>
            {result.quiz?.slice(0, 2).map((q: any, i: number) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0', marginBottom: 4 }}>{i + 1}. {q.question}</div>
                <div style={{ fontSize: 11, color: '#22c55e' }}>âœ“ {q.options?.[q.correct_index]}</div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: '#64748b' }}>+{Math.max(0, (result.quiz?.length || 0) - 2)} more questions</div>
          </div>
        </div>
        <div style={{ background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>SCRIPT PREVIEW</div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{result.script?.slice(0, 400)}â€¦</div>
        </div>
        {error && <div style={{ marginBottom: 16, fontSize: 13, color: '#f87171' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setStep('input'); setResult(null) }} style={{
            padding: '12px 20px', borderRadius: 10, border: '0.5px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#64748b', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          }}>Start over</button>
          <button onClick={handleGenerateVideo} style={{
            flex: 1, padding: '12px', borderRadius: 10, background: '#2563eb',
            border: 'none', color: '#fff', fontSize: 14, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'inherit',
          }}>
            <Video size={15} /> Generate AI video lesson
          </button>
        </div>
      </main>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#07080d' }}>
      {topbar}
      <main style={{ padding: '28px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Create a lesson</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28 }}>Add your content and AI will build the full lesson package.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Lesson content</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button style={btnStyle(inputMode === 'text')} onClick={() => setInputMode('text')}>âœï¸ Type content</button>
                <button style={btnStyle(inputMode === 'file')} onClick={() => setInputMode('file')}>ðŸ“„ Upload file</button>
              </div>
              {inputMode === 'text' ? (
                <textarea
                  value={textContent} onChange={e => setTextContent(e.target.value)}
                  placeholder="Paste your notes, slides, outlines, or any lesson content here..."
                  style={{ width: '100%', height: 180, padding: '12px 14px', fontSize: 13, resize: 'vertical', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#f1f5f9', fontFamily: 'inherit', outline: 'none' }}
                />
              ) : (
                <div onClick={() => document.getElementById('fileInput')?.click()} style={{
                  border: '1px dashed rgba(59,130,246,0.3)', borderRadius: 10,
                  padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  <Upload size={24} color="#3b82f6" style={{ margin: '0 auto 10px', display: 'block' }} />
                  {file ? (
                    <div style={{ fontSize: 13, color: '#f1f5f9' }}>{file.name}</div>
                  ) : (
                    <div style={{ fontSize: 13, color: '#64748b' }}>Click to upload PDF, DOCX, or TXT</div>
                  )}
                  <input id="fileInput" type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }}
                    onChange={e => setFile(e.target.files?.[0] || null)} />
                </div>
              )}
            </div>
            <div style={{ background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>Language</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} style={btnStyle(language === l.code)} onClick={() => setLanguage(l.code)}>{l.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>AI Instructor</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {INSTRUCTORS.map(inst => (
                  <div key={inst.id} onClick={() => setInstructor(inst.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 9, border: '0.5px solid',
                    borderColor: instructor === inst.id ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.06)',
                    background: instructor === inst.id ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                  }}>
                    <span style={{ fontSize: 22 }}>{inst.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#f1f5f9' }}>{inst.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{inst.style} Â· {inst.langs}</div>
                    </div>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: instructor === inst.id ? '#3b82f6' : 'rgba(255,255,255,0.1)' }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#161820', border: '0.5px solid rgba(59,130,246,0.18)', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 12 }}>What gets generated</div>
              {[
                { icon: 'ðŸŽ¬', label: 'AI video lesson', desc: 'Live avatar instructor' },
                { icon: 'ðŸ“', label: 'Quiz', desc: '8 auto-scored questions' },
                { icon: 'ðŸ“„', label: 'Summary', desc: 'Key takeaways' },
                { icon: 'ðŸ“š', label: 'Key terms', desc: '6 vocabulary cards' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {error && <div style={{ marginTop: 12, fontSize: 13, color: '#f87171' }}>{error}</div>}
        <button onClick={handleGenerate} style={{
          marginTop: 20, width: '100%', padding: 14, background: '#2563eb',
          border: 'none', borderRadius: 11, color: '#fff', fontSize: 14, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'inherit',
        }}>
          Generate lesson <ChevronRight size={15} />
        </button>
      </main>
    </div>
  )
}
