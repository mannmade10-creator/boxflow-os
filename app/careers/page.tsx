'use client'
import Link from 'next/link'
import { useState } from 'react'

const ROLES = [
  { title: 'Senior Full-Stack Engineer', dept: 'Engineering', type: 'Full-time', location: 'Remote (US)', desc: 'Build and scale our enterprise platform suite. You will work across the stack — Next.js, Supabase, TypeScript — shipping features that real operators use every day.' },
  { title: 'Product Designer', dept: 'Design', type: 'Full-time', location: 'Remote (US)', desc: 'Design interfaces for industries that have never had great software. You will own the end-to-end design process from research to final UI across all four of our platforms.' },
  { title: 'Enterprise Sales Representative', dept: 'Sales', type: 'Full-time', location: 'Remote (US)', desc: 'Sell BoxFlow OS and MedFlow OS to mid-market operations. You will run the full sales cycle from outreach to close, with strong commission potential.' },
  { title: 'Customer Success Manager', dept: 'Customer Success', type: 'Full-time', location: 'Remote (US)', desc: 'Own the post-sale relationship with our enterprise customers. You will handle onboarding, drive adoption, and ensure our clients get maximum value from our platforms.' },
  { title: 'DevOps Engineer', dept: 'Engineering', type: 'Full-time', location: 'Remote (US)', desc: 'Own our infrastructure on Vercel and Supabase. You will build CI/CD pipelines, monitor performance, and ensure our platforms are fast, reliable, and secure.' },
]

const VALUES = [
  { icon: 'S', title: 'Speed Over Perfection', desc: 'We ship fast. We iterate. We build things operators actually use.' },
  { icon: 'O', title: 'Operators First', desc: 'Every decision we make is for the people running the operation.' },
  { icon: 'C', title: 'Clarity Over Complexity', desc: 'We build simple, clear products. No bloat. No unnecessary complexity.' },
  { icon: 'R', title: 'Remote First', desc: 'Work from anywhere in the US. We judge by output, not hours.' },
]

export default function CareersPage() {
  const [selected, setSelected] = useState<any>(null)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#020818 0%,#070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff' }}>M</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>Made Technologies</div>
            <div style={{ fontSize: 8, color: '#14D2C2', letterSpacing: 2, textTransform: 'uppercase' }}>Enterprise Suite</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['About', '/about'], ['Contact', '/contact']].map(([l, h]) => <Link key={h} href={h} style={{ color: '#64748b', fontSize: 13, textDecoration: 'none' }}>{l}</Link>)}
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: '#14D2C2', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Join the Team</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 16px', letterSpacing: -2 }}>Build Software That <span style={{ color: '#14D2C2' }}>Actually Matters.</span></h1>
          <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>We are a small team building enterprise software for industries that have been underserved for too long. If you want your work to matter, you are in the right place.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 64 }}>
          {VALUES.map((v, i) => (
            <div key={i} style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.12)', borderRadius: 16, padding: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(20,210,194,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#14D2C2', marginBottom: 14 }}>{v.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{v.title}</h3>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 24 }}>Open Roles</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
          {ROLES.map((r, i) => (
            <div key={i} onClick={() => setSelected(selected?.title === r.title ? null : r)}
              style={{ background: 'rgba(12,26,56,0.8)', border: `1px solid ${selected?.title === r.title ? 'rgba(20,210,194,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14, padding: '20px 24px', cursor: 'pointer', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{r.title}</h3>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#14D2C2', background: 'rgba(20,210,194,0.1)', border: '1px solid rgba(20,210,194,0.2)', borderRadius: 6, padding: '2px 10px' }}>{r.dept}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{r.type}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>{r.location}</span>
                  </div>
                </div>
                <span style={{ color: '#14D2C2', fontSize: 18 }}>{selected?.title === r.title ? '-' : '+'}</span>
              </div>
              {selected?.title === r.title && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{r.desc}</p>
                  <a href="mailto:careers@boxflowos.com" style={{ display: 'inline-block', padding: '10px 24px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>
                    Apply for this Role
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 20, padding: 36, textAlign: 'center' }}>
          <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Do not see the right role?</h3>
          <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 24 }}>We are always looking for great people. Send us your resume and tell us how you would contribute.</p>
          <a href="mailto:careers@boxflowos.com" style={{ display: 'inline-block', padding: '13px 28px', background: 'linear-gradient(135deg,#0A6E68,#14D2C2)', borderRadius: 12, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            Send Us Your Resume
          </a>
        </div>
      </div>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 12, color: '#334155' }}>© 2026 Made Technologies Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Refund', '/refund']].map(([l, h]) => (
            <Link key={h} href={h} style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}