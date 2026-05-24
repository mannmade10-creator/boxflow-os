'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const G = '#c9a84c'

const TRADES = [
  'Barber','Nail Tech','Braider','Massage Therapist','Salon Stylist',
  'Plumber','Electrician','HVAC Tech','Cleaning Pro','Contractor',
  'Lawn & Landscape','Pet Groomer','Other'
]

const SOCIAL_FIELDS = [
  { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle', icon: '📸', color: '#e1306c' },
  { key: 'tiktok_url',   label: 'TikTok',    placeholder: 'https://tiktok.com/@yourhandle',   icon: '🎵', color: '#010101' },
  { key: 'facebook_url', label: 'Facebook',  placeholder: 'https://facebook.com/yourpage',    icon: '👥', color: '#1877f2' },
  { key: 'twitter_url',  label: 'X (Twitter)',placeholder:'https://x.com/yourhandle',         icon: '𝕏',  color: '#000' },
  { key: 'youtube_url',  label: 'YouTube',   placeholder: 'https://youtube.com/@yourchannel', icon: '▶️', color: '#ff0000' },
  { key: 'snapchat_url', label: 'Snapchat',  placeholder: 'https://snapchat.com/add/yourname',icon: '👻', color: '#fffc00' },
  { key: 'website_url',  label: 'Website',   placeholder: 'https://yourwebsite.com',          icon: '🌐', color: '#63d2b2' },
]

const PAYMENT_FIELDS = [
  { key: 'cashapp_tag',    label: 'Cash App',  placeholder: '$YourCashTag',       icon: '💚', color: '#00d64f' },
  { key: 'venmo_handle',   label: 'Venmo',     placeholder: '@your-venmo',        icon: '💙', color: '#3d95ce' },
  { key: 'paypal_email',   label: 'PayPal',    placeholder: 'you@email.com',      icon: '💛', color: '#ffc439' },
]

export default function TradesyncProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState<any>({})
  const [activeTab, setActiveTab] = useState<'info'|'social'|'payments'|'preview'>('info')
  const [services, setServices] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    // Load demo profile — in production this uses auth.uid()
    const url = `${SB_URL}/rest/v1/ts_profiles?username=eq.mannbarber&select=*&limit=1`
    fetch(url, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } })
      .then(r => r.json())
      .then(data => {
        const p = Array.isArray(data) && data.length > 0 ? data[0] : null
        setProfile(p)
        setForm(p ?? {})
        setLoading(false)
      })

    // Load payment history
    fetch(`${SB_URL}/rest/v1/ts_payment_history?select=*&order=created_at.desc&limit=20`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    }).then(r => r.json()).then(d => setPayments(Array.isArray(d) ? d : []))
  }, [])

  function update(key: string, val: string) {
    setForm((f: any) => ({ ...f, [key]: val }))
  }

  async function saveProfile() {
    if (!profile?.id) return
    setSaving(true)
    await fetch(`${SB_URL}/rest/v1/ts_profiles?id=eq.${profile.id}`, {
      method: 'PATCH',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify(form)
    })
    setProfile(form)
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const inp = (key: string, placeholder = '') => ({
    value: form[key] ?? '',
    onChange: (e: any) => update(key, e.target.value),
    placeholder,
    disabled: !editing,
    style: {
      width: '100%', padding: '11px 14px',
      background: editing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${editing ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 10, fontSize: 14, color: '#fff', outline: 'none',
      fontFamily: 'system-ui', boxSizing: 'border-box' as const,
      opacity: editing ? 1 : 0.7
    }
  })

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: G, fontFamily: 'system-ui' }}>
      Loading profile...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0f6ff', fontFamily: 'system-ui,sans-serif' }}>
      <style>{`.tab-btn{transition:all 0.15s;cursor:pointer;border:none;font-family:system-ui}`}</style>

      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: '1px solid rgba(201,168,76,0.12)', background: 'rgba(10,10,10,0.97)', position: 'sticky', top: 0, zIndex: 50, flexWrap: 'wrap', gap: 12 }}>
        <Link href="/tradesync" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#8b6914,#c9a84c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#0a0a0a', fontFamily: 'Georgia,serif' }}>TS</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: 'Georgia,serif' }}>TradeSync</div>
            <div style={{ fontSize: 8, color: G, letterSpacing: 2, textTransform: 'uppercase' }}>My Profile</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: 10 }}>
          {saved && <span style={{ padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 9, color: '#22c55e', fontSize: 13, fontWeight: 700 }}>✓ Saved</span>}
          {editing ? (
            <>
              <button onClick={() => { setEditing(false); setForm(profile) }} className="tab-btn"
                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, color: '#64748b', fontSize: 13, fontWeight: 700 }}>
                Cancel
              </button>
              <button onClick={saveProfile} disabled={saving} className="tab-btn"
                style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#8b6914,#c9a84c)', border: 'none', borderRadius: 9, color: '#0a0a0a', fontSize: 13, fontWeight: 900, fontFamily: 'Georgia,serif', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="tab-btn"
              style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#8b6914,#c9a84c)', border: 'none', borderRadius: 9, color: '#0a0a0a', fontSize: 13, fontWeight: 900, fontFamily: 'Georgia,serif' }}>
              Edit Profile
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px' }}>

        {/* PROFILE HERO */}
        <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(10,10,10,0))', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 20, padding: '28px 28px', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#8b6914,#c9a84c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900, color: '#0a0a0a', flexShrink: 0, fontFamily: 'Georgia,serif' }}>
            {(profile?.full_name ?? 'T')[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, fontFamily: 'Georgia,serif' }}>{profile?.full_name ?? 'Your Name'}</h1>
              {profile?.is_available && <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '2px 10px', letterSpacing: 1 }}>● AVAILABLE</span>}
            </div>
            <div style={{ fontSize: 13, color: G, fontWeight: 600, marginBottom: 6 }}>{profile?.trade ?? profile?.trade_category ?? 'Trade Professional'} {profile?.business_name ? `· ${profile.business_name}` : ''}</div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>{profile?.city ? `${profile.city}, ${profile.state}` : 'Oklahoma City, OK'}</div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: 0, maxWidth: 500 }}>{profile?.bio ?? 'Add a bio to tell clients about yourself and your services.'}</p>
            {/* Social links display */}
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              {SOCIAL_FIELDS.filter(s => profile?.[s.key]).map(s => (
                <a key={s.key} href={profile[s.key]} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}30`, borderRadius: 7, padding: '4px 12px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>{s.icon}</span> {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4, border: '1px solid rgba(201,168,76,0.1)', flexWrap: 'wrap' }}>
          {[
            { id: 'info',     label: '👤 My Info' },
            { id: 'social',   label: '📱 Social Media' },
            { id: 'payments', label: '💳 Payment Methods' },
            { id: 'preview',  label: '👁 Public Preview' },
          ].map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id as any)}
              style={{ padding: '9px 18px', borderRadius: 9, background: activeTab === t.id ? 'linear-gradient(135deg,#8b6914,#c9a84c)' : 'transparent', color: activeTab === t.id ? '#0a0a0a' : '#64748b', fontWeight: 700, fontSize: 13 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* MY INFO TAB */}
        {activeTab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 14, padding: 22 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: G, marginBottom: 18, fontFamily: 'Georgia,serif', textTransform: 'uppercase', letterSpacing: 1 }}>Basic Info</h3>
              {[
                { key: 'full_name', label: 'Full Name', placeholder: 'Your Full Name' },
                { key: 'username',  label: 'Username',  placeholder: 'yourhandle' },
                { key: 'email',     label: 'Email',     placeholder: 'you@email.com' },
                { key: 'phone',     label: 'Phone',     placeholder: '(405) 000-0000' },
                { key: 'business_name', label: 'Business Name', placeholder: 'Your Business' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{f.label}</label>
                  <input type="text" {...inp(f.key, f.placeholder)} />
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 14, padding: 22 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: G, marginBottom: 18, fontFamily: 'Georgia,serif', textTransform: 'uppercase', letterSpacing: 1 }}>Trade & Location</h3>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Trade Category</label>
                <select value={form.trade ?? form.trade_category ?? ''} onChange={e => { update('trade', e.target.value); update('trade_category', e.target.value) }} disabled={!editing}
                  style={{ width: '100%', padding: '11px 14px', background: editing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${editing ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 10, fontSize: 14, color: form.trade ? '#fff' : '#64748b', outline: 'none', fontFamily: 'system-ui' }}>
                  <option value="">Select your trade...</option>
                  {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {[
                { key: 'address', label: 'Address',  placeholder: '4510 NW 16th St' },
                { key: 'city',    label: 'City',     placeholder: 'Oklahoma City' },
                { key: 'state',   label: 'State',    placeholder: 'OK' },
                { key: 'zip',     label: 'ZIP Code', placeholder: '73127' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>{f.label}</label>
                  <input type="text" {...inp(f.key, f.placeholder)} />
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, color: '#475569', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Bio</label>
                <textarea {...inp('bio', 'Tell clients about yourself and your services...')}
                  rows={4}
                  style={{ ...(inp('bio', '')).style, resize: 'vertical' as const, minHeight: 90 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label style={{ fontSize: 13, color: '#94a3b8' }}>Available for bookings</label>
                <button onClick={() => editing && update('is_available', (!form.is_available).toString())} className="tab-btn"
                  style={{ width: 44, height: 24, borderRadius: 12, background: form.is_available ? '#22c55e' : '#334155', border: 'none', position: 'relative', cursor: editing ? 'pointer' : 'default', transition: 'background 0.2s' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.is_available ? 23 : 3, transition: 'left 0.2s' }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SOCIAL MEDIA TAB */}
        {activeTab === 'social' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: G, marginBottom: 6, fontFamily: 'Georgia,serif', textTransform: 'uppercase', letterSpacing: 1 }}>Social Media & Links</h3>
            <p style={{ color: '#475569', fontSize: 13, marginBottom: 22 }}>Add your social media profiles. They will display on your public booking page so clients can follow you.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SOCIAL_FIELDS.map(s => (
                <div key={s.key}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ color: s.color, fontWeight: 700 }}>{s.label}</span>
                    {form[s.key] && <span style={{ fontSize: 10, color: '#22c55e', background: 'rgba(34,197,94,0.1)', borderRadius: 5, padding: '1px 8px', fontWeight: 700 }}>Connected</span>}
                  </label>
                  <input type="url" {...inp(s.key, s.placeholder)} />
                </div>
              ))}
            </div>
            {editing && (
              <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 10 }}>
                <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
                  Your social links appear on your public booking page. Clients can tap them to follow you on each platform.
                </p>
              </div>
            )}
          </div>
        )}

        {/* PAYMENT METHODS TAB */}
        {activeTab === 'payments' && (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: G, marginBottom: 6, fontFamily: 'Georgia,serif', textTransform: 'uppercase', letterSpacing: 1 }}>Payment Methods</h3>
              <p style={{ color: '#475569', fontSize: 13, marginBottom: 22 }}>Add your payment handles so clients can pay you directly. All payment methods show on your booking page.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {PAYMENT_FIELDS.map(p => (
                  <div key={p.key}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
                      <span style={{ fontSize: 18 }}>{p.icon}</span>
                      <span style={{ color: p.color, fontWeight: 700 }}>{p.label}</span>
                      {form[p.key] && <span style={{ fontSize: 10, color: '#22c55e', background: 'rgba(34,197,94,0.1)', borderRadius: 5, padding: '1px 8px', fontWeight: 700 }}>Connected</span>}
                    </label>
                    <input type="text" {...inp(p.key, p.placeholder)} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>🏦 Cash Load Also Accepted</div>
                <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>
                  Clients can also pay with cash via PayNearMe at 7-Eleven, Dollar General, CVS, and Walgreens. A $3.95 fee applies per load. Funds deposit directly to your business bank account.
                </p>
              </div>
            </div>

            {/* Payment History */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 14, padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: G, marginBottom: 18, fontFamily: 'Georgia,serif', textTransform: 'uppercase', letterSpacing: 1 }}>Payment History</h3>
              {payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32, color: '#334155', fontSize: 13 }}>No payment history yet.</div>
              ) : (
                payments.slice(0, 10).map((p: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < payments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f6ff', marginBottom: 2 }}>{p.description ?? p.type ?? 'Payment'}</div>
                      <div style={{ fontSize: 11, color: '#334155' }}>{p.payment_method} · {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e' }}>${Number(p.amount ?? 0).toFixed(2)}</div>
                      <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>{p.status ?? 'completed'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PUBLIC PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div style={{ maxWidth: 440, margin: '0 auto' }}>
            <p style={{ color: '#475569', fontSize: 13, marginBottom: 20, textAlign: 'center' }}>This is how clients see your profile on the booking map.</p>
            <div style={{ background: '#111', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, overflow: 'hidden' }}>
              {/* Profile header */}
              <div style={{ background: 'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(10,10,10,0))', padding: '28px 24px', textAlign: 'center', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#8b6914,#c9a84c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: '#0a0a0a', margin: '0 auto 14px', fontFamily: 'Georgia,serif' }}>
                  {(profile?.full_name ?? 'T')[0]}
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 4px', fontFamily: 'Georgia,serif' }}>{profile?.full_name ?? 'Your Name'}</h2>
                <div style={{ fontSize: 13, color: G, fontWeight: 600, marginBottom: 4 }}>{profile?.trade ?? profile?.trade_category ?? 'Trade Pro'}</div>
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 12 }}>{profile?.city ?? 'Oklahoma City'}, {profile?.state ?? 'OK'}</div>
                {profile?.is_available && <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '3px 12px' }}>● Available Now</span>}
              </div>
              {/* Bio */}
              {profile?.bio && (
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{profile.bio}</p>
                </div>
              )}
              {/* Payment methods */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Accepts Payment Via</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {profile?.cashapp_tag && <span style={{ fontSize: 11, color: '#00d64f', background: 'rgba(0,214,79,0.1)', border: '1px solid rgba(0,214,79,0.25)', borderRadius: 7, padding: '4px 10px', fontWeight: 600 }}>💚 {profile.cashapp_tag}</span>}
                  {profile?.venmo_handle && <span style={{ fontSize: 11, color: '#3d95ce', background: 'rgba(61,149,206,0.1)', border: '1px solid rgba(61,149,206,0.25)', borderRadius: 7, padding: '4px 10px', fontWeight: 600 }}>💙 {profile.venmo_handle}</span>}
                  {profile?.paypal_email && <span style={{ fontSize: 11, color: '#ffc439', background: 'rgba(255,196,57,0.1)', border: '1px solid rgba(255,196,57,0.25)', borderRadius: 7, padding: '4px 10px', fontWeight: 600 }}>💛 PayPal</span>}
                  <span style={{ fontSize: 11, color: '#c9a84c', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 7, padding: '4px 10px', fontWeight: 600 }}>💵 Cash Load</span>
                </div>
              </div>
              {/* Social links */}
              {SOCIAL_FIELDS.some(s => profile?.[s.key]) && (
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>Follow Me</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {SOCIAL_FIELDS.filter(s => profile?.[s.key]).map(s => (
                      <a key={s.key} href={profile[s.key]} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 18, textDecoration: 'none' }} title={s.label}>
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {/* Book button */}
              <div style={{ padding: 20 }}>
                <button className="tab-btn" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#8b6914,#c9a84c)', border: 'none', borderRadius: 12, color: '#0a0a0a', fontWeight: 900, fontSize: 15, fontFamily: 'Georgia,serif' }}>
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}