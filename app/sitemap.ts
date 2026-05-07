import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog-posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const blogUrls = posts.map(post => ({
    url: `https://www.boxflowos.com/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://www.boxflowos.com',          lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 1.0 },
    { url: 'https://www.boxflowos.com/boxflow',  lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 0.9 },
    { url: 'https://www.boxflowos.com/medflow',  lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 0.9 },
    { url: 'https://www.boxflowos.com/roi',      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: 'https://www.boxflowos.com/blog',     lastModified: new Date(), changeFrequency: 'weekly' as const,  priority: 0.8 },
    { url: 'https://www.boxflowos.com/pricing',  lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: 'https://www.boxflowos.com/about',    lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: 'https://www.boxflowos.com/contact',  lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    ...blogUrls,
  ]
}