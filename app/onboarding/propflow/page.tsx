'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PLANS = [
  { id: 'price_1TTGetBEt8l7Ia34RpzMYm44', name: 'Starter',      price: '$79/mo',  desc: 'Up to 25 units' },
  { id: 'price_1TTGhmBEt8l7Ia34e1tKpf23', name: 'Professional', price: '$149/mo', desc: 'Up to 100 units + GPS + Finance', popular: true },
  { id: 'price_1TTGkpBEt8l7Ia34U0y8s9pX', name: 'Enterprise',   price: '$299/mo', desc: 'Unlimited units & properties' },
];

const STEPS = ['Plan', 'Property', 'Units', 'Tenants', 'Review'];

export default function PropFlowOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(PLANS[1].id);
  const [form, setForm] = useState({
    propertyName: '', email: '', phone: '', address: '', city: '', state: '', zip: '',
    managerName: '', buildings: '1', totalUnits: '',
    units: [{ number: '', type: 'A1', sqft: '', rent: '', status: 'Vacant' }],
    tenants: [{ firstName: '', lastName: '', email: '', phone: '', unit: '', leaseStart: '', leaseEnd: '', rent: '' }],
  });

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const selectedPlan = PLANS.find(p => p.id === plan)!;

  const addUnit   = () => setForm(f => ({ ...f, units:   [...f.units,   { number: '', type: 'A1', sqft: '', rent: '', status: 'Vacant' }] }));
  const addTenant = () => setForm(f => ({ ...f, tenants: [...f.tenants, { firstName: '', lastName: '', email: '', phone: '', unit: '', leaseStart: '', leaseEnd: '', rent: '' }] }));

  const updateUnit = (i: number, field: string, val: string) => {
    const u = [...form.units]; u[i] = { ...u[i], [field]: val }; setForm(f => ({ ...f, units: u }));
  };
  const updateTenant = (i: number, field: string, val: string) => {
    const t = [...form.tenants]; t[i] = { ...t[i], [field]: val }; setForm(f => ({ ...f, tenants: t }));
  };

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: plan, product: 'propflow', plan: selectedPlan.name,
        metadata: {
          price_id: plan, product: 'propflow', plan: selectedPlan.name,
          company_name: form.propertyName, email: form.email, phone: form.phone,
          address: `${form.address}, ${form.city}, ${form.state} ${form.zip}`,
          manager_name: form.managerName, buildings: form.buildings, total_units: form.totalUnits,
          units: JSON.stringify(form.units.slice(0, 5)),
          tenants: JSON.stringify(form.tenants.slice(0, 5)),
        },
        customerEmail: form.email,
        successUrl: `${window.location.origin}/propflow/dashboard?onboarded=true`,
        cancelUrl: window.location.href,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  const amber = '#F59E0B'; const bg = '#0A0800'; const panel = '#120F02';
  const card = '#0D0A00'; const border = '#2A2000'; const dim = '#6B5A30';
  const white = '#EEF6FB'; const D = "'Outfit',sans-serif"; const M = "'Geist Mono',monospace";
  const inp = { width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid ' + border, background: '#080600', color: white, fontSize: 13, fontFamily: D, outline: 'none', boxSizing: 'border-box' as const };
  const lbl = { display: 'block', fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1.5, marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: white }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏠</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: white }}>PropFlow<span style={{ color: amber }}>OS</span></span>
          <span style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 2, marginLeft: 8 }}>ONBOARDING</span>
        </div>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back to platform</button>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: i < step ? amber : i === step ? amber + '30' : panel, border: '1px solid ' + (i <= step ? amber : border), color: i < step ? '#000' : i === step ? amber : dim }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 11, color: i === step ? white : dim, fontWeight: i === step ? 700 : 400 }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: i < step ? amber : border, marginLeft: 4 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: panel, border: '1px solid ' + border, borderRadius: 16, padding: 28 }}>

          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Choose your PropFlowOS plan</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Manage your properties smarter. Cancel anytime.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {PLANS.map(p => (
                  <div key={p.id} onClick={() => setPlan(p.id)}
                    style={{ padding: '16px 20px', borderRadius: 12, border: '2px solid ' + (plan === p.id ? amber : border), background: plan === p.id ? amber + '10' : card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    {p.popular && <div style={{ position: 'absolute', top: -10, right: 16, background: amber, color: '#000', fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 12, fontFamily: M, letterSpacing: 1.5 }}>MOST POPULAR</div>}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: white }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{p.desc}</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: amber }}>{p.price}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} style={{ width: '100%', padding: 14, borderRadius: 10, background: amber, border: 'none', color: '#000', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: D }}>
                Continue with {selectedPlan.name} →
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Property Information</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Tell us about your property.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                {[
                  { label: 'PROPERTY NAME', field: 'propertyName', placeholder: 'Sunset Apartments' },
                  { label: 'MANAGER NAME', field: 'managerName', placeholder: 'Kenneth Covington' },
                  { label: 'EMAIL', field: 'email', placeholder: 'manager@property.com' },
                  { label: 'PHONE', field: 'phone', placeholder: '(405) 555-0100' },
                  { label: 'ADDRESS', field: 'address', placeholder: '1920 Heritage Park Dr' },
                  { label: 'CITY', field: 'city', placeholder: 'Oklahoma City' },
                  { label: 'STATE', field: 'state', placeholder: 'OK' },
                  { label: 'ZIP', field: 'zip', placeholder: '73120' },
                ].map(f => (
                  <div key={f.field}>
                    <label style={lbl}>{f.label}</label>
                    <input value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)} placeholder={f.placeholder} style={inp} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                <div>
                  <label style={lbl}>NUMBER OF BUILDINGS</label>
                  <input value={form.buildings} onChange={e => update('buildings', e.target.value)} placeholder="17" style={inp} />
                </div>
                <div>
                  <label style={lbl}>TOTAL UNITS</label>
                  <input value={form.totalUnits} onChange={e => update('totalUnits', e.target.value)} placeholder="96" style={inp} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(0)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(2)} style={{ flex: 2, padding: 13, borderRadius: 10, background: amber, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Unit Types</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Add your unit types — these will populate your unit directory.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {form.units.map((u, i) => (
                  <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: dim, fontFamily: M, marginBottom: 10 }}>UNIT {i + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 10 }}>
                      <div><label style={lbl}>UNIT #</label><input value={u.number} onChange={e => updateUnit(i, 'number', e.target.value)} placeholder="101" style={inp} /></div>
                      <div>
                        <label style={lbl}>TYPE</label>
                        <select value={u.type} onChange={e => updateUnit(i, 'type', e.target.value)} style={{ ...inp }}>
                          {['A1','A2','A3','A4','B2','B3','C1'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div><label style={lbl}>SQ FT</label><input value={u.sqft} onChange={e => updateUnit(i, 'sqft', e.target.value)} placeholder="504" style={inp} /></div>
                      <div><label style={lbl}>RENT/MO</label><input value={u.rent} onChange={e => updateUnit(i, 'rent', e.target.value)} placeholder="750" style={inp} /></div>
                      <div>
                        <label style={lbl}>STATUS</label>
                        <select value={u.status} onChange={e => updateUnit(i, 'status', e.target.value)} style={{ ...inp }}>
                          {['Vacant','Occupied','Maintenance','Reserved'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addUnit} style={{ width: '100%', padding: 10, borderRadius: 9, background: 'transparent', border: '1px dashed ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D, marginBottom: 20 }}>+ Add Another Unit</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ flex: 2, padding: 13, borderRadius: 10, background: amber, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Current Tenants</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Add your current tenants — they'll be pre-loaded with their lease info.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {form.tenants.map((t, i) => (
                  <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: dim, fontFamily: M, marginBottom: 10 }}>TENANT {i + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div><label style={lbl}>FIRST NAME</label><input value={t.firstName} onChange={e => updateTenant(i, 'firstName', e.target.value)} placeholder="Marcus" style={inp} /></div>
                      <div><label style={lbl}>LAST NAME</label><input value={t.lastName} onChange={e => updateTenant(i, 'lastName', e.target.value)} placeholder="Johnson" style={inp} /></div>
                      <div><label style={lbl}>EMAIL</label><input value={t.email} onChange={e => updateTenant(i, 'email', e.target.value)} placeholder="marcus@email.com" style={inp} /></div>
                      <div><label style={lbl}>PHONE</label><input value={t.phone} onChange={e => updateTenant(i, 'phone', e.target.value)} placeholder="(405) 555-0101" style={inp} /></div>
                      <div><label style={lbl}>UNIT</label><input value={t.unit} onChange={e => updateTenant(i, 'unit', e.target.value)} placeholder="101" style={inp} /></div>
                      <div><label style={lbl}>MONTHLY RENT</label><input value={t.rent} onChange={e => updateTenant(i, 'rent', e.target.value)} placeholder="750" style={inp} /></div>
                      <div><label style={lbl}>LEASE START</label><input type="date" value={t.leaseStart} onChange={e => updateTenant(i, 'leaseStart', e.target.value)} style={inp} /></div>
                      <div><label style={lbl}>LEASE END</label><input type="date" value={t.leaseEnd} onChange={e => updateTenant(i, 'leaseEnd', e.target.value)} style={inp} /></div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addTenant} style={{ width: '100%', padding: 10, borderRadius: 9, background: 'transparent', border: '1px dashed ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D, marginBottom: 20 }}>+ Add Another Tenant</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(4)} style={{ flex: 2, padding: 13, borderRadius: 10, background: amber, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Review & Pay →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Review & Subscribe</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Confirm your details before proceeding to payment.</p>
              <div style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 12 }}>SUBSCRIPTION</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: white }}>PropFlowOS — {selectedPlan.name}</div>
                    <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{selectedPlan.desc}</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: amber }}>{selectedPlan.price}</div>
                </div>
              </div>
              <div style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 12 }}>ACCOUNT DETAILS</div>
                {[
                  ['Property',   form.propertyName],
                  ['Manager',    form.managerName],
                  ['Email',      form.email],
                  ['Address',    `${form.address}, ${form.city}, ${form.state}`],
                  ['Buildings',  form.buildings],
                  ['Total Units',form.totalUnits],
                  ['Units added',form.units.filter(u => u.number).length + ' units'],
                  ['Tenants',    form.tenants.filter(t => t.firstName).length + ' tenants'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid ' + border }}>
                    <span style={{ fontSize: 12, color: dim }}>{label}</span>
                    <span style={{ fontSize: 12, color: white, fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={handleCheckout} disabled={loading} style={{ flex: 2, padding: 13, borderRadius: 10, background: amber, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Redirecting...' : 'Subscribe & Launch PropFlowOS →'}
                </button>
              </div>
              <p style={{ fontSize: 10, color: dim, textAlign: 'center', marginTop: 14 }}>Secure payment via Stripe · Cancel anytime · Data provisioned instantly</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}