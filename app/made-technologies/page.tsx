'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://irifwmikcugfxpfhyfrm.supabase.co',
  'sb_publishable_kpguCeakweBu2T5JIYxdjw_0WP6mMsj'
)

const PLATFORMS = [
  { name: 'BoxFlow OS', color: '#2563EB', glow: 'rgba(37,99,235,0.5)', href: '/boxflow-os', desc: 'Logistics, fleet, dispatch, orders, production and HR — unified in one AI-powered platform.', letter: 'B', icon: (
    <svg viewBox="0 0 60 60" width="52" height="52">
      <rect x="6" y="18" width="26" height="18" rx="3" stroke="#2563EB" strokeWidth="2" fill="rgba(37,99,235,0.15)"/>
      <path d="M32 22h8l6 8v6H32V22z" stroke="#2563EB" strokeWidth="2" fill="rgba(37,99,235,0.15)" strokeLinejoin="round"/>
      <circle cx="13" cy="38" r="3.5" stroke="#2563EB" strokeWidth="2" fill="#050e22"/>
      <circle cx="37" cy="38" r="3.5" stroke="#2563EB" strokeWidth="2" fill="#050e22"/>
      <text x="30" y="55" textAnchor="middle" fontSize="6" fill="#2563EB" fontFamily="system-ui" fontWeight="700">BoxFlow OS</text>
    </svg>
  )},
  { name: 'MedFlow OS', color: '#14D2C2', glow: 'rgba(20,210,194,0.5)', href: '/medflow-os', desc: 'Healthcare supply chain, cold chain tracking, pharmacy operations and USP compliance — purpose-built.', letter: 'M', icon: (
    <svg viewBox="0 0 60 60" width="52" height="52">
      <polygon points="30,6 50,16 50,40 30,50 10,40 10,16" stroke="#14D2C2" strokeWidth="2" fill="rgba(20,210,194,0.08)"/>
      <rect x="24" y="16" width="12" height="22" rx="2.5" stroke="#14D2C2" strokeWidth="1.8" fill="rgba(20,210,194,0.15)"/>
      <rect x="16" y="22" width="28" height="12" rx="2.5" stroke="#14D2C2" strokeWidth="1.8" fill="rgba(20,210,194,0.15)"/>
      <circle cx="30" cy="28" r="4" fill="#14D2C2"/>
      <text x="30" y="55" textAnchor="middle" fontSize="6" fill="#14D2C2" fontFamily="system-ui" fontWeight="700">MedFlow OS</text>
    </svg>
  )},
  { name: 'PropFlow OS', color: '#a855f7', glow: 'rgba(168,85,247,0.5)', href: '/propflow-os', desc: 'Property management, tenant portals, GPS staff tracking, maintenance dispatch and finance — all in one.', letter: 'P', icon: (
    <svg viewBox="0 0 60 60" width="52" height="52">
      <path d="M30 8L8 22h6v22h12V34h8v10h12V22h6L30 8z" stroke="#a855f7" strokeWidth="2" fill="rgba(168,85,247,0.1)" strokeLinejoin="round"/>
      <rect x="23" y="34" width="14" height="10" rx="1.5" stroke="#a855f7" strokeWidth="1.6" fill="rgba(168,85,247,0.2)"/>
      <text x="30" y="55" textAnchor="middle" fontSize="6" fill="#a855f7" fontFamily="system-ui" fontWeight="700">PropFlow OS</text>
    </svg>
  )},
  { name: 'ClassFlow AI', color: '#f59e0b', glow: 'rgba(245,158,11,0.5)', href: '/classflow-os', desc: 'AI-powered lesson creation, student management, adaptive learning and multi-language support — built for educators.', letter: 'C', icon: (
    <svg viewBox="0 0 60 60" width="52" height="52">
      <circle cx="30" cy="22" r="10" stroke="#f59e0b" strokeWidth="2" fill="rgba(245,158,11,0.1)"/>
      <path d="M14 46c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <circle cx="30" cy="22" r="4" fill="#f59e0b"/>
      <path d="M36 14l3-3M24 14l-3-3M30 12V9" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <text x="30" y="55" textAnchor="middle" fontSize="6" fill="#f59e0b" fontFamily="system-ui" fontWeight="700">ClassFlow AI</text>
    </svg>
  )},
]

