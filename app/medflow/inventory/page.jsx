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
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-thumb { background: #1E3A50; border-radius: 4px; }
      @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
      .drug-row  { transition: background .12s; cursor: default; }
      .drug-row:hover  { background: rgba(20,210,194,.04) !important; }
      .filter-btn { transition: all .15s; cursor: pointer; }
      .filter-btn:hover { border-color: rgba(20,210,194,.4) !important; color: #14D2C2 !important; }
      .add-btn { transition: all .15s; cursor: pointer; }
      .add-btn:hover { background: rgba(20,210,194,.14) !important; }
      .icon-btn { transition: all .15s; cursor: pointer; }
      .icon-btn:hover { color: #14D2C2 !important; }
      .sort-btn { transition: all .15s; cursor: pointer; }
      .sort-btn:hover { color: #14D2C2 !important; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
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

/* ── Expiry helpers ── */
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const expiryStatus = (dateStr) => {
  const d = daysUntil(dateStr);
  if (d === null) return { label:'NO DATE', color:C.dim };
  if (d < 0)    return { label:'EXPIRED',  color:C.red    };
  if (d <= 7)   return { label:`${d}d`,    color:C.red    };
  if (d <= 30)  return { label:`${d}d`,    color:C.amber  };
  if (d <= 90)  return { label:`${d}d`,    color:C.yellow };
  return               { label:'OK',       color:C.green  };
};

const stockStatus = (qty, min) => {
  if (qty <= 0)        return { label:'OUT OF STOCK', color:C.red    };
  if (qty <= min)      return { label:'LOW STOCK',    color:C.amber  };
  if (qty <= min * 2)  return { label:'MODERATE',     color:C.yellow };
  return                      { label:'IN STOCK',     color:C.green  };
};

/* ── Stock bar ── */
const StockBar = ({ qty, min, cap=200 }) => {
  const pct  = Math.min(100, (qty / cap) * 100);
  const color = qty <= 0 ? C.red : qty <= min ? C.amber : qty <= min*2 ? C.yellow : C.green;
  return (
    <div style={{ height:4, background:'#060E16', borderRadius:2, overflow:'hidden', width:'100%' }}>
      <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:2, opacity:.85, transition:'width .8s ease' }} />
    </div>
  );
};

/* ── CATEGORIES ── */
const CATEGORIES = ['All','Refrigerated','Controlled','Antibiotic','Vaccine','Emergency','General'];

/* ── Add / Edit Drug Modal ── */
const DrugModal = ({ drug, onClose, onSave }) => {
  const editing = !!drug?.id;
  const [form, setForm] = useState({
    drug_name:    drug?.drug_name    || '',
    ndc_number:   drug?.ndc_number   || '',
    lot_number:   drug?.lot_number   || '',
    quantity:     drug?.quantity     ?? '',
    min_quantity: drug?.min_quantity ?? 10,
    unit:         drug?.unit         || 'units',
    category:     drug?.category     || 'General',
    expires_at:   drug?.expires_at   || '',
    refrigerated: drug?.refrigerated || false,
    controlled:   drug?.controlled   || false,
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    if (!form.drug_name) { setErr('Drug name is required.'); return; }
    if (form.quantity === '') { setErr('Quantity is required.'); return; }
    setSaving(true); setErr('');
    const payload = { ...form, quantity: parseInt(form.quantity), min_quantity: parseInt(form.min_quantity) };
    const { error } = editing
      ? await supabase.from('medflow_inventory').update(payload).eq('id', drug.id)
      : await supabase.from('medflow_inventory').insert(payload);
    setSaving(false);
    if (error) { setErr(error.message); }
    else { onSave(); onClose(); }
  };

  const inputStyle = { width:'100%', background:'#060E16', border:`1px solid ${C.borderH}`, borderRadius:8, color:C.white, fontSize:13, padding:'9px 11px', fontFamily:C.M, outline:'none' };
  const labelStyle = { fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6, display:'block' };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(4,10,18,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(4px)' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.panel, border:`1px solid ${C.borderH}`, borderRadius:16, padding:'28px 30px', maxWidth:520, width:'95%', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 30px 80px rgba(0,0,0,.6)' }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:C.D, marginBottom:5 }}>{editing ? 'Edit Drug' : 'Add New Drug'}</div>
        <div style={{ fontSize:11, color:C.dim, fontFamily:C.M, marginBottom:22 }}>{editing ? 'Update inventory record' : 'Add a drug to the MedFlowOS inventory'}</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={labelStyle}>DRUG NAME *</label>
            <input value={form.drug_name} onChange={e=>set('drug_name',e.target.value)} placeholder="e.g. Amoxicillin 500mg" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>NDC NUMBER</label>
            <input value={form.ndc_number} onChange={e=>set('ndc_number',e.target.value)} placeholder="0000-0000-00" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>LOT NUMBER</label>
            <input value={form.lot_number} onChange={e=>set('lot_number',e.target.value)} placeholder="e.g. LOT-2024-001" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>QUANTITY *</label>
            <input type="number" value={form.quantity} onChange={e=>set('quantity',e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>MIN STOCK ALERT</label>
            <input type="number" value={form.min_quantity} onChange={e=>set('min_quantity',e.target.value)} placeholder="10" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>UNIT</label>
            <select value={form.unit} onChange={e=>set('unit',e.target.value)} style={{...inputStyle, cursor:'pointer'}}>
              {['units','tablets','capsules','vials','mL','mg','boxes','bottles'].map(u=><option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>CATEGORY</label>
            <select value={form.category} onChange={e=>set('category',e.target.value)} style={{...inputStyle, cursor:'pointer'}}>
              {CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={labelStyle}>EXPIRATION DATE</label>
            <input type="date" value={form.expires_at} onChange={e=>set('expires_at',e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display:'flex', gap:20, marginBottom:22 }}>
          {[['refrigerated','Requires Refrigeration',C.teal],['controlled','Controlled Substance (CII–CV)',C.red]].map(([key,label,color])=>(
            <div key={key} onClick={()=>set(key,!form[key])} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
              <div style={{ width:36, height:20, borderRadius:10, background: form[key] ? color : '#1E3A50', transition:'background .2s', position:'relative', flexShrink:0 }}>
                <div style={{ position:'absolute', top:2, left: form[key] ? 18 : 2, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left .2s' }} />
              </div>
              <span style={{ fontSize:12, color: form[key] ? color : C.dim, fontFamily:C.D }}>{label}</span>
            </div>
          ))}
        </div>

        {err && <div style={{ fontSize:11, color:C.red, fontFamily:C.M, marginBottom:14 }}>{err}</div>}

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, border:'none', borderRadius:9, color:'#fff', fontSize:13, fontWeight:700, padding:'12px', cursor:'pointer', fontFamily:C.D, opacity:saving?.7:1 }}>
            {saving ? 'Saving...' : editing ? 'Update Drug' : 'Add Drug'}
          </button>
          <button onClick={onClose} style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, color:C.dim, fontSize:13, padding:'12px', cursor:'pointer', fontFamily:C.M }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* ── Delete confirm modal ── */
const DeleteModal = ({ drug, onClose, onConfirm }) => (
  <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(4,10,18,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(4px)' }}>
    <div onClick={e=>e.stopPropagation()} style={{ background:C.panel, border:`1px solid ${C.red}44`, borderRadius:16, padding:'28px 30px', maxWidth:400, width:'92%' }}>
      <div style={{ fontSize:24, marginBottom:12 }}>🗑️</div>
      <div style={{ fontSize:16, fontWeight:800, color:C.white, fontFamily:C.D, marginBottom:8 }}>Delete Drug?</div>
      <div style={{ fontSize:12, color:C.dim, fontFamily:C.M, marginBottom:24 }}>This will permanently remove <span style={{color:C.white}}>{drug?.drug_name}</span> from inventory. This cannot be undone.</div>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onConfirm} style={{ flex:1, background:C.red, border:'none', borderRadius:9, color:'#fff', fontSize:13, fontWeight:700, padding:'12px', cursor:'pointer', fontFamily:C.D }}>Delete</button>
        <button onClick={onClose} style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, color:C.dim, fontSize:13, padding:'12px', cursor:'pointer', fontFamily:C.M }}>Cancel</button>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function InventoryPage() {
  const [drugs,      setDrugs]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('All');
  const [sortBy,     setSortBy]     = useState('drug_name');
  const [sortDir,    setSortDir]    = useState('asc');
  const [showAdd,    setShowAdd]    = useState(false);
  const [editDrug,   setEditDrug]   = useState(null);
  const [deleteDrug, setDeleteDrug] = useState(null);

  const fetchDrugs = useCallback(async () => {
    const { data, error } = await supabase
      .from('medflow_inventory')
      .select('*')
      .order(sortBy, { ascending: sortDir === 'asc' });
    if (error) { console.error(error); setLoading(false); return; }
    setDrugs(data || []);
    setLoading(false);
  }, [sortBy, sortDir]);

  useEffect(() => { fetchDrugs(); }, [fetchDrugs]);

  const handleDelete = async () => {
    if (!deleteDrug) return;
    await supabase.from('medflow_inventory').delete().eq('id', deleteDrug.id);
    setDeleteDrug(null);
    fetchDrugs();
  };

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  /* ── Filtered + searched drugs ── */
  const filtered = drugs.filter(d => {
    const matchCat = category === 'All' ||
      (category === 'Refrigerated' && d.refrigerated) ||
      (category === 'Controlled'   && d.controlled)   ||
      d.category === category;
    const matchSearch = !search ||
      d.drug_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.ndc_number?.toLowerCase().includes(search.toLowerCase()) ||
      d.lot_number?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  /* ── Summary stats ── */
  const totalDrugs    = drugs.length;
  const lowStock      = drugs.filter(d => d.quantity <= (d.min_quantity || 10) && d.quantity > 0).length;
  const outOfStock    = drugs.filter(d => d.quantity <= 0).length;
  const expiringSoon  = drugs.filter(d => { const days = daysUntil(d.expires_at); return days !== null && days >= 0 && days <= 30; }).length;
  const controlled    = drugs.filter(d => d.controlled).length;

  const SortIcon = ({ col }) => (
    <span style={{ fontSize:9, color: sortBy===col ? C.teal : C.dim, marginLeft:4 }}>
      {sortBy===col ? (sortDir==='asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  return (
    <>
      <GlobalStyles />
      <div style={{ height:'100vh', background:C.bg, color:C.txt, fontFamily:C.D, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:C.white, fontFamily:C.D, letterSpacing:-.3 }}>Inventory & Drug Safety</h1>
            <p style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:1 }}>{totalDrugs} drugs tracked · Real-time Supabase sync</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            {outOfStock > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.red}12`, border:`1px solid ${C.red}40`, borderRadius:9 }}>
                <Dot color={C.red} sz={6} />
                <span style={{ fontSize:11, color:C.red, fontFamily:C.M, letterSpacing:.8 }}>{outOfStock} OUT OF STOCK</span>
              </div>
            )}
            {lowStock > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.amber}12`, border:`1px solid ${C.amber}40`, borderRadius:9 }}>
                <Dot color={C.amber} sz={6} />
                <span style={{ fontSize:11, color:C.amber, fontFamily:C.M, letterSpacing:.8 }}>{lowStock} LOW STOCK</span>
              </div>
            )}
            <button className="add-btn" onClick={()=>setShowAdd(true)}
              style={{ background:`rgba(20,210,194,.08)`, border:`1px solid ${C.teal}40`, borderRadius:9, color:C.teal, fontSize:12, fontWeight:600, padding:'8px 18px', fontFamily:C.D }}>
              + Add Drug
            </button>
          </div>
        </header>

        {/* Body */}
        <main style={{ flex:1, overflowY:'auto', padding:'22px 28px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* KPI row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,minmax(0,1fr))', gap:12 }}>
            {[
              { label:'Total Drugs',     value:totalDrugs,   color:C.teal,   icon:'💊' },
              { label:'Low Stock',       value:lowStock,     color:C.amber,  icon:'⚠️' },
              { label:'Out of Stock',    value:outOfStock,   color:C.red,    icon:'🚫' },
              { label:'Expiring ≤30d',   value:expiringSoon, color:C.yellow, icon:'📅' },
              { label:'Controlled (CII)',value:controlled,   color:C.purple, icon:'🔒' },
            ].map((k,i)=>(
              <div key={i} style={{ background:C.card, border:`1px solid ${k.value>0&&i>0?k.color+'40':C.border}`, borderRadius:12, padding:'16px 18px', animation:`fadeUp .4s ease both`, animationDelay:`${i*50}ms` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:9.5, color:C.dim, letterSpacing:2, fontFamily:C.M, textTransform:'uppercase' }}>{k.label}</span>
                  <span style={{ fontSize:18 }}>{k.icon}</span>
                </div>
                <span style={{ fontSize:32, fontWeight:800, color:k.value>0&&i>0?k.color:k.color, fontFamily:C.D, lineHeight:1 }}>{k.value}</span>
              </div>
            ))}
          </div>

          {/* Search + filters */}
          <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search drug name, NDC, lot number..."
              style={{ flex:1, minWidth:200, background:C.card, border:`1px solid ${C.border}`, borderRadius:9, color:C.txt, fontSize:13, padding:'9px 14px', fontFamily:C.D, outline:'none' }}
            />
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {CATEGORIES.map(cat=>(
                <button key={cat} className="filter-btn" onClick={()=>setCategory(cat)}
                  style={{ background: category===cat?`${C.teal}15`:'transparent', border:`1px solid ${category===cat?C.teal+'60':C.border}`, borderRadius:8, color: category===cat?C.teal:C.dim, fontSize:11.5, fontWeight:category===cat?600:400, padding:'7px 12px', fontFamily:C.D }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, gap:12 }}>
              <Dot color={C.teal} />
              <span style={{ fontSize:13, color:C.dim, fontFamily:C.M }}>Loading inventory...</span>
            </div>
          )}

          {/* Empty state */}
          {!loading && drugs.length === 0 && (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:'48px 30px', textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:14 }}>💊</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.white, fontFamily:C.D, marginBottom:8 }}>No drugs in inventory yet</div>
              <div style={{ fontSize:12, color:C.dim, fontFamily:C.M, marginBottom:22 }}>Click "Add Drug" to start tracking your pharmacy inventory.</div>
              <button className="add-btn" onClick={()=>setShowAdd(true)}
                style={{ background:`rgba(20,210,194,.08)`, border:`1px solid ${C.teal}40`, borderRadius:9, color:C.teal, fontSize:13, fontWeight:600, padding:'10px 26px', fontFamily:C.D }}>
                + Add First Drug
              </button>
            </div>
          )}

          {/* Inventory table */}
          {!loading && drugs.length > 0 && (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, overflow:'hidden' }}>

              {/* Table header */}
              <div style={{ display:'flex', gap:8, padding:'10px 20px', borderBottom:`1px solid ${C.border}`, background:'#091624' }}>
                {[
                  { label:'DRUG NAME',  col:'drug_name',  flex:2 },
                  { label:'NDC / LOT',  col:'ndc_number', flex:1.5 },
                  { label:'CATEGORY',   col:'category',   flex:1 },
                  { label:'STOCK',      col:'quantity',   flex:1 },
                  { label:'EXPIRES',    col:'expires_at', flex:1 },
                  { label:'STATUS',     col:null,         flex:1 },
                  { label:'FLAGS',      col:null,         flex:.8 },
                  { label:'',           col:null,         flex:.5 },
                ].map((h,i)=>(
                  <div key={i} className={h.col?'sort-btn':''} onClick={()=>h.col&&toggleSort(h.col)}
                    style={{ flex:h.flex, fontSize:8.5, color:sortBy===h.col?C.teal:C.dim, letterSpacing:2, fontFamily:C.M, userSelect:'none' }}>
                    {h.label}{h.col && <SortIcon col={h.col} />}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {filtered.length === 0 ? (
                <div style={{ padding:'30px 20px', textAlign:'center', color:C.dim, fontSize:13, fontFamily:C.M }}>No drugs match your search or filter.</div>
              ) : (
                filtered.map((drug, i) => {
                  const stock  = stockStatus(drug.quantity, drug.min_quantity || 10);
                  const expiry = expiryStatus(drug.expires_at);
                  return (
                    <div key={drug.id} className="drug-row"
                      style={{ display:'flex', gap:8, alignItems:'center', padding:'13px 20px', borderBottom: i<filtered.length-1?`1px solid ${C.border}`:'none' }}>

                      {/* Drug name */}
                      <div style={{ flex:2, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:C.white, fontFamily:C.D, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{drug.drug_name}</div>
                      </div>

                      {/* NDC / Lot */}
                      <div style={{ flex:1.5, minWidth:0 }}>
                        {drug.ndc_number && <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>NDC: {drug.ndc_number}</div>}
                        {drug.lot_number && <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>LOT: {drug.lot_number}</div>}
                        {!drug.ndc_number && !drug.lot_number && <span style={{ fontSize:10.5, color:C.dim, fontFamily:C.M }}>—</span>}
                      </div>

                      {/* Category */}
                      <div style={{ flex:1 }}>
                        <span style={{ fontSize:11, color:C.dim, fontFamily:C.M }}>{drug.category || '—'}</span>
                      </div>

                      {/* Stock */}
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:5 }}>
                          <span style={{ fontSize:15, fontWeight:700, color:stock.color, fontFamily:C.M }}>{drug.quantity}</span>
                          <span style={{ fontSize:10, color:C.dim, fontFamily:C.M }}>{drug.unit||'units'}</span>
                        </div>
                        <StockBar qty={drug.quantity} min={drug.min_quantity||10} />
                      </div>

                      {/* Expiry */}
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:11, color:expiry.color, fontFamily:C.M, fontWeight:600 }}>{expiry.label}</div>
                        {drug.expires_at && <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M }}>{new Date(drug.expires_at).toLocaleDateString()}</div>}
                      </div>

                      {/* Status */}
                      <div style={{ flex:1 }}>
                        <Pill label={stock.label} color={stock.color} />
                      </div>

                      {/* Flags */}
                      <div style={{ flex:.8, display:'flex', gap:5 }}>
                        {drug.refrigerated && <span title="Refrigerated" style={{ fontSize:14 }}>🧊</span>}
                        {drug.controlled   && <span title="Controlled"   style={{ fontSize:14 }}>🔒</span>}
                      </div>

                      {/* Actions */}
                      <div style={{ flex:.5, display:'flex', gap:8, justifyContent:'flex-end' }}>
                        <span className="icon-btn" onClick={()=>setEditDrug(drug)} style={{ fontSize:14, color:C.dim }}>✏️</span>
                        <span className="icon-btn" onClick={()=>setDeleteDrug(drug)} style={{ fontSize:14, color:C.dim }}>🗑️</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </main>
      </div>

      {showAdd    && <DrugModal drug={null}     onClose={()=>setShowAdd(false)}    onSave={fetchDrugs} />}
      {editDrug   && <DrugModal drug={editDrug}  onClose={()=>setEditDrug(null)}   onSave={fetchDrugs} />}
      {deleteDrug && <DeleteModal drug={deleteDrug} onClose={()=>setDeleteDrug(null)} onConfirm={handleDelete} />}
    </>
  );
}