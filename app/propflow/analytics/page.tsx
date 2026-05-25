'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const BLUE = '#4f8ef7'
const GREEN = '#22c55e'
const PURPLE = '#a855f7'
const AMBER = '#f59e0b'
const RED = '#ef4444'

type Tab = 'overview' | 'units' | 'leases' | 'maintenance' | 'vacancy' | 'financial'

async function dbGet(table: string, params: string) {
  if (!SB_URL || !SB_KEY) return []

  try {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default function AnalyticsPage() {
  const [units, setUnits] = useState<any[]>([])
  const [tenants, setTenants] = useState<any[]>([])
  const [leases, setLeases] = useState<any[]>([])
  const [maintenance, setMaintenance] = useState<any[]>([])
  const [statements, setStatements] = useState<any[]>([])
  const [vacancyTasks, setVacancy] = useState<any[]>([])
  const [ledger, setLedger] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  useEffect(() => {
    Promise.all([
      dbGet('pf_units', 'select=*&order=unit_number.asc'),
      dbGet('pf_tenants', 'select=*&status=eq.active'),
      dbGet('pf_leases', 'select=*&status=eq.active'),
      dbGet('pf_maintenance_requests', 'select=*&order=created_at.desc'),
      dbGet('pf_billing_statements', 'select=*&order=statement_month.desc&limit=100'),
      dbGet('pf_vacancy_tasks', 'select=*&order=created_at.asc'),
      dbGet('pf_accounting_ledger', 'select=*&order=transaction_date.desc&limit=200'),
    ]).then(([u, t, l, m, s, v, led]) => {
      setUnits(u)
      setTenants(t)
      setLeases(l)
      setMaintenance(m)
      setStatements(s)
      setVacancy(v)
      setLedger(led)
      setLoading(false)
    })
  }, [])

  const demoUnits = [
    { unit_number: '1900-A', type: 'A1', sqft: 504, bedrooms: 1, bathrooms: 1, rent_amount: 725, status: 'Occupied' },
    { unit_number: '1902-A', type: 'A2', sqft: 640, bedrooms: 1, bathrooms: 1, rent_amount: 795, status: 'Occupied' },
    { unit_number: '1904-B', type: 'A3', sqft: 816, bedrooms: 1, bathrooms: 1, rent_amount: 875, status: 'Occupied' },
    { unit_number: '1906-A', type: 'A4', sqft: 800, bedrooms: 1, bathrooms: 1, rent_amount: 850, status: 'Occupied' },
    { unit_number: '1908-B', type: 'B2', sqft: 973, bedrooms: 2, bathrooms: 2, rent_amount: 1050, status: 'Occupied' },
    { unit_number: '1910-A', type: 'B3', sqft: 1034, bedrooms: 2, bathrooms: 2, rent_amount: 1095, status: 'Vacant' },
    { unit_number: '1912-C', type: 'C1', sqft: 1240, bedrooms: 3, bathrooms: 2, rent_amount: 1295, status: 'Occupied' },
  ]

  const visibleUnits = units.length > 0 ? units : demoUnits

  const totalUnits = visibleUnits.length || 96
  const occupied = visibleUnits.filter((u) => u.status === 'Occupied').length || 75
  const vacant = visibleUnits.filter((u) => u.status === 'Vacant').length || 21
  const maintenanceUnits = visibleUnits.filter((u) => u.status === 'Maintenance').length || 0
  const occupancyRate = totalUnits > 0 ? Math.round((occupied / totalUnits) * 100) : 0

  const now = new Date()
  const in60 = new Date(now.getTime() + 60 * 86400000)
  const in30 = new Date(now.getTime() + 30 * 86400000)

  const expiringIn60 = leases.filter((l) => {
    const end = new Date(l.lease_end)
    return end <= in60 && end >= now
  })

  const expiringIn30 = leases.filter((l) => {
    const end = new Date(l.lease_end)
    return end <= in30 && end >= now
  })

  const openMaint = maintenance.filter((m) => m.status === 'open').length
  const inProgressMaint = maintenance.filter((m) => m.status === 'in_progress').length
  const urgentMaint = maintenance.filter((m) => m.priority === 'urgent' && m.status !== 'completed').length

  const maintByCat: Record<string, number> = {}
  maintenance.forEach((m) => {
    const cat = m.category ?? 'general'
    maintByCat[cat] = (maintByCat[cat] ?? 0) + 1
  })

  const totalIncome = ledger
    .filter((l) => l.type === 'income')
    .reduce((a, l) => a + Number(l.amount || 0), 0)

  const totalExpenses = ledger
    .filter((l) => l.type === 'expense')
    .reduce((a, l) => a + Number(l.amount || 0), 0)

  const noi = totalIncome - totalExpenses

  const avgRent =
    visibleUnits.length > 0
      ? visibleUnits.reduce((a, u) => a + Number(u.rent_amount || 0), 0) / visibleUnits.length
      : 825

  const potentialRent = totalUnits * avgRent
  const vacancyLoss = vacant * avgRent
  const collectionRate = potentialRent > 0 ? Math.round((totalIncome / potentialRent) * 100) : 0

  const vacantUnits = visibleUnits.filter((u) => u.status === 'Vacant')

  const statCard = (label: string, value: any, sub: string, color: string, onClick?: () => void) => (
    <div
      key={label}
      onClick={onClick}
      style={{
        background: '#070f1f',
        border: `1px solid ${color}25`,
        borderRadius: 14,
        padding: '18px 18px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 6, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color, marginBottom: 3 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#334155' }}>{sub}</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif', paddingBottom: 60 }}>
      <style>{`
        .tab-btn{transition:all 0.15s;cursor:pointer;border:none;font-family:system-ui}
        .row{transition:background 0.12s}
        .row:hover{background:rgba(79,142,247,0.04)!important}
      `}</style>

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(79,142,247,0.12)',
          background: '#070f1f',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <Link href="/propflow/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/assets/logo.png" alt="PropFlow" style={{ height: 36 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: BLUE }}>PropFlow OS</div>
            <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>Business Analytics</div>
          </div>
        </Link>

        <div style={{ fontSize: 11, color: '#334155' }}>
          Last updated{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'units', label: '🏠 Units' },
            { id: 'leases', label: '📄 Leases' },
            { id: 'maintenance', label: `🔧 Maintenance${urgentMaint > 0 ? ` (${urgentMaint} urgent)` : ''}` },
            { id: 'vacancy', label: '🔑 Vacancy Readiness' },
            { id: 'financial', label: '💰 Financial' },
          ].map((t) => (
            <button
              key={t.id}
              className="tab-btn"
              onClick={() => setActiveTab(t.id as Tab)}
              style={{
                padding: '9px 18px',
                borderRadius: 10,
                background: activeTab === t.id ? 'linear-gradient(135deg,#1d4ed8,#4f8ef7)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeTab === t.id ? BLUE : 'rgba(255,255,255,0.08)'}`,
                color: activeTab === t.id ? '#fff' : '#64748b',
                fontWeight: 700,
                fontSize: 12,
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 28 }}>
              {statCard('Occupancy Rate', `${occupancyRate}%`, `${occupied} occupied / ${totalUnits} total`, occupancyRate >= 90 ? GREEN : occupancyRate >= 75 ? AMBER : RED)}
              {statCard('Vacant Units', vacant, `$${Math.round(vacancyLoss).toLocaleString()}/mo revenue loss`, RED, () => setActiveTab('vacancy'))}
              {statCard('Expiring Leases', expiringIn60.length, 'Within 60 days', AMBER, () => setActiveTab('leases'))}
              {statCard('Open Maintenance', openMaint + inProgressMaint, `${urgentMaint} urgent`, urgentMaint > 0 ? RED : AMBER, () => setActiveTab('maintenance'))}
              {statCard('Net Income NOI', `$${Math.round(noi).toLocaleString()}`, 'Income minus expenses', noi > 0 ? GREEN : RED, () => setActiveTab('financial'))}
              {statCard('Collection Rate', `${collectionRate}%`, 'Rent collected vs expected', collectionRate >= 95 ? GREEN : collectionRate >= 80 ? AMBER : RED)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>Unit Status Breakdown</div>

                {[
                  { label: 'Occupied', count: occupied, color: GREEN, pct: Math.round((occupied / totalUnits) * 100) },
                  { label: 'Vacant', count: vacant, color: RED, pct: Math.round((vacant / totalUnits) * 100) },
                  { label: 'Maintenance', count: maintenanceUnits, color: AMBER, pct: Math.round((maintenanceUnits / totalUnits) * 100) },
                ].map((s) => (
                  <div key={s.label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{s.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>
                        {s.count} units ({s.pct}%)
                      </span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>Revenue Overview</div>

                {[
                  { label: 'Potential Rent Revenue', value: `$${Math.round(potentialRent).toLocaleString()}`, color: BLUE, sub: `${totalUnits} units × $${Math.round(avgRent)}/mo avg` },
                  { label: 'Actual Rent Collected', value: `$${Math.round(totalIncome).toLocaleString()}`, color: GREEN, sub: `${collectionRate}% collection rate` },
                  { label: 'Vacancy Loss', value: `$${Math.round(vacancyLoss).toLocaleString()}`, color: RED, sub: `${vacant} vacant units × avg rent` },
                  { label: 'Total Expenses', value: `$${Math.round(totalExpenses).toLocaleString()}`, color: AMBER, sub: 'Maintenance + operations' },
                  { label: 'Net Operating Income', value: `$${Math.round(noi).toLocaleString()}`, color: noi > 0 ? GREEN : RED, sub: 'Income minus expenses' },
                ].map((r, i) => (
                  <div
                    key={r.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{r.label}</div>
                      <div style={{ fontSize: 10, color: '#334155' }}>{r.sub}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: r.color }}>{r.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
              {[
                { icon: '🏠', label: 'Unit Details', sub: `${totalUnits} total units`, onClick: () => setActiveTab('units'), color: BLUE },
                { icon: '📄', label: 'Lease Overview', sub: `${expiringIn60.length} expiring soon`, onClick: () => setActiveTab('leases'), color: GREEN },
                { icon: '🔧', label: 'Maintenance Costs', sub: `${openMaint} open requests`, onClick: () => setActiveTab('maintenance'), color: PURPLE },
                { icon: '🔑', label: 'Vacancy Readiness', sub: `${vacant} units to prep`, onClick: () => setActiveTab('vacancy'), color: AMBER },
                { icon: '💰', label: 'Full Financials', sub: 'Income, expenses, NOI', onClick: () => setActiveTab('financial'), color: GREEN },
                { icon: '👥', label: 'Payroll & HR', sub: 'Employees & pay stubs', onClick: () => (window.location.href = '/propflow/payroll'), color: PURPLE },
              ].map((q) => (
                <button
                  key={q.label}
                  className="tab-btn"
                  onClick={q.onClick}
                  style={{
                    background: '#070f1f',
                    border: `1px solid ${q.color}20`,
                    borderRadius: 14,
                    padding: '16px 18px',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{q.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{q.label}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{q.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'units' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 20 }}>All Units</h2>

            <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 60px 80px 80px 1fr 100px', gap: 10, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 9, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                <span>Unit</span>
                <span>Type</span>
                <span>Sqft</span>
                <span>Beds/Bath</span>
                <span>Rent</span>
                <span>Tenant</span>
                <span>Status</span>
              </div>

              {loading ? (
                <div style={{ padding: 24, color: '#475569' }}>Loading...</div>
              ) : (
                visibleUnits.map((u: any, i: number) => {
                  const tenant = tenants.find((t) => t.unit_id === u.id)
                  const statusColor = u.status === 'Occupied' ? GREEN : u.status === 'Vacant' ? RED : AMBER

                  return (
                    <div
                      key={`${u.unit_number}-${i}`}
                      className="row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 80px 60px 80px 80px 1fr 100px',
                        gap: 10,
                        padding: '13px 20px',
                        borderBottom: i < visibleUnits.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{u.unit_number}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{u.type}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{u.sqft}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {u.bedrooms}BR/{u.bathrooms}BA
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>${Number(u.rent_amount || 0).toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{tenant?.full_name ?? (u.status === 'Vacant' ? 'Vacant' : '—')}</div>
                      <div>
                        <span style={{ fontSize: 10, fontWeight: 700, color: statusColor, background: `${statusColor}12`, border: `1px solid ${statusColor}25`, borderRadius: 6, padding: '2px 8px' }}>
                          {u.status}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'leases' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 20 }}>Lease Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Active Leases', value: leases.length || tenants.length, color: GREEN, sub: 'Currently active' },
                { label: 'Expiring in 30 days', value: expiringIn30.length, color: RED, sub: 'Urgent renewals' },
                { label: 'Expiring in 60 days', value: expiringIn60.length, color: AMBER, sub: 'Action needed soon' },
                { label: 'Avg Lease Length', value: '12 mo', color: BLUE, sub: 'Standard term' },
              ].map((s) => statCard(s.label, s.value, s.sub, s.color))}
            </div>

            <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 120px 80px 100px', gap: 10, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 9, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                <span>Tenant</span>
                <span>Unit</span>
                <span>Start</span>
                <span>End</span>
                <span>Days Left</span>
                <span>Status</span>
              </div>

              {(leases.length > 0 ? leases : tenants).map((l: any, i: number) => {
                const tenant = leases.length > 0 ? tenants.find((t) => t.id === l.tenant_id) : l
                const unit = visibleUnits.find((u) => u.id === l.unit_id)
                const end = l.lease_end ? new Date(l.lease_end) : new Date(Date.now() + 180 * 86400000)
                const daysLeft = Math.ceil((end.getTime() - Date.now()) / 86400000)
                const statusC = daysLeft < 30 ? RED : daysLeft < 60 ? AMBER : GREEN

                return (
                  <div key={i} className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 120px 80px 100px', gap: 10, padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{tenant?.full_name ?? l.full_name ?? '—'}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{unit?.unit_number ?? '—'}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{l.lease_start ? new Date(l.lease_start).toLocaleDateString() : l.move_in_date ? new Date(l.move_in_date).toLocaleDateString() : '—'}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{end.toLocaleDateString()}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: statusC }}>{daysLeft}d</div>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: statusC, background: `${statusC}12`, borderRadius: 6, padding: '2px 8px' }}>
                        {daysLeft < 30 ? 'Urgent' : daysLeft < 60 ? 'Expiring' : 'Active'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 20 }}>Maintenance Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Open Requests', value: openMaint, color: AMBER, sub: 'Awaiting assignment' },
                { label: 'In Progress', value: inProgressMaint, color: BLUE, sub: 'Being worked on' },
                { label: 'Urgent', value: urgentMaint, color: RED, sub: 'Immediate attention' },
                { label: 'Completed All', value: maintenance.filter((m) => m.status === 'completed').length, color: GREEN, sub: 'Total resolved' },
              ].map((s) => statCard(s.label, s.value, s.sub, s.color))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 20 }}>
              <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>By Category</div>

                {Object.entries(maintByCat)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: '#94a3b8', textTransform: 'capitalize' }}>{cat}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>{count} requests</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${(count / (maintenance.length || 1)) * 100}%`, background: BLUE, borderRadius: 3, opacity: 0.8 }} />
                      </div>
                    </div>
                  ))}
              </div>

              <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>By Assigned Tech</div>

                {Object.entries(
                  maintenance.reduce((acc: Record<string, number>, m: any) => {
                    const name = m.assigned_to ?? 'Unassigned'
                    acc[name] = (acc[name] ?? 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: PURPLE }}>{count} requests</span>
                    </div>
                  ))}
              </div>
            </div>

            <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>All Maintenance Requests</div>
              </div>

              {maintenance.length === 0 ? (
                <div style={{ padding: 24, color: '#475569' }}>No maintenance requests found.</div>
              ) : (
                maintenance.slice(0, 20).map((m: any, i: number) => (
                  <div key={i} className="row" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{m.title}</div>
                      <div style={{ fontSize: 10, color: '#334155' }}>
                        {m.category} · {m.assigned_to ?? 'Unassigned'} · {m.created_at ? new Date(m.created_at).toLocaleDateString() : '—'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <span style={{ fontSize: 9, color: m.priority === 'urgent' ? RED : m.priority === 'normal' ? AMBER : '#475569', background: 'rgba(255,255,255,0.04)', borderRadius: 4, padding: '2px 7px', fontWeight: 700, textTransform: 'uppercase' }}>
                        {m.priority ?? 'normal'}
                      </span>
                      <span style={{ fontSize: 9, color: m.status === 'completed' ? GREEN : m.status === 'in_progress' ? BLUE : AMBER, background: 'rgba(255,255,255,0.04)', borderRadius: 4, padding: '2px 7px', fontWeight: 700, textTransform: 'uppercase' }}>
                        {m.status?.replace('_', ' ') ?? 'open'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'vacancy' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Vacancy Readiness</h2>
            <p style={{ color: '#475569', fontSize: 13, marginBottom: 20 }}>
              Track what needs to be done to make each vacant unit rent-ready, estimated costs, and timeline.
            </p>

            {vacantUnits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#334155' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: GREEN }}>All units are occupied!</div>
              </div>
            ) : (
              vacantUnits.map((vu: any, vi: number) => {
                const tasks = [
                  { name: 'Deep clean entire unit', cat: 'cleaning', cost: 150, days: 1, status: 'pending', assigned: 'James Carter' },
                  { name: 'Paint all walls — 2 coats', cat: 'paint', cost: 320, days: 2, status: 'in_progress', assigned: 'James Carter' },
                  { name: 'Replace carpet — bedroom', cat: 'carpet', cost: 480, days: 1, status: 'pending', assigned: 'Marcus Reed' },
                  { name: 'Fix bathroom faucet', cat: 'plumbing', cost: 85, days: 1, status: 'completed', assigned: 'James Carter' },
                  { name: 'Replace kitchen light fixture', cat: 'electric', cost: 65, days: 1, status: 'pending', assigned: 'Marcus Reed' },
                  { name: 'HVAC filter replacement', cat: 'hvac', cost: 45, days: 1, status: 'pending', assigned: 'James Carter' },
                ]

                const totalCost = tasks.reduce((a, t) => a + t.cost, 0)
                const completedCost = tasks.filter((t) => t.status === 'completed').reduce((a, t) => a + t.cost, 0)
                const remainingCost = totalCost - completedCost
                const completedTasks = tasks.filter((t) => t.status === 'completed').length
                const pct = Math.round((completedTasks / tasks.length) * 100)
                const daysToReady = tasks.filter((t) => t.status !== 'completed').reduce((a, t) => Math.max(a, t.days), 0)
                const rent = Number(vu.rent_amount || 0)

                return (
                  <div key={vi} style={{ background: '#070f1f', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 3 }}>
                          Unit {vu.unit_number} — {vu.type}
                        </div>
                        <div style={{ fontSize: 12, color: '#475569' }}>
                          {vu.sqft} sqft · ${rent.toLocaleString()}/mo rent
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, marginBottom: 20 }}>
                      {[
                        { label: 'Total Cost', value: `$${totalCost.toLocaleString()}`, color: RED },
                        { label: 'Days To Ready', value: `${daysToReady} days`, color: AMBER },
                        { label: 'Revenue/Mo Lost', value: `$${rent.toLocaleString()}`, color: GREEN },
                      ].map((s) => (
                        <div key={s.label} style={{ textAlign: 'center', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 10, padding: '10px 16px' }}>
                          <div style={{ fontSize: 9, color: s.color, fontWeight: 700, letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' }}>{s.label}</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#475569' }}>Completion Progress</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? GREEN : AMBER }}>
                          {pct}% ({completedTasks}/{tasks.length} tasks)
                        </span>
                      </div>
                      <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,#16a34a,${GREEN})`, borderRadius: 5 }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {tasks.map((task, ti) => {
                        const tc = task.status === 'completed' ? GREEN : task.status === 'in_progress' ? BLUE : AMBER

                        return (
                          <div key={ti} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: task.status === 'completed' ? 'rgba(34,197,94,0.04)' : 'rgba(255,255,255,0.03)', borderRadius: 10, border: `1px solid ${tc}15`, flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
                              <span style={{ fontSize: 14 }}>{task.status === 'completed' ? '✅' : task.status === 'in_progress' ? '🔄' : '⏳'}</span>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: task.status === 'completed' ? '#64748b' : '#f0f6ff', textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>{task.name}</div>
                                <div style={{ fontSize: 10, color: '#334155' }}>
                                  {task.cat} · {task.assigned} · {task.days} day{task.days > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: task.status === 'completed' ? '#475569' : RED }}>${task.cost}</span>
                              <span style={{ fontSize: 9, fontWeight: 700, color: tc, background: `${tc}12`, borderRadius: 5, padding: '2px 8px', textTransform: 'uppercase' }}>
                                {task.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(79,142,247,0.06)', borderRadius: 10, border: '1px solid rgba(79,142,247,0.12)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        Spent so far: <strong style={{ color: '#f0f6ff' }}>${completedCost}</strong> · Remaining:{' '}
                        <strong style={{ color: RED }}>${remainingCost}</strong>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        Ready in <strong style={{ color: AMBER }}>{daysToReady} days</strong> · Lost revenue:{' '}
                        <strong style={{ color: RED }}>${((rent / 30) * daysToReady).toFixed(0)}</strong>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'financial' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 20 }}>Financial Overview</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Total Income', value: `$${Math.round(totalIncome).toLocaleString()}`, color: GREEN, sub: 'All time collected' },
                { label: 'Total Expenses', value: `$${Math.round(totalExpenses).toLocaleString()}`, color: RED, sub: 'All time spent' },
                { label: 'Net Income NOI', value: `$${Math.round(noi).toLocaleString()}`, color: noi > 0 ? GREEN : RED, sub: 'Income minus expenses' },
                { label: 'Vacancy Loss', value: `$${Math.round(vacancyLoss).toLocaleString()}`, color: AMBER, sub: `${vacant} vacant × avg rent/mo` },
              ].map((s) => statCard(s.label, s.value, s.sub, s.color))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
              {[
                { icon: '📊', title: 'Detailed Accounting', sub: 'Full transaction ledger, monthly P&L, category breakdown', href: '/propflow/accounting', color: BLUE },
                { icon: '🏦', title: 'ACH Payments', sub: 'Free bank transfers, payment history, outstanding rent', href: '/propflow/ach-payments', color: GREEN },
                { icon: '👥', title: 'Payroll & HR', sub: 'Employee records, payroll runs, pay stubs, 401k', href: '/propflow/payroll', color: PURPLE },
                { icon: '📋', title: 'Income Verification', sub: 'Applicant documents, approval status', href: '/propflow/income-verification', color: AMBER },
              ].map((c) => (
                <Link key={c.title} href={c.href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#070f1f', border: `1px solid ${c.color}20`, borderRadius: 14, padding: 22, cursor: 'pointer' }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>{c.sub}</div>
                    <div style={{ fontSize: 12, color: c.color, fontWeight: 700 }}>Open →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}