const SERVICES = [
  { icon: 'A', color: '#2563EB', title: 'Custom App Development', desc: 'We build custom web and mobile applications from the ground up — designed around your specific workflow, industry, and business model. No templates. No off-the-shelf solutions. Built to fit exactly how you operate.' },
  { icon: 'I', color: '#14D2C2', title: 'AI Automation Services', desc: 'We design and deploy custom AI automation systems that eliminate repetitive tasks, streamline operations, and generate insights in real time. From lead generation to workflow automation — we build AI that works for your business.' },
  { icon: 'E', color: '#a855f7', title: 'Enterprise Platform Suite', desc: 'Our four flagship platforms — BoxFlow OS, MedFlow OS, PropFlow OS, and ClassFlow AI — are purpose-built enterprise operating systems for industries that have been underserved by generic software for too long.' },
  { icon: 'S', color: '#f59e0b', title: 'System Integration', desc: 'Already running tools that work? We integrate them. We connect your existing systems, databases, and third-party APIs into a unified operational layer so your team works from one source of truth.' },
]

const STATS = [
  { value: '4', label: 'Enterprise Platforms', sub: 'Purpose-built' },
  { value: '48hrs', label: 'Average Go-Live', sub: 'From signup to live' },
  { value: '60-80%', label: 'Cost Reduction', sub: 'vs legacy stacks' },
  { value: '100%', label: 'Built in the USA', sub: 'Oklahoma City, OK' },
]

const TEAM = [
  { name: 'Kenneth Covington', role: 'Founder & CEO', bio: 'Kenneth founded Made Technologies with one observation: every industry has software built for it, but no industry has software built for how they actually operate. He set out to change that — one industry at a time.' },
]

function CoinSpinner({ platform, delay, spin }: { platform: typeof PLATFORMS[0], delay: string, spin: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      onClick={() => window.location.href = platform.href}>
      <div style={{ perspective: '400px', width: 90, height: 90 }}>
        <div style={{ width: 90, height: 90, position: 'relative', transformStyle: 'preserve-3d', animation: `${spin} linear infinite`, animationDelay: delay }}>
          <div style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateZ(6px)', background: `radial-gradient(circle at 35% 35%, #0d1a2e, #050e22)`, border: `2px solid ${platform.color}`, boxShadow: `0 0 18px ${platform.glow}` }}>
            {platform.icon}
          </div>
          <div style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotateY(180deg) translateZ(6px)', background: `radial-gradient(circle, #0a1830, #020a18)`, border: `2px solid ${platform.color}55` }}>
            <span style={{ fontSize: 34, fontWeight: 900, fontFamily: 'system-ui', color: `${platform.color}40` }}>{platform.letter}</span>
          </div>
          <div style={{ position: 'absolute', width: 90, height: 12, top: 39, left: 0, borderRadius: 3, transform: 'rotateX(90deg) translateZ(0)', background: `linear-gradient(to bottom, ${platform.color}80, ${platform.color}, ${platform.color}80)` }} />
        </div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: platform.color, letterSpacing: 0.5, fontFamily: 'system-ui', textAlign: 'center' }}>{platform.name}</span>
    </div>
  )
}

