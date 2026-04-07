'use client'
import React, { useState } from 'react'
import AppSidebar from '@/components/AppSidebar'

type DispatchLoad = {
  id: string
  orderNum: string
  client: string
  route: string
  priority: 'Urgent' | 'Rush' | 'Standard'
  status: 'Pending' | 'Assigned' | 'In Transit' | 'Delivered'
  truck: string
  driver: string
  eta: string
}

const initialLoads: DispatchLoad[] = [
  { id: '1', orderNum: 'ORD-1012', client: 'Retail Packaging Co', route: 'OKC → Dallas', priority: 'Urgent', status: 'Pending', truck: 'Unassigned', driver: 'Unassigned', eta: 'Awaiting dispatch' },
  { id: '2', orderNum: 'ORD-1011', client: 'Lopez Foods', route: 'Tulsa → Fort Worth', priority: 'Rush', status: 'Assigned', truck: 'TRK-305', driver: 'Angela Brooks', eta: '3h 10m' },
  { id: '3', orderNum: 'ORD-1010', client: 'Amazon Vendor', route: 'Norman → Kansas City', priority: 'Standard', status: 'In Transit', truck: 'TRK-201', driver: 'Marcus Hill', eta: '2h 05m' },
  { id: '4', orderNum: 'ORD-1009', client: 'ACME Corp', route: 'OKC → Little Rock', priority: 'Standard', status: 'Delivered', truck: 'TRK-114', driver: 'Derrick Stone', eta: 'Complete' },
  { id: '5', orderNum: 'ORD-1008', client: 'BoxMart', route: 'Edmond → Memphis', priority: 'Rush', status: 'Pending', truck: 'Unassigned', driver: 'Unassigned', eta: 'Awaiting dispatch' },
  { id: '6', orderNum: 'ORD-1007', client: 'SupplyHub', route: 'OKC → Houston', priority: 'Standard', status: 'Assigned', truck: 'TRK-412', driver: 'James Carter', eta: '4h 30m' },
  { id: '7', orderNum: 'ORD-1006', client: 'PackRight', route: 'Tulsa → St. Louis', priority: 'Urgent', status: 'In Transit', truck: 'TRK-518', driver: 'Lisa Monroe', eta: '1h 45m' },
  { id: '8', orderNum: 'ORD-1005', client: 'RetailCo', route: 'OKC → Denver', priority: 'Standard', status: 'Delivered', truck: 'TRK-305', driver: 'Angela Brooks', eta: 'Complete' },
]

const columns = ['Pending', 'Assigned', 'In Transit', 'Delivered'] as const

const columnColors: Record<string, string> = {
  'Pending': '#f59e0b',
  'Assigned': '#3b82f6',
  'In Transit': '#8b5cf6',
  'Delivered': '#22c55e',
}

const priorityColors: Record<string, { bg: string; color: string }> = {
  'Urgent': { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5' },
  'Rush': { bg: 'rgba(245,158,11,0.15)', color: '#fde68a' },
  'Standard': { bg: 'rgba(148,163,184,0.15)', color: '#cbd5e1' },
}

export default function DispatchPage() {
  const [loads, setLoads] = useState<DispatchLoad[]>(initialLoads)
  const [selected, setSelected] = useState<string | null>(null)

  function moveLoad(id: string, newStatus: DispatchLoad['status']) {
    setLoads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
    setSelected(null)
  }

  const selectedLoad = loads.find(l => l.id === selected)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e', padding: 20, gap: 24 }}>
      <AppSidebar active="dispatch" />
      <main style={{ flex: 1, color: '#fff', minWidth: 0 }}>
        <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>Dispatch</div>
        <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 4, color: '#fff' }}>Dispatch Board</h1>
        <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: 14 }}>Manage and track all active loads across your fleet.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {columns.map(col => {
            const count = loads.filter(l => l.status === col).length
            return (
              <div key={col} style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid ' + columnColors[col], borderRadius: 16, padding: '16px 20px' }}>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{col}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: columnColors[col] }}>{count}</div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
          {columns.map(col => (
            <div key={col}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 14px', background: columnColors[col] + '15', border: '1px solid ' + columnColors[col] + '30', borderRadius: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: columnColors[col] }} />
                <span style={{ color: columnColors[col], fontWeight: 800, fontSize: 13 }}>{col}</span>
                <span style={{ marginLeft: 'auto', background: columnColors[col] + '25', color: columnColors[col], borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                  {loads.filter(l => l.status === col).length}
                </span>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {loads.filter(l => l.status === col).map(load => (
                  <div
                    key={load.id}
                    onClick={() => setSelected(selected === load.id ? null : load.id)}
                    style={{
                      background: selected === load.id ? 'rgba(37,99,235,0.12)' : 'rgba(15,23,42,0.92)',
                      border: selected === load.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(148,163,184,0.14)',
                      borderRadius: 16,
                      padding: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ fontWeight: 900, color: '#fff', fontSize: 14 }}>{load.orderNum}</div>
                      <div style={{ padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: priorityColors[load.priority].bg, color: priorityColors[load.priority].color }}>
                        {load.priority}
                      </div>
                    </div>

                    <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{load.client}</div>
                    <div style={{ color: '#60a5fa', fontSize: 12, marginBottom: 10 }}>📍 {load.route}</div>

                    <div style={{ borderTop: '1px solid rgba(148,163,184,0.1)', paddingTop: 10, display: 'grid', gap: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b', fontSize: 12 }}>Truck</span>
                        <span style={{ color: load.truck === 'Unassigned' ? '#ef4444' : '#cbd5e1', fontSize: 12, fontWeight: 700 }}>{load.truck}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b', fontSize: 12 }}>Driver</span>
                        <span style={{ color: load.driver === 'Unassigned' ? '#ef4444' : '#cbd5e1', fontSize: 12, fontWeight: 700 }}>{load.driver}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b', fontSize: 12 }}>ETA</span>
                        <span style={{ color: '#22c55e', fontSize: 12, fontWeight: 700 }}>{load.eta}</span>
                      </div>
                    </div>

                    {selected === load.id && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(148,163,184,0.1)' }}>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Move to</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {columns.filter(c => c !== col).map(c => (
                            <button
                              key={c}
                              onClick={e => { e.stopPropagation(); moveLoad(load.id, c as DispatchLoad['status']) }}
                              style={{
                                padding: '5px 10px',
                                background: columnColors[c] + '20',
                                border: '1px solid ' + columnColors[c] + '40',
                                borderRadius: 8,
                                color: columnColors[c],
                                fontWeight: 700,
                                fontSize: 11,
                                cursor: 'pointer',
                              }}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}