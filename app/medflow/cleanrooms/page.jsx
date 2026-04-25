'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#070F18', panel: '#0B1826', card: '#0D1E2F',
  border: '#152840', borderH: '#1E3D5C',
  teal: '#14D2C2', tealD: '#0A6E68',
  green: '#22D3A5', amber: '#FB923C',
  red: '#F43F5E', yellow: '#FBBF24',
  purple: '#A78BFA', dim: '#4A7090',
  txt: '#C8DDE9', white: '#EEF6FB',
  D: "'Outfit',sans-serif", M: "'Geist Mono',monospace",
};

function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar{width:4px}
      ::-webkit-scrollbar-thumb{background:#1E3A50;border-radius:4px}
      @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
      @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(400px)}}
      .room-card{animation:fadeUp .4s ease both;transition:border-color .2s,box-shadow .2s}
      .room-card:hover{box-shadow:0 8px 28px rgba(0,0,0,.4)!important}
      .act-btn{transition:all .15s;cursor:pointer}
      .act-btn:hover{background:rgba(20,210,194,.12)!important;border-color:rgba(20,210,194,.5)!important}
      .check-row{transition:background .12s}
      .check-row:hover{background:rgba(20,210,194,.04)!important}
    `;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(link); document.head.removeChild(style); } catch(e) {} };
  }, []);
  return null;
}

const Dot = ({ color, sz }) => (
  <span style={{ display:'inline-block', width:sz||7, height:sz||7, borderRadius:'50%', background:color, boxShadow:`0 0 7px ${color}`, animation:'pulseDot 2.2s ease-in-out infinite', flexShrink:0 }} />
);

const Pill = ({ label, color }) => (
  <span style={{ fontSize:9.5, fontFamily:C.M, letterSpacing:.8, color, background:`${color}18`, border:`1px solid ${color}38`, borderRadius:5, padding:'2px 7px', whiteSpace:'nowrap', flexShrink:0 }}>
    {label}
  </span>
);

const useTick = (base, v, ms = 4000) => {
  const [val, set] = useState(base);
  useEffect(() => {
    const id = setInterval(() => set(+(base + (Math.random()-.5)*v).toFixed(1)), ms);
    return () => clearInterval(id);
  }, []);
  return val;
};

/* Live cleanroom data */
const ROOMS = [
  {
    id: 'iso5-a',
    name: 'ISO 5 — Cleanroom A',
    type: 'ISO Class 5',
    standard: 'USP <797>',
    baseTemp: 65.2, tempV: 1.8, tempLo: 60, tempHi: 70,
    baseHumidity: 42, humV: 3, humLo: 30, humHi: 50,
    basePressure: 0.05, pressV: 0.01, pressLo: 0.02, pressHi: 0.10,
    color: C.teal,
  },
  {
    id: 'iso5-b',
    name: 'ISO 5 — Cleanroom B',
    type: 'ISO Class 5',
    standard: 'USP <797>',
    baseTemp: 64.8, tempV: 2.0, tempLo: 60, tempHi: 70,
    baseHumidity: 45, humV: 4, humLo: 30, humHi: 50,
    basePressure: 0.06, pressV: 0.01, pressLo: 0.02, pressHi: 0.10,
    color: C.teal,
  },
  {
    id: 'iso7',
    name: 'ISO 7 — Ante Room',
    type: 'ISO Class 7',
    standard: 'USP <797>',
    baseTemp: 68.1, tempV: 2.5, tempLo: 60, tempHi: 75,
    baseHumidity: 50, humV: 5, humLo: 30, humHi: 60,
    basePressure: 0.03, pressV: 0.01, pressLo: 0.01, pressHi: 0.05,
    color: C.purple,
  },
  {
    id: 'hazardous',
    name: 'Hazardous Drug Room',
    type: 'ISO Class 7',
    standard: 'USP <800>',
    baseTemp: 66.5, tempV: 1.5, tempLo: 60, tempHi: 72,
    baseHumidity: 40, humV: 3, humLo: 30, humHi: 50,
    basePressure: -0.03, pressV: 0.01, pressLo: -0.05, pressHi: -0.01,
    color: C.red,
  },
];

const CHECKLISTS = [
  'Cleanroom gowning verification complete',
  'HEPA filter integrity confirmed',
  'Differential pressure within range',
  'Particle count within ISO limits',
  'Surface disinfection completed',
  'Personnel training records current',
  'Environmental sampling scheduled',
  'Temperature and humidity logged',
];

function GaugeBar({ value, min, max, lo, hi, color, unit }) {
  const pct = Math.min(100, Math.max(0, ((value-min)/(max-min))*100));
  const lp  = ((lo-min)/(max-min))*100;
  const hp  = ((hi-min)/(max-min))*100;
  const ok  = value >= lo && value <= hi;
  const sc  = ok ? C.green : C.red;
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontSize:11, color:C.txt, fontFamily:C.M, fontWeight:600 }}>{value}{unit}</span>
        <Pill label={ok?'IN RANGE':'OUT OF RANGE'} color={sc} />
      </div>
      <div style={{ position:'relative', height:5, background:'#060E16', borderRadius:3, marginBottom:4 }}>
        <div style={{ position:'absolute', left:`${lp}%`, width:`${hp-lp}%`, height:'100%', background:`${C.green}20`, borderRadius:3 }} />
        <div style={{ position:'absolute', left:0, width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.tealD},${sc})`, borderRadius:3, transition:'width 1.5s ease' }} />
        <div style={{ position:'absolute', left:`${pct}%`, top:'50%', transform:'translate(-50%,-50%)', width:10, height:10, borderRadius:'50%', background:sc, boxShadow:`0 0 8px ${sc}`, border:'2px solid #060E16', transition:'left 1.5s ease' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:8.5, color:C.dim, fontFamily:C.M }}>{min}{unit}</span>
        <span style={{ fontSize:8.5, color:C.green, fontFamily:C.M }}>Safe {lo}–{hi}{unit}</span>
        <span style={{ fontSize:8.5, color:C.dim, fontFamily:C.M }}>{max}{unit}</span>
      </div>
    </div>
  );
}

