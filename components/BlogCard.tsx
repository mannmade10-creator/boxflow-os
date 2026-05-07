'use client'
import Link from 'next/link'
import { BlogPost } from '@/lib/blog-posts'
import { useState } from 'react'

const CATEGORY_COLORS: Record<string, string> = {
  'Logistics': '#0ea5e9',
  'Operations': '#8b5cf6',
  'Business Strategy': '#f59e0b',
  'Software Comparison': '#ef4444',
  'Fleet Management': '#10b981',
  'Healthcare': '#14b8a6',
  'Operations Strategy': '#6366f1',
}

export default function BlogCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const color = CATEGORY_COLORS[post.category] || '#0ea5e9'

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'rgba(12,26,56,0.9)',
          border: `1px solid ${hovered ? 'rgba(14,165,233,0.4)' : 'rgba(14,165,233,0.15)'}`,
          borderRadius: 20,
          padding: 28,
          height: '100%',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'border-color 0.2s, transform 0.2s',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
        {featured && (
          <div style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'flex-start' }}>
            Featured
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: `${color}20`, border: `1px solid ${color}40`, color, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
  )
}