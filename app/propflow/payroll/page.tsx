'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const BLUE   = '#4f8ef7'
const GREEN  = '#22c55e'
const PURPLE = '#a855f7'
const AMBER  = '#f59e0b'
const RED    = '#ef4444'

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

// ── Tax calculation helpers ───────────────────────────────────────────────────
function calcFederalTax(gross: number, filing: string): number {
  // 2024 federal withholding brackets (simplified)
  const brackets = filing === 'married'
    ? [[23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24], [487450, 0.32], [731200, 0.35], [Infinity, 0.37]]
    : [[11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37]]
  const annual = gross * 26 // biweekly
  let tax = 0; let prev = 0
  for (const [limit, rate] of brackets as [number, number][]) {
    if (annual <= limit) { tax += (annual - prev) * rate; break }
    tax += (limit - prev) * rate; prev = limit
  }
  return Math.round((tax / 26) * 100) / 100
}
function calcSS(gross: number): number { return Math.round(gross * 0.062 * 100) / 100 }
function calcMedicare(gross: number): number { return Math.round(gross * 0.0145 * 100) / 100 }
function calcOKStateTax(gross: number): number { return Math.round(gross * 0.05 * 100) / 100 }

function calcPayrollItem(emp: any, hoursWorked = 80) {
  const isHourly = emp.pay_type === 'hourly'
  const regularHours  = Math.min(hoursWorked, 80)
  const overtimeHours = Math.max(0, hoursWorked - 80)
  const hourlyRate    = isHourly ? emp.pay_rate : emp.pay_rate / 2080
  const regularPay    = regularHours * hourlyRate
  const overtimePay   = overtimeHours * hourlyRate * 1.5
  const grossPay      = regularPay + overtimePay

  const federalTax    = calcFederalTax(grossPay, emp.federal_filing_status ?? 'single')
  const stateTax      = calcOKStateTax(grossPay)
  const ssEmp         = calcSS(grossPay)
  const medicareEmp   = calcMedicare(grossPay)
  const health        = Number(emp.health_insurance_deduction ?? 0)
  const dental        = Number(emp.dental_insurance_deduction ?? 0)
  const vision        = Number(emp.vision_insurance_deduction ?? 0)
  const k401Emp       = emp.has_401k ? Math.round(grossPay * (emp.k401_contribution_pct / 100) * 100) / 100 : 0
  const matchCap      = emp.has_401k ? emp.k401_employer_match_cap : 0
  const k401Employer  = emp.has_401k ? Math.round(grossPay * Math.min(emp.k401_contribution_pct, matchCap) / 100 * (emp.k401_employer_match_pct / 100) * 100) / 100 : 0

  const totalDeductions = federalTax + stateTax + ssEmp + medicareEmp + health + dental + vision + k401Emp
  const netPay          = Math.round((grossPay - totalDeductions) * 100) / 100

  const ssEmployer      = calcSS(grossPay)
  const medicareEmployer= calcMedicare(grossPay)
  const futa            = Math.round(grossPay * 0.006 * 100) / 100
  const suta            = Math.round(grossPay * 0.027 * 100) / 100
  const totalEmployerCost = grossPay + ssEmployer + medicareEmployer + futa + suta + k401Employer

  return {
    regular_hours: regularHours, overtime_hours: overtimeHours,
    pay_rate: hourlyRate, regular_pay: regularPay, overtime_pay: overtimePay,
    gross_pay: grossPay, federal_income_tax: federalTax, state_income_tax: stateTax,
    social_security_employee: ssEmp, medicare_employee: medicareEmp,
    health_insurance: health, dental_insurance: dental, vision_insurance: vision,
    k401_employee: k401Emp, total_deductions: totalDeductions, net_pay: netPay,
    social_security_employer: ssEmployer, medicare_employer: medicareEmployer,
    futa, suta, k401_employer_match: k401Employer, total_employer_cost: totalEmployerCost
  }
}

