'use client'
import React, { useState } from 'react'

const phases = [
  {
    id: 1,
    title: 'Legal & Contract',
    icon: '📋',
    color: '#3b82f6',
    duration: 'Week 1',
    items: [
      { id: 'nda', label: 'Mutual NDA signed by both parties', critical: true },
      { id: 'msa', label: 'Master Service Agreement fully executed', critical: true },
      { id: 'po', label: 'Purchase Order number received from client', critical: true },
      { id: 'payment1', label: '50% implementation fee received ($75,000)', critical: true },
      { id: 'w9', label: 'W-9 form submitted to client accounting', critical: false },
      { id: 'vendor', label: 'Vendor registration completed in client system', critical: false },
      { id: 'insurance', label: 'Certificate of insurance provided ($2M liability)', critical: false },
    ]
  },
  {
    id: 2,
    title: 'Information Gathering',
    icon: '📊',
    color: '#8b5cf6',
    duration: 'Week 1-2',
    items: [
      { id: 'it_contact', label: 'IT point of contact assigned by client', critical: true },
      { id: 'pm_contact', label: 'Project manager assigned by client', critical: true },
      { id: 'sso_type', label: 'SSO provider identified (Azure AD, Okta, etc.)', critical: true },
      { id: 'fleet_list', label: 'Complete truck fleet list with IDs received', critical: true },
      { id: 'employee_roster', label: 'Employee roster exported from HR system', critical: true },
      { id: 'facility_list', label: 'All facility addresses and location codes received', critical: true },
      { id: 'client_list', label: 'Customer/client database exported', critical: false },
      { id: 'order_history', label: 'Historical order data (last 12 months) exported', critical: false },
      { id: 'production_stages', label: 'Production stage names and workflow documented', critical: true },
    ]
  },
  {
    id: 3,
    title: 'Technical Access',
    icon: '🔐',
    color: '#0ea5e9',
    duration: 'Week 2',
    items: [
      { id: 'test_env', label: 'Test environment access granted', critical: true },
      { id: 'vpn', label: 'VPN credentials provided if required', critical: false },
      { id: 'sso_creds', label: 'SSO/SAML credentials and configuration received', critical: true },
      { id: 'api_docs', label: 'API documentation for existing systems received', critical: false },
      { id: 'firewall', label: 'BoxFlow OS IPs whitelisted in client firewall', critical: false },
      { id: 'security_review', label: 'IT security review of BoxFlow OS completed', critical: true },
      { id: 'data_format', label: 'Data format specifications documented for import', critical: true },
    ]
  },
  {
    id: 4,
    title: 'Platform Configuration',
    icon: '⚙️',
    color: '#f59e0b',
    duration: 'Week 2-4',
    items: [
      { id: 'whitelabel', label: 'Platform white-labeled with client branding', critical: true },
      { id: 'sso_setup', label: 'SSO configured - client employees can log in', critical: true },
      { id: 'fleet_import', label: 'Fleet data imported - all trucks visible on map', critical: true },
      { id: 'employee_import', label: 'Employee roster imported into HR module', critical: true },
      { id: 'locations_setup', label: 'All facility locations configured', critical: true },
      { id: 'production_config', label: 'Production stages configured for client workflow', critical: true },
      { id: 'client_portal', label: 'Client portal configured with customer accounts', critical: false },
      { id: 'roles_setup', label: 'User roles and permissions configured', critical: true },
      { id: 'alerts_config', label: 'Alert thresholds and notification rules configured', critical: false },
    ]
  },
  {
    id: 5,
    title: 'Training & Testing',
    icon: '🎓',
    color: '#22c55e',
    duration: 'Week 4-6',
    items: [
      { id: 'admin_training', label: 'Admin users trained on full platform', critical: true },
      { id: 'dispatch_training', label: 'Dispatch team trained on dispatch module', critical: true },
      { id: 'driver_training', label: 'Drivers trained on driver mobile app', critical: true },
      { id: 'hr_training', label: 'HR team trained on HR and payroll module', critical: false },
      { id: 'client_training', label: 'Client-facing team trained on client portal', critical: false },
      { id: 'uat', label: 'User acceptance testing (UAT) completed', critical: true },
      { id: 'parallel_run', label: '2-week parallel run with existing systems started', critical: true },
      { id: 'bug_fixes', label: 'All critical bugs from UAT resolved', critical: true },
    ]
  },
  {
    id: 6,
    title: 'Go Live',
    icon: '🚀',
    color: '#a855f7',
    duration: 'Week 6-8',
    items: [
      { id: 'final_payment', label: '50% remaining implementation fee received ($75,000)', critical: true },
      { id: 'golive_date', label: 'Go-live date confirmed with client leadership', critical: true },
      { id: 'cutover', label: 'Full cutover from old systems completed', critical: true },
      { id: 'hypercare', label: '30-day hypercare support period started', critical: true },
      { id: 'annual_invoice', label: 'Annual license invoice sent ($500,000)', critical: true },
      { id: 'success_metrics', label: 'Success metrics baseline established', critical: false },
      { id: 'case_study', label: 'Permission to use as case study requested', critical: false },
    ]
  },
]