function RoomCard({ room, idx }) {
  const temp     = useTick(room.baseTemp, room.tempV);
  const humidity = useTick(room.baseHumidity, room.humV);
  const pressure = useTick(room.basePressure, room.pressV, 5000);

  const tempOk  = temp >= room.tempLo && temp <= room.tempHi;
  const humOk   = humidity >= room.humLo && humidity <= room.humHi;
  const pressOk = pressure >= room.pressLo && pressure <= room.pressHi;
  const allOk   = tempOk && humOk && pressOk;

  return (
    <div className="room-card" style={{ background:C.card, border:`1px solid ${allOk?room.color+'30':C.red+'50'}`, borderRadius:14, padding:'20px 22px', animationDelay:`${idx*60}ms` }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:10, color:room.color, fontFamily:C.M, letterSpacing:2, marginBottom:4 }}>{room.type} · {room.standard}</div>
          <div style={{ fontSize:15, fontWeight:700, color:C.white, fontFamily:C.D }}>{room.name}</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5 }}>
          <Dot color={allOk?C.green:C.red} sz={8} />
          <span style={{ fontSize:9, color:allOk?C.green:C.red, fontFamily:C.M, letterSpacing:1 }}>{allOk?'NOMINAL':'ALERT'}</span>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div>
          <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6 }}>TEMPERATURE</div>
          <GaugeBar value={temp} min={50} max={85} lo={room.tempLo} hi={room.tempHi} unit="°F" color={room.color} />
        </div>
        <div>
          <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6 }}>HUMIDITY</div>
          <GaugeBar value={humidity} min={20} max={70} lo={room.humLo} hi={room.humHi} unit="%" color={room.color} />
        </div>
        <div>
          <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6 }}>DIFFERENTIAL PRESSURE</div>
          <GaugeBar value={pressure} min={-0.1} max={0.15} lo={room.pressLo} hi={room.pressHi} unit=" inWC" color={room.color} />
        </div>
      </div>

      <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:10, color:C.dim, fontFamily:C.M }}>Live monitoring active</span>
        <Dot color={C.teal} sz={5} />
      </div>
    </div>
  );
}

