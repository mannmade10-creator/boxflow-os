'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PropFlowUnits() {
  const router = useRouter();
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/propflow-login'); return; }
      supabase.from('propflow_units').select('*').order('unit_number').then(({ data }) => {
        setUnits(data || []);
        setLoading(false);
      });
    });
  }, []);

  const bg = '#0A0800'; const panel = '#120F02'; const card = '#0D0A00';
  const border = '#2A2000'; const amber = '#F59E0B'; const green = '#22C55E';
  const red = '#EF4444'; const blue = '#4F8EF7'; const dim = '#6B5A30';
  const white = '#EEF6FB'; const D = "'Outfit',sans-serif";

  const statusColor = (s: string) => ({ Occupied: green, Vacant: blue, Maintenance: amber, Reserved: '#A855F7' }[s] || dim);
  const statuses = ['All', 'Occupied', 'Vacant', 'Maintenance', 'Reserved'];

  const filtered = units.filter(u => {
    const matchFilter = filter === 'All' || u.status === filter;
    const matchSearch = !search || u.unit_number?.toLowerCase().includes(search.toLowerCase()) || u.type?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dim, fontFamily: D }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: '#C8DDE9' }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/propflow/dashboard')} style={{ background: 'none', border: 'none', color: dim, cursor: 'pointer', fontSize: 13, fontFamily: D }}>← Dashboard</button>
          <span style={{ color: border }}>|</span>
          <span style={{ fontWeight: 700, color: white, fontSize: 15 }}>🏢 Units</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search units..." style={{ background: card, border: '1px solid ' + border, borderRadius: 8, padding: '6px 12px', color: white, fontSize: 12, fontFamily: D, outline: 'none', width: 200 }} />
        </div>
      </header>

      <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: white, margin: 0 }}>Unit Management</h1>
            <p style={{ fontSize: 13, color: dim, marginTop: 4 }}>{units.length} total units · {units.filter(u => u.status === 'Vacant').length} vacant</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid ' + (filter === s ? amber : border), background: filter === s ? amber + '20' : 'transparent', color: filter === s ? amber : dim, fontSize: 12, cursor: 'pointer', fontFamily: D }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {filtered.map((u, i) => (
            <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: white }}>{u.unit_number}</div>
                  <div style={{ fontSize: 11, color: dim, marginTop: 2 }}>Building {u.building} · Floor {u.floor}</div>
                </div>
                <div style={{ padding: '3px 10px', borderRadius: 20, background: statusColor(u.status) + '20', border: '1px solid ' + statusColor(u.status) + '50', fontSize: 10, color: statusColor(u.status), fontWeight: 700 }}>{u.status}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Type', value: u.type },
                  { label: 'Sq Ft', value: u.sqft + ' sqft' },
                  { label: 'Bed/Bath', value: u.bedrooms + 'bd / ' + u.bathrooms + 'ba' },
                  { label: 'Rent', value: '$' + u.rent + '/mo' },
                ].map((d, j) => (
                  <div key={j} style={{ background: panel, borderRadius: 6, padding: '6px 10px' }}>
                    <div style={{ fontSize: 9, color: dim, letterSpacing: 1, marginBottom: 2 }}>{d.label.toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: white, fontWeight: 600 }}>{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: dim }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏢</div>
            <div style={{ fontSize: 14 }}>No units found matching your filter</div>
          </div>
        )}
      </main>
    </div>
  );
}