export default function OnboardingPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [activePhase, setActivePhase] = useState(1)
  const [clientName, setClientName] = useState('International Paper Co.')

  function toggle(id: string) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalItems = phases.reduce((acc, p) => acc + p.items.length, 0)
  const completedItems = Object.values(checked).filter(Boolean).length
  const progressPct = Math.round((completedItems / totalItems) * 100)

  const currentPhase = phases.find(p => p.id === activePhase)!
  const phaseCompleted = currentPhase.items.filter(i => checked[i.id]).length
  const phaseTotal = currentPhase.items.length

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <a href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 32 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 32, height: 32 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>BoxFlow OS</span>
        </a>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>Client Onboarding</div>
            <h1 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 8px' }}>Enterprise Onboarding Checklist</h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>Track every step of your client implementation from contract to go-live.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input value={clientName} onChange={e => setClientName(e.target.value)} style={{ padding: '10px 16px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.8)', color: '#fff', fontSize: 14, outline: 'none', width: 260 }} placeholder="Client name..." />
          </div>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: 24, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>{clientName} — Overall Progress</div>
            <div style={{ color: '#60a5fa', fontWeight: 900, fontSize: 20 }}>{progressPct}%</div>
          </div>
          <div style={{ height: 10, background: 'rgba(148,163,184,0.1)', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: progressPct + '%', background: 'linear-gradient(90deg, #2563eb, #22c55e)', borderRadius: 999, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ color: '#64748b', fontSize: 13 }}>{completedItems} of {totalItems} items completed</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 10 }}>
            {phases.map(phase => {
              const phaseComplete = phase.items.filter(i => checked[i.id]).length
              const phasePct = Math.round((phaseComplete / phase.items.length) * 100)
              const isActive = activePhase === phase.id
              return (
                <button key={phase.id} onClick={() => setActivePhase(phase.id)} style={{ background: isActive ? 'rgba(37,99,235,0.15)' : 'rgba(15,23,42,0.6)', border: isActive ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(148,163,184,0.12)', borderRadius: 16, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{phase.icon}</span>
                    <div>
                      <div style={{ color: isActive ? '#fff' : '#cbd5e1', fontWeight: 700, fontSize: 13 }}>{phase.title}</div>
                      <div style={{ color: '#64748b', fontSize: 11 }}>{phase.duration}</div>
                    </div>
                    {phasePct === 100 && <div style={{ marginLeft: 'auto', color: '#22c55e', fontSize: 16 }}>✓</div>}
                  </div>
                  <div style={{ height: 4, background: 'rgba(148,163,184,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: phasePct + '%', background: phase.color, borderRadius: 999 }} />
                  </div>
                  <div style={{ color: '#64748b', fontSize: 11, marginTop: 4 }}>{phaseComplete}/{phase.items.length} complete</div>
                </button>
              )
            })}
          </div>

          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 28 }}>{currentPhase.icon}</span>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#fff' }}>Phase {currentPhase.id}: {currentPhase.title}</h2>
                </div>
                <div style={{ color: '#64748b', fontSize: 13 }}>Timeline: {currentPhase.duration} • {phaseCompleted}/{phaseTotal} completed</div>
              </div>
              <div style={{ padding: '8px 16px', background: currentPhase.color + '20', border: '1px solid ' + currentPhase.color + '40', borderRadius: 999, color: currentPhase.color, fontWeight: 800, fontSize: 13 }}>
                {Math.round((phaseCompleted / phaseTotal) * 100)}% Done
              </div>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {currentPhase.items.map(item => (
                <div key={item.id} onClick={() => toggle(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, background: checked[item.id] ? 'rgba(34,197,94,0.08)' : 'rgba(2,6,23,0.4)', border: checked[item.id] ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(148,163,184,0.1)', borderRadius: 14, padding: '14px 18px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: checked[item.id] ? 'none' : '2px solid rgba(148,163,184,0.3)', background: checked[item.id] ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, color: '#fff', fontWeight: 900 }}>
                    {checked[item.id] ? '✓' : ''}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: checked[item.id] ? '#86efac' : '#e2e8f0', fontWeight: 600, fontSize: 14, textDecoration: checked[item.id] ? 'line-through' : 'none' }}>{item.label}</span>
                  </div>
                  {item.critical && !checked[item.id] && (
                    <div style={{ padding: '3px 8px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 999, color: '#fca5a5', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>CRITICAL</div>
                  )}
                  {item.critical && checked[item.id] && (
                    <div style={{ padding: '3px 8px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 999, color: '#86efac', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>DONE ✓</div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(148,163,184,0.1)', display: 'flex', gap: 12 }}>
              {activePhase > 1 && (
                <button onClick={() => setActivePhase(activePhase - 1)} style={{ padding: '10px 20px', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 10, color: '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>← Previous Phase</button>
              )}
              {activePhase < phases.length && (
                <button onClick={() => setActivePhase(activePhase + 1)} style={{ padding: '10px 20px', background: currentPhase.color, border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, marginLeft: 'auto' }}>Next Phase →</button>
              )}
              {activePhase === phases.length && phaseCompleted === phaseTotal && (
                <div style={{ marginLeft: 'auto', padding: '10px 20px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, color: '#22c55e', fontWeight: 800, fontSize: 13 }}>🎉 Onboarding Complete!</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>Quick Links</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'NDA Template', href: '/nda', color: '#3b82f6' },
              { label: 'MSA Contract', href: '/msa', color: '#8b5cf6' },
              { label: 'ROI Calculator', href: '/roi', color: '#22c55e' },
              { label: 'IP Pitch Deck', href: '/ip-pitch', color: '#f59e0b' },
              { label: 'Contact Form', href: '/contact', color: '#0ea5e9' },
              { label: 'Dashboard', href: '/dashboard', color: '#a855f7' },
            ].map(link => (
              <a key={link.label} href={link.href} style={{ padding: '8px 16px', background: link.color + '15', border: '1px solid ' + link.color + '30', borderRadius: 10, color: link.color, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>{link.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}