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
      .log-row{transition:background .12s}
      .log-row:hover{background:rgba(20,210,194,.04)!important}
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

const CATEGORIES = ['All','USP <797>','USP <800>','FDA','Joint Commission'];

const categoryColor = (cat) => ({
  'USP <797>':        C.teal,
  'USP <800>':        C.purple,
  'FDA':              C.amber,
  'Joint Commission': C.green,
}[cat] || C.dim);

const LogModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ category:'USP <797>', action:'', performed_by:'', notes:'', passed:true });
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState('');
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const save = async () => {
    if (!form.action) { setErr('Action is required.'); return; }
    setSaving(true); setErr('');
    const { error } = await supabase.from('medflow_compliance_logs').insert(form);
    setSaving(false);
    if (error) { setErr(error.message); } else { onSave(); onClose(); }
  };

  const inp = { width:'100%', background:'#060E16', border:`1px solid ${C.borderH}`, borderRadius:8, color:C.white, fontSize:13, padding:'9px 11px', fontFamily:C.M, outline:'none' };
  const lbl = { fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:6, display:'block' };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(4,10,18,.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:C.panel, border:`1px solid ${C.borderH}`, borderRadius:16, padding:'28px 30px', maxWidth:460, width:'95%', boxShadow:'0 30px 80px rgba(0,0,0,.6)' }}>
        <div style={{ fontSize:17, fontWeight:800, color:C.white, fontFamily:C.D, marginBottom:5 }}>Log Compliance Action</div>
        <div style={{ fontSize:11, color:C.dim, fontFamily:C.M, marginBottom:22 }}>Record a compliance check or audit action</div>

        <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:14 }}>
          <div><label style={lbl}>CATEGORY</label>
            <select value={form.category} onChange={e=>set('category',e.target.value)} style={{...inp,cursor:'pointer'}}>
              {['USP <797>','USP <800>','FDA','Joint Commission'].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label style={lbl}>ACTION *</label><input value={form.action} onChange={e=>set('action',e.target.value)} placeholder="e.g. Cleanroom pressure check" style={inp} /></div>
          <div><label style={lbl}>PERFORMED BY</label><input value={form.performed_by} onChange={e=>set('performed_by',e.target.value)} placeholder="Dr. Name or Tech. Name" style={inp} /></div>
          <div><label style={lbl}>NOTES</label><input value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Optional notes..." style={inp} /></div>
        </div>

        <div style={{ display:'flex', gap:12, marginBottom:22 }}>
          {[true, false].map(val => (
            <div key={String(val)} onClick={() => set('passed', val)}
              style={{ flex:1, padding:'12px', borderRadius:9, border:`1px solid ${form.passed===val?(val?C.green:C.red)+'60':C.border}`, background:form.passed===val?(val?C.green:C.red)+'10':'transparent', cursor:'pointer', textAlign:'center' }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{val ? '✅' : '❌'}</div>
              <div style={{ fontSize:12, color:form.passed===val?(val?C.green:C.red):C.dim, fontFamily:C.D, fontWeight:600 }}>{val ? 'PASSED' : 'FAILED'}</div>
            </div>
          ))}
        </div>

        {err && <div style={{ fontSize:11, color:C.red, fontFamily:C.M, marginBottom:14 }}>{err}</div>}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={save} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, border:'none', borderRadius:9, color:'#fff', fontSize:13, fontWeight:700, padding:'12px', cursor:'pointer', fontFamily:C.D, opacity:saving?.7:1 }}>
            {saving ? 'Saving...' : 'Log Action'}
          </button>
          <button onClick={onClose} style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, color:C.dim, fontSize:13, padding:'12px', cursor:'pointer', fontFamily:C.M }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default function CompliancePage() {
  const [logs,      setLogs]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('All');
  const [showModal, setShowModal] = useState(false);

  const fetchLogs = useCallback(async () => {
    const { data, error } = await supabase.from('medflow_compliance_logs').select('*').order('created_at', { ascending:false });
    if (error) { console.error(error); setLoading(false); return; }
    setLogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = filter === 'All' ? logs : logs.filter(l => l.category === filter);

  const counts = {
    total:   logs.length,
    passed:  logs.filter(l => l.passed).length,
    failed:  logs.filter(l => !l.passed).length,
    usp797:  logs.filter(l => l.category === 'USP <797>').length,
    usp800:  logs.filter(l => l.category === 'USP <800>').length,
    fda:     logs.filter(l => l.category === 'FDA').length,
    jc:      logs.filter(l => l.category === 'Joint Commission').length,
  };

  const passRate = counts.total > 0 ? Math.round((counts.passed / counts.total) * 100) : 100;

  const scoreColor = passRate >= 95 ? C.green : passRate >= 80 ? C.yellow : C.red;

  return (
    <>
      <GlobalStyles />
      <div style={{ height:'100vh', background:C.bg, color:C.txt, fontFamily:C.D, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:C.white, letterSpacing:-.3, margin:0 }}>Compliance</h1>
            <p style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:1, marginBottom:0 }}>{counts.total} actions logged · Pass rate: {passRate}%</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
            {counts.failed > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.red}12`, border:`1px solid ${C.red}40`, borderRadius:9 }}>
                <Dot color={C.red} sz={6} />
                <span style={{ fontSize:11, color:C.red, fontFamily:C.M, letterSpacing:.8 }}>{counts.failed} FAILED</span>
              </div>
            )}
            <button className="act-btn" onClick={() => setShowModal(true)}
              style={{ background:`rgba(20,210,194,.08)`, border:`1px solid ${C.teal}40`, borderRadius:9, color:C.teal, fontSize:12, fontWeight:600, padding:'8px 18px', fontFamily:C.D }}>
              + Log Action
            </button>
          </div>
        </header>

        <main style={{ flex:1, overflowY:'auto', padding:'22px 28px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* Score + KPIs */}
          <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:16 }}>

            {/* Overall score */}
            <div style={{ background:C.card, border:`1px solid ${scoreColor}40`, borderRadius:14, padding:'22px 20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'fadeUp .4s ease both' }}>
              <div style={{ fontSize:10, color:C.dim, fontFamily:C.M, letterSpacing:2, marginBottom:10 }}>OVERALL SCORE</div>
              <div style={{ fontSize:52, fontWeight:800, color:scoreColor, fontFamily:C.D, lineHeight:1 }}>{passRate}%</div>
              <div style={{ fontSize:10.5, color:scoreColor, fontFamily:C.M, marginTop:6 }}>{passRate >= 95 ? 'EXCELLENT' : passRate >= 80 ? 'GOOD' : 'NEEDS ATTENTION'}</div>
              <div style={{ width:'100%', height:5, background:'#060E16', borderRadius:3, marginTop:14, overflow:'hidden' }}>
                <div style={{ width:`${passRate}%`, height:'100%', background:`linear-gradient(90deg,${C.tealD},${scoreColor})`, borderRadius:3 }} />
              </div>
            </div>

            {/* Category breakdown */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
              {[
                { label:'USP <797>',        value:counts.usp797, color:C.teal,   icon:'🧪' },
                { label:'USP <800>',        value:counts.usp800, color:C.purple, icon:'☣️' },
                { label:'FDA',              value:counts.fda,    color:C.amber,  icon:'🏛️' },
                { label:'Joint Commission', value:counts.jc,     color:C.green,  icon:'✅' },
              ].map((k,i) => (
                <div key={i} style={{ background:C.card, border:`1px solid ${k.color}30`, borderRadius:12, padding:'14px 16px', animation:'fadeUp .4s ease both', animationDelay:`${i*40}ms` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:9.5, color:k.color, letterSpacing:1.5, fontFamily:C.M }}>{k.label}</span>
                    <span style={{ fontSize:16 }}>{k.icon}</span>
                  </div>
                  <div style={{ fontSize:28, fontWeight:800, color:k.color, fontFamily:C.D, lineHeight:1 }}>{k.value}</div>
                  <div style={{ fontSize:10, color:C.dim, fontFamily:C.M, marginTop:4 }}>actions logged</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} className="filter-btn" onClick={() => setFilter(cat)}
                style={{ background:filter===cat?`${cat==='All'?C.teal:categoryColor(cat)}15`:'transparent', border:`1px solid ${filter===cat?(cat==='All'?C.teal:categoryColor(cat))+'60':C.border}`, borderRadius:8, color:filter===cat?(cat==='All'?C.teal:categoryColor(cat)):C.dim, fontSize:11.5, fontWeight:filter===cat?600:400, padding:'7px 14px', fontFamily:C.D }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:200, gap:12 }}>
              <Dot color={C.teal} />
              <span style={{ fontSize:13, color:C.dim, fontFamily:C.M }}>Loading compliance logs...</span>
            </div>
          )}

          {/* Logs table */}
          {!loading && (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:13, overflow:'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:14, fontWeight:700, color:C.white, fontFamily:C.D }}>Compliance Log</span>
                <span style={{ fontSize:10, color:C.dim, fontFamily:C.M, letterSpacing:1.5 }}>{filtered.length} ENTRIES</span>
              </div>

              {/* Header */}
              <div style={{ display:'flex', gap:8, padding:'8px 20px', borderBottom:`1px solid ${C.border}`, background:'#091624' }}>
                {['CATEGORY','ACTION','PERFORMED BY','RESULT','DATE'].map((h,i) => (
                  <span key={h} style={{ flex:i===1?2:1, fontSize:8.5, color:C.dim, letterSpacing:2, fontFamily:C.M }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {filtered.length === 0 ? (
                <div style={{ padding:30, textAlign:'center', color:C.dim, fontSize:13, fontFamily:C.M }}>No compliance logs match your filter.</div>
              ) : filtered.map((log, i) => (
                <div key={log.id} className="log-row" style={{ display:'flex', gap:8, alignItems:'center', padding:'12px 20px', borderBottom:i<filtered.length-1?`1px solid ${C.border}`:'none' }}>
                  <span style={{ flex:1 }}><Pill label={log.category} color={categoryColor(log.category)} /></span>
                  <span style={{ flex:2, fontSize:12, color:C.txt, fontFamily:C.D, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{log.action}</span>
                  <span style={{ flex:1, fontSize:11, color:C.dim, fontFamily:C.M, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{log.performed_by || '—'}</span>
                  <span style={{ flex:1 }}><Pill label={log.passed?'PASSED':'FAILED'} color={log.passed?C.green:C.red} /></span>
                  <span style={{ flex:1, fontSize:10.5, color:C.dim, fontFamily:C.M }}>{new Date(log.created_at).toLocaleDateString('en-US')}</span>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {showModal && <LogModal onClose={() => setShowModal(false)} onSave={fetchLogs} />}
    </>
  );
}