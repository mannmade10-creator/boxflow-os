const fs = require('fs');
const code = `'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PropFlowDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/propflow-login'); return; }
      loadData();
    });
  }, []);

  async function loadData() {
    const [u, t, w, p, a] = await Promise.all([
      supabase.from('propflow_units').select('*').order('unit_number'),
      supabase.from('propflow_tenants').select('*').order('last_name'),
      supabase.from('propflow_work_orders').select('*').order('created_at', { ascending: false }),
      supabase.from('propflow_payments').select('*').order('created_at', { ascending: false }),
      supabase.from('propflow_announcements').select('*').order('created_at', { ascending: false }),
    ]);
    setUnits(u.data || []);
    setTenants(t.data || []);
    setWorkOrders(w.data || []);
    setPayments(p.data || []);
    setAnnouncements(a.data || []);
    setLoading(false);
  }

  const occupied = units.filter(u => u.status === 'Occupied').length;
  const vacant = units.filter(u => u.status === 'Vacant').length;
  const openWO = workOrders.filter(w => w.status === 'Open' || w.status === 'In Progress').length;
  const latePayments = payments.filter(p => p.status === 'Late' || p.status === 'Pending').length;

  const C = {
    bg: '#0A0800', panel: '#120F02', card: '#0D0A00',
    border: '#2A2000', amber: '#F59E0B', green: '#22C55E',
    red: '#EF4444', blue: '#4F8EF7', purple: '#A855F7',
    dim: '#6B5A30', txt: '#C8DDE9', white: '#EEF6FB',
  };

  const statusColor = (s) => ({ Occupied:'#22C55E', Vacant:'#4F8EF7', Maintenance:'#F59E0B', Reserved:'#A855F7' }[s] || '#6B5A30');
  const priorityColor = (p) => ({ Urgent:'#EF4444', High:'#F59E0B', Normal:'#4F8EF7', Low:'#6B5A30' }[p] || '#6B5A30');
  const payColor = (s) => ({ Paid:'#22C55E', Pending:'#F59E0B', Late:'#EF4444', Failed:'#6B5A30' }[s] || '#6B5A30');

  if (loading) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontSize:13, color:C.dim, fontFamily:"'Outfit',sans-serif" }}>Loading PropFlow OS...</div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Outfit',sans-serif", color:C.txt }}>
      {/* Header */}
      <header style={{ background:C.panel, borderBottom:'1px solid '+C.border, padding:'0 24px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ fontSize:20 }}>🏠</div>
          <span style={{ fontWeight:800, fontSize:16, color:C.white }}>PropFlow<span style={{ color:C.amber }}>OS</span></span>
          <span style={{ fontSize:10, color:C.dim, fontFamily:"'Geist Mono',monospace", letterSpacing:2, marginLeft:8 }}>PENN STATION APARTMENTS</span>
        </div>
        <button onClick={() => { supabase.auth.signOut(); router.push('/propflow-login'); }}
          style={{ background:'none', border:'none', color:C.dim, fontSize:13, cursor:'pointer' }}>Sign out</button>
      </header>

      <main style={{ padding:'24px', maxWidth:1200, margin:'0 auto' }}>
        {/* KPI Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
          {[
            { label:'Total Units', value:units.length, color:C.blue, icon:'🏢' },
            { label:'Occupied', value:occupied, color:C.green, icon:'✅' },
            { label:'Open Work Orders', value:openWO, color:C.amber, icon:'🔧' },
            { label:'Late Payments', value:latePayments, color:C.red, icon:'💰' },
          ].map((k,i) => (
            <div key={i} style={{ background:C.card, border:'1px solid '+C.border, borderRadius:12, padding:'18px 20px' }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{k.icon}</div>
              <div style={{ fontSize:28, fontWeight:800, color:k.color }}>{k.value}</div>
              <div style={{ fontSize:12, color:C.dim, marginTop:4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
          {/* Units */}
          <div style={{ background:C.card, border:'1px solid '+C.border, borderRadius:14, padding:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.white, marginBottom:14 }}>Units Overview</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:280, overflowY:'auto' }}>
              {units.map((u,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', background:C.panel, borderRadius:8, border:'1px solid '+C.border }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.white }}>{u.unit_number}</div>
                    <div style={{ fontSize:11, color:C.dim }}>{u.type} · {u.sqft} sqft</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:C.amber }}>${u.rent}/mo</div>
                    <div style={{ fontSize:10, color:statusColor(u.status), fontWeight:600 }}>{u.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Orders */}
          <div style={{ background:C.card, border:'1px solid '+C.border, borderRadius:14, padding:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.white, marginBottom:14 }}>Work Orders</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:280, overflowY:'auto' }}>
              {workOrders.map((w,i) => (
                <div key={i} style={{ padding:'8px 10px', background:C.panel, borderRadius:8, border:'1px solid '+C.border }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div style={{ fontSize:12, fontWeight:600, color:C.white, flex:1, marginRight:8 }}>{w.title}</div>
                    <div style={{ fontSize:10, color:priorityColor(w.priority), fontWeight:700, flexShrink:0 }}>{w.priority}</div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                    <div style={{ fontSize:10, color:C.dim }}>{w.category} · {w.assigned_to || 'Unassigned'}</div>
                    <div style={{ fontSize:10, color:w.status==='Completed'?C.green:C.amber }}>{w.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {/* Tenants */}
          <div style={{ background:C.card, border:'1px solid '+C.border, borderRadius:14, padding:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.white, marginBottom:14 }}>Tenants</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:280, overflowY:'auto' }}>
              {tenants.map((t,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', background:C.panel, borderRadius:8, border:'1px solid '+C.border }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.white }}>{t.first_name} {t.last_name}</div>
                    <div style={{ fontSize:11, color:C.dim }}>{t.email}</div>
                  </div>
                  <div style={{ fontSize:10, color:t.status==='Active'?C.green:C.amber, fontWeight:600 }}>{t.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div style={{ background:C.card, border:'1px solid '+C.border, borderRadius:14, padding:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.white, marginBottom:14 }}>Announcements</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:280, overflowY:'auto' }}>
              {announcements.map((a,i) => (
                <div key={i} style={{ padding:'8px 10px', background:C.panel, borderRadius:8, border:'1px solid '+C.border }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.white, marginBottom:4 }}>{a.title}</div>
                  <div style={{ fontSize:11, color:C.dim, lineHeight:1.5 }}>{a.body}</div>
                  <div style={{ fontSize:10, color:C.amber, marginTop:4 }}>{a.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;
fs.writeFileSync('app/propflow/dashboard/page.tsx', code, 'utf8');
console.log('Done:', code.split('\n').length, 'lines');