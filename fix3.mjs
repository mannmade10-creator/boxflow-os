import { writeFileSync, mkdirSync } from 'fs';
['app/about', 'app/press', 'app/careers'].forEach(dir => {
  try { mkdirSync(dir, { recursive: true }); } catch(e) {}
});

// ABOUT PAGE
writeFileSync('app/about/page.tsx', `'use client'
import React from 'react'

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(37,99,235,0.15), transparent 60%), linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>

        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>About Us</div>
          <h1 style={{ fontSize: 56, fontWeight: 900, margin: '0 0 20px', lineHeight: 1.1 }}>Built by Someone Who<br/>Lived the Problem</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 700, margin: '0 auto', lineHeight: 1.8 }}>
            BoxFlow OS was not built in a Silicon Valley office. It was built by someone working inside a major paper and packaging company who watched millions of dollars get wasted every year on disconnected software systems.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 80, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 20px' }}>Our Story</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.9, fontSize: 16, marginBottom: 16 }}>
              Every day at work, I watched teams juggle 6 different software platforms just to answer one question: where is my order? Dispatch was in one system. Fleet was in another. Production on a third. HR somewhere else entirely.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.9, fontSize: 16, marginBottom: 16 }}>
              The company was paying millions to vendors who had never set foot in a box plant. Software built for generic logistics — not for the specific reality of paper manufacturing, corrugated production, and regional fleet operations.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.9, fontSize: 16 }}>
              So I built BoxFlow OS. One platform. Every operation. Built specifically for the industry I know from the inside.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { value: '$14.5M+', label: 'Average annual savings for enterprise clients', color: '#22c55e' },
              { value: '18+', label: 'Integrated modules in one platform', color: '#3b82f6' },
              { value: '100%', label: 'Built for paper and packaging operations', color: '#8b5cf6' },
              { value: '1', label: 'Platform to replace them all', color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderLeft: '3px solid ' + stat.color, borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: stat.color, minWidth: 120 }}>{stat.value}</div>
                <div style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.5 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 40px', textAlign: 'center' }}>What We Believe</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: '🏭', title: 'Industry First', desc: 'Software should be built around the industry it serves. BoxFlow OS was designed from day one for paper manufacturing and logistics — not adapted from a generic template.' },
              { icon: '🔗', title: 'Everything Connected', desc: 'Dispatch, fleet, production, HR, analytics, and client portals should all live in one system. Data silos cost companies millions and we eliminate them completely.' },
              { icon: '🤖', title: 'AI Should Take Action', desc: 'Most software shows you data. BoxFlow OS acts on it. Our AI engine optimizes production, reassigns drivers, and reduces delays with one click.' },
              { icon: '💰', title: 'Fair Pricing', desc: 'Enterprise software should not require a $5M SAP implementation. BoxFlow OS delivers more functionality at a fraction of the cost of legacy platforms.' },
              { icon: '🎯', title: 'Simplicity Wins', desc: 'If your team needs a week of training to use it, it is not good software. BoxFlow OS is intuitive, fast, and designed for the people who actually use it daily.' },
              { icon: '🔒', title: 'Your Data is Yours', desc: 'We will never sell your operational data. Everything you put into BoxFlow OS belongs to you, encrypted, secure, and fully exportable at any time.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 28, padding: '48px 40px', textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 16px' }}>Ready to See It in Action?</h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 28 }}>Join logistics and manufacturing companies saving millions by switching to BoxFlow OS.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contact" style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>Start Free Trial →</a>
            <a href="/pitch" style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>View Pitch Deck</a>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: '#334155', fontSize: 13, borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 32 }}>
          <a href="/privacy" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Terms of Service</a>
          <a href="/contact" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Contact</a>
          <a href="/careers" style={{ color: '#60a5fa', textDecoration: 'none' }}>Careers</a>
        </div>
      </div>
    </div>
  )
}`, 'utf8');

