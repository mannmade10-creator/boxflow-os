'use client'
import { useState, useEffect } from 'react'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const BLUE = '#4f8ef7'
const PURPLE = '#a855f7'

async function dbGet(table: string, params: string) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  })
  return res.json()
}

function statusColor(s: string) {
  if (s === 'paid')     return '#22c55e'
  if (s === 'unpaid')   return '#f59e0b'
  if (s === 'late')     return '#ef4444'
  if (s === 'partial')  return '#f97316'
  if (s === 'upcoming') return '#3b82f6'
  return '#475569'
}
function statusLabel(s: string) {
  if (s === 'paid')     return '✓ Paid'
  if (s === 'unpaid')   return '⚠ Due'
  if (s === 'late')     return '🔴 Late'
  if (s === 'partial')  return '◑ Partial'
  if (s === 'upcoming') return '○ Upcoming'
  return s
}

// Print billing statement
function printStatement(statement: any, tenant: any, unit: any) {
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Billing Statement — ${tenant?.full_name}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #111; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #4f8ef7; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 22px; font-weight: 900; color: #4f8ef7; }
        .sub { font-size: 11px; color: #888; letter-spacing: 2px; text-transform: uppercase; }
        h2 { font-size: 18px; color: #333; margin-bottom: 4px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-box { background: #f8f9fa; border-radius: 8px; padding: 16px; }
        .info-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .info-val { font-size: 14px; font-weight: 600; color: #111; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #4f8ef7; color: white; padding: 10px 14px; text-align: left; font-size: 12px; }
        td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 13px; }
        .total-row td { font-weight: 900; font-size: 15px; background: #f0f6ff; border-top: 2px solid #4f8ef7; }
        .status-badge { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; background: ${statusColor(statement.status)}20; color: ${statusColor(statement.status)}; border: 1px solid ${statusColor(statement.status)}40; }
        .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; font-size: 11px; color: #888; text-align: center; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">PropFlow OS</div>
          <div class="sub">by M.A.D.E Technologies</div>
          <div style="margin-top:8px;font-size:13px;color:#555">Penn Station Apartments<br>1920 Heritage Park Drive, OKC 73120<br>405-755-9246</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:20px;font-weight:900;color:#111">BILLING STATEMENT</div>
          <div style="font-size:13px;color:#555;margin-top:6px">Statement Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          <div style="font-size:13px;color:#555">Due Date: ${new Date(statement.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          <div style="margin-top:8px"><span class="status-badge">${statusLabel(statement.status)}</span></div>
        </div>
      </div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-label">Tenant</div>
          <div class="info-val">${tenant?.full_name ?? '—'}</div>
          <div style="font-size:13px;color:#555;margin-top:4px">${tenant?.email ?? ''}</div>
          <div style="font-size:13px;color:#555">${tenant?.phone ?? ''}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Unit</div>
          <div class="info-val">Unit ${unit?.unit_number ?? '—'}</div>
          <div style="font-size:13px;color:#555;margin-top:4px">${unit?.type ?? ''} · ${unit?.sqft ?? ''}  sqft</div>
          <div style="font-size:13px;color:#555">${unit?.bedrooms ?? ''}BR / ${unit?.bathrooms ?? ''}BA</div>
        </div>
      </div>
      <h2>Charges for ${new Date(statement.statement_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
      <table>
        <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
        <tbody>
          <tr><td>Base Rent</td><td style="text-align:right">$${Number(statement.base_rent).toFixed(2)}</td></tr>
          ${statement.late_fee > 0 ? `<tr><td>Late Fee</td><td style="text-align:right;color:#ef4444">$${Number(statement.late_fee).toFixed(2)}</td></tr>` : ''}
          ${statement.pet_fee > 0 ? `<tr><td>Pet Fee</td><td style="text-align:right">$${Number(statement.pet_fee).toFixed(2)}</td></tr>` : ''}
          ${statement.parking_fee > 0 ? `<tr><td>Parking</td><td style="text-align:right">$${Number(statement.parking_fee).toFixed(2)}</td></tr>` : ''}
          ${statement.utility_charges > 0 ? `<tr><td>Utility Charges</td><td style="text-align:right">$${Number(statement.utility_charges).toFixed(2)}</td></tr>` : ''}
          ${statement.other_charges > 0 ? `<tr><td>${statement.other_charges_desc || 'Other Charges'}</td><td style="text-align:right">$${Number(statement.other_charges).toFixed(2)}</td></tr>` : ''}
          ${statement.credits > 0 ? `<tr><td style="color:#22c55e">${statement.credits_desc || 'Credit'}</td><td style="text-align:right;color:#22c55e">-$${Number(statement.credits).toFixed(2)}</td></tr>` : ''}
          <tr class="total-row"><td>TOTAL DUE</td><td style="text-align:right">$${Number(statement.total_due).toFixed(2)}</td></tr>
          ${statement.amount_paid > 0 ? `<tr><td style="color:#22c55e">Amount Paid</td><td style="text-align:right;color:#22c55e">-$${Number(statement.amount_paid).toFixed(2)}</td></tr>` : ''}
          ${statement.balance > 0 ? `<tr><td style="font-weight:700">Balance Remaining</td><td style="text-align:right;font-weight:700;color:#ef4444">$${Number(statement.balance).toFixed(2)}</td></tr>` : ''}
        </tbody>
      </table>
      ${statement.notes ? `<div style="background:#fffde7;border:1px solid #fbbf24;border-radius:8px;padding:14px;margin-bottom:20px;font-size:13px"><strong>Note:</strong> ${statement.notes}</div>` : ''}
      <div class="footer">
        Penn Station Apartments · 1920 Heritage Park Drive, OKC 73120 · 405-755-9246<br>
        Managed by Kenneth Covington · M.A.D.E Technologies Inc · PropFlow OS<br>
        Questions? Contact management at the office or through the tenant portal.
      </div>
    </body>
    </html>
  `)
  w.document.close()
  setTimeout(() => w.print(), 500)
}

export default function TenantPortal() {
  const [step, setStep]         = useState<'login'|'portal'>('login')
  const [email, setEmail]       = useState('')
  const [pin, setPin]           = useState('')
  const [loginError, setLoginError] = useState('')
  const [logging, setLogging]   = useState(false)
  const [tenant, setTenant]     = useState<any>(null)
  const [unit, setUnit]         = useState<any>(null)
  const [lease, setLease]       = useState<any>(null)
  const [statements, setStatements] = useState<any[]>([])
  const [maintenance, setMaintenance] = useState<any[]>([])
  const [notices, setNotices]   = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard'|'billing'|'lease'|'maintenance'|'notices'>('dashboard')
  const [loading, setLoading]   = useState(false)
  const [newRequest, setNewRequest] = useState(false)
  const [reqForm, setReqForm]   = useState({ title: '', description: '', category: 'general', priority: 'normal' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function login() {
    if (!email || !pin) return
    setLogging(true); setLoginError('')
    const data = await dbGet('pf_tenants', `email=eq.${encodeURIComponent(email)}&portal_pin=eq.${pin}&status=eq.active&select=*&limit=1`)
    if (!Array.isArray(data) || data.length === 0) {
      setLoginError('Email or PIN not found. Please contact your property manager.')
      setLogging(false); return
    }
    const t = data[0]
    setTenant(t)
    // Load all tenant data
    setLoading(true)
    const [unitData, leaseData, stmtData, maintData, noticeData] = await Promise.all([
      t.unit_id ? dbGet('pf_units', `id=eq.${t.unit_id}&select=*&limit=1`) : Promise.resolve([]),
      dbGet('pf_leases', `tenant_id=eq.${t.id}&status=eq.active&select=*&limit=1`),
      dbGet('pf_billing_statements', `tenant_id=eq.${t.id}&select=*&order=statement_month.desc&limit=24`),
      dbGet('pf_maintenance_requests', `tenant_id=eq.${t.id}&select=*&order=created_at.desc`),
      dbGet('pf_notices', `tenant_id=eq.${t.id}&select=*&order=sent_at.desc`),
    ])
    if (Array.isArray(unitData) && unitData.length > 0) setUnit(unitData[0])
    if (Array.isArray(leaseData) && leaseData.length > 0) setLease(leaseData[0])
    if (Array.isArray(stmtData)) setStatements(stmtData)
    if (Array.isArray(maintData)) setMaintenance(maintData)
    if (Array.isArray(noticeData)) setNotices(noticeData)
    setLoading(false)
    setLogging(false)
    setStep('portal')
  }

  async function submitRequest() {
    if (!reqForm.title || !reqForm.description) return
    setSubmitting(true)
    await fetch(`${SB_URL}/rest/v1/pf_maintenance_requests`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ tenant_id: tenant.id, unit_id: tenant.unit_id, ...reqForm, status: 'open' })
    })
    setSubmitting(false); setSubmitted(true); setNewRequest(false)
    setReqForm({ title: '', description: '', category: 'general', priority: 'normal' })
    // Reload maintenance
    const d = await dbGet('pf_maintenance_requests', `tenant_id=eq.${tenant.id}&select=*&order=created_at.desc`)
    if (Array.isArray(d)) setMaintenance(d)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const currentBalance = statements.filter(s => ['unpaid','late','partial'].includes(s.status)).reduce((a, s) => a + Number(s.balance ?? s.total_due), 0)
  const unreadNotices  = notices.filter(n => !n.read_at).length
  const daysUntilLeaseEnd = lease ? Math.ceil((new Date(lease.lease_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0

  const inp = (key: string, placeholder = '', type = 'text') => ({
    type,
    value: reqForm[key as keyof typeof reqForm],
    onChange: (e: any) => setReqForm(f => ({ ...f, [key]: e.target.value })),
    placeholder,
    style: { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, fontSize: 14, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui', boxSizing: 'border-box' as const }
  })

  // LOGIN SCREEN
  if (step === 'login') return (
    <div style={{ minHeight: '100vh', background: '#050d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <img src="/assets/logo.png" alt="PropFlow" style={{ height: 40 }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#4f8ef7' }}>PropFlow OS</div>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: 2, textTransform: 'uppercase' }}>Tenant Portal</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>Penn Station Apartments · OKC</div>
        </div>

        <div style={{ background: '#0B1628', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 18, padding: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#f0f6ff', marginBottom: 6 }}>Tenant Sign In</h2>
          <p style={{ color: '#475569', fontSize: 13, marginBottom: 24 }}>Access your billing statements, lease, and maintenance 24/7.</p>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ width: '100%', padding: '12px 14px', background: '#0d1a2e', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, fontSize: 14, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui', boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Portal PIN</label>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="4-digit PIN"
              maxLength={4}
              style={{ width: '100%', padding: '12px 14px', background: '#0d1a2e', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, fontSize: 14, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui', boxSizing: 'border-box' as const }} />
          </div>

          <button onClick={login} disabled={logging || !email || !pin}
            style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', border: 'none', borderRadius: 11, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'system-ui', opacity: logging ? 0.7 : 1 }}>
            {logging ? 'Signing in...' : 'Access Portal'}
          </button>

          {loginError && <div style={{ marginTop: 14, color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{loginError}</div>}

          <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.12)', borderRadius: 10 }}>
            <p style={{ color: '#475569', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
              Your portal PIN was provided by your property manager. If you need your PIN reset, call <strong style={{ color: '#4f8ef7' }}>405-755-9246</strong> or email the office.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <a href="/propflow/dashboard" style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}>← Management Login</a>
        </div>
      </div>
    </div>
  )

  // PORTAL
  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: '#e2e8f0', fontFamily: 'system-ui,sans-serif', paddingBottom: 48 }}>
      <style>{`.tab-btn{transition:all 0.15s;cursor:pointer;border:none;font-family:system-ui} .row{transition:background 0.12s} .row:hover{background:rgba(79,142,247,0.04)!important}`}</style>

      {/* HEADER */}
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(79,142,247,0.15)', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/assets/logo.png" alt="PropFlow" style={{ height: 36 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: BLUE }}>Tenant Portal</div>
            <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>Penn Station Apartments</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{tenant?.full_name}</div>
            <div style={{ fontSize: 10, color: '#475569' }}>Unit {unit?.unit_number ?? '—'}</div>
          </div>
          <button onClick={() => setStep('login')} className="tab-btn"
            style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#ef4444', fontSize: 12, fontWeight: 700 }}>
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px' }}>

        {/* TABS — scrollable on mobile */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto', scrollbarWidth: 'none' as any, WebkitOverflowScrolling: 'touch' as any, paddingBottom: 4 }}>
          {[
            { id: 'dashboard',   label: '🏠 Home' },
            { id: 'billing',     label: '💰 Billing' },
            { id: 'lease',       label: '📄 My Lease' },
            { id: 'maintenance', label: '🔧 Maintenance' },
            { id: 'notices',     label: `🔔 Notices${unreadNotices > 0 ? ` (${unreadNotices})` : ''}` },
          ].map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id as any)}
              style={{ padding: '9px 16px', borderRadius: 10, background: activeTab === t.id ? 'linear-gradient(135deg,#1d4ed8,#4f8ef7)' : 'rgba(255,255,255,0.04)', border: `1px solid ${activeTab === t.id ? '#4f8ef7' : 'rgba(255,255,255,0.08)'}`, color: activeTab === t.id ? '#fff' : '#64748b', fontWeight: 700, fontSize: 12, flexShrink: 0, whiteSpace: 'nowrap' as const }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Welcome back, {tenant?.full_name?.split(' ')[0]}!</h2>
            <p style={{ color: '#475569', fontSize: 13, marginBottom: 24 }}>Unit {unit?.unit_number} · {unit?.property_name ?? 'Penn Station Apartments'}</p>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Current Balance', value: currentBalance > 0 ? `$${currentBalance.toFixed(2)}` : '$0.00', sub: currentBalance > 0 ? 'Payment due' : 'All paid up!', color: currentBalance > 0 ? '#f59e0b' : '#22c55e' },
                { label: 'Monthly Rent', value: `$${Number(unit?.rent_amount ?? 0).toFixed(2)}`, sub: 'Due on the 1st', color: BLUE },
                { label: 'Lease Ends', value: lease ? `${daysUntilLeaseEnd}d` : '—', sub: lease ? new Date(lease.lease_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : 'No active lease', color: daysUntilLeaseEnd < 60 ? '#f59e0b' : '#22c55e' },
                { label: 'Open Requests', value: maintenance.filter(m => m.status === 'open').length, sub: 'Maintenance', color: PURPLE },
              ].map((s, i) => (
                <div key={i} style={{ background: '#070f1f', border: `1px solid ${s.color}25`, borderRadius: 14, padding: '18px 18px' }}>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: s.color, marginBottom: 2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#334155' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 24 }}>
              {[
                { icon: '📄', label: 'Download Billing Statement', action: () => { setActiveTab('billing') }, color: BLUE },
                { icon: '📋', label: 'View My Lease', action: () => setActiveTab('lease'), color: '#22c55e' },
                { icon: '🔧', label: 'Submit Maintenance Request', action: () => { setActiveTab('maintenance'); setNewRequest(true) }, color: PURPLE },
                { icon: '🔔', label: 'View Notices', action: () => setActiveTab('notices'), color: '#f59e0b' },
              ].map((q, i) => (
                <button key={i} onClick={q.action} className="tab-btn"
                  style={{ background: '#070f1f', border: `1px solid ${q.color}25`, borderRadius: 14, padding: '18px', display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left', width: '100%' }}>
                  <span style={{ fontSize: 24 }}>{q.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', lineHeight: 1.4 }}>{q.label}</span>
                </button>
              ))}
            </div>

            {/* Recent notices */}
            {notices.slice(0, 2).map((n: any, i: number) => (
              <div key={i} style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.12)', borderRadius: 12, padding: '14px 18px', marginBottom: 10, display: 'flex', gap: 14 }}>
                <span style={{ fontSize: 20 }}>📢</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{n.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Billing Statements</h2>
                <p style={{ color: '#475569', fontSize: 13, margin: '4px 0 0' }}>View and download your statements anytime</p>
              </div>
              {currentBalance > 0 && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '10px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, letterSpacing: 1 }}>BALANCE DUE</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>${currentBalance.toFixed(2)}</div>
                </div>
              )}
            </div>

            <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 100px 80px', gap: 10, padding: '11px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                <span>Period</span><span>Rent</span><span>Total</span><span>Status</span><span>Download</span>
              </div>
              {loading ? (
                <div style={{ padding: 32, color: '#475569', fontSize: 13 }}>Loading statements...</div>
              ) : statements.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#334155', fontSize: 13 }}>No statements found.</div>
              ) : statements.map((s: any, i: number) => (
                <div key={i} className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 100px 80px', gap: 10, padding: '14px 18px', borderBottom: i < statements.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{new Date(s.statement_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                    <div style={{ fontSize: 11, color: '#334155' }}>Due {new Date(s.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>${Number(s.base_rent).toFixed(2)}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>${Number(s.total_due).toFixed(2)}</div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(s.status), background: `${statusColor(s.status)}12`, border: `1px solid ${statusColor(s.status)}30`, borderRadius: 6, padding: '3px 9px' }}>
                      {statusLabel(s.status)}
                    </span>
                  </div>
                  <button onClick={() => printStatement(s, tenant, unit)} className="tab-btn"
                    style={{ padding: '6px 10px', background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 7, color: BLUE, fontSize: 11, fontWeight: 700 }}>
                    🖨 Print
                  </button>
                </div>
              ))}
            </div>
            <p style={{ color: '#334155', fontSize: 11, marginTop: 12, textAlign: 'center' }}>
              Statements are available 24/7. Questions? Call 405-755-9246 or email the office.
            </p>
          </div>
        )}

        {/* LEASE TAB */}
        {activeTab === 'lease' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 20 }}>My Lease</h2>
            {!lease ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#334155', fontSize: 14 }}>No active lease found. Contact the office.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Lease overview */}
                <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 14, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#f0f6ff', marginBottom: 2 }}>Active Lease Agreement</div>
                      <div style={{ fontSize: 12, color: '#475569' }}>Unit {unit?.unit_number} · Penn Station Apartments</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '4px 14px' }}>
                      ● Active
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
                    {[
                      { label: 'Lease Start',       value: new Date(lease.lease_start).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                      { label: 'Lease End',          value: new Date(lease.lease_end).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                      { label: 'Monthly Rent',       value: `$${Number(lease.monthly_rent).toFixed(2)}` },
                      { label: 'Security Deposit',   value: `$${Number(lease.security_deposit).toFixed(2)}` },
                      { label: 'Days Remaining',     value: `${daysUntilLeaseEnd} days` },
                      { label: 'Lease Signed',       value: lease.signed_date ? new Date(lease.signed_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—' },
                    ].map((item, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unit details */}
                <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Unit Details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
                    {[
                      { label: 'Unit Number',  value: unit?.unit_number },
                      { label: 'Building',     value: unit?.building },
                      { label: 'Unit Type',    value: unit?.type },
                      { label: 'Square Feet',  value: `${unit?.sqft} sqft` },
                      { label: 'Bedrooms',     value: unit?.bedrooms },
                      { label: 'Bathrooms',    value: unit?.bathrooms },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{item.value ?? '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policies */}
                <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Lease Policies</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#475569' }}>Utilities Included</span>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>{Array.isArray(lease.utilities_included) ? lease.utilities_included.map((u: string) => u.charAt(0).toUpperCase() + u.slice(1)).join(', ') : 'Water, Trash'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#475569' }}>Pet Policy</span>
                      <span style={{ fontSize: 13, color: '#94a3b8', maxWidth: '60%', textAlign: 'right' }}>{lease.pet_policy ?? 'No pets without written approval'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#475569' }}>Rent Due</span>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>1st of each month</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 13, color: '#475569' }}>Late Fee</span>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>$50 if paid after the 5th</span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 14, padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 24 }}>📞</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 4 }}>Lease Questions?</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                      Call the office at <strong style={{ color: BLUE }}>405-755-9246</strong> or visit us at 1920 Heritage Park Drive, OKC 73120. Office hours: Mon–Fri 8 AM–6 PM, Sat 10 AM–2 PM.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MAINTENANCE TAB */}
        {activeTab === 'maintenance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Maintenance Requests</h2>
              <button onClick={() => setNewRequest(true)} className="tab-btn"
                style={{ padding: '9px 18px', background: 'linear-gradient(135deg,#6b21a8,#a855f7)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700 }}>
                + New Request
              </button>
            </div>

            {submitted && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, color: '#22c55e', fontWeight: 600, fontSize: 14 }}>
                ✓ Request submitted! Our team will contact you within 24 hours.
              </div>
            )}

            {newRequest && (
              <div style={{ background: '#070f1f', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 14, padding: 22, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>Submit New Request</h3>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Issue Title</label>
                  <input {...inp('title', 'Brief description of the issue')} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Details</label>
                  <textarea value={reqForm.description} onChange={e => setReqForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the issue in detail..."
                    rows={4}
                    style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, fontSize: 14, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui', boxSizing: 'border-box' as const, resize: 'vertical' as const }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Category</label>
                    <select value={reqForm.category} onChange={e => setReqForm(f => ({ ...f, category: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, fontSize: 14, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui' }}>
                      <option value="plumbing">Plumbing</option>
                      <option value="electric">Electrical</option>
                      <option value="hvac">HVAC / AC</option>
                      <option value="appliance">Appliance</option>
                      <option value="pest">Pest Control</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Priority</label>
                    <select value={reqForm.priority} onChange={e => setReqForm(f => ({ ...f, priority: e.target.value }))}
                      style={{ width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, fontSize: 14, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui' }}>
                      <option value="low">Low — Not urgent</option>
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent — Safety issue</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setNewRequest(false)} className="tab-btn"
                    style={{ flex: 1, padding: '11px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#64748b', fontSize: 14, fontWeight: 700 }}>
                    Cancel
                  </button>
                  <button onClick={submitRequest} disabled={submitting || !reqForm.title || !reqForm.description} className="tab-btn"
                    style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg,#6b21a8,#a855f7)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 800, opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </div>
            )}

            {maintenance.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#334155', fontSize: 14 }}>No maintenance requests yet.</div>
            ) : maintenance.map((m: any, i: number) => (
              <div key={i} className="row" style={{ background: '#070f1f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 18px', marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff' }}>{m.title}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: m.priority === 'urgent' ? '#ef4444' : m.priority === 'normal' ? '#f59e0b' : '#475569', background: 'rgba(255,255,255,0.05)', borderRadius: 5, padding: '2px 8px' }}>
                      {m.priority}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: m.status === 'completed' ? '#22c55e' : m.status === 'in_progress' ? '#3b82f6' : '#f59e0b', background: 'rgba(255,255,255,0.05)', borderRadius: 5, padding: '2px 8px' }}>
                      {m.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{m.description}</div>
                <div style={{ fontSize: 11, color: '#334155' }}>
                  Submitted {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  {m.assigned_to ? ` · Assigned to ${m.assigned_to}` : ''}
                  {m.completed_date ? ` · Completed ${new Date(m.completed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTICES TAB */}
        {activeTab === 'notices' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 20 }}>Notices from Management</h2>
            {notices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#334155', fontSize: 14 }}>No notices yet.</div>
            ) : notices.map((n: any, i: number) => (
              <div key={i} style={{ background: !n.read_at ? 'rgba(79,142,247,0.04)' : '#070f1f', border: `1px solid ${!n.read_at ? 'rgba(79,142,247,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '16px 18px', marginBottom: 10, display: 'flex', gap: 14 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>
                  {n.type === 'lease_renewal' ? '📋' : n.type === 'inspection' ? '🔍' : n.type === 'policy' ? '📜' : '📢'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: !n.read_at ? 800 : 600, color: '#f0f6ff' }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: '#334155' }}>{new Date(n.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{n.message}</div>
                  {!n.read_at && <div style={{ width: 8, height: 8, borderRadius: '50%', background: BLUE, marginTop: 8 }} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}