'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PropFlowDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

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
  const openWO = workOrders.filter(w => w.status === 'Open' || w.status === 'In Progress').length;
  const latePayments = payments.filter(p => p.status === 'Late' || p.status === 'Pending').length;

  const bg = '#0A0800'; const panel = '#120F02'; const card = '#0D0A00';
  const border = '#2A2000'; const amber = '#F59E0B'; const green = '#22C55E';
  const red = '#EF4444'; const blue = '#4F8EF7'; const dim = '#6B5A30';
  const txt = '#C8DDE9'; const white = '#EEF6FB'; const M = "'Geist Mono',monospace";
  const D = "'Outfit',sans-serif";

  const statusColor = (s: string) => ({ Occupied: green, Vacant: blue, Maintenance: amber, Reserved: '#A855F7' }[s] || dim);
  const priorityColor = (p: string) => ({ Urgent: red, High: amber, Normal: blue, Low: dim }[p] || dim);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: dim, fontFamily: D }}>Loading PropFlow OS...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: txt }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🏠</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: white }}>PropFlow<span style={{ color: amber }}>OS</span></span>
          <span style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 2, marginLeft: 8 }}>PENN STATION APARTMENTS</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: dim, fontFamily: M }}>1920 Heritage Park Dr · OKC</span>
          <button onClick={() => { supabase.auth.signOut(); router.push('/propflow-login'); }}
            style={{ background: 'none', border: 'none', color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>Sign out</button>
        </div>
      </header>

      <main style={{ padding: '24px', maxWidth: 1300, margin: '0 auto' }}>

        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: white, margin: 0, letterSpacing: -0.5 }}>Property Dashboard</h1>
          <p style={{ fontSize: 13, color: dim, marginTop: 4 }}>Penn Station Apartments — 17 Buildings · 200+ Units</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Units', value: units.length, color: blue, icon: '🏢' },
            { label: 'Occupied', value: occupied, color: green, icon: '✅' },
            { label: 'Open Work Orders', value: openWO, color: amber, icon: '🔧' },
            { label: 'Late / Pending Payments', value: latePayments, color: red, icon: '💰' },
          ].map((k, i) => (
            <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{k.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 12, color: dim, marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

          <div style={{ background: card, border: '1px solid ' + border, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: white, marginBottom: 14 }}>Units — {units.length} Total</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 300, overflowY: 'auto' }}>
              {units.map((u, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: panel, borderRadius: 8, border: '1px solid ' + border }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: white }}>{u.unit_number}</div>
                    <div style={{ fontSize: 11, color: dim }}>{u.type} · {u.sqft} sqft · {u.bedrooms}bd/{u.bathrooms}ba</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: amber, fontWeight: 600 }}>${u.rent}/mo</div>
                    <div style={{ fontSize: 10, color: statusColor(u.status), fontWeight: 700, marginTop: 2 }}>{u.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: card, border: '1px solid ' + border, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: white, marginBottom: 14 }}>Work Orders — {workOrders.length} Total</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 300, overflowY: 'auto' }}>
              {workOrders.map((w, i) => (
                <div key={i} style={{ padding: '8px 12px', background: panel, borderRadius: 8, border: '1px solid ' + border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: white, flex: 1, marginRight: 8 }}>{w.title}</div>
                    <div style={{ fontSize: 10, color: priorityColor(w.priority), fontWeight: 700, flexShrink: 0 }}>{w.priority}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <div style={{ fontSize: 10, color: dim }}>{w.category} · {w.assigned_to || 'Unassigned'}</div>
                    <div style={{ fontSize: 10, color: w.status === 'Completed' ? green : amber }}>{w.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          <div style={{ background: card, border: '1px solid ' + border, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: white, marginBottom: 14 }}>Tenants — {tenants.length} Total</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 280, overflowY: 'auto' }}>
              {tenants.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: panel, borderRadius: 8, border: '1px solid ' + border }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: white }}>{t.first_name} {t.last_name}</div>
                    <div style={{ fontSize: 11, color: dim }}>{t.email} · Lease ends {t.lease_end}</div>
                  </div>
                  <div style={{ fontSize: 10, color: t.status === 'Active' ? green : amber, fontWeight: 700 }}>{t.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: card, border: '1px solid ' + border, borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: white, marginBottom: 14 }}>Announcements</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 280, overflowY: 'auto' }}>
              {announcements.map((a, i) => (
                <div key={i} style={{ padding: '10px 12px', background: panel, borderRadius: 8, border: '1px solid ' + border }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: white }}>{a.title}</div>
                    <div style={{ fontSize: 10, color: amber, fontFamily: M }}>{a.category}</div>
                  </div>
                  <div style={{ fontSize: 11, color: dim, lineHeight: 1.5 }}>{a.body}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}