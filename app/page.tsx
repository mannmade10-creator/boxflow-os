'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PLATFORMS = [
  {
    id: 'boxflow', name: 'BoxFlow', suffix: 'OS',
    tagline: 'Logistics & Fleet Command',
    desc: 'Real-time dispatch, fleet tracking and operational analytics.',
    color: '#2563EB', glow: 'rgba(37,99,235,0.5)', login: '/boxflow',
    icon: <svg viewBox="0 0 44 44" fill="none" width="44" height="44">
      <rect x="4" y="14" width="24" height="18" rx="3" stroke="#2563EB" strokeWidth="1.8" fill="rgba(37,99,235,0.1)" />
      <path d="M28 20h7l5 7v5H28V20z" stroke="#2563EB" strokeWidth="1.8" fill="rgba(37,99,235,0.1)" strokeLinejoin="round" />
      <circle cx="11" cy="34" r="3.5" stroke="#2563EB" strokeWidth="1.8" fill="#04080F" />
      <circle cx="33" cy="34" r="3.5" stroke="#2563EB" strokeWidth="1.8" fill="#04080F" />
      <line x1="4" y1="23" x2="28" y2="23" stroke="#2563EB" strokeWidth="1" opacity="0.4" />
    </svg>,
  },
  {
    id: 'medflow', name: 'MedFlow', suffix: 'OS',
    tagline: 'Pharmacy Command Center',
    desc: 'Temperature monitoring, drug inventory and USP compliance.',
    color: '#14D2C2', glow: 'rgba(20,210,194,0.5)', login: '/medflow-splash',
    icon: <svg viewBox="0 0 44 44" fill="none" width="44" height="44">
      <polygon points="22,4 38,13 38,31 22,40 6,31 6,13" stroke="#14D2C2" strokeWidth="1.8" fill="rgba(20,210,194,0.07)" />
      <rect x="17" y="12" width="10" height="20" rx="2.5" stroke="#14D2C2" strokeWidth="1.6" fill="rgba(20,210,194,0.12)" />
      <rect x="12" y="17" width="20" height="10" rx="2.5" stroke="#14D2C2" strokeWidth="1.6" fill="rgba(20,210,194,0.12)" />
      <circle cx="22" cy="22" r="3.5" fill="#14D2C2" />
    </svg>,
  },
  {
    id: 'propflow', name: 'PropFlow', suffix: 'OS',
    tagline: 'Real Estate Operations',
    desc: 'Property management, tenant tracking and financial reporting.',
    color: '#F59E0B', glow: 'rgba(245,158,11,0.5)', login: '/propflow',
    icon: <svg viewBox="0 0 44 44" fill="none" width="44" height="44">
      <path d="M22 5L4 18h5v19h12V26h2v11h12V18h5L22 5z" stroke="#F59E0B" strokeWidth="1.8" fill="rgba(245,158,11,0.07)" strokeLinejoin="round" />
      <rect x="18" y="26" width="8" height="11" rx="1.5" stroke="#F59E0B" strokeWidth="1.4" fill="rgba(245,158,11,0.12)" />
      <rect x="8" y="23" width="7" height="6" rx="1" stroke="#F59E0B" strokeWidth="1.2" fill="rgba(245,158,11,0.08)" opacity="0.8" />
      <rect x="29" y="23" width="7" height="6" rx="1" stroke="#F59E0B" strokeWidth="1.2" fill="rgba(245,158,11,0.08)" opacity="0.8" />
    </svg>,
  },
  {
    id: 'classflow', name: 'ClassFlow', suffix: 'AI',
    tagline: 'Intelligent Learning Platform',
    desc: 'AI-powered curriculum design and adaptive learning pathways.',
    color: '#A78BFA', glow: 'rgba(167,139,250,0.5)', login: '/classflow-login',
    icon: <svg viewBox="0 0 44 44" fill="none" width="44" height="44">
      <circle cx="22" cy="15" r="9" stroke="#A78BFA" strokeWidth="1.8" fill="rgba(167,139,250,0.07)" />
      <path d="M8 38c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="22" cy="15" r="3.5" fill="#A78BFA" />
      <path d="M29 8l3-3M15 8l-3-3M22 6V3" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>,
  },
];

