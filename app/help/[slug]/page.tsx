'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const hdrs = { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' }

type Article = {
  id: string; platform: string; category: string; title: string;
  content: string; slug: string; views: number; helpful_yes: number; helpful_no: number;
  created_at: string; updated_at: string;
}

type RelatedArticle = { id: string; title: string; slug: string; platform: string }

function platformColor(p: string) {
  if (p === 'boxflow')   return '#2563EB'
  if (p === 'medflow')   return '#14D2C2'
  if (p === 'propflow')  return '#a855f7'
  if (p === 'classflow') return '#f59e0b'
  return '#64748b'
}

export default function ArticlePage() {
  const params = useParams()
  const slug   = params?.slug as string

  const [article,  setArticle]  = useState<Article | null>(null)
  const [related,  setRelated]  = useState<RelatedArticle[]>([])
  const [loading,  setLoading]  = useState(true)
  const [voted,    setVoted]    = useState<'yes'|'no'|null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    async function load() {
      const res  = await fetch(`${supabaseUrl}/rest/v1/kb_articles?slug=eq.${slug}&published=eq.true&select=*`, { headers: hdrs })
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) { setNotFound(true); setLoading(false); return }
      const art = data[0]
      setArticle(art)

      // Increment views
      await fetch(`${supabaseUrl}/rest/v1/kb_articles?id=eq.${art.id}`, {
        method: 'PATCH', headers: { ...hdrs, 'Prefer': 'return=minimal' },
        body: JSON.stringify({ views: (art.views || 0) + 1 }),
      })

      // Load related articles (same platform or category)
      const rel = await fetch(`${supabaseUrl}/rest/v1/kb_articles?published=eq.true&slug=neq.${slug}&platform=eq.${art.platform}&select=id,title,slug,platform&limit=4`, { headers: hdrs })
      const relData = await rel.json()
      if (Array.isArray(relData)) setRelated(relData)
      setLoading(false)
    }
    load()
  }, [slug])

  async function vote(type: 'yes'|'no') {
    if (voted || !article) return
    setVoted(type)
    const field = type === 'yes' ? 'helpful_yes' : 'helpful_no'
    await fetch(`${supabaseUrl}/rest/v1/kb_articles?id=eq.${article.id}`, {
      method: 'PATCH', headers: { ...hdrs, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ [field]: (article[field] || 0) + 1 }),
    })
  }

  // Format article content into paragraphs with numbered steps
  function renderContent(content: string) {
    const parts = content.split('\n').filter(Boolean)
    return parts.map((part, i) => {
      if (/^\d+\./.test(part)) {
        return (
          <div key={i} style={{ display:'flex', gap:14, marginBottom:12, alignItems:'flex-start' }}>
            <div style={{ width:26, height:26, borderRadius:'50%', background:'rgba(20,210,194,0.15)', border:'1px solid rgba(20,210,194,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#14D2C2', flexShrink:0, marginTop:1 }}>
              {part.match(/^(\d+)/)?.[1]}
            </div>
            <p style={{ color:'#94a3b8', fontSize:15, lineHeight:1.8, margin:0 }}>{part.replace(/^\d+\.\s*/, '')}</p>
          </div>
        )
      }
      return <p key={i} style={{ color:'#94a3b8', fontSize:15, lineHeight:1.8, marginBottom:16 }}>{part}</p>
    })
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#020818', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'#475569', fontSize:13, fontFamily:'system-ui' }}>Loading article...</div>
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight:'100vh', background:'#020818', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, fontFamily:'system-ui' }}>
      <div style={{ fontSize:48, fontWeight:900, color:'#334155' }}>404</div>
      <div style={{ fontSize:18, color:'#475569' }}>Article not found</div>
      <Link href="/help" style={{ color:'#14D2C2', textDecoration:'none', fontSize:14 }}>← Back to Help Center</Link>
    </div>
  )

  if (!article) return null
  const pColor = platformColor(article.platform)

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#020818 0%,#070f24 100%)', color:'#f0f6ff', fontFamily:'system-ui,sans-serif' }}>

      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 48px', borderBottom:'1px solid rgba(20,210,194,0.08)', position:'sticky', top:0, background:'rgba(2,8,24,0.95)', backdropFilter:'blur(12px)', zIndex:100, flexWrap:'wrap', gap:12 }}>
        <Link href="/help" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(135deg,#0A6E68,#14D2C2)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:18, color:'#fff' }}>M</div>
          <div>
            <div style={{ fontSize:15, fontWeight:900, color:'#fff' }}>Made Technologies</div>
            <div style={{ fontSize:8, color:'#14D2C2', letterSpacing:2, textTransform:'uppercase' }}>Help Center</div>
          </div>
        </Link>
        <div style={{ display:'flex', gap:16, alignItems:'center' }}>
          <Link href="/help"    style={{ color:'#64748b', fontSize:13, textDecoration:'none' }}>← All Articles</Link>
          <Link href="/support" style={{ color:'#64748b', fontSize:13, textDecoration:'none' }}>Get Support</Link>
        </div>
      </nav>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'48px 24px 80px' }}>

        {/* BREADCRUMB */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:28, fontSize:12, color:'#475569', flexWrap:'wrap' }}>
          <Link href="/help" style={{ color:'#475569', textDecoration:'none' }}>Help Center</Link>
          <span>›</span>
          <span style={{ color:pColor }}>{article.platform}</span>
          <span>›</span>
          <span>{article.category}</span>
        </div>

        {/* ARTICLE HEADER */}
        <div style={{ marginBottom:36 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <span style={{ fontSize:11, fontWeight:700, color:pColor, background:`${pColor}14`, border:`1px solid ${pColor}28`, borderRadius:8, padding:'3px 12px', textTransform:'uppercase', letterSpacing:0.5 }}>
              {article.platform}
            </span>
            <span style={{ fontSize:11, color:'#475569' }}>{article.category}</span>
          </div>
          <h1 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:900, lineHeight:1.2, marginBottom:16, letterSpacing:-0.5 }}>{article.title}</h1>
          <div style={{ display:'flex', gap:20, fontSize:12, color:'#334155' }}>
            <span>{article.views} views</span>
            <span>Updated {new Date(article.updated_at).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}</span>
          </div>
        </div>

        {/* ARTICLE CONTENT */}
        <div style={{ background:'rgba(12,26,56,0.6)', border:`1px solid ${pColor}14`, borderRadius:18, padding:'32px 36px', marginBottom:32 }}>
          {renderContent(article.content)}
        </div>

        {/* HELPFUL VOTE */}
        <div style={{ background:'rgba(12,26,56,0.8)', border:'1px solid rgba(20,210,194,0.12)', borderRadius:16, padding:'24px 28px', marginBottom:32, textAlign:'center' }}>
          {voted ? (
            <div>
              <div style={{ fontSize:18, fontWeight:800, color:'#14D2C2', marginBottom:6 }}>Thank you for your feedback!</div>
              <div style={{ fontSize:13, color:'#475569' }}>Your feedback helps us improve our documentation.</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'#f0f6ff', marginBottom:16 }}>Was this article helpful?</div>
              <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
                <button onClick={() => vote('yes')}
                  style={{ padding:'10px 28px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:10, color:'#22c55e', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'system-ui' }}>
                  Yes, it helped
                </button>
                <button onClick={() => vote('no')}
                  style={{ padding:'10px 28px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, color:'#ef4444', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'system-ui' }}>
                  Not quite
                </button>
              </div>
            </div>
          )}
        </div>

        {/* STILL NEED HELP */}
        <div style={{ background:'rgba(12,26,56,0.8)', border:'1px solid rgba(20,210,194,0.1)', borderRadius:16, padding:'24px 28px', marginBottom:40 }}>
          <h3 style={{ fontSize:16, fontWeight:800, marginBottom:10 }}>Still need help?</h3>
          <p style={{ color:'#64748b', fontSize:13, lineHeight:1.7, marginBottom:18 }}>Our support team responds personally within 24 hours. Critical issues get a 4-hour response.</p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <Link href="/support" style={{ padding:'10px 22px', background:'linear-gradient(135deg,#0A6E68,#14D2C2)', borderRadius:10, color:'#fff', textDecoration:'none', fontWeight:700, fontSize:13 }}>Submit a Ticket</Link>
            <a href="mailto:kenneth.covington@boxflowos.com" style={{ padding:'10px 22px', background:'rgba(20,210,194,0.08)', border:'1px solid rgba(20,210,194,0.2)', borderRadius:10, color:'#14D2C2', textDecoration:'none', fontWeight:700, fontSize:13 }}>
              Email Support
            </a>
          </div>
        </div>

        {/* RELATED ARTICLES */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontSize:14, fontWeight:800, color:'#475569', textTransform:'uppercase', letterSpacing:2, marginBottom:14 }}>Related Articles</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {related.map(r => (
                <Link key={r.id} href={`/help/${r.slug}`}
                  style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(12,26,56,0.6)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'14px 18px', textDecoration:'none', transition:'all 0.15s' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:platformColor(r.platform), flexShrink:0 }} />
                  <span style={{ fontSize:14, color:'#94a3b8', flex:1 }}>{r.title}</span>
                  <span style={{ color:'#334155', fontSize:16, flexShrink:0 }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'24px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div style={{ fontSize:12, color:'#334155' }}>© 2026 Made Technologies Inc · Help Center</div>
        <div style={{ display:'flex', gap:20 }}>
          {[['All Articles','/help'],['Support','/support'],['Contact','/contact']].map(([l,h]) => (
            <Link key={h} href={h} style={{ color:'#334155', fontSize:12, textDecoration:'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}