'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    id: 'price_1TTAIzBEt8l7Ia34YblJyS0v',
    annualId: 'price_1TTAIzBEt8l7Ia34YblJyS0v',
    name: 'Standard',
    price: { monthly: 299, annual: 249 },
    desc: '1 facility · Core modules',
    features: ['Temperature Monitoring', 'Drug Inventory', 'Compliance Logs', 'Compounding Batches', 'USP <797> / <800>'],
  },
  {
    id: 'price_1TTAMRBEt8l7Ia34P2kiYUZ4',
    annualId: 'price_1TTAMRBEt8l7Ia34P2kiYUZ4',
    name: 'Professional',
    price: { monthly: 799, annual: 669 },
    desc: 'Up to 3 facilities + AI Panel',
    popular: true,
    features: ['Everything in Standard', 'AI Control Panel', 'Cold Chain Fleet', 'Hospital Logistics', 'Cleanrooms Monitoring'],
  },
  {
    id: 'price_1TTARABEt8l7Ia34wUDTw0NZ',
    annualId: 'price_1TTARABEt8l7Ia34wUDTw0NZ',
    name: 'Enterprise',
    price: { monthly: 1999, annual: 1679 },
    desc: 'Unlimited facilities + full USP suite',
    features: ['Everything in Professional', 'Unlimited facilities', 'Full USP compliance suite', 'FDA audit trail export', 'Dedicated pharmacist support'],
  },
];

const STEPS = ['Plan', 'Pharmacy', 'Staff', 'Inventory', 'Review'];

