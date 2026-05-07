'use client'
import Link from 'next/link'
import { useState } from 'react'

const MODULES = [
  { icon: '📦', title: 'Live Inventory Management', desc: 'Real-time visibility into every SKU, every location, every movement. Auto-alerts for low stock and expiration dates.' },
  { icon: '🚚', title: 'Delivery & Shipment Tracking', desc: 'Track every delivery from dispatch to doorstep. Live status, proof of delivery, exception alerts, and client-facing tracking.' },
  { icon: '🗺️', title: 'Fleet Management', desc: 'Every vehicle live — location, status, maintenance schedule, and utilization on one map.' },
  { icon: '👤', title: 'Driver & Courier Management', desc: 'Compliance documents, hours of service, performance tracking, and communication for every driver — all in one place.' },
  { icon: '✅', title: 'Compliance Monitoring', desc: 'Built-in compliance tracking. Document management, audit trails, expiration alerts, and automated reporting — always audit-ready.' },
  { icon: '🖥️', title: 'Operations Command Center', desc: 'Live dashboard giving leadership full visibility across inventory, deliveries, fleet, and compliance — from any device.' },
  { icon: '🏥', title: 'Client & Facility Portal', desc: 'Give healthcare clients real-time visibility into their orders through a secure, branded portal.' },
  { icon: '📊', title: 'Analytics & Reporting', desc: 'Custom reports across delivery performance, inventory turns, compliance status, and fleet efficiency.' },
]

const STATS = [
  { value: 'Zero', label: 'Tolerance for delivery errors' },
  { value: '48 hrs', label: 'Average time to go live' },
  { value: '100%', label: 'Compliance-ready from day one' },
  { value: '8+', label: 'Modules unified in one platform' },
]

