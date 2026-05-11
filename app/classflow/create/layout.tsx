import Topbar from '@/components/layout/Topbar'

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#07080d' }}>
      <Topbar />
      <main style={{ padding: '28px 24px', maxWidth: 900, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  )
}
