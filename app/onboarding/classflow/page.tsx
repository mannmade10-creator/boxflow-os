'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PLANS = [
  { id: 'price_1TTBiBBEt8l7Ia34DRe2ilHK', name: 'Starter',      price: '$39/mo',  desc: 'Up to 50 students · Basic AI' },
  { id: 'price_1TTBknBEt8l7Ia34hNJSSP0h', name: 'Professional', price: '$79/mo',  desc: 'Up to 500 students · Multi-language', popular: true },
  { id: 'price_1TTBnBBEt8l7Ia34fWXR2ClC', name: 'Enterprise',   price: '$149/mo', desc: 'Unlimited students · Custom branding' },
];

const STEPS = ['Plan', 'Organization', 'Instructors', 'Review'];

export default function ClassFlowOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(PLANS[1].id);
  const [form, setForm] = useState({
    orgName: '', email: '', phone: '', address: '', city: '', state: '',
    adminName: '', studentCount: '', gradeLevel: 'K-12', subjects: '',
    languages: ['English'],
    instructors: [{ name: '', email: '', subject: '', role: 'Teacher' }],
  });

  const update = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));
  const selectedPlan = PLANS.find(p => p.id === plan)!;
  const addInstructor = () => setForm(f => ({ ...f, instructors: [...f.instructors, { name: '', email: '', subject: '', role: 'Teacher' }] }));
  const updateInstructor = (i: number, field: string, val: string) => {
    const ins = [...form.instructors]; ins[i] = { ...ins[i], [field]: val }; setForm(f => ({ ...f, instructors: ins }));
  };

  async function handleCheckout() {
    setLoading(true);
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: plan, product: 'classflow', plan: selectedPlan.name,
        metadata: {
          price_id: plan, product: 'classflow', plan: selectedPlan.name,
          company_name: form.orgName, email: form.email, phone: form.phone,
          address: `${form.address}, ${form.city}, ${form.state}`,
          admin_name: form.adminName, student_count: form.studentCount,
          grade_level: form.gradeLevel, subjects: form.subjects,
          languages: form.languages.join(','),
          instructors: JSON.stringify(form.instructors),
        },
        customerEmail: form.email,
        successUrl: `${window.location.origin}/classflow/dashboard?onboarded=true`,
        cancelUrl: window.location.href,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  const purple = '#A78BFA'; const bg = '#06040F'; const panel = '#0D0B1A';
  const card = '#0A0814'; const border = '#1E1640'; const dim = '#4A3A70';
  const white = '#EEF6FB'; const D = "'Outfit',sans-serif"; const M = "'Geist Mono',monospace";
  const inp = { width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid ' + border, background: '#080614', color: white, fontSize: 13, fontFamily: D, outline: 'none', boxSizing: 'border-box' as const };
  const lbl = { display: 'block', fontSize: 10, color: dim, fontFamily: M, letterSpacing: 1.5, marginBottom: 6 };

  const LANGS = ['English', 'Spanish', 'French', 'Mandarin', 'Portuguese', 'Arabic', 'Hindi'];

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: D, color: white }}>
      <header style={{ background: panel, borderBottom: '1px solid ' + border, padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎓</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: white }}>ClassFlow<span style={{ color: purple }}>AI</span></span>
          <span style={{ fontSize: 10, color: dim, fontFamily: M, letterSpacing: 2, marginLeft: 8 }}>ONBOARDING</span>
        </div>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back to platform</button>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 32, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: i < step ? purple : i === step ? purple + '30' : panel, border: '1px solid ' + (i <= step ? purple : border), color: i < step ? '#000' : i === step ? purple : dim }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 11, color: i === step ? white : dim, fontWeight: i === step ? 700 : 400 }}>{s}</span>
              {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: i < step ? purple : border, marginLeft: 4 }} />}
            </div>
          ))}
        </div>

        <div style={{ background: panel, border: '1px solid ' + border, borderRadius: 16, padding: 28 }}>

          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Choose your ClassFlowAI plan</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>AI-powered learning for every classroom. Cancel anytime.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {PLANS.map(p => (
                  <div key={p.id} onClick={() => setPlan(p.id)}
                    style={{ padding: '16px 20px', borderRadius: 12, border: '2px solid ' + (plan === p.id ? purple : border), background: plan === p.id ? purple + '10' : card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    {p.popular && <div style={{ position: 'absolute', top: -10, right: 16, background: purple, color: '#000', fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 12, fontFamily: M, letterSpacing: 1.5 }}>MOST POPULAR</div>}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: white }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{p.desc}</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: purple }}>{p.price}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} style={{ width: '100%', padding: 14, borderRadius: 10, background: purple, border: 'none', color: '#000', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: D }}>
                Continue with {selectedPlan.name} →
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Organization Information</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Tell us about your school or organization.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                {[
                  { label: 'SCHOOL / ORG NAME', field: 'orgName', placeholder: 'Lincoln Elementary School' },
                  { label: 'ADMIN NAME', field: 'adminName', placeholder: 'Principal Johnson' },
                  { label: 'EMAIL', field: 'email', placeholder: 'admin@school.edu' },
                  { label: 'PHONE', field: 'phone', placeholder: '(405) 555-0100' },
                  { label: 'ADDRESS', field: 'address', placeholder: '123 School St' },
                  { label: 'CITY', field: 'city', placeholder: 'Oklahoma City' },
                  { label: 'STATE', field: 'state', placeholder: 'OK' },
                  { label: 'TOTAL STUDENTS', field: 'studentCount', placeholder: '250' },
                ].map(f => (
                  <div key={f.field}>
                    <label style={lbl}>{f.label}</label>
                    <input value={(form as any)[f.field]} onChange={e => update(f.field, e.target.value)} placeholder={f.placeholder} style={inp} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={lbl}>GRADE LEVEL</label>
                  <select value={form.gradeLevel} onChange={e => update('gradeLevel', e.target.value)} style={{ ...inp }}>
                    {['K-5', 'K-8', 'K-12', '6-8', '9-12', 'Higher Education', 'Corporate Training'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>MAIN SUBJECTS</label>
                  <input value={form.subjects} onChange={e => update('subjects', e.target.value)} placeholder="Math, Science, English" style={inp} />
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>LANGUAGES NEEDED</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {LANGS.map(lang => (
                    <button key={lang} onClick={() => {
                      const langs = form.languages.includes(lang) ? form.languages.filter(l => l !== lang) : [...form.languages, lang];
                      update('languages', langs);
                    }} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid ' + (form.languages.includes(lang) ? purple : border), background: form.languages.includes(lang) ? purple + '20' : 'transparent', color: form.languages.includes(lang) ? purple : dim, fontSize: 12, cursor: 'pointer', fontFamily: D }}>
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(0)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(2)} style={{ flex: 2, padding: 13, borderRadius: 10, background: purple, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Instructors</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Add your teachers — they'll have immediate access to create AI lessons.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {form.instructors.map((ins, i) => (
                  <div key={i} style={{ background: card, border: '1px solid ' + border, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontSize: 11, color: dim, fontFamily: M, marginBottom: 10 }}>INSTRUCTOR {i + 1}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                      <div><label style={lbl}>NAME</label><input value={ins.name} onChange={e => updateInstructor(i, 'name', e.target.value)} placeholder="Ms. Smith" style={inp} /></div>
                      <div><label style={lbl}>EMAIL</label><input value={ins.email} onChange={e => updateInstructor(i, 'email', e.target.value)} placeholder="smith@school.edu" style={inp} /></div>
                      <div><label style={lbl}>SUBJECT</label><input value={ins.subject} onChange={e => updateInstructor(i, 'subject', e.target.value)} placeholder="Math" style={inp} /></div>
                      <div>
                        <label style={lbl}>ROLE</label>
                        <select value={ins.role} onChange={e => updateInstructor(i, 'role', e.target.value)} style={{ ...inp }}>
                          {['Teacher','Admin','Curriculum Designer','Tutor'].map(r => <option key={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addInstructor} style={{ width: '100%', padding: 10, borderRadius: 9, background: 'transparent', border: '1px dashed ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D, marginBottom: 20 }}>+ Add Another Instructor</button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ flex: 2, padding: 13, borderRadius: 10, background: purple, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D }}>Review & Pay →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px' }}>Review & Subscribe</h2>
              <p style={{ fontSize: 13, color: dim, marginBottom: 24 }}>Confirm your details before proceeding to payment.</p>
              <div style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 12 }}>SUBSCRIPTION</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: white }}>ClassFlowAI — {selectedPlan.name}</div>
                    <div style={{ fontSize: 12, color: dim, marginTop: 2 }}>{selectedPlan.desc}</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: purple }}>{selectedPlan.price}</div>
                </div>
              </div>
              <div style={{ background: card, border: '1px solid ' + border, borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: dim, fontFamily: M, letterSpacing: 1, marginBottom: 12 }}>ACCOUNT DETAILS</div>
                {[
                  ['Organization', form.orgName],
                  ['Admin',        form.adminName],
                  ['Email',        form.email],
                  ['Grade Level',  form.gradeLevel],
                  ['Students',     form.studentCount],
                  ['Languages',    form.languages.join(', ')],
                  ['Instructors',  form.instructors.filter(i => i.name).length + ' added'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid ' + border }}>
                    <span style={{ fontSize: 12, color: dim }}>{label}</span>
                    <span style={{ fontSize: 12, color: white, fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: 13, borderRadius: 10, background: 'transparent', border: '1px solid ' + border, color: dim, fontSize: 13, cursor: 'pointer', fontFamily: D }}>← Back</button>
                <button onClick={handleCheckout} disabled={loading} style={{ flex: 2, padding: 13, borderRadius: 10, background: purple, border: 'none', color: '#000', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: D, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Redirecting...' : 'Subscribe & Launch ClassFlowAI →'}
                </button>
              </div>
              <p style={{ fontSize: 10, color: dim, textAlign: 'center', marginTop: 14 }}>Secure payment via Stripe · Cancel anytime · AI lessons available immediately</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}