// PRESS KIT PAGE
writeFileSync('app/press/page.tsx', `'use client'
import React from 'react'

export default function PressPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>

        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Press Kit</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px' }}>BoxFlow OS Press Kit</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>Everything journalists, analysts, and partners need to cover BoxFlow OS.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>Company Facts</h2>
            {[
              { label: 'Company Name', value: 'BoxFlow OS' },
              { label: 'Founded', value: '2026' },
              { label: 'Headquarters', value: 'Oklahoma City, OK' },
              { label: 'Industry', value: 'Enterprise SaaS — Logistics & Manufacturing' },
              { label: 'Target Market', value: 'Paper & Packaging, Logistics, Fleet Operations' },
              { label: 'Platform Type', value: 'All-in-One Enterprise Operations Suite' },
              { label: 'Website', value: 'boxflow-os.vercel.app' },
              { label: 'Contact', value: 'press@boxflowos.com' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>{item.label}</span>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 14, textAlign: 'right', maxWidth: 220 }}>{item.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 16px', color: '#60a5fa' }}>Key Statistics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { value: '18+', label: 'Platform Modules', color: '#3b82f6' },
                  { value: '$14.5M', label: 'Avg Annual Savings', color: '#22c55e' },
                  { value: '96%', label: 'Cost Reduction', color: '#8b5cf6' },
                  { value: '14 Days', label: 'Free Trial', color: '#f59e0b' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                    <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 12px', color: '#60a5fa' }}>Brand Assets</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(2,6,23,0.5)', borderRadius: 12, padding: '12px 16px' }}>
                  <img src="/assets/logo.png" alt="Logo" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Primary Logo</div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>PNG format — Dark background</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ color: '#fff', fontWeight: 700, marginBottom: 8 }}>Brand Colors</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { color: '#2563eb', name: 'Primary Blue' },
                      { color: '#8b5cf6', name: 'Purple' },
                      { color: '#22c55e', name: 'Success Green' },
                      { color: '#020617', name: 'Dark Navy' },
                    ].map(c => (
                      <div key={c.name} style={{ textAlign: 'center' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: c.color, marginBottom: 4 }} />
                        <div style={{ color: '#64748b', fontSize: 10 }}>{c.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>Boilerplate Description</h2>
          <div style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>SHORT (50 words)</div>
            <p style={{ color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>BoxFlow OS is an enterprise operations platform built for logistics and paper manufacturing companies. It replaces 10+ disconnected software tools with one unified system covering dispatch, fleet tracking, production management, HR, AI optimization, and client portals — saving companies up to $14.5M annually.</p>
          </div>
          <div style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 16, padding: 24 }}>
            <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>LONG (100 words)</div>
            <p style={{ color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>BoxFlow OS is a next-generation enterprise operations suite designed specifically for paper manufacturing, corrugated packaging, and logistics companies. Built by an industry insider who experienced firsthand the inefficiency of disconnected software systems, BoxFlow OS consolidates dispatch, live fleet tracking, production floor management, HR and payroll, AI-powered optimization, executive analytics, and client portals into a single unified platform. Enterprise companies currently spending $10M-$20M annually on multiple disconnected vendors can replace their entire software stack with BoxFlow OS — reducing costs by up to 96% while gaining capabilities no individual vendor provides.</p>
          </div>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32, marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 20px', color: '#60a5fa' }}>Press Contact</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Press Inquiries', value: 'press@boxflowos.com', icon: '📧' },
              { label: 'Partnership Inquiries', value: 'partners@boxflowos.com', icon: '🤝' },
              { label: 'Enterprise Sales', value: 'sales@boxflowos.com', icon: '💼' },
              { label: 'General Contact', value: 'hello@boxflowos.com', icon: '💬' },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(2,6,23,0.5)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>{item.label}</div>
                  <div style={{ color: '#60a5fa', fontWeight: 700 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', color: '#334155', fontSize: 13, borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 32 }}>
          <a href="/about" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>About Us</a>
          <a href="/careers" style={{ color: '#60a5fa', marginRight: 20, textDecoration: 'none' }}>Careers</a>
          <a href="/contact" style={{ color: '#60a5fa', textDecoration: 'none' }}>Contact</a>
        </div>
      </div>
    </div>
  )
}`, 'utf8');

// CAREERS PAGE
writeFileSync('app/careers/page.tsx', `'use client'
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
}`, 'utf8');

console.log('All company pages built - About, Press Kit, Careers!');