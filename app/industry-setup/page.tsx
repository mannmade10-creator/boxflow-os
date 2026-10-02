'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const industries = [
  {
    id: 'corrugated',
    icon: '📦',
    title: 'Corrugated & Paper',
    subtitle: 'Box plants, corrugators, paper mills',
    color: '#3b82f6',
    modules: ['Production Floor', 'Order Queue', 'Roll Stock', 'Shift Performance', 'Dispatch', 'Fleet GPS', 'Client Portal', 'HR', 'Analytics'],
    kpis: ['Footage per Shift', 'Waste %', 'Machine Uptime', 'Orders Complete'],
  },
  {
    id: 'steel',
    icon: '🏗️',
    title: 'Steel & Metal Fabrication',
    subtitle: 'Steel mills, fabricators, metal processing',
    color: '#64748b',
    modules: ['Production Floor', 'Mill Schedule', 'Inventory', 'Dispatch', 'Fleet GPS', 'Client Portal', 'HR', 'Analytics'],
    kpis: ['Tons per Shift', 'Scrap %', 'Heat Time', 'Orders Complete'],
  },
  {
    id: 'food',
    icon: '🍕',
    title: 'Food & Beverage',
    subtitle: 'Food production, beverage bottling, processing plants',
    color: '#f59e0b',
    modules: ['Production Floor', 'Batch Tracking', 'Recipe Management', 'Dispatch', 'Fleet GPS', 'Client Portal', 'HR', 'Analytics'],
    kpis: ['Batch Yield %', 'Waste %', 'Temperature Compliance', 'Orders Complete'],
  },
  {
    id: 'trucking',
    icon: '🚛',
    title: 'Trucking & Freight',
    subtitle: 'Carriers, freight brokers, dispatch companies',
    color: '#22c55e',
    modules: ['Freight Dispatch', 'Load Board', 'Fleet GPS', 'Driver Portal', 'Client Portal', 'HR', 'Analytics'],
    kpis: ['Loads per Day', 'On-Time %', 'Revenue per Mile', 'Active Trucks'],
  },
  {
    id: 'warehousing',
    icon: '🏪',
    title: 'Warehousing & Distribution',
    subtitle: 'Distribution centers, 3PL, fulfillment',
    color: '#a855f7',
    modules: ['Inventory Management', 'Receiving', 'Shipping', 'Dispatch', 'Fleet GPS', 'Client Portal', 'HR', 'Analytics'],
    kpis: ['Orders Fulfilled', 'Inventory Accuracy', 'Pick Rate', 'Ship Time'],
  },
  {
    id: 'general',
    icon: '🏭',
    title: 'General Manufacturing',
    subtitle: 'Any manufacturing operation not listed above',
    color: '#ef4444',
    modules: ['Production Floor', 'Order Management', 'Inventory', 'Dispatch', 'Fleet GPS', 'Client Portal', 'HR', 'Analytics'],
    kpis: ['Units per Shift', 'Defect %', 'Machine Uptime', 'Orders Complete'],
  },
]

