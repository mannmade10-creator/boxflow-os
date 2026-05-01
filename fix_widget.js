const fs = require('fs');
const code = `'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const HIDE_ON = ['/', '/login', '/medflow-login', '/propflow-login', '/classflow-login'];
const C = { bg:'#020917', panel:'#0B1628', card:'#0D1E35', border:'#152840', blue:'#2563EB', blueD:'#1d4ed8', green:'#22C55E', red:'#EF4444', dim:'#4A6090', txt:'#C8DDE9', white:'#EEF6FB' };
const QUICK = [
  { icon:'🚚', label:'Fleet Status',  prompt:'Fleet status update - who is on the road?' },
  { icon:'📦', label:'Order Queue',   prompt:'Current order queue status?' },
  { icon:'⚠️', label:'Active Alerts', prompt:'List all active alerts.' },
  { icon:'📊', label:'Shift Summary', prompt:'Give me a shift summary.' },
];

async function gatherContext() {
  try {
    const o = await supabase.from('orders').select('*').limit(5);
    const f = await supabase.from('fleet').select('*').limit(5);
    const a = await supabase.from('alerts').select('*').eq('resolved', false).limit(5);
    return 'Orders:' + JSON.stringify(o.data) + ' Fleet:' + JSON.stringify(f.data) + ' Alerts:' + JSON.stringify(a.data);
  } catch { return 'No live data.'; }
}

export default function BoxFlowAIWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => { if (open) setUnread(0); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  if (HIDE_ON.includes(pathname)) return null;

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    setMessages(p => [...p, { role: 'user', content: text, time: now }]);
    setInput(''); setLoading(true);
    try {
      const ctx = await gatherContext();
      const hist = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/boxflow-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...hist, { role: 'user', content: text }], context: ctx }) });
      const data = await res.json();
      const aiText = data.content?.[0]?.text || data.error || 'No response.';
      setMessages(p => [...p, { role: 'assistant', content: aiText, time: new Date().toLocaleTimeString('en-US', { hour12: false }) }]);
      if (!open) setUnread(u => u + 1);
    } catch (e) { setMessages(p => [...p, { role: 'assistant', content: 'Error: ' + e.message, time: '' }]); }
    setLoading(false);
  };

  return (
    <div>
      {open && (
        <div style={{ position:'fixed', bottom:80, right:20, width:340, height:460, background:C.panel, border:'1px solid '+C.border, borderRadius:16, display:'flex', flexDirection:'column', zIndex:9999, boxShadow:'0 20px 60px rgba(0,0,0,0.6)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid '+C.border, background:C.bg }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:7, background:'linear-gradient(135deg,'+C.blueD+','+C.blue+')', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>⚡</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.white }}>BoxFlow AI</div>
                <div style={{ fontSize:9, color:C.green }}>● ONLINE</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:C.dim, fontSize:18, cursor:'pointer' }}>×</button>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'12px', display:'flex', flexDirection:'column', gap:8 }}>
            {messages.length === 0 && (
              <div style={{ textAlign:'center', padding:'20px 10px' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>⚡</div>
                <div style={{ fontSize:13, color:C.white, fontWeight:600, marginBottom:4 }}>BoxFlow AI</div>
                <div style={{ fontSize:11, color:C.dim, lineHeight:1.5, marginBottom:14 }}>Ask about fleet, orders, production or alerts.</div>
                {QUICK.map((q, i) => (
                  <button key={i} onClick={() => send(q.prompt)} style={{ background:'rgba(37,99,235,0.07)', border:'1px solid '+C.border, borderRadius:8, color:C.dim, fontSize:11, padding:'7px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:7, marginBottom:6, width:'100%' }}>
                    {q.icon} {q.label}
                  </button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:msg.role==='user'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'85%', background:msg.role==='user'?'rgba(37,99,235,0.1)':C.card, border:'1px solid '+(msg.role==='user'?C.blue+'40':C.border), borderRadius:msg.role==='user'?'12px 4px 12px 12px':'4px 12px 12px 12px', padding:'9px 12px' }}>
                  {msg.role==='assistant' && <div style={{ fontSize:8.5, color:C.blue, marginBottom:5 }}>BOXFLOW AI</div>}
                  <div style={{ fontSize:12, color:C.txt, lineHeight:1.6, whiteSpace:'pre-wrap' }}>{msg.content}</div>
                  {msg.time && <div style={{ fontSize:8.5, color:C.dim, marginTop:5 }}>{msg.time}</div>}
                </div>
              </div>
            ))}
            {loading && <div style={{ display:'flex', gap:5, padding:'8px 12px', background:C.card, border:'1px solid '+C.border, borderRadius:'4px 12px 12px 12px', width:'fit-content' }}><div style={{ width:6, height:6, borderRadius:'50%', background:C.blue }} /><div style={{ width:6, height:6, borderRadius:'50%', background:C.blue }} /><div style={{ width:6, height:6, borderRadius:'50%', background:C.blue }} /></div>}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding:'10px 12px', borderTop:'1px solid '+C.border }}>
            <div style={{ display:'flex', gap:8, background:C.card, border:'1px solid '+C.border, borderRadius:10, padding:'7px 10px', alignItems:'center' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter') { e.preventDefault(); send(input); }}} placeholder="Ask BoxFlow AI..." style={{ flex:1, background:'transparent', border:'none', outline:'none', color:C.txt, fontSize:12 }} />
              <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ width:28, height:28, borderRadius:7, background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.4)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13, opacity:loading||!input.trim()?0.4:1 }}>→</button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={{ position:'fixed', bottom:20, right:20, width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,'+C.blueD+','+C.blue+')', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, zIndex:9999, boxShadow:'0 4px 20px rgba(37,99,235,0.4)' }}>
        {open ? '×' : '⚡'}
        {!open && unread > 0 && <div style={{ position:'absolute', top:-3, right:-3, width:18, height:18, borderRadius:'50%', background:C.red, fontSize:10, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{unread}</div>}
      </button>
    </div>
  );
}`;
fs.writeFileSync('components/BoxFlowAIWidget.tsx', code, 'utf8');
console.log('Done:', code.split('\n').length, 'lines');