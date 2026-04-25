'use client';

import { useState, useEffect } from "react";

/* ── Tokens ── */
const C = {
  bg:      "#070F18",
  panel:   "#0B1826",
  card:    "#0D1E2F",
  border:  "#152840",
  borderH: "#1E3D5C",
  teal:    "#14D2C2",
  tealD:   "#0A6E68",
  green:   "#22D3A5",
  amber:   "#FB923C",
  red:     "#F43F5E",
  yellow:  "#FBBF24",
  purple:  "#A78BFA",
  txt:     "#C8DDE9",
  dim:     "#4A7090",
  white:   "#EEF6FB",
  D:       "'Outfit',sans-serif",
  M:       "'Geist Mono',monospace",
};

/* ── Global styles injected safely client-side ── */
function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #1E3A50; border-radius: 4px; }
      @keyframes pulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.75)} }
      @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes breathGlow{ 0%,100%{box-shadow:0 0 10px rgba(20,210,194,.2)} 50%{box-shadow:0 0 24px rgba(20,210,194,.55)} }
      @keyframes critBorder{ 0%,100%{border-color:rgba(244,63,94,.25)} 50%{border-color:rgba(244,63,94,.65)} }
      .nav-lnk { display:flex;align-items:center;gap:10px;padding:9px 13px;border-radius:9px;cursor:pointer;font-size:13px;font-family:'Outfit',sans-serif;font-weight:500;color:#4A7090;border-left:2px solid transparent;transition:all .17s;white-space:nowrap; }
      .nav-lnk:hover  { color:#14D2C2; background:rgba(20,210,194,.07); }
      .nav-lnk.active { color:#14D2C2; background:rgba(20,210,194,.09); border-left-color:#14D2C2; }
      .kpi { animation:fadeUp .4s ease both; transition:transform .2s,box-shadow .2s; }
      .kpi:hover { transform:translateY(-3px); }
      .act-btn { flex-shrink:0;background:transparent;border:1px solid #1E3A50;border-radius:7px;color:#14D2C2;font-size:10.5px;font-family:'Geist Mono',monospace;padding:5px 10px;cursor:pointer;white-space:nowrap;transition:all .15s; }
      .act-btn:hover { background:rgba(20,210,194,.1);border-color:rgba(20,210,194,.45); }
      .alert-row { transition:background .14s; }
      .alert-row:hover { background:rgba(255,255,255,.02) !important; }
      .del-card { transition:border-color .25s; }
      .del-card:hover { border-color:rgba(20,210,194,.3) !important; }
      .modal-act { background:transparent;border:1px solid #1A3448;border-radius:9px;color:#C8DDE9;font-size:12px;font-family:'Outfit',sans-serif;font-weight:500;padding:11px 14px;cursor:pointer;text-align:left;transition:all .15s; }
      .modal-act:hover { background:rgba(20,210,194,.07);border-color:rgba(20,210,194,.4);color:#14D2C2; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);
  return null;
}

/* ── Hooks ── */
const useTick = (base, v, ms = 3200) => {
  const [val, set] = useState(base);
  useEffect(() => {
    const id = setInterval(() => set(+(base + (Math.random() - .5) * v).toFixed(1)), ms);
    return () => clearInterval(id);
  }, []);
  return val;
};

const useClock = () => {
  const [t, set] = useState(new Date());
  useEffect(() => { const id = setInterval(() => set(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
};

/* ── Atoms ── */
const Dot = ({ color, sz = 7 }) => (
  <span style={{ display:"inline-block", width:sz, height:sz, borderRadius:"50%", background:color, boxShadow:`0 0 7px ${color}`, animation:"pulseDot 2.2s ease-in-out infinite", flexShrink:0 }} />
);

const Pill = ({ label, color }) => (
  <span style={{ fontSize:9.5, fontFamily:C.M, fontWeight:500, letterSpacing:.8, color, background:`${color}18`, border:`1px solid ${color}38`, borderRadius:5, padding:"2px 7px", whiteSpace:"nowrap", flexShrink:0 }}>
    {label}
  </span>
);

/* ── KPI Card ── */
const Kpi = ({ label, value, unit, sub, color, icon, delay=0, crit=false }) => (
  <div className="kpi" style={{ background:C.card, border:`1px solid ${crit ? color+"50" : C.border}`, borderRadius:14, padding:"20px 18px 16px", animationDelay:`${delay}ms`, position:"relative", overflow:"visible", animation: crit ? "critBorder 2.5s infinite" : "fadeUp .4s ease both" }}>
    <div style={{ position:"absolute", top:-16, right:-16, width:80, height:80, borderRadius:"50%", background:color, opacity:.04, filter:"blur(20px)", pointerEvents:"none" }} />
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
      <span style={{ fontSize:10, color:C.dim, letterSpacing:2, textTransform:"uppercase", fontFamily:C.M, lineHeight:1.4 }}>{label}</span>
      <span style={{ fontSize:20, flexShrink:0, marginLeft:8 }}>{icon}</span>
    </div>
    <div style={{ display:"flex", alignItems:"baseline", gap:5, flexWrap:"wrap", marginBottom:5 }}>
      <span style={{ fontSize:34, fontWeight:800, color, fontFamily:C.D, lineHeight:1 }}>{value}</span>
      {unit && <span style={{ fontSize:12, color:C.dim, fontFamily:C.M }}>{unit}</span>}
    </div>
    <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, lineHeight:1.5 }}>{sub}</div>
  </div>
);

/* ── Temp Gauge ── */
const Gauge = ({ label, temp, min, max, lo, hi, unit="°F" }) => {
  const pct  = Math.min(100, Math.max(0, ((temp-min)/(max-min))*100));
  const lpct = ((lo-min)/(max-min))*100;
  const hpct = ((hi-min)/(max-min))*100;
  const st   = temp < lo ? "LOW" : temp > hi ? "HIGH" : "OK";
  const sc   = st === "OK" ? C.green : C.red;
  return (
    <div style={{ background:C.card, borderRadius:12, padding:"15px 16px", border:`1px solid ${st!=="OK" ? C.red+"40" : C.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9, gap:8 }}>
        <span style={{ fontSize:12, color:C.txt, fontFamily:C.D, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{label}</span>
        <Pill label={st} color={sc} />
      </div>
      <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:11 }}>
        <span style={{ fontSize:28, fontWeight:800, color:sc, fontFamily:C.D, lineHeight:1 }}>{temp}</span>
        <span style={{ fontSize:11, color:C.dim, fontFamily:C.M }}>{unit}</span>
      </div>
      <div style={{ position:"relative", height:5, background:"#060E16", borderRadius:3, marginBottom:7 }}>
        <div style={{ position:"absolute", left:`${lpct}%`, width:`${hpct-lpct}%`, height:"100%", background:`${C.green}20`, borderRadius:3 }} />
        <div style={{ position:"absolute", left:0, width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${C.tealD},${sc})`, borderRadius:3, transition:"width 1.2s cubic-bezier(.4,0,.2,1)" }} />
        <div style={{ position:"absolute", left:`${pct}%`, top:"50%", transform:"translate(-50%,-50%)", width:10, height:10, borderRadius:"50%", background:sc, boxShadow:`0 0 8px ${sc}`, border:"2px solid #060E16", transition:"left 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:9, color:C.dim, fontFamily:C.M }}>{min}{unit}</span>
        <span style={{ fontSize:9, color:C.green, fontFamily:C.M }}>Safe {lo}–{hi}{unit}</span>
        <span style={{ fontSize:9, color:C.dim, fontFamily:C.M }}>{max}{unit}</span>
      </div>
    </div>
  );
};

/* ── Sparkline ── */
const Spark = ({ data, color }) => {
  const W=90, H=28;
  const mn=Math.min(...data), mx=Math.max(...data), rng=mx-mn||1;
  const pts = data.map((v,i) => `${(i/(data.length-1))*W},${H-3-((v-mn)/rng)*(H-6)}`).join(" ");
  const gid = `g${Math.random().toString(36).slice(2,7)}`;
  return (
    <svg width={W} height={H} style={{ overflow:"visible", flexShrink:0 }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${H} ${pts} ${W},${H}`} fill={`url(#${gid})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const mkSpark = (b, n=14) => Array.from({length:n},(_,i) => +(b+Math.sin(i*.9)*3+(Math.random()-.5)*2).toFixed(1));

const FACILITIES = ["Central Pharmacy","North Hospital Wing","Compounding Lab","Cold Storage B"];

/* ════════════════════════════════════════
   ROOT
════════════════════════════════════════ */
export default function MedFlowDashboard() {
  const clock = useClock();
  const [modal, setModal] = useState(null);
  const [fac,   setFac]   = useState(0);

  const f1  = useTick(36.8, 2.4);
  const f2  = useTick(37.5, 2.8);
  const vax = useTick(39.2, 1.6);
  const frz = useTick(-4.1, 3.2);
  const rm  = useTick(68.4, 3.6);
  const clr = useTick(64.8, 2.0);

  const ALERTS = [
    { level:"CRITICAL", msg:"Freezer Unit 2 — temp spike +12°F",          loc:"Compounding Lab",   time:"2m ago",  color:C.red    },
    { level:"WARNING",  msg:"Vaccine fridge door open > 3 min",            loc:"Central Pharmacy", time:"9m ago",  color:C.amber  },
    { level:"WARNING",  msg:"Lot #A291 — 14 units expire in 7 days",       loc:"Inventory",        time:"22m ago", color:C.yellow },
    { level:"INFO",     msg:"Cold chain #DC-0042 arrived safely",          loc:"North Wing",       time:"41m ago", color:C.teal   },
    { level:"INFO",     msg:"USP <797> cleaning log submitted",            loc:"Cleanroom A",      time:"1hr ago", color:C.teal   },
  ];

  const DELIVERIES = [
    { id:"DC-0043", dest:"North Hospital Wing", status:"IN TRANSIT", temp:"38°F", eta:"14 min", color:C.green  },
    { id:"DC-0044", dest:"Clinic 7 — Vaccines", status:"LOADING",    temp:"—",    eta:"32 min", color:C.yellow },
    { id:"DC-0045", dest:"ER Meds — URGENT",    status:"DISPATCHED", temp:"35°F", eta:"6 min",  color:C.amber  },
  ];

  const COMPLIANCE = [
    { label:"USP <797>",        score:94, color:C.green  },
    { label:"USP <800>",        score:88, color:C.teal   },
    { label:"FDA Drug Safety",  score:97, color:C.green  },
    { label:"Joint Commission", score:81, color:C.yellow },
  ];

  const INVENTORY = [
    { name:"Insulin (Refrigerated)",    qty:142, cap:200, color:C.teal,   spark:mkSpark(142) },
    { name:"Amoxicillin 500mg",         qty:87,  cap:300, color:C.green,  spark:mkSpark(87)  },
    { name:"Morphine 10mg (CII)",       qty:23,  cap:50,  color:C.yellow, spark:mkSpark(23)  },
    { name:"Epinephrine Auto-Injector", qty:9,   cap:30,  color:C.red,    spark:mkSpark(9)   },
  ];

  return (
    <>
      <GlobalStyles />
      <div style={{ display:"flex", height:"100vh", background:C.bg, color:C.txt, fontFamily:C.D, overflow:"hidden" }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

          {/* Header */}
          <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 24px", borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
            <div style={{ minWidth:0 }}>
              <h1 style={{ fontSize:20, fontWeight:800, color:C.white, fontFamily:C.D, letterSpacing:-.3, whiteSpace:"nowrap" }}>Command Center</h1>
              <p style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, letterSpacing:.5, marginTop:1 }}>{FACILITIES[fac]} · Live overview</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
              <select value={fac} onChange={e=>setFac(+e.target.value)} style={{ background:"#060E16", border:`1px solid ${C.borderH}`, borderRadius:8, color:C.teal, fontSize:11, padding:"6px 10px", fontFamily:C.M, cursor:"pointer", outline:"none" }}>
                {FACILITIES.map((f,i)=><option key={i} value={i}>{f}</option>)}
              </select>
              <div style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 14px", background:C.card, border:`1px solid ${C.border}`, borderRadius:9, whiteSpace:"nowrap" }}>
                <Dot color={C.green} sz={6} />
                <span style={{ fontSize:10.5, color:C.green, fontFamily:C.M, letterSpacing:.8 }}>ALL SYSTEMS NOMINAL</span>
              </div>
              <div style={{ fontSize:12.5, color:C.dim, fontFamily:C.M, letterSpacing:1, whiteSpace:"nowrap" }}>
                {clock.toLocaleTimeString("en-US",{hour12:false})}
              </div>
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:C.card, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:16 }}>🔔</div>
                <div style={{ position:"absolute", top:-3, right:-3, width:15, height:15, borderRadius:"50%", background:C.red, fontSize:9, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontFamily:C.M }}>3</div>
              </div>
            </div>
          </header>

          {/* Body */}
          <main style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:20 }}>

            {/* KPIs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12 }}>
              <Kpi label="Active Alerts"    value="3"  unit=""      sub="2 critical · 1 warning" color={C.red}    icon="🚨" delay={0}   crit />
              <Kpi label="Sensors Online"   value="24" unit="/ 26"  sub="2 offline · maint. due" color={C.teal}   icon="📡" delay={60}  />
              <Kpi label="Expiring Soon"    value="14" unit="units" sub="Within next 7 days"     color={C.yellow} icon="💊" delay={120} />
              <Kpi label="Compliance Score" value="91" unit="%"     sub="Across all modules"     color={C.green}  icon="✅" delay={180} />
            </div>

            {/* Temp gauges */}
            <section>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <span style={{ fontSize:9.5, color:C.dim, letterSpacing:2.5, textTransform:"uppercase", fontFamily:C.M, whiteSpace:"nowrap" }}>Live Temperature Monitoring</span>
                <div style={{ flex:1, height:1, background:C.border }} />
                <Dot color={C.teal} sz={6} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,minmax(0,1fr))", gap:11 }}>
                <Gauge label="Fridge Unit 1"   temp={f1}  min={20}  max={60} lo={35} hi={46} />
                <Gauge label="Fridge Unit 2"   temp={f2}  min={20}  max={60} lo={35} hi={46} />
                <Gauge label="Vaccine Storage" temp={vax} min={20}  max={60} lo={35} hi={46} />
                <Gauge label="Freezer Unit 1"  temp={frz} min={-30} max={20} lo={-13} hi={5} />
                <Gauge label="Room Zone 1"     temp={rm}  min={50}  max={90} lo={60} hi={75} />
                <Gauge label="Cleanroom A"     temp={clr} min={50}  max={85} lo={60} hi={70} />
              </div>
            </section>

            {/* Alerts + Deliveries */}
            <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 320px", gap:16 }}>

              {/* Alerts */}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, overflow:"hidden", minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 18px", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:13.5, fontWeight:700, color:C.white, fontFamily:C.D }}>Active Alerts</span>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <Dot color={C.red} sz={6} />
                    <span style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:1.5 }}>LIVE</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, padding:"7px 18px", borderBottom:`1px solid ${C.border}` }}>
                  {["Level","Message","Location","Time",""].map(h=>(
                    <span key={h} style={{ ...(h==="Message"?{flex:1,minWidth:0}:h===""?{width:60,flexShrink:0}:{width:h==="Level"?72:h==="Location"?110:55,flexShrink:0}), fontSize:8.5, color:C.dim, letterSpacing:1.8, fontFamily:C.M, textTransform:"uppercase" }}>{h}</span>
                  ))}
                </div>
                {ALERTS.map((a,i)=>(
                  <div key={i} className="alert-row" style={{ display:"flex", gap:8, alignItems:"center", padding:"11px 18px", borderBottom: i<ALERTS.length-1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ width:72, flexShrink:0, display:"flex", alignItems:"center", gap:5 }}>
                      <Dot color={a.color} sz={6} />
                      <span style={{ fontSize:9.5, color:a.color, fontFamily:C.M, fontWeight:500, letterSpacing:.5 }}>{a.level}</span>
                    </div>
                    <span style={{ flex:1, minWidth:0, fontSize:11.5, color:C.txt, fontFamily:C.D, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.msg}</span>
                    <span style={{ width:110, flexShrink:0, fontSize:10, color:C.dim, fontFamily:C.M, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.loc}</span>
                    <span style={{ width:55, flexShrink:0, fontSize:10, color:C.dim, fontFamily:C.M, whiteSpace:"nowrap" }}>{a.time}</span>
                    <button className="act-btn" style={{ width:60, flexShrink:0 }} onClick={()=>setModal(a)}>ACT →</button>
                  </div>
                ))}
              </div>

              {/* Deliveries */}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, overflow:"hidden" }}>
                <div style={{ padding:"13px 18px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:C.white, fontFamily:C.D, marginBottom:2 }}>Cold Chain Fleet</div>
                  <div style={{ fontSize:10, color:C.dim, fontFamily:C.M }}>{DELIVERIES.length} active deliveries</div>
                </div>
                <div style={{ padding:12, display:"flex", flexDirection:"column", gap:10 }}>
                  {DELIVERIES.map((d,i)=>(
                    <div key={i} className="del-card" style={{ background:C.panel, border:`1px solid ${d.color}28`, borderRadius:10, padding:"13px 15px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:7, gap:8 }}>
                        <span style={{ fontSize:12, color:d.color, fontWeight:700, fontFamily:C.M, whiteSpace:"nowrap" }}>#{d.id}</span>
                        <Pill label={d.status} color={d.color} />
                      </div>
                      <div style={{ fontSize:12, color:C.txt, fontFamily:C.D, marginBottom:8, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.dest}</div>
                      <div style={{ display:"flex", gap:16 }}>
                        <div>
                          <div style={{ fontSize:8.5, color:C.dim, fontFamily:C.M, letterSpacing:1, marginBottom:2 }}>TEMP</div>
                          <div style={{ fontSize:11.5, color:C.txt, fontFamily:C.M }}>{d.temp}</div>
                        </div>
                        <div>
                          <div style={{ fontSize:8.5, color:C.dim, fontFamily:C.M, letterSpacing:1, marginBottom:2 }}>ETA</div>
                          <div style={{ fontSize:11.5, color:C.teal, fontFamily:C.M }}>{d.eta}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance + Inventory */}
            <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)", gap:16 }}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, padding:"18px 20px" }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:C.white, fontFamily:C.D, marginBottom:16 }}>Compliance Scores</div>
                <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                  {COMPLIANCE.map((c,i)=>(
                    <div key={i}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <span style={{ fontSize:12.5, color:C.txt, fontFamily:C.D }}>{c.label}</span>
                        <span style={{ fontSize:13, color:c.color, fontWeight:700, fontFamily:C.M, flexShrink:0, marginLeft:8 }}>{c.score}%</span>
                      </div>
                      <div style={{ height:5, background:"#060E16", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:`${c.score}%`, height:"100%", background:`linear-gradient(90deg,${C.tealD},${c.color})`, borderRadius:3 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, padding:"18px 20px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <span style={{ fontSize:13.5, fontWeight:700, color:C.white, fontFamily:C.D }}>Inventory Snapshot</span>
                  <span style={{ fontSize:9.5, color:C.teal, fontFamily:C.M, letterSpacing:1, cursor:"pointer", flexShrink:0, marginLeft:8 }}>VIEW ALL →</span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
                  {INVENTORY.map((item,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, color:C.txt, fontFamily:C.D, marginBottom:5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                        <div style={{ height:4, background:"#060E16", borderRadius:2, overflow:"hidden" }}>
                          <div style={{ width:`${(item.qty/item.cap)*100}%`, height:"100%", background:item.color, borderRadius:2, opacity:.85 }} />
                        </div>
                      </div>
                      <div style={{ textAlign:"right", flexShrink:0, minWidth:42 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:item.color, fontFamily:C.M }}>{item.qty}</div>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M }}>/{item.cap}</div>
                      </div>
                      <Spark data={item.spark} color={item.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </main>
        </div>

        {/* Modal */}
        {modal && (
          <div onClick={()=>setModal(null)} style={{ position:"fixed", inset:0, background:"rgba(4,10,18,.88)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:999, backdropFilter:"blur(5px)" }}>
            <div onClick={e=>e.stopPropagation()} style={{ background:C.panel, border:`1px solid ${C.borderH}`, borderRadius:18, padding:"28px 30px", maxWidth:450, width:"92%", boxShadow:"0 30px 80px rgba(0,0,0,.65)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
                <Dot color={modal.color} />
                <span style={{ fontSize:10, color:modal.color, fontFamily:C.M, letterSpacing:2, fontWeight:500 }}>{modal.level}</span>
              </div>
              <h2 style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:C.D, marginBottom:7, lineHeight:1.35 }}>{modal.msg}</h2>
              <p style={{ fontSize:11.5, color:C.dim, fontFamily:C.M, marginBottom:24 }}>{modal.loc} · {modal.time}</p>
              <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:11 }}>RECOMMENDED ACTIONS</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {["🔒 Quarantine Product","👤 Assign Technician","📄 Generate Report","📣 Notify Pharmacist"].map(a=>(
                  <button key={a} className="modal-act">{a}</button>
                ))}
              </div>
              <button onClick={()=>setModal(null)} style={{ width:"100%", background:"transparent", border:`1px solid ${C.border}`, borderRadius:9, color:C.dim, fontSize:11.5, padding:"10px", cursor:"pointer", fontFamily:C.M, letterSpacing:1 }}>DISMISS</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}