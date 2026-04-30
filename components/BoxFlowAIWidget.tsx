'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const C = {
  bg:     '#020917',
  panel:  '#0B1628',
  card:   '#0D1E35',
  border: '#152840',
  blue:   '#2563EB',
  blueD:  '#1d4ed8',
  green:  '#22C55E',
  amber:  '#F59E0B',
  red:    '#EF4444',
  dim:    '#4A6090',
  txt:    '#C8DDE9',
  white:  '#EEF6FB',
  D:      "'Outfit',sans-serif",
  M:      "'Geist Mono',monospace",
};

const QUICK = [
  { icon: '🚚', label: 'Fleet Status',    prompt: 'Give me a quick fleet status update. Who is on the road and what are their ETAs?' },
  { icon: '📦', label: 'Order Queue',     prompt: 'What orders are currently in the production queue? Any urgent ones?' },
  { icon: '⚠️', label: 'Active Alerts',   prompt: 'List all active alerts and issues that need immediate attention.' },
  { icon: '📊', label: 'Shift Summary',   prompt: 'Give me a shift summary — production completed, deliveries made, and any issues.' },
];

async function gatherContext() {
  try {
    const [orders, fleet, alerts] = await Promise.all([
      supabase.from('orders').select('*').limit(10).order('created_at', { ascending: false }),
      supabase.from('fleet').select('*').limit(10),
      supabase.from('alerts').select('*').eq('resolved', false).limit(5),
    ]);
    const fmt = (arr: any[], fn: (r: any) => string) => (arr || []).map(fn).join('\n') || 'No data';
    return [
      'RECENT ORDERS:',
      fmt(orders.data || [], o => `- #${o.id}: ${o.customer_name || 'Unknown'} | ${o.status} | ${o.created_at}`),
      '',
      'FLEET STATUS:',
      fmt(fleet.data || [], f => `- ${f.driver_name || 'Driver'}: ${f.status} | Location: ${f.current_location || 'Unknown'}`),
      '',
      'ACTIVE ALERTS:',
      fmt(alerts.data || [], a => `- ${a.level}: ${a.message} | ${a.created_at}`),
    ].join('\n');
  } catch {
    return 'Live data temporarily unavailable.';
  }
}

export default function BoxFlowAIWidget() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    const userMsg = { role: 'user', content: text, time: now };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = await gatherContext();
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/boxflow-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: text }], context }),
      });

      const data = await res.json();
      let aiText = 'Sorry, I could not generate a response.';
      if (data.content?.[0]?.text) aiText = data.content[0].text;
      else if (data.error) aiText = `Error: ${data.error}`;

      const replyTime = new Date().toLocaleTimeString('en-US', { hour12: false });
      setMessages(prev => [...prev, { role: 'assistant', content: aiText, time: replyTime }]);
      if (!open) setUnread(u => u + 1);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Connection error: ${err.message}`, time: new Date().toLocaleTimeString() }]);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes widgetIn { from{opacity:0;transform:scale(0.85) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes msgIn    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
        .bfai-msg { animation: msgIn .25s ease both; }
        .bfai-quick:hover { background: rgba(37,99,235,0.15) !important; border-color: rgba(37,99,235,0.5) !important; color: #EEF6FB !important; }
      `}</style>

      {/* Chat Window */}
      {open && (
        <div style={{ position:'fixed', bottom:80, right:20, width:360, height:480, background:C.panel, border:`1px solid ${C.border}`, borderRadius:16, display:'flex', flexDirection:'column', zIndex:9999, boxShadow:'0 20px 60px rgba(0,0,0,0.6)', animation:'widgetIn .25s ease both', fontFamily:C.D, overflow:'hidden' }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:`1px solid ${C.border}`, background:C.bg, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:7, background:`linear-gradient(135deg,${C.blueD},${C.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>⚡</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.white }}>BoxFlow AI</div>
                <div style={{ fontSize:9, color:C.green, fontFamily:C.M, letterSpacing:1 }}>● ONLINE</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:C.dim, fontSize:18, cursor:'pointer', lineHeight:1 }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:8 }}>
            {messages.length === 0 && (
              <div style={{ textAlign:'center', padding:'20px 10px' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>⚡</div>
                <div style={{ fontSize:13, color:C.white, fontWeight:600, marginBottom:4 }}>BoxFlow AI</div>
                <div style={{ fontSize:11, color:C.dim, lineHeight:1.5 }}>Ask me anything about your operations — fleet, orders, production, or alerts.</div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:14 }}>
                  {QUICK.map((q, i) => (
                    <button key={i} className="bfai-quick" onClick={() => send(q.prompt)}
                      style={{ background:`rgba(37,99,235,0.07)`, border:`1px solid ${C.border}`, borderRadius:8, color:C.dim, fontSize:11, padding:'7px 10px', cursor:'pointer', fontFamily:C.D, display:'flex', alignItems:'center', gap:7, textAlign:'left' }}>
                      <span>{q.icon}</span><span>{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="bfai-msg" style={{ display:'flex', flexDirection:'column', alignItems:msg.role==='user'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'85%', background:msg.role==='user'?`rgba(37,99,235,0.15)`:C.card, border:`1px solid ${msg.role==='user'?C.blue+'40':C.border}`, borderRadius:msg.role==='user'?'12px 4px 12px 12px':'4px 12px 12px 12px', padding:'9px 12px' }}>
                  {msg.role === 'assistant' && <div style={{ fontSize:8.5, color:C.blue, fontFamily:C.M, letterSpacing:1.5, marginBottom:5 }}>BOXFLOW AI</div>}
                  <div style={{ fontSize:12, color:C.txt, lineHeight:1.6, whiteSpace:'pre-wrap' }}>{msg.content}</div>
                  {msg.time && <div style={{ fontSize:8.5, color:C.dim, fontFamily:C.M, marginTop:5 }}>{msg.time}</div>}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display:'flex', gap:6, padding:'8px 12px', background:C.card, border:`1px solid ${C.border}`, borderRadius:'4px 12px 12px 12px', width:'fit-content' }}>
                {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.blue, animation:`pulse 1.2s ease ${i*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding:'10px 12px', borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
            <div style={{ display:'flex', gap:8, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'7px 10px', alignItems:'flex-end' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask BoxFlow AI..."
                style={{ flex:1, background:'transparent', border:'none', outline:'none', color:C.txt, fontSize:12, fontFamily:C.D }}
              />
              <button onClick={() => send(input)} disabled={loading || !input.trim()}
                style={{ width:28, height:28, borderRadius:7, background:`rgba(37,99,235,0.15)`, border:`1px solid ${C.blue}40`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13, opacity:loading||!input.trim()?0.4:1, flexShrink:0 }}>
                {loading ? <div style={{ width:12, height:12, border:`2px solid ${C.blue}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite' }} /> : '→'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position:'fixed', bottom:20, right:20, width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg,${C.blueD},${C.blue})`, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, zIndex:9999, boxShadow:`0 4px 20px rgba(37,99,235,0.4)`, transition:'transform .15s', fontFamily:C.D }}>
        {open ? '×' : '⚡'}
        {!open && unread > 0 && (
          <div style={{ position:'absolute', top:-3, right:-3, width:18, height:18, borderRadius:'50%', background:C.red, fontSize:10, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontFamily:C.M }}>
            {unread}
          </div>
        )}
      </button>
    </>
  );
}