export default function MedFlowOnboarding() {
  const router = useRouter();
  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [plan,    setPlan]    = useState(PLANS[1].id);
  const [annual,  setAnnual]  = useState(false);
  const [form, setForm] = useState({
    pharmacyName: '', email: '', phone: '', address: '', city: '', state: '', zip: '',
    npi: '', dea: '', pic: '', picLicense: '',
    uspLevel: '797',
    staff: [{ name: '', role: 'Pharmacist', license: '' }],
    drugs: [{ name: '', ndc: '', quantity: '', unit: 'tablets' }],
  });

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const selectedPlan = PLANS.find(p => p.id === plan)!;

  const addStaff = () => setForm(f => ({ ...f, staff: [...f.staff, { name: '', role: 'Pharmacist', license: '' }] }));
  const addDrug  = () => setForm(f => ({ ...f, drugs: [...f.drugs, { name: '', ndc: '', quantity: '', unit: 'tablets' }] }));

  const updateStaff = (i: number, field: string, val: string) => {
    const s = [...form.staff]; s[i] = { ...s[i], [field]: val }; setForm(f => ({ ...f, staff: s }));
  };
  const updateDrug = (i: number, field: string, val: string) => {
    const d = [...form.drugs]; d[i] = { ...d[i], [field]: val }; setForm(f => ({ ...f, drugs: d }));
  };

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: plan,
        product: 'medflow',
        plan: selectedPlan.name,
        billing: annual ? 'annual' : 'monthly',
        metadata: {
          price_id: plan, product: 'medflow', plan: selectedPlan.name,
          billing: annual ? 'annual' : 'monthly',
          company_name: form.pharmacyName, email: form.email, phone: form.phone,
          address: `${form.address}, ${form.city}, ${form.state} ${form.zip}`,
          npi: form.npi, dea: form.dea, pic: form.pic, usp_level: form.uspLevel,
          staff: JSON.stringify(form.staff),
          drugs: JSON.stringify(form.drugs.slice(0, 5)),
        },
        customerEmail: form.email,
        successUrl: `${window.location.origin}/medflow/dashboard?onboarded=true`,
        cancelUrl: window.location.href,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  const teal = '#14D2C2'; const bg = '#04080F'; const panel = '#0B1826';
  const card = '#0D1E2F'; const border = '#152840'; const dim = '#4A7090';
  const white = '#EEF6FB'; const D = "'Outfit',sans-serif"; const M = "'Geist Mono',monospace";
  const inp = { width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid ' + border, background: '#060E16', color: white, fontSize: 13, fontFamily: D, outline: 'none', boxSizing: 'border-box' as const };
  const lbl = { display: 'block', fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1.5, marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: white }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>⚕</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: white }}>MedFlow<span style={{ color: teal }}>OS</span></span>
          <span style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 2, marginLeft: 8 }}>ONBOARDING</span>
        </div>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back to platform</button>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: i < step ? teal : i === step ? teal + '30' : panel, border: '1px solid ' + (i <= step ? teal : border), color: i < step ? '#000' : i === step ? teal : dim }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 11, color: i === step ? white : dim, fontWeight: i === step ? 700 : 400 }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: i < step ? teal : border, marginLeft: 4 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: panel, border: '1px solid ' + border, borderRadius: 16, padding: 28 }}>

          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Choose your MedFlowOS plan</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 20 }}>HIPAA compliant · USP &lt;797&gt; / &lt;800&gt; · Cancel anytime</p>

              {/* Billing toggle */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: card, border: '1px solid ' + border, borderRadius: 100, padding: 4 }}>
                  <button onClick={() => setAnnual(false)} style={{ padding: '7px 18px', borderRadius: 100, border: 'none', background: !annual ? teal : 'transparent', color: !annual ? '#000' : dim, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: D }}>Monthly</button>
                  <button onClick={() => setAnnual(true)} style={{ padding: '7px 18px', borderRadius: 100, border: 'none', background: annual ? teal : 'transparent', color: annual ? '#000' : dim, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: D, display: 'flex', alignItems: 'center', gap: 8 }}>
                    Annual
                    <span style={{ background: '#10b981', color: '#fff', fontSize: 10, fontWeight: 800, padding: '1px 7px', borderRadius: 100 }}>SAVE 17%</span>
                  </button>
                </div>
              </div>
              {annual && <p style={{ color: '#10b981', fontSize: 12, textAlign: 'center', marginBottom: 16, fontWeight: 600 }}>Pay annually — lower monthly rate, billed as one yearly payment</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {PLANS.map(p => (
                  <div key={p.id} onClick={() => setPlan(p.id)}
                    style={{ padding: '16px 20px', borderRadius: 12, border: '2px solid ' + (plan === p.id ? teal : border), background: plan === p.id ? teal + '10' : card, cursor: 'pointer', position: 'relative', transition: 'all .2s' }}>
                    {p.popular && <div style={{ position: 'absolute', top: -10, right: 16, background: teal, color: '#000', fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 12, fontFamily: M, letterSpacing: 1.5 }}>MOST POPULAR</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: white }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{p.desc}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: 8 }}>
                          {p.features.map(f => (
                            <span key={f} style={{ fontSize: 11, color: dim }}>✓ {f}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: teal }}>
                          ${(annual ? p.price.annual : p.price.monthly).toLocaleString()}
                          <span style={{ fontSize: 12, fontWeight: 400, color: dim }}>/mo</span>
                        </div>
                        {annual && (
                          <div>
                            <div style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Billed ${(p.price.annual * 12).toLocaleString()}/yr</div>
                            <div style={{ fontSize: 10, color: dim }}>Save ${((p.price.monthly - p.price.annual) * 12).toLocaleString()}/yr</div>
                          </div>
                        )}
                        {!annual && <div style={{ fontSize: 10, color: dim, marginTop: 2 }}>Or ${p.price.annual}/mo annually</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} style={{ width: '100%', padding: 14, borderRadius: 10, background: teal, border: 'none', color: '#000', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: D }}>
                Continue with {selectedPlan.name} {annual ? 'Annual' : 'Monthly'} →
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Pharmacy Information</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Your pharmacy details for HIPAA compliance setup.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                {[
                  { label: 'PHARMACY NAME', field: 'pharmacyName', placeholder: 'City Pharmacy LLC' },
                  { label: 'PHARMACIST IN CHARGE', field: 'pic', placeholder: 'Dr. Rivera' },
                  { label: 'WORK EMAIL', field: 'email', placeholder: 'dr.rivera@pharmacy.com' },
                  { label: 'PHONE', field: 'phone', placeholder: '(405) 555-0100' },
                  { label: 'NPI NUMBER', field: 'npi', placeholder: '1234567890' },
                  { label: 'DEA LICENSE', field: 'dea', placeholder: 'AB1234563' },
                  { label: 'PIC LICENSE NUMBER', field: 'picLicense', placeholder: 'RPH-12345' },
                  { label: 'ADDRESS', field: 'address', placeholder: '1234 Medical Dr' },
                  { label: 'CITY', field: 'city', placeholder: 'Oklahoma City' },
                  { label: 'STATE', field: 'state', placeholder: 'OK' },
                ].map(f => (
                  <div key={f.field}>
                    <label style={lbl}>{f.label}</label>
                    <input value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)} placeholder={f.placeholder} style={inp} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>USP COMPLIANCE LEVEL</label>
                <select value={form.uspLevel} onChange={e => update('uspLevel', e.target.value)} style={{ ...inp }}>
                  <option value="797">USP &lt;797&gt; — Sterile Compounding Only</option>
                  <option value="800">USP &lt;800&gt; — Hazardous Drugs Only</option>
                  <option value="both">Both USP &lt;797&gt; and &lt;800&gt;</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(0)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(2)} style={{ flex: 2, padding: 13, borderRadius: 10, background: teal, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Pharmacy Staff</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Add your pharmacists and technicians — they'll have immediate access.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {form.staff.map((s, i) => (
                  <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: dim, fontFamily: M, marginBottom: 10 }}>STAFF MEMBER {i + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      <div><label style={lbl}>FULL NAME</label><input value={s.name} onChange={e => updateStaff(i, 'name', e.target.value)} placeholder="Dr. Smith" style={inp} /></div>
                      <div>
                        <label style={lbl}>ROLE</label>
                        <select value={s.role} onChange={e => updateStaff(i, 'role', e.target.value)} style={{ ...inp }}>
                          {['Pharmacist','Pharmacy Tech','Compliance Officer','Admin'].map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <div><label style={lbl}>LICENSE #</label><input value={s.license} onChange={e => updateStaff(i, 'license', e.target.value)} placeholder="RPH-12345" style={inp} /></div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addStaff} style={{ width: '100%', padding: 10, borderRadius: 9, background: 'transparent', border: '1px dashed ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D, marginBottom: 20 }}>+ Add Staff Member</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ flex: 2, padding: 13, borderRadius: 10, background: teal, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Initial Drug Inventory</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Add your top drugs — they'll be pre-loaded into the inventory system.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {form.drugs.map((d, i) => (
                  <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: dim, fontFamily: M, marginBottom: 10 }}>DRUG {i + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10 }}>
                      <div><label style={lbl}>DRUG NAME</label><input value={d.name} onChange={e => updateDrug(i, 'name', e.target.value)} placeholder="Amoxicillin 500mg" style={inp} /></div>
                      <div><label style={lbl}>NDC NUMBER</label><input value={d.ndc} onChange={e => updateDrug(i, 'ndc', e.target.value)} placeholder="0093-4155-01" style={inp} /></div>
                      <div><label style={lbl}>QUANTITY</label><input value={d.quantity} onChange={e => updateDrug(i, 'quantity', e.target.value)} placeholder="100" style={inp} /></div>
                      <div>
                        <label style={lbl}>UNIT</label>
                        <select value={d.unit} onChange={e => updateDrug(i, 'unit', e.target.value)} style={{ ...inp }}>
                          {['tablets','capsules','vials','bottles','units'].map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addDrug} style={{ width: '100%', padding: 10, borderRadius: 9, background: 'transparent', border: '1px dashed ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D, marginBottom: 20 }}>+ Add Another Drug</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(4)} style={{ flex: 2, padding: 13, borderRadius: 10, background: teal, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Review & Pay →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Review & Subscribe</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Confirm your details before proceeding to payment.</p>
              <div style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 12 }}>SUBSCRIPTION</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: white }}>MedFlowOS — {selectedPlan.name}</div>
                    <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{selectedPlan.desc}</div>
                    <div style={{ fontSize: 11, color: '#10b981', marginTop: 4 }}>{annual ? 'Annual billing' : 'Monthly billing'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: teal }}>
                      ${(annual ? selectedPlan.price.annual : selectedPlan.price.monthly).toLocaleString()}/mo
                    </div>
                    {annual && (
                      <div>
                        <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Billed ${(selectedPlan.price.annual * 12).toLocaleString()}/yr</div>
                        <div style={{ fontSize: 11, color: dim }}>Save ${((selectedPlan.price.monthly - selectedPlan.price.annual) * 12).toLocaleString()}/yr</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 12 }}>ACCOUNT DETAILS</div>
                {[
                  ['Pharmacy',    form.pharmacyName],
                  ['PIC',         form.pic],
                  ['Email',       form.email],
                  ['NPI',         form.npi],
                  ['DEA',         form.dea],
                  ['USP Level',   'USP <' + form.uspLevel + '>'],
                  ['Staff',       form.staff.filter(s => s.name).length + ' members'],
                  ['Drugs',       form.drugs.filter(d => d.name).length + ' added'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid ' + border }}>
                    <span style={{ fontSize: 12, color: dim }}>{label}</span>
                    <span style={{ fontSize: 12, color: white, fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={handleCheckout} disabled={loading} style={{ flex: 2, padding: 13, borderRadius: 10, background: teal, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Redirecting...' : 'Subscribe & Launch MedFlowOS →'}
                </button>
              </div>
              <p style={{ fontSize: 10, color: dim, textAlign: 'center', marginTop: 14 }}>HIPAA Compliant · Secure payment via Stripe · Cancel anytime</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}