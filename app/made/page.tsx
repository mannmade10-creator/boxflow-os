'use client'
import Link from 'next/link'

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Demo', href: '/demo' },
  { label: 'Contact', href: '/contact' },
]

const PRODUCTS = [
  { name: 'BoxFlow OS', color: '#2563EB', icon: '📦', desc: 'Logistics, fleet, dispatch, and operations — unified in one AI-powered platform.', href: '/boxflow-os' },
  { name: 'MedFlow OS', color: '#14D2C2', icon: '⚕️', desc: 'Healthcare supply chain, cold chain, compliance, and pharmacy operations — purpose-built.', href: '/medflow-os' },
  { name: 'PropFlow OS', color: '#8b5cf6', icon: '🏢', desc: 'Property management, tenant portals, maintenance, and finance — all in one place.', href: '#' },
  { name: 'ClassFlow OS', color: '#f59e0b', icon: '🎓', desc: 'Education operations, scheduling, enrollment, and reporting — built for institutions.', href: '#' },
]

const STATS = [
  { value: '4', label: 'Industry Platforms' },
  { value: '48hrs', label: 'Average Go-Live' },
  { value: '60-80%', label: 'Cost Reduction' },
  { value: '100%', label: 'Built in the USA' },
]

export default function MadeTechLanding() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020818 0%, #070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 60px rgba(37,99,235,0.3); } 50% { box-shadow: 0 0 100px rgba(37,99,235,0.6); } }
        .prod-card { transition: transform 0.2s, border-color 0.2s; }
        .prod-card:hover { transform: translateY(-4px); }
        .nav-link { color: #64748b; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .nav-link:hover { color: #f0f6ff; }
      `}</style>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, animation: 'glow 3s ease infinite' }}>M</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Made Technologies</div>
            <div style={{ fontSize: 9, color: '#2563EB', letterSpacing: 2, textTransform: 'uppercase' }}>Enterprise Suite</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {NAV.map(n => <a key={n.href} href={n.href} className="nav-link">{n.label}</a>)}
          <a href="/" style={{ padding: '9px 22px', background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>View Platforms →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center', animation: 'fadeUp 0.8s ease both' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 100, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Made Technologies Inc — Enterprise Software Suite
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px', letterSpacing: -2 }}>
          One Company.<br />
          <span style={{ color: '#2563EB' }}>Every Industry.</span><br />
          Built to Last.
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 19, maxWidth: 620, margin: '0 auto 48px', lineHeight: 1.6 }}>
          We build purpose-built operating systems for industries that can't afford generic software. Healthcare. Logistics. Property. Education. One company — four platforms — built from the ground up.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ padding: '16px 36px', background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', borderRadius: 14, color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 800 }}>
            Explore Our Platforms →
          </a>
          <a href="/demo" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
            Book a Demo
          </a>
        </div>
      </section>

      {/* STATS */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(37,99,235,0.15)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#2563EB', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', letterSpacing: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 12 }}>Our Platform Suite</h2>
          <p style={{ color: '#64748b', fontSize: 16 }}>Four industry-specific operating systems. One company behind them all.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 20 }}>
          {PRODUCTS.map((p, i) => (
            <a key={i} href={p.href} style={{ textDecoration: 'none' }}>
              <div className="prod-card" style={{ background: 'rgba(12,26,56,0.8)', border: `1px solid ${p.color}20`, borderRadius: 20, padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${p.color}18`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{p.icon}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: p.color }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>by Made Technologies Inc</div>
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                <div style={{ marginTop: 20, fontSize: 13, color: p.color, fontWeight: 600 }}>Learn More →</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* WHY MADE */}
      <section style={{ background: 'rgba(7,15,36,0.6)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, marginBottom: 20 }}>Why Made Technologies?</h2>
          <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.8, marginBottom: 40 }}>
            Most industries run on software that was never designed for them. Healthcare logistics runs on generic shipping tools. Manufacturing plants run on ERP systems built for retailers. Property managers use spreadsheets and consumer apps.
          </p>
          <p style={{ color: '#94a3b8', fontSize: 17, lineHeight: 1.8 }}>
            We build from the ground up — purpose-built platforms for each industry that unify every function into one operating system. Real-time data. One login. A fraction of the cost.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px 100px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, marginBottom: 16 }}>
          Ready to See It in Your Operation?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
          Book a 30-minute demo. We'll show you exactly what your platform looks like inside a business like yours.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/demo" style={{ padding: '16px 36px', background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', borderRadius: 14, color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 800 }}>Book a Demo →</a>
          <a href="/contact" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>Contact Us</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 13, color: '#334155' }}>© 2026 Made Technologies Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Refund', '/refund'], ['Careers', '/careers'], ['Investors', '/investors'], ['Press', '/press']].map(([l, h]) => (
              <a key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}