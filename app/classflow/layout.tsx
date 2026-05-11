import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClassFlow AI',
  description: 'Intelligent Learning Platform',
}

export default function ClassFlowLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
