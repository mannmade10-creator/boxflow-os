'use client'
import { useEffect, useState } from 'react'

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [newPost, setNewPost] = useState('')
  const [newCat, setNewCat] = useState('General')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  function loadPosts() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    fetch(`${url}/rest/v1/community_posts?select=*&order=created_at.desc`, {
      headers: { 'apikey': key!, 'Authorization': `Bearer ${key}` }
    })
    .then(r => r.json())
    .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
    .catch(() => setLoading(false))
  }

  async function submitPost() {
    if (!newPost.trim()) return
    setPosting(true)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    await fetch(`${url}/rest/v1/community_posts`, {
      method: 'POST',
      headers: {
        'apikey': key!,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        author_name: 'Kenneth Covington',
        unit_number: 'Admin',
        category: newCat,
        body: newPost,
      })
    })
    setNewPost('')
    setPosting(false)
    loadPosts()
  }

  const categories = ['All','School Review','Safety','Neighbor Help','Community','General']
  const catColors: any = {
    'School Review':'#4f8ef7','Safety':'#ef4444',
    'Neighbor Help':'#22c55e','Community':'#a855f7','General':'#94a3b8'
  }
  const filtered = category === 'All' ? posts : posts.filter(p => p.category === category)

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#050d1a',color:'#4f8ef7',fontFamily:'Inter,Arial,sans-serif',fontSize:18}}>
      Loading community...
    </div>
  )

  return (
    <main style={{minHeight:'100vh',background:'#050d1a',color:'#e2e8f0',fontFamily:'Inter,Arial,sans-serif'}}>
      <header style={{background:'#070f1f',borderBottom:'1px solid rgba(99,132,255,0.15)',padding:'0 24px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap' as const,gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:34,height:34,borderRadius:8,background:'#4f8ef7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:800,color:'#fff'}}>P</div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:'#4f8ef7',letterSpacing:1}}>PropFlow OS</div>
            <div style={{fontSize:9,color:'#475569',letterSpacing:1}}>by M.A.D.E Technologies</div>
          </div>
        </div>
        <nav style={{display:'flex',gap:4,flexWrap:'wrap' as const}}>
          {['Dashboard','Units','Tenants','Maintenance','GPS','Finance','Community'].map(item => (
            <a key={item} href={`/${item === 'Dashboard' ? 'dashboard' : item.toLowerCase()}`}
              style={{padding:'6px 12px',fontSize:11,fontWeight:700,
                color:item==='Community'?'#4f8ef7':'#475569',borderRadius:7,textDecoration:'none',
                background:item==='Community'?'rgba(79,142,247,0.1)':'transparent'}}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <div style={{maxWidth:1000,margin:'0 auto',padding:24}}>
        <h1 style={{fontSize:24,fontWeight:800,color:'#fff',marginBottom:4}}>Community Board</h1>
        <p style={{fontSize:13,color:'#475569',marginBottom:20}}>Penn Station resident community</p>

        <div style={{background:'rgba(15,23,42,0.9)',border:'1px solid rgba(99,132,255,0.12)',borderRadius:14,padding:18,marginBottom:20}}>
          <div style={{fontSize:11,color:'#475569',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:1,marginBottom:10}}>Post to Community</div>
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Share something with residents..."
            style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1px solid rgba(99,132,255,0.2)',background:'rgba(7,15,31,0.8)',color:'#e2e8f0',fontSize:13,outline:'none',resize:'none' as const,minHeight:80,marginBottom:10,fontFamily:'Inter,Arial,sans-serif'}}
          />
          <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap' as const}}>
            <select value={newCat} onChange={e => setNewCat(e.target.value)}
              style={{padding:'7px 12px',borderRadius:8,border:'1px solid rgba(99,132,255,0.2)',background:'rgba(7,15,31,0.8)',color:'#e2e8f0',fontSize:12,outline:'none'}}>
              {['General','School Review','Safety','Neighbor Help','Community'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button onClick={submitPost} disabled={posting}
              style={{padding:'8px 18px',borderRadius:9,fontSize:12,fontWeight:700,cursor:'pointer',background:'#4f8ef7',border:'none',color:'#fff',opacity:posting?0.7:1}}>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap' as const}}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{padding:'6px 14px',borderRadius:8,fontSize:11,fontWeight:700,cursor:'pointer',
                background:category===c?'rgba(79,142,247,0.15)':'rgba(15,23,42,0.9)',
                border:category===c?'1px solid rgba(79,142,247,0.4)':'1px solid rgba(99,132,255,0.15)',
                color:category===c?'#4f8ef7':'#475569'}}>
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{padding:30,textAlign:'center' as const,color:'#475569',fontSize:13,background:'rgba(15,23,42,0.9)',borderRadius:14}}>
            No posts yet â€” be the first to post!
          </div>
        ) : filtered.map(p => (
          <div key={p.id} style={{background:'rgba(15,23,42,0.9)',border:'1px solid rgba(99,132,255,0.1)',borderRadius:14,padding:16,marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:'rgba(79,142,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#4f8ef7',flexShrink:0}}>
                {p.author_name?.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>{p.author_name} <span style={{fontSize:10,color:'#475569',fontWeight:400}}>Unit {p.unit_number}</span></div>
                <div style={{fontSize:10,color:'#475569'}}>{new Date(p.created_at).toLocaleDateString()}</div>
              </div>
              <span style={{padding:'2px 8px',borderRadius:4,fontSize:10,fontWeight:700,
                background:`${catColors[p.category]||'#94a3b8'}22`,
                color:catColors[p.category]||'#94a3b8'}}>
                {p.category}
              </span>
              {p.star_rating && (
                <span style={{color:'#f59e0b',fontSize:12}}>{'â˜…'.repeat(p.star_rating)}</span>
              )}
            </div>
            <div style={{fontSize:13,color:'#94a3b8',lineHeight:1.6}}>{p.body}</div>
            <div style={{display:'flex',gap:10,marginTop:10}}>
              <button style={{padding:'4px 12px',borderRadius:7,fontSize:11,fontWeight:700,cursor:'pointer',background:'rgba(79,142,247,0.1)',border:'1px solid rgba(79,142,247,0.2)',color:'#4f8ef7'}}>
                ðŸ‘ {p.likes || 0}
              </button>
              <button style={{padding:'4px 12px',borderRadius:7,fontSize:11,fontWeight:700,cursor:'pointer',background:'rgba(99,132,255,0.08)',border:'1px solid rgba(99,132,255,0.15)',color:'#64748b'}}>
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
