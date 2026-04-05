'use client'

import AppSidebar from '@/components/AppSidebar'

export default function SettingsPage() {
  return (
    
      <main style={pageStyle}>
        <div style={headerStyle}>
          <div style={pillStyle}>BoxFlow OS Settings</div>
          <h1 style={titleStyle}>System Settings</h1>
          <p style={subtitleStyle}>
            Configure branding, alerts, notifications, integrations, and display preferences.
          </p>
        </div>

        <div style={twoColStyle}>
          <SettingsPanel
            title="Brand Settings"
            items={[
              ['Platform Name', 'BoxFlow OS'],
              ['Company Label', 'Enterprise Operations Suite'],
              ['Theme', 'Blue / Dark Enterprise'],
            ]}
          />
          <SettingsPanel
            title="Alert Settings"
            items={[
              ['Delay Alerts', 'Enabled'],
              ['Maintenance Alerts', 'Enabled'],
              ['Driver Notifications', 'Enabled'],
            ]}
          />
          <SettingsPanel
            title="Integration Settings"
            items={[
              ['Map Provider', 'Mapbox'],
              ['Database', 'Supabase'],
              ['SMS Alerts', 'Twilio Connected'],
            ]}
          />
          <SettingsPanel
            title="Display Preferences"
            items={[
              ['Sidebar Mode', 'Expanded'],
              ['Dashboard View', 'Executive'],
              ['Fleet Mode', 'Live Tracking'],
            ]}
          />
        </div>
      </main>
    
  )
}

function SettingsPanel({ title, items }: { title: string; items: string[][] }) {
  return (
    <div style={panelStyle}>
      <div style={sectionTitleStyle}>{title}</div>
      <div style={{ display: 'grid', gap: 14 }}>
        {items.map(([label, value]) => (
          <div key={label}>
            <div style={fieldLabelStyle}>{label}</div>
            <div style={fieldBoxStyle}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: 'calc(100vh - 40px)',
  background: 'radial-gradient(circle at top left, rgba(29,78,216,0.18), transparent 22%), linear-gradient(180deg, #050816 0%, #0b1220 100%)',
  color: '#fff',
  borderRadius: 24,
  padding: 28,
}
const headerStyle: React.CSSProperties = { display: 'grid', gap: 8, marginBottom: 22 }
const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  borderRadius: 999,
  padding: '8px 12px',
  background: 'rgba(59,130,246,0.14)',
  border: '1px solid rgba(59,130,246,0.3)',
  color: '#93c5fd',
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
  width: 'fit-content',
}
const titleStyle: React.CSSProperties = { margin: 0, fontSize: 40, fontWeight: 900 }
const subtitleStyle: React.CSSProperties = { margin: 0, color: '#94a3b8', fontSize: 16 }
const twoColStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 20,
}
const panelStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.86)',
  border: '1px solid rgba(148,163,184,0.16)',
  borderRadius: 24,
  padding: 18,
}
const sectionTitleStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: 0.7,
  fontWeight: 700,
  marginBottom: 14,
}
const fieldLabelStyle: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: 13,
  marginBottom: 6,
  fontWeight: 700,
}
const fieldBoxStyle: React.CSSProperties = {
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 14,
  padding: '14px 16px',
  color: '#fff',
}