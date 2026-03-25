import type { ReactNode } from 'react'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import SignOutButton from './components/SignOutButton'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'Arial, sans-serif',
          background: '#020617',
          color: 'white',
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(2,6,23,0.96)',
              position: 'sticky',
              top: 0,
              zIndex: 50,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px',
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  color: '#38bdf8',
                  marginRight: 8,
                  whiteSpace: 'nowrap',
                }}
              >
                BoxFlow OS
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                <TopNavLink href="/login" label="Login" />
                <TopNavLink href="/present" label="Presentation" />
                <TopNavLink href="/dashboard" label="Dashboard" />
                <TopNavLink href="/executive" label="Executive" />
                <TopNavLink href="/fleet" label="Fleet" />
                <TopNavLink href="/orders" label="Orders" />
                <TopNavLink href="/equipment" label="Equipment" />
                <TopNavLink href="/alerts" label="Alerts" />
                <TopNavLink href="/hr" label="HR" />
                <TopNavLink href="/admin" label="Admin" />
                <TopNavLink href="/driver" label="Driver" />
                <TopNavLink href="/client" label="Client" />
                <TopNavLink href="/roi" label="ROI" />
                <TopNavLink href="/close" label="Close" />
              </div>

              <div style={{ marginLeft: 10, flexShrink: 0 }}>
                <SignOutButton />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1 }}>
            <aside
              className="desktop-sidebar"
              style={{
                width: 260,
                background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                padding: 20,
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    marginBottom: 6,
                    color: '#38bdf8',
                  }}
                >
                  BoxFlow OS
                </div>

                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: 13,
                    marginBottom: 24,
                  }}
                >
                  Powered by MADE Inc.
                </div>

                <NavSection title="Access">
                  <SidebarLink href="/login" label="Login" />
                  <SidebarLink href="/admin" label="Admin Panel" />
                </NavSection>

                <NavSection title="Presentation">
                  <SidebarLink href="/present" label="Presentation Mode" />
                  <SidebarLink href="/executive" label="Executive Dashboard" />
                  <SidebarLink href="/roi" label="ROI Calculator" />
                  <SidebarLink href="/close" label="Close Screen" />
                </NavSection>

                <NavSection title="Operations">
                  <SidebarLink href="/dashboard" label="Command Center" />
                  <SidebarLink href="/fleet" label="Fleet Map" />
                  <SidebarLink href="/orders" label="Orders" />
                  <SidebarLink href="/equipment" label="Equipment" />
                  <SidebarLink href="/alerts" label="Alerts" />
                </NavSection>

                <NavSection title="Workforce">
                  <SidebarLink href="/hr" label="HR & Payroll" />
                  <SidebarLink href="/driver" label="Driver App" />
                </NavSection>

                <NavSection title="Experience">
                  <SidebarLink href="/client" label="Client Portal" />
                </NavSection>
              </div>

              <div style={{ marginTop: 20 }}>
                <SignOutButton block />
              </div>
            </aside>

            <main
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              {children}
            </main>
          </div>
        </div>

        <style>{`
          @media (min-width: 961px) {
            .desktop-sidebar {
              display: flex !important;
            }
          }
        `}</style>
      </body>
    </html>
  )
}

function NavSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          color: '#64748b',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 10,
          fontWeight: 800,
        }}
      >
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

function SidebarLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <a
      href={href}
      style={{
        display: 'block',
        padding: '12px 14px',
        borderRadius: 12,
        marginBottom: 10,
        textDecoration: 'none',
        color: '#cbd5e1',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        fontWeight: 700,
      }}
    >
      {label}
    </a>
  )
}

function TopNavLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <a
      href={href}
      style={{
        textDecoration: 'none',
        color: '#cbd5e1',
        padding: '8px 12px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.06)',
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {label}
    </a>
  )
}