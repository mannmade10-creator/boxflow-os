import Link from 'next/link'
import { getAllPosts } from '@/lib/blog-posts'
import type { Metadata } from 'next'
import BlogCard from '@/components/BlogCard'

export const metadata: Metadata = {
  title: 'Blog | BoxFlow OS — Operations & Logistics Insights',
  description: 'Expert insights on logistics software, fleet management, operations strategy, and how to reduce software costs for your business.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020818 0%, #070f24 100%)', color: '#f0f6ff', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '60px 20px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
            <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
          </Link>
          <div style={{ display: 'block', background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            Operations Intelligence Blog
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>
            Insights for <span style={{ color: '#0ea5e9' }}>Operations Leaders</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Expert analysis on logistics software, fleet management, and how to run a more efficient, more profitable operation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} featured={i === 0} />
          ))}
        </div>

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