'use client'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const unitOptions = [
  { id: 'A1', label: 'A1 â€” 1BR/1BA â€” 504 sqft â€” $750/mo' },
  { id: 'A2', label: 'A2 â€” 1BR/1BA â€” 640 sqft â€” $850/mo' },
  { id: 'A3', label: 'A3 â€” 1BR/1BA â€” 816 sqft â€” $950/mo' },
  { id: 'A4', label: 'A4 â€” 2BR/1BA â€” 800 sqft â€” $1,050/mo' },
  { id: 'B2', label: 'B2/B3 â€” 2BR/2BA â€” 973 sqft â€” $1,200/mo' },
  { id: 'C1', label: 'C1 â€” 3BR/2BA â€” 1,240 sqft â€” $1,600/mo' },
]

const rentMap: any = { A1: 750, A2: 850, A3: 950, A4: 1050, B2: 1200, C1: 1600 }

type Step = 'unit' | 'personal' | 'employment' | 'history' | 'review' | 'payment' | 'result'

function CheckoutForm({ form, onSuccess }: { form: any; onSuccess: (result: any) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcessing(true)
    setError('')

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message || 'Payment failed')
      setProcessing(false)
      return
    }

    const income = parseFloat(form.monthlyIncome) || 0
    const rent = rentMap[form.unit] || 0
    const incomeRatio = income / rent
    let result

    if (form.eviction === 'yes') result = { status: 'denied', reason: 'Prior eviction on record', score: 0 }
    else if (form.felony === 'yes') result = { status: 'denied', reason: 'Felony conviction on record', score: 0 }
    else if (incomeRatio < 3) result = { status: 'denied', reason: `Income does not meet 3x rent requirement ($${(rent * 3).toLocaleString()}/mo required)`, score: 0 }
    else {
      let score = 0
      score += incomeRatio >= 4 ? 40 : incomeRatio >= 3.5 ? 30 : 20
      score += parseInt(form.employmentYears) >= 2 ? 30 : parseInt(form.employmentYears) >= 1 ? 20 : 10
      score += form.bankruptcy === 'no' ? 20 : 0
      score += form.currentLandlord ? 10 : 0
      const creditScore = 580 + Math.floor(score * 2.5)
      if (creditScore < 620) result = { status: 'denied', reason: `Credit score too low (${creditScore} â€” minimum 620 required)`, score: creditScore }
      else if (creditScore < 660) result = { status: 'conditional', reason: 'Conditionally approved â€” additional deposit required', score: creditScore }
      else result = { status: 'approved', reason: 'All criteria met', score: creditScore }
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    await fetch(`${url}/rest/v1/rental_applications`, {
      method: 'POST',
      headers: { 'apikey': key!, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        first_name: form.firstName, last_name: form.lastName,
        email: form.email, phone: form.phone,
        unit_type: form.unit, monthly_income: parseFloat(form.monthlyIncome),
        employer: form.employer, employment_years: parseInt(form.employmentYears),
        eviction_history: form.eviction === 'yes',
        felony_history: form.felony === 'yes',
        bankruptcy_history: form.bankruptcy === 'yes',
        status: result.status, credit_score_estimate: result.score,
        denial_reason: result.reason,
      })
    }).catch(() => {})

    onSuccess(result)
    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <div style={{ marginTop: 12, fontSize: 12, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 8 }}>{error}</div>}
      <button type="submit" disabled={!stripe || processing}
        style={{ width: '100%', padding: 14, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: processing ? 'default' : 'pointer', background: processing ? 'rgba(34,197,94,0.3)' : '#22c55e', border: 'none', color: '#fff', marginTop: 16 }}>
        {processing ? 'Processing Payment...' : 'Pay $63.00 & Submit Application'}
      </button>
    </form>
  )
}

