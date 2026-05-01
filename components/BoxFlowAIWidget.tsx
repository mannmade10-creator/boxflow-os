'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const HIDE_ON = ['/', '/login', '/medflow-login', '/propflow-login', '/classflow-login'];

const C = { bg:'#020917', panel:'#0B1628', card:'#0D1E35', border:'#152840', blue:'#2563EB', blueD:'#1d4ed8', green:'#22C55E', red:'#EF4444', dim:'#4A6090', txt:'#C8DDE9', white:'#EEF6FB', D:"'Outfit',sans-serif", M:"'Geist Mono',monospace" };

const QUICK = [
  { icon: '🚚', label: 'Fleet Status',  prompt: 'Give me a quick fleet status update. Who is on the road?' },
  { icon: '📦', label: 'Order Queue',   prompt: 'What orders are in the production queue? Any urgent ones?' },
  { icon: '⚠️', label: 'Active Alerts', prompt: 'List all active alerts that need immediate attention.' },
  { icon: '📊', label: 'Shift Summary', prompt: 'Give me a shift summary of production and deliveries.' },
];

async function gatherContext() {
  try {
    const ordersRes = await supabase.from('orders').select('*').limit(10).order('created_at', { ascending: false });
    const fleetRes  = await supabase.from('fleet').select('*').limit(10);
    const alertsRes = await supabase.from('alerts').select('*').eq('resolved', false).limit(5);
    const orders = ordersRes.data || [];
    const fleet  = fleetRes.data  || [];
    const alerts = alertsRes.data || [];
    const lines = [
      'RECENT ORDERS: ' + orders.length,
      ...orders.map((o: any) => '- ' + (o.customer_name || 'Unknown') + ': ' + o.status),
      'FLEET: ' + fleet.length + ' vehicles',
      ...fleet.map((f: any) => '- ' + (f.driver_name || 'Driver') + ': ' + f.status),
      'ALERTS: ' + alerts.length,
      ...alerts.map((a: any) => '- ' + a.level + ': ' + a.message),
    ];
    return lines.join('\n');
  } catch { return 'Live data temporarily unavailable.'; }
}

export default function BoxFlowAIWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) setUnread(0); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  if (HIDE_ON.includes(pathname)) return null;
  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    setMessages(prev => [...prev, { role: 'user', content: text, time: now }]);
    setInput(''); setLoading(true);
    try {
      const context = await gatherContext();
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/boxflow-ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...history, { role: 'user', content: text }], context }) });
      const data = await res.json();
      const aiText = data.content?.[0]?.text || data.error || 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiText, time: new Date().toLocaleTimeString('en-US', { hour12: false }) }]);
      if (!open) setUnread(u => u + 1);
    } catch (err: any) { setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message, time: '' }]); }
    setLoading(false);
  };
  return (
    <>
      {/* styles injected via globals */}
      {open && (
        <div style={{ position:'fixed', bottom:80, right:20, width:360, height:480, background:C.panel, border:'1px solid '+C.border, borderRadius:16, display:'flex', flexDirection:'column', zIndex:9999, boxShadow:'0 20px 60px rgba(0,0,0,0.6)', fontFamily:C.D, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid '+C.border, background:C.bg, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:7, background:'linear-gradient(135deg,'+C.blueD+','+C.blue+')', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>⚡</div>
              <div><div style={{ fontSize:13, fontWeight:700, color:C.white }}>BoxFlow AI</div><div style={{ fontSize:9, color:C.green, fontFamily:C.M, letterSpacing:1 }}>● ONLINE</div></div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:C.dim, fontSize:18, cursor:'pointer' }}>×</button>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:8 }}>
            {loading && (<div style={{ display:'flex', gap:5, padding:'8px 12px', background:C.card, border:'1px solid '+C.border, borderRadius:'4px 12px 12px 12px', width:'fit-content' }}>{[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.blue, animation:'pulse 1.2s ease '+(i*0.2)+'s infinite' }} />)}</div>)}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding:'10px 12px', borderTop:'1px solid '+C.border, flexShrink:0 }}>
            <div style={{ display:'flex', gap:8, background:C.card, border:'1px solid '+C.border, borderRadius:10, padding:'7px 10px', alignItems:'center' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key==='Enter') { e.preventDefault(); send(input); }}} placeholder='Ask BoxFlow AI...' style={{ flex:1, background:'transparent', border:'none', outline:'none', color:C.txt, fontSize:12, fontFamily:C.D }} />
              <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ width:28, height:28, borderRadius:7, background:'rgba(37,99,235,0.1)', border:'1px solid '+C.blue+'40', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13, opacity:loading||!input.trim()?0.4:1, flexShrink:0 }}>{loading ? <div style={{ width:12, height:12, border:'2px solid '+C.blue, borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite' }} /> : '→'}</button>
            </div>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={{ position:'fixed', bottom:20, right:20, width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,'+C.blueD+','+C.blue+')', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, zIndex:9999, boxShadow:'0 4px 20px rgba(37,99,235,0.4)' }}>
        {open ? '×' : '⚡'}
        {!open && unread > 0 && (<div style={{ position:'absolute', top:-3, right:-3, width:18, height:18, borderRadius:'50%', background:C.red, fontSize:10, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontFamily:C.M }}>{unread}</div>)}
      </button>
    </>
  );
}
