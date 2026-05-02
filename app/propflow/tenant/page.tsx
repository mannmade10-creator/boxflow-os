'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TenantPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [screen, setScreen] = useState('home')
  const [issue, setIssue] = useState('')
  const [urgency, setUrgency] = useState('Normal')
  const [submitted, setSubmitted] = useState(false)
  const [post, setPost] = useState('')
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/propflow-login'); return }
      setUser(user)
      const { data } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(10)
      setPosts(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleSignOut() {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/propflow-login')
  }

  async function submitMaintenance() {
    if (!issue) return
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.from('work_orders').insert({ description: issue, reported_by: user?.email, issue_type: 'Maintenance', priority: urgency, status: 'Pending' })
    setSubmitted(true)
    setIssue('')
  }

  async function submitPost() {
    if (!post) return
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.from('community_posts').insert({ author_name: user?.email, category: 'General', body: post, likes: 0 })
    setPost('')
    const { data } = await supabase.from('community_posts').select('*').order('created_at', { ascending: false }).limit(10)
    setPosts(data || [])
  }

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-97.5572,35.5938,16,0/900x540?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`

  const staffPositions = [
    { name: 'Marcus Reed', role: 'Maintenance', color: '#4f8ef7', top: '45%', left: '52%' },
    { name: 'James Carter', role: 'Maintenance', color: '#4f8ef7', top: '62%', left: '38%' },
    { name: 'Lisa Adams', role: 'Make-Ready', color: '#22c55e', top: '32%', left: '61%' },
    { name: 'D. Harris', role: 'Security', color: '#ef4444', top: '50%', left: '28%' },
  ]

  const nav = [
    { id: 'home', label: 'ðŸ  Home' },
    { id: 'maintenance', label: 'ðŸ”§ Maintenance' },
    { id: 'gps', label: 'ðŸ“ Property Map' },
    { id: 'community', label: 'ðŸ’¬ Community' },
    { id: 'contact', label: 'ðŸ“ž Contact' },
  ]

  const card: React.CSSProperties = { background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 18, padding: 26, marginBottom: 18 }
  const input: React.CSSProperties = { width: '100%', padding: '15px 17px', borderRadius: 12, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(7,15,31,0.8)', color: '#e2e8f0', fontSize: 16, outline: 'none', boxSizing: 'border-box' }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f8ef7', fontSize: 20, fontFamily: 'Inter, Arial, sans-serif' }}>
      Loading your portal...
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#050d1a', color: '#e2e8f0', fontFamily: 'Inter, Arial, sans-serif' }}>
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.15)', padding: '0 24px', height: 66, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: '#4f8ef7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff' }}>P</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#4f8ef7' }}>PropFlow OS</div>
            <div style={{ fontSize: 13, color: '#475569' }}>Tenant Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: '#475569' }}>{user?.email}</span>
          <button onClick={handleSignOut} style={{ padding: '9px 18px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>Sign Out</button>
        </div>
      </header>

      <div style={{ background: '#070f1f', borderBottom: '1px solid rgba(99,132,255,0.1)', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' as const }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setScreen(n.id)}
            style={{ padding: '16px 22px', fontSize: 15, fontWeight: 700, cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: screen === n.id ? '2px solid #4f8ef7' : '2px solid transparent', color: screen === n.id ? '#4f8ef7' : '#475569', whiteSpace: 'nowrap' as const }}>
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: 26 }}>

        {screen === 'home' && (
          <div>
            <div style={{ ...card, borderColor: 'rgba(79,142,247,0.3)' }}>
              <div style={{ fontSize: 14, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 12 }}>Welcome Back</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Good day, Resident ðŸ‘‹</div>
              <div style={{ fontSize: 17, color: '#475569' }}>Penn Station Apartment Homes â€¢ 1920 Heritage Park Dr, OKC 73120</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
              {[
                { label: 'Rent Status', value: 'Current', color: '#22c55e', icon: 'ðŸ’°' },
                { label: 'Open Requests', value: '0', color: '#f59e0b', icon: 'ðŸ”§' },
                { label: 'Lease Status', value: 'Active', color: '#4f8ef7', icon: 'ðŸ“‹' },
                { label: 'Next Payment', value: 'May 1', color: '#a855f7', icon: 'ðŸ“…' },
              ].map(k => (
                <div key={k.label} style={{ ...card, marginBottom: 0, borderTop: `3px solid ${k.color}` }}>
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{k.icon}</div>
                  <div style={{ fontSize: 13, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 18 }}>My Information</div>
              {[
                ['Email', user?.email],
                ['Property', 'Penn Station Apartment Homes'],
                ['Address', '1920 Heritage Park Dr, OKC 73120'],
                ['Management', 'CAF Management'],
                ['Emergency', '405-755-9246'],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(99,132,255,0.07)', flexWrap: 'wrap' as const, gap: 8 }}>
                  <span style={{ fontSize: 16, color: '#475569' }}>{l}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' as const }}>
              <button onClick={() => setScreen('maintenance')} style={{ flex: 1, padding: '17px', borderRadius: 13, fontSize: 16, fontWeight: 700, cursor: 'pointer', background: '#4f8ef7', border: 'none', color: '#fff', minWidth: 160 }}>ðŸ”§ Submit Maintenance</button>
              <button onClick={() => setScreen('contact')} style={{ flex: 1, padding: '17px', borderRadius: 13, fontSize: 16, fontWeight: 700, cursor: 'pointer', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', minWidth: 160 }}>ðŸ“ž Contact Management</button>
            </div>
          </div>
        )}

        {screen === 'maintenance' && (
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Maintenance Request</h1>
            <p style={{ fontSize: 17, color: '#475569', marginBottom: 26 }}>Submit a request and our team will respond promptly.</p>
            {submitted ? (
              <div style={{ ...card, borderColor: 'rgba(34,197,94,0.3)', textAlign: 'center' as const }}>
                <div style={{ fontSize: 60, marginBottom: 18 }}>âœ…</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e', marginBottom: 10 }}>Request Submitted!</div>
                <div style={{ fontSize: 17, color: '#94a3b8', marginBottom: 22 }}>Our maintenance team has been notified and will respond within 24 hours.</div>
                <button onClick={() => setSubmitted(false)} style={{ padding: '15px 30px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', background: '#4f8ef7', border: 'none', color: '#fff' }}>Submit Another</button>
              </div>
            ) : (
              <div style={card}>
                <div style={{ marginBottom: 22 }}>
                  <label style={{ fontSize: 14, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 10 }}>Describe the Issue</label>
                  <textarea value={issue} onChange={e => setIssue(e.target.value)} placeholder="e.g. Kitchen faucet is dripping, bathroom light not working..." style={{ ...input, height: 130, resize: 'none' as const }} />
                </div>
                <div style={{ marginBottom: 26 }}>
                  <label style={{ fontSize: 14, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 10 }}>Urgency Level</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['Low', 'Normal', 'Urgent', 'Emergency'].map(u => (
                      <button key={u} onClick={() => setUrgency(u)}
                        style={{ flex: 1, padding: '13px 8px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', border: `1px solid ${urgency === u ? '#4f8ef7' : 'rgba(99,132,255,0.2)'}`, background: urgency === u ? 'rgba(79,142,247,0.15)' : 'transparent', color: urgency === u ? '#4f8ef7' : '#475569' }}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={submitMaintenance} disabled={!issue}
                  style={{ width: '100%', padding: '17px', borderRadius: 13, fontSize: 17, fontWeight: 800, cursor: issue ? 'pointer' : 'not-allowed', background: issue ? '#4f8ef7' : 'rgba(79,142,247,0.3)', border: 'none', color: '#fff' }}>
                  Submit Request â†’
                </button>
              </div>
            )}
          </div>
        )}

        {screen === 'gps' && (
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Property Map</h1>
            <p style={{ fontSize: 17, color: '#475569', marginBottom: 26 }}>Live staff locations on property.</p>
            <div style={{ border: '1px solid rgba(99,132,255,0.2)', borderRadius: 18, overflow: 'hidden', position: 'relative' as const, height: 440 }}>
              <img src={mapUrl} alt="Penn Station" style={{ width: '100%', height: '100%', objectFit: 'cover' as const, display: 'block' }} />
              <div style={{ position: 'absolute' as const, inset: 0, pointerEvents: 'none' as const }}>
                {staffPositions.map(s => (
                  <div key={s.name} style={{ position: 'absolute' as const, top: s.top, left: s.left, transform: 'translate(-50%,-50%)' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: s.color, border: '3px solid #020812', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'white', boxShadow: `0 0 0 3px ${s.color}55` }}>
                      {s.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div style={{ background: 'rgba(2,8,18,0.9)', padding: '2px 7px', borderRadius: 4, fontSize: 11, color: s.color, fontWeight: 700, whiteSpace: 'nowrap' as const, marginTop: 2 }}>{s.name.split(' ')[0]}</div>
                  </div>
                ))}
                <div style={{ position: 'absolute' as const, bottom: 12, left: 12, background: 'rgba(2,8,18,0.88)', padding: '10px 14px', borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1 }}>Staff on Property</div>
                  {staffPositions.map(s => (
                    <div key={s.name} style={{ fontSize: 13, color: s.color, fontWeight: 700, marginBottom: 2 }}>â— {s.name} â€” {s.role}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'community' && (
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Community Board</h1>
            <p style={{ fontSize: 17, color: '#475569', marginBottom: 26 }}>Share with your neighbors.</p>
            <div style={card}>
              <textarea value={post} onChange={e => setPost(e.target.value)} placeholder="Share something with your neighbors..." style={{ ...input, height: 110, resize: 'none' as const }} />
              <button onClick={submitPost} disabled={!post}
                style={{ marginTop: 14, width: '100%', padding: '15px', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: post ? 'pointer' : 'not-allowed', background: post ? '#4f8ef7' : 'rgba(79,142,247,0.3)', border: 'none', color: '#fff' }}>
                Post to Community
              </button>
            </div>
            {posts.map((p, i) => (
              <div key={i} style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(79,142,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#4f8ef7' }}>
                    {(p.author_name || 'R')[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{p.author_name || 'Resident'}</div>
                    <div style={{ fontSize: 13, color: '#475569' }}>{new Date(p.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7 }}>{p.body}</div>
              </div>
            ))}
            {posts.length === 0 && <div style={{ textAlign: 'center' as const, color: '#475569', fontSize: 16, padding: 48 }}>No posts yet â€” be the first!</div>}
          </div>
        )}

        {screen === 'contact' && (
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Contact Management</h1>
            <p style={{ fontSize: 17, color: '#475569', marginBottom: 26 }}>Reach out to the property management team.</p>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                { title: 'Leasing Office', detail: '405-755-9246', sub: 'Mondayâ€“Friday 9AMâ€“5PM', icon: 'ðŸ“ž', color: '#4f8ef7' },
                { title: 'Emergency Maintenance', detail: '405-755-9246', sub: '24/7 for urgent issues', icon: 'ðŸš¨', color: '#ef4444' },
                { title: 'Email Management', detail: 'info@pennstationapartmenthomes.com', sub: 'Response within 24 hours', icon: 'ðŸ“§', color: '#22c55e' },
                { title: 'Property Website', detail: 'pennstationapartmenthomes.com', sub: 'Online resources and info', icon: 'ðŸŒ', color: '#a855f7' },
                { title: 'CAF Management', detail: 'Professional Property Management', sub: 'People Matter. Performance Counts.', icon: 'ðŸ¢', color: '#f59e0b' },
              ].map(c => (
                <div key={c.title} style={{ ...card, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 18, borderLeft: `4px solid ${c.color}` }}>
                  <div style={{ fontSize: 34, flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 5 }}>{c.title}</div>
                    <div style={{ fontSize: 16, color: c.color, fontWeight: 700, marginBottom: 3 }}>{c.detail}</div>
                    <div style={{ fontSize: 14, color: '#475569' }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