export default function PlatformHub() {
  const router = useRouter();
  const [screen,        setScreen]        = useState('splash');
  const [splashOpacity, setSplashOpacity] = useState(0);
  const [cardsOpacity,  setCardsOpacity]  = useState(0);
  const [selectedId,    setSelectedId]    = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [hoveredId,     setHoveredId]     = useState(null);

  useEffect(() => {
    const t0 = setTimeout(() => setSplashOpacity(1), 50);
    const t1 = setTimeout(() => setSplashOpacity(0), 2800);
    const t2 = setTimeout(() => {
      setScreen('cards');
      setTimeout(() => setCardsOpacity(1), 50);
    }, 3500);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const selectPlatform = (p) => {
    if (transitioning) return;
    setSelectedId(p.id);
    setTransitioning(true);
    setTimeout(() => router.push(p.login), 1000);
  };

  const selected = PLATFORMS.find(p => p.id === selectedId);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html, body, #__next { height:100%; background:#000; font-family:'Outfit',sans-serif; }

        @keyframes rot-cw  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
        @keyframes rot-ccw { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
        @keyframes pulse-c { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes textIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tspin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .ring-a { animation: rot-cw  12s linear infinite; transform-origin: 50% 50%; }
        .ring-b { animation: rot-ccw  7s linear infinite; transform-origin: 50% 50%; }
        .ring-c { animation: rot-cw   4s linear infinite; transform-origin: 50% 50%; }
        .core-p { animation: pulse-c 2.5s ease-in-out infinite; }

        .pcard { flex:1; min-width:220px; max-width:255px; background:#070F18; border:1px solid rgba(255,255,255,0.06); border-radius:18px; padding:26px 22px; cursor:pointer; position:relative; overflow:hidden; transition:transform 0.2s ease,border-color 0.2s ease,box-shadow 0.2s ease; animation:cardIn 0.6s ease both; }
        .pcard:hover { transform:translateY(-6px); }
        .pcard.gone  { transform:scale(0.93); opacity:0.4; pointer-events:none; }
        .pcard-glow  { position:absolute; inset:0; border-radius:18px; opacity:0; transition:opacity 0.3s ease; pointer-events:none; }
        .pcard:hover .pcard-glow { opacity:1; }
        .pcard-top   { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px; position:relative; z-index:1; }
        .pcard-icon  { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); }
        .pcard-arrow { font-size:18px; color:#1A3450; transition:all 0.2s; position:relative; z-index:1; }
        .pcard:hover .pcard-arrow { color:#EEF6FB; transform:translate(3px,-3px); }
        .pcard-name   { font-size:23px; font-weight:800; letter-spacing:-0.5px; line-height:1; margin-bottom:4px; transition:color 0.2s; position:relative; z-index:1; }
        .pcard-suffix { font-weight:300; font-size:17px; opacity:0.35; }
        .pcard-tag    { font-size:9.5px; letter-spacing:2px; font-family:'Geist Mono',monospace; text-transform:uppercase; margin-bottom:12px; transition:color 0.2s; position:relative; z-index:1; }
        .pcard-desc   { font-size:12px; color:#2E5470; line-height:1.65; position:relative; z-index:1; }
        .pcard-foot   { display:flex; align-items:center; gap:8px; margin-top:20px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.04); position:relative; z-index:1; }
        .pcard-dot    { width:6px; height:6px; border-radius:50%; }
        .pcard-status { font-size:9px; letter-spacing:1.5px; font-family:'Geist Mono',monospace; text-transform:uppercase; }

        .sel-grid { position:fixed; inset:0; pointer-events:none; background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px); background-size:80px 80px; }
        .corner { position:fixed; width:30px; height:30px; opacity:0.15; pointer-events:none; }
        .c-tl { top:20px; left:20px; border-top:1px solid #14D2C2; border-left:1px solid #14D2C2; }
        .c-tr { top:20px; right:20px; border-top:1px solid #14D2C2; border-right:1px solid #14D2C2; }
        .c-bl { bottom:20px; left:20px; border-bottom:1px solid #14D2C2; border-left:1px solid #14D2C2; }
        .c-br { bottom:20px; right:20px; border-bottom:1px solid #14D2C2; border-right:1px solid #14D2C2; }

        .t-overlay { position:fixed; inset:0; z-index:200; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity 0.5s ease; }
        .t-overlay.on { opacity:1; pointer-events:all; }
        .t-inner { display:flex; flex-direction:column; align-items:center; gap:18px; opacity:0; transform:scale(0.85); transition:opacity 0.45s ease 0.1s,transform 0.45s ease 0.1s; }
        .t-overlay.on .t-inner { opacity:1; transform:scale(1); }
        .t-spinner { width:50px; height:50px; border-radius:50%; border:2px solid rgba(255,255,255,0.07); border-top-color:currentColor; animation:tspin 0.8s linear infinite; }
        .t-label { font-size:10px; letter-spacing:3.5px; font-family:'Geist Mono',monospace; text-transform:uppercase; color:#2E5470; }
        .t-name  { font-size:34px; font-weight:900; letter-spacing:-1.2px; }

        .hub-foot { position:fixed; bottom:22px; left:50%; transform:translateX(-50%); font-size:9px; letter-spacing:2.5px; color:#0D1B28; font-family:'Geist Mono',monospace; white-space:nowrap; z-index:5; }
      `}</style>

      {screen === 'splash' && (
        <div style={{ position:'fixed', inset:0, zIndex:100, background:'#000', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:28, opacity:splashOpacity, transition:'opacity 0.7s ease' }}>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', zIndex:1, opacity:0.6 }}>
            <svg viewBox="0 0 400 400" fill="none" width="580" height="580">
              <g className="ring-a" style={{ transformOrigin:'200px 200px' }}>
                <circle cx="200" cy="200" r="190" stroke="rgba(20,210,194,0.12)" strokeWidth="1" strokeDasharray="8 14" />
                <circle cx="200" cy="200" r="190" stroke="rgba(20,210,194,0.65)" strokeWidth="2" strokeDasharray="60 1130" strokeLinecap="round" />
              </g>
              <g className="ring-b" style={{ transformOrigin:'200px 200px' }}>
                <circle cx="200" cy="200" r="155" stroke="rgba(37,99,235,0.1)" strokeWidth="1" strokeDasharray="5 12" />
                <circle cx="200" cy="200" r="155" stroke="rgba(37,99,235,0.6)" strokeWidth="1.5" strokeDasharray="40 930" strokeLinecap="round" />
              </g>
              <g className="ring-c" style={{ transformOrigin:'200px 200px' }}>
                <circle cx="200" cy="200" r="115" stroke="rgba(167,139,250,0.12)" strokeWidth="1" strokeDasharray="4 10" />
                <circle cx="200" cy="200" r="115" stroke="rgba(167,139,250,0.6)" strokeWidth="1.5" strokeDasharray="25 697" strokeLinecap="round" />
              </g>
              <polygon points="200,80 280,130 280,230 200,280 120,230 120,130" fill="rgba(20,210,194,0.03)" stroke="rgba(20,210,194,0.15)" strokeWidth="1.5" />
              <rect x="185" y="115" width="30" height="90" rx="6" fill="rgba(20,210,194,0.06)" stroke="rgba(20,210,194,0.25)" strokeWidth="1.5" />
              <rect x="155" y="145" width="90" height="30" rx="6" fill="rgba(20,210,194,0.06)" stroke="rgba(20,210,194,0.25)" strokeWidth="1.5" />
              <circle cx="200" cy="200" className="core-p" r="12" fill="rgba(20,210,194,0.5)" />
              <circle cx="200" cy="200" r="6" fill="rgba(20,210,194,0.9)" />
              {[[200,80],[280,130],[280,230],[200,280],[120,230],[120,130]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r="5" fill={i%2===0?'rgba(20,210,194,0.8)':'rgba(167,139,250,0.8)'} />
              ))}
              <circle cx="200" cy="200" r="70" fill="url(#sg2)" opacity="0.2" />
              <defs>
                <radialGradient id="sg2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#14D2C2" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#14D2C2" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:10, textAlign:'center' }}>
            <div style={{ fontSize:11, letterSpacing:5, color:'#2E5470', fontFamily:"'Geist Mono',monospace", textTransform:'uppercase', animation:'textIn 0.8s ease 0.5s both' }}>Made Technologies Inc</div>
            <div style={{ fontSize:54, fontWeight:900, letterSpacing:'-2.5px', color:'#EEF6FB', lineHeight:1, animation:'textIn 0.8s ease 0.7s both' }}>Made<span style={{ color:'#14D2C2' }}>Tech</span></div>
            <div style={{ fontSize:10, letterSpacing:4, color:'#1E3A50', fontFamily:"'Geist Mono',monospace", textTransform:'uppercase', animation:'textIn 0.8s ease 0.9s both' }}>Enterprise Software Suite</div>
            <div style={{ display:'flex', gap:22, marginTop:10, animation:'textIn 0.8s ease 1.1s both' }}>
              {PLATFORMS.map(p => (
                <div key={p.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:p.color, boxShadow:`0 0 10px ${p.color}` }} />
                  <div style={{ fontSize:8, letterSpacing:2, color:'#1A3448', fontFamily:"'Geist Mono',monospace", textTransform:'uppercase' }}>{p.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === 'cards' && (
        <div style={{ width:'100%', minHeight:'100vh', background:'#04080F', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 32px', opacity:cardsOpacity, transition:'opacity 0.8s ease' }}>
          <div className="sel-grid" />
          <div className="corner c-tl" />
          <div className="corner c-tr" />
          <div className="corner c-bl" />
          <div className="corner c-br" />
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <div style={{ fontSize:'9.5px', letterSpacing:4, color:'#1E3A50', fontFamily:"'Geist Mono',monospace", textTransform:'uppercase', marginBottom:14 }}>Made Technologies Inc · Select Your Platform</div>
            <h1 style={{ fontSize:38, fontWeight:900, letterSpacing:'-1.8px', color:'#EEF6FB', lineHeight:1, marginBottom:10 }}>Choose your <span style={{ color:'#14D2C2' }}>workspace</span></h1>
            <p style={{ fontSize:13, color:'#2E5470', maxWidth:460, margin:'0 auto', lineHeight:1.65 }}>Each platform requires an active subscription. Select the software you want to access to continue to login.</p>
          </div>
          <div style={{ display:'flex', gap:16, width:'100%', maxWidth:1080, flexWrap:'wrap', justifyContent:'center' }}>
            {PLATFORMS.map((p, i) => (
              <div key={p.id} className={`pcard${selectedId===p.id?' gone':''}`}
                style={{ borderColor:hoveredId===p.id?p.color+'55':'rgba(255,255,255,0.06)', boxShadow:hoveredId===p.id?`0 20px 60px ${p.glow}, 0 0 0 1px ${p.color}33`:'none', animationDelay:`${i*90}ms` }}
                onClick={() => selectPlatform(p)}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}>
                <div className="pcard-glow" style={{ background:`radial-gradient(ellipse at top right, ${p.glow} 0%, transparent 65%)` }} />
                <div className="pcard-top">
                  <div className="pcard-icon">{p.icon}</div>
                  <div className="pcard-arrow">↗</div>
                </div>
                <div className="pcard-name" style={{ color:hoveredId===p.id?p.color:'#EEF6FB' }}>{p.name}<span className="pcard-suffix">{p.suffix}</span></div>
                <div className="pcard-tag" style={{ color:hoveredId===p.id?p.color:'#1E3A50' }}>{p.tagline}</div>
                <div className="pcard-desc">{p.desc}</div>
                <div className="pcard-foot">
                  <div className="pcard-dot" style={{ background:p.color, boxShadow:`0 0 6px ${p.color}` }} />
                  <span className="pcard-status" style={{ color:p.color }}>Subscription Required</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`t-overlay${transitioning?' on':''}`} style={{ background:selected?`radial-gradient(ellipse at center,${selected.glow} 0%,rgba(2,4,8,0.98) 55%)`:'rgba(2,4,8,0.98)' }}>
        {selected && (
          <div className="t-inner">
            <div className="t-label">Launching</div>
            <div className="t-name" style={{ color:selected.color }}>{selected.name}<span style={{ opacity:.3, fontWeight:300 }}>{selected.suffix}</span></div>
            <div className="t-spinner" style={{ color:selected.color }} />
            <div className="t-label" style={{ marginTop:4 }}>Verifying subscription access...</div>
          </div>
        )}
      </div>

      <div className="hub-foot">Made Technologies Inc · Enterprise Suite · v2026.1</div>
    </>
  );
}


