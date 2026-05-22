'use client'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const PLATFORM_META: Record<string, { name: string; color: string; dashHref: string }> = {
  boxflow:   { name: 'BoxFlow OS',   color: '#2563EB', dashHref: '/boxflow' },
  medflow:   { name: 'MedFlow OS',   color: '#14D2C2', dashHref: '/medflow/dashboard' },
  propflow:  { name: 'PropFlow OS',  color: '#a855f7', dashHref: '/propflow/dashboard' },
  classflow: { name: 'ClassFlow AI', color: '#f59e0b', dashHref: '/classflow/dashboard' },
}

function BillingSuccessContent() {
  const params    = useSearchParams()
  const platform  = params?.get('platform') || 'boxflow'
  const sessionId = params?.get('session_id') || ''
  const [count, setCount] = useState(5)

  const meta = PLATFORM_META[platform] || PLATFORM_META.boxflow

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(id); window.location.href = meta.dashHref; return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [meta.dashHref])

  return (
    <div style={{ maxWidth: 540, width: '100%', textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: `rgba(${meta.color === '#2563EB' ? '37,99,235' : meta.color === '#14D2C2' ? '20,210,194' : meta.color === '#a855f7' ? '168,85,247' : '245,158,11'},0.12)`, border: `2px solid ${meta.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36, color: meta.color, fontWeight: 900 }}>
        +
      </div>
      <h1 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, marginBottom: 14, letterSpacing: -1 }}>
        Welcome to {meta.name}!
      </h1>
      <p style={{ color: '#64748b', fontSize: 16, lineHeight: 1.7, marginBottom: 8 }}>
        Your 14-day free trial has started. No charge until your trial ends.
      </p>
      <p style={{ color: '#475569', fontSize: 13, marginBottom: 32 }}>
        Confirmation email sent to your inbox.{sessionId ? ` Session: ${sessionId.substring(0,20)}...` : ''}
      </p>

      <div style={{ background: 'rgba(12,26,56,0.8)', border: `1px solid ${meta.color}20`, borderRadius: 18, padding: 28, marginBottom: 32, textAlign: 'left' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: '#f0f6ff' }}>What happens next:</h3>
        {[
          { step: '1', title: 'Access your dashboard', desc: 'You can start using the platform immediately — no setup needed.' },
          { step: '2', title: 'We reach out within 24 hours', desc: 'Kenneth will personally contact you to make sure you are fully onboarded.' },
          { step: '3', title: '14-day free trial', desc: 'Your card is not charged until the trial ends. Cancel anytime before.' },
          { step: '4', title: 'Go live in 48 hours', desc: 'Our team will help you migrate data and get fully operational.' },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 3 ? 16 : 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${meta.color}18`, border: `1px solid ${meta.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: meta.color, flexShrink: 0 }}>{s.step}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: '#334155', fontSize: 13, marginBottom: 20 }}>
        Redirecting to your dashboard in {count} seconds...
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href={meta.dashHref} style={{ padding: '13px 28px', background: `linear-gradient(135deg,${meta.color}cc,${meta.color})`, borderRadius: 12, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>
          Go to Dashboard Now
        </Link>
        <Link href="/support" style={{ padding: '13px 28px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#94a3b8', textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          Contact Support
        </Link>
      </div>
    </div>
  )
}

export default function BillingSuccessPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#020818 0%,#070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Suspense fallback={
        <div style={{ textAlign: 'center', color: '#475569', fontSize: 14 }}>Loading...</div>
      }>
        <BillingSuccessContent />
      </Suspense>
    </div>
  )
}