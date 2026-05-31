import './globals.css'
import type { Metadata, Viewport } from 'next'
import BoxFlowAIWidget from '@/components/BoxFlowAIWidget'

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'BoxFlow OS',
  description: 'Enterprise Operations Suite',
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