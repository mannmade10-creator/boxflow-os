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
      .item-row{transition:background .12s;cursor:default}
      .item-row:hover{background:rgba(20,210,194,.04)!important}
      .filter-btn{transition:all .15s;cursor:pointer}
      .filter-btn:hover{border-color:rgba(20,210,194,.4)!important;color:#14D2C2!important}
      .act-btn{transition:all .15s;cursor:pointer}
      .act-btn:hover{background:rgba(20,210,194,.12)!important;border-color:rgba(20,210,194,.5)!important}
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);
  return null;
}

const Dot = ({ color, sz=7 }) => (
  <span style={{ display:'inline-block', width:sz, height:sz, borderRadius:'50%', background:color, boxShadow:`0 0 7px ${color}`, animation:'pulseDot 2.2s ease-in-out infinite', flexShrink:0 }} />
);

const Pill = ({ label, color }) => (
  <span style={{ fontSize:9.5, fontFamily:C.M, letterSpacing:.8, color, background:`${color}18`, border:`1px solid ${color}38`, borderRadius:5, padding:'2px 7px', whiteSpace:'nowrap', flexShrink:0 }}>
    {label}
  </span>
);

const statusColor = (s) => ({
  'AVAILABLE':   C.green,
  'IN USE':      C.teal,
  'MAINTENANCE': C.amber,
  'RETIRED':     C.dim,
}[s] || C.dim);

const stockStatus = (qty, min) => {
  if (qty <= 0)       return { label:'OUT OF STOCK', color:C.red   };
  if (qty <= min)     return { label:'LOW',          color:C.amber };
  if (qty <= min * 2) return { label:'MODERATE',     color:C.yellow};
  return                     { label:'STOCKED',      color:C.green };
};

const StockBar = ({ qty, min, cap=50 }) => {
  const pct   = Math.min(100, (qty/cap)*100);
  const color = qty<=0?C.red:qty<=min?C.amber:qty<=min*2?C.yellow:C.green;
  return (
    <div style={{ height:4, background:'#060E16', borderRadius:2, overflow:'hidden' }}>
      <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:2, opacity:.85, transition:'width .8s ease' }} />
    </div>
  );
};

const CATEGORIES = ['All','Equipment','Surgical','Emergency','Monitoring','Respiratory','Mobility','Furniture'];
const STATUSES   = ['All','AVAILABLE','IN USE','MAINTENANCE','RETIRED'];

