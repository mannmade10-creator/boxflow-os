import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClassFlow AI — Teach Without Limits',
  description: 'Create full AI video lessons instantly, in any language.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#111318',
                color: '#e2e8f0',
                border: '0.5px solid rgba(59,130,246,0.3)',
                fontSize: '14px',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}