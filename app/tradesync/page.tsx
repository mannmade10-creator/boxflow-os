'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const TRADES = [
  { icon: '✂️', name: 'Barbers',         desc: 'Fades, cuts, lineups, beard trims' },
  { icon: '💅', name: 'Nail Techs',      desc: 'Full sets, fills, pedicures, nail art' },
  { icon: '🪮', name: 'Braiders',        desc: 'Box braids, knotless, loc maintenance' },
  { icon: '💆', name: 'Massage Therapy', desc: '60/90 min, deep tissue, sports massage' },
  { icon: '💈', name: 'Salons',          desc: 'Color, cuts, blowouts, treatments' },
  { icon: '🔧', name: 'Plumbers',        desc: 'Drain, install, repair, emergency calls' },
  { icon: '⚡', name: 'Electricians',    desc: 'Panel, outlets, inspections, installs' },
  { icon: '❄️', name: 'HVAC Techs',      desc: 'AC service, heat, install, emergency' },
  { icon: '🧹', name: 'Cleaning Pros',   desc: 'Residential, commercial, deep clean' },
  { icon: '🏗️', name: 'Contractors',     desc: 'Remodels, repairs, builds, estimates' },
  { icon: '🌿', name: 'Lawn & Landscape',desc: 'Mow, trim, design, maintenance' },
  { icon: '🐾', name: 'Pet Groomers',    desc: 'Bath, cut, nails, full groom packages' },
]

const FEATURES = [
  {
    icon: '📍',
    title: 'Live GPS Booking Map',
    desc: 'Clients open the app and see every available pro near them in real time. Live availability pins on a map. Filter by trade, distance, and rating. Pros toggle on when ready — off when with a client.',
    color: '#c9a84c',
  },
  {
    icon: '📅',
    title: 'Smart Booking Engine',
    desc: 'Real-time availability calendar, instant booking, service menu with custom pricing, cancellation logic, and automatic SMS and push reminders. Your schedule runs itself.',
    color: '#c9a84c',
  },
  {
    icon: '💳',
    title: 'Universal Payments',
    desc: 'Cash App, Venmo, PayPal, credit and debit cards — all in one place. Cash deposits at Walmart, Walgreens, CVS, 7-Eleven, Dollar General, and Family Dollar via PayNearMe. No client ever has an excuse.',
    color: '#c9a84c',
  },
  {
    icon: '🏠',
    title: 'Booth Rent Automation',
    desc: 'Shop owners collect weekly rent automatically. Funds deposit directly to your business bank account. Both parties get receipts. Zero chasing. Zero awkward conversations.',
    color: '#c9a84c',
  },
  {
    icon: '🛍️',
    title: 'Built-In Merch Store',
    desc: 'Sell your branded merchandise directly through the app. Print-on-demand via Printful — no inventory, no upfront cost. A client books a cut and orders your hoodie in the same checkout.',
    color: '#c9a84c',
  },
  {
    icon: '🤖',
    title: 'AI Business Engine',
    desc: 'No-show prediction. Smart scheduling. Client retention nudges. Revenue forecasting. Peak hour analysis. AI chat booking assistant. Your business gets smarter every day.',
    color: '#c9a84c',
  },
]

const PLANS = [
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    desc: 'Solo professionals',
    color: '#c9a84c',
    features: ['Unlimited bookings', 'All payment methods', 'GPS availability pin', 'Client history & analytics', 'SMS + push reminders', 'AI scheduling assistant'],
  },
  {
    name: 'Shop',
    price: '$79',
    period: '/mo',
    desc: 'Multi-chair shops & studios',
    color: '#ffffff',
    popular: true,
    features: ['Everything in Pro', 'Multi-chair management', 'Booth rent automation', 'Team scheduling', 'Built-in merch store', 'Advanced AI analytics'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Franchise & multi-location',
    color: '#63d2b2',
    features: ['Everything in Shop', 'Unlimited locations', 'White label option', 'API access', 'Dedicated support', 'Custom integrations'],
  },
]