export default function MadeTechLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [form, setForm] = useState({ name: '', email: '', company: '', service: 'Custom App Development', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [activeNav, setActiveNav] = useState('')

  function update(f: string, v: string) { setForm(p => ({ ...p, [f]: v })) }

  async function handleSubmit() {
    if (!form.name || !form.email) return
    setSending(true)
    try {
      await supabase.from('contact_leads').insert([{ name: form.name, email: form.email, company: form.company, message: `Service: ${form.service}\n\n${form.message}`, interest: form.service }])
      setSent(true)
    } catch { setSent(true) }
    setSending(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const wrap = canvas.parentElement!
    const resize = () => { canvas.width = wrap.offsetWidth; canvas.height = wrap.offsetHeight }
    resize()
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2, speed: Math.random() * 0.005 + 0.002, phase: Math.random() * Math.PI * 2
    }))
    let raf: number
    function draw(t: number) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)
      stars.forEach(s => {
        const a = 0.1 + 0.45 * Math.abs(Math.sin(t * s.speed + s.phase))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  const inp = { width: '100%', background: 'rgba(7,15,36,0.8)', border: '1px solid rgba(20,210,194,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#f0f6ff', fontFamily: 'system-ui', outline: 'none', boxSizing: 'border-box' as const }
  const lbl = { display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 7 }

  return (
    <div style={{ minHeight: '100vh', background: '#020818', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>
      <style>{`
        @keyframes coinFlip1{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
        @keyframes coinFlip2{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
        @keyframes coinFlip3{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
        @keyframes coinFlip4{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
        @keyframes spinM{from{transform:rotateY(0deg) rotateX(10deg)}to{transform:rotateY(360deg) rotateX(10deg)}}
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes pOut{0%{width:220px;height:220px;opacity:0.5}100%{width:420px;height:420px;opacity:0}}
        @keyframes dspin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .nav-link{color:#64748b;text-decoration:none;font-size:13px;transition:color 0.15s;cursor:pointer}
        .nav-link:hover{color:#f0f6ff}
        .coin-hover{transition:transform 0.2s}
        .coin-hover:hover{transform:scale(1.08)}
        .service-card{transition:transform 0.2s,border-color 0.2s}
        .service-card:hover{transform:translateY(-4px)}
        .cta-btn{transition:all 0.2s;cursor:pointer}
        .cta-btn:hover{transform:translateY(-2px)}
      `}</style>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid rgba(20,210,194,0.08)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.95)', backdropFilter: 'blur(12px)', zIndex: 100, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#fff' }}>M</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: -0.3 }}>Made Technologies Inc</div>
            <div style={{ fontSize: 8, color: '#14D2C2', letterSpacing: 2, textTransform: 'uppercase' }}>Make Anything Do Everything</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
          <a href="#platforms" className="nav-link">Platforms</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="/" style={{ padding: '9px 22px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Enter Platform</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center', position: 'relative', animation: 'fadeUp 0.8s ease both' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />

        {/* Pulse rings */}
        {[0,1,2].map(i => (
          <div key={i} style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '1px solid rgba(20,210,194,0.15)', animation: `pOut 3s ease-out infinite`, animationDelay: `${i}s`, pointerEvents: 'none', zIndex: 0 }} />
        ))}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(20,210,194,0.08)', border: '1px solid rgba(20,210,194,0.2)', borderRadius: 100, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#14D2C2', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14D2C2', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Made Technologies Inc — Oklahoma City, OK
          </div>

          {/* 3D Spinning M */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div style={{ perspective: '600px', width: 160, height: 160, position: 'relative' }}>
              <div style={{ width: 160, height: 160, position: 'relative', transformStyle: 'preserve-3d', animation: 'spinM 8s linear infinite' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateZ(14px)', background: 'radial-gradient(circle at 35% 35%,#1a3a6e,#060f28)', border: '2px solid rgba(20,210,194,0.7)', boxShadow: '0 0 50px rgba(20,210,194,0.2)', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '1px dashed rgba(20,210,194,0.3)', animation: 'dspin 12s linear infinite reverse' }}>
                    {[{t:'-4px',l:'50%',tr:'translateX(-50%)',bg:'#14D2C2'},{b:'-4px',l:'50%',tr:'translateX(-50%)',bg:'#2563EB'},{l:'-4px',tp:'50%',tr:'translateY(-50%)',bg:'#a855f7'},{r:'-4px',tp:'50%',tr:'translateY(-50%)',bg:'#f59e0b'}].map((d,i) => (
                      <div key={i} style={{ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: (d as any).bg, boxShadow: `0 0 8px ${(d as any).bg}`, top: (d as any).t || (d as any).tp, left: (d as any).l, right: (d as any).r, bottom: (d as any).b, transform: (d as any).tr }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 72, fontWeight: 900, fontFamily: 'system-ui', background: 'linear-gradient(135deg,#14D2C2 0%,#60e8dc 40%,#2563EB 80%,#14D2C2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundSize: '200% 200%', filter: 'drop-shadow(0 0 8px rgba(20,210,194,0.6))', animation: 'shimmer 3s ease-in-out infinite', letterSpacing: -3, position: 'relative', zIndex: 2 }}>M</span>
                </div>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotateY(180deg) translateZ(14px)', background: 'radial-gradient(circle,#0e2248,#030a1a)', border: '2px solid rgba(37,99,235,0.4)' }}>
                  <span style={{ fontSize: 60, fontWeight: 900, fontFamily: 'system-ui', color: 'rgba(37,99,235,0.3)' }}>M</span>
                </div>
                <div style={{ position: 'absolute', width: 28, height: 160, left: 166, borderRadius: 0, transform: 'rotateY(90deg) translateZ(0)', background: 'linear-gradient(to bottom,#0A6E68,#1d4ed8)' }} />
                <div style={{ position: 'absolute', width: 28, height: 160, left: -14, borderRadius: 0, transform: 'rotateY(-90deg) translateZ(0)', background: 'linear-gradient(to bottom,#0A6E68,#1d4ed8)', opacity: 0.7 }} />
                <div style={{ position: 'absolute', width: 160, height: 28, top: -14, transform: 'rotateX(90deg) translateZ(0)', background: 'linear-gradient(to right,#14D2C2,#2563EB)', opacity: 0.8 }} />
                <div style={{ position: 'absolute', width: 160, height: 28, top: 146, transform: 'rotateX(-90deg) translateZ(0)', background: 'linear-gradient(to right,#0A4444,#1a3070)', opacity: 0.6 }} />
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(36px,6vw,68px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 20px', letterSpacing: -2 }}>
            Make Anything.<br />
            <span style={{ color: '#14D2C2' }}>Do Everything.</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: 18, maxWidth: 600, margin: '0 auto 20px', lineHeight: 1.7 }}>
            Made Technologies Inc builds purpose-built enterprise software and custom AI solutions for industries that can't afford to run on generic tools. Oklahoma City built. Nation-wide reach.
          </p>
          <p style={{ color: '#475569', fontSize: 14, marginBottom: 40, fontStyle: 'italic' }}>M.A.D.E. — Make Anything Do Everything</p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#platforms" className="cta-btn" style={{ padding: '15px 36px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', borderRadius: 14, color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 800 }}>Explore Platforms</a>
            <a href="#contact" className="cta-btn" style={{ padding: '15px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(20,210,194,0.25)', borderRadius: 14, color: '#f0f6ff', textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>Get in Touch</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.1)', borderRadius: 16, padding: '22px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#14D2C2', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#f0f6ff', fontWeight: 700, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORMS */}
      <section id="platforms" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: '#14D2C2', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Our Platform Suite</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>Four Industries. <span style={{ color: '#14D2C2' }}>One Company.</span></h2>
          <p style={{ color: '#64748b', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>Click any platform to learn more. Each one is a purpose-built operating system — not adapted from something else.</p>
        </div>

        {/* Spinning Coins */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 36, flexWrap: 'wrap', marginBottom: 56 }}>
          {PLATFORMS.map((p, i) => (
            <div key={i} className="coin-hover">
              <CoinSpinner platform={p} delay={`${i * 0.4}s`} spin={`coinFlip${i+1}`} />
            </div>
          ))}
        </div>

        {/* Platform Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {PLATFORMS.map((p, i) => (
            <Link key={i} href={p.href} style={{ textDecoration: 'none' }}>
              <div className="service-card" style={{ background: 'rgba(12,26,56,0.8)', border: `1px solid ${p.color}20`, borderRadius: 18, padding: 24, height: '100%' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}15`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: p.color, marginBottom: 14 }}>{p.letter}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: p.color, marginBottom: 8 }}>{p.name}</div>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                <div style={{ marginTop: 16, fontSize: 12, color: p.color, fontWeight: 700 }}>Learn More →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ background: 'rgba(7,15,36,0.6)', borderTop: '1px solid rgba(20,210,194,0.06)', borderBottom: '1px solid rgba(20,210,194,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: '#14D2C2', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>What We Build</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>Products. Custom Apps. <span style={{ color: '#14D2C2' }}>AI Systems.</span></h2>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 560, margin: '0 auto' }}>Beyond our four platforms, we build custom software and AI automation systems for clients who need something built specifically for them.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 20 }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="service-card" style={{ background: 'rgba(12,26,56,0.8)', border: `1px solid ${s.color}18`, borderRadius: 20, padding: 28 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${s.color}12`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: s.color, marginBottom: 16 }}>{s.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f0f6ff', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: '#14D2C2', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Our Story</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>Built from the <span style={{ color: '#14D2C2' }}>Ground Up.</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: 48, alignItems: 'start', marginBottom: 56 }}>
          <div>
            {[
              { title: 'Why We Started', body: 'Made Technologies was founded by Kenneth Covington with one observation: every industry has software built for it, but no industry has software built for how they actually operate. Healthcare logistics runs on generic shipping tools. Manufacturing plants run on ERP systems built for retailers. Property managers use spreadsheets. We set out to change that.' },
              { title: 'What M.A.D.E. Means', body: 'M.A.D.E. stands for Make Anything Do Everything. It is not just a name — it is the mission. We build software that does exactly what your operation needs it to do, without the bloat, complexity, or price tag of enterprise software that was designed for someone else.' },
              { title: 'How We Build', body: 'We build from the ground up. Every platform and every custom application starts from a blank canvas — designed around the actual workflows, roles, and requirements of the people using it. We ship fast, we iterate based on feedback, and we stay in production with our clients long after go-live.' },
              { title: 'Where We Are Headed', body: 'We are building the technology infrastructure for mid-market operations across America. Four platforms today. More industries tomorrow. And a custom development practice that builds one-of-a-kind software for clients who need something no one has built yet.' },
            ].map((s, i) => (
              <div key={i} style={{ borderLeft: '2px solid rgba(20,210,194,0.2)', paddingLeft: 22, marginBottom: 32 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#f0f6ff', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div>
            {TEAM.map((t, i) => (
              <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 20, padding: 32, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#f0f6ff' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#14D2C2', letterSpacing: 1 }}>{t.role}</div>
                  </div>
                </div>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{t.bio}</p>
              </div>
            ))}

            <div style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.12)', borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' }}>Company Facts</div>
              {[
                ['Founded', '2025'],
                ['Headquartered', 'Oklahoma City, Oklahoma'],
                ['Platforms', 'BoxFlow OS, MedFlow OS, PropFlow OS, ClassFlow AI'],
                ['Services', 'Custom Apps, AI Automation, System Integration'],
                ['Target Market', 'Mid-market operations (10-500 employees)'],
                ['Built in', 'USA'],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>{l}</span>
                  <span style={{ fontSize: 13, color: '#f0f6ff', fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: 'rgba(7,15,36,0.6)', borderTop: '1px solid rgba(20,210,194,0.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: '#14D2C2', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>Get in Touch</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>Let's Build <span style={{ color: '#14D2C2' }}>Something Together.</span></h2>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>Whether you need a platform demo, a custom app, or an AI automation system — reach out and we will respond personally within 24 hours.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: 48, alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
                {[
                  { icon: 'E', label: 'Email', value: 'kenneth.covington@boxflowos.com', href: 'mailto:kenneth.covington@boxflowos.com' },
                  { icon: 'L', label: 'Location', value: 'Oklahoma City, Oklahoma, USA', href: '#' },
                  { icon: 'W', label: 'Website', value: 'boxflowos.com', href: 'https://boxflowos.com' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(20,210,194,0.1)', border: '1px solid rgba(20,210,194,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#14D2C2', flexShrink: 0 }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' }}>{c.label}</div>
                      <a href={c.href} style={{ fontSize: 14, color: '#f0f6ff', textDecoration: 'none', fontWeight: 600 }}>{c.value}</a>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.12)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>Our Platforms</div>
                {PLATFORMS.map((p, i) => (
                  <Link key={i} href={p.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: p.color, fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 22, padding: 36 }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(20,210,194,0.1)', border: '1px solid rgba(20,210,194,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#14D2C2', margin: '0 auto 20px' }}>+</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Message Received!</h3>
                  <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>We will reach out within 24 hours personally — not through a ticket queue.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Send Us a Message</h3>
                  <p style={{ color: '#475569', fontSize: 13, marginBottom: 24 }}>We respond within 24 hours — personally.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div><label style={lbl}>Your Name</label><input style={inp} placeholder="Kenneth Covington" value={form.name} onChange={e => update('name', e.target.value)} /></div>
                    <div><label style={lbl}>Email</label><input style={inp} type="email" placeholder="you@company.com" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                    <div><label style={lbl}>Company</label><input style={inp} placeholder="Your Company" value={form.company} onChange={e => update('company', e.target.value)} /></div>
                    <div>
                      <label style={lbl}>I need help with</label>
                      <select style={{ ...inp, cursor: 'pointer' }} value={form.service} onChange={e => update('service', e.target.value)}>
                        <option>Custom App Development</option>
                        <option>AI Automation Services</option>
                        <option>BoxFlow OS Demo</option>
                        <option>MedFlow OS Demo</option>
                        <option>PropFlow OS Demo</option>
                        <option>ClassFlow AI Demo</option>
                        <option>System Integration</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                    <div><label style={lbl}>Message</label><textarea style={{ ...inp, minHeight: 100, resize: 'vertical' as const }} placeholder="Tell us about your project or operation..." value={form.message} onChange={e => update('message', e.target.value)} /></div>
                  </div>
                  <button onClick={handleSubmit} disabled={sending || !form.name || !form.email}
                    style={{ width: '100%', marginTop: 20, padding: '15px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', opacity: !form.name || !form.email ? 0.6 : 1 }}>
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                  <p style={{ color: '#334155', fontSize: 11, textAlign: 'center', marginTop: 12 }}>We respond within 24 hours. No spam, ever.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#f0f6ff', marginBottom: 3 }}>Made Technologies Inc</div>
            <div style={{ fontSize: 11, color: '#334155' }}>Make Anything Do Everything — Oklahoma City, OK</div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[['Privacy','/privacy'],['Terms','/terms'],['Refund','/refund'],['Careers','/careers'],['Investors','/investors'],['Press','/press']].map(([l,h]) => (
              <Link key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1000, margin: '12px auto 0', fontSize: 11, color: '#1e293b', textAlign: 'center' }}>
          © 2026 Made Technologies Inc. All rights reserved. BoxFlow OS · MedFlow OS · PropFlow OS · ClassFlow AI
        </div>
      </footer>
    </div>
  )
}