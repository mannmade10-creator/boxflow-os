'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PropFlowTenants() {
  const router = useRouter();
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/propflow-login'); return; }
      supabase.from('propflow_tenants').select('*').order('last_name').then(({ data }) => {
        setTenants(data || []);
        setLoading(false);
      });
    });
  }, []);

  const bg = '#0A0800'; const panel = '#120F02'; const card = '#0D0A00';
  const border = '#2A2000'; const amber = '#F59E0B'; const green = '#22C55E';
  const red = '#EF4444'; const dim = '#6B5A30'; const white = '#EEF6FB';
  const D = "'Outfit',sans-serif"; const M = "'Geist Mono',monospace";

  const statusColor = (s: string) => ({ Active: green, Pending: '#4F8EF7', Inactive: dim, Eviction: red }[s] || dim);
  const statuses = ['All', 'Active', 'Pending', 'Inactive', 'Eviction'];

  const filtered = tenants.filter(t => {
    const matchFilter = filter === 'All' || t.status === filter;
    const matchSearch = !search || (t.first_name + ' ' + t.last_name).toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const daysUntil = (date: string) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    return diff;
  };

  if (loading) return <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dim, fontFamily: D }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: '#C8DDE9' }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/propflow/dashboard')} style={{ background: 'none', border: 'none', color: dim, cursor: 'pointer', fontSize: 13, fontFamily: D }}>← Dashboard</button>
          <span style={{ color: border }}>|</span>
          <span style={{ fontWeight: 700, color: white, fontSize: 15 }}>👥 Tenants</span>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenants..." style={{ background: card, border: '1px solid ' + border, borderRadius: 8, padding: '6px 12px', color: white, fontSize: 12, fontFamily: D, outline: 'none', width: 220 }} />
      </header>

      <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: white, margin: 0 }}>Tenant Management</h1>
            <p style={{ fontSize: 13, color: dim, marginTop: 4 }}>{tenants.filter(t => t.status === 'Active').length} active tenants</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid ' + (filter === s ? amber : border), background: filter === s ? amber + '20' : 'transparent', color: filter === s ? amber : dim, fontSize: 12, cursor: 'pointer', fontFamily: D }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ background: card, border: '1px solid ' + border, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr', padding: '10px 16px', borderBottom: '1px solid ' + border, background: panel }}>
            {['Tenant', 'Contact', 'Lease Period', 'Rent', 'Status', 'Days Left'].map((h, i) => (
              <div key={i} style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1 }}>{h.toUpperCase()}</div>
            ))}
          </div>
          {filtered.map((t, i) => {
            const days = daysUntil(t.lease_end);
            const urgentLease = days !== null && days < 60;
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1.5fr 1fr 1fr', padding: '12px 16px', borderBottom: '1px solid ' + border, background: i % 2 === 0 ? card : '#0B0900', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: white }}>{t.first_name} {t.last_name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#C8DDE9' }}>{t.email}</div>
                  <div style={{ fontSize: 11, color: dim }}>{t.phone}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#C8DDE9' }}>{t.lease_start}</div>
                  <div style={{ fontSize: 11, color: urgentLease ? amber : dim }}>to {t.lease_end}</div>
                </div>
                <div style={{ fontSize: 13, color: amber, fontWeight: 600 }}>${t.rent_amount}/mo</div>
                <div style={{ padding: '3px 10px', borderRadius: 20, background: statusColor(t.status) + '20', border: '1px solid ' + statusColor(t.status) + '50', fontSize: 10, color: statusColor(t.status), fontWeight: 700, width: 'fit-content' }}>{t.status}</div>
                <div style={{ fontSize: 12, color: urgentLease ? red : dim, fontWeight: urgentLease ? 700 : 400 }}>{days !== null ? days + 'd' : '—'}</div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: dim }}>No tenants found</div>
          )}
        </div>
      </main>
    </div>
  );
}