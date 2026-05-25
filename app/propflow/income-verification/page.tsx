'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const BLUE   = '#4f8ef7'

const STORAGE_BUCKET = 'propflow-docs'

async function dbGet(table: string, params: string) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  })
  return res.json()
}

async function dbPost(table: string, body: any) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(body)
  })
  return res.json()
}

async function dbPatch(table: string, filter: string, body: any) {
  await fetch(`${SB_URL}/rest/v1/${table}?${filter}`, {
    method: 'PATCH',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify(body)
  })
}

async function uploadDoc(file: File, tenantId: string, docType: string): Promise<string | null> {
  const ext  = file.name.split('.').pop()
  const path = `income/${tenantId}/${docType}_${Date.now()}.${ext}`
  const res  = await fetch(`${SB_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': file.type, 'x-upsert': 'true' },
    body: file
  })
  if (!res.ok) return null
  return `${SB_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`
}

function statusColor(s: string) {
  if (s === 'approved')       return '#22c55e'
  if (s === 'denied')         return '#ef4444'
  if (s === 'needs_more_info') return '#f59e0b'
  return '#3b82f6'
}
function statusLabel(s: string) {
  if (s === 'approved')        return '✓ Approved'
  if (s === 'denied')          return '✗ Denied'
  if (s === 'needs_more_info') return '⚠ More Info Needed'
  return '⏳ Pending Review'
}

export default function IncomeVerificationPage() {
  const [records, setRecords]     = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeRecord, setActive] = useState<any>(null)
  const [isAdmin, setIsAdmin]     = useState(true) // toggle for demo
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    employer_name: '', employment_type: 'employed', job_title: '',
    monthly_income: '', annual_income: '', income_source: 'employment',
  })
  const [docs, setDocs] = useState<{[key: string]: File | null}>({
    paystub: null, bank_statement: null, offer_letter: null, tax_return: null
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => { loadRecords() }, [])

  async function loadRecords() {
    const data = await dbGet('pf_income_verification', 'select=*&order=created_at.desc')
    if (Array.isArray(data)) setRecords(data)
    setLoading(false)
  }

  function update(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
    // Auto-calculate annual if monthly entered
    if (key === 'monthly_income' && val) {
      setForm(f => ({ ...f, monthly_income: val, annual_income: (parseFloat(val) * 12).toFixed(0) }))
    }
  }

  async function submitApplication() {
    if (!form.full_name || !form.email || !form.monthly_income) return
    setSubmitting(true)
    // Create record first
    const monthlyIncome = parseFloat(form.monthly_income)
    const rentAmount    = 800 // will be set per unit in production
    const ratio         = Math.round((rentAmount / monthlyIncome) * 100)
    const meets         = monthlyIncome >= rentAmount * 3

    const result = await dbPost('pf_income_verification', {
      ...form,
      monthly_income: monthlyIncome,
      annual_income:  parseFloat(form.annual_income) || monthlyIncome * 12,
      meets_requirement: meets,
      rent_to_income_ratio: ratio,
      status: 'pending',
      submitted_at: new Date().toISOString()
    })

    const record = Array.isArray(result) ? result[0] : result
    if (record?.id) {
      // Upload documents
      setUploading(true)
      const urls: any = {}
      for (const [key, file] of Object.entries(docs)) {
        if (file) {
          const url = await uploadDoc(file, record.id, key)
          if (url) urls[`doc_${key}_url`] = url
        }
      }
      if (Object.keys(urls).length > 0) {
        await dbPatch('pf_income_verification', `id=eq.${record.id}`, urls)
      }
      setUploading(false)
    }

    setSubmitting(false)
    setSubmitted(true)
    setShowForm(false)
    setForm({ full_name: '', email: '', phone: '', employer_name: '', employment_type: 'employed', job_title: '', monthly_income: '', annual_income: '', income_source: 'employment' })
    setDocs({ paystub: null, bank_statement: null, offer_letter: null, tax_return: null })
    loadRecords()
    setTimeout(() => setSubmitted(false), 5000)
  }

  async function updateStatus(id: string, status: string, notes = '') {
    await dbPatch('pf_income_verification', `id=eq.${id}`, {
      status, reviewer_notes: notes, reviewed_at: new Date().toISOString(), reviewed_by: 'Kenneth Covington'
    })
    setActive(null)
    loadRecords()
  }

  const pendingCount  = records.filter(r => r.status === 'pending').length
  const approvedCount = records.filter(r => r.status === 'approved').length
  const deniedCount   = records.filter(r => r.status === 'denied').length

  const inp = { background: '#0d1a2e', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui', width: '100%', boxSizing: 'border-box' as const }
  const lbl = { display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 7, marginTop: 14 }

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif', paddingBottom: 60 }}>
      <style>{`.tab-btn{transition:all 0.15s;cursor:pointer;border:none;font-family:system-ui} .row{transition:background 0.12s} .row:hover{background:rgba(79,142,247,0.04)!important}`}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(79,142,247,0.12)', background: '#070f1f', position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/propflow/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/assets/logo.png" alt="PropFlow" style={{ height: 36 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: BLUE }}>PropFlow OS</div>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>Income Verification</div>
            </div>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setIsAdmin(a => !a)} className="tab-btn"
            style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#64748b', fontSize: 12, fontWeight: 700 }}>
            View as: {isAdmin ? 'Admin' : 'Applicant'}
          </button>
          <button onClick={() => setShowForm(true)} className="tab-btn"
            style={{ padding: '7px 18px', background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', border: 'none', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 800 }}>
            + New Application
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 20px' }}>

        {submitted && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, color: '#22c55e', fontWeight: 600, fontSize: 14 }}>
            ✓ Application submitted! The property manager will review your documents within 1-2 business days.
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'TOTAL APPLICATIONS', value: records.length, color: BLUE },
            { label: 'PENDING REVIEW',     value: pendingCount,   color: '#f59e0b' },
            { label: 'APPROVED',           value: approvedCount,  color: '#22c55e' },
            { label: 'DENIED',             value: deniedCount,    color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#070f1f', border: `1px solid ${s.color}25`, borderRadius: 14, padding: '18px 18px' }}>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Requirement info */}
        <div style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: BLUE, marginBottom: 3 }}>Income Requirement</div>
            <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
              Applicants must demonstrate monthly income of at least <strong style={{ color: '#f0f6ff' }}>3× the monthly rent</strong>. Required documents: pay stubs, bank statements, offer letter, or tax return. All documents are securely stored and reviewed within 1-2 business days.
            </div>
          </div>
        </div>

        {/* Records table */}
        <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>Applications</h2>
          </div>

          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 110px 90px 90px 80px', gap: 10, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 9, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            <span>Applicant</span><span>Income/mo</span><span>Employer</span><span>Ratio</span><span>Status</span><span>Docs</span>
          </div>

          {loading ? <div style={{ padding: 32, color: '#475569', fontSize: 13 }}>Loading...</div>
          : records.length === 0 ? <div style={{ padding: 32, textAlign: 'center', color: '#334155', fontSize: 13 }}>No applications yet. Click New Application to get started.</div>
          : records.map((r: any, i: number) => (
            <div key={i} className="row" onClick={() => setActive(r)}
              style={{ display: 'grid', gridTemplateColumns: '1fr 100px 110px 90px 90px 80px', gap: 10, padding: '14px 20px', borderBottom: i < records.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{r.full_name}</div>
                <div style={{ fontSize: 11, color: '#334155' }}>{r.email}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>${Number(r.monthly_income ?? 0).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{r.employer_name ?? '—'}</div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: r.meets_requirement ? '#22c55e' : '#ef4444' }}>
                  {r.rent_to_income_ratio ? `${r.rent_to_income_ratio}%` : '—'}
                </span>
                <div style={{ fontSize: 9, color: '#334155' }}>{r.meets_requirement ? '✓ Qualifies' : '✗ Below req.'}</div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: statusColor(r.status), background: `${statusColor(r.status)}12`, border: `1px solid ${statusColor(r.status)}25`, borderRadius: 6, padding: '2px 8px' }}>
                  {statusLabel(r.status)}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#475569' }}>
                {[r.doc_paystub_url, r.doc_bank_statement_url, r.doc_offer_letter_url, r.doc_tax_return_url].filter(Boolean).length} docs
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW APPLICATION FORM */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 999, padding: 0 }}>
          <div style={{ background: '#0B1628', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, width: '100%', maxWidth: 640, maxHeight: '92vh', overflowY: 'auto', border: '1px solid rgba(79,142,247,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Income Verification Application</h2>
              <button onClick={() => setShowForm(false)} className="tab-btn"
                style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#64748b', fontSize: 13, fontWeight: 700 }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={lbl}>Full Name</label>
                <input style={inp} value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Your full legal name" />
              </div>
              <div>
                <label style={lbl}>Email Address</label>
                <input style={inp} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" />
              </div>
              <div>
                <label style={lbl}>Phone Number</label>
                <input style={inp} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(405) 000-0000" />
              </div>
              <div>
                <label style={lbl}>Employment Type</label>
                <select style={{ ...inp, color: '#f0f6ff' }} value={form.employment_type} onChange={e => update('employment_type', e.target.value)}>
                  <option value="employed">Employed Full-Time</option>
                  <option value="part_time">Employed Part-Time</option>
                  <option value="self_employed">Self-Employed</option>
                  <option value="retired">Retired</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Employer / Company Name</label>
                <input style={inp} value={form.employer_name} onChange={e => update('employer_name', e.target.value)} placeholder="Where do you work?" />
              </div>
              <div>
                <label style={lbl}>Job Title</label>
                <input style={inp} value={form.job_title} onChange={e => update('job_title', e.target.value)} placeholder="Your position" />
              </div>
              <div>
                <label style={lbl}>Monthly Income (before taxes)</label>
                <input style={inp} type="number" value={form.monthly_income} onChange={e => update('monthly_income', e.target.value)} placeholder="3,000" />
              </div>
              <div>
                <label style={lbl}>Annual Income</label>
                <input style={inp} type="number" value={form.annual_income} onChange={e => update('annual_income', e.target.value)} placeholder="Auto-calculated" />
              </div>
            </div>

            {/* Document uploads */}
            <div style={{ marginTop: 24, padding: '18px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(79,142,247,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff', marginBottom: 4 }}>Upload Verification Documents</div>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 16 }}>Upload at least one document. Accepted formats: PDF, JPG, PNG. Max 10MB per file.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { key: 'paystub',       label: '💵 Pay Stub',       sub: 'Last 2 pay stubs' },
                  { key: 'bank_statement',label: '🏦 Bank Statement',  sub: 'Last 3 months' },
                  { key: 'offer_letter',  label: '📋 Offer Letter',    sub: 'From employer' },
                  { key: 'tax_return',    label: '📊 Tax Return',      sub: 'Most recent year' },
                ].map(d => (
                  <div key={d.key} style={{ background: docs[d.key] ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${docs[d.key] ? 'rgba(34,197,94,0.3)' : 'rgba(79,142,247,0.1)'}`, borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: docs[d.key] ? '#22c55e' : '#94a3b8', marginBottom: 2 }}>{d.label}</div>
                    <div style={{ fontSize: 10, color: '#334155', marginBottom: 10 }}>{d.sub}</div>
                    {docs[d.key] ? (
                      <div style={{ fontSize: 11, color: '#22c55e' }}>✓ {(docs[d.key] as File).name}</div>
                    ) : (
                      <label style={{ display: 'block', padding: '7px 12px', background: BLUE + '18', border: `1px solid ${BLUE}40`, borderRadius: 8, color: BLUE, fontSize: 11, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                        Choose File
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                          onChange={e => { const f = e.target.files?.[0]; const k = d.key; if (f) setDocs(prev => ({ ...prev, [k]: f })) }} />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowForm(false)} className="tab-btn"
                style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#64748b', fontSize: 14, fontWeight: 700 }}>
                Cancel
              </button>
              <button onClick={submitApplication} disabled={submitting || uploading || !form.full_name || !form.email || !form.monthly_income} className="tab-btn"
                style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 900, opacity: submitting || uploading ? 0.7 : 1 }}>
                {uploading ? 'Uploading documents...' : submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {activeRecord && (
        <div onClick={() => setActive(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0B1628', borderRadius: 20, padding: 28, maxWidth: 540, width: '100%', border: '1px solid rgba(79,142,247,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Application Review</h2>
            <p style={{ color: '#475569', fontSize: 13, marginBottom: 20 }}>Submitted {new Date(activeRecord.submitted_at ?? activeRecord.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Name',           value: activeRecord.full_name },
                { label: 'Email',          value: activeRecord.email },
                { label: 'Phone',          value: activeRecord.phone ?? '—' },
                { label: 'Employer',       value: activeRecord.employer_name ?? '—' },
                { label: 'Job Title',      value: activeRecord.job_title ?? '—' },
                { label: 'Employment',     value: activeRecord.employment_type ?? '—' },
                { label: 'Monthly Income', value: `$${Number(activeRecord.monthly_income ?? 0).toLocaleString()}` },
                { label: 'Annual Income',  value: `$${Number(activeRecord.annual_income ?? 0).toLocaleString()}` },
                { label: 'Rent:Income %',  value: activeRecord.rent_to_income_ratio ? `${activeRecord.rent_to_income_ratio}%` : '—' },
                { label: 'Qualifies',      value: activeRecord.meets_requirement ? '✓ Yes — 3× requirement met' : '✗ No — below 3× requirement' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: item.label === 'Qualifies' ? (activeRecord.meets_requirement ? '#22c55e' : '#ef4444') : '#f0f6ff' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Submitted Documents</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { url: activeRecord.doc_paystub_url,        label: '💵 Pay Stub' },
                  { url: activeRecord.doc_bank_statement_url, label: '🏦 Bank Statement' },
                  { url: activeRecord.doc_offer_letter_url,   label: '📋 Offer Letter' },
                  { url: activeRecord.doc_tax_return_url,     label: '📊 Tax Return' },
                ].map((d, i) => d.url && (
                  <a key={i} href={d.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 9, color: '#22c55e', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                    <span>{d.label}</span>
                    <span>View →</span>
                  </a>
                ))}
                {![activeRecord.doc_paystub_url, activeRecord.doc_bank_statement_url, activeRecord.doc_offer_letter_url, activeRecord.doc_tax_return_url].some(Boolean) && (
                  <div style={{ color: '#334155', fontSize: 13 }}>No documents uploaded yet.</div>
                )}
              </div>
            </div>

            {/* Admin actions */}
            {isAdmin && activeRecord.status === 'pending' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => updateStatus(activeRecord.id, 'denied')} className="tab-btn"
                  style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#ef4444', fontSize: 14, fontWeight: 700 }}>
                  ✗ Deny
                </button>
                <button onClick={() => updateStatus(activeRecord.id, 'needs_more_info')} className="tab-btn"
                  style={{ flex: 1, padding: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, color: '#f59e0b', fontSize: 14, fontWeight: 700 }}>
                  ⚠ Need More
                </button>
                <button onClick={() => updateStatus(activeRecord.id, 'approved')} className="tab-btn"
                  style={{ flex: 1, padding: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, color: '#22c55e', fontSize: 14, fontWeight: 800 }}>
                  ✓ Approve
                </button>
              </div>
            )}
            {activeRecord.status !== 'pending' && (
              <div style={{ padding: '14px 18px', background: `${statusColor(activeRecord.status)}10`, border: `1px solid ${statusColor(activeRecord.status)}30`, borderRadius: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: statusColor(activeRecord.status) }}>{statusLabel(activeRecord.status)}</div>
                {activeRecord.reviewed_at && <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Reviewed by {activeRecord.reviewed_by} · {new Date(activeRecord.reviewed_at).toLocaleDateString()}</div>}
                {activeRecord.reviewer_notes && <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>{activeRecord.reviewer_notes}</div>}
              </div>
            )}
            <button onClick={() => setActive(null)} className="tab-btn"
              style={{ width: '100%', marginTop: 14, padding: '11px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#475569', fontSize: 13, fontWeight: 700 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}