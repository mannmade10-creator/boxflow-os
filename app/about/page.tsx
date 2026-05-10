'use client'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020818 0%, #070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff' }}>M</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>Made Technologies</div>
            <div style={{ fontSize: 9, color: '#2563EB', letterSpacing: 2, textTransform: 'uppercase' }}>Enterprise Suite</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/boxflow-os" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>BoxFlow OS</Link>
          <Link href="/medflow-os" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>MedFlow OS</Link>
          <Link href="/contact" style={{ padding: '9px 22px', background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>Contact Us</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 100, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>
            About Us
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            We Build Software for <span style={{ color: '#2563EB' }}>Industries That Can't Afford to Guess.</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7 }}>
            Made Technologies Inc is an enterprise software company building purpose-built operating systems for industries that have been underserved by generic software for too long.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {[
            { title: 'Our Mission', body: 'Every industry deserves software built specifically for how they operate — not a generic ERP scaled down or a consumer app bolted together with duct tape and integrations. We build from the ground up: one platform, one login, one source of truth for every function in your operation.' },
            { title: 'How We Started', body: 'Made Technologies was founded by Kenneth Covington with one observation: every industry has software built for it, but no industry has software built for how they actually operate. Healthcare logistics runs on commercial shipping tools. Manufacturing plants run on ERP systems designed for retailers. We set out to change that — one industry at a time.' },
            { title: 'What We Build', body: 'BoxFlow OS for logistics, manufacturing, and distribution. MedFlow OS for healthcare supply chains and pharmacy operations. PropFlow OS for property management. ClassFlow OS for education institutions. Each platform is purpose-built from the ground up for that industry — not adapted from something else.' },
            { title: 'Our Approach', body: 'We price for the mid-market — operations that are too big for basic tools and too lean for enterprise software. We implement in 48 hours, not 18 months. We support you directly, not through a ticket queue. And we build features based on what actual operations need, not what enterprise analysts think they need.' },
            { title: 'Our Values', body: 'Speed over perfection. Clarity over complexity. Operators first. We build for the people running the operation — the dispatchers, the pharmacists, the fleet managers — not just the executives signing the contract.' },
          ].map((s, i) => (
            <div key={i} style={{ borderLeft: '2px solid rgba(37,99,235,0.3)', paddingLeft: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f0f6ff', marginBottom: 12 }}>{s.title}</h2>
              <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.8, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 20, padding: 36, textAlign: 'center' }}>
          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Want to Learn More?</h3>
          <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 24 }}>Book a demo or reach out directly — we respond personally.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ padding: '13px 28px', background: 'linear-gradient(135deg,#1d4ed8,#2563EB)', borderRadius: 12, color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Book a Demo →</Link>
            <Link href="/contact" style={{ padding: '13px 28px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Contact Us</Link>
          </div>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 48px', textAlign: 'center' }}>
        <p style={{ color: '#334155', fontSize: 12, margin: 0 }}>© 2026 Made Technologies Inc. All rights reserved. · <Link href="/privacy" style={{ color: '#334155', textDecoration: 'none' }}>Privacy</Link> · <Link href="/terms" style={{ color: '#334155', textDecoration: 'none' }}>Terms</Link></p>
      </footer>
    </div>
  )
}