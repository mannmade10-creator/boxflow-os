'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

/* ── Tokens ── */
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

/* ── Global styles ── */
function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);

    const mapboxCss = document.createElement('link');
    mapboxCss.rel = 'stylesheet';
    mapboxCss.href = 'https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css';
    document.head.appendChild(mapboxCss);

    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-thumb { background: #1E3A50; border-radius: 4px; }
      @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
      @keyframes emergencyPulse { 0%,100%{box-shadow:0 0 0 0 rgba(244,63,94,.4)} 50%{box-shadow:0 0 0 8px rgba(244,63,94,0)} }
      .del-card { animation: fadeUp .4s ease both; transition: border-color .2s, box-shadow .2s; cursor: pointer; }
      .del-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.4) !important; }
      .del-card.emergency { animation: emergencyPulse 2s infinite; }
      .act-btn { transition: all .15s; cursor: pointer; }
      .act-btn:hover { background: rgba(20,210,194,.12) !important; border-color: rgba(20,210,194,.5) !important; }
      .status-tab { transition: all .15s; cursor: pointer; }
      .status-tab:hover { color: #14D2C2 !important; }
      .mapboxgl-popup-content { background: #0D1E2F !important; border: 1px solid #1E3D5C !important; border-radius: 10px !important; padding: 12px 16px !important; color: #C8DDE9 !important; font-family: 'Geist Mono', monospace !important; box-shadow: 0 8px 32px rgba(0,0,0,.6) !important; }
      .mapboxgl-popup-tip { border-top-color: #1E3D5C !important; }
      .mapboxgl-ctrl-group { background: #0D1E2F !important; border: 1px solid #152840 !important; }
      .mapboxgl-ctrl-group button { background: #0D1E2F !important; }
      .mapboxgl-ctrl-group button:hover { background: #152840 !important; }
      .mapboxgl-ctrl-icon { filter: invert(1) !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(mapboxCss);
      document.head.removeChild(style);
    };
  }, []);
  return null;
}

/* ── Atoms ── */
const Dot = ({ color, sz=7 }) => (
  <span style={{ display:'inline-block', width:sz, height:sz, borderRadius:'50%', background:color, boxShadow:`0 0 7px ${color}`, animation:'pulseDot 2.2s ease-in-out infinite', flexShrink:0 }} />
);

const Pill = ({ label, color }) => (
  <span style={{ fontSize:9.5, fontFamily:C.M, letterSpacing:.8, color, background:`${color}18`, border:`1px solid ${color}38`, borderRadius:5, padding:'2px 7px', whiteSpace:'nowrap', flexShrink:0 }}>
    {label}
  </span>
);

/* ── Helpers ── */
const statusColor = (s) => ({
  'LOADING':    C.yellow,
  'DISPATCHED': C.teal,
  'IN TRANSIT': C.green,
  'ARRIVED':    C.purple,
  'FAILED':     C.red,
}[s] || C.dim);

const priorityColor = (p) => ({
  'NORMAL':    C.dim,
  'URGENT':    C.amber,
  'EMERGENCY': C.red,
}[p] || C.dim);

const tempStatus = (t) => {
  if (t === null || t === undefined) return { color:C.dim,   label:'—'            };
  if (t < 33 || t > 46)             return { color:C.red,   label:'OUT OF RANGE' };
  if (t < 35 || t > 43)             return { color:C.amber, label:'BORDERLINE'   };
  return                                    { color:C.green, label:'IN RANGE'     };
};

/* ── Pharmacy location coordinates (Oklahoma City area) ── */
const LOCATIONS = {
  'Central Pharmacy':     [-97.5164, 35.4676],
  'North Hospital Wing':  [-97.5089, 35.4812],
  'Compounding Lab':      [-97.5301, 35.4623],
  'Cold Storage B':       [-97.5220, 35.4550],
  'Clinic 7 — Vaccines':  [-97.4998, 35.4734],
  'ER — St. Luke\'s':     [-97.4876, 35.4689],
  'Pediatric Ward':       [-97.5134, 35.4901],
  'Home Care Patient 12': [-97.4923, 35.4601],
};

const getCoords = (name) => {
  if (!name) return null;
  for (const [key, coords] of Object.entries(LOCATIONS)) {
    if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
      return coords;
    }
  }
  return [-97.5164 + (Math.random()-.5)*.05, 35.4676 + (Math.random()-.5)*.05];
};

/* ── Mapbox Map Component ── */
const MapboxFleetMap = ({ deliveries, selectedId, onSelectDelivery }) => {
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-97.5164, 35.4676],
        zoom: 12,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapRef.current = map;

      map.on('load', () => {
        /* ── Hub markers (pharmacies) ── */
        Object.entries(LOCATIONS).forEach(([name, coords]) => {
          const el = document.createElement('div');
          el.style.cssText = `width:14px;height:14px;border-radius:50%;background:#14D2C2;border:2px solid #14D2C2;box-shadow:0 0 12px rgba(20,210,194,.6);cursor:pointer;`;
          const popup = new mapboxgl.Popup({ offset:20, closeButton:false })
            .setHTML(`<div style="font-size:11px;color:#14D2C2;font-weight:600;">${name}</div>`);
          new mapboxgl.Marker({ element:el }).setLngLat(coords).setPopup(popup).addTo(map);
        });

        /* ── Delivery vehicle markers ── */
        deliveries.forEach(d => {
          const originCoords = getCoords(d.origin);
          const destCoords   = getCoords(d.destination);
          if (!originCoords || !destCoords) return;

          const sc = statusColor(d.status);
          const pc = priorityColor(d.priority);
          const tc = tempStatus(d.temp_reading);

          /* Vehicle position — midpoint if in transit, origin if loading */
          let pos;
          if (d.status === 'IN TRANSIT') {
            pos = [(originCoords[0]+destCoords[0])/2, (originCoords[1]+destCoords[1])/2];
          } else if (d.status === 'ARRIVED') {
            pos = destCoords;
          } else {
            pos = originCoords;
          }

          /* Route line */
          if (d.status === 'IN TRANSIT' || d.status === 'DISPATCHED') {
            const lineId = `route-${d.id}`;
            if (!map.getSource(lineId)) {
              map.addSource(lineId, {
                type:'geojson',
                data:{ type:'Feature', geometry:{ type:'LineString', coordinates:[originCoords, destCoords] } }
              });
              map.addLayer({
                id: lineId, type:'line', source:lineId,
                paint:{ 'line-color': sc, 'line-width':2, 'line-opacity':.6, 'line-dasharray': d.status==='DISPATCHED'?[2,2]:[1,0] }
              });
            }
          }

          /* Vehicle marker */
          const el = document.createElement('div');
          el.style.cssText = `
            width:32px;height:32px;border-radius:8px;
            background:${d.priority==='EMERGENCY'?'rgba(244,63,94,.2)':'rgba(13,30,47,.9)'};
            border:2px solid ${d.priority==='EMERGENCY'?C.red:sc};
            display:flex;align-items:center;justify-content:center;
            font-size:16px;cursor:pointer;
            box-shadow:${d.priority==='EMERGENCY'?'0 0 16px rgba(244,63,94,.5)':'0 2px 8px rgba(0,0,0,.4)'};
          `;
          el.innerHTML = d.status === 'ARRIVED' ? '✓' : '🚐';
          el.addEventListener('click', () => onSelectDelivery(d));

          const tempLine = d.temp_reading ? `<div style="font-size:11px;color:${tc.color};margin-top:4px;">🌡 ${d.temp_reading}°F — ${tc.label}</div>` : '';
          const etaLine  = d.eta_minutes  ? `<div style="font-size:11px;color:#14D2C2;margin-top:2px;">ETA: ${d.eta_minutes} min</div>` : '';

          const popup = new mapboxgl.Popup({ offset:20, closeButton:false }).setHTML(`
            <div>
              <div style="font-size:12px;font-weight:700;color:${sc};">#${d.delivery_code}</div>
              <div style="font-size:11px;color:#C8DDE9;margin-top:3px;">${d.origin} → ${d.destination}</div>
              <div style="font-size:10px;color:#4A7090;margin-top:2px;">${d.driver_name||'No driver'} · ${d.vehicle_id||''}</div>
              ${tempLine}${etaLine}
            </div>
          `);

          const marker = new mapboxgl.Marker({ element:el }).setLngLat(pos).setPopup(popup).addTo(map);
          markersRef.current.push(marker);
        });
      });
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [deliveries]);

  return (
    <div style={{ position:'relative', borderRadius:12, overflow:'hidden', border:`1px solid ${C.border}`, height:340 }}>
      <div ref={mapContainer} style={{ width:'100%', height:'100%' }} />
      {/* Overlay legend */}
      <div style={{ position:'absolute', bottom:12, left:12, background:'rgba(7,15,24,.92)', border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 12px', display:'flex', flexDirection:'column', gap:5, zIndex:10 }}>
        {[
          { color:C.teal,   label:'Hub / Pharmacy' },
          { color:C.green,  label:'In Transit'      },
          { color:C.teal,   label:'Dispatched'      },
          { color:C.amber,  label:'Urgent'          },
          { color:C.red,    label:'Emergency'       },
          { color:C.purple, label:'Arrived'         },
        ].map((l,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:l.color, boxShadow:`0 0 4px ${l.color}` }} />
            <span style={{ fontSize:9, color:C.dim, fontFamily:C.M }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Add Delivery Modal ── */
const AddModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    delivery_code: `DC-${Date.now().toString().slice(-4)}`,
    origin:'', destination:'', driver_name:'', vehicle_id:'',
    priority:'NORMAL', eta_minutes:'', notes:'',
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const save = async () => {
    if (!form.origin || !form.destination) { setErr('Origin and destination are required.'); return; }
    setSaving(true); setErr('');
    const { error } = await supabase.from('medflow_deliveries').insert({
      ...form, status:'LOADING',
      eta_minutes: form.eta_minutes ? parseInt(form.eta_minutes) : null,
    });
    setSaving(false);
    if (error) { setErr(error.message); }
    else { onSave(); onClose(); }
  };

  const inp = { width:'100%', background:'#060E16', border:`1px solid ${C.borderH}`, borderRadius:8, color:C.white, fontSize:13, padding:'9px 11px', fontFamily:C.M, outline:'none' };
  const lbl = { fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6, display:'block' };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(4,10,18,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(4px)' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.panel, border:`1px solid ${C.borderH}`, borderRadius:16, padding:'28px 30px', maxWidth:480, width:'95%', boxShadow:'0 30px 80px rgba(0,0,0,.6)' }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:C.D, marginBottom:5 }}>New Delivery</div>
        <div style={{ fontSize:11, color:C.dim, fontFamily:C.M, marginBottom:22 }}>Dispatch a new cold chain delivery</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          <div><label style={lbl}>DELIVERY CODE</label><input value={form.delivery_code} onChange={e=>set('delivery_code',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>PRIORITY</label><select value={form.priority} onChange={e=>set('priority',e.target.value)} style={{...inp,cursor:'pointer'}}>{['NORMAL','URGENT','EMERGENCY'].map(p=><option key={p}>{p}</option>)}</select></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>ORIGIN</label><input value={form.origin} onChange={e=>set('origin',e.target.value)} placeholder="e.g. Central Pharmacy" style={inp} /></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>DESTINATION</label><input value={form.destination} onChange={e=>set('destination',e.target.value)} placeholder="e.g. North Hospital Wing" style={inp} /></div>
          <div><label style={lbl}>DRIVER NAME</label><input value={form.driver_name} onChange={e=>set('driver_name',e.target.value)} placeholder="Full name" style={inp} /></div>
          <div><label style={lbl}>VEHICLE ID</label><input value={form.vehicle_id} onChange={e=>set('vehicle_id',e.target.value)} placeholder="e.g. VH-101" style={inp} /></div>
          <div><label style={lbl}>ETA (MINUTES)</label><input type="number" value={form.eta_minutes} onChange={e=>set('eta_minutes',e.target.value)} placeholder="0" style={inp} /></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>NOTES</label><input value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Optional notes..." style={inp} /></div>
        </div>
        {err && <div style={{ fontSize:11, color:C.red, fontFamily:C.M, marginBottom:14 }}>{err}</div>}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, border:'none', borderRadius:9, color:'#fff', fontSize:13, fontWeight:700, padding:'12px', cursor:'pointer', fontFamily:C.D, opacity:saving?.7:1 }}>
            {saving?'Dispatching...':'Dispatch Delivery'}
          </button>
          <button onClick={onClose} style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, color:C.dim, fontSize:13, padding:'12px', cursor:'pointer', fontFamily:C.M }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ── Update Status Modal ── */
const UpdateModal = ({ delivery, onClose, onSave }) => {
  const [status,      setStatus]      = useState(delivery.status);
  const [tempReading, setTempReading] = useState(delivery.temp_reading || '');
  const [saving,      setSaving]      = useState(false);

  const save = async () => {
    setSaving(true);
    const updates = { status, temp_reading: tempReading ? parseFloat(tempReading) : null };
    if (status === 'ARRIVED')    updates.arrived_at  = new Date().toISOString();
    if (status === 'DISPATCHED') updates.departed_at = new Date().toISOString();
    const { error } = await supabase.from('medflow_deliveries').update(updates).eq('id', delivery.id);
    setSaving(false);
    if (!error) { onSave(); onClose(); }
  };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(4,10,18,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(4px)' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.panel, border:`1px solid ${C.borderH}`, borderRadius:16, padding:'28px 30px', maxWidth:400, width:'92%' }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:C.D, marginBottom:5 }}>Update Delivery</div>
        <div style={{ fontSize:11, color:C.dim, fontFamily:C.M, marginBottom:22 }}>{delivery.delivery_code} · {delivery.destination}</div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6 }}>STATUS</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {['LOADING','DISPATCHED','IN TRANSIT','ARRIVED','FAILED'].map(s=>(
              <div key={s} onClick={()=>setStatus(s)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:8, border:`1px solid ${status===s?statusColor(s)+'60':C.border}`, background:status===s?`${statusColor(s)}10`:'transparent', cursor:'pointer' }}>
                <Dot color={statusColor(s)} sz={6} />
                <span style={{ fontSize:12, color:status===s?statusColor(s):C.txt, fontFamily:C.D, fontWeight:status===s?600:400 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:22 }}>
          <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6 }}>TEMPERATURE READING (°F)</div>
          <input type="number" value={tempReading} onChange={e=>setTempReading(e.target.value)} placeholder="e.g. 38.5"
            style={{ width:'100%', background:'#060E16', border:`1px solid ${C.borderH}`, borderRadius:8, color:C.white, fontSize:14, padding:'10px 12px', fontFamily:C.M, outline:'none', fontWeight:700 }} />
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, border:'none', borderRadius:9, color:'#fff', fontSize:13, fontWeight:700, padding:'12px', cursor:'pointer', fontFamily:C.D }}>
            {saving?'Saving...':'Update'}
          </button>
          <button onClick={onClose} style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, color:C.dim, fontSize:13, padding:'12px', cursor:'pointer', fontFamily:C.M }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function ColdChainPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('ALL');
  const [showAdd,    setShowAdd]    = useState(false);
  const [updateDel,  setUpdateDel]  = useState(null);
  const [selected,   setSelected]   = useState(null);

  const fetchDeliveries = useCallback(async () => {
    const { data, error } = await supabase
      .from('medflow_deliveries')
      .select('*')
      .order('created_at', { ascending:false });
    if (error) { console.error(error); setLoading(false); return; }
    setDeliveries(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDeliveries(); }, [fetchDeliveries]);

  useEffect(() => {
    const channel = supabase
      .channel('medflow-deliveries-live')
      .on('postgres_changes', { event:'*', schema:'public', table:'medflow_deliveries' }, () => fetchDeliveries())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchDeliveries]);

  const filtered = filter === 'ALL' ? deliveries : deliveries.filter(d => d.status === filter);

  const counts = {
    total:     deliveries.length,
    active:    deliveries.filter(d => ['IN TRANSIT','DISPATCHED'].includes(d.status)).length,
    emergency: deliveries.filter(d => d.priority === 'EMERGENCY').length,
    arrived:   deliveries.filter(d => d.status === 'ARRIVED').length,
    tempIssue: deliveries.filter(d => tempStatus(d.temp_reading).label === 'OUT OF RANGE').length,
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ height:'100vh', background:C.bg, color:C.txt, fontFamily:C.D, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:C.white, letterSpacing:-.3 }}>Cold Chain & Fleet</h1>
            <p style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:1 }}>{counts.active} vehicles active · Mapbox live tracking</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            {counts.emergency > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.red}12`, border:`1px solid ${C.red}40`, borderRadius:9 }}>
                <Dot color={C.red} sz={6} />
                <span style={{ fontSize:11, color:C.red, fontFamily:C.M, letterSpacing:.8 }}>{counts.emergency} EMERGENCY</span>
              </div>
            )}
            {counts.tempIssue > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.amber}12`, border:`1px solid ${C.amber}40`, borderRadius:9 }}>
                <Dot color={C.amber} sz={6} />
                <span style={{ fontSize:11, color:C.amber, fontFamily:C.M, letterSpacing:.8 }}>{counts.tempIssue} TEMP ISSUE</span>
              </div>
            )}
            <button className="act-btn" onClick={()=>setShowAdd(true)}
              style={{ background:`rgba(20,210,194,.08)`, border:`1px solid ${C.teal}40`, borderRadius:9, color:C.teal, fontSize:12, fontWeight:600, padding:'8px 18px', fontFamily:C.D }}>
              + New Delivery
            </button>
          </div>
        </header>

        {/* Body */}
        <main style={{ flex:1, overflowY:'auto', padding:'22px 28px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,minmax(0,1fr))', gap:12 }}>
            {[
              { label:'Total Deliveries', value:counts.total,     color:C.teal,   icon:'📦' },
              { label:'Active Vehicles',  value:counts.active,    color:C.green,  icon:'🚐' },
              { label:'Emergency',        value:counts.emergency, color:C.red,    icon:'🚨' },
              { label:'Arrived Today',    value:counts.arrived,   color:C.purple, icon:'✅' },
              { label:'Temp Issues',      value:counts.tempIssue, color:C.amber,  icon:'🌡' },
            ].map((k,i)=>(
              <div key={i} style={{ background:C.card, border:`1px solid ${k.value>0&&i>0?k.color+'40':C.border}`, borderRadius:12, padding:'16px 18px', animation:`fadeUp .4s ease both`, animationDelay:`${i*50}ms` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:9.5, color:C.dim, letterSpacing:2, fontFamily:C.M, textTransform:'uppercase' }}>{k.label}</span>
                  <span style={{ fontSize:18 }}>{k.icon}</span>
                </div>
                <span style={{ fontSize:32, fontWeight:800, color:k.color, fontFamily:C.D, lineHeight:1 }}>{k.value}</span>
              </div>
            ))}
          </div>

          {/* Mapbox map */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <span style={{ fontSize:9.5, color:C.dim, letterSpacing:2.5, textTransform:'uppercase', fontFamily:C.M, whiteSpace:'nowrap' }}>Live Fleet Map</span>
              <div style={{ flex:1, height:1, background:C.border }} />
              <Dot color={C.green} sz={6} />
            </div>
            {!loading && <MapboxFleetMap deliveries={deliveries} selectedId={selected?.id} onSelectDelivery={setSelected} />}
          </div>

          {/* Status filters */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['ALL','LOADING','DISPATCHED','IN TRANSIT','ARRIVED','FAILED'].map(s=>(
              <button key={s} className="status-tab" onClick={()=>setFilter(s)}
                style={{ background: filter===s?`${s==='ALL'?C.teal:statusColor(s)}15`:'transparent', border:`1px solid ${filter===s?(s==='ALL'?C.teal:statusColor(s))+'60':C.border}`, borderRadius:8, color: filter===s?(s==='ALL'?C.teal:statusColor(s)):C.dim, fontSize:11.5, fontWeight:filter===s?600:400, padding:'7px 14px', fontFamily:C.D }}>
                {s} {s!=='ALL'&&`(${deliveries.filter(d=>d.status===s).length})`}
              </button>
            ))}
          </div>

          {/* Delivery cards */}
          {loading ? (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:150, gap:12 }}>
              <Dot color={C.teal} />
              <span style={{ fontSize:13, color:C.dim, fontFamily:C.M }}>Loading deliveries...</span>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
              {filtered.map((d,i) => {
                const sc = statusColor(d.status);
                const pc = priorityColor(d.priority);
                const tc = tempStatus(d.temp_reading);
                return (
                  <div key={d.id} className={`del-card${d.priority==='EMERGENCY'?' emergency':''}`}
                    onClick={()=>setSelected(selected?.id===d.id?null:d)}
                    style={{ background:C.card, border:`1px solid ${d.priority==='EMERGENCY'?C.red+'50':selected?.id===d.id?C.teal+'50':sc+'30'}`, borderRadius:13, padding:'18px 20px', animationDelay:`${i*40}ms`, position:'relative', overflow:'hidden' }}>

                    {d.priority !== 'NORMAL' && (
                      <div style={{ position:'absolute', top:0, right:0, background:pc, fontSize:9, color:'#fff', fontFamily:C.M, fontWeight:600, padding:'3px 10px', borderBottomLeftRadius:8, letterSpacing:1 }}>
                        {d.priority}
                      </div>
                    )}

                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, paddingRight:d.priority!=='NORMAL'?60:0 }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:sc, fontFamily:C.M, marginBottom:3 }}>#{d.delivery_code}</div>
                        <div style={{ fontSize:11, color:C.dim, fontFamily:C.M }}>{d.vehicle_id||'No vehicle'}</div>
                      </div>
                      <Pill label={d.status} color={sc} />
                    </div>

                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, marginBottom:2 }}>FROM</div>
                        <div style={{ fontSize:12, color:C.txt, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.origin||'—'}</div>
                      </div>
                      <div style={{ fontSize:16, color:C.dim, flexShrink:0 }}>→</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, marginBottom:2 }}>TO</div>
                        <div style={{ fontSize:12, color:C.txt, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.destination||'—'}</div>
                      </div>
                    </div>

                    <div style={{ display:'flex', gap:16, marginBottom:d.temp_reading?12:14 }}>
                      <div>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:1, marginBottom:2 }}>DRIVER</div>
                        <div style={{ fontSize:11.5, color:C.txt }}>{d.driver_name||'—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:1, marginBottom:2 }}>TEMP</div>
                        <div style={{ fontSize:11.5, color:tc.color, fontFamily:C.M, fontWeight:600 }}>{d.temp_reading?`${d.temp_reading}°F`:'—'}</div>
                      </div>
                      {d.eta_minutes > 0 && (
                        <div>
                          <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:1, marginBottom:2 }}>ETA</div>
                          <div style={{ fontSize:11.5, color:C.teal, fontFamily:C.M }}>{d.eta_minutes} min</div>
                        </div>
                      )}
                    </div>

                    {d.temp_reading && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', background:`${tc.color}0D`, border:`1px solid ${tc.color}30`, borderRadius:7, marginBottom:12 }}>
                        <Dot color={tc.color} sz={5} />
                        <span style={{ fontSize:10, color:tc.color, fontFamily:C.M, letterSpacing:.8 }}>TEMP {tc.label}</span>
                      </div>
                    )}

                    <button className="act-btn" onClick={e=>{e.stopPropagation();setUpdateDel(d);}}
                      style={{ width:'100%', background:'transparent', border:`1px solid ${C.border}`, borderRadius:8, color:C.teal, fontSize:11.5, fontWeight:600, padding:'9px', fontFamily:C.D }}>
                      Update Status →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {showAdd   && <AddModal onClose={()=>setShowAdd(false)} onSave={fetchDeliveries} />}
      {updateDel && <UpdateModal delivery={updateDel} onClose={()=>setUpdateDel(null)} onSave={fetchDeliveries} />}
    </>
  );
}