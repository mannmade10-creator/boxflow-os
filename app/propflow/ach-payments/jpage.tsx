'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const BLUE   = '#4f8ef7'

async function dbGet(table: string, params: string) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  })
  return res.json()
}

function statusColor(s: string) {
  if (s === 'succeeded')  return '#22c55e'
  if (s === 'processing') return '#3b82f6'
  if (s === 'failed')     return '#ef4444'
  if (s === 'pending')    return '#f59e0b'
  return '#475569'
}

export default function ACHPaymentsPage() {
  const [accounts, setAccounts]     = useState<any[]>([])
  const [transactions, setTrans]    = useState<any[]>([])
  const [statements, setStatements] = useState<any[]>([])
  const [tenants, setTenants]       = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [showAdd, setShowAdd]       = useState(false)
  const [showPay, setShowPay]       = useState<any>(null)
  const [processing, setProcessing] = useState(false)
  const [bankForm, setBankForm]     = useState({ account_holder_name: '', bank_name: '', account_last4: '', routing_last4: '', account_type: 'checking' })
  const [payForm, setPayForm]       = useState({ amount: '', statement_id: '', tenant_id: '', account_id: '' })
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    Promise.all([
      dbGet('pf_ach_accounts', 'select=*&order=created_at.desc'),
      dbGet('pf_ach_transactions', 'select=*&order=created_at.desc&limit=50'),
      dbGet('pf_billing_statements', 'select=*&status=in.(unpaid,late,partial)&order=due_date.asc'),
      dbGet('pf_tenants', 'select=id,full_name,email,unit_id&status=eq.active'),
    ]).then(([a, t, s, ten]) => {
      setAccounts(Array.isArray(a) ? a : [])
      setTrans(Array.isArray(t) ? t : [])
      setStatements(Array.isArray(s) ? s : [])
      setTenants(Array.isArray(ten) ? ten : [])
      setLoading(false)
    })
  }, [])

  async function addBankAccount() {
    if (!bankForm.account_holder_name || !bankForm.bank_name || !bankForm.account_last4) return
    await fetch(`${SB_URL}/rest/v1/pf_ach_accounts`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ ...bankForm, verified: true, verified_at: new Date().toISOString(), status: 'active', is_default: accounts.length === 0 })
    })
    setShowAdd(false)
    setBankForm({ account_holder_name: '', bank_name: '', account_last4: '', routing_last4: '', account_type: 'checking' })
    const updated = await dbGet('pf_ach_accounts', 'select=*&order=created_at.desc')
    setAccounts(Array.isArray(updated) ? updated : [])
  }

  async function initiatePayment() {
    if (!payForm.amount || !payForm.account_id) return
    setProcessing(true)
    // Create ACH transaction record
    await fetch(`${SB_URL}/rest/v1/pf_ach_transactions`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        tenant_id: payForm.tenant_id || null,
        ach_account_id: payForm.account_id,
        billing_statement_id: payForm.statement_id || null,
        amount: parseFloat(payForm.amount),
        fee: 0,
        description: `ACH Rent Payment — $${payForm.amount}`,
        status: 'processing',
        initiated_at: new Date().toISOString()
      })
    })
    // Update billing statement
    if (payForm.statement_id) {
      await fetch(`${SB_URL}/rest/v1/pf_billing_statements?id=eq.${payForm.statement_id}`, {
        method: 'PATCH',
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status: 'paid', amount_paid: parseFloat(payForm.amount), paid_date: new Date().toISOString(), payment_method: 'ach', balance: 0 })
      })
      // Add to accounting ledger
      await fetch(`${SB_URL}/rest/v1/pf_accounting_ledger`, {
        method: 'POST',
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          category: 'income', type: 'income',
          description: `ACH Rent Payment — $${payForm.amount}`,
          amount: parseFloat(payForm.amount), payment_method: 'ach',
          transaction_date: new Date().toISOString().slice(0, 10),
          month_year: new Date().toISOString().slice(0, 7),
          reference_type: 'ach'
        })
      })
    }
    setProcessing(false)
    setShowPay(null)
    setPayForm({ amount: '', statement_id: '', tenant_id: '', account_id: '' })
    setSuccessMsg('ACH payment initiated. Funds typically arrive in 1-3 business days. No fees charged.')
    setTimeout(() => setSuccessMsg(''), 6000)
    // Reload
    const [t, s] = await Promise.all([
      dbGet('pf_ach_transactions', 'select=*&order=created_at.desc&limit=50'),
      dbGet('pf_billing_statements', 'select=*&status=in.(unpaid,late,partial)&order=due_date.asc'),
    ])
    setTrans(Array.isArray(t) ? t : [])
    setStatements(Array.isArray(s) ? s : [])
  }

  const totalProcessing = transactions.filter(t => t.status === 'processing').reduce((a, t) => a + Number(t.amount), 0)
  const totalSucceeded  = transactions.filter(t => t.status === 'succeeded').reduce((a, t) => a + Number(t.amount), 0)

  const inp = { width: '100%', padding: '11px 14px', background: '#0d1a2e', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, fontSize: 14, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui', boxSizing: 'border-box' as const }

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif', paddingBottom: 60 }}>
      <style>{`.tab-btn{transition:all 0.15s;cursor:pointer;border:none;font-family:system-ui} .row{transition:background 0.12s} .row:hover{background:rgba(79,142,247,0.04)!important}`}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(79,142,247,0.12)', background: '#070f1f', position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/propflow/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/assets/logo.png" alt="PropFlow" style={{ height: 36 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: BLUE }}>PropFlow OS</div>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>ACH Payments</div>
            </div>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowPay(true)} className="tab-btn"
            style={{ padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 9, color: '#22c55e', fontSize: 13, fontWeight: 700 }}>
            💳 Initiate Payment
          </button>
          <button onClick={() => setShowAdd(true)} className="tab-btn"
            style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', border: 'none', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 800 }}>
            + Add Bank Account
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>

        {successMsg && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, color: '#22c55e', fontWeight: 600, fontSize: 13 }}>
            ✓ {successMsg}
          </div>
        )}

        {/* ACH Banner */}
        <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(79,142,247,0.06))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '20px 22px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 28 }}>🏦</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#22c55e', marginBottom: 4 }}>Free ACH Bank Transfers</div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>
              ACH (Automated Clearing House) transfers are completely free — no transaction fees, no percentage charges. Tenants pay rent directly from their bank account to your property account. Funds arrive in 1-3 business days. Unlike card payments (2.9% fee) or cash loads ($3.95), ACH costs nothing.
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'BANK ACCOUNTS',   value: accounts.length,                        color: BLUE,     sub: 'Connected' },
            { label: 'PROCESSING',      value: `$${totalProcessing.toLocaleString()}`, color: '#f59e0b', sub: 'In transit' },
            { label: 'TOTAL RECEIVED',  value: `$${totalSucceeded.toLocaleString()}`,  color: '#22c55e', sub: 'Via ACH' },
            { label: 'UNPAID RENT',     value: statements.length,                      color: '#ef4444', sub: 'Statements due' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#070f1f', border: `1px solid ${s.color}25`, borderRadius: 14, padding: '18px 18px' }}>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#334155' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Bank accounts */}
        <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>🏦 Connected Bank Accounts</div>
          {accounts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#334155', fontSize: 13 }}>No bank accounts yet. Add one to start accepting ACH payments.</div>
          ) : accounts.map((a: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < accounts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(79,142,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏦</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff' }}>{a.bank_name}</div>
                  <div style={{ fontSize: 11, color: '#475569' }}>{a.account_type} ····{a.account_last4} · {a.account_holder_name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {a.is_default && <span style={{ fontSize: 10, fontWeight: 700, color: BLUE, background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 20, padding: '2px 10px' }}>Default</span>}
                {a.verified && <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '2px 10px' }}>✓ Verified</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Unpaid statements */}
        {statements.length > 0 && (
          <div style={{ background: '#070f1f', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>⚠️ Outstanding Rent — Collect via ACH</div>
            {statements.map((s: any, i: number) => {
              const tenant = tenants.find(t => t.id === s.tenant_id)
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < statements.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{tenant?.full_name ?? 'Tenant'}</div>
                    <div style={{ fontSize: 11, color: '#475569' }}>{new Date(s.statement_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · Due {new Date(s.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#f59e0b' }}>${Number(s.total_due).toFixed(2)}</span>
                    <button onClick={() => { setShowPay(true); setPayForm(f => ({ ...f, amount: s.total_due.toString(), statement_id: s.id, tenant_id: s.tenant_id, account_id: accounts[0]?.id ?? '' })) }} className="tab-btn"
                      style={{ padding: '6px 14px', background: '#22c55e', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700 }}>
                      Collect via ACH
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Transaction history */}
        <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>ACH Transaction History</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px', gap: 10, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 9, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            <span>Description</span><span>Amount</span><span>Date</span><span>Status</span>
          </div>
          {loading ? <div style={{ padding: 24, color: '#475569', fontSize: 13 }}>Loading...</div>
          : transactions.length === 0 ? <div style={{ padding: 24, textAlign: 'center', color: '#334155', fontSize: 13 }}>No ACH transactions yet.</div>
          : transactions.map((t: any, i: number) => (
            <div key={i} className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px 80px', gap: 10, padding: '12px 20px', borderBottom: i < transactions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f6ff' }}>{t.description ?? 'ACH Payment'}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>${Number(t.amount).toFixed(2)}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{new Date(t.initiated_at ?? t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: statusColor(t.status), background: `${statusColor(t.status)}12`, borderRadius: 5, padding: '2px 8px' }}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD BANK ACCOUNT MODAL */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
          <div style={{ background: '#0B1628', borderRadius: 20, padding: 28, maxWidth: 460, width: '100%', border: '1px solid rgba(79,142,247,0.2)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Add Bank Account</h2>
            <p style={{ color: '#475569', fontSize: 12, marginBottom: 20 }}>Connect a bank account to accept free ACH rent payments.</p>
            {[
              { key: 'account_holder_name', label: 'Account Holder Name', placeholder: 'Kenneth Covington' },
              { key: 'bank_name',           label: 'Bank Name',           placeholder: 'Chase, Wells Fargo, etc.' },
              { key: 'account_last4',       label: 'Account Last 4 Digits', placeholder: '1234' },
              { key: 'routing_last4',       label: 'Routing Last 4 Digits', placeholder: '5678' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>{f.label}</label>
                <input value={(bankForm as any)[f.key]} onChange={e => setBankForm(b => ({ ...b, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Account Type</label>
              <select value={bankForm.account_type} onChange={e => setBankForm(b => ({ ...b, account_type: e.target.value }))} style={{ ...inp, color: '#f0f6ff' }}>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.12)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.6 }}>
                🔒 Bank account details are stored securely. In production, Stripe handles full ACH verification via micro-deposits or instant bank verification through Plaid.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAdd(false)} className="tab-btn"
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#64748b', fontSize: 14, fontWeight: 700 }}>Cancel</button>
              <button onClick={addBankAccount} disabled={!bankForm.account_holder_name || !bankForm.bank_name || !bankForm.account_last4} className="tab-btn"
                style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800 }}>
                Connect Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INITIATE PAYMENT MODAL */}
      {showPay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
          <div style={{ background: '#0B1628', borderRadius: 20, padding: 28, maxWidth: 440, width: '100%', border: '1px solid rgba(34,197,94,0.25)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Initiate ACH Payment</h2>
            <p style={{ color: '#475569', fontSize: 12, marginBottom: 20 }}>Free bank transfer · No fees · 1-3 business days</p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Amount ($)</label>
              <input type="number" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" style={inp} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Bank Account</label>
              <select value={payForm.account_id} onChange={e => setPayForm(f => ({ ...f, account_id: e.target.value }))} style={{ ...inp, color: '#f0f6ff' }}>
                <option value="">Select account...</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.bank_name} ····{a.account_last4}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Tenant</label>
              <select value={payForm.tenant_id} onChange={e => setPayForm(f => ({ ...f, tenant_id: e.target.value }))} style={{ ...inp, color: '#f0f6ff' }}>
                <option value="">Select tenant (optional)...</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
            </div>
            <div style={{ padding: '12px 14px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>Free ACH Transfer</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Amount: ${payForm.amount || '0.00'} · Fee: $0.00 · Net: ${payForm.amount || '0.00'}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowPay(null); setPayForm({ amount: '', statement_id: '', tenant_id: '', account_id: '' }) }} className="tab-btn"
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#64748b', fontSize: 14, fontWeight: 700 }}>Cancel</button>
              <button onClick={initiatePayment} disabled={processing || !payForm.amount || !payForm.account_id} className="tab-btn"
                style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg,#16a34a,#22c55e)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800, opacity: processing ? 0.7 : 1 }}>
                {processing ? 'Processing...' : '✓ Initiate Free ACH Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}