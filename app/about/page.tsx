'use client'
import React from 'react'
import AppSidebar from '@/components/AppSidebar'

export default function AboutPage() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <AppSidebar active="about" />
      <div style={{ flex: 1, padding: '60px 40px' }}>

        <div style={{ textAlign: 'center' as const, marginBottom: 80 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 20 }}>About M.A.D.E Technologies</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 20px', lineHeight: 1.1 }}>Built by Someone Who<br />Lived the Problem</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 700, margin: '0 auto', lineHeight: 1.8 }}>
            BoxFlow OS was not built in a Silicon Valley office. It was built by someone working inside a major paper and packaging company who watched millions of dollars get wasted every year on disconnected, outdated software systems.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginBottom: 80, alignItems: 'start' }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>Our Story</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.9, fontSize: 16, marginBottom: 16 }}>
              Every day at work, I watched teams juggle 6 different software platforms just to answer one question: where is my order? Dispatch was in one system. Fleet was in another. Production on a third. HR somewhere else entirely.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.9, fontSize: 16, marginBottom: 16 }}>
              The company was paying millions to vendors who had never set foot in a box plant. Software built for generic logistics — not for the specific reality of paper manufacturing, corrugated production, and regional fleet operations.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.9, fontSize: 16, marginBottom: 16 }}>
              The corrugator alone had three separate systems: KIWIPLAN for the order queue, Qualitek for wet-end production control, and a completely separate performance reporting terminal. None of them talked to each other. Operators had to watch three screens to do one job.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.9, fontSize: 16 }}>
              So I built the replacement. BoxFlow OS unifies every operation — from the corrugator floor to the last-mile delivery truck — in a single modern platform that anyone can use from any device.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { icon: '🏭', title: 'Corrugator Production', desc: 'Replaces KIWIPLAN and Qualitek with a real-time dashboard — order queue, roll stock timers, shift performance, and downtime logging.' },
              { icon: '🚛', title: 'Fleet & Dispatch', desc: 'Live GPS tracking, AI-optimized routing, and real-time driver communication — all in one screen.' },
              { icon: '📦', title: 'Order Management', desc: 'From box plant order to delivery confirmation, every step is tracked and visible to clients in real time.' },
              { icon: '📱', title: 'Mobile First', desc: 'Drivers and clients get dedicated mobile apps. Managers get full access from anywhere.' },
            ].map(f => (
              <div key={f.title} style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#60a5fa', marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, padding: 40, marginBottom: 80 }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 999, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', fontSize: 11, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 16 }}>Featured Module</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>Corrugator Production System</h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 16, marginBottom: 24, maxWidth: 800 }}>
            Built as a direct replacement for legacy KIWIPLAN and Qualitek terminals, the BoxFlow OS Corrugator Production System gives machine operators and production managers a unified real-time dashboard for every aspect of corrugator operations.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { label: 'Order Queue (AIAB)', desc: 'Full transmission queue — HIST, PROC, XMTD, RXMT with live completion timers for every order' },
              { label: 'Roll Stock Timers', desc: 'Real-time remaining paper, splice timers, shortage alerts per station' },
              { label: 'Shift Performance', desc: 'Elapsed time, run time, downtime, footage by flute, waste %, number of changes' },
              { label: 'Downtime Logging', desc: 'One-tap downtime logging — paper break, splice, washup, mechanical, and more' },
              { label: 'DB Cruise Control', desc: 'Manager-only speed slider 200-800 FPM — all timers recalculate live' },
              { label: 'Role-Based Access', desc: 'Operators clock in on-site only. Managers access from anywhere including home.' },
            ].map(f => (
              <div key={f.label} style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#c084fc', marginBottom: 6 }}>{f.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 80 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, textAlign: 'center' as const }}>What We Believe</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: '🔗', title: 'Everything Connected', desc: 'Dispatch, fleet, corrugator production, HR, analytics, and client portals all live in one system. Data silos cost companies millions.' },
              { icon: '🤖', title: 'AI Should Take Action', desc: 'Most software shows you data. BoxFlow OS acts on it. Our AI engine optimizes production, reassigns drivers, and reduces delays automatically.' },
              { icon: '🏭', title: 'Built for Box Plants', desc: 'We understand corrugated manufacturing from the wet end to the dry end. BoxFlow OS speaks the language of paper, flutes, and footage.' },
              { icon: '📱', title: 'Mobile is Non-Negotiable', desc: 'Operators need tablets. Drivers need phones. Managers need access from home. BoxFlow OS works everywhere.' },
              { icon: '💰', title: 'Priced for Real Business', desc: 'Not enterprise pricing that requires a VP signature. Straightforward monthly pricing that makes sense for a single plant or a national fleet.' },
              { icon: '🚀', title: 'Ship Fast, Improve Always', desc: 'BoxFlow OS is live today. We ship updates continuously based on real feedback from real operators on real production floors.' },
            ].map(v => (
              <div key={v.title} style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{v.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#60a5fa', marginBottom: 8 }}>{v.title}</h3>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, padding: 40, marginBottom: 80, display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' as const }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#fff', flexShrink: 0 }}>K</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>Founder & CEO</div>
            <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Kenneth Covington</h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.8, maxWidth: 700 }}>
              Kenneth built BoxFlow OS while working in the paper and packaging industry, watching firsthand how disconnected systems — KIWIPLAN, Qualitek, separate fleet trackers, and spreadsheet-based HR — cost companies millions in wasted time and poor decisions. M.A.D.E Technologies Inc. is his answer: Make Anything Do Everything.
            </p>
            <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
              <span style={{ fontSize: 13, color: '#60a5fa' }}>Kenneth.Covington@madetechnologies.com</span>
              <span style={{ fontSize: 13, color: '#475569' }}>boxflowos.com</span>
              <span style={{ fontSize: 13, color: '#475569' }}>propflowos.com</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' as const, padding: '60px 0' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Ready to See It Live?</h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 32 }}>BoxFlow OS is running right now. No demo request needed.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <a href="/dashboard" style={{ padding: '16px 40px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 16 }}>Enter BoxFlow OS →</a>
            <a href="/production-v2" style={{ padding: '16px 40px', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', borderRadius: 14, textDecoration: 'none', fontWeight: 800, fontSize: 16 }}>View Corrugator System →</a>
          </div>
        </div>

      </div>
    </div>
  )
}