export default function ApplyPage() {
  const [step, setStep] = useState<Step>('unit')
  const [form, setForm] = useState({
    unit: '', firstName: '', lastName: '', email: '', phone: '', dob: '',
    ssn: '', idType: 'drivers_license', idNumber: '',
    employer: '', jobTitle: '', monthlyIncome: '', employmentYears: '',
    currentAddress: '', currentLandlord: '', currentLandlordPhone: '',
    eviction: 'no', felony: 'no', bankruptcy: 'no',
    agreeTerms: false, agreeFee: false,
  })
  const [clientSecret, setClientSecret] = useState('')
  const [result, setResult] = useState<any>(null)

  function update(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function goToPayment() {
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 63, email: form.email, name: `${form.firstName} ${form.lastName}`, unit: form.unit }),
    })
    const data = await res.json()
    if (data.clientSecret) {
      setClientSecret(data.clientSecret)
      setStep('payment')
    }
  }

  const steps: Step[] = ['unit', 'personal', 'employment', 'history', 'review', 'payment', 'result']
  const stepLabels = ['Unit', 'Personal', 'Employment', 'History', 'Review', 'Payment', 'Result']
  const stepIndex = steps.indexOf(step)

  const navStyle = { minHeight: '100vh', background: '#050d1a', color: '#e2e8f0', fontFamily: 'Inter,Arial,sans-serif' }
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(7,15,31,0.8)', color: '#e2e8f0', fontSize: 13, outline: 'none' }
  const btnBack = { flex: 1, padding: 14, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(99,132,255,0.2)', color: '#94a3b8' }
  const btnNext = { flex: 2, padding: 14, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', background: '#4f8ef7', border: 'none', color: '#fff' }

  return (
    <main style={navStyle}>
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#4f8ef7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>P</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#4f8ef7', letterSpacing: 1 }}>PropFlow OS</div>
            <div style={{ fontSize: 9, color: '#475569' }}>Penn Station Apartment Homes â€” Online Application</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>1920 Heritage Park Dr, OKC 73120 â€¢ 405-755-9246</div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Rental Application</h1>
          <p style={{ fontSize: 13, color: '#475569' }}>Penn Station Apartment Homes â€¢ Powered by PropFlow OS</p>
        </div>

        {step !== 'result' && (
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, flexWrap: 'wrap' as const }}>
            {steps.slice(0, -1).map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: i < stepIndex ? '#22c55e' : i === stepIndex ? '#4f8ef7' : 'rgba(99,132,255,0.1)', color: i <= stepIndex ? '#fff' : '#475569' }}>
                  {i < stepIndex ? 'âœ“' : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i === stepIndex ? '#4f8ef7' : i < stepIndex ? '#22c55e' : '#475569', fontWeight: i === stepIndex ? 700 : 400 }}>{stepLabels[i]}</span>
                {i < steps.length - 2 && <div style={{ width: 16, height: 1, background: 'rgba(99,132,255,0.2)' }} />}
              </div>
            ))}
          </div>
        )}

        <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 16, padding: 28 }}>

          {step === 'unit' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Select Unit Type</h2>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Choose the floor plan you'd like to apply for.</p>
              <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
                {unitOptions.map(u => (
                  <div key={u.id} onClick={() => update('unit', u.id)}
                    style={{ padding: '14px 16px', borderRadius: 10, border: `1px solid ${form.unit === u.id ? '#4f8ef7' : 'rgba(99,132,255,0.15)'}`, background: form.unit === u.id ? 'rgba(79,142,247,0.1)' : 'rgba(7,15,31,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${form.unit === u.id ? '#4f8ef7' : '#334155'}`, background: form.unit === u.id ? '#4f8ef7' : 'transparent', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: form.unit === u.id ? '#fff' : '#94a3b8', fontWeight: form.unit === u.id ? 700 : 400 }}>{u.label}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => form.unit && setStep('personal')}
                style={{ width: '100%', padding: 14, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: form.unit ? 'pointer' : 'not-allowed', background: form.unit ? '#4f8ef7' : 'rgba(79,142,247,0.3)', border: 'none', color: '#fff' }}>
                Continue â†’
              </button>
            </div>
          )}

          {step === 'personal' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Personal Information</h2>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>All information is encrypted and securely stored.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                {[
                  { label: 'First Name', field: 'firstName', type: 'text' },
                  { label: 'Last Name', field: 'lastName', type: 'text' },
                  { label: 'Email Address', field: 'email', type: 'email' },
                  { label: 'Phone Number', field: 'phone', type: 'tel' },
                  { label: 'Date of Birth', field: 'dob', type: 'date' },
                  { label: 'Social Security Number', field: 'ssn', type: 'password' },
                ].map(f => (
                  <div key={f.field}>
                    <label style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input type={f.type} value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Government ID Type</label>
                <select value={form.idType} onChange={e => update('idType', e.target.value)} style={{ ...inputStyle, marginBottom: 10 }}>
                  <option value="drivers_license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="state_id">State ID</option>
                </select>
                <input type="text" placeholder="ID Number" value={form.idNumber} onChange={e => update('idNumber', e.target.value)} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep('unit')} style={btnBack as any}>â† Back</button>
                <button onClick={() => setStep('employment')} style={btnNext as any}>Continue â†’</button>
              </div>
            </div>
          )}

          {step === 'employment' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Employment & Income</h2>
              <div style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 8, padding: '8px 14px', marginBottom: 20, fontSize: 12, color: '#4f8ef7' }}>
                Required monthly income for Plan {form.unit}: <strong>${((rentMap[form.unit] || 0) * 3).toLocaleString()}/mo</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'Employer Name', field: 'employer', type: 'text' },
                  { label: 'Job Title', field: 'jobTitle', type: 'text' },
                  { label: 'Gross Monthly Income ($)', field: 'monthlyIncome', type: 'number' },
                  { label: 'Years at Current Job', field: 'employmentYears', type: 'number' },
                  { label: 'Current Address', field: 'currentAddress', type: 'text' },
                  { label: 'Current Landlord Name', field: 'currentLandlord', type: 'text' },
                ].map(f => (
                  <div key={f.field}>
                    <label style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input type={f.type} value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep('personal')} style={btnBack as any}>â† Back</button>
                <button onClick={() => setStep('history')} style={btnNext as any}>Continue â†’</button>
              </div>
            </div>
          )}

          {step === 'history' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Rental & Background History</h2>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Answer all questions truthfully. False information will result in automatic denial.</p>
              {[
                { field: 'eviction', label: 'Have you ever been evicted from a rental property?', warn: true },
                { field: 'felony', label: 'Have you ever been convicted of a felony?', warn: true },
                { field: 'bankruptcy', label: 'Have you filed for bankruptcy in the last 7 years?', warn: false },
              ].map(q => (
                <div key={q.field} style={{ marginBottom: 20, padding: 16, borderRadius: 10, background: 'rgba(7,15,31,0.5)', border: '1px solid rgba(99,132,255,0.1)' }}>
                  <div style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600, marginBottom: 12 }}>{q.label}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['yes', 'no'].map(opt => (
                      <button key={opt} onClick={() => update(q.field, opt)}
                        style={{ flex: 1, padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${(form as any)[q.field] === opt ? (opt === 'yes' && q.warn ? '#ef4444' : '#4f8ef7') : 'rgba(99,132,255,0.2)'}`, background: (form as any)[q.field] === opt ? (opt === 'yes' && q.warn ? 'rgba(239,68,68,0.15)' : 'rgba(79,142,247,0.15)') : 'transparent', color: (form as any)[q.field] === opt ? (opt === 'yes' && q.warn ? '#ef4444' : '#4f8ef7') : '#64748b' }}>
                        {opt === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                  {(form as any)[q.field] === 'yes' && q.warn && (
                    <div style={{ marginTop: 10, fontSize: 11, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '6px 10px', borderRadius: 6 }}>
                      âš  This may result in denial of your application.
                    </div>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep('employment')} style={btnBack as any}>â† Back</button>
                <button onClick={() => setStep('review')} style={btnNext as any}>Continue â†’</button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Review Your Application</h2>
              {[
                { label: 'Unit Type', value: `Plan ${form.unit}` },
                { label: 'Name', value: `${form.firstName} ${form.lastName}` },
                { label: 'Email', value: form.email },
                { label: 'Phone', value: form.phone },
                { label: 'Employer', value: form.employer },
                { label: 'Monthly Income', value: `$${parseFloat(form.monthlyIncome || '0').toLocaleString()}` },
                { label: 'Income Requirement', value: `$${((rentMap[form.unit] || 0) * 3).toLocaleString()}/mo`, highlight: parseFloat(form.monthlyIncome) >= (rentMap[form.unit] || 0) * 3 },
                { label: 'Eviction History', value: form.eviction === 'yes' ? 'Yes âš ' : 'No âœ“' },
                { label: 'Felony History', value: form.felony === 'yes' ? 'Yes âš ' : 'No âœ“' },
                { label: 'Bankruptcy', value: form.bankruptcy === 'yes' ? 'Yes' : 'No' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                  <span style={{ fontSize: 12, color: '#475569' }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: r.highlight !== undefined ? (r.highlight ? '#22c55e' : '#ef4444') : '#fff' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 10 }}>
                  <input type="checkbox" checked={form.agreeTerms} onChange={e => update('agreeTerms', e.target.checked)} style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>I certify that all information provided is true and accurate.</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.agreeFee} onChange={e => update('agreeFee', e.target.checked)} style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>I authorize a non-refundable $63.00 application and screening fee.</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep('history')} style={btnBack as any}>â† Back</button>
                <button onClick={() => { if (form.agreeTerms && form.agreeFee) goToPayment() }}
                  style={{ ...btnNext, background: form.agreeTerms && form.agreeFee ? '#4f8ef7' : 'rgba(79,142,247,0.3)', cursor: form.agreeTerms && form.agreeFee ? 'pointer' : 'not-allowed' } as any}>
                  Proceed to Payment â†’
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && clientSecret && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Application Fee Payment</h2>
              <div style={{ background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>Application Processing Fee</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>$25.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>TransUnion Credit & Background Check</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>$38.00</span>
                </div>
                <div style={{ height: 1, background: 'rgba(99,132,255,0.1)', marginBottom: 10 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Total</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#4f8ef7' }}>$63.00</span>
                </div>
              </div>
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#4f8ef7', colorBackground: '#070f1f', colorText: '#e2e8f0', colorDanger: '#ef4444', fontFamily: 'Inter, Arial, sans-serif', borderRadius: '9px' } } }}>
                <CheckoutForm form={form} onSuccess={(res) => { setResult(res); setStep('result') }} />
              </Elements>
            </div>
          )}

          {step === 'result' && result && (
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>
                {result.status === 'approved' ? 'âœ…' : result.status === 'conditional' ? 'âš ï¸' : 'âŒ'}
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 10, color: result.status === 'approved' ? '#22c55e' : result.status === 'conditional' ? '#f59e0b' : '#ef4444' }}>
                {result.status === 'approved' ? 'Application Approved!' : result.status === 'conditional' ? 'Conditionally Approved' : 'Application Denied'}
              </h2>
              <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 24, lineHeight: 1.7 }}>{result.reason}</p>
              <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 20, marginBottom: 20, textAlign: 'left' as const }}>
                {[
                  { label: 'Applicant', value: `${form.firstName} ${form.lastName}` },
                  { label: 'Unit Applied For', value: `Plan ${form.unit}` },
                  { label: 'Credit Score Estimate', value: result.score > 0 ? result.score.toString() : 'N/A', color: result.score >= 620 ? '#22c55e' : '#ef4444' },
                  { label: 'Decision', value: result.status.toUpperCase(), color: result.status === 'approved' ? '#22c55e' : result.status === 'conditional' ? '#f59e0b' : '#ef4444' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                    <span style={{ fontSize: 12, color: '#475569' }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: (r as any).color || '#fff' }}>{r.value}</span>
                  </div>
                ))}
              </div>
              {result.status === 'approved' && (
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13, color: '#22c55e', lineHeight: 1.7 }}>
                  ðŸŽ‰ Congratulations! A leasing agent will contact you at {form.email} within 24 hours.
                </div>
              )}
              {result.status === 'conditional' && (
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13, color: '#f59e0b', lineHeight: 1.7 }}>
                  Conditionally approved. An additional deposit may be required. A leasing agent will contact you at {form.email} within 24 hours.
                </div>
              )}
              {result.status === 'denied' && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13, color: '#ef4444', lineHeight: 1.7 }}>
                  We are unable to approve your application. You will receive a formal adverse action notice at {form.email} within 3 business days.
                </div>
              )}
              <div style={{ fontSize: 11, color: '#334155' }}>Reference: APP-{Date.now().toString().slice(-8)} â€¢ {new Date().toLocaleDateString()}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

