'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
      @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
      @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      .prompt-chip{transition:all .15s;cursor:pointer}
      .prompt-chip:hover{background:rgba(20,210,194,.12)!important;border-color:rgba(20,210,194,.5)!important;color:#14D2C2!important}
      .send-btn{transition:all .15s}
      .send-btn:hover{background:rgba(20,210,194,.2)!important}
      .msg{animation:slideIn .3s ease both}
      .log-row{transition:background .12s;cursor:pointer}
      .log-row:hover{background:rgba(20,210,194,.04)!important}
    `;
    document.head.appendChild(style);
    return () => {
      try { document.head.removeChild(link); document.head.removeChild(style); } catch(e) {}
    };
  }, []);
  return null;
}

const Dot = ({ color, sz }) => (
  <span style={{ display:'inline-block', width:sz||7, height:sz||7, borderRadius:'50%', background:color, boxShadow:`0 0 7px ${color}`, animation:'pulseDot 2.2s ease-in-out infinite', flexShrink:0 }} />
);

const QUICK_PROMPTS = [
  { icon:'🌡', label:'Temp Risk Analysis',     prompt:'Analyze the current temperature monitoring status for all sensors. Identify any risks and recommend actions.' },
  { icon:'💊', label:'Inventory Alert',         prompt:'Review the current drug inventory. Flag any expired, expiring soon, low stock, or controlled substances that need attention.' },
  { icon:'❄️', label:'Cold Chain Report',       prompt:'Generate a cold chain delivery status report. Highlight any temperature issues, emergency deliveries, or delays.' },
  { icon:'🏥', label:'Hospital Supply Check',   prompt:'Assess the current hospital supply levels. Identify what needs restocking or maintenance attention.' },
  { icon:'📋', label:'Compliance Summary',      prompt:'Generate a pharmacy compliance summary covering USP <797>, USP <800>, FDA drug safety, and Joint Commission standards.' },
  { icon:'🚨', label:'Critical Alerts',         prompt:'List all current critical alerts across temperature monitoring, inventory, cold chain, and hospital logistics. Prioritize by severity.' },
  { icon:'📊', label:'Daily Operations Report', prompt:'Generate a comprehensive daily operations report for MedFlowOS covering all modules.' },
  { icon:'🔒', label:'Controlled Substances',   prompt:'Review all controlled substances in inventory. Check quantities, lot numbers, and flag anything requiring DEA attention.' },
];

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className="msg" style={{ display:'flex', gap:10, alignItems:'flex-start', justifyContent:isUser?'flex-end':'flex-start', marginBottom:16 }}>
      {!isUser && (
        <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>⚕</div>
      )}
      <div style={{ maxWidth:'78%', background:isUser?`rgba(20,210,194,.1)`:C.card, border:`1px solid ${isUser?C.teal+'40':C.border}`, borderRadius:isUser?'14px 4px 14px 14px':'4px 14px 14px 14px', padding:'14px 16px' }}>
        {!isUser && <div style={{ fontSize:9.5, color:C.teal, fontFamily:C.M, letterSpacing:1.5, marginBottom:8 }}>MEDFLOW AI</div>}
        <div style={{ fontSize:13, color:C.txt, fontFamily:C.D, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{msg.content}</div>
        {msg.time && <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, marginTop:8 }}>{msg.time}</div>}
      </div>
      {isUser && (
        <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${C.teal},${C.purple})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>U</div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="msg" style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:16 }}>
      <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>⚕</div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:'4px 14px 14px 14px', padding:'14px 20px', display:'flex', gap:6, alignItems:'center' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:C.teal, animation:`blink 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

export default function AIPanel() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Welcome to MedFlow AI — your pharmacy intelligence assistant.\n\nI can help you:\n• Analyze temperature sensor data and flag risks\n• Review inventory for expiring or low stock drugs\n• Generate compliance reports (USP <797>, <800>, FDA)\n• Summarize cold chain delivery status\n• Monitor hospital supply levels\n• Create incident reports and audit trails\n\nUse the quick prompts below or type your own question.',
    time: '',
  }]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [logs,     setLogs]     = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading]);

  const fetchLogs = useCallback(async () => {
    const { data } = await supabase.from('medflow_ai_logs').select('*').order('created_at', { ascending:false }).limit(20);
    setLogs(data || []);
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const gatherContext = async () => {
    const [t, inv, del, sup] = await Promise.all([
      supabase.from('medflow_sensor_readings').select('*').order('recorded_at', { ascending:false }).limit(20),
      supabase.from('medflow_inventory').select('*'),
      supabase.from('medflow_deliveries').select('*').order('created_at', { ascending:false }).limit(10),
      supabase.from('medflow_hospital_supplies').select('*'),
    ]);
    const fmt = (arr, fn) => (arr || []).map(fn).join('\n') || 'No data';
    return [
      'TEMPERATURE SENSORS:',
      fmt(t.data, r => `- ${r.sensor_name}: ${r.value}${r.unit} at ${new Date(r.recorded_at).toLocaleTimeString()}`),
      '',
      `DRUG INVENTORY (${inv.data?.length || 0} items):`,
      fmt(inv.data, d => `- ${d.drug_name}: qty=${d.quantity} expires=${d.expires_at||'N/A'} controlled=${d.controlled?'YES':'no'} refrigerated=${d.refrigerated?'YES':'no'}`),
      '',
      'COLD CHAIN DELIVERIES:',
      fmt(del.data, d => `- #${d.delivery_code}: ${d.origin} -> ${d.destination} | ${d.status} | priority=${d.priority} | temp=${d.temp_reading||'N/A'}F`),
      '',
      `HOSPITAL SUPPLIES (${sup.data?.length || 0} items):`,
      fmt(sup.data, s => `- ${s.item_name}: qty=${s.quantity} status=${s.status} location=${s.location||'N/A'}`),
    ].join('\n');
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const now = new Date().toLocaleTimeString('en-US', { hour12:false });
    setMessages(prev => [...prev, { role:'user', content:text, time:now }]);
    setInput('');
    setLoading(true);

    try {
      const context = await gatherContext();
      const history = messages.map(m => ({ role:m.role, content:m.content }));
      const fullPrompt = text + '\n\n--- LIVE PHARMACY DATA ---\n' + context;

      const res = await fetch('/api/medflow-ai', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          messages: [...history, { role:'user', content:fullPrompt }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error('API error: ' + errText);
      }

      const data = await res.json();

      // Parse Claude's response - content is array of blocks
      let aiText = 'No response generated.';
      if (data && data.content && Array.isArray(data.content)) {
        for (const block of data.content) {
          if (block.type === 'text' && block.text) {
            aiText = block.text;
            break;
          }
        }
      } else if (data && data.error) {
        aiText = 'Error: ' + data.error;
      }

      const replyTime = new Date().toLocaleTimeString('en-US', { hour12:false });
      setMessages(prev => [...prev, { role:'assistant', content:aiText, time:replyTime }]);

      // Log to Supabase
      await supabase.from('medflow_ai_logs').insert({ type:'chat', prompt:text, response:aiText });
      fetchLogs();

    } catch (err) {
      const replyTime = new Date().toLocaleTimeString('en-US', { hour12:false });
      setMessages(prev => [...prev, { role:'assistant', content:'Connection error: ' + err.message, time:replyTime }]);
    }

    setLoading(false);
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ height:'100vh', background:C.bg, color:C.txt, fontFamily:C.D, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Header */}
        <header style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:`1px solid ${C.border}`, background:C.panel, flexShrink:0, gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.tealD},${C.teal})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>⚕</div>
            <div>
              <h1 style={{ fontSize:20, fontWeight:800, color:C.white, letterSpacing:-.3, margin:0 }}>MedFlow AI</h1>
              <p style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, marginTop:1, marginBottom:0 }}>Powered by Claude · Live Supabase context</p>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 14px', background:`${C.green}10`, border:`1px solid ${C.green}30`, borderRadius:9 }}>
              <Dot color={C.green} sz={6} />
              <span style={{ fontSize:11, color:C.green, fontFamily:C.M, letterSpacing:.8 }}>AI ONLINE</span>
            </div>
            <button
              onClick={() => setShowLogs(!showLogs)}
              style={{ background:`rgba(167,139,250,.08)`, border:`1px solid ${C.purple}40`, borderRadius:9, color:C.purple, fontSize:12, fontWeight:600, padding:'8px 16px', cursor:'pointer', fontFamily:C.D }}>
              {showLogs ? 'Hide Logs' : `AI Logs (${logs.length})`}
            </button>
          </div>
        </header>

        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

          {/* Chat */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'24px 28px' }}>
              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div style={{ padding:'0 28px 14px', borderTop:`1px solid ${C.border}` }}>
              <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, letterSpacing:2, margin:'12px 0 10px' }}>QUICK PROMPTS</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {QUICK_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    className="prompt-chip"
                    onClick={() => sendMessage(p.prompt)}
                    disabled={loading}
                    style={{ background:`rgba(20,210,194,.05)`, border:`1px solid ${C.border}`, borderRadius:8, color:C.dim, fontSize:11.5, padding:'6px 12px', fontFamily:C.D, display:'flex', alignItems:'center', gap:5, opacity:loading?0.6:1 }}>
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div style={{ padding:'0 28px 24px' }}>
              <div style={{ display:'flex', gap:10, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'10px 14px', alignItems:'flex-end' }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder="Ask MedFlow AI anything about your pharmacy operations..."
                  rows={2}
                  style={{ flex:1, background:'transparent', border:'none', outline:'none', color:C.txt, fontSize:13, fontFamily:C.D, resize:'none', lineHeight:1.6 }}
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  style={{ width:40, height:40, borderRadius:10, background:`rgba(20,210,194,.1)`, border:`1px solid ${C.teal}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, cursor:'pointer', opacity: loading || !input.trim() ? 0.5 : 1 }}>
                  {loading
                    ? <div style={{ width:16, height:16, border:`2px solid ${C.teal}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
                    : '→'
                  }
                </button>
              </div>
              <div style={{ fontSize:10, color:C.dim, fontFamily:C.M, marginTop:6 }}>
                Press Enter to send · Shift+Enter for new line · AI reads live Supabase data
              </div>
            </div>
          </div>

          {/* Logs sidebar */}
          {showLogs && (
            <div style={{ width:320, borderLeft:`1px solid ${C.border}`, display:'flex', flexDirection:'column', overflow:'hidden', background:C.panel }}>
              <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:C.white, fontFamily:C.D, marginBottom:2 }}>AI Query Logs</div>
                <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M }}>Saved to Supabase</div>
              </div>
              <div style={{ flex:1, overflowY:'auto', padding:12 }}>
                {logs.length === 0
                  ? <div style={{ padding:20, textAlign:'center', color:C.dim, fontSize:12, fontFamily:C.M }}>No logs yet</div>
                  : logs.map((log, i) => (
                    <div key={log.id} className="log-row" style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 14px', marginBottom:8 }}>
                      <div style={{ fontSize:11, color:C.teal, fontFamily:C.M, marginBottom:5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Q: {log.prompt}</div>
                      <div style={{ fontSize:10.5, color:C.dim, fontFamily:C.M, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{log.response}</div>
                      <div style={{ fontSize:9.5, color:C.dim, fontFamily:C.M, marginTop:6 }}>{new Date(log.created_at).toLocaleString('en-US', { hour12:false })}</div>
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