/* ── Add/Edit Modal ── */
const ItemModal = ({ item, onClose, onSave }) => {
  const editing = !!item?.id;
  const [form, setForm] = useState({
    item_name:    item?.item_name    || '',
    category:     item?.category     || 'Equipment',
    quantity:     item?.quantity     ?? '',
    min_quantity: item?.min_quantity ?? 5,
    unit:         item?.unit         || 'units',
    location:     item?.location     || '',
    status:       item?.status       || 'AVAILABLE',
  });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const save = async () => {
    if (!form.item_name) { setErr('Item name is required.'); return; }
    setSaving(true); setErr('');
    const payload = { ...form, quantity:parseInt(form.quantity), min_quantity:parseInt(form.min_quantity), last_seen:new Date().toISOString() };
    const { error } = editing
      ? await supabase.from('medflow_hospital_supplies').update(payload).eq('id', item.id)
      : await supabase.from('medflow_hospital_supplies').insert(payload);
    setSaving(false);
    if (error) { setErr(error.message); } else { onSave(); onClose(); }
  };

  const inp = { width:'100%', background:'#060E16', border:`1px solid ${C.borderH}`, borderRadius:8, color:C.white, fontSize:13, padding:'9px 11px', fontFamily:C.M, outline:'none' };
  const lbl = { fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6, display:'block' };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(4,10,18,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(4px)' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.panel, border:`1px solid ${C.borderH}`, borderRadius:16, padding:'28px 30px', maxWidth:480, width:'95%', boxShadow:'0 30px 80px rgba(0,0,0,.6)' }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:C.D, marginBottom:5 }}>{editing?'Edit Item':'Add Supply Item'}</div>
        <div style={{ fontSize:11, color:C.dim, fontFamily:C.M, marginBottom:22 }}>Track hospital equipment and supplies</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>ITEM NAME *</label><input value={form.item_name} onChange={e=>set('item_name',e.target.value)} placeholder="e.g. IV Pump" style={inp} /></div>
          <div><label style={lbl}>CATEGORY</label><select value={form.category} onChange={e=>set('category',e.target.value)} style={{...inp,cursor:'pointer'}}>{CATEGORIES.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}</select></div>
          <div><label style={lbl}>STATUS</label><select value={form.status} onChange={e=>set('status',e.target.value)} style={{...inp,cursor:'pointer'}}>{STATUSES.filter(s=>s!=='All').map(s=><option key={s}>{s}</option>)}</select></div>
          <div><label style={lbl}>QUANTITY *</label><input type="number" value={form.quantity} onChange={e=>set('quantity',e.target.value)} placeholder="0" style={inp} /></div>
          <div><label style={lbl}>MIN STOCK ALERT</label><input type="number" value={form.min_quantity} onChange={e=>set('min_quantity',e.target.value)} placeholder="5" style={inp} /></div>
          <div><label style={lbl}>UNIT</label><input value={form.unit} onChange={e=>set('unit',e.target.value)} placeholder="units" style={inp} /></div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>LOCATION</label><input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="e.g. ICU Ward" style={inp} /></div>
        </div>
        {err && <div style={{ fontSize:11, color:C.red, fontFamily:C.M, marginBottom:14 }}>{err}</div>}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, border:'none', borderRadius:9, color:'#fff', fontSize:13, fontWeight:700, padding:'12px', cursor:'pointer', fontFamily:C.D, opacity:saving?.7:1 }}>
            {saving?'Saving...':editing?'Update Item':'Add Item'}
          </button>
          <button onClick={onClose} style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, color:C.dim, fontSize:13, padding:'12px', cursor:'pointer', fontFamily:C.M }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default function HospitalPage() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [status,   setStatus]   = useState('All');
  const [showAdd,  setShowAdd]  = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase.from('medflow_hospital_supplies').select('*').order('item_name');
    if (error) { console.error(error); setLoading(false); return; }
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = items.filter(i => {
    const matchCat    = category === 'All' || i.category === category;
    const matchStatus = status   === 'All' || i.status   === status;
    const matchSearch = !search  || i.item_name?.toLowerCase().includes(search.toLowerCase()) || i.location?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const counts = {
    total:       items.length,
    available:   items.filter(i => i.status === 'AVAILABLE').length,
    inUse:       items.filter(i => i.status === 'IN USE').length,
    maintenance: items.filter(i => i.status === 'MAINTENANCE').length,
    lowStock:    items.filter(i => i.quantity <= (i.min_quantity||5) && i.quantity > 0).length,
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ height:'100vh', background:C.bg, color:C.txt, fontFamily:C.D, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:C.white, letterSpacing:-.3 }}>Hospital Logistics</h1>
            <p style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:1 }}>{counts.total} supply items tracked · Real-time Supabase</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            {counts.maintenance > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.amber}12`, border:`1px solid ${C.amber}40`, borderRadius:9 }}>
                <Dot color={C.amber} sz={6} />
                <span style={{ fontSize:11, color:C.amber, fontFamily:C.M, letterSpacing:.8 }}>{counts.maintenance} IN MAINTENANCE</span>
              </div>
            )}
            {counts.lowStock > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.red}12`, border:`1px solid ${C.red}40`, borderRadius:9 }}>
                <Dot color={C.red} sz={6} />
                <span style={{ fontSize:11, color:C.red, fontFamily:C.M, letterSpacing:.8 }}>{counts.lowStock} LOW STOCK</span>
              </div>
            )}
            <button className="act-btn" onClick={()=>setShowAdd(true)}
              style={{ background:`rgba(20,210,194,.08)`, border:`1px solid ${C.teal}40`, borderRadius:9, color:C.teal, fontSize:12, fontWeight:600, padding:'8px 18px', fontFamily:C.D }}>
              + Add Item
            </button>
          </div>
        </header>

        <main style={{ flex:1, overflowY:'auto', padding:'22px 28px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,minmax(0,1fr))', gap:12 }}>
            {[
              { label:'Total Items',  value:counts.total,       color:C.teal,   icon:'🏥' },
              { label:'Available',    value:counts.available,   color:C.green,  icon:'✅' },
              { label:'In Use',       value:counts.inUse,       color:C.teal,   icon:'⚙️' },
              { label:'Maintenance',  value:counts.maintenance, color:C.amber,  icon:'🔧' },
              { label:'Low Stock',    value:counts.lowStock,    color:C.red,    icon:'⚠️' },
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

          {/* Search + filters */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search item name or location..."
              style={{ flex:1, minWidth:200, background:C.card, border:`1px solid ${C.border}`, borderRadius:9, color:C.txt, fontSize:13, padding:'9px 14px', fontFamily:C.D, outline:'none' }} />
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {STATUSES.map(s=>(
                <button key={s} className="filter-btn" onClick={()=>setStatus(s)}
                  style={{ background:status===s?`${s==='All'?C.teal:statusColor(s)}15`:'transparent', border:`1px solid ${status===s?(s==='All'?C.teal:statusColor(s))+'60':C.border}`, borderRadius:7, color:status===s?(s==='All'?C.teal:statusColor(s)):C.dim, fontSize:11, fontWeight:status===s?600:400, padding:'6px 11px', fontFamily:C.D }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {CATEGORIES.map(cat=>(
              <button key={cat} className="filter-btn" onClick={()=>setCategory(cat)}
                style={{ background:category===cat?`${C.teal}15`:'transparent', border:`1px solid ${category===cat?C.teal+'60':C.border}`, borderRadius:8, color:category===cat?C.teal:C.dim, fontSize:11.5, fontWeight:category===cat?600:400, padding:'7px 12px', fontFamily:C.D }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, gap:12 }}>
              <Dot color={C.teal} />
              <span style={{ fontSize:13, color:C.dim, fontFamily:C.M }}>Loading hospital supplies...</span>
            </div>
          )}

          {/* Items grid */}
          {!loading && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
              {filtered.map((item, i) => {
                const sc    = statusColor(item.status);
                const stock = stockStatus(item.quantity, item.min_quantity||5);
                return (
                  <div key={item.id} className="item-row"
                    style={{ background:C.card, border:`1px solid ${item.status==='MAINTENANCE'?C.amber+'40':sc+'25'}`, borderRadius:13, padding:'18px 20px', animation:`fadeUp .4s ease both`, animationDelay:`${i*30}ms` }}>

                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <div style={{ minWidth:0, flex:1, marginRight:8 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.white, fontFamily:C.D, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.item_name}</div>
                        <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:2 }}>{item.category}</div>
                      </div>
                      <Pill label={item.status} color={sc} />
                    </div>

                    <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:10 }}>
                      <span style={{ fontSize:32, fontWeight:800, color:stock.color, fontFamily:C.D, lineHeight:1 }}>{item.quantity}</span>
                      <span style={{ fontSize:12, color:C.dim, fontFamily:C.M }}>{item.unit}</span>
                    </div>

                    <StockBar qty={item.quantity} min={item.min_quantity||5} />

                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
                      <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M }}>📍 {item.location||'—'}</div>
                      <Pill label={stock.label} color={stock.color} />
                    </div>

                    <div style={{ display:'flex', gap:8, marginTop:12 }}>
                      <button className="act-btn" onClick={()=>setEditItem(item)}
                        style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:7, color:C.teal, fontSize:11, padding:'7px', fontFamily:C.D }}>
                        ✏️ Edit
                      </button>
                      <button className="act-btn" onClick={async()=>{ await supabase.from('medflow_hospital_supplies').update({last_seen:new Date().toISOString()}).eq('id',item.id); fetchItems(); }}
                        style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:7, color:C.dim, fontSize:11, padding:'7px', fontFamily:C.D }}>
                        📍 Check In
                      </button>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && !loading && (
                <div style={{ gridColumn:'1/-1', padding:'40px', textAlign:'center', color:C.dim, fontSize:13, fontFamily:C.M }}>
                  No items match your search or filter.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showAdd  && <ItemModal item={null}     onClose={()=>setShowAdd(false)}  onSave={fetchItems} />}
      {editItem && <ItemModal item={editItem} onClose={()=>setEditItem(null)}  onSave={fetchItems} />}
    </>
  );
}