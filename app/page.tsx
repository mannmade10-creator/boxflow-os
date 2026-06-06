'use client'

import { useRouter } from 'next/navigation'

export default function BoxFlowSplashPage() {
  const router = useRouter()

  return (
    <main style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <style>{`
        @keyframes spinLogo {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.08); }
          100% { transform: rotateY(360deg) scale(1); }
        }
        .boxflow-logo-spin {
          animation: spinLogo 2.4s ease-in-out infinite;
          cursor: pointer;
        }
      `}</style>

      <section style={{ textAlign: 'center' }}>
        <button
          onClick={() => router.push('/login')}
          className="boxflow-logo-spin"
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            border: '2px solid rgba(148,163,184,.7)',
            background: 'linear-gradient(135deg, #020617, #0f172a, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 120, height: 120, objectFit: 'contain' }} />
        </button>

        <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>BoxFlow OS</h1>

        <p style={{ color: '#cbd5e1', fontSize: 16, marginTop: 10, fontWeight: 600 }}>
          Intelligent Manufacturing • Logistics • Fleet Operations
        </p>

        <p style={{ color: '#94a3b8', fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Enterprise Manufacturing & Logistics Platform
        </p>

        <button
          onClick={() => router.push('/login')}
          style={{
            marginTop: 18,
            padding: '12px 22px',
            borderRadius: 999,
            border: '1px solid rgba(148,163,184,.4)',
            background: 'rgba(37,99,235,.25)',
            color: '#fff',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Enter BoxFlow OS
        </button>
      </section>
    </main>
  )
}