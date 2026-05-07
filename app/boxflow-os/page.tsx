'use client'
import Link from 'next/link'
import { useState } from 'react'

const MODULES = [
  { icon: '🖥️', title: 'Command Center Dashboard', desc: 'Your entire operation visualized in real time. KPIs, alerts, and live activity on one screen.' },
  { icon: '🏭', title: 'Production Monitoring', desc: 'Track output, efficiency, and downtime in real time. Instant alerts when anything falls behind.' },
  { icon: '📦', title: 'Order Management', desc: 'Every order from intake to fulfillment in one place. Live status, client notifications, exception alerts.' },
  { icon: '🚦', title: 'Live Dispatch & Routing', desc: 'AI-powered dispatch assigns drivers, optimizes routes, and tracks deliveries in real time.' },
  { icon: '🚚', title: 'Fleet Tracking', desc: 'Every vehicle live on one map. Location, status, fuel, maintenance alerts, and driver behavior.' },
  { icon: '👤', title: 'Driver Management', desc: 'Profiles, performance scores, compliance docs, hours of service — all in one place.' },
  { icon: '🔗', title: 'Client Portal', desc: 'Give customers real-time visibility into their orders through a branded portal. Reduce inbound calls.' },
  { icon: '⚙️', title: 'Equipment Dashboard', desc: 'Track health, location, usage, and maintenance schedules. Prevent downtime before it happens.' },
  { icon: '👥', title: 'HR & Workforce', desc: 'Scheduling, time tracking, onboarding, compliance, and payroll — connected to your ops data.' },
  { icon: '📊', title: 'Analytics & Reporting', desc: 'Every metric across every department. Custom reports, trend tracking, real decisions.' },
]

const INDUSTRIES = [
  { icon: '🏗️', label: 'Warehousing & Distribution' },
  { icon: '🏭', label: 'Manufacturing' },
  { icon: '🚚', label: 'Logistics & Transportation' },
  { icon: '📦', label: 'Last-Mile Delivery' },
  { icon: '👔', label: 'C-Suite & Executive Teams' },
]

const STATS = [
  { value: '60–80%', label: 'Average software cost reduction' },
  { value: '48 hrs', label: 'Average time to go live' },
  { value: '10+', label: 'Modules in one platform' },
  { value: '$200K+', label: 'Average annual stack cost replaced' },
]

export default function BoxFlowOSPage() {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020818 0%, #070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(14,165,233,0.1)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>BoxFlow OS</span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/blog" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Blog</Link>
          <Link href="/roi" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>ROI Calculator</Link>
          <Link href="/pricing" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>
          <Link href="/login" style={{ padding: '8px 20px', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, color: '#0ea5e9', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
          <Link href="/roi" style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Book a Demo</Link>
        </div>
      </nav>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9', display: 'inline-block' }} />
          The All-in-One Operations Platform
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
          Stop Paying for 6 Tools<br />
          <span style={{ color: '#0ea5e9' }}>That Don't Talk to Each Other.</span>
        </h1>
        <p style={{ fontSize: 20, color: '#94a3b8', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          BoxFlow OS replaces your entire operations software stack — production, orders, dispatch, fleet, HR, and analytics — in one AI-powered platform. One login. One truth. Total control.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/roi" style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>Book a Live Demo →</Link>
          <Link href="/roi" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>See the ROI Calculator</Link>
        </div>
        <p style={{ color: '#475569', fontSize: 13, marginTop: 16 }}>No credit card required · Setup in 48 hours · 14-day free trial</p>
      </section>

      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(7,15,36,0.6)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#0ea5e9', marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>Sound Familiar?</h2>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>Most operations run on 6+ disconnected platforms. Here's what that's costing you.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            "You're paying $15K–$200K+ per year across disconnected software platforms",
            "Your fleet tracker doesn't talk to your dispatch system",
            "Your warehouse data is always a day behind",
            "When something breaks, nobody knows which system to blame",
            "Your team wastes hours every week manually syncing data",
            "Leadership can't get a real-time view of what's actually happening",
          ].map((pain, i) => (
            <div key={i} style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, padding: '20px 24px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ color: '#ef4444', fontSize: 18, flexShrink: 0 }}>✗</span>
              <span style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{pain}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#f0f6ff' }}>BoxFlow OS was built to solve every one of these — not with another tool, but by replacing all of them.</p>
        </div>
      </section>

      <section style={{ background: 'rgba(7,15,36,0.6)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16 }}>One Platform. Every Module Your Operation Needs.</h2>
            <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>Every function your operation requires — built to work together from day one.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {MODULES.map((mod, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredModule(i)}
                onMouseLeave={() => setHoveredModule(null)}
                style={{ background: 'rgba(12,26,56,0.9)', border: `1px solid ${hoveredModule === i ? 'rgba(14,165,233,0.4)' : 'rgba(14,165,233,0.12)'}`, borderRadius: 16, padding: 24, transition: 'border-color 0.2s, transform 0.2s', transform: hoveredModule === i ? 'translateY(-3px)' : 'none' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{mod.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f6ff', marginBottom: 8 }}>{mod.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16 }}>Up and Running in 48 Hours.</h2>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 500, margin: '0 auto' }}>No 18-month implementations. No dedicated IT team required.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { step: '01', title: 'Book a Demo', desc: "See BoxFlow OS live inside a business like yours. We'll walk through your specific workflows and show you exactly what changes on day one." },
            { step: '02', title: 'Onboarding & Migration', desc: 'Our team handles the migration from your current tools. We bring your data over, configure your modules, and train your team before go-live.' },
            { step: '03', title: 'Go Live', desc: 'Your entire operation runs on one platform. One monthly invoice instead of six. Full visibility from day one.' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 20, padding: 32 }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: 'rgba(14,165,233,0.2)', marginBottom: 16 }}>{s.step}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: '#f0f6ff' }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'rgba(7,15,36,0.6)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 900, marginBottom: 12 }}>Built for Operations That Can't Afford to Guess.</h2>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {INDUSTRIES.map((ind, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 100, padding: '12px 24px', fontSize: 14, fontWeight: 600, color: '#cbd5e1' }}>
                <span>{ind.icon}</span>{ind.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
          See BoxFlow OS Running<br />Your Operation. Live.
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.6, maxWidth: 500, margin: '0 auto 40px' }}>
          Book a 30-minute demo. We'll show you BoxFlow OS inside a business like yours — and give you a custom ROI breakdown before you leave the call.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/roi" style={{ padding: '18px 44px', background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 17, textDecoration: 'none' }}>Book Your Demo Now →</Link>
          <Link href="/roi" style={{ padding: '18px 44px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: 17, textDecoration: 'none' }}>Calculate Your Savings</Link>
        </div>
        <p style={{ color: '#475569', fontSize: 13, marginTop: 20 }}>Questions? Email us: hello@boxflowos.com</p>
      </section>

    </div>
  )
}