export default function TradeSyncLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [email, setEmail] = useState('')
  const [trade, setTrade] = useState('')
  const [joined, setJoined] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = 560 }
    resize()
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3, speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2, gold: Math.random() > 0.6
    }))
    let raf: number
    function draw(t: number) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)
      particles.forEach(p => {
        const a = 0.06 + 0.3 * Math.abs(Math.sin(t * p.speed + p.phase))
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.gold ? `rgba(201,168,76,${a})` : `rgba(255,255,255,${a})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setActiveFeature(f => (f + 1) % FEATURES.length), 4000)
    return () => clearInterval(id)
  }, [])

  async function joinWaitlist() {
    if (!email) return
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/contact_leads`, {
        method: 'POST',
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ name: `TradeSync Waitlist${trade ? ' — ' + trade : ''}`, email, message: `Trade: ${trade || 'Not specified'}`, interest: 'TradeSync' })
      })
      setJoined(true)
    } catch { setJoined(true) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', fontFamily: 'system-ui,sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes goldGlow{0%,100%{box-shadow:0 0 30px rgba(201,168,76,0.3)}50%{box-shadow:0 0 70px rgba(201,168,76,0.7)}}
        @keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .trade-card{transition:transform 0.2s,border-color 0.2s,background 0.2s;cursor:pointer}
        .trade-card:hover{transform:translateY(-4px);border-color:rgba(201,168,76,0.6)!important;background:rgba(201,168,76,0.06)!important}
        .feat-btn{transition:all 0.2s;cursor:pointer}
        .feat-btn:hover{opacity:0.8}
        .plan-card{transition:transform 0.2s}
        .plan-card:hover{transform:translateY(-4px)}
        nav a{text-decoration:none;color:#64748b;font-size:13px;transition:color 0.15s}
        nav a:hover{color:#c9a84c}
        .gold-text{background:linear-gradient(135deg,#c9a84c 0%,#f0d080 50%,#c9a84c 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:shimmer 4s ease-in-out infinite}
        .gold-btn{animation:goldGlow 3s ease-in-out infinite;transition:transform 0.2s}
        .gold-btn:hover{transform:translateY(-2px)}
      `}</style>

      {/* NAV */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 48px', borderBottom:'1px solid rgba(201,168,76,0.12)', position:'sticky', top:0, background:'rgba(10,10,10,0.97)', backdropFilter:'blur(12px)', zIndex:100, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#8b6914,#c9a84c)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, color:'#0a0a0a', fontFamily:'Georgia,serif' }}>TS</div>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:'#fff', letterSpacing:-0.5, fontFamily:'Georgia,serif' }}>TradeSync</div>
            <div style={{ fontSize:8, color:'#c9a84c', letterSpacing:2, textTransform:'uppercase' }}>by M.A.D.E Technologies</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:24, alignItems:'center', flexWrap:'wrap' }}>
          <a href="#trades">Trades</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#waitlist" style={{ padding:'9px 22px', background:'linear-gradient(135deg,#8b6914,#c9a84c)', borderRadius:10, color:'#0a0a0a', fontSize:13, fontWeight:800, textDecoration:'none' }} className="gold-btn">
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', padding:'90px 24px 70px', textAlign:'center', overflow:'hidden' }}>
        <canvas ref={canvasRef} style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 65%)', pointerEvents:'none', zIndex:0 }} />

        <div style={{ position:'relative', zIndex:1, maxWidth:820, margin:'0 auto', animation:'fadeUp 0.8s ease both' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:100, padding:'6px 20px', fontSize:11, fontWeight:700, color:'#c9a84c', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:32 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#c9a84c', display:'inline-block', animation:'pulse 2s infinite' }} />
            Book Any Trade · Pay Any Way · Anywhere
          </div>

          {/* Logo mark */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
            <div style={{ width:100, height:100, borderRadius:24, background:'linear-gradient(135deg,#1a1200,#0a0a0a)', border:'2px solid rgba(201,168,76,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48, fontWeight:900, color:'#c9a84c', fontFamily:'Georgia,serif', animation:'goldGlow 3s ease-in-out infinite, float 4s ease-in-out infinite' }}>
              TS
            </div>
          </div>

          <h1 style={{ fontSize:'clamp(40px,7vw,84px)', fontWeight:900, lineHeight:1.0, margin:'0 0 20px', letterSpacing:-3, fontFamily:'Georgia,serif' }}>
            The Platform<br />
            <span className="gold-text">Every Trade Pro</span><br />
            Has Been Waiting For.
          </h1>

          <p style={{ color:'#94a3b8', fontSize:19, maxWidth:600, margin:'0 auto 16px', lineHeight:1.7 }}>
            TradeSync is the all-in-one booking, payment, and business platform built for barbers, nail techs, plumbers, electricians, massage therapists — and every trade service professional in between.
          </p>
          <p style={{ color:'#475569', fontSize:14, marginBottom:48, fontStyle:'italic' }}>
            One app. Every trade. Every payment method. Live GPS map. Built-in merch store. AI business engine.
          </p>

          {/* Waitlist form */}
          <div id="waitlist" style={{ maxWidth:560, margin:'0 auto 52px' }}>
            {joined ? (
              <div style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.4)', borderRadius:16, padding:'20px 32px', color:'#c9a84c', fontWeight:700, fontSize:16 }}>
                You're on the list! We'll reach out when TradeSync launches in OKC.
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && joinWaitlist()}
                    placeholder="your@email.com"
                    style={{ flex:1, minWidth:220, padding:'14px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:12, fontSize:15, color:'#fff', outline:'none', fontFamily:'system-ui' }} />
                  <select value={trade} onChange={e => setTrade(e.target.value)}
                    style={{ padding:'14px 16px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:12, fontSize:14, color: trade ? '#fff' : '#64748b', outline:'none', fontFamily:'system-ui', cursor:'pointer' }}>
                    <option value="">My trade...</option>
                    {TRADES.map(t => <option key={t.name} value={t.name}>{t.icon} {t.name}</option>)}
                    <option value="Other">Other trade</option>
                  </select>
                </div>
                <button onClick={joinWaitlist} className="gold-btn"
                  style={{ width:'100%', padding:'16px', background:'linear-gradient(135deg,#8b6914,#c9a84c)', border:'none', borderRadius:12, color:'#0a0a0a', fontWeight:900, fontSize:16, cursor:'pointer', fontFamily:'Georgia,serif', letterSpacing:0.5 }}>
                  Join the Waitlist — Free Early Access
                </button>
                <p style={{ color:'#334155', fontSize:12, textAlign:'center', margin:0 }}>
                  Launching in Oklahoma City first · No spam ever · Free at launch for early members
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap' }}>
            {[
              { value: '12+', label: 'Trade Categories' },
              { value: '6', label: 'Payment Methods' },
              { value: 'Live GPS', label: 'Availability Map' },
              { value: 'Free', label: 'At Launch' },
            ].map((s, i) => (
              <div key={i} style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12, padding:'12px 22px', textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:900, color:'#c9a84c', fontFamily:'Georgia,serif' }}>{s.value}</div>
                <div style={{ fontSize:11, color:'#475569', letterSpacing:0.5, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section id="trades" style={{ maxWidth:1200, margin:'0 auto', padding:'72px 24px' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <div style={{ fontSize:11, color:'#c9a84c', letterSpacing:3, textTransform:'uppercase', fontWeight:700, marginBottom:14 }}>Every Trade. One Platform.</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,50px)', fontWeight:900, letterSpacing:-1.5, marginBottom:12, fontFamily:'Georgia,serif' }}>
            Built for <span className="gold-text">Your Hands.</span><br />Your Business.
          </h2>
          <p style={{ color:'#64748b', fontSize:16, maxWidth:560, margin:'0 auto' }}>
            Whether you work in a shop, out of your home, or on the road — TradeSync gives you the same professional tools big businesses have. For every trade.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
          {TRADES.map((t, i) => (
            <div key={i} className="trade-card" style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'20px 18px' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{t.icon}</div>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff', marginBottom:5, fontFamily:'Georgia,serif' }}>{t.name}</div>
              <div style={{ fontSize:12, color:'#475569', lineHeight:1.5 }}>{t.desc}</div>
            </div>
          ))}
          <div className="trade-card" style={{ background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:16, padding:'20px 18px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
            <div style={{ fontSize:32, marginBottom:12 }}>➕</div>
            <div style={{ fontSize:15, fontWeight:800, color:'#c9a84c', marginBottom:5, fontFamily:'Georgia,serif' }}>Your Trade</div>
            <div style={{ fontSize:12, color:'#475569', lineHeight:1.5 }}>Any service business that needs booking + payments</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background:'rgba(201,168,76,0.03)', borderTop:'1px solid rgba(201,168,76,0.08)', borderBottom:'1px solid rgba(201,168,76,0.08)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'80px 24px' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ fontSize:11, color:'#c9a84c', letterSpacing:3, textTransform:'uppercase', fontWeight:700, marginBottom:14 }}>Platform Features</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,50px)', fontWeight:900, letterSpacing:-1.5, marginBottom:12, fontFamily:'Georgia,serif' }}>
              Everything You Need.<br /><span className="gold-text">Nothing You Don't.</span>
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:18 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: activeFeature === i ? 'rgba(201,168,76,0.08)' : 'rgba(10,10,10,0.8)', border:`1px solid ${activeFeature === i ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius:20, padding:28, cursor:'pointer', transition:'all 0.25s' }}
                onClick={() => setActiveFeature(i)}>
                <div style={{ fontSize:36, marginBottom:14 }}>{f.icon}</div>
                <h3 style={{ fontSize:18, fontWeight:800, color: activeFeature === i ? '#c9a84c' : '#fff', marginBottom:10, fontFamily:'Georgia,serif' }}>{f.title}</h3>
                <p style={{ color:'#64748b', fontSize:14, lineHeight:1.8, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth:900, margin:'0 auto', padding:'80px 24px' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontSize:11, color:'#c9a84c', letterSpacing:3, textTransform:'uppercase', fontWeight:700, marginBottom:14 }}>How It Works</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,50px)', fontWeight:900, letterSpacing:-1.5, fontFamily:'Georgia,serif' }}>
            Up and Running <span className="gold-text">in Minutes.</span>
          </h2>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[
            { step:'01', title:'Sign up as a Pro', desc:'Create your account, pick your trade category, set your services and prices. Takes 5 minutes.' },
            { step:'02', title:'Connect your payments', desc:'Link Cash App, Venmo, PayPal, and a card processor in one place. Set up cash load capability for clients who pay in cash.' },
            { step:'03', title:'Go live on the map', desc:'Toggle your availability pin on. Clients nearby see you immediately. New bookings start coming in.' },
            { step:'04', title:'Manage everything in one place', desc:'Your schedule, earnings, client history, merch orders, booth rent — all in your dashboard.' },
          ].map((s, i) => (
            <div key={i} style={{ display:'flex', gap:24, padding:'28px 0', borderBottom: i < 3 ? '1px solid rgba(201,168,76,0.08)' : 'none', alignItems:'flex-start' }}>
              <div style={{ width:56, height:56, borderRadius:14, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:'#c9a84c', flexShrink:0, fontFamily:'Georgia,serif' }}>{s.step}</div>
              <div>
                <h3 style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:8, fontFamily:'Georgia,serif' }}>{s.title}</h3>
                <p style={{ color:'#64748b', fontSize:14, lineHeight:1.7, margin:0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth:1000, margin:'0 auto', padding:'0 24px 80px' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <div style={{ fontSize:11, color:'#c9a84c', letterSpacing:3, textTransform:'uppercase', fontWeight:700, marginBottom:14 }}>Pricing</div>
          <h2 style={{ fontSize:'clamp(28px,4vw,50px)', fontWeight:900, letterSpacing:-1.5, marginBottom:12, fontFamily:'Georgia,serif' }}>
            Simple. <span className="gold-text">Transparent.</span> Fair.
          </h2>
          <p style={{ color:'#64748b', fontSize:15, marginBottom:8 }}>Plus 2.9% per booking transaction · $3.95 per cash load · 10% on merch sales</p>
          <p style={{ color:'#475569', fontSize:13, fontStyle:'italic' }}>Free at launch for waitlist members</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:18 }}>
          {PLANS.map((p, i) => (
            <div key={i} className="plan-card" style={{ background: p.popular ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)', border:`2px solid ${p.popular ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.08)'}`, borderRadius:22, padding:30, position:'relative', display:'flex', flexDirection:'column' }}>
              {p.popular && <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(135deg,#8b6914,#c9a84c)', color:'#0a0a0a', fontSize:10, fontWeight:900, padding:'4px 18px', borderRadius:100, letterSpacing:'0.1em', textTransform:'uppercase', whiteSpace:'nowrap', fontFamily:'Georgia,serif' }}>Most Popular</div>}
              <h3 style={{ fontSize:22, fontWeight:900, color: p.popular ? '#c9a84c' : '#fff', marginBottom:4, fontFamily:'Georgia,serif' }}>{p.name}</h3>
              <p style={{ color:'#475569', fontSize:13, marginBottom:16 }}>{p.desc}</p>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:24 }}>
                <span style={{ fontSize:p.price === 'Custom' ? 28 : 48, fontWeight:900, color:'#fff', lineHeight:1, fontFamily:'Georgia,serif' }}>{p.price}</span>
                {p.period && <span style={{ color:'#475569', fontSize:14, marginBottom:8 }}>{p.period}</span>}
              </div>
              <div style={{ flex:1, marginBottom:24 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                    <span style={{ color:'#c9a84c', flexShrink:0, fontWeight:700, marginTop:1 }}>+</span>
                    <span style={{ color:'#94a3b8', fontSize:13 }}>{f}</span>
                  </div>
                ))}
              </div>
              <a href="#waitlist" style={{ display:'block', textAlign:'center', padding:'13px', background: p.popular ? 'linear-gradient(135deg,#8b6914,#c9a84c)' : 'rgba(201,168,76,0.1)', border: p.popular ? 'none' : '1px solid rgba(201,168,76,0.3)', borderRadius:12, color: p.popular ? '#0a0a0a' : '#c9a84c', fontWeight:800, fontSize:14, textDecoration:'none', fontFamily:'Georgia,serif' }}>
                Join Waitlist
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ maxWidth:760, margin:'0 auto', padding:'0 24px 100px', textAlign:'center' }}>
        <div style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))', border:'1px solid rgba(201,168,76,0.2)', borderRadius:24, padding:'60px 40px' }}>
          <div style={{ fontSize:52, marginBottom:20 }}>✂️</div>
          <h2 style={{ fontSize:'clamp(26px,4vw,46px)', fontWeight:900, marginBottom:14, letterSpacing:-1.5, fontFamily:'Georgia,serif' }}>
            Your Trade.<br /><span className="gold-text">Your Platform.</span>
          </h2>
          <p style={{ color:'#64748b', fontSize:16, marginBottom:36, lineHeight:1.7, maxWidth:480, margin:'0 auto 36px' }}>
            Stop using 5 different apps to run your business. TradeSync brings everything together. Launching in Oklahoma City first — get free early access now.
          </p>
          {joined ? (
            <div style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.3)', borderRadius:14, padding:'16px 32px', color:'#c9a84c', fontWeight:700, fontSize:16, display:'inline-block' }}>
              You're on the list! We'll see you at launch.
            </div>
          ) : (
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', maxWidth:480, margin:'0 auto' }}>
              <input value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && joinWaitlist()}
                placeholder="your@email.com"
                style={{ flex:1, minWidth:220, padding:'14px 18px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:12, fontSize:15, color:'#fff', outline:'none', fontFamily:'system-ui' }} />
              <button onClick={joinWaitlist} className="gold-btn"
                style={{ padding:'14px 28px', background:'linear-gradient(135deg,#8b6914,#c9a84c)', border:'none', borderRadius:12, color:'#0a0a0a', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Georgia,serif' }}>
                Get Early Access
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid rgba(201,168,76,0.1)', padding:'32px 48px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:2, fontFamily:'Georgia,serif' }}>TradeSync</div>
            <div style={{ fontSize:11, color:'#334155' }}>Made A Barber LLC · M.A.D.E Technologies Inc · Oklahoma City, OK</div>
            <div style={{ fontSize:11, color:'#334155', marginTop:2 }}>Precision. Style. Confidence.</div>
          </div>
          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {[['Made Technologies','/made-technologies'],['BoxFlow OS','/boxflow-os'],['Support','/support'],['Privacy','/privacy'],['Contact','/contact']].map(([l,h]) => (
              <Link key={h} href={h} style={{ color:'#334155', fontSize:12, textDecoration:'none' }}>{l}</Link>
            ))}
          </div>
          <div style={{ fontSize:11, color:'#1e293b', textAlign:'right' }}>
            (405) 693-8615<br />4510 NW 16th St, OKC, OK 73127
          </div>
        </div>
        <div style={{ maxWidth:1000, margin:'14px auto 0', textAlign:'center', fontSize:11, color:'#1e293b' }}>
          © 2026 Made A Barber LLC · M.A.D.E Technologies Inc · All rights reserved · tradesync.app (coming soon)
        </div>
      </footer>
    </div>
  )
}