'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const C = {
  bg:     '#020917',
  panel:  '#0B1628',
  card:   '#0D1E35',
  border: '#152840',
  borderH:'#1E3D6A',
  blue:   '#2563EB',
  blueD:  '#1d4ed8',
  green:  '#22C55E',
  amber:  '#F59E0B',
  red:    '#EF4444',
  purple: '#A78BFA',
  dim:    '#4A6090',
  txt:    '#C8DDE9',
  white:  '#EEF6FB',
  D:      "'Outfit',sans-serif",
  M:      "'Geist Mono',monospace",
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
      @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
      .msg{animation:msgIn .3s ease both}
      .quick-btn:hover{background:rgba(37,99,235,0.12)!important;border-color:rgba(37,99,235,0.5)!important;color:#EEF6FB!important}
      .action-card:hover{border-color:rgba(37,99,235,0.4)!important;box-shadow:0 4px 20px rgba(37,99,235,0.1)!important}
      .log-row:hover{background:rgba(37,99,235,0.04)!important}
    `;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(link); document.head.removeChild(style); } catch(e) {} };
  }, []);
  return null;
}

const QUICK_PROMPTS = [
  { icon:'🚚', label:'Fleet Status',          prompt:'Give me a complete fleet status update — all drivers, locations, loads, and ETAs.' },
  { icon:'📦', label:'Production Queue',       prompt:'What is the current production queue status? List orders by priority and flag any urgent ones.' },
  { icon:'⚠️', label:'Active Alerts',          prompt:'List all active alerts across the platform. Prioritize by severity and suggest immediate actions.' },
  { icon:'🤖', label:'AI Auto-Dispatch',       prompt:'Analyze available trucks and pending orders. Suggest optimal truck assignments for maximum efficiency.' },
  { icon:'📊', label:'Shift Summary',          prompt:'Generate a complete shift summary — production output, deliveries completed, drivers on road, and any issues.' },
  { icon:'🎯', label:'On-Time Performance',    prompt:'Analyze delivery performance. What is the on-time delivery rate and which routes are causing delays?' },
  { icon:'📋', label:'Roll Stock Check',       prompt:'Check roll stock levels. Flag any rolls approaching splice limits and recommend reorder quantities.' },
  { icon:'👥', label:'Driver Performance',     prompt:'Summarize driver performance for the current shift — miles driven, deliveries completed, and any issues.' },
];

const ACTION_BLOCKS = [
  { icon:'📋', title:'Create Work Order',     desc:'AI drafts a work order based on your description', color:C.blue,   action:'create_work_order' },
  { icon:'🚚', title:'Optimize Dispatch',     desc:'AI analyzes loads and suggests best truck assignments', color:C.green,  action:'optimize_dispatch' },
  { icon:'📊', title:'Generate Report',       desc:'AI compiles a full operations report', color:C.purple, action:'generate_report' },
  { icon:'🔔', title:'Alert Analysis',        desc:'AI reviews all alerts and prioritizes action items', color:C.amber,  action:'alert_analysis' },
];

async function gatherContext() {
  try {
    const [ordersRes, fleetRes, alertsRes, hrRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(15),
      supabase.from('fleet').select('*').limit(20),
      supabase.from('alerts').select('*').eq('resolved', false).limit(10),
      supabase.from('profiles').select('id,email,role').limit(10),
    ]);

    const fmt = (arr: any[], fn: (r: any) => string) => (arr || []).map(fn).join('\n') || 'No data available';

    return [
      `PRODUCTION ORDERS (${ordersRes.data?.length || 0} recent):`,
      fmt(ordersRes.data || [], o => `- #${o.order_number || o.id}: ${o.customer_name || 'Customer'} | Status: ${o.status} | Priority: ${o.priority || 'Normal'}`),
      '',
      `FLEET STATUS (${fleetRes.data?.length || 0} vehicles):`,
      fmt(fleetRes.data || [], f => `- ${f.driver_name || 'Driver'}: ${f.status} | Truck: ${f.truck_id || 'N/A'} | Location: ${f.current_location || 'Unknown'} | Load: ${f.load_description || 'Empty'}`),
      '',
      `ACTIVE ALERTS (${alertsRes.data?.length || 0}):`,
      fmt(alertsRes.data || [], a => `- [${a.level || 'INFO'}] ${a.message} | Location: ${a.location || 'N/A'} | Time: ${a.created_at}`),
    ].join('\n');
  } catch {
    return 'Live data temporarily unavailable — responding based on general knowledge.';
  }
}

