'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MedFlowSplash() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1800);
    const t4 = setTimeout(() => router.push('/login'), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [router]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&family=Geist+Mono:wght@300;400&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body { background: #04080F; }

        .splash {
          width: 100vw; height: 100vh;
          background: radial-gradient(ellipse at 50% 40%, #071828 0%, #04080F 70%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif;
          overflow: hidden; position: relative;
        }

        /* Grid background */
        .grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(20,210,194,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,210,194,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .grid-bg.show { opacity: 1; }

        /* Glow orbs */
        .orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
          transition: opacity 1.5s ease;
          opacity: 0;
        }
        .orb.show { opacity: 1; }
        .orb-1 { width: 400px; height: 400px; background: rgba(20,210,194,0.08); top: -100px; left: -100px; }
        .orb-2 { width: 300px; height: 300px; background: rgba(167,139,250,0.06); bottom: -80px; right: -80px; }
        .orb-3 { width: 200px; height: 200px; background: rgba(20,210,194,0.05); top: 50%; left: 50%; transform: translate(-50%,-50%); }

        /* Logo container */
        .logo-wrap {
          display: flex; flex-direction: column; align-items: center; gap: 32px;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .logo-wrap.show { opacity: 1; transform: translateY(0); }

        /* SVG Logo mark */
        .logo-mark {
          width: 88px; height: 88px;
          filter: drop-shadow(0 0 24px rgba(20,210,194,0.4));
          transform: scale(0.8);
          transition: transform 0.8s cubic-bezier(0.34,1.56,0.64,1), filter 0.8s ease;
        }
        .logo-mark.show {
          transform: scale(1);
          filter: drop-shadow(0 0 40px rgba(20,210,194,0.6));
        }

        /* Logo ring animation */
        @keyframes rotate-ring { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rotate-ring-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes pulse-core { 0%,100% { opacity:.8; r:12; } 50% { opacity:1; r:14; } }
        @keyframes dash-flow {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }

        .ring-outer { animation: rotate-ring 8s linear infinite; transform-origin: 44px 44px; }
        .ring-inner { animation: rotate-ring-rev 5s linear infinite; transform-origin: 44px 44px; }
        .core-pulse { animation: pulse-core 2s ease-in-out infinite; }

        /* Wordmark */
        .wordmark {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s;
        }
        .wordmark.show { opacity: 1; transform: translateY(0); }

        .name {
          font-size: 48px; font-weight: 900; letter-spacing: -2px;
          color: #EEF6FB; line-height: 1;
        }
        .name span { color: #14D2C2; }

        .tagline {
          font-size: 11px; letter-spacing: 4px; color: #4A7090;
          font-family: 'Geist Mono', monospace; text-transform: uppercase;
        }

        /* Subtitle */
        .subtitle {
          font-size: 14px; color: #3D6480; letter-spacing: 1px;
          font-family: 'Geist Mono', monospace;
          opacity: 0; transition: opacity 0.6s ease 0.2s;
        }
        .subtitle.show { opacity: 1; }

        /* Loading bar */
        .bar-wrap {
          width: 200px; height: 1px;
          background: rgba(20,210,194,0.1);
          border-radius: 2px; overflow: hidden;
          opacity: 0; transition: opacity 0.4s ease;
          margin-top: 8px;
        }
        .bar-wrap.show { opacity: 1; }

        .bar-fill {
          height: 100%; width: 0%;
          background: linear-gradient(90deg, #0A6E68, #14D2C2);
          border-radius: 2px;
          transition: width 2s cubic-bezier(0.4,0,0.2,1);
        }
        .bar-fill.go { width: 100%; }

        /* Fade out */
        .splash.fadeout {
          opacity: 0; transition: opacity 0.4s ease;
        }

        /* Corner accents */
        .corner {
          position: absolute; width: 40px; height: 40px;
          opacity: 0; transition: opacity 0.8s ease 0.5s;
        }
        .corner.show { opacity: 1; }
        .corner-tl { top: 32px; left: 32px; border-top: 1px solid rgba(20,210,194,0.3); border-left: 1px solid rgba(20,210,194,0.3); }
        .corner-tr { top: 32px; right: 32px; border-top: 1px solid rgba(20,210,194,0.3); border-right: 1px solid rgba(20,210,194,0.3); }
        .corner-bl { bottom: 32px; left: 32px; border-bottom: 1px solid rgba(20,210,194,0.3); border-left: 1px solid rgba(20,210,194,0.3); }
        .corner-br { bottom: 32px; right: 32px; border-bottom: 1px solid rgba(20,210,194,0.3); border-right: 1px solid rgba(20,210,194,0.3); }

        /* Version tag */
        .version {
          position: absolute; bottom: 48px;
          font-size: 10px; color: #1E3A50;
          font-family: 'Geist Mono', monospace; letter-spacing: 2px;
          opacity: 0; transition: opacity 0.6s ease 0.8s;
        }
        .version.show { opacity: 1; }
      `}</style>

      <div className={`splash ${phase >= 3 ? 'fadeout' : ''}`}>

        {/* Background elements */}
        <div className={`grid-bg ${phase >= 1 ? 'show' : ''}`} />
        <div className={`orb orb-1 ${phase >= 1 ? 'show' : ''}`} />
        <div className={`orb orb-2 ${phase >= 1 ? 'show' : ''}`} />
        <div className={`orb orb-3 ${phase >= 1 ? 'show' : ''}`} />

        {/* Corner accents */}
        <div className={`corner corner-tl ${phase >= 1 ? 'show' : ''}`} />
        <div className={`corner corner-tr ${phase >= 1 ? 'show' : ''}`} />
        <div className={`corner corner-bl ${phase >= 1 ? 'show' : ''}`} />
        <div className={`corner corner-br ${phase >= 1 ? 'show' : ''}`} />

        {/* Main logo */}
        <div className={`logo-wrap ${phase >= 1 ? 'show' : ''}`}>

          {/* SVG Logo Mark */}
          <svg className={`logo-mark ${phase >= 1 ? 'show' : ''}`} viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer ring with dashes */}
            <g className="ring-outer">
              <circle cx="44" cy="44" r="40" stroke="rgba(20,210,194,0.2)" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="44" cy="44" r="40" stroke="rgba(20,210,194,0.6)" strokeWidth="1.5" strokeDasharray="20 220" strokeLinecap="round" />
            </g>

            {/* Inner ring */}
            <g className="ring-inner">
              <circle cx="44" cy="44" r="32" stroke="rgba(167,139,250,0.15)" strokeWidth="1" strokeDasharray="3 8" />
              <circle cx="44" cy="44" r="32" stroke="rgba(167,139,250,0.5)" strokeWidth="1" strokeDasharray="12 180" strokeLinecap="round" />
            </g>

            {/* Hexagon */}
            <polygon points="44,14 64,26 64,50 44,62 24,50 24,26"
              fill="rgba(20,210,194,0.06)"
              stroke="rgba(20,210,194,0.35)"
              strokeWidth="1.5" />

            {/* Cross / medical symbol */}
            <rect x="39" y="26" width="10" height="28" rx="2" fill="rgba(20,210,194,0.15)" stroke="#14D2C2" strokeWidth="1.5" />
            <rect x="30" y="35" width="28" height="10" rx="2" fill="rgba(20,210,194,0.15)" stroke="#14D2C2" strokeWidth="1.5" />

            {/* Center core */}
            <circle cx="44" cy="44" r="5" fill="#14D2C2" className="core-pulse" />
            <circle cx="44" cy="44" r="3" fill="#EEF6FB" />

            {/* Corner dots */}
            <circle cx="44" cy="14" r="2.5" fill="#14D2C2" opacity="0.7" />
            <circle cx="64" cy="26" r="2" fill="#A78BFA" opacity="0.7" />
            <circle cx="64" cy="50" r="2" fill="#A78BFA" opacity="0.7" />
            <circle cx="44" cy="62" r="2.5" fill="#14D2C2" opacity="0.7" />
            <circle cx="24" cy="50" r="2" fill="#A78BFA" opacity="0.7" />
            <circle cx="24" cy="26" r="2" fill="#A78BFA" opacity="0.7" />

            {/* Glow */}
            <circle cx="44" cy="44" r="20" fill="url(#glow)" opacity="0.3" />
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#14D2C2" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#14D2C2" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* Wordmark */}
          <div className={`wordmark ${phase >= 1 ? 'show' : ''}`}>
            <div className="name">Med<span>Flow</span><span style={{ color:'#A78BFA', fontSize:32, fontWeight:300 }}>OS</span></div>
            <div className="tagline">Pharmacy Command Center</div>
          </div>
        </div>

        {/* Subtitle + loader */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginTop:48 }}>
          <div className={`subtitle ${phase >= 2 ? 'show' : ''}`}>
            Initializing secure pharmacy environment...
          </div>
          <div className={`bar-wrap ${phase >= 2 ? 'show' : ''}`}>
            <div className={`bar-fill ${phase >= 2 ? 'go' : ''}`} />
          </div>
        </div>

        {/* Version */}
        <div className={`version ${phase >= 2 ? 'show' : ''}`}>
          v1.0.0 · HIPAA COMPLIANT · USP &lt;797&gt; / &lt;800&gt;
        </div>

      </div>
    </>
  );
}