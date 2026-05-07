import Link from 'next/link'
import { getPostBySlug, getAllPosts } from '@/lib/blog-posts'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return { title: post.metaTitle, description: post.metaDescription }
}

function renderContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let tableBuffer: string[] = []
  let inTable = false

  const flushTable = (key: string) => {
    if (tableBuffer.length < 2) { tableBuffer = []; inTable = false; return }
    const rows = tableBuffer.filter(r => r.trim() && !r.match(/^\|[-|\s]+\|$/))
    elements.push(
      <div key={key} style={{ overflowX: 'auto', margin: '24px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <tbody>
            {rows.map((row, ri) => {
              const cells = row.split('|').filter((_, i, a) => i > 0 && i < a.length - 1)
              return (
                <tr key={ri} style={{ background: ri === 0 ? 'rgba(14,165,233,0.12)' : ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                  {cells.map((cell, ci) => (
                    <td key={ci} style={{ padding: '10px 14px', border: '1px solid rgba(255,255,255,0.08)', color: ri === 0 ? '#0ea5e9' : '#cbd5e1', fontWeight: ri === 0 ? 700 : 400 }}>
                      {cell.trim().replace(/\*\*/g, '')}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
    tableBuffer = []; inTable = false
  }

  lines.forEach((line, i) => {
    if (line.startsWith('|')) { inTable = true; tableBuffer.push(line); return }
    if (inTable) flushTable('table-' + i)
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} style={{ fontSize: 26, fontWeight: 800, color: '#f0f6ff', margin: '36px 0 16px', lineHeight: 1.2 }}>{line.slice(3)}</h2>)
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} style={{ fontSize: 20, fontWeight: 700, color: '#0ea5e9', margin: '28px 0 12px' }}>{line.slice(4)}</h3>)
    } else if (line.startsWith('- ')) {
      elements.push(<li key={i} style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 1.7, marginBottom: 8, marginLeft: 20 }}>{line.slice(2)}</li>)
    } else if (line.trim()) {
      elements.push(<p key={i} style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 1.8, margin: '0 0 20px' }}>{line}</p>)
    }
  })
  if (inTable) flushTable('table-end')
  return elements
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()
  const allPosts = getAllPosts().filter(p => p.slug !== post.slug).slice(0, 3)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020818 0%, #070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ padding: '24px 40px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>BoxFlow OS</span>
        </Link>
        <span style={{ color: '#334155', margin: '0 4px' }}>›</span>
        <Link href="/blog" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>Blog</Link>
        <span style={{ color: '#334155', margin: '0 4px' }}>›</span>
        <span style={{ color: '#94a3b8', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{post.title}</span>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)', color: '#0ea5e9', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{post.category}</span>
            <span style={{ color: '#64748b', fontSize: 13 }}>{post.readTime}</span>
            <span style={{ color: '#64748b', fontSize: 13 }}>·</span>
            <span style={{ color: '#64748b', fontSize: 13 }}>By {post.publishedBy}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, color: '#f0f6ff' }}>{post.title}</h1>
          <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.6, borderLeft: '3px solid #0ea5e9', paddingLeft: 20 }}>{post.excerpt}</p>
        </div>

        <div style={{ marginBottom: 60 }}>{renderContent(post.content)}</div>

        <div style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(139,92,246,0.08))', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 20, padding: 36, textAlign: 'center' as const, marginBottom: 60 }}>
          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>See How Much BoxFlow OS Saves Your Operation</h3>
          <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>Use our free ROI calculator to get your exact savings estimate in 60 seconds.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <Link href="/roi" style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>Calculate Your Savings →</Link>
            <Link href="/contact" style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>Book a Demo</Link>
          </div>
        </div>

        {allPosts.length > 0 && (
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: '#f0f6ff' }}>More from the Blog</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {allPosts.map(p => (
                <Link key={p.slug} href={'/blog/' + p.slug} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(12,26,56,0.8)', border: '1px solid rgba(14,165,233,0.12)', borderRadius: 14, padding: 20 }}>
                    <div style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: 8 }}>{p.category}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f6ff', lineHeight: 1.4, marginBottom: 8 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 600 }}>Read More →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}