function MessageBubble({ msg }: { msg: any }) {
  const isUser = msg.role === 'user';
  return (
    <div className="msg" style={{ display:'flex', gap:10, alignItems:'flex-start', justifyContent:isUser?'flex-end':'flex-start', marginBottom:14 }}>
      {!isUser && (
        <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${C.blueD},${C.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>⚡</div>
      )}
      <div style={{ maxWidth:'78%', background:isUser?`rgba(37,99,235,0.1)`:C.card, border:`1px solid ${isUser?C.blue+'40':C.border}`, borderRadius:isUser?'14px 4px 14px 14px':'4px 14px 14px 14px', padding:'13px 15px' }}>
        {!isUser && <div style={{ fontSize:9, color:C.blue, fontFamily:C.M, letterSpacing:1.5, marginBottom:7 }}>BOXFLOW AI</div>}
        <div style={{ fontSize:13, color:C.txt, fontFamily:C.D, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{msg.content}</div>
        {msg.time && <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, marginTop:7 }}>{msg.time}</div>}
      </div>
      {isUser && (
        <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${C.blue},${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>U</div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="msg" style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:14 }}>
      <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${C.blueD},${C.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>⚡</div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:'4px 14px 14px 14px', padding:'13px 18px', display:'flex', gap:5, alignItems:'center' }}>
        {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.blue, animation:`pulse 1.2s ease ${i*0.2}s infinite` }} />)}
      </div>
    </div>
  );
}

