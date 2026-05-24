'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const G = '#c9a84c'
const DARK = '#0a0a0a'

const CASH_LOAD_LOCATIONS = [
  { id: '7-eleven',       name: '7-Eleven',       icon: '🏪' },
  { id: 'dollar_general', name: 'Dollar General',  icon: '🛒' },
  { id: 'cvs',            name: 'CVS Pharmacy',    icon: '💊' },
  { id: 'walgreens',      name: 'Walgreens',       icon: '🏥' },
  { id: 'walmart',        name: 'Walmart',         icon: '🏬' },
  { id: 'family_dollar',  name: 'Family Dollar',   icon: '💵' },
]

function statusColor(s: string) {
  if (s === 'paid')     return '#22c55e'
  if (s === 'due')      return '#f59e0b'
  if (s === 'late')     return '#ef4444'
  if (s === 'upcoming') return '#3b82f6'
  return '#475569'
}
function statusBg(s: string) {
  if (s === 'paid')     return 'rgba(34,197,94,0.1)'
  if (s === 'due')      return 'rgba(245,158,11,0.1)'
  if (s === 'late')     return 'rgba(239,68,68,0.1)'
  if (s === 'upcoming') return 'rgba(59,130,246,0.1)'
  return 'rgba(71,85,105,0.1)'
}
function statusLabel(s: string) {
  if (s === 'paid')     return '✓ Paid'
  if (s === 'due')      return '⚠ Due Today'
  if (s === 'late')     return '🔴 Late'
  if (s === 'upcoming') return '🔵 Upcoming'
  return s
}

async function dbGet(table: string, params: string) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  })
  return res.json()
}