// ── Print pay stub ────────────────────────────────────────────────────────────
function printPayStub(item: any, emp: any, run: any) {
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<!DOCTYPE html><html><head><title>Pay Stub — ${emp.full_name}</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:680px;margin:40px auto;color:#111}
    .hdr{display:flex;justify-content:space-between;border-bottom:3px solid #4f8ef7;padding-bottom:20px;margin-bottom:24px}
    .logo{font-size:20px;font-weight:900;color:#4f8ef7}.sub{font-size:10px;color:#888;letter-spacing:2px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
    .box{background:#f8f9fa;border-radius:8px;padding:14px}
    .lbl{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:3px}
    .val{font-size:14px;font-weight:600}
    table{width:100%;border-collapse:collapse;margin-bottom:16px}
    th{background:#4f8ef7;color:#fff;padding:8px 12px;text-align:left;font-size:11px}
    td{padding:8px 12px;border-bottom:1px solid #eee;font-size:12px}
    .tot{font-weight:900;background:#f0f6ff;border-top:2px solid #4f8ef7}
    .net{text-align:center;background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px;margin-bottom:20px}
    .netamt{font-size:36px;font-weight:900;color:#16a34a}
    .footer{font-size:10px;color:#888;text-align:center;border-top:1px solid #eee;padding-top:16px;margin-top:20px}
  </style></head><body>
  <div class="hdr">
    <div><div class="logo">PropFlow OS</div><div class="sub">Payroll System — M.A.D.E Technologies</div>
    <div style="margin-top:8px;font-size:12px;color:#555">Penn Station Apartments · OKC</div></div>
    <div style="text-align:right"><div style="font-size:18px;font-weight:900">PAY STUB</div>
    <div style="font-size:12px;color:#555;margin-top:4px">Pay Period: ${new Date(run.pay_period_start).toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${new Date(run.pay_period_end).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
    <div style="font-size:12px;color:#555">Pay Date: ${new Date(run.pay_date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div></div>
  </div>
  <div class="grid">
    <div class="box"><div class="lbl">Employee</div><div class="val">${emp.full_name}</div>
    <div style="font-size:12px;color:#555;margin-top:3px">${emp.job_title} · ${emp.department}</div></div>
    <div class="box"><div class="lbl">Pay Info</div>
    <div class="val">${emp.pay_type === 'hourly' ? `$${emp.pay_rate}/hr · ${item.regular_hours}hrs` : `$${Number(emp.pay_rate).toLocaleString()}/yr`}</div>
    <div style="font-size:12px;color:#555;margin-top:3px">${emp.pay_schedule} · ${emp.direct_deposit ? 'Direct Deposit' : 'Check'}</div></div>
  </div>
  <table><thead><tr><th>Earnings</th><th style="text-align:right">Hours</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
  <tr><td>Regular Pay</td><td style="text-align:right">${item.regular_hours}</td><td style="text-align:right">$${Number(item.pay_rate).toFixed(2)}</td><td style="text-align:right">$${Number(item.regular_pay).toFixed(2)}</td></tr>
  ${item.overtime_hours > 0 ? `<tr><td>Overtime Pay (1.5×)</td><td style="text-align:right">${item.overtime_hours}</td><td style="text-align:right">$${(Number(item.pay_rate)*1.5).toFixed(2)}</td><td style="text-align:right">$${Number(item.overtime_pay).toFixed(2)}</td></tr>` : ''}
  <tr class="tot"><td colspan="3">GROSS PAY</td><td style="text-align:right">$${Number(item.gross_pay).toFixed(2)}</td></tr>
  </tbody></table>
  <table><thead><tr><th>Deductions</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
  <tr><td>Federal Income Tax (${emp.federal_filing_status})</td><td style="text-align:right">$${Number(item.federal_income_tax).toFixed(2)}</td></tr>
  <tr><td>Oklahoma State Tax</td><td style="text-align:right">$${Number(item.state_income_tax).toFixed(2)}</td></tr>
  <tr><td>Social Security (6.2%)</td><td style="text-align:right">$${Number(item.social_security_employee).toFixed(2)}</td></tr>
  <tr><td>Medicare (1.45%)</td><td style="text-align:right">$${Number(item.medicare_employee).toFixed(2)}</td></tr>
  ${item.health_insurance > 0 ? `<tr><td>Health Insurance</td><td style="text-align:right">$${Number(item.health_insurance).toFixed(2)}</td></tr>` : ''}
  ${item.dental_insurance > 0 ? `<tr><td>Dental Insurance</td><td style="text-align:right">$${Number(item.dental_insurance).toFixed(2)}</td></tr>` : ''}
  ${item.k401_employee > 0 ? `<tr><td>401(k) Employee Contribution</td><td style="text-align:right">$${Number(item.k401_employee).toFixed(2)}</td></tr>` : ''}
  <tr class="tot"><td>TOTAL DEDUCTIONS</td><td style="text-align:right">$${Number(item.total_deductions).toFixed(2)}</td></tr>
  </tbody></table>
  <div class="net"><div style="font-size:12px;color:#555;margin-bottom:6px">NET PAY — Direct Deposit to ${emp.bank_name ?? 'Bank'} ····${emp.account_last4 ?? '****'}</div>
  <div class="netamt">$${Number(item.net_pay).toFixed(2)}</div></div>
  ${item.k401_employee > 0 ? `<table><thead><tr><th>401(k) Summary</th><th style="text-align:right">This Period</th></tr></thead><tbody>
  <tr><td>Employee Contribution (${emp.k401_contribution_pct}%)</td><td style="text-align:right">$${Number(item.k401_employee).toFixed(2)}</td></tr>
  <tr><td>Employer Match (${emp.k401_employer_match_pct}% up to ${emp.k401_employer_match_cap}%)</td><td style="text-align:right">$${Number(item.k401_employer_match).toFixed(2)}</td></tr>
  </tbody></table>` : ''}
  <div class="footer">Penn Station Apartments · PropFlow OS Payroll System · M.A.D.E Technologies Inc<br>
  This is an official pay document. Please retain for your records.</div>
  </body></html>`)
  w.document.close()
  setTimeout(() => w.print(), 500)
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function PayrollPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [runs, setRuns]           = useState<any[]>([])
  const [items, setItems]         = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [activeTab, setActiveTab] = useState<'employees'|'run_payroll'|'history'|'add_employee'>('employees')
  const [activeRun, setActiveRun] = useState<any>(null)
  const [runItems, setRunItems]   = useState<any[]>([])
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess]     = useState('')
  const [showEmpDetail, setEmpDetail] = useState<any>(null)

  // New employee form
  const emptyEmp = { full_name: '', email: '', phone: '', job_title: '', department: 'maintenance', employment_type: 'full_time', hire_date: '', pay_type: 'hourly', pay_rate: '', pay_schedule: 'biweekly', hours_per_week: '40', federal_filing_status: 'single', has_401k: false, k401_contribution_pct: '0', k401_employer_match_pct: '0', k401_employer_match_cap: '0', health_insurance_deduction: '0', bank_name: '', account_last4: '', direct_deposit: true }
  const [empForm, setEmpForm]     = useState<any>(emptyEmp)
  const [savingEmp, setSavingEmp] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [emps, r, it] = await Promise.all([
      dbGet('pf_employees', 'status=eq.active&select=*&order=department.asc,full_name.asc'),
      dbGet('pf_payroll_runs', 'select=*&order=pay_date.desc&limit=20'),
      dbGet('pf_payroll_items', 'select=*&order=created_at.desc&limit=100'),
    ])
    if (Array.isArray(emps)) setEmployees(emps)
    if (Array.isArray(r))    setRuns(r)
    if (Array.isArray(it))   setItems(it)
    setLoading(false)
  }

  // Build payroll run preview
  function buildRunPreview() {
    const today      = new Date()
    const periodEnd  = new Date(today)
    const periodStart= new Date(today)
    periodStart.setDate(today.getDate() - 13)
    const payDate    = new Date(today)
    payDate.setDate(today.getDate() + 3)

    const preview = employees.map(emp => ({
      emp, ...calcPayrollItem(emp)
    }))
    setRunItems(preview)
    setActiveRun({
      pay_period_start: periodStart.toISOString().slice(0, 10),
      pay_period_end:   periodEnd.toISOString().slice(0, 10),
      pay_date:         payDate.toISOString().slice(0, 10),
      status:           'draft'
    })
    setActiveTab('run_payroll')
  }

  async function processPayroll() {
    if (!activeRun || runItems.length === 0) return
    setProcessing(true)
    // Create payroll run
    const totalGross      = runItems.reduce((a, i) => a + i.gross_pay, 0)
    const totalTaxes      = runItems.reduce((a, i) => a + i.federal_income_tax + i.state_income_tax + i.social_security_employee + i.medicare_employee, 0)
    const totalDeductions = runItems.reduce((a, i) => a + i.total_deductions, 0)
    const totalNet        = runItems.reduce((a, i) => a + i.net_pay, 0)
    const totalEmpCost    = runItems.reduce((a, i) => a + i.total_employer_cost, 0)

    const runResult = await dbPost('pf_payroll_runs', {
      ...activeRun, status: 'processed',
      total_gross: totalGross, total_taxes: totalTaxes,
      total_deductions: totalDeductions, total_net: totalNet,
      total_employer_taxes: totalEmpCost - totalGross,
      processed_by: 'Kenneth Covington',
      processed_at: new Date().toISOString()
    })
    const run = Array.isArray(runResult) ? runResult[0] : runResult

    if (run?.id) {
      // Create line items
      for (const item of runItems) {
        const { emp, ...rest } = item
        await dbPost('pf_payroll_items', { ...rest, payroll_run_id: run.id, employee_id: emp.id })
      }
      // Add to accounting ledger
      await fetch(`${SB_URL}/rest/v1/pf_accounting_ledger`, {
        method: 'POST',
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          category: 'expense_management', type: 'expense',
          description: `Payroll Run — ${employees.length} employees — Pay Date ${activeRun.pay_date}`,
          amount: totalNet, payment_method: 'direct_deposit',
          transaction_date: activeRun.pay_date,
          month_year: activeRun.pay_date.slice(0, 7),
          reference_type: 'payroll'
        })
      })
    }

    setProcessing(false)
    setSuccess(`Payroll processed! $${totalNet.toFixed(2)} net pay for ${employees.length} employees. Pay stubs ready.`)
    setTimeout(() => setSuccess(''), 6000)
    loadAll()
    setActiveTab('history')
  }

  async function saveEmployee() {
    if (!empForm.full_name || !empForm.job_title || !empForm.pay_rate) return
    setSavingEmp(true)
    await dbPost('pf_employees', {
      ...empForm,
      pay_rate: parseFloat(empForm.pay_rate),
      hours_per_week: parseFloat(empForm.hours_per_week),
      k401_contribution_pct: parseFloat(empForm.k401_contribution_pct),
      k401_employer_match_pct: parseFloat(empForm.k401_employer_match_pct),
      k401_employer_match_cap: parseFloat(empForm.k401_employer_match_cap),
      health_insurance_deduction: parseFloat(empForm.health_insurance_deduction),
      status: 'active',
      has_401k: empForm.has_401k === true || empForm.has_401k === 'true'
    })
    setSavingEmp(false)
    setEmpForm(emptyEmp)
    setActiveTab('employees')
    loadAll()
    setSuccess(`${empForm.full_name} added successfully!`)
    setTimeout(() => setSuccess(''), 4000)
  }

  const inp = (key: string, type = 'text', placeholder = '') => ({
    type, value: empForm[key] ?? '',
    onChange: (e: any) => setEmpForm((f: any) => ({ ...f, [key]: e.target.value })),
    placeholder,
    style: { width: '100%', padding: '10px 13px', background: '#0d1a2e', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, fontSize: 13, color: '#f0f6ff', outline: 'none', fontFamily: 'system-ui', boxSizing: 'border-box' as const }
  })
  const lbl = (label: string) => <label style={{ display: 'block', fontSize: 9, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 6, marginTop: 14, fontWeight: 700 }}>{label}</label>
  const sel = (key: string, options: [string,string][]) => (
    <select value={empForm[key] ?? ''} onChange={(e: any) => setEmpForm((f: any) => ({ ...f, [key]: e.target.value }))}
      style={{ width: '100%', padding: '10px 13px', background: '#0d1a2e', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, fontSize: 13, color: '#f0f6ff', outline: 'none' }}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  )

  const totalPayroll  = employees.reduce((a, emp) => {
    const item = calcPayrollItem(emp)
    return a + item.net_pay
  }, 0)
  const totalCost     = employees.reduce((a, emp) => a + calcPayrollItem(emp).total_employer_cost, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#050d1a', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif', paddingBottom: 60 }}>
      <style>{`.tab-btn{transition:all 0.15s;cursor:pointer;border:none;font-family:system-ui} .row{transition:background 0.12s} .row:hover{background:rgba(79,142,247,0.04)!important}`}</style>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(79,142,247,0.12)', background: '#070f1f', position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/propflow/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/assets/logo.png" alt="PropFlow" style={{ height: 36 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: BLUE }}>PropFlow OS</div>
              <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1 }}>Payroll & HR</div>
            </div>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setActiveTab('add_employee')} className="tab-btn"
            style={{ padding: '8px 16px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 9, color: PURPLE, fontSize: 13, fontWeight: 700 }}>
            + Add Employee
          </button>
          <button onClick={buildRunPreview} className="tab-btn"
            style={{ padding: '8px 18px', background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', border: 'none', borderRadius: 9, color: '#fff', fontSize: 13, fontWeight: 800 }}>
            💸 Run Payroll
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>

        {success && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, color: '#22c55e', fontWeight: 600, fontSize: 13 }}>
            ✓ {success}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'ACTIVE EMPLOYEES',  value: employees.length,            color: BLUE,   sub: 'On payroll' },
            { label: 'BIWEEKLY NET PAY',  value: `$${totalPayroll.toFixed(0)}`, color: GREEN,  sub: 'Employee take-home' },
            { label: 'TOTAL EMPLOYER COST', value: `$${totalCost.toFixed(0)}`, color: AMBER,  sub: 'Inc. taxes & match' },
            { label: 'PAYROLL RUNS',      value: runs.length,                 color: PURPLE, sub: 'All time' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#070f1f', border: `1px solid ${s.color}25`, borderRadius: 14, padding: '18px 18px' }}>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#334155' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto', scrollbarWidth: 'none' as any, paddingBottom: 4 }}>
          {[
            { id: 'employees',    label: '👥 Employees' },
            { id: 'run_payroll',  label: '💸 Run Payroll' },
            { id: 'history',      label: '📋 Payroll History' },
            { id: 'add_employee', label: '+ Add Employee' },
          ].map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id as any)}
              style={{ padding: '8px 16px', borderRadius: 10, background: activeTab === t.id ? 'linear-gradient(135deg,#1d4ed8,#4f8ef7)' : 'rgba(255,255,255,0.04)', border: `1px solid ${activeTab === t.id ? BLUE : 'rgba(255,255,255,0.08)'}`, color: activeTab === t.id ? '#fff' : '#64748b', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' as const }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── EMPLOYEES TAB ── */}
        {activeTab === 'employees' && (
          <div>
            {loading ? <div style={{ padding: 32, color: '#475569' }}>Loading...</div>
            : employees.map((emp, i) => {
              const item = calcPayrollItem(emp)
              return (
                <div key={i} className="row" onClick={() => setEmpDetail(emp === showEmpDetail ? null : emp)}
                  style={{ background: '#070f1f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', marginBottom: 12, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                        {emp.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{emp.full_name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{emp.job_title} · {emp.department}</div>
                        <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>
                          Hired {emp.hire_date ? new Date(emp.hire_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'} · {emp.employment_type?.replace('_', ' ')} · {emp.pay_schedule}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>GROSS (BIWEEKLY)</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>${item.gross_pay.toFixed(2)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>NET PAY</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: BLUE }}>${item.net_pay.toFixed(2)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>EMPLOYER COST</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: AMBER }}>${item.total_employer_cost.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {showEmpDetail?.id === emp.id && (
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 16 }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 14px' }}>
                          <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>Pay Breakdown</div>
                          {[
                            ['Pay Rate', emp.pay_type === 'hourly' ? `$${emp.pay_rate}/hr` : `$${Number(emp.pay_rate).toLocaleString()}/yr`],
                            ['Regular Pay', `$${item.regular_pay.toFixed(2)}`],
                            ['Gross Pay', `$${item.gross_pay.toFixed(2)}`],
                          ].map(([l, v]) => (
                            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <span style={{ fontSize: 11, color: '#475569' }}>{l}</span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#f0f6ff' }}>{v}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 14px' }}>
                          <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>Deductions</div>
                          {[
                            ['Federal Tax', `$${item.federal_income_tax.toFixed(2)}`],
                            ['OK State Tax', `$${item.state_income_tax.toFixed(2)}`],
                            ['Social Security', `$${item.social_security_employee.toFixed(2)}`],
                            ['Medicare', `$${item.medicare_employee.toFixed(2)}`],
                            ...(item.health_insurance > 0 ? [['Health Insurance', `$${item.health_insurance.toFixed(2)}`]] : []),
                            ...(item.k401_employee > 0 ? [['401(k)', `$${item.k401_employee.toFixed(2)}`]] : []),
                          ].map(([l, v]) => (
                            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <span style={{ fontSize: 11, color: '#475569' }}>{l}</span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: RED }}>{v}</span>
                            </div>
                          ))}
                        </div>
                        {emp.has_401k && (
                          <div style={{ background: 'rgba(168,85,247,0.06)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(168,85,247,0.15)' }}>
                            <div style={{ fontSize: 9, color: PURPLE, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>401(k)</div>
                            {[
                              ['Employee Contribution', `${emp.k401_contribution_pct}% = $${item.k401_employee.toFixed(2)}`],
                              ['Employer Match', `${emp.k401_employer_match_pct}% up to ${emp.k401_employer_match_cap}%`],
                              ['Employer Amount', `$${item.k401_employer_match.toFixed(2)}`],
                            ].map(([l, v]) => (
                              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, flexWrap: 'wrap', gap: 4 }}>
                                <span style={{ fontSize: 11, color: '#475569' }}>{l}</span>
                                <span style={{ fontSize: 11, fontWeight: 600, color: PURPLE }}>{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ background: 'rgba(245,158,11,0.06)', borderRadius: 10, padding: '12px 14px', border: '1px solid rgba(245,158,11,0.15)' }}>
                          <div style={{ fontSize: 9, color: AMBER, fontWeight: 700, letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' }}>Employer Taxes</div>
                          {[
                            ['SS Employer (6.2%)', `$${item.social_security_employer.toFixed(2)}`],
                            ['Medicare Employer (1.45%)', `$${item.medicare_employer.toFixed(2)}`],
                            ['FUTA (0.6%)', `$${item.futa.toFixed(2)}`],
                            ['SUTA OK (2.7%)', `$${item.suta.toFixed(2)}`],
                          ].map(([l, v]) => (
                            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <span style={{ fontSize: 11, color: '#475569' }}>{l}</span>
                              <span style={{ fontSize: 11, fontWeight: 600, color: AMBER }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(79,142,247,0.06)', borderRadius: 10, border: '1px solid rgba(79,142,247,0.12)', flexWrap: 'wrap', gap: 10 }}>
                        <span style={{ fontSize: 13, color: '#64748b' }}>Direct deposit to <strong style={{ color: '#f0f6ff' }}>{emp.bank_name ?? '—'} ····{emp.account_last4 ?? '****'}</strong></span>
                        <span style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>Net Pay: ${item.net_pay.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── RUN PAYROLL TAB ── */}
        {activeTab === 'run_payroll' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: 0 }}>Process Payroll</h2>
                {activeRun && <p style={{ color: '#475569', fontSize: 12, margin: '4px 0 0' }}>Pay Period: {activeRun.pay_period_start} – {activeRun.pay_period_end} · Pay Date: {activeRun.pay_date}</p>}
              </div>
              {runItems.length > 0 && (
                <button onClick={processPayroll} disabled={processing} className="tab-btn"
                  style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#16a34a,#22c55e)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 900, opacity: processing ? 0.7 : 1 }}>
                  {processing ? 'Processing...' : `✓ Process Payroll — $${runItems.reduce((a, i) => a + i.net_pay, 0).toFixed(2)} net`}
                </button>
              )}
            </div>

            {runItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#334155' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>💸</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#475569', marginBottom: 8 }}>Ready to run payroll</div>
                <button onClick={buildRunPreview} className="tab-btn"
                  style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#1d4ed8,#4f8ef7)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800 }}>
                  Calculate This Pay Period
                </button>
              </div>
            ) : (
              <>
                <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px 90px 90px', gap: 8, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 9, color: '#334155', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                    <span>Employee</span><span>Gross</span><span>Taxes</span><span>401(k)</span><span>Deductions</span><span>Net Pay</span>
                  </div>
                  {runItems.map((item, i) => (
                    <div key={i} className="row" style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px 90px 90px', gap: 8, padding: '14px 20px', borderBottom: i < runItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f6ff' }}>{item.emp.full_name}</div>
                        <div style={{ fontSize: 10, color: '#334155' }}>{item.emp.job_title}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>${item.gross_pay.toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: RED }}>${(item.federal_income_tax + item.state_income_tax + item.social_security_employee + item.medicare_employee).toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: PURPLE }}>{item.emp.has_401k ? `$${item.k401_employee.toFixed(2)}` : '—'}</div>
                      <div style={{ fontSize: 12, color: AMBER }}>${item.total_deductions.toFixed(2)}</div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: BLUE }}>${item.net_pay.toFixed(2)}</div>
                    </div>
                  ))}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px 90px 90px', gap: 8, padding: '14px 20px', borderTop: '2px solid rgba(79,142,247,0.15)', background: 'rgba(79,142,247,0.04)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f6ff' }}>TOTALS ({runItems.length} employees)</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: GREEN }}>${runItems.reduce((a, i) => a + i.gross_pay, 0).toFixed(2)}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: RED }}>${runItems.reduce((a, i) => a + i.federal_income_tax + i.state_income_tax + i.social_security_employee + i.medicare_employee, 0).toFixed(2)}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: PURPLE }}>${runItems.reduce((a, i) => a + i.k401_employee, 0).toFixed(2)}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: AMBER }}>${runItems.reduce((a, i) => a + i.total_deductions, 0).toFixed(2)}</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: BLUE }}>${runItems.reduce((a, i) => a + i.net_pay, 0).toFixed(2)}</div>
                  </div>
                </div>
                <div style={{ padding: '14px 18px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: AMBER, marginBottom: 4 }}>Total Employer Cost This Period</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: AMBER }}>${runItems.reduce((a, i) => a + i.total_employer_cost, 0).toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>Includes gross pay + employer SS/Medicare/FUTA/SUTA + 401(k) employer match</div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 20 }}>Payroll History</h2>
            {runs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: '#334155' }}>No payroll runs yet. Click Run Payroll to get started.</div>
            ) : runs.map((run, ri) => {
              const runLineItems = items.filter(it => it.payroll_run_id === run.id)
              return (
                <div key={ri} style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 20, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                        Pay Period: {new Date(run.pay_period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(run.pay_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>
                        Pay Date: {new Date(run.pay_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Processed by {run.processed_by ?? '—'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1, marginBottom: 2 }}>GROSS</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: GREEN }}>${Number(run.total_gross ?? 0).toFixed(2)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 9, color: '#475569', letterSpacing: 1, marginBottom: 2 }}>NET PAY</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: BLUE }}>${Number(run.total_net ?? 0).toFixed(2)}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: run.status === 'processed' ? GREEN : AMBER, background: `${run.status === 'processed' ? GREEN : AMBER}12`, border: `1px solid ${run.status === 'processed' ? GREEN : AMBER}30`, borderRadius: 20, padding: '4px 14px', alignSelf: 'center' }}>
                        {run.status}
                      </span>
                    </div>
                  </div>

                  {/* Pay stubs */}
                  {runLineItems.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {runLineItems.map((item, ii) => {
                        const emp = employees.find(e => e.id === item.employee_id)
                        return emp ? (
                          <button key={ii} onClick={() => printPayStub(item, emp, run)} className="tab-btn"
                            style={{ padding: '7px 14px', background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 8, color: BLUE, fontSize: 12, fontWeight: 700 }}>
                            🖨 {emp.full_name.split(' ')[0]} Pay Stub
                          </button>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── ADD EMPLOYEE TAB ── */}
        {activeTab === 'add_employee' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Add New Employee</h2>
            <p style={{ color: '#475569', fontSize: 13, marginBottom: 24 }}>All payroll, taxes, and 401k calculations are automatic once you enter their info.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Personal */}
              <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Personal Info</div>
                {lbl('Full Name')}       <input {...inp('full_name', 'text', 'First Last')} />
                {lbl('Email')}           <input {...inp('email', 'email', 'email@example.com')} />
                {lbl('Phone')}           <input {...inp('phone', 'text', '(405) 000-0000')} />
                {lbl('Job Title')}       <input {...inp('job_title', 'text', 'Maintenance Tech')} />
                {lbl('Department')}      {sel('department', [['maintenance','Maintenance'],['leasing','Leasing'],['management','Management'],['admin','Admin']])}
                {lbl('Employment Type')} {sel('employment_type', [['full_time','Full Time'],['part_time','Part Time'],['contractor','Contractor']])}
                {lbl('Hire Date')}       <input {...inp('hire_date', 'date', '')} />
              </div>

              {/* Pay */}
              <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.1)', borderRadius: 14, padding: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Pay & Schedule</div>
                {lbl('Pay Type')}      {sel('pay_type', [['hourly','Hourly'],['salary','Salary (Annual)']])}
                {lbl('Pay Rate')}      <input {...inp('pay_rate', 'number', empForm.pay_type === 'salary' ? 'Annual salary, e.g. 38000' : 'Hourly rate, e.g. 18.50')} />
                {lbl('Pay Schedule')}  {sel('pay_schedule', [['weekly','Weekly'],['biweekly','Bi-Weekly'],['semimonthly','Semi-Monthly'],['monthly','Monthly']])}
                {lbl('Hours Per Week')}<input {...inp('hours_per_week', 'number', '40')} />
                {lbl('Federal Filing Status')} {sel('federal_filing_status', [['single','Single'],['married','Married'],['head_of_household','Head of Household']])}
              </div>

              {/* Benefits */}
              <div style={{ background: '#070f1f', border: '1px solid rgba(168,85,247,0.1)', borderRadius: 14, padding: 22, borderColor: 'rgba(168,85,247,0.2)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: PURPLE, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Benefits</div>
                {lbl('Health Insurance Deduction (per period)')} <input {...inp('health_insurance_deduction', 'number', '125.00')} />
                {lbl('Dental Insurance Deduction')}              <input {...inp('dental_insurance_deduction', 'number', '0')} />
                {lbl('Vision Insurance Deduction')}              <input {...inp('vision_insurance_deduction', 'number', '0')} />

                <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(168,85,247,0.06)', borderRadius: 10, border: '1px solid rgba(168,85,247,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <input type="checkbox" checked={empForm.has_401k === true || empForm.has_401k === 'true'}
                      onChange={e => setEmpForm((f: any) => ({ ...f, has_401k: e.target.checked }))}
                      style={{ width: 16, height: 16, cursor: 'pointer' }} />
                    <label style={{ fontSize: 13, fontWeight: 700, color: PURPLE, cursor: 'pointer' }}>Offer 401(k) Retirement Plan</label>
                  </div>
                  {(empForm.has_401k === true || empForm.has_401k === 'true') && (
                    <>
                      {lbl('Employee Contribution %')}       <input {...inp('k401_contribution_pct', 'number', '3')} />
                      {lbl('Employer Match %')}              <input {...inp('k401_employer_match_pct', 'number', '3')} />
                      {lbl('Employer Match Cap (% of salary)')}<input {...inp('k401_employer_match_cap', 'number', '6')} />
                      <div style={{ marginTop: 10, fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
                        Example: Employee contributes 3%, employer matches 100% up to 6% of salary. Employee puts in 3% → employer puts in 3%.
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bank */}
              <div style={{ background: '#070f1f', border: '1px solid rgba(34,197,94,0.1)', borderRadius: 14, padding: 22, borderColor: 'rgba(34,197,94,0.2)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>Direct Deposit</div>
                {lbl('Bank Name')}          <input {...inp('bank_name', 'text', 'Chase, Wells Fargo...')} />
                {lbl('Account Last 4')}     <input {...inp('account_last4', 'text', '1234')} />
                {lbl('Routing Last 4')}     <input {...inp('routing_last4', 'text', '5678')} />

                {/* Pay preview */}
                {empForm.pay_rate && (
                  <div style={{ marginTop: 20, padding: '14px 16px', background: 'rgba(34,197,94,0.06)', borderRadius: 10, border: '1px solid rgba(34,197,94,0.2)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, marginBottom: 10 }}>Estimated Pay Preview</div>
                    {(() => {
                      const preview = calcPayrollItem({ ...empForm, pay_rate: parseFloat(empForm.pay_rate) || 0, k401_contribution_pct: parseFloat(empForm.k401_contribution_pct) || 0, k401_employer_match_pct: parseFloat(empForm.k401_employer_match_pct) || 0, k401_employer_match_cap: parseFloat(empForm.k401_employer_match_cap) || 0, health_insurance_deduction: parseFloat(empForm.health_insurance_deduction) || 0 })
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {[
                            ['Gross Pay', `$${preview.gross_pay.toFixed(2)}`, GREEN],
                            ['Total Deductions', `-$${preview.total_deductions.toFixed(2)}`, RED],
                            ['Net Pay (take-home)', `$${preview.net_pay.toFixed(2)}`, BLUE],
                            ['Employer Total Cost', `$${preview.total_employer_cost.toFixed(2)}`, AMBER],
                          ].map(([l, v, c]) => (
                            <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: 11, color: '#64748b' }}>{l}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: c as string }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setActiveTab('employees')} className="tab-btn"
                style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#64748b', fontSize: 14, fontWeight: 700 }}>
                Cancel
              </button>
              <button onClick={saveEmployee} disabled={savingEmp || !empForm.full_name || !empForm.pay_rate} className="tab-btn"
                style={{ flex: 2, padding: '13px', background: 'linear-gradient(135deg,#6b21a8,#a855f7)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 900, opacity: savingEmp ? 0.7 : 1 }}>
                {savingEmp ? 'Saving...' : 'Add Employee to Payroll'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}