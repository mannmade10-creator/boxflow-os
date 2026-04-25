'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/* ── Tokens ── */
const C = {
  bg: '#070F18', panel: '#0B1826', card: '#0D1E2F',
  border: '#152840', borderH: '#1E3D5C',
  teal: '#14D2C2', tealD: '#0A6E68',
  green: '#22D3A5', amber: '#FB923C',
  red: '#F43F5E', yellow: '#FBBF24',
  dim: '#4A7090', txt: '#C8DDE9', white: '#EEF6FB',
  D: "'Outfit',sans-serif", M: "'Geist Mono',monospace",
};

/* ── Global styles injected safely client-side ── */
function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-thumb { background: #1E3A50; border-radius: 4px; }
      @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
      .sensor-card { animation: fadeUp .4s ease both; transition: border-color .3s, box-shadow .3s; }
      .sensor-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.4) !important; }
      .hist-row { transition: background .12s; }
      .hist-row:hover { background: rgba(20,210,194,.04) !important; }
      .filter-btn { transition: all .15s; cursor: pointer; }
      .filter-btn:hover { border-color: rgba(20,210,194,.4) !important; color: #14D2C2 !important; }
      .add-btn { transition: all .15s; cursor: pointer; }
      .add-btn:hover { background: rgba(20,210,194,.14) !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);
  return null;
}

/* ── Sensor config ── */
const SENSORS = [
  { name:'fridge-1',    label:'Fridge Unit 1',    icon:'🧊', min:20,  max:60,  lo:35,  hi:46, unit:'°F', type:'refrigerator' },
  { name:'fridge-2',    label:'Fridge Unit 2',    icon:'🧊', min:20,  max:60,  lo:35,  hi:46, unit:'°F', type:'refrigerator' },
  { name:'vaccine',     label:'Vaccine Storage',  icon:'💉', min:20,  max:60,  lo:35,  hi:46, unit:'°F', type:'refrigerator' },
  { name:'freezer-1',   label:'Freezer Unit 1',   icon:'❄️', min:-30, max:20,  lo:-13, hi:5,  unit:'°F', type:'freezer'      },
  { name:'room-1',      label:'Room Zone 1',      icon:'🏠', min:50,  max:90,  lo:60,  hi:75, unit:'°F', type:'room'         },
  { name:'cleanroom-a', label:'Cleanroom A',      icon:'🔬', min:50,  max:85,  lo:60,  hi:70, unit:'°F', type:'cleanroom'    },
];

const FILTERS = [
  { key:'all',          label:'All Sensors'   },
  { key:'refrigerator', label:'Refrigerators' },
  { key:'freezer',      label:'Freezers'      },
  { key:'room',         label:'Room Zones'    },
  { key:'cleanroom',    label:'Cleanrooms'    },
];

/* ── Helpers ── */
const statusOf = (v, lo, hi) => v < lo ? 'LOW' : v > hi ? 'HIGH' : 'OK';
const colorOf  = (st) => st === 'OK' ? C.green : st === 'LOW' ? C.amber : C.red;

/* ── Atoms ── */
const Dot = ({ color, sz=7 }) => (
  <span style={{ display:'inline-block', width:sz, height:sz, borderRadius:'50%', background:color, boxShadow:`0 0 7px ${color}`, animation:'pulseDot 2.2s ease-in-out infinite', flexShrink:0 }} />
);

const Pill = ({ label, color }) => (
  <span style={{ fontSize:9.5, fontFamily:C.M, letterSpacing:.8, color, background:`${color}18`, border:`1px solid ${color}38`, borderRadius:5, padding:'2px 7px', whiteSpace:'nowrap', flexShrink:0 }}>
    {label}
  </span>
);