export default function MedFlowOSPage() {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020818 0%, #06131f 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid rgba(20,210,194,0.1)', position: 'sticky', top: 0, background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="MedFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>MedFlow <span style={{ color: '#14D2C2' }}>OS</span></span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/blog" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Blog</Link>
          <Link href="/roi" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>ROI Calculator</Link>
          <Link href="/medflow-login" style={{ padding: '8px 20px', background: 'rgba(20,210,194,0.1)', border: '1px solid rgba(20,210,194,0.3)', borderRadius: 8, color: '#14D2C2', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
          <Link href="/contact" style={{ padding: '8px 20px', background: 'linear-gradient(135deg, #14D2C2, #0A9E92)', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Request a Demo</Link>
        </div>
      </nav>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(20,210,194,0.1)', border: '1px solid rgba(20,210,194,0.25)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#14D2C2', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#14D2C2', display: 'inline-block' }} />
          The Unified Platform for Healthcare Logistics
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
          Healthcare Logistics Runs on Precision.<br />
          <span style={{ color: '#14D2C2' }}>Your Software Should Too.</span>
        </h1>
        <p style={{ fontSize: 20, color: '#94a3b8', maxWidth: 620, margin: '0 auto 40px', lineHeight: 1.6 }}>
          MedFlow OS is the all-in-one operations platform built specifically for healthcare supply chains, medical delivery networks, and clinical logistics — real-time inventory, live fleet tracking, delivery management, and compliance monitoring, unified in one place.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #14D2C2, #0A9E92)', borderRadius: 12, color: '#fff', fontWeight: 800, fontSize: 16, textDecoration: 'none' }}>Request a Demo →</Link>
          <Link href="/roi" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>See How It Works</Link>
        </div>
        <p style={{ color: '#475569', fontSize: 13, marginTop: 16 }}>Built for healthcare · Compliant by design · Live in under 48 hours</p>
      </section>

      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,19,31,0.8)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#14D2C2', marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>One Missed Shipment in Healthcare Isn't an Inconvenience. It's a Crisis.</h2>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>Most healthcare logistics operations are running on disconnected systems that weren't built for the speed, accuracy, or compliance requirements healthcare demands.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[
            "Inventory data that's always a step behind — leading to shortages or overstock",
            "Delivery tracking across multiple platforms with no single source of truth",
            "Compliance documentation scattered across systems and spreadsheets",
            "Fleet and driver management handled through phone calls and manual logs",
            "No real-time visibility for leadership when something goes wrong",
            "Critical supplies delayed because nobody knew where they were",
          ].map((pain, i) => (
            <div key={i} style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: 14, padding: '20px 24px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ color: '#f43f5e', fontSize: 18, flexShrink: 0 }}>✗</span>
              <span style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6 }}>{pain}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#f0f6ff' }}>MedFlow OS was purpose-built to eliminate every one of these failure points.</p>
        </div>
      </section>

      <section style={{ background: 'rgba(6,19,31,0.8)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16 }}>Every System Your Healthcare Operation Needs. One Platform.</h2>
            <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>Purpose-built for the precision healthcare demands.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {MODULES.map((mod, i) => (
              <div key={i}
                onMouseEnter={() => setHoveredModule(i)}
                onMouseLeave={() => setHoveredModule(null)}
                style={{ background: 'rgba(12,26,56,0.9)', border: `1px solid ${hoveredModule === i ? 'rgba(20,210,194,0.4)' : 'rgba(20,210,194,0.1)'}`, borderRadius: 16, padding: 24, transition: 'border-color 0.2s, transform 0.2s', transform: hoveredModule === i ? 'translateY(-3px)' : 'none' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{mod.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f0f6ff', marginBottom: 8 }}>{mod.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>Built for the Standards Healthcare Requires.</h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>Compliance in healthcare logistics isn't a report you generate at the end of the quarter. It's a requirement that touches every delivery, every inventory movement, and every vendor interaction.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Audit-ready documentation and trail logging across all operations',
                'Role-based access controls — the right people see the right data',
                'Expiration date tracking and alerts for medications and supplies',
                'Automated compliance reports — ready for internal or external audit',
                'Secure, encrypted data across every module',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: '#14D2C2', flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ color: '#cbd5e1', fontSize: 15 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(20,210,194,0.05)', border: '1px solid rgba(20,210,194,0.15)', borderRadius: 24, padding: 40 }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#14D2C2', marginBottom: 24 }}>Who MedFlow OS Serves</h3>
            {[
              { icon: '💊', label: 'Medical Supply Distributors' },
              { icon: '🚐', label: 'Healthcare Delivery Networks' },
              { icon: '🏥', label: 'Hospital & Clinic Supply Chains' },
              { icon: '💉', label: 'Pharmaceutical Logistics' },
              { icon: '🏠', label: 'Home Health & DME Providers' },
              { icon: '👔', label: 'Healthcare Operations Directors' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ color: '#cbd5e1', fontSize: 15, fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'rgba(6,19,31,0.8)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16 }}>Live in 48 Hours. No Disruption to Your Operations.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Request a Demo', desc: "We'll walk through your specific healthcare logistics workflows and show you exactly what MedFlow OS looks like inside your operation." },
              { step: '02', title: 'Configuration & Onboarding', desc: "Our team migrates your data, configures compliance settings, and trains your staff. We go live only when you're fully ready." },
              { step: '03', title: 'Full Operational Visibility', desc: 'From day one, your entire team — warehouse, dispatch, fleet, compliance, and leadership — operates from one unified platform.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(20,210,194,0.12)', borderRadius: 20, padding: 32 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: 'rgba(20,210,194,0.2)', marginBottom: 16 }}>{s.step}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: '#f0f6ff' }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
          Your Patients Deserve a Supply Chain<br />
          <span style={{ color: '#14D2C2' }}>That Doesn't Fail.</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.6, maxWidth: 500, margin: '0 auto 40px' }}>
          Request a demo today. We'll show you exactly what MedFlow OS looks like inside a healthcare logistics operation like yours.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/contact" style={{ padding: '18px 44px', background: 'linear-gradient(135deg, #14D2C2, #0A9E92)', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 17, textDecoration: 'none' }}>Request Your Demo Now →</Link>
          <Link href="/roi" style={{ padding: '18px 44px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: 17, textDecoration: 'none' }}>Calculate Your Savings</Link>
        </div>
        <p style={{ color: '#475569', fontSize: 13, marginTop: 20 }}>Questions? Email us: hello@medflowos.com</p>
      </section>

    </div>
  )
}