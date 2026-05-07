'use client'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog-posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | BoxFlow OS — Operations & Logistics Insights',
  description: 'Expert insights on logistics software, fleet management, operations strategy, and how to reduce software costs for your business.',
}

const CATEGORY_COLORS: Record<string, string> = {
  'Logistics': '#0ea5e9',
  'Operations': '#8b5cf6',
  'Business Strategy': '#f59e0b',
  'Software Comparison': '#ef4444',
  'Fleet Management': '#10b981',
  'Healthcare': '#14b8a6',
  'Operations Strategy': '#6366f1',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020818 0%, #070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '60px 20px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
            <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
          </Link>
          <div style={{ display: 'block', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            Operations Intelligence Blog
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>
            Insights for <span style={{ color: '#0ea5e9' }}>Operations Leaders</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Expert analysis on logistics software, fleet management, and how to run a more efficient, more profitable operation.
          </p>
        </div>

        {/* Posts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {posts.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(12,26,56,0.9)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 20, padding: 28, height: '100%', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 16 }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(14,165,233,0.4)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(14,165,233,0.15)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
                {i === 0 && (
                  <div style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'flex-start' }}>
                    Featured
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ background: `${CATEGORY_COLORS[post.category] || '#0ea5e9'}20`, border: `1px solid ${CATEGORY_COLORS[post.category] || '#0ea5e9'}40`, color: CATEGORY_COLORS[post.category] || '#0ea5e9', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {post.category}
                  </span>
                  <span style={{ color: '#64748b', fontSize: 12 }}>{post.readTime}</span>
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f0f6ff', lineHeight: 1.3, margin: 0 }}>{post.title}</h2>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: 0, flex: 1 }}>{post.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#64748b', fontSize: 12 }}>By {post.publishedBy}</span>
                  <span style={{ color: '#0ea5e9', fontSize: 13, fontWeight: 700 }}>Read More →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 80, textAlign: 'center', background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.06))', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 24, padding: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>See How Much BoxFlow OS Saves Your Operation</h2>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>Use our free ROI calculator to get your exact savings number in 60 seconds.</p>
          <Link href="/roi" style={{ display: 'inline-block', padding: '16px 40px', background: 'linear-gradient(135deg, #0ea5e9, #22d3ee)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 16 }}>
            Calculate Your Savings →
          </Link>
        </div>
      </div>
    </div>
  )
}