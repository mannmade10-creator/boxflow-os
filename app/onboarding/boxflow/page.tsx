'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PLANS = [
  { id: 'price_1TT9nBBEt8l7Ia34s0l71kiA', name: 'Starter',      price: '$599/mo',   desc: '1 location · Up to 10 trucks' },
  { id: 'price_1TTA57BEt8l7Ia34R4de9tBH', name: 'Professional', price: '$1,899/mo', desc: 'Up to 3 locations · Up to 50 trucks', popular: true },
  { id: 'price_1TTAAOBEt8l7Ia341Dkt6FNr', name: 'Enterprise',   price: '$4,499/mo', desc: 'Unlimited locations & trucks' },
];

const STEPS = ['Plan', 'Company', 'Fleet', 'Customers', 'Review'];

export default function BoxFlowOnboarding() {
  const router = useRouter();
  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan]     = useState(PLANS[1].id);
  const [form, setForm]     = useState({
    companyName: '', email: '', phone: '', address: '', city: '', state: '', zip: '',
    contactName: '', locations: '1',
    drivers: [{ name: '', phone: '', truckId: '' }],
    customers: [{ name: '', address: '', contact: '', phone: '' }],
  });

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const selectedPlan = PLANS.find(p => p.id === plan)!;

  const addDriver   = () => setForm(f => ({ ...f, drivers:   [...f.drivers,   { name: '', phone: '', truckId: '' }] }));
  const addCustomer = () => setForm(f => ({ ...f, customers: [...f.customers, { name: '', address: '', contact: '', phone: '' }] }));

  const updateDriver = (i: number, field: string, val: string) => {
    const d = [...form.drivers]; d[i] = { ...d[i], [field]: val }; setForm(f => ({ ...f, drivers: d }));
  };
  const updateCustomer = (i: number, field: string, val: string) => {
    const c = [...form.customers]; c[i] = { ...c[i], [field]: val }; setForm(f => ({ ...f, customers: c }));
  };

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: plan,
        product: 'boxflow',
        plan: selectedPlan.name,
        metadata: {
          price_id: plan,
          product: 'boxflow',
          plan: selectedPlan.name,
          company_name: form.companyName,
          email: form.email,
          phone: form.phone,
          address: `${form.address}, ${form.city}, ${form.state} ${form.zip}`,
          contact_name: form.contactName,
          locations: form.locations,
          drivers: JSON.stringify(form.drivers),
          customers: JSON.stringify(form.customers.slice(0, 5)),
        },
        customerEmail: form.email,
        successUrl: `${window.location.origin}/dashboard?onboarded=true`,
        cancelUrl: window.location.href,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  const bg = '#020917'; const panel = '#0B1628'; const card = '#0D1E35';
  const border = '#152840'; const blue = '#2563EB'; const dim = '#4A6090';
  const white = '#EEF6FB'; const D = "'Outfit',sans-serif"; const M = "'Geist Mono',monospace";
  const inp = { width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid ' + border, background: '#060E1C', color: white, fontSize: 13, fontFamily: D, outline: 'none', boxSizing: 'border-box' as const };
  const lbl = { display: 'block', fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1.5, marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: white }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ height: 32 }} />
          <span style={{ fontWeight: 800, fontSize: 16, color: white }}>BoxFlow<span style={{ color: blue }}>OS</span></span>
          <span style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 2, marginLeft: 8 }}>ONBOARDING</span>
        </div>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back to platform</button>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: i < step ? blue : i === step ? blue + '30' : panel, border: '1px solid ' + (i <= step ? blue : border), color: i < step ? white : i === step ? blue : dim }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 11, color: i === step ? white : dim, fontWeight: i === step ? 700 : 400 }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: i < step ? blue : border, marginLeft: 4 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: panel, border: '1px solid ' + border, borderRadius: 16, padding: 28 }}>

          {/* STEP 0: Plan */}
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Choose your BoxFlow OS plan</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Replacing $7,200+/mo in legacy tools. Cancel anytime.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {PLANS.map(p => (
                  <div key={p.id} onClick={() => setPlan(p.id)}
                    style={{ padding: '16px 20px', borderRadius: 12, border: '2px solid ' + (plan === p.id ? blue : border), background: plan === p.id ? blue + '10' : card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    {p.popular && <div style={{ position: 'absolute', top: -10, right: 16, background: blue, color: white, fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 12, fontFamily: M, letterSpacing: 1.5 }}>MOST POPULAR</div>}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: white }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{p.desc}</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: blue }}>{p.price}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} style={{ width: '100%', padding: 14, borderRadius: 10, background: blue, border: 'none', color: white, fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: D }}>
                Continue with {selectedPlan.name} →
              </button>
            </div>
          )}

          {/* STEP 1: Company Info */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Company Information</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>This will be used to set up your BoxFlow OS account.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                {[
                  { label: 'COMPANY NAME', field: 'companyName', placeholder: 'Acme Box Co.' },
                  { label: 'CONTACT NAME', field: 'contactName', placeholder: 'John Smith' },
                  { label: 'WORK EMAIL',   field: 'email',       placeholder: 'john@acmebox.com' },
                  { label: 'PHONE',        field: 'phone',       placeholder: '(405) 555-0100' },
                  { label: 'ADDRESS',      field: 'address',     placeholder: '1234 Industrial Blvd' },
                  { label: 'CITY',         field: 'city',        placeholder: 'Oklahoma City' },
                  { label: 'STATE',        field: 'state',       placeholder: 'OK' },
                  { label: 'ZIP',          field: 'zip',         placeholder: '73120' },
                ].map(f => (
                  <div key={f.field}>
                    <label style={lbl}>{f.label}</label>
                    <input value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)} placeholder={f.placeholder} style={inp} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>NUMBER OF LOCATIONS</label>
                <select value={form.locations} onChange={e => update('locations', e.target.value)} style={{ ...inp }}>
                  {['1','2','3','4','5','6+'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(0)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(2)} style={{ flex: 2, padding: 13, borderRadius: 10, background: blue, border: 'none', color: white, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 2: Fleet */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Fleet & Drivers</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Add your drivers and trucks — they'll appear on the live fleet map immediately.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {form.drivers.map((d, i) => (
                  <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: dim, fontFamily: M, marginBottom: 10 }}>DRIVER {i + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={lbl}>DRIVER NAME</label>
                        <input value={d.name} onChange={e => updateDriver(i, 'name', e.target.value)} placeholder="John Smith" style={inp} />
                      </div>
                      <div>
                        <label style={lbl}>PHONE</label>
                        <input value={d.phone} onChange={e => updateDriver(i, 'phone', e.target.value)} placeholder="(405) 555-0100" style={inp} />
                      </div>
                      <div>
                        <label style={lbl}>TRUCK ID</label>
                        <input value={d.truckId} onChange={e => updateDriver(i, 'truckId', e.target.value)} placeholder="TRK-001" style={inp} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addDriver} style={{ width: '100%', padding: 10, borderRadius: 9, background: 'transparent', border: '1px dashed ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D, marginBottom: 20 }}>+ Add Another Driver</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ flex: 2, padding: 13, borderRadius: 10, background: blue, border: 'none', color: white, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Customers */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Your Customers</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Add your top customers — they'll be pre-loaded into the dispatch system.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {form.customers.map((c, i) => (
                  <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: dim, fontFamily: M, marginBottom: 10 }}>CUSTOMER {i + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={lbl}>COMPANY NAME</label>
                        <input value={c.name} onChange={e => updateCustomer(i, 'name', e.target.value)} placeholder="Customer Co." style={inp} />
                      </div>
                      <div>
                        <label style={lbl}>CONTACT NAME</label>
                        <input value={c.contact} onChange={e => updateCustomer(i, 'contact', e.target.value)} placeholder="Jane Doe" style={inp} />
                      </div>
                      <div>
                        <label style={lbl}>DELIVERY ADDRESS</label>
                        <input value={c.address} onChange={e => updateCustomer(i, 'address', e.target.value)} placeholder="456 Main St, OKC" style={inp} />
                      </div>
                      <div>
                        <label style={lbl}>PHONE</label>
                        <input value={c.phone} onChange={e => updateCustomer(i, 'phone', e.target.value)} placeholder="(405) 555-0200" style={inp} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addCustomer} style={{ width: '100%', padding: 10, borderRadius: 9, background: 'transparent', border: '1px dashed ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D, marginBottom: 20 }}>+ Add Another Customer</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(4)} style={{ flex: 2, padding: 13, borderRadius: 10, background: blue, border: 'none', color: white, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Review & Pay →</button>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Review & Subscribe</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Confirm your details before proceeding to payment.</p>
              <div style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 12 }}>SUBSCRIPTION</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: white }}>BoxFlow OS — {selectedPlan.name}</div>
                    <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{selectedPlan.desc}</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: blue }}>{selectedPlan.price}</div>
                </div>
              </div>
              <div style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 12 }}>ACCOUNT DETAILS</div>
                {[
                  ['Company',   form.companyName],
                  ['Contact',   form.contactName],
                  ['Email',     form.email],
                  ['Phone',     form.phone],
                  ['Address',   `${form.address}, ${form.city}, ${form.state} ${form.zip}`],
                  ['Locations', form.locations],
                  ['Drivers',   form.drivers.filter(d => d.name).length + ' added'],
                  ['Customers', form.customers.filter(c => c.name).length + ' added'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid ' + border }}>
                    <span style={{ fontSize: 12, color: dim }}>{label}</span>
                    <span style={{ fontSize: 12, color: white, fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={handleCheckout} disabled={loading} style={{ flex: 2, padding: 13, borderRadius: 10, background: blue, border: 'none', color: white, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Redirecting to payment...' : 'Subscribe & Launch BoxFlow OS →'}
                </button>
              </div>
              <p style={{ fontSize: 10, color: dim, textAlign: 'center', marginTop: 14 }}>Secure payment via Stripe · Cancel anytime · Your data is provisioned instantly after payment</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}