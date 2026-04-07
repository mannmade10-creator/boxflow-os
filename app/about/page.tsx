'use client'
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
}