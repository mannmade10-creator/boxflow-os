'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PropFlowCommunity() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: 'General', priority: 'Normal' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/propflow-login'); return; }
      loadData();
    });
  }, []);

  async function loadData() {
    const { data } = await supabase.from('propflow_announcements').select('*').order('created_at', { ascending: false });
    setAnnouncements(data || []);
    setLoading(false);
  }

  async function createAnnouncement() {
    if (!form.title || !form.body) return;
    setSaving(true);
    await supabase.from('propflow_announcements').insert(form);
    setForm({ title: '', body: '', category: 'General', priority: 'Normal' });
    setShowForm(false);
    setSaving(false);
    loadData();
  }

  const bg = '#0A0800'; const panel = '#120F02'; const card = '#0D0A00';
  const border = '#2A2000'; const amber = '#F59E0B'; const green = '#22C55E';
  const red = '#EF4444'; const blue = '#4F8EF7'; const dim = '#6B5A30';
  const white = '#EEF6FB'; const D = "'Outfit',sans-serif"; const M = "'Geist Mono',monospace";

  const categoryColor = (c: string) => ({ Maintenance: amber, Finance: green, Community: blue, Emergency: red, General: dim }[c] || dim);
  const categoryIcon = (c: string) => ({ Maintenance: '🔧', Finance: '💰', Community: '🎉', Emergency: '🚨', General: '📢' }[c] || '📢');
  const inp = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid ' + border, background: '#080600', color: white, fontSize: 13, fontFamily: D, outline: 'none', boxSizing: 'border-box' as const };

  if (loading) return <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dim, fontFamily: D }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: '#C8DDE9' }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/propflow/dashboard')} style={{ background: 'none', border: 'none', color: dim, cursor: 'pointer', fontSize: 13, fontFamily: D }}>← Dashboard</button>
          <span style={{ color: border }}>|</span>
          <span style={{ fontWeight: 700, color: white, fontSize: 15 }}>📢 Community</span>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: amber, border: 'none', borderRadius: 9, color: '#000', fontSize: 13, fontWeight: 700, padding: '8px 16px', cursor: 'pointer', fontFamily: D }}>+ New Announcement</button>
      </header>

      <main style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: white, margin: 0 }}>Community Announcements</h1>
          <p style={{ fontSize: 13, color: dim, marginTop: 4 }}>Penn Station Apartments — resident communications</p>
        </div>

        {showForm && (
          <div style={{ background: card, border: '1px solid ' + amber + '40', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: white, marginBottom: 14 }}>New Announcement</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 5 }}>TITLE</div>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Announcement title" style={inp} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 5 }}>CATEGORY</div>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inp }}>
                  {['General', 'Maintenance', 'Finance', 'Community', 'Emergency'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 5 }}>PRIORITY</div>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ ...inp }}>
                  {['Normal', 'High', 'Urgent'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 5 }}>MESSAGE</div>
              <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} rows={4} placeholder="Full announcement message..." style={{ ...inp, resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={createAnnouncement} disabled={saving} style={{ background: amber, border: 'none', borderRadius: 8, color: '#000', fontSize: 13, fontWeight: 700, padding: '9px 20px', cursor: 'pointer', fontFamily: D, opacity: saving ? 0.6 : 1 }}>{saving ? 'Publishing...' : 'Publish Announcement'}</button>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: '1px solid ' + border, borderRadius: 8, color: dim, fontSize: 13, padding: '9px 20px', cursor: 'pointer', fontFamily: D }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {announcements.map((a, i) => (
            <div key={i} style={{ background: card, border: '1px solid ' + border, borderLeft: '3px solid ' + categoryColor(a.category), borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{categoryIcon(a.category)}</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: white }}>{a.title}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ padding: '3px 10px', borderRadius: 12, background: categoryColor(a.category) + '20', fontSize: 10, color: categoryColor(a.category), fontWeight: 700, fontFamily: M }}>{a.category?.toUpperCase()}</div>
                  {a.priority !== 'Normal' && <div style={{ padding: '3px 10px', borderRadius: 12, background: red + '20', fontSize: 10, color: red, fontWeight: 700, fontFamily: M }}>{a.priority?.toUpperCase()}</div>}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#C8DDE9', lineHeight: 1.6, marginBottom: 8 }}>{a.body}</div>
              <div style={{ fontSize: 10, color: dim, fontFamily: M }}>{new Date(a.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          ))}
          {announcements.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: dim }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📢</div>
              <div>No announcements yet. Create your first one!</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}