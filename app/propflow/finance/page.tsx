'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PropFlowFinance() {
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/propflow-login'); return; }
      supabase.from('propflow_payments').select('*').order('created_at', { ascending: false }).then(({ data }) => {
        setPayments(data || []);
        setLoading(false);
      });
    });
  }, []);

  const bg = '#0A0800'; const panel = '#120F02'; const card = '#0D0A00';
  const border = '#2A2000'; const amber = '#F59E0B'; const green = '#22C55E';
  const red = '#EF4444'; const blue = '#4F8EF7'; const dim = '#6B5A30';
  const white = '#EEF6FB'; const D = "'Outfit',sans-serif"; const M = "'Geist Mono',monospace";

  const statusColor = (s: string) => ({ Paid: green, Pending: amber, Late: red, Failed: dim }[s] || dim);
  const statuses = ['All', 'Paid', 'Pending', 'Late', 'Failed'];

  const filtered = filter === 'All' ? payments : payments.filter(p => p.status === filter);
  const totalCollected = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'Pending' || p.status === 'Late').reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalLate = payments.filter(p => p.status === 'Late').reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) return <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dim, fontFamily: D }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: '#C8DDE9' }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/propflow/dashboard')} style={{ background: 'none', border: 'none', color: dim, cursor: 'pointer', fontSize: 13, fontFamily: D }}>← Dashboard</button>
          <span style={{ color: border }}>|</span>
          <span style={{ fontWeight: 700, color: white, fontSize: 15 }}>💰 Finance</span>
        </div>
      </header>

      <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: white, margin: 0 }}>Finance Dashboard</h1>
          <p style={{ fontSize: 13, color: dim, marginTop: 4 }}>Payment tracking and rent roll</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Collected', value: '$' + totalCollected.toLocaleString(), color: green, icon: '✅' },
            { label: 'Pending / Late', value: '$' + totalPending.toLocaleString(), color: amber, icon: '⏳' },
            { label: 'Late Payments', value: '$' + totalLate.toLocaleString(), color: red, icon: '🚨' },
          ].map((k, i) => (
            <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{k.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: k.color, fontFamily: M }}>{k.value}</div>
              <div style={{ fontSize: 12, color: dim, marginTop: 4 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: white }}>Payment Records</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid ' + (filter === s ? amber : border), background: filter === s ? amber + '20' : 'transparent', color: filter === s ? amber : dim, fontSize: 12, cursor: 'pointer', fontFamily: D }}>{s}</button>
            ))}
          </div>
        </div>

        <div style={{ background: card, border: '1px solid ' + border, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '10px 16px', borderBottom: '1px solid ' + border, background: panel }}>
            {['Amount', 'Type', 'Status', 'Due Date', 'Paid Date'].map((h, i) => (
              <div key={i} style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1 }}>{h.toUpperCase()}</div>
            ))}
          </div>
          {filtered.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '12px 16px', borderBottom: '1px solid ' + border, background: i % 2 === 0 ? card : '#0B0900', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: amber }}>${p.amount?.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#C8DDE9' }}>{p.type}</div>
              <div style={{ padding: '3px 10px', borderRadius: 16, background: statusColor(p.status) + '20', border: '1px solid ' + statusColor(p.status) + '50', fontSize: 10, color: statusColor(p.status), fontWeight: 700, width: 'fit-content' }}>{p.status}</div>
              <div style={{ fontSize: 11, color: dim }}>{p.due_date || '—'}</div>
              <div style={{ fontSize: 11, color: p.paid_date ? green : dim }}>{p.paid_date || '—'}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: dim }}>No payments found</div>
          )}
        </div>
      </main>
    </div>
  );
}