export default function IndustrySetupPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState('')
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const selectedIndustry = industries.find(i => i.id === selected)

  async function handleSave() {
    if (!selected || !companyName) return
    setSaving(true)
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('company_profiles').upsert({
          user_id: user.id,
          company_name: companyName,
          industry: selected,
          modules: selectedIndustry?.modules || [],
          onboarding_complete: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
      }
    } catch (err) {
      console.error(err)
    }
    setSaving(false)
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#e2e8f0', fontFamily: 'Arial, sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
            <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 48, height: 48 }} />
            <span style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>BoxFlow OS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= s ? '#3b82f6' : 'rgba(99,132,255,0.15)', border: `2px solid ${step >= s ? '#3b82f6' : 'rgba(99,132,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: step >= s ? '#fff' : '#475569' }}>{s}</div>
                {s < 2 && <div style={{ width: 60, height: 2, background: step > s ? '#3b82f6' : 'rgba(99,132,255,0.2)' }} />}
              </div>
            ))}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
            {step === 1 ? 'What type of operation do you run?' : 'Almost done — tell us about your company'}
          </h1>
          <p style={{ fontSize: 16, color: '#475569' }}>
            {step === 1 ? 'BoxFlow OS will configure itself with the right tools, terminology, and KPIs for your industry.' : 'This helps us personalize your dashboard and reports.'}
          </p>
        </div>

        {step === 1 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
              {industries.map(ind => (
                <button key={ind.id} onClick={() => setSelected(ind.id)}
                  style={{ padding: 24, borderRadius: 16, border: `2px solid ${selected === ind.id ? ind.color : 'rgba(99,132,255,0.15)'}`, background: selected === ind.id ? `${ind.color}15` : 'rgba(15,23,42,0.6)', cursor: 'pointer', textAlign: 'left' as const, transition: 'all 0.2s ease' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{ind.icon}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: selected === ind.id ? ind.color : '#fff', marginBottom: 6 }}>{ind.title}</div>
                  <div style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>{ind.subtitle}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                    {ind.kpis.map(kpi => (
                      <span key={kpi} style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: selected === ind.id ? `${ind.color}20` : 'rgba(99,132,255,0.08)', color: selected === ind.id ? ind.color : '#475569', border: `1px solid ${selected === ind.id ? `${ind.color}30` : 'rgba(99,132,255,0.1)'}` }}>{kpi}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' as const }}>
              <button onClick={() => { if (selected) setStep(2) }} disabled={!selected}
                style={{ padding: '16px 48px', borderRadius: 13, fontSize: 17, fontWeight: 800, cursor: selected ? 'pointer' : 'not-allowed', background: selected ? '#3b82f6' : 'rgba(59,130,246,0.3)', border: 'none', color: '#fff' }}>
                Continue →
              </button>
            </div>
          </>
        )}

        {step === 2 && selectedIndustry && (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.15)', borderRadius: 20, padding: 32, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, padding: 16, background: `${selectedIndustry.color}10`, borderRadius: 12, border: `1px solid ${selectedIndustry.color}30` }}>
                <span style={{ fontSize: 32 }}>{selectedIndustry.icon}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: selectedIndustry.color }}>{selectedIndustry.title}</div>
                  <div style={{ fontSize: 13, color: '#475569' }}>Selected industry — change below if needed</div>
                </div>
                <button onClick={() => setStep(1)} style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'rgba(99,132,255,0.1)', border: '1px solid rgba(99,132,255,0.2)', color: '#94a3b8' }}>Change</button>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>Company Name</label>
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Acme Manufacturing Inc." autoFocus
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(7,15,31,0.8)', color: '#e2e8f0', fontSize: 16, outline: 'none', boxSizing: 'border-box' as const }} />
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 12 }}>Your Modules</label>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8 }}>
                  {selectedIndustry.modules.map(m => (
                    <span key={m} style={{ padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: `${selectedIndustry.color}15`, color: selectedIndustry.color, border: `1px solid ${selectedIndustry.color}30` }}>✓ {m}</span>
                  ))}
                </div>
              </div>

              <button onClick={handleSave} disabled={!companyName || saving}
                style={{ width: '100%', padding: '16px', borderRadius: 13, fontSize: 17, fontWeight: 800, cursor: companyName && !saving ? 'pointer' : 'not-allowed', background: companyName && !saving ? selectedIndustry.color : 'rgba(99,132,255,0.3)', border: 'none', color: '#fff' }}>
                {saving ? 'Setting up your platform...' : `Launch ${selectedIndustry.title} Dashboard →`}
              </button>
            </div>

            <div style={{ textAlign: 'center' as const, fontSize: 13, color: '#334155' }}>
              You can change your industry and modules anytime in Settings
            </div>
          </div>
        )}
      </div>
    </div>
  )
}