export default function BoxFlowAIPage() {
  const [messages,   setMessages]   = useState<any[]>([{
    role: 'assistant',
    content: 'Welcome to BoxFlow AI — your intelligent operations assistant.\n\nI have real-time access to your production queue, fleet positions, dispatch assignments, and alerts. Use the quick prompts below or ask me anything about your operations.',
    time: '',
  }]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showLogs,  setShowLogs]  = useState(false);
  const [logs,      setLogs]      = useState<any[]>([]);
  const [tab,       setTab]       = useState<'chat'|'actions'>('chat');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const fetchLogs = useCallback(async () => {
    const { data } = await supabase.from('ai_logs').select('*').order('created_at', { ascending: false }).limit(20);
    setLogs(data || []);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    setMessages(prev => [...prev, { role: 'user', content: text, time: now }]);
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
      let aiText = 'No response generated.';
      if (data.content?.[0]?.text) aiText = data.content[0].text;
      else if (data.error) aiText = `Error: ${data.error}`;

      const replyTime = new Date().toLocaleTimeString('en-US', { hour12: false });
      setMessages(prev => [...prev, { role: 'assistant', content: aiText, time: replyTime }]);

      // Log to Supabase
      try {
        await supabase.from('ai_logs').insert({ product: 'boxflow', prompt: text, response: aiText });
        fetchLogs();
      } catch {}

    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Connection error: ${err.message}`, time: new Date().toLocaleTimeString() }]);
    }
    setLoading(false);
  };

  const triggerAction = (action: string, title: string) => {
    const prompts: Record<string, string> = {
      create_work_order:  'I need to create a work order. Ask me what the issue is, what equipment is affected, the priority, and who should be assigned.',
      optimize_dispatch:  'Analyze all pending orders and available trucks. Give me your top recommendations for truck assignments to maximize on-time delivery.',
      generate_report:    'Generate a comprehensive operations report covering: production output, fleet performance, delivery rates, active alerts, and any issues requiring management attention.',
      alert_analysis:     'Review all active alerts. Categorize them by severity, explain what each one means, and give me a prioritized action plan.',
    };
    setTab('chat');
    sendMessage(prompts[action] || title);
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ height:'100vh', background:C.bg, color:C.txt, fontFamily:C.D, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.blueD},${C.blue})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>⚡</div>
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, color:C.white, letterSpacing:-.3, margin:0 }}>BoxFlow AI</h1>
              <p style={{ fontSize:10, color:C.dim, fontFamily:C.M, marginTop:1, marginBottom:0 }}>Powered by Gemini · Live Supabase context</p>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Tabs */}
            <div style={{ display:'flex', background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:3 }}>
              {(['chat','actions'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding:'6px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:C.D, background:tab===t?C.blue:'transparent', color:tab===t?'#fff':C.dim, transition:'all .15s', textTransform:'capitalize' }}>
                  {t === 'chat' ? '💬 Chat' : '⚡ Actions'}
                </button>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', background:`${C.green}10`, border:`1px solid ${C.green}30`, borderRadius:8 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:C.green, boxShadow:`0 0 5px ${C.green}` }} />
              <span style={{ fontSize:10, color:C.green, fontFamily:C.M, letterSpacing:.8 }}>AI ONLINE</span>
            </div>
            <button onClick={() => setShowLogs(!showLogs)}
              style={{ background:`rgba(167,139,250,0.08)`, border:`1px solid ${C.purple}40`, borderRadius:8, color:C.purple, fontSize:12, fontWeight:600, padding:'7px 14px', cursor:'pointer', fontFamily:C.D }}>
              {showLogs ? 'Hide Logs' : `Logs (${logs.length})`}
            </button>
          </div>
        </header>

        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

          {/* Main content */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

            {/* CHAT TAB */}
            {tab === 'chat' && (
              <>
                <div style={{ flex:1, overflowY:'auto', padding:'20px 28px' }}>
                  {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                  {loading && <TypingIndicator />}
                  <div ref={bottomRef} />
                </div>

                {/* Quick prompts */}
                <div style={{ padding:'0 28px 12px', borderTop:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, letterSpacing:2, margin:'10px 0 8px' }}>QUICK PROMPTS</div>
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                    {QUICK_PROMPTS.map((p, i) => (
                      <button key={i} className="quick-btn" onClick={() => sendMessage(p.prompt)} disabled={loading}
                        style={{ background:`rgba(37,99,235,0.05)`, border:`1px solid ${C.border}`, borderRadius:8, color:C.dim, fontSize:11, padding:'5px 10px', fontFamily:C.D, display:'flex', alignItems:'center', gap:5, cursor:'pointer', opacity:loading?0.5:1 }}>
                        <span>{p.icon}</span><span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div style={{ padding:'0 28px 22px' }}>
                  <div style={{ display:'flex', gap:10, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'9px 13px', alignItems:'flex-end' }}>
                    <textarea value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                      placeholder="Ask BoxFlow AI anything about your operations..."
                      rows={2}
                      style={{ flex:1, background:'transparent', border:'none', outline:'none', color:C.txt, fontSize:13, fontFamily:C.D, resize:'none', lineHeight:1.6 }} />
                    <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                      style={{ width:38, height:38, borderRadius:9, background:`rgba(37,99,235,0.1)`, border:`1px solid ${C.blue}40`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16, flexShrink:0, opacity:loading||!input.trim()?0.4:1 }}>
                      {loading ? <div style={{ width:14, height:14, border:`2px solid ${C.blue}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite' }} /> : '→'}
                    </button>
                  </div>
                  <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, marginTop:5 }}>Enter to send · Shift+Enter for new line · AI reads live Supabase data</div>
                </div>
              </>
            )}

            {/* ACTIONS TAB */}
            {tab === 'actions' && (
              <div style={{ flex:1, overflowY:'auto', padding:'24px 28px' }}>
                <div style={{ marginBottom:24 }}>
                  <h2 style={{ fontSize:18, fontWeight:800, color:C.white, margin:0, marginBottom:6 }}>AI Action Blocks</h2>
                  <p style={{ fontSize:13, color:C.dim }}>One-click AI actions that analyze your live data and take intelligent steps.</p>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
                  {ACTION_BLOCKS.map((a, i) => (
                    <div key={i} className="action-card" onClick={() => triggerAction(a.action, a.title)}
                      style={{ background:C.card, border:`1px solid ${a.color}25`, borderRadius:14, padding:'20px 22px', cursor:'pointer', transition:'all .2s', animation:`fadeUp .4s ease ${i*60}ms both` }}>
                      <div style={{ fontSize:28, marginBottom:12 }}>{a.icon}</div>
                      <div style={{ fontSize:15, fontWeight:700, color:a.color, marginBottom:5 }}>{a.title}</div>
                      <div style={{ fontSize:12, color:C.dim, lineHeight:1.5 }}>{a.desc}</div>
                      <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:5, height:5, borderRadius:'50%', background:a.color }} />
                        <span style={{ fontSize:9.5, color:a.color, fontFamily:C.M, letterSpacing:1 }}>CLICK TO ACTIVATE</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop:28 }}>
                  <h3 style={{ fontSize:15, fontWeight:700, color:C.white, marginBottom:14 }}>Sentinel — Error Monitoring</h3>
                  <div style={{ background:C.card, border:`1px solid ${C.green}25`, borderRadius:14, padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:C.green, boxShadow:`0 0 6px ${C.green}`, animation:'pulse 2s infinite' }} />
                        <span style={{ fontSize:13, fontWeight:700, color:C.white }}>Sentinel Active</span>
                      </div>
                      <div style={{ fontSize:12, color:C.dim }}>Monitoring platform health · Checks every 90 seconds · Auto-flags anomalies</div>
                    </div>
                    <button onClick={() => sendMessage('Run a Sentinel diagnostic. Check for any platform errors, slow queries, or anomalies in the last hour and report your findings.')}
                      style={{ background:`rgba(34,197,94,0.1)`, border:`1px solid ${C.green}40`, borderRadius:9, color:C.green, fontSize:12, fontWeight:600, padding:'8px 16px', cursor:'pointer', fontFamily:C.D, flexShrink:0 }}>
                      Run Diagnostic →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logs sidebar */}
          {showLogs && (
            <div style={{ width:300, borderLeft:`1px solid ${C.border}`, display:'flex', flexDirection:'column', overflow:'hidden', background:C.panel }}>
              <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:2 }}>AI Query Logs</div>
                <div style={{ fontSize:10, color:C.dim, fontFamily:C.M }}>Saved to Supabase</div>
              </div>
              <div style={{ flex:1, overflowY:'auto', padding:10 }}>
                {logs.length === 0
                  ? <div style={{ padding:20, textAlign:'center', color:C.dim, fontSize:12, fontFamily:C.M }}>No logs yet</div>
                  : logs.map((log, i) => (
                    <div key={log.id || i} className="log-row" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:9, padding:'11px 13px', marginBottom:7 }}>
                      <div style={{ fontSize:10.5, color:C.blue, fontFamily:C.M, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Q: {log.prompt}</div>
                      <div style={{ fontSize:10, color:C.dim, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as const }}>{log.response}</div>
                      <div style={{ fontSize:9, color:C.dim, fontFamily:C.M, marginTop:5 }}>{new Date(log.created_at).toLocaleString('en-US', { hour12: false })}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}