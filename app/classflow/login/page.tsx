'use client'
import { SignIn } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [phase, setPhase] = useState<'splash' | 'exit' | 'login'>('splash')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('exit'), 2800)
    const t2 = setTimeout(() => setPhase('login'), 3500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#07080d', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Blurred classroom background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(10px) brightness(0.18) saturate(0.5)',
        transform: 'scale(1.1)',
      }} />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(160deg, rgba(7,8,13,0.7) 0%, rgba(7,8,13,0.93) 100%)',
      }} />

      {/* Letterbox bars */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        height: phase === 'splash' ? 60 : 0, background: '#000',
        transition: 'height 1s cubic-bezier(0.4,0,0.2,1)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        height: phase === 'splash' ? 60 : 0, background: '#000',
        transition: 'height 1s cubic-bezier(0.4,0,0.2,1)',
      }} />

      {/* Splash logo */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 20,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        opacity: phase === 'splash' ? 1 : 0,
        transform: phase !== 'splash' ? 'scale(1.06)' : 'scale(1)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 65%)',
          borderRadius: '50%',
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative', zIndex: 2 }}>
          {/* Hex logo */}
          <div style={{
            width: 84, height: 84,
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            filter: 'drop-shadow(0 0 28px rgba(59,130,246,0.55))',
          }}>
            <div style={{
              position: 'absolute', inset: 4, background: 'rgba(5,6,11,0.9)',
              clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
            }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[20, 28, 15].map((w, i) => (
                <span key={i} style={{
                  display: 'block', height: 2.5, width: w,
                  background: 'linear-gradient(90deg, #60a5fa, #3b82f6)', borderRadius: 2,
                }} />
              ))}
            </div>
          </div>

          {/* Wordmark */}
          <div style={{
            fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em',
            display: 'flex', alignItems: 'baseline', gap: 2,
            filter: 'drop-shadow(0 0 40px rgba(59,130,246,0.25))',
          }}>
            <span style={{ color: '#f1f5f9' }}>Class</span>
            <span style={{ color: '#3b82f6' }}>Flow</span>
            <span style={{
              fontSize: 13, fontWeight: 500, color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.4)', borderRadius: 5,
              padding: '3px 9px', marginLeft: 10,
              background: 'rgba(59,130,246,0.1)', alignSelf: 'center',
              letterSpacing: '0.1em',
            }}>AI</span>
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: 11, color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 300,
          }}>Teach without limits</p>

          {/* Progress bar */}
          <div style={{
            width: 160, height: 1.5, background: 'rgba(255,255,255,0.06)',
            borderRadius: 1, overflow: 'hidden', marginTop: 8,
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #1d4ed8, #60a5fa)',
              animation: 'loadBar 2.6s cubic-bezier(0.4,0,0.6,1) forwards',
            }} />
          </div>
        </div>
      </div>

      {/* Clerk Sign In */}
      <div style={{
        position: 'relative', zIndex: 10,
        opacity: phase === 'login' ? 1 : 0,
        transform: phase === 'login' ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: phase === 'login' ? 'all' : 'none',
      }}>
        <SignIn
          forceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#2563eb',
              colorBackground: 'rgba(8,10,18,0.96)',
              colorText: '#f1f5f9',
              colorTextSecondary: '#64748b',
              colorInputBackground: 'rgba(255,255,255,0.05)',
              colorInputText: '#f1f5f9',
              colorNeutral: '#334155',
              borderRadius: '12px',
              fontSize: '14px',
            },
            elements: {
              card: {
                border: '0.5px solid rgba(59,130,246,0.2)',
                boxShadow: '0 0 80px rgba(37,99,235,0.1), 0 24px 48px rgba(0,0,0,0.6)',
              },
              headerTitle: { color: '#f1f5f9', fontWeight: '700' },
              headerSubtitle: { color: '#64748b' },
              formButtonPrimary: { background: '#2563eb' },
              footerActionLink: { color: '#60a5fa' },
              formFieldLabel: { color: '#64748b' },
            },
          }}
        />
      </div>

      <style>{`
        @keyframes loadBar {
          0% { width: 0% } 15% { width: 10% }
          50% { width: 55% } 80% { width: 82% } 100% { width: 100% }
        }
      `}</style>
    </div>
  )
}