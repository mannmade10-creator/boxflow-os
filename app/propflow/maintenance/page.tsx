'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PropFlowMaintenance() {
  const router = useRouter();
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'General', priority: 'Normal', assigned_to: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/propflow-login'); return; }
      loadData();
    });
  }, []);

  async function loadData() {
    const { data } = await supabase.from('propflow_work_orders').select('*').order('created_at', { ascending: false });
    setWorkOrders(data || []);
    setLoading(false);
  }

  async function createWorkOrder() {
    if (!form.title) return;
    setSaving(true);
    await supabase.from('propflow_work_orders').insert({ ...form, status: 'Open' });
    setForm({ title: '', description: '', category: 'General', priority: 'Normal', assigned_to: '' });
    setShowForm(false);
    setSaving(false);
    loadData();
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('propflow_work_orders').update({ status, completed_at: status === 'Completed' ? new Date().toISOString() : null }).eq('id', id);
    loadData();
  }

  const bg = '#0A0800'; const panel = '#120F02'; const card = '#0D0A00';
  const border = '#2A2000'; const amber = '#F59E0B'; const green = '#22C55E';
  const red = '#EF4444'; const blue = '#4F8EF7'; const dim = '#6B5A30';
  const white = '#EEF6FB'; const D = "'Outfit',sans-serif"; const M = "'Geist Mono',monospace";

  const priorityColor = (p: string) => ({ Urgent: red, High: amber, Normal: blue, Low: dim }[p] || dim);
  const statusColor = (s: string) => ({ Open: red, 'In Progress': amber, Completed: green, Cancelled: dim }[s] || dim);
  const statuses = ['All', 'Open', 'In Progress', 'Completed', 'Cancelled'];
  const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid ' + border, background: '#080600', color: white, fontSize: 13, fontFamily: D, outline: 'none', boxSizing: 'border-box' as const };

  const filtered = filter === 'All' ? workOrders : workOrders.filter(w => w.status === filter);

  if (loading) return <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dim, fontFamily: D }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: '#C8DDE9' }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/propflow/dashboard')} style={{ background: 'none', border: 'none', color: dim, cursor: 'pointer', fontSize: 13, fontFamily: D }}>← Dashboard</button>
          <span style={{ color: border }}>|</span>
          <span style={{ fontWeight: 700, color: white, fontSize: 15 }}>🔧 Maintenance</span>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: amber, border: 'none', borderRadius: 9, color: '#000', fontSize: 13, fontWeight: 700, padding: '8px 16px', cursor: 'pointer', fontFamily: D }}>+ New Work Order</button>
      </header>

      <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: white, margin: 0 }}>Work Orders</h1>
            <p style={{ fontSize: 13, color: dim, marginTop: 4 }}>{workOrders.filter(w => w.status === 'Open').length} open · {workOrders.filter(w => w.status === 'In Progress').length} in progress</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid ' + (filter === s ? amber : border), background: filter === s ? amber + '20' : 'transparent', color: filter === s ? amber : dim, fontSize: 12, cursor: 'pointer', fontFamily: D }}>{s}</button>
            ))}
          </div>
        </div>

        {showForm && (
          <div style={{ background: card, border: '1px solid ' + amber + '40', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: white, marginBottom: 14 }}>New Work Order</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 5 }}>TITLE</div>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief description" style={inp} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 5 }}>ASSIGNED TO</div>
                <input value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} placeholder="Technician name" style={inp} />
              </div>
              <div>
                <div style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 5 }}>CATEGORY</div>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inp }}>
                  {['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'General', 'Emergency'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 5 }}>PRIORITY</div>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ ...inp }}>
                  {['Low', 'Normal', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 5 }}>DESCRIPTION</div>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Details about the issue..." style={{ ...inp, resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={createWorkOrder} disabled={saving} style={{ background: amber, border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 700, padding: '9px 20px', cursor: 'pointer', fontFamily: D, opacity: saving ? 0.6 : 1 }}>{saving ? 'Saving...' : 'Create Work Order'}</button>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid ' + border, borderRadius: 8, color: dim, fontSize: 13, padding: '9px 20px', cursor: 'pointer', fontFamily: D }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((w, i) => (
            <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: white }}>{w.title}</div>
                  <div style={{ padding: '2px 8px', borderRadius: 12, background: priorityColor(w.priority) + '20', fontSize: 9, color: priorityColor(w.priority), fontWeight: 700, fontFamily: M, letterSpacing: 1 }}>{w.priority?.toUpperCase()}</div>
                </div>
                <div style={{ fontSize: 12, color: dim }}>{w.category} · Assigned to: {w.assigned_to || 'Unassigned'}</div>
                {w.description && <div style={{ fontSize: 11, color: '#8A9AB0', marginTop: 4 }}>{w.description}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{ padding: '4px 12px', borderRadius: 16, background: statusColor(w.status) + '20', border: '1px solid ' + statusColor(w.status) + '50', fontSize: 11, color: statusColor(w.status), fontWeight: 600 }}>{w.status}</div>
                {w.status !== 'Completed' && w.status !== 'Cancelled' && (
                  <select onChange={e => updateStatus(w.id, e.target.value)} defaultValue=""
                    style={{ background: panel, border: '1px solid ' + border, borderRadius: 7, color: dim, fontSize: 11, padding: '5px 8px', cursor: 'pointer', fontFamily: D }}>
                    <option value="" disabled>Update</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: dim }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔧</div>
              <div>No work orders found</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}