export default function CleanroomsPage() {
  const [checks,    setChecks]    = useState(CHECKLISTS.map(() => false));
  const [lastCheck, setLastCheck] = useState(null);
  const clock = new Date().toLocaleTimeString('en-US', { hour12:false });

  const toggle = (i) => {
    setChecks(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
    setLastCheck(new Date().toLocaleTimeString('en-US', { hour12:false }));
  };

  const checksDone = checks.filter(Boolean).length;
  const checkRate  = Math.round((checksDone / checks.length) * 100);

  return (
    <>
      <GlobalStyles />
      <div style={{ height:'100vh', background:C.bg, color:C.txt, fontFamily:C.D, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:C.white, letterSpacing:-.3, margin:0 }}>Cleanrooms</h1>
            <p style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:1, marginBottom:0 }}>
              {ROOMS.length} rooms monitored · USP &lt;797&gt; / &lt;800&gt; · Live sensors
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.green}10`, border:`1px solid ${C.green}30`, borderRadius:9 }}>
              <Dot color={C.green} sz={6} />
              <span style={{ fontSize:11, color:C.green, fontFamily:C.M, letterSpacing:.8 }}>ALL ROOMS LIVE</span>
            </div>
            <div style={{ fontSize:12, color:C.dim, fontFamily:C.M }}>
              {new Date().toLocaleTimeString('en-US', { hour12:false })}
            </div>
          </div>
        </header>

        <main style={{ flex:1, overflowY:'auto', padding:'22px 28px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:12 }}>
            {[
              { label:'Rooms Monitored', value:ROOMS.length,  color:C.teal,   icon:'🔬' },
              { label:'ISO Class 5',     value:2,             color:C.teal,   icon:'⬡'  },
              { label:'ISO Class 7',     value:2,             color:C.purple, icon:'⬡'  },
              { label:'Daily Checks',    value:`${checkRate}%`, color:checkRate===100?C.green:C.amber, icon:'✅' },
            ].map((k,i) => (
              <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'16px 18px', animation:'fadeUp .4s ease both', animationDelay:`${i*50}ms` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:9.5, color:C.dim, letterSpacing:2, fontFamily:C.M, textTransform:'uppercase' }}>{k.label}</span>
                  <span style={{ fontSize:18 }}>{k.icon}</span>
                </div>
                <span style={{ fontSize:30, fontWeight:800, color:k.color, fontFamily:C.D, lineHeight:1 }}>{k.value}</span>
              </div>
            ))}
          </div>

          {/* Room cards */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
              <span style={{ fontSize:9.5, color:C.dim, letterSpacing:2.5, textTransform:'uppercase', fontFamily:C.M, whiteSpace:'nowrap' }}>Live Environmental Monitoring</span>
              <div style={{ flex:1, height:1, background:C.border }} />
              <Dot color={C.teal} sz={6} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:14 }}>
              {ROOMS.map((room, i) => <RoomCard key={room.id} room={room} idx={i} />)}
            </div>
          </div>

          {/* Daily checklist */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.white, fontFamily:C.D }}>Daily Compliance Checklist</div>
                <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:2 }}>USP &lt;797&gt; / &lt;800&gt; · {checksDone}/{checks.length} complete</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:80, height:5, background:'#060E16', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ width:`${checkRate}%`, height:'100%', background:`linear-gradient(90deg,${C.tealD},${checkRate===100?C.green:C.teal})`, borderRadius:3, transition:'width .4s ease' }} />
                </div>
                <span style={{ fontSize:12, color:checkRate===100?C.green:C.teal, fontFamily:C.M, fontWeight:600 }}>{checkRate}%</span>
              </div>
            </div>

            <div style={{ padding:'8px 0' }}>
              {CHECKLISTS.map((item, i) => (
                <div key={i} className="check-row" onClick={() => toggle(i)}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 20px', cursor:'pointer', borderBottom:i<CHECKLISTS.length-1?`1px solid ${C.border}`:'none' }}>
                  <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${checks[i]?C.green:C.dim}`, background:checks[i]?`${C.green}20`:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .15s' }}>
                    {checks[i] && <span style={{ fontSize:12, color:C.green }}>✓</span>}
                  </div>
                  <span style={{ fontSize:12.5, color:checks[i]?C.white:C.txt, fontFamily:C.D, textDecoration:checks[i]?'none':'none' }}>{item}</span>
                  {checks[i] && <span style={{ marginLeft:'auto', fontSize:10, color:C.dim, fontFamily:C.M }}>✓ verified</span>}
                </div>
              ))}
            </div>

            {checksDone === checks.length && (
              <div style={{ padding:'14px 20px', borderTop:`1px solid ${C.border}`, background:`${C.green}08`, display:'flex', alignItems:'center', gap:10 }}>
                <Dot color={C.green} sz={6} />
                <span style={{ fontSize:12, color:C.green, fontFamily:C.M, letterSpacing:.8 }}>ALL CHECKS COMPLETE — CLEANROOMS FULLY COMPLIANT</span>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
}