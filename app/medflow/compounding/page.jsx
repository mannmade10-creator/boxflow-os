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
      .batch-card{animation:fadeUp .4s ease both;transition:border-color .2s,box-shadow .2s}
      .batch-card:hover{box-shadow:0 8px 28px rgba(0,0,0,.4)!important}
      .filter-btn{transition:all .15s;cursor:pointer}
      .filter-btn:hover{border-color:rgba(20,210,194,.4)!important;color:#14D2C2!important}
      .act-btn{transition:all .15s;cursor:pointer}
      .act-btn:hover{background:rgba(20,210,194,.12)!important;border-color:rgba(20,210,194,.5)!important}
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

const statusColor = (s) => ({
  'IN PROGRESS': C.teal,
  'COMPLETED':   C.green,
  'QUARANTINE':  C.amber,
  'FAILED':      C.red,
}[s] || C.dim);

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000*60*60*24));
};

const budColor = (dateStr) => {
  const d = daysUntil(dateStr);
  if (d === null) return C.dim;
  if (d < 0)  return C.red;
  if (d <= 7) return C.red;
  if (d <= 30) return C.amber;
  return C.green;
};

const BatchModal = ({ batch, onClose, onSave }) => {
  const editing = !!batch?.id;
  const [form, setForm] = useState({
    batch_number:    batch?.batch_number    || 'BATCH-' + Date.now().toString().slice(-3),
    drug_name:       batch?.drug_name       || '',
    formula:         batch?.formula         || '',
    quantity_made:   batch?.quantity_made   || '',
    unit:            batch?.unit            || 'units',
    pharmacist:      batch?.pharmacist      || '',
    technician:      batch?.technician      || '',
    status:          batch?.status          || 'IN PROGRESS',
    sterile:         batch?.sterile         || false,
    hazardous:       batch?.hazardous       || false,
    beyond_use_date: batch?.beyond_use_date || '',
    notes:           batch?.notes           || '',
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  const save = async () => {
    if (!form.drug_name) { setErr('Drug name is required.'); return; }
    setSaving(true); setErr('');
    const payload = { ...form, quantity_made: parseFloat(form.quantity_made) || 0 };
    const { error } = editing
      ? await supabase.from('medflow_compounding_batches').update(payload).eq('id', batch.id)
      : await supabase.from('medflow_compounding_batches').insert(payload);
    setSaving(false);
    if (error) { setErr(error.message); } else { onSave(); onClose(); }
  };

  const inp = { width:'100%', background:'#060E16', border:`1px solid ${C.borderH}`, borderRadius:8, color:C.white, fontSize:13, padding:'9px 11px', fontFamily:C.M, outline:'none' };
  const lbl = { fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6, display:'block' };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(4,10,18,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.panel, border:`1px solid ${C.borderH}`, borderRadius:16, padding:'28px 30px', maxWidth:520, width:'95%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 30px 80px rgba(0,0,0,.6)' }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:C.D, marginBottom:5 }}>{editing ? 'Edit Batch' : 'New Compounding Batch'}</div>
        <div style={{ fontSize:11, color:C.dim, fontFamily:C.M, marginBottom:22 }}>Track compounding preparation records</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          <div><label style={lbl}>BATCH NUMBER</label><input value={form.batch_number} onChange={e=>set('batch_number',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>STATUS</label>
            <select value={form.status} onChange={e=>set('status',e.target.value)} style={{...inp,cursor:'pointer'}}>
              {['IN PROGRESS','COMPLETED','QUARANTINE','FAILED'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>DRUG NAME *</label><input value={form.drug_name} onChange={e=>set('drug_name',e.target.value)} placeholder="e.g. Morphine Sulfate 10mg/mL" style={inp} /></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>FORMULA / DESCRIPTION</label><input value={form.formula} onChange={e=>set('formula',e.target.value)} placeholder="e.g. Preservative-free injection" style={inp} /></div>
          <div><label style={lbl}>QUANTITY MADE</label><input type="number" value={form.quantity_made} onChange={e=>set('quantity_made',e.target.value)} placeholder="0" style={inp} /></div>
          <div><label style={lbl}>UNIT</label>
            <select value={form.unit} onChange={e=>set('unit',e.target.value)} style={{...inp,cursor:'pointer'}}>
              {['units','vials','bags','tablets','capsules','grams','mL'].map(u=><option key={u}>{u}</option>)}
            </select>
          </div>
          <div><label style={lbl}>PHARMACIST</label><input value={form.pharmacist} onChange={e=>set('pharmacist',e.target.value)} placeholder="Dr. Name" style={inp} /></div>
          <div><label style={lbl}>TECHNICIAN</label><input value={form.technician} onChange={e=>set('technician',e.target.value)} placeholder="Tech. Name" style={inp} /></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>BEYOND USE DATE (BUD)</label><input type="date" value={form.beyond_use_date} onChange={e=>set('beyond_use_date',e.target.value)} style={inp} /></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>NOTES</label><input value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Optional notes..." style={inp} /></div>
        </div>

        <div style={{ display:'flex', gap:20, marginBottom:22 }}>
          {[['sterile','Sterile Preparation',C.teal],['hazardous','Hazardous Drug (USP <800>)',C.red]].map(([key,label,color])=>(
            <div key={key} onClick={()=>set(key,!form[key])} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
              <div style={{ width:36, height:20, borderRadius:10, background:form[key]?color:'#1E3A50', transition:'background .2s', position:'relative', flexShrink:0 }}>
                <div style={{ position:'absolute', top:2, left:form[key]?18:2, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left .2s' }} />
              </div>
              <span style={{ fontSize:12, color:form[key]?color:C.dim, fontFamily:C.D }}>{label}</span>
            </div>
          ))}
        </div>

        {err && <div style={{ fontSize:11, color:C.red, fontFamily:C.M, marginBottom:14 }}>{err}</div>}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, border:'none', borderRadius:9, color:'#fff', fontSize:13, fontWeight:700, padding:'12px', cursor:'pointer', fontFamily:C.D, opacity:saving?.7:1 }}>
            {saving ? 'Saving...' : editing ? 'Update Batch' : 'Create Batch'}
          </button>
          <button onClick={onClose} style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, color:C.dim, fontSize:13, padding:'12px', cursor:'pointer', fontFamily:C.M }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default function CompoundingPage() {
  const [batches,   setBatches]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editBatch, setEditBatch] = useState(null);

  const fetchBatches = useCallback(async () => {
    const { data, error } = await supabase.from('medflow_compounding_batches').select('*').order('created_at', { ascending:false });
    if (error) { console.error(error); setLoading(false); return; }
    setBatches(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const filtered = filter === 'All' ? batches : batches.filter(b => b.status === filter);

  const counts = {
    total:      batches.length,
    inProgress: batches.filter(b => b.status === 'IN PROGRESS').length,
    completed:  batches.filter(b => b.status === 'COMPLETED').length,
    quarantine: batches.filter(b => b.status === 'QUARANTINE').length,
    hazardous:  batches.filter(b => b.hazardous).length,
    expiringSoon: batches.filter(b => { const d = daysUntil(b.beyond_use_date); return d !== null && d >= 0 && d <= 30; }).length,
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ height:'100vh', background:C.bg, color:C.txt, fontFamily:C.D, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:C.white, letterSpacing:-.3, margin:0 }}>Compounding</h1>
            <p style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:1, marginBottom:0 }}>{counts.total} batches tracked · USP &lt;797&gt; / &lt;800&gt; compliance</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            {counts.quarantine > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.amber}12`, border:`1px solid ${C.amber}40`, borderRadius:9 }}>
                <Dot color={C.amber} sz={6} />
                <span style={{ fontSize:11, color:C.amber, fontFamily:C.M, letterSpacing:.8 }}>{counts.quarantine} IN QUARANTINE</span>
              </div>
            )}
            {counts.hazardous > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.red}12`, border:`1px solid ${C.red}40`, borderRadius:9 }}>
                <Dot color={C.red} sz={6} />
                <span style={{ fontSize:11, color:C.red, fontFamily:C.M, letterSpacing:.8 }}>{counts.hazardous} HAZARDOUS</span>
              </div>
            )}
            <button className="act-btn" onClick={() => setShowModal(true)}
              style={{ background:`rgba(20,210,194,.08)`, border:`1px solid ${C.teal}40`, borderRadius:9, color:C.teal, fontSize:12, fontWeight:600, padding:'8px 18px', fontFamily:C.D }}>
              + New Batch
            </button>
          </div>
        </header>

        <main style={{ flex:1, overflowY:'auto', padding:'22px 28px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,minmax(0,1fr))', gap:12 }}>
            {[
              { label:'Total Batches',  value:counts.total,       color:C.teal,   icon:'⚗️' },
              { label:'In Progress',    value:counts.inProgress,  color:C.teal,   icon:'🔄' },
              { label:'Completed',      value:counts.completed,   color:C.green,  icon:'✅' },
              { label:'Quarantine',     value:counts.quarantine,  color:C.amber,  icon:'⚠️' },
              { label:'Hazardous',      value:counts.hazardous,   color:C.red,    icon:'☣️' },
              { label:'BUD ≤30d',       value:counts.expiringSoon,color:C.yellow, icon:'📅' },
            ].map((k,i) => (
              <div key={i} style={{ background:C.card, border:`1px solid ${k.value>0&&i>0?k.color+'40':C.border}`, borderRadius:12, padding:'14px 16px', animation:'fadeUp .4s ease both', animationDelay:`${i*40}ms` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:9, color:C.dim, letterSpacing:2, fontFamily:C.M, textTransform:'uppercase' }}>{k.label}</span>
                  <span style={{ fontSize:16 }}>{k.icon}</span>
                </div>
                <span style={{ fontSize:28, fontWeight:800, color:k.color, fontFamily:C.D, lineHeight:1 }}>{k.value}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {['All','IN PROGRESS','COMPLETED','QUARANTINE','FAILED'].map(f => (
              <button key={f} className="filter-btn" onClick={() => setFilter(f)}
                style={{ background:filter===f?`${f==='All'?C.teal:statusColor(f)}15`:'transparent', border:`1px solid ${filter===f?(f==='All'?C.teal:statusColor(f))+'60':C.border}`, borderRadius:8, color:filter===f?(f==='All'?C.teal:statusColor(f)):C.dim, fontSize:11.5, fontWeight:filter===f?600:400, padding:'7px 14px', fontFamily:C.D }}>
                {f} {f!=='All'&&`(${batches.filter(b=>b.status===f).length})`}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, gap:12 }}>
              <Dot color={C.teal} />
              <span style={{ fontSize:13, color:C.dim, fontFamily:C.M }}>Loading batches...</span>
            </div>
          )}

          {/* Batch cards */}
          {!loading && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:14 }}>
              {filtered.map((batch, i) => {
                const sc  = statusColor(batch.status);
                const bud = daysUntil(batch.beyond_use_date);
                const bc  = budColor(batch.beyond_use_date);
                return (
                  <div key={batch.id} className="batch-card"
                    style={{ background:C.card, border:`1px solid ${batch.status==='QUARANTINE'?C.amber+'50':batch.hazardous?C.red+'30':sc+'25'}`, borderRadius:13, padding:'18px 20px', animationDelay:`${i*40}ms`, position:'relative', overflow:'hidden' }}>

                    {batch.hazardous && (
                      <div style={{ position:'absolute', top:0, right:0, background:C.red, fontSize:9, color:'#fff', fontFamily:C.M, fontWeight:600, padding:'3px 10px', borderBottomLeftRadius:8, letterSpacing:1 }}>☣️ HAZARDOUS</div>
                    )}

                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12, paddingRight:batch.hazardous?80:0 }}>
                      <div>
                        <div style={{ fontSize:12, color:sc, fontFamily:C.M, fontWeight:700, marginBottom:3 }}>{batch.batch_number}</div>
                        <div style={{ fontSize:14, fontWeight:700, color:C.white, fontFamily:C.D }}>{batch.drug_name}</div>
                      </div>
                      <Pill label={batch.status} color={sc} />
                    </div>

                    {batch.formula && <div style={{ fontSize:11.5, color:C.dim, fontFamily:C.M, marginBottom:12 }}>{batch.formula}</div>}

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
                      <div>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:1, marginBottom:2 }}>QUANTITY</div>
                        <div style={{ fontSize:13, color:C.txt, fontFamily:C.M, fontWeight:600 }}>{batch.quantity_made} {batch.unit}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:1, marginBottom:2 }}>BUD</div>
                        <div style={{ fontSize:13, color:bc, fontFamily:C.M, fontWeight:600 }}>
                          {batch.beyond_use_date ? `${bud}d (${new Date(batch.beyond_use_date).toLocaleDateString()})` : '—'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:1, marginBottom:2 }}>PHARMACIST</div>
                        <div style={{ fontSize:12, color:C.txt, fontFamily:C.D }}>{batch.pharmacist || '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:1, marginBottom:2 }}>TECHNICIAN</div>
                        <div style={{ fontSize:12, color:C.txt, fontFamily:C.D }}>{batch.technician || '—'}</div>
                      </div>
                    </div>

                    <div style={{ display:'flex', gap:8, marginBottom:batch.notes?10:0 }}>
                      {batch.sterile && <Pill label="STERILE" color={C.teal} />}
                      {batch.hazardous && <Pill label="USP <800>" color={C.red} />}
                    </div>

                    {batch.notes && <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:8, fontStyle:'italic' }}>"{batch.notes}"</div>}

                    <button className="act-btn" onClick={() => setEditBatch(batch)}
                      style={{ width:'100%', marginTop:12, background:'transparent', border:`1px solid ${C.border}`, borderRadius:8, color:C.teal, fontSize:11.5, fontWeight:600, padding:'9px', fontFamily:C.D }}>
                      ✏️ Edit Batch
                    </button>
                  </div>
                );
              })}

              {filtered.length === 0 && !loading && (
                <div style={{ gridColumn:'1/-1', padding:40, textAlign:'center', color:C.dim, fontSize:13, fontFamily:C.M }}>
                  No batches match your filter.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showModal && <BatchModal batch={null}     onClose={() => setShowModal(false)} onSave={fetchBatches} />}
      {editBatch && <BatchModal batch={editBatch} onClose={() => setEditBatch(null)} onSave={fetchBatches} />}
    </>
  );
}