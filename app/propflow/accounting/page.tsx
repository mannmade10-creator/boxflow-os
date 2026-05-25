'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const BLUE   = '#4f8ef7'
const GREEN  = '#22c55e'

async function dbGet(table: string, params: string) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  })
  return res.json()
}

function categoryColor(c: string) {
  if (c === 'income')              return '#22c55e'
  if (c === 'late_fee')            return '#f59e0b'
  if (c === 'security_deposit')    return '#3b82f6'
  if (c.startsWith('expense'))     return '#ef4444'
  return '#475569'
}
function categoryLabel(c: string) {
  const map: Record<string,string> = {
    income:               'Rent Income',
    late_fee:             'Late Fee',
    security_deposit:     'Security Deposit',
    pet_deposit:          'Pet Deposit',
    expense_maintenance:  'Maintenance Expense',
    expense_vacancy:      'Vacancy Cost',
    expense_management:   'Management Fee',
    expense_other:        'Other Expense',
  }
  return map[c] ?? c
}

export default function AccountingPage() {
  const [ledger, setLedger]       = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [activeMonth, setMonth]   = useState('')
  const [filterType, setFilter]   = useState('all')
  const [showAdd, setShowAdd]     = useState(false)
  const [addForm, setAddForm]     = useState({ description: '', amount: '', category: 'expense_maintenance', type: 'expense', payment_method: 'cash', notes: '' })
  const [adding, setAdding]       = useState(false)

  useEffect(() => {
    const now = new Date()
    setMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  }, [])

  useEffect(() => { if (activeMonth) loadLedger() }, [activeMonth])

  async function loadLedger() {
    setLoading(true)
    const data = await dbGet('pf_accounting_ledger', `order=transaction_date.desc&limit=200`)
    if (Array.isArray(data)) setLedger(data)
    setLoading(false)
  }

  async function addTransaction() {
    if (!addForm.description || !addForm.amount) return
    setAdding(true)
    await fetch(`${SB_URL}/rest/v1/pf_accounting_ledger`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        ...addForm, amount: parseFloat(addForm.amount),
        transaction_date: new Date().toISOString().slice(0, 10),
        month_year: activeMonth, reference_type: 'manual'
      })
    })
    setAdding(false); setShowAdd(false)
    setAddForm({ description: '', amount: '', category: 'expense_maintenance', type: 'expense', payment_method: 'cash', notes: '' })
    loadLedger()
  }

  // Compute insights
  const allMonths = [...new Set(ledger.map(l => l.month_year).filter(Boolean))].sort().reverse()
  const monthData = ledger.filter(l => !activeMonth || l.month_year === activeMonth)
  const filtered  = filterType === 'all' ? monthData : monthData.filter(l => l.type === filterType || l.category === filterType)

  const totalIncome   = monthData.filter(l => l.type === 'income').reduce((a, l) => a + Number(l.amount), 0)
  const totalExpenses = monthData.filter(l => l.type === 'expense').reduce((a, l) => a + Number(l.amount), 0)
  const netIncome     = totalIncome - totalExpenses
  const expectedRent  = 5 * 800 // demo: 5 tenants × avg rent

  // Category breakdown
  const byCategory: Record<string, number> = {}
  monthData.forEach(l => {
    const key = l.category ?? l.type
    byCategory[key] = (byCategory[key] ?? 0) + Number(l.amount)
  })

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
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>Accounting & Insights</div>
            </div>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={activeMonth} onChange={e => setMonth(e.target.value)}
            style={{ padding: '8px 12px', background: '#0d1a2e', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 9, color: '#f0f6ff', fontSize: 13, outline: 'none' }}>
            {allMonths.map(m => (
              <option key={m} value={m}>{new Date(m + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</option>
            ))}
          </select>
          <button onClick={() => setShowAdd(true)} className="tab-btn"
            style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', border: 'none', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 800 }}>
            + Add Entry
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>

        {/* P&L Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'TOTAL INCOME',    value: `$${totalIncome.toLocaleString()}`,   sub: `Expected: $${expectedRent.toLocaleString()}`, color: GREEN,   icon: '💰' },
            { label: 'TOTAL EXPENSES',  value: `$${totalExpenses.toLocaleString()}`, sub: 'Maintenance + operations', color: '#ef4444', icon: '📉' },
            { label: 'NET INCOME (NOI)',value: `$${netIncome.toLocaleString()}`,     sub: netIncome > 0 ? 'Positive cash flow' : 'Negative cash flow', color: netIncome > 0 ? GREEN : '#ef4444', icon: '📊' },
            { label: 'COLLECTION RATE', value: `${expectedRent > 0 ? Math.round((totalIncome / expectedRent) * 100) : 0}%`, sub: 'Rent collected vs expected', color: BLUE, icon: '📈' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#070f1f', border: `1px solid ${s.color}25`, borderRadius: 14, padding: '20px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1.5 }}>{s.label}</div>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 3 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#334155' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Income bar */}
        <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>Income vs Expenses</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#475569' }}>Rent Income</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>${totalIncome.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (totalIncome / (expectedRent || 1)) * 100)}%`, background: 'linear-gradient(90deg,#16a34a,#22c55e)', borderRadius: 4, transition: 'width 0.8s ease' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#475569' }}>Expenses</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>${totalExpenses.toLocaleString()}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (totalExpenses / (totalIncome || 1)) * 100)}%`, background: 'linear-gradient(90deg,#b91c1c,#ef4444)', borderRadius: 4, transition: 'width 0.8s ease' }} />
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 16 }}>By Category</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount], i) => {
              const maxAmount = Math.max(...Object.values(byCategory))
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{categoryLabel(cat)}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: categoryColor(cat) }}>${Number(amount).toLocaleString()}</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(Number(amount) / maxAmount) * 100}%`, background: categoryColor(cat), borderRadius: 3, opacity: 0.85 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Transaction Ledger */}
        <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>Transaction Ledger</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all','income','expense'].map(f => (
                <button key={f} className="tab-btn" onClick={() => setFilter(f)}
                  style={{ padding: '5px 12px', borderRadius: 7, background: filterType === f ? BLUE : 'rgba(255,255,255,0.04)', border: `1px solid ${filterType === f ? BLUE : 'rgba(255,255,255,0.08)'}`, color: filterType === f ? '#fff' : '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 80px', gap: 10, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 9, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            <span>Description</span><span>Category</span><span>Date</span><span>Amount</span>
          </div>

          {loading ? <div style={{ padding: 24, color: '#475569', fontSize: 13 }}>Loading...</div>
          : filtered.length === 0 ? <div style={{ padding: 24, textAlign: 'center', color: '#334155', fontSize: 13 }}>No transactions for this period.</div>
          : filtered.map((l: any, i: number) => (
            <div key={i} className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 130px 90px 80px', gap: 10, padding: '12px 20px', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f6ff' }}>{l.description}</div>
                {l.payment_method && <div style={{ fontSize: 10, color: '#334155' }}>{l.payment_method}</div>}
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: categoryColor(l.category ?? l.type), background: `${categoryColor(l.category ?? l.type)}12`, borderRadius: 5, padding: '2px 8px' }}>
                  {categoryLabel(l.category ?? l.type)}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                {new Date(l.transaction_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: l.type === 'income' ? GREEN : '#ef4444', textAlign: 'right' }}>
                {l.type === 'income' ? '+' : '-'}${Number(l.amount).toLocaleString()}
              </div>
            </div>
          ))}

          {/* Totals footer */}
          <div style={{ padding: '14px 20px', borderTop: '2px solid rgba(79,142,247,0.15)', display: 'flex', justifyContent: 'flex-end', gap: 28 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>TOTAL INCOME</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: GREEN }}>+${totalIncome.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>TOTAL EXPENSES</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#ef4444' }}>-${totalExpenses.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 28 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 3 }}>NET (NOI)</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: netIncome >= 0 ? GREEN : '#ef4444' }}>${netIncome.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* QuickBooks note */}
        <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.12)', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>📚</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: BLUE, marginBottom: 3 }}>QuickBooks Integration (Coming Soon)</div>
            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
              When you are ready, PropFlow can sync all transactions directly to QuickBooks Online. Each property management client who signs up will be prompted to connect their QuickBooks account for seamless bookkeeping. All income, expenses, and reconciliation will sync automatically.
            </div>
          </div>
        </div>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
          <div style={{ background: '#0B1628', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%', border: '1px solid rgba(79,142,247,0.2)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 20 }}>Add Transaction</h2>
            {[
              { key: 'description', label: 'Description', placeholder: 'e.g. Plumbing repair Unit 1900-A' },
              { key: 'amount',      label: 'Amount ($)',  placeholder: '0.00', type: 'number' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>{f.label}</label>
                <input type={f.type ?? 'text'} value={(addForm as any)[f.key]} onChange={e => setAddForm(a => ({ ...a, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inp} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Type</label>
                <select value={addForm.type} onChange={e => setAddForm(a => ({ ...a, type: e.target.value }))} style={{ ...inp, color: '#f0f6ff' }}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Category</label>
                <select value={addForm.category} onChange={e => setAddForm(a => ({ ...a, category: e.target.value }))} style={{ ...inp, color: '#f0f6ff' }}>
                  <option value="income">Rent Income</option>
                  <option value="late_fee">Late Fee</option>
                  <option value="security_deposit">Security Deposit</option>
                  <option value="expense_maintenance">Maintenance</option>
                  <option value="expense_management">Management Fee</option>
                  <option value="expense_other">Other Expense</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 7 }}>Notes (optional)</label>
              <input value={addForm.notes} onChange={e => setAddForm(a => ({ ...a, notes: e.target.value }))} placeholder="Any additional notes..." style={inp} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAdd(false)} className="tab-btn"
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#64748b', fontSize: 14, fontWeight: 700 }}>Cancel</button>
              <button onClick={addTransaction} disabled={adding || !addForm.description || !addForm.amount} className="tab-btn"
                style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800, opacity: adding ? 0.7 : 1 }}>
                {adding ? 'Adding...' : 'Add Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}