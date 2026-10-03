import './globals.css'
import type { Metadata, Viewport } from 'next'
import BoxFlowAIWidget from '@/components/BoxFlowAIWidget'

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'BoxFlow OS — Enterprise Operations System for Manufacturing & Logistics',
  description: 'BoxFlow OS is the all-in-one operations platform for manufacturing, corrugated plants, trucking, food production, steel, and warehousing companies. Replace KIWIPLAN, Qualitek, and disconnected tools with one modern system. Starting at $599/month.',
  keywords: 'manufacturing operations software, corrugated plant software, KIWIPLAN replacement, logistics management system, fleet dispatch software, production floor software, trucking dispatch software, warehousing management, enterprise operations system',
  openGraph: {
    title: 'BoxFlow OS — Enterprise Operations System',
    description: 'Replace KIWIPLAN, Qualitek, and disconnected tools with one modern platform. Built for manufacturing, logistics, trucking, and warehousing.',
    url: 'https://www.boxflowos.com',
    siteName: 'BoxFlow OS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoxFlow OS — Enterprise Operations System',
    description: 'One platform for manufacturing, logistics, trucking, and warehousing operations.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BoxFlow OS',
  },
  icons: {
    icon: '/assets/logo.png',
    apple: '/assets/logo.png',
  },
  verification: {
    google: 'M-cuGCsjqGqFZxvJpxkTWhE-cjTPyy7pp50cBYiUZO0',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        
        
        
        
        <noscript dangerouslySetInnerHTML={{ __html: `
          <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=857558109989904&ev=PageView&noscript=1"/>
        `}} />
        
      </head>
      <body style={{ margin: 0, padding: 0, background: '#020617', overflowY: 'scroll' }}>
        {children}
        <BoxFlowAIWidget />
      </body>
    </html>
  )
}