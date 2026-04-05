'use client'

import React, { useEffect, useState } from 'react'
import AppSidebar from '@/components/AppSidebar'
import { supabase } from '@/lib/supabase'

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setOrders(data || [])
      setLoading(false)
    })
  }, [])

  const total = orders.length
  const delivered = orders.filter(o => (o.status||'').toLowerCase().includes('deliver')).length
  const inTransit = orders.filter(o => (o.status||'').toLowerCase().includes('transit')).length
  const rush = orders.filter(o => ['rush','urgent'].includes((o.priority||'').toLowerCase())).length
  const onTimeRate = total > 0 ? Math.round((delivered / total) * 100) : 94
  const efficiency = 87
  const revenue = orders.length * 4200
  const avgDelivery = 2.4

  const weeklyData = [
    { day: 'Mon', orders: 12, delivered: 11, revenue: 48000 },
    { day: 'Tue', orders: 18, delivered: 16, revenue: 72000 },
    { day: 'Wed', orders: 15, delivered: 14, revenue: 60000 },
    { day: 'Thu', orders: 22, delivered: 19, revenue: 88000 },
    { day: 'Fri', orders: 28, delivered: 25, revenue: 112000 },
    { day: 'Sat', orders: 10, delivered: 10, revenue: 40000 },
    { day: 'Sun', orders: 8, delivered: 7, revenue: 32000 },
  ]

  const maxOrders = Math.max(...weeklyData.map(d => d.orders))
  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue))

  const productionStages = [
    { name: 'Paper Intake', efficiency: 98, color: '#22c55e' },
    { name: 'Die Cutting', efficiency: 72, color: '#ef4444' },
    { name: 'Printing', efficiency: 91, color: '#22c55e' },
    { name: 'Assembly', efficiency: 85, color: '#f59e0b' },
    { name: 'Packaging', efficiency: 94, color: '#22c55e' },
    { name: 'Shipping', efficiency: 88, color: '#3b82f6' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #050816 0%, #0b1220 100%)', padding: 20, gap: 24 }}>
      <AppSidebar active="analytics" />
      <main style={{ flex: 1, color: '#fff', minWidth: 0 }}>
        <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>Analytics</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 40, fontWeight: 900, color: '#fff' }}>Analytics Dashboard</h1>
        <p style={{ margin: '0 0 24px', color: '#94a3b8', fontSize: 15 }}>Performance metrics, efficiency tracking, and revenue insights.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 24 }}>
          <KPICard label="On-Time Rate" value={onTimeRate + '%'} sub="Delivery performance" color="#22c55e" trend="+2.4%" up />
          <KPICard label="Efficiency" value={efficiency + '%'} sub="Production output" color="#3b82f6" trend="+1.8%" up />
          <KPICard label="Est. Revenue" value={'$' + (revenue/1000).toFixed(0) + 'K'} sub="This cycle" color="#a855f7" trend="+12%" up />
          <KPICard label="Avg Delivery" value={avgDelivery + ' days'} sub="End to end" color="#f59e0b" trend="-0.3 days" up />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>Weekly Orders vs Delivered</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>7-day order fulfillment tracking</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
              {weeklyData.map((d, i) => (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
                    <div style={{ width: '45%', height: (d.orders / maxOrders * 160) + 'px', background: 'rgba(59,130,246,0.7)', borderRadius: '4px 4px 0 0', minHeight: 4 }} title={'Orders: ' + d.orders} />
                    <div style={{ width: '45%', height: (d.delivered / maxOrders * 160) + 'px', background: 'rgba(34,197,94,0.7)', borderRadius: '4px 4px 0 0', minHeight: 4 }} title={'Delivered: ' + d.delivered} />
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{d.day}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(59,130,246,0.7)' }} /><span style={{ fontSize: 12, color: '#94a3b8' }}>Orders</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(34,197,94,0.7)' }} /><span style={{ fontSize: 12, color: '#94a3b8' }}>Delivered</span></div>
            </div>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>Revenue This Week</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Daily revenue in USD</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
              {weeklyData.map((d) => (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 10, color: '#64748b' }}>${(d.revenue/1000).toFixed(0)}k</div>
                  <div style={{ width: '80%', height: (d.revenue / maxRevenue * 140) + 'px', background: 'linear-gradient(180deg, rgba(168,85,247,0.8), rgba(168,85,247,0.3))', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>Production Stage Efficiency</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Per-stage performance breakdown</div>
            <div style={{ display: 'grid', gap: 14 }}>
              {productionStages.map(stage => (
                <div key={stage.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 700 }}>{stage.name}</span>
                    <span style={{ color: stage.color, fontSize: 13, fontWeight: 900 }}>{stage.efficiency}%</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(148,163,184,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: stage.efficiency + '%', background: stage.color, borderRadius: 999, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>Order Status Breakdown</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Current order distribution</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ position: 'relative', width: 160, height: 160 }}>
                <svg viewBox="0 0 36 36" style={{ width: 160, height: 160, transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray={(delivered/Math.max(total,1)*100) + ' 100'} strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray={(inTransit/Math.max(total,1)*100) + ' 100'} strokeDashoffset={-(delivered/Math.max(total,1)*100)} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{total}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Total</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(34,197,94,0.1)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /><span style={{ color: '#cbd5e1', fontSize: 13 }}>Delivered</span></div>
                <span style={{ color: '#22c55e', fontWeight: 900 }}>{delivered}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(59,130,246,0.1)', borderRadius: 10, border: '1px solid rgba(59,130,246,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} /><span style={{ color: '#cbd5e1', fontSize: 13 }}>In Transit</span></div>
                <span style={{ color: '#3b82f6', fontWeight: 900 }}>{inTransit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(245,158,11,0.1)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /><span style={{ color: '#cbd5e1', fontSize: 13 }}>Rush Orders</span></div>
                <span style={{ color: '#f59e0b', fontWeight: 900 }}>{rush}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>Performance Summary</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Key metrics at a glance</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Jobs Completed', value: delivered.toString(), color: '#22c55e' },
              { label: 'Active Clients', value: '12', color: '#3b82f6' },
              { label: 'Trucks Active', value: '8', color: '#0ea5e9' },
              { label: 'Alerts Resolved', value: '24', color: '#a855f7' },
              { label: 'Avg Job Value', value: '$4,200', color: '#f59e0b' },
              { label: 'Downtime Today', value: '38 min', color: '#ef4444' },
              { label: 'On-Time Rate', value: onTimeRate + '%', color: '#22c55e' },
              { label: 'AI Actions', value: '16', color: '#8b5cf6' },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function KPICard({ label, value, sub, color, trend, up }: { label: string; value: string; sub: string; color: string; trend: string; up: boolean }) {
  return (
    <div style={{ background: 'rgba(15,23,42,0.92)', borderTop: '3px solid ' + color, borderRadius: 20, padding: 20 }}>
      <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color, marginBottom: 6 }}>{value}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>{sub}</div>
        <div style={{ fontSize: 12, color: up ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{trend}</div>
      </div>
    </div>
  )
}