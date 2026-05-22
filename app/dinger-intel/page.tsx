'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const FEATURES = [
  { icon: '🔥', title: 'Hot Streak Analysis', desc: 'Real-time L10 game logs. Know who is locked in and who is slumping before the first pitch.' },
  { icon: '🎯', title: 'Matchup Scoring', desc: 'Batter ISO vs pitcher handedness. We surface the edges sportsbooks hope you miss.' },
  { icon: '⚾', title: 'Park Factor Engine', desc: 'Every park rated against league average. Coors Field is not the same as Petco — we price the difference.' },
  { icon: '🌤', title: 'Weather Intelligence', desc: 'Out-to-CF wind, heat, humidity — all factored into every pick in real time.' },
  { icon: '⚡', title: 'Pitch Arsenal Edge', desc: 'We map every pitcher\'s arsenal against the batter\'s weakness pitch by pitch. No guessing.' },
  { icon: '📊', title: 'Parlay Builder', desc: 'Stack your best picks into a parlay. We calculate combined odds and estimated payout instantly.' },
]

const GRADES = [
  { grade: 'S', label: 'Elite Edge', score: '88+', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', desc: 'Everything aligns. Hot batter, weak pitcher, favorable park and weather.' },
  { grade: 'A', label: 'Strong Value', score: '76–87', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', desc: 'Multiple strong edges. High confidence pick for single-game or parlay.' },
  { grade: 'B', label: 'Solid Value', score: '64–75', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', desc: 'Good edge in 2-3 dimensions. Worth including at the right odds.' },
  { grade: 'C', label: 'Speculative', score: 'Below 64', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', desc: 'Situational. Only at plus odds with a specific edge you like.' },
]

const SAMPLE_PICKS = [
  { name: 'Aaron Judge', team: 'NYY', pos: 'RF', grade: 'S', score: 91, odds: '+320', pitcher: 'Lucas Giolito', hand: 'R', hot_streak: 88, matchup: 94, park: 85, weather: 90, pitch_edge: 89, weak_spot: 92 },
  { name: 'Kyle Schwarber', team: 'PHI', pos: 'LF', grade: 'A', score: 82, odds: '+410', pitcher: 'Dylan Cease', hand: 'R', hot_streak: 76, matchup: 88, park: 92, weather: 78, pitch_edge: 82, weak_spot: 79 },
  { name: 'Yordan Alvarez', team: 'HOU', pos: 'DH', grade: 'A', score: 79, odds: '+280', pitcher: 'Shane Bieber', hand: 'R', hot_streak: 84, matchup: 81, park: 73, weather: 75, pitch_edge: 77, weak_spot: 80 },
]

function BarMini({ val, color }: { val: number; color: string }) {
  function barColor(v: number) {
    if (v >= 85) return '#22c55e'
    if (v >= 70) return '#3b82f6'
    if (v >= 55) return '#f59e0b'
    return '#ef4444'
  }
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', width: `${val}%`, background: barColor(val), borderRadius: 2 }} />
    </div>
  )
}

export default function DingerIntelLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [activeGrade, setActiveGrade] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = 420 }
    resize()
    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2, speed: Math.random() * 0.004 + 0.001, phase: Math.random() * Math.PI * 2
    }))
    let raf: number
    function draw(t: number) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)
      stars.forEach(s => {
        const a = 0.08 + 0.35 * Math.abs(Math.sin(t * s.speed + s.phase))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  async function joinWaitlist() {
    if (!email) return
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/contact_leads`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ name: 'Dinger Intel Waitlist', email, message: 'Joined Dinger Intel waitlist', interest: 'Dinger Intel' })
      })
      setJoined(true)
    } catch { setJoined(true) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes glow{0%,100%{box-shadow:0 0 30px rgba(239,68,68,0.3)}50%{box-shadow:0 0 60px rgba(239,68,68,0.6)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .feat-card{transition:transform 0.2s,border-color 0.2s}
        .feat-card:hover{transform:translateY(-4px);border-color:rgba(239,68,68,0.4)!important}
        .grade-btn{transition:all 0.15s;cursor:pointer}
        .grade-btn:hover{opacity:0.85}
        .pick-card{transition:transform 0.2s}
        .pick-card:hover{transform:translateY(-2px)}
        nav a{text-decoration:none;color:#64748b;font-size:13px;transition:color 0.15s}
        nav a:hover{color:#f0f6ff}
        .cta-glow{animation:glow 3s ease-in-out infinite}
      `}</style>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', zIndex: 100, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#991b1b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚾</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Dinger Intel</div>
            <div style={{ fontSize: 8, color: '#ef4444', letterSpacing: 2, textTransform: 'uppercase' }}>by Made Technologies</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="#how-it-works">How It Works</a>
          <a href="#picks">Sample Picks</a>
          <a href="#grades">Grading</a>
          <a href="#waitlist" style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#991b1b,#ef4444)', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', animation: 'glow 3s ease-in-out infinite' }}>
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 24px 60px', textAlign: 'center', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

        {/* Diamond pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', animation: 'fadeUp 0.8s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 100, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            AI-Powered MLB HR Intelligence
          </div>

          <h1 style={{ fontSize: 'clamp(38px,7vw,80px)', fontWeight: 900, lineHeight: 1.0, margin: '0 0 24px', letterSpacing: -3 }}>
            Stop Guessing.<br />
            <span style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Start Dingin'.</span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 19, maxWidth: 580, margin: '0 auto 16px', lineHeight: 1.7 }}>
            Dinger Intel scores every MLB home run prop daily using 6 AI dimensions — hot streaks, matchups, park factors, weather, pitch arsenal, and pitcher weak spots.
          </p>
          <p style={{ color: '#475569', fontSize: 14, marginBottom: 44, fontStyle: 'italic' }}>
            Grades updated daily · Live odds integration · Parlay builder included
          </p>

          {/* Waitlist CTA */}
          <div id="waitlist" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 500, margin: '0 auto 48px' }}>
            {joined ? (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: '16px 32px', color: '#22c55e', fontWeight: 700, fontSize: 15 }}>
                You're on the list! We'll notify you at launch.
              </div>
            ) : (
              <>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && joinWaitlist()}
                  placeholder="your@email.com"
                  style={{ flex: 1, minWidth: 240, padding: '14px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, fontSize: 15, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui' }} />
                <button onClick={joinWaitlist}
                  style={{ padding: '14px 28px', background: 'linear-gradient(135deg,#991b1b,#ef4444)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', whiteSpace: 'nowrap' }}
                  className="cta-glow">
                  Join Waitlist — Free
                </button>
              </>
            )}
          </div>

          {/* Live stats */}
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { value: '2,400+', label: 'HR Props Scored' },
              { value: '6', label: 'AI Dimensions' },
              { value: 'Daily', label: 'Pick Updates' },
              { value: 'Free', label: 'At Launch' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 22px', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#ef4444' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#475569', letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE PICKS */}
      <section id="picks" style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: '#ef4444', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Today's Picks Preview</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, letterSpacing: -1, marginBottom: 10 }}>
            What the AI Is Seeing <span style={{ color: '#ef4444' }}>Right Now</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 15 }}>Sample picks — live data at launch. Grades, scores, and odds update daily.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SAMPLE_PICKS.map((p, i) => (
            <div key={i} className="pick-card" style={{ background: 'rgba(15,20,35,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 24px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 20, alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: p.grade === 'S' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)', border: `1px solid ${p.grade === 'S' ? 'rgba(34,197,94,0.4)' : 'rgba(59,130,246,0.4)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: p.grade === 'S' ? '#22c55e' : '#3b82f6' }}>{p.grade}</div>
                <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>GRADE</div>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f6ff', marginBottom: 4 }}>
                  {p.name} <span style={{ fontSize: 12, color: '#475569', fontWeight: 400 }}>{p.team} · {p.pos} · vs {p.pitcher} ({p.hand === 'R' ? 'RHP' : 'LHP'})</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
                  {[['Hot', p.hot_streak],['Matchup', p.matchup],['Park', p.park],['Weather', p.weather],['Pitch', p.pitch_edge],['Weak', p.weak_spot]].map(([label, val]) => (
                    <div key={label as string}>
                      <div style={{ fontSize: 9, color: '#334155', marginBottom: 4, letterSpacing: 0.5 }}>{label}</div>
                      <BarMini val={val as number} color="#ef4444" />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#f0f6ff' }}>{p.score}</div>
                <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>{p.odds} HR</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: 'rgba(15,20,35,0.5)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: '#ef4444', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>The Engine</div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, letterSpacing: -1, marginBottom: 10 }}>
              Six Dimensions. <span style={{ color: '#ef4444' }}>One Score.</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, maxWidth: 540, margin: '0 auto' }}>Every pick is scored across six AI dimensions. No black box — you see exactly why we like it.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="feat-card" style={{ background: 'rgba(10,14,26,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 26 }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f0f6ff', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRADE SYSTEM */}
      <section id="grades" style={{ maxWidth: 900, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: '#ef4444', letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Grading System</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, letterSpacing: -1, marginBottom: 10 }}>
            S, A, B, C — <span style={{ color: '#ef4444' }}>Know Your Edge</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
          {GRADES.map((g, i) => (
            <div key={i} style={{ background: g.bg, border: `1px solid ${g.color}30`, borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: g.color, marginBottom: 6 }}>{g.grade}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f0f6ff', marginBottom: 4 }}>{g.label}</div>
              <div style={{ fontSize: 12, color: g.color, fontWeight: 600, marginBottom: 12 }}>Score {g.score}</div>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.1),rgba(249,115,22,0.06))', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 24, padding: '56px 40px' }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>⚾</div>
          <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 900, marginBottom: 14, letterSpacing: -1 }}>
            Launch is Coming.<br /><span style={{ color: '#ef4444' }}>Get Early Access.</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, marginBottom: 32, lineHeight: 1.7, maxWidth: 460, margin: '0 auto 32px' }}>
            Free at launch for early members. Daily HR picks, parlay builder, full grading system. Join the waitlist now.
          </p>
          {joined ? (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: '16px 32px', color: '#22c55e', fontWeight: 700, fontSize: 15, display: 'inline-block' }}>
              You're on the list! We'll notify you at launch.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 480, margin: '0 auto' }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && joinWaitlist()}
                placeholder="your@email.com"
                style={{ flex: 1, minWidth: 220, padding: '14px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, fontSize: 15, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui' }} />
              <button onClick={joinWaitlist}
                style={{ padding: '14px 28px', background: 'linear-gradient(135deg,#991b1b,#ef4444)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui' }}>
                Get Early Access
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#f0f6ff', marginBottom: 2 }}>Dinger Intel</div>
          <div style={{ fontSize: 11, color: '#334155' }}>A Made Technologies Inc product · Oklahoma City, OK</div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[['Made Technologies','/'],[  'BoxFlow OS','/boxflow-os'],['Support','/support'],['Privacy','/privacy']].map(([l,h]) => (
            <Link key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#1e293b', textAlign: 'right' }}>
          For entertainment purposes only.<br />Not financial or betting advice.
        </div>
      </footer>
    </div>
  )
}