/* ── Sparkline ── */
const Spark = ({ data, color, W=160, H=38 }) => {
  if (!data || data.length < 2) return <svg width={W} height={H} />;
  const vals = data.map(d => d.value);
  const mn=Math.min(...vals), mx=Math.max(...vals), rng=mx-mn||1;
  const pts = vals.map((v,i) => `${(i/(vals.length-1))*W},${H-3-((v-mn)/rng)*(H-6)}`).join(' ');
  const id = `sp${Math.random().toString(36).slice(2,7)}`;
  return (
    <svg width={W} height={H} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${id})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

/* ── Gauge bar ── */
const GaugeBar = ({ value, min, max, lo, hi, color }) => {
  const pct = Math.min(100, Math.max(0, ((value-min)/(max-min))*100));
  const lp  = ((lo-min)/(max-min))*100;
  const hp  = ((hi-min)/(max-min))*100;
  return (
    <div style={{ position:'relative', height:6, background:'#060E16', borderRadius:3, marginBottom:8 }}>
      <div style={{ position:'absolute', left:`${lp}%`, width:`${hp-lp}%`, height:'100%', background:`${C.green}20`, borderRadius:3 }} />
      <div style={{ position:'absolute', left:0, width:`${pct}%`, height:'100%', background:`linear-gradient(90deg,${C.tealD},${color})`, borderRadius:3, transition:'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
      <div style={{ position:'absolute', left:`${pct}%`, top:'50%', transform:'translate(-50%,-50%)', width:12, height:12, borderRadius:'50%', background:color, boxShadow:`0 0 10px ${color}`, border:'2px solid #060E16', transition:'left 1.2s cubic-bezier(.4,0,.2,1)' }} />
    </div>
  );
};

/* ── Add Reading Modal ── */
const AddModal = ({ onClose, onSave }) => {
  const [sensorName, setSensorName] = useState('fridge-1');
  const [value,      setValue]      = useState('');
  const [saving,     setSaving]     = useState(false);
  const [err,        setErr]        = useState('');

  const save = async () => {
    if (!value) { setErr('Please enter a temperature value.'); return; }
    setSaving(true);
    setErr('');
    const { error } = await supabase.from('medflow_sensor_readings').insert({
      sensor_name: sensorName,
      sensor_type: 'temperature',
      value: parseFloat(value),
      unit: '°F',
    });
    setSaving(false);
    if (error) { setErr(error.message); }
    else { onSave(); onClose(); }
  };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(4,10,18,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(4px)' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.panel, border:`1px solid ${C.borderH}`, borderRadius:16, padding:'28px 30px', maxWidth:400, width:'92%', boxShadow:'0 30px 80px rgba(0,0,0,.6)' }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:C.D, marginBottom:5 }}>Log Sensor Reading</div>
        <div style={{ fontSize:11, color:C.dim, fontFamily:C.M, marginBottom:22 }}>Manually add a temperature reading to Supabase</div>

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6 }}>SENSOR</div>
          <select value={sensorName} onChange={e=>setSensorName(e.target.value)}
            style={{ width:'100%', background:'#060E16', border:`1px solid ${C.borderH}`, borderRadius:8, color:C.txt, fontSize:12, padding:'8px 10px', fontFamily:C.M, outline:'none' }}>
            {SENSORS.map(s=><option key={s.name} value={s.name}>{s.label}</option>)}
          </select>
        </div>

        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6 }}>TEMPERATURE (°F)</div>
          <input type="number" value={value} onChange={e=>setValue(e.target.value)} placeholder="e.g. 38.5"
            style={{ width:'100%', background:'#060E16', border:`1px solid ${C.borderH}`, borderRadius:8, color:C.white, fontSize:16, padding:'10px 12px', fontFamily:C.M, outline:'none', fontWeight:700 }} />
          {err && <div style={{ fontSize:11, color:C.red, fontFamily:C.M, marginTop:6 }}>{err}</div>}
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, border:'none', borderRadius:9, color:'#fff', fontSize:13, fontWeight:700, padding:'12px', cursor:'pointer', fontFamily:C.D, opacity: saving ? .7 : 1 }}>
            {saving ? 'Saving...' : 'Save Reading'}
          </button>
          <button onClick={onClose} style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, color:C.dim, fontSize:13, padding:'12px', cursor:'pointer', fontFamily:C.M }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function TemperaturePage() {
  const [readings,   setReadings]   = useState({});
  const [history,    setHistory]    = useState([]);
  const [sparkData,  setSparkData]  = useState({});
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [filter,     setFilter]     = useState('all');
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchLatest = useCallback(async () => {
    const { data, error } = await supabase
      .from('medflow_sensor_readings')
      .select('*')
      .eq('sensor_type', 'temperature')
      .order('recorded_at', { ascending: false })
      .limit(200);

    if (error) { console.error('Supabase error:', error); setLoading(false); return; }

    const latestMap = {};
    const sparkMap  = {};
    (data || []).forEach(row => {
      if (!latestMap[row.sensor_name]) latestMap[row.sensor_name] = row;
      if (!sparkMap[row.sensor_name])  sparkMap[row.sensor_name]  = [];
      if (sparkMap[row.sensor_name].length < 20) sparkMap[row.sensor_name].push(row);
    });

    setReadings(latestMap);
    setSparkData(sparkMap);
    setHistory((data || []).slice(0, 50));
    setLastUpdate(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { fetchLatest(); }, [fetchLatest]);

  useEffect(() => {
    const channel = supabase
      .channel('medflow-temp-live')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'medflow_sensor_readings' }, () => fetchLatest())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLatest]);

  const visibleSensors = SENSORS.filter(s => filter === 'all' || s.type === filter);
  const alertCount     = SENSORS.filter(s => { const r = readings[s.name]; return r && statusOf(r.value, s.lo, s.hi) !== 'OK'; }).length;

  return (
    <>
      <GlobalStyles />
      <div style={{ height:'100vh', background:C.bg, color:C.txt, fontFamily:C.D, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:C.white, fontFamily:C.D, letterSpacing:-.3 }}>Temperature Monitoring</h1>
            <p style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:1 }}>
              {lastUpdate ? `Last updated ${lastUpdate.toLocaleTimeString('en-US',{hour12:false})}` : 'Connecting to Supabase...'}
              {' · '}{SENSORS.length} sensors configured
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            {!loading && alertCount > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.red}12`, border:`1px solid ${C.red}40`, borderRadius:9 }}>
                <Dot color={C.red} sz={6} />
                <span style={{ fontSize:11, color:C.red, fontFamily:C.M, letterSpacing:.8 }}>{alertCount} OUT OF RANGE</span>
              </div>
            )}
            {!loading && alertCount === 0 && Object.keys(readings).length > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.green}10`, border:`1px solid ${C.green}30`, borderRadius:9 }}>
                <Dot color={C.green} sz={6} />
                <span style={{ fontSize:11, color:C.green, fontFamily:C.M, letterSpacing:.8 }}>ALL IN RANGE</span>
              </div>
            )}
            <button className="add-btn" onClick={()=>setShowModal(true)}
              style={{ background:`rgba(20,210,194,.08)`, border:`1px solid ${C.teal}40`, borderRadius:9, color:C.teal, fontSize:12, fontWeight:600, padding:'8px 18px', fontFamily:C.D }}>
              + Log Reading
            </button>
          </div>
        </header>

        {/* Body */}
        <main style={{ flex:1, overflowY:'auto', padding:'22px 28px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* Filter tabs */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {FILTERS.map(f=>(
              <button key={f.key} className="filter-btn" onClick={()=>setFilter(f.key)}
                style={{ background: filter===f.key ? `${C.teal}15` : 'transparent', border:`1px solid ${filter===f.key ? C.teal+'60' : C.border}`, borderRadius:8, color: filter===f.key ? C.teal : C.dim, fontSize:11.5, fontWeight: filter===f.key ? 600 : 400, padding:'7px 14px', fontFamily:C.D }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, gap:12 }}>
              <Dot color={C.teal} />
              <span style={{ fontSize:13, color:C.dim, fontFamily:C.M }}>Connecting to Supabase...</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && Object.keys(readings).length === 0 && (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'48px 30px', textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:14 }}>🌡</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.white, fontFamily:C.D, marginBottom:8 }}>No sensor readings yet</div>
              <div style={{ fontSize:12, color:C.dim, fontFamily:C.M, marginBottom:22, maxWidth:400, margin:'0 auto 22px' }}>
                Click "Log Reading" to manually add your first temperature reading, or connect your IoT sensors to push data automatically.
              </div>
              <button className="add-btn" onClick={()=>setShowModal(true)}
                style={{ background:`rgba(20,210,194,.08)`, border:`1px solid ${C.teal}40`, borderRadius:9, color:C.teal, fontSize:13, fontWeight:600, padding:'10px 26px', fontFamily:C.D }}>
                + Log First Reading
              </button>
            </div>
          )}

          {/* Sensor cards */}
          {!loading && Object.keys(readings).length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:14 }}>
              {visibleSensors.map((sensor, i) => {
                const r   = readings[sensor.name];
                const val = r ? r.value : null;
                const st  = val !== null ? statusOf(val, sensor.lo, sensor.hi) : 'NO DATA';
                const sc  = val !== null ? colorOf(st) : C.dim;
                const sp  = sparkData[sensor.name] || [];

                return (
                  <div key={sensor.name} className="sensor-card"
                    style={{ background:C.card, border:`1px solid ${st!=='OK' && val!==null ? sc+'44' : C.border}`, borderRadius:13, padding:'18px 20px', animationDelay:`${i*55}ms` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginBottom:3 }}>{sensor.icon} {sensor.type.toUpperCase()}</div>
                        <div style={{ fontSize:14, fontWeight:600, color:C.white, fontFamily:C.D }}>{sensor.label}</div>
                      </div>
                      <Pill label={st} color={sc} />
                    </div>

                    <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:14 }}>
                      {val !== null ? (
                        <>
                          <span style={{ fontSize:42, fontWeight:800, color:sc, fontFamily:C.D, lineHeight:1 }}>{val.toFixed(1)}</span>
                          <span style={{ fontSize:14, color:C.dim, fontFamily:C.M }}>{sensor.unit}</span>
                        </>
                      ) : (
                        <span style={{ fontSize:18, color:C.dim, fontFamily:C.M }}>— No data yet</span>
                      )}
                    </div>

                    {val !== null && <GaugeBar value={val} min={sensor.min} max={sensor.max} lo={sensor.lo} hi={sensor.hi} color={sc} />}

                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:sp.length>1 ? 14 : 0 }}>
                      <span style={{ fontSize:9, color:C.dim, fontFamily:C.M }}>{sensor.min}{sensor.unit}</span>
                      <span style={{ fontSize:9, color:C.green, fontFamily:C.M }}>Safe: {sensor.lo}–{sensor.hi}{sensor.unit}</span>
                      <span style={{ fontSize:9, color:C.dim, fontFamily:C.M }}>{sensor.max}{sensor.unit}</span>
                    </div>

                    {sp.length > 1 && (
                      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:1.5, marginBottom:6 }}>RECENT TREND</div>
                        <Spark data={[...sp].reverse()} color={sc} W={200} H={36} />
                      </div>
                    )}

                    {r && (
                      <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, marginTop:10 }}>
                        Updated: {new Date(r.recorded_at).toLocaleTimeString('en-US',{hour12:false})}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* History table */}
          {!loading && history.length > 0 && (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, overflow:'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:14, fontWeight:700, color:C.white, fontFamily:C.D }}>Reading History</span>
                <span style={{ fontSize:10, color:C.dim, fontFamily:C.M, letterSpacing:1.5 }}>LAST {history.length} ENTRIES</span>
              </div>
              <div style={{ display:'flex', gap:8, padding:'8px 20px', borderBottom:`1px solid ${C.border}` }}>
                {['SENSOR','VALUE','STATUS','TIMESTAMP'].map((h,i)=>(
                  <span key={h} style={{ flex: i===3 ? 1.5 : 1, fontSize:8.5, color:C.dim, letterSpacing:2, fontFamily:C.M }}>{h}</span>
                ))}
              </div>
              {history.map((row, i) => {
                const cfg = SENSORS.find(s => s.name === row.sensor_name);
                const st  = cfg ? statusOf(row.value, cfg.lo, cfg.hi) : 'UNKNOWN';
                const sc  = colorOf(st);
                return (
                  <div key={row.id} className="hist-row"
                    style={{ display:'flex', gap:8, alignItems:'center', padding:'10px 20px', borderBottom: i<history.length-1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ flex:1, fontSize:12, color:C.txt, fontFamily:C.D }}>{cfg?.label || row.sensor_name}</span>
                    <span style={{ flex:1, fontSize:13, fontWeight:700, color:sc, fontFamily:C.M }}>{row.value}{row.unit}</span>
                    <span style={{ flex:1 }}><Pill label={st} color={sc} /></span>
                    <span style={{ flex:1.5, fontSize:10.5, color:C.dim, fontFamily:C.M }}>{new Date(row.recorded_at).toLocaleString('en-US',{hour12:false})}</span>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      {showModal && <AddModal onClose={()=>setShowModal(false)} onSave={fetchLatest} />}
    </>
  );
}