export default function BoothRentPage() {
  const [rentals, setRentals]       = useState<any[]>([])
  const [payments, setPayments]     = useState<any[]>([])
  const [notifications, setNotifs]  = useState<any[]>([])
  const [profiles, setProfiles]     = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [activeTab, setActiveTab]   = useState<'overview'|'payments'|'notifications'|'cash_load'>('overview')
  const [filterStatus, setFilter]   = useState('all')
  const [showPayModal, setPayModal] = useState<any>(null)
  const [cashLoadAmount, setCashLoadAmount] = useState('')
  const [cashLoadLoc, setCashLoadLoc] = useState('')
  const [cashLoadSuccess, setCashLoadSuccess] = useState(false)

  useEffect(() => {
    Promise.all([
      dbGet('ts_booth_rent', 'select=*'),
      dbGet('ts_booth_rent_payments', 'select=*&order=due_date.desc&limit=50'),
      dbGet('ts_notifications', 'select=*&order=created_at.desc&limit=30'),
      dbGet('ts_profiles', 'select=id,full_name,username,trade_category,cashapp_tag,venmo_handle,paypal_email,avatar_url&role=eq.pro'),
    ]).then(([r, p, n, pr]) => {
      setRentals(Array.isArray(r) ? r : [])
      setPayments(Array.isArray(p) ? p : [])
      setNotifs(Array.isArray(n) ? n : [])
      setProfiles(Array.isArray(pr) ? pr : [])
      setLoading(false)
    })
  }, [])

  const profileMap = Object.fromEntries(profiles.map((p: any) => [p.id, p]))

  const paidCount    = payments.filter(p => p.status === 'paid').length
  const dueCount     = payments.filter(p => p.status === 'due').length
  const lateCount    = payments.filter(p => p.status === 'late').length
  const upcomingCount = payments.filter(p => p.status === 'upcoming').length
  const totalCollected = payments.filter(p => p.status === 'paid').reduce((a, p) => a + Number(p.amount), 0)
  const totalOutstanding = payments.filter(p => ['due','late'].includes(p.status)).reduce((a, p) => a + Number(p.amount), 0)

  const filteredPayments = filterStatus === 'all' ? payments : payments.filter(p => p.status === filterStatus)
  const unreadNotifs = notifications.filter(n => n.status === 'unread').length

  async function markAllRead() {
    await fetch(`${SB_URL}/rest/v1/ts_notifications?status=eq.unread`, {
      method: 'PATCH',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ status: 'read' })
    })
    setNotifs(prev => prev.map(n => ({ ...n, status: 'read' })))
  }

  async function submitCashLoad() {
    if (!cashLoadAmount || !cashLoadLoc) return
    const amount = parseFloat(cashLoadAmount)
    const fee = 3.95
    const net = amount - fee
    await fetch(`${SB_URL}/rest/v1/ts_cash_loads`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ amount, fee, net_amount: net, location: cashLoadLoc, status: 'pending' })
    })
    setCashLoadSuccess(true)
  }

  const inp = { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'system-ui', boxSizing: 'border-box' as const }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .tab-btn{transition:all 0.15s;cursor:pointer;border:none;fontFamily:system-ui}
        .row-hover{transition:background 0.12s}
        .row-hover:hover{background:rgba(201,168,76,0.04)!important}
      `}</style>

      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid rgba(201,168,76,0.12)', background: 'rgba(10,10,10,0.97)', position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/tradesync" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#8b6914,#c9a84c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#0a0a0a', fontFamily: 'Georgia,serif' }}>TS</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: 'Georgia,serif' }}>TradeSync</div>
              <div style={{ fontSize: 8, color: G, letterSpacing: 2, textTransform: 'uppercase' }}>Booth Rent Manager</div>
            </div>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => setActiveTab('notifications')} className="tab-btn"
            style={{ position: 'relative', padding: '8px 16px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 9, color: G, fontSize: 13, fontWeight: 700 }}>
            🔔 Notifications
            {unreadNotifs > 0 && <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#ef4444', borderRadius: '50%', fontSize: 10, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifs}</span>}
          </button>
          <button onClick={() => setActiveTab('cash_load')} className="tab-btn"
            style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#8b6914,#c9a84c)', border: 'none', borderRadius: 9, color: '#0a0a0a', fontSize: 13, fontWeight: 900, fontFamily: 'Georgia,serif' }}>
            + Cash Load
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Collected', value: `$${totalCollected.toLocaleString()}`, sub: 'All time', color: '#22c55e', icon: '💰' },
            { label: 'Outstanding', value: `$${totalOutstanding.toLocaleString()}`, sub: `${dueCount + lateCount} payments`, color: '#f59e0b', icon: '⚠️' },
            { label: 'Due Today', value: dueCount, sub: 'Needs collection', color: '#f59e0b', icon: '📅' },
            { label: 'Late', value: lateCount, sub: 'Overdue', color: '#ef4444', icon: '🔴' },
            { label: 'Upcoming', value: upcomingCount, sub: 'Next 30 days', color: '#3b82f6', icon: '🔵' },
            { label: 'Active Renters', value: rentals.filter(r => r.status === 'active').length, sub: 'Current chairs', color: G, icon: '✂️' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}20`, borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>{s.label}</div>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#334155' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4, border: '1px solid rgba(201,168,76,0.1)', flexWrap: 'wrap' }}>
          {[
            { id: 'overview',      label: '🏠 Overview' },
            { id: 'payments',      label: '💳 Payment History' },
            { id: 'notifications', label: `🔔 Notifications${unreadNotifs > 0 ? ` (${unreadNotifs})` : ''}` },
            { id: 'cash_load',     label: '🏪 Cash Load' },
          ].map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id as any)}
              style={{ padding: '9px 18px', borderRadius: 9, background: activeTab === t.id ? 'linear-gradient(135deg,#8b6914,#c9a84c)' : 'transparent', color: activeTab === t.id ? '#0a0a0a' : '#64748b', fontWeight: 700, fontSize: 13 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Georgia,serif' }}>Active Renters</h2>
              <div style={{ fontSize: 12, color: '#475569' }}>Rent deposits directly to business bank account</div>
            </div>

            {loading ? (
              <div style={{ color: '#475569', fontSize: 13 }}>Loading...</div>
            ) : rentals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#334155', fontSize: 14 }}>No active rentals yet. Add renters to get started.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {rentals.map((r: any, i: number) => {
                  const pro = profileMap[r.pro_id]
                  const proPayments = payments.filter(p => p.pro_id === r.pro_id)
                  const lastPaid = proPayments.find(p => p.status === 'paid')
                  const currentDue = proPayments.find(p => p.status === 'due')
                  const isLate = proPayments.some(p => p.status === 'late')

                  return (
                    <div key={i} className="row-hover" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${isLate ? 'rgba(239,68,68,0.3)' : currentDue ? 'rgba(245,158,11,0.2)' : 'rgba(201,168,76,0.1)'}`, borderRadius: 14, padding: '18px 20px', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 16, alignItems: 'center' }}>
                      {/* Avatar */}
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg,#8b6914,#c9a84c)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#0a0a0a', flexShrink: 0 }}>
                        {(pro?.full_name ?? r.pro_name ?? '?')[0]}
                      </div>
                      {/* Info */}
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{pro?.full_name ?? r.pro_name ?? 'Unknown'}</div>
                        <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>
                          {r.booth_number ?? 'Chair'} · {pro?.trade_category ?? 'Trade Pro'} · {r.frequency ?? 'weekly'} rent
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          {pro?.cashapp_tag && <span style={{ fontSize: 10, color: '#22c55e', background: 'rgba(34,197,94,0.1)', borderRadius: 5, padding: '2px 8px' }}>{pro.cashapp_tag}</span>}
                          {pro?.venmo_handle && <span style={{ fontSize: 10, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', borderRadius: 5, padding: '2px 8px' }}>{pro.venmo_handle}</span>}
                        </div>
                      </div>
                      {/* Amount */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: G, fontFamily: 'Georgia,serif' }}>${r.amount ?? r.weekly_rate ?? 150}</div>
                        <div style={{ fontSize: 10, color: '#475569' }}>per week</div>
                      </div>
                      {/* Status */}
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(isLate ? 'late' : currentDue ? 'due' : 'paid'), background: statusBg(isLate ? 'late' : currentDue ? 'due' : 'paid'), border: `1px solid ${statusColor(isLate ? 'late' : currentDue ? 'due' : 'paid')}30`, borderRadius: 7, padding: '4px 12px', display: 'block', marginBottom: 6 }}>
                          {statusLabel(isLate ? 'late' : currentDue ? 'due' : 'paid')}
                        </span>
                        {(isLate || currentDue) && (
                          <button onClick={() => setPayModal(r)} className="tab-btn"
                            style={{ fontSize: 11, padding: '4px 12px', background: G, border: 'none', borderRadius: 6, color: '#0a0a0a', fontWeight: 700 }}>
                            Record Payment
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Bank deposit info */}
            <div style={{ marginTop: 24, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24 }}>🏦</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>Direct Bank Deposit</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                  All booth rent payments go directly to your business bank account. This is not a withdrawal platform — funds route straight from the renter to your business account. Cash loads via 7-Eleven, Dollar General, CVS, and Walgreens are also supported.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT HISTORY TAB */}
        {activeTab === 'payments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Georgia,serif' }}>Payment History</h2>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['all','paid','due','late','upcoming'].map(s => (
                  <button key={s} className="tab-btn" onClick={() => setFilter(s)}
                    style={{ padding: '6px 14px', borderRadius: 8, background: filterStatus === s ? statusColor(s === 'all' ? 'paid' : s) : 'rgba(255,255,255,0.04)', border: `1px solid ${filterStatus === s ? statusColor(s === 'all' ? 'paid' : s) : 'rgba(255,255,255,0.08)'}`, color: filterStatus === s ? '#fff' : '#64748b', fontWeight: 600, fontSize: 12, textTransform: 'capitalize' }}>
                    {s === 'all' ? 'All' : statusLabel(s)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 14, overflow: 'hidden' }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 120px 110px', gap: 12, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                <span>Pro / Chair</span>
                <span>Amount</span>
                <span>Due Date</span>
                <span>Paid Date</span>
                <span>Status</span>
              </div>
              {loading ? (
                <div style={{ padding: 32, color: '#475569', fontSize: 13 }}>Loading...</div>
              ) : filteredPayments.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#334155', fontSize: 13 }}>No payments match this filter.</div>
              ) : filteredPayments.map((p: any, i: number) => {
                const pro = profileMap[p.pro_id]
                return (
                  <div key={i} className="row-hover" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 120px 110px', gap: 12, padding: '13px 20px', borderBottom: i < filteredPayments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff' }}>{pro?.full_name ?? 'Unknown'}</div>
                      <div style={{ fontSize: 11, color: '#334155' }}>
                        {p.payment_method ? p.payment_method.replace('_', ' ') : '—'}
                        {p.cash_load_location ? ` · ${p.cash_load_location}` : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: G }}>${Number(p.amount).toFixed(2)}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{p.due_date ? new Date(p.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{p.paid_date ? new Date(p.paid_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}</div>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: statusColor(p.status), background: statusBg(p.status), border: `1px solid ${statusColor(p.status)}30`, borderRadius: 6, padding: '3px 10px' }}>
                        {statusLabel(p.status)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Georgia,serif' }}>Notifications</h2>
              {unreadNotifs > 0 && (
                <button onClick={markAllRead} className="tab-btn"
                  style={{ padding: '7px 16px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 9, color: G, fontSize: 12, fontWeight: 700 }}>
                  Mark all read
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: '#334155', fontSize: 14 }}>No notifications yet.</div>
              ) : notifications.map((n: any, i: number) => (
                <div key={i} style={{ background: n.status === 'unread' ? 'rgba(201,168,76,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${n.status === 'unread' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${n.color ?? G}15`, border: `1px solid ${n.color ?? G}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {n.type === 'booth_rent_paid' ? '✓' : n.type === 'booth_rent_due' ? '⚠' : n.type === 'booth_rent_late' ? '🔴' : '🔵'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 14, fontWeight: n.status === 'unread' ? 700 : 600, color: n.status === 'unread' ? '#fff' : '#94a3b8' }}>{n.title}</div>
                      <div style={{ fontSize: 10, color: '#334155', flexShrink: 0 }}>{new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>{n.message}</div>
                  </div>
                  {n.status === 'unread' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: G, flexShrink: 0, marginTop: 4, animation: 'pulse 2s infinite' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CASH LOAD TAB */}
        {activeTab === 'cash_load' && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6, fontFamily: 'Georgia,serif' }}>Cash Load</h2>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
              Deposit cash at any of the locations below. A $3.95 processing fee applies per load. Funds go directly to the business bank account — this is not a withdrawal service.
            </p>

            {cashLoadSuccess ? (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 16, padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e', marginBottom: 8 }}>Cash Load Initiated</div>
                <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                  Go to your selected location and ask for a PayNearMe barcode. Show the barcode to the cashier and pay your amount. Funds confirm within 15 minutes.
                </div>
                <button onClick={() => { setCashLoadSuccess(false); setCashLoadAmount(''); setCashLoadLoc('') }} className="tab-btn"
                  style={{ padding: '10px 24px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, color: '#22c55e', fontSize: 14, fontWeight: 700 }}>
                  New Load
                </button>
              </div>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: '28px 24px' }}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Amount to Load</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: G, fontSize: 16, fontWeight: 700 }}>$</span>
                    <input type="number" value={cashLoadAmount} onChange={e => setCashLoadAmount(e.target.value)}
                      placeholder="0.00" min="20" max="500"
                      style={{ ...inp, paddingLeft: 30 }} />
                  </div>
                  {cashLoadAmount && Number(cashLoadAmount) >= 20 && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
                      Fee: $3.95 · You will deposit: <strong style={{ color: G }}>${(Number(cashLoadAmount)).toFixed(2)}</strong> · Net to account: <strong style={{ color: '#22c55e' }}>${(Number(cashLoadAmount) - 3.95).toFixed(2)}</strong>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Select Location</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
                    {CASH_LOAD_LOCATIONS.map(loc => (
                      <div key={loc.id} onClick={() => setCashLoadLoc(loc.id)}
                        style={{ background: cashLoadLoc === loc.id ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${cashLoadLoc === loc.id ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{loc.icon}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: cashLoadLoc === loc.id ? G : '#94a3b8' }}>{loc.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={submitCashLoad} disabled={!cashLoadAmount || !cashLoadLoc || Number(cashLoadAmount) < 20}
                  style={{ width: '100%', padding: '14px', background: cashLoadAmount && cashLoadLoc ? 'linear-gradient(135deg,#8b6914,#c9a84c)' : 'rgba(201,168,76,0.15)', border: 'none', borderRadius: 12, color: cashLoadAmount && cashLoadLoc ? '#0a0a0a' : '#475569', fontWeight: 900, fontSize: 15, cursor: cashLoadAmount && cashLoadLoc ? 'pointer' : 'not-allowed', fontFamily: 'Georgia,serif' }}>
                  Generate Cash Load Barcode
                </button>
                <p style={{ textAlign: 'center', fontSize: 11, color: '#334155', marginTop: 12 }}>
                  Minimum $20 · Maximum $500 per load · $3.95 fee · Powered by PayNearMe
                </p>
              </div>
            )}

            {/* How it works */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 12, color: '#475569', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>How Cash Loads Work</div>
              {[
                { step: '1', text: 'Enter the amount you want to load (min $20)' },
                { step: '2', text: 'Select your nearest location — 7-Eleven, Dollar General, CVS, or Walgreens' },
                { step: '3', text: 'Tap Generate — you receive a barcode on screen' },
                { step: '4', text: 'Go to the store, show the cashier your barcode, and pay cash' },
                { step: '5', text: 'Funds confirm within 15 minutes and go directly to the business bank account' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: G, flexShrink: 0 }}>{s.step}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, paddingTop: 2 }}>{s.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RECORD PAYMENT MODAL */}
      {showPayModal && (
        <div onClick={() => setPayModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 18, padding: 28, maxWidth: 420, width: '100%' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 6, fontFamily: 'Georgia,serif' }}>Record Payment</h3>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
              {profileMap[showPayModal.pro_id]?.full_name ?? 'Pro'} · {showPayModal.booth_number} · ${showPayModal.amount ?? showPayModal.weekly_rate ?? 150}
            </p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Payment Method</label>
              <select style={{ ...inp, color: '#fff' }}>
                <option value="cashapp">Cash App</option>
                <option value="venmo">Venmo</option>
                <option value="paypal">PayPal</option>
                <option value="card">Card</option>
                <option value="cash_load">Cash Load (7-Eleven / CVS / etc.)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setPayModal(null)} className="tab-btn"
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#64748b', fontSize: 14, fontWeight: 700 }}>
                Cancel
              </button>
              <button onClick={() => setPayModal(null)} className="tab-btn"
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#8b6914,#c9a84c)', border: 'none', borderRadius: 10, color: '#0a0a0a', fontSize: 14, fontWeight: 900, fontFamily: 'Georgia,serif' }}>
                Confirm Paid ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,168,76,0.08)', padding: '18px 28px', textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 11, color: '#1e293b' }}>
          TradeSync · Made A Barber LLC · M.A.D.E Technologies Inc · Oklahoma City, OK · (405) 693-8615
        </div>
      </footer>
    </div>
  )
}