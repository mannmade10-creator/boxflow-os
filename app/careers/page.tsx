'use client'
import React, { useState } from 'react'

const jobs = [
  { title: 'Senior Full-Stack Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time', desc: 'Build and scale the core BoxFlow OS platform. Experience with Next.js, TypeScript, and Supabase required.' },
  { title: 'AI/ML Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time', desc: 'Build and improve our AI optimization engine for logistics and production workflows.' },
  { title: 'Enterprise Sales Executive', dept: 'Sales', location: 'Remote / Travel', type: 'Full-time', desc: 'Close enterprise deals with paper manufacturers and logistics companies. $500K+ deal experience preferred.' },
  { title: 'Customer Success Manager', dept: 'Customer Success', location: 'Remote', type: 'Full-time', desc: 'Help enterprise clients get maximum value from BoxFlow OS. Operations or logistics background a plus.' },
  { title: 'Logistics Industry Specialist', dept: 'Product', location: 'Remote', type: 'Full-time', desc: 'Shape our product roadmap using deep industry expertise in paper manufacturing or fleet operations.' },
  { title: 'DevOps Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time', desc: 'Own our infrastructure, deployment pipelines, and reliability. Vercel, Supabase, and cloud experience required.' },
]

export default function CareersPage() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>

        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Careers</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px' }}>Build the Future of<br/>Enterprise Operations</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>Join a team replacing $16M/year software stacks with one platform. We move fast, think big, and build for real industries.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 60 }}>
          {[
            { icon: '🌍', title: '100% Remote', desc: 'Work from anywhere. We care about output, not office hours.' },
            { icon: '💰', title: 'Competitive Pay', desc: 'Top-of-market salaries plus equity in a high-growth company.' },
            { icon: '🚀', title: 'Real Impact', desc: 'Your work directly affects how Fortune 500 companies operate.' },
          ].map(perk => (
            <div key={perk.title} style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{perk.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{perk.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{perk.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 24 }}>Open Positions</h2>
        <div style={{ display: 'grid', gap: 16, marginBottom: 60 }}>
          {jobs.map(job => (
            <div key={job.title} style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: 24, cursor: 'pointer' }} onClick={() => setSelected(selected === job.title ? null : job.title)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{job.title}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{job.dept}</span>
                    <span style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8', padding: '3px 10px', borderRadius: 999, fontSize: 12 }}>{job.location}</span>
                    <span style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{job.type}</span>
                  </div>
                </div>
                <div style={{ color: '#60a5fa', fontSize: 20 }}>{selected === job.title ? '−' : '+'}</div>
              </div>
              {selected === job.title && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                  <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: 16 }}>{job.desc}</p>
                  <a href={'mailto:careers@boxflowos.com?subject=Application: ' + job.title} style={{ display: 'inline-block', padding: '10px 24px', background: '#2563eb', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>Apply Now →</a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 24, padding: 32, textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 12px' }}>Do not see your role?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 20 }}>We are always looking for exceptional people. Send us your story.</p>
          <a href="mailto:careers@boxflowos.com" style={{ padding: '14px 32px', background: '#2563eb', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>Get in Touch</a>
        </div>

        <div style={{ textAlign: 'center', color: '#334155', fontSize: 13, borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 32 }}>
          <a href="/about" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>About Us</a>
          <a href="/press" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Press Kit</a>
          <a href="/contact" style={{ color: '#60a5fa', textDecoration: 'none' }}>Contact</a>
        </div>
      </div>
    </div>
  )
}