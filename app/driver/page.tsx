'use client'

import AuthGate from '@/components/AuthGate'

type AlertItem = {
  title: string
  detail: string
  tone: 'warning' | 'info' | 'success'
}

export default function DriverPage() {
  const topStats = [
    { label: 'Assigned Loads', value: '6', sub: '2 high priority' },
    { label: 'Active Drivers', value: '8', sub: 'All checked in' },
    { label: 'Avg ETA Accuracy', value: '97%', sub: 'Within target' },
    { label: 'Exceptions', value: '2', sub: 'Needs review' },
  ]

  const alerts: AlertItem[] = [
    {
      title: 'Route deviation detected',
      detail: 'TRK-201 moved 1.2 miles off planned route.',
      tone: 'warning',
    },
    {
      title: 'Driver check-in complete',
      detail: 'Angela Brooks is active and ready for dispatch.',
      tone: 'success',
    },
    {
      title: 'Urgent load alert',
      detail: 'Retail Packaging Co delivery is priority-ranked.',
      tone: 'info',
    },
  ]

  const driverTimeline = [
    { time: '08:10 AM', event: 'Driver checked in' },
    { time: '08:18 AM', event: 'Load accepted' },
    { time: '08:32 AM', event: 'Departed pickup location' },
    { time: '09:05 AM', event: 'In transit with GPS active' },
  ]

  return (
    <AuthGate>
      <main
        style={{
          minHeight: 'calc(100vh - 40px)',
          background:
            'radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 24%), linear-gradient(180deg, #050816 0%, #0b1220 100%)',
          color: '#fff',
          borderRadius: 28,
          padding: 28,
        }}
      >
        <div style={{ display: 'grid', gap: 22 }}>
          <section style={{ display: 'grid', gap: 10 }}>
            <div style={pillStyle}>Driver GPS Mode</div>
            <h1 style={titleStyle}>Driver Live Tracking</h1>
            <p style={subtitleStyle}>
              Track driver readiness, truck assignment, live route status, ETA accuracy, and delivery progress from one screen.
            </p>
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 14,
            }}
          >
            {topStats.map((item) => (
              <div key={item.label} style={statCardStyle}>
                <div style={statLabelStyle}>{item.label}</div>
                <div style={statValueStyle}>{item.value}</div>
                <div style={statSubStyle}>{item.sub}</div>
              </div>
            ))}
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 0.95fr',
              gap: 20,
              alignItems: 'start',
            }}
          >
            <div style={panelStyle}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                  flexWrap: 'wrap',
                }}
              >
                <div style={sectionTitleStyle}>Driver Control Panel</div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button style={miniBtnActive}>Live GPS</button>
                  <button style={miniBtn}>Manual Backup</button>
                  <button style={miniBtn}>History</button>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                <Field label="Driver Name" value="Angela Brooks" />
                <Field label="Truck" value="TRK-201 - Blue Truck 201" />
                <Field label="Assigned Load" value="ORD-1011" />

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 14,
                  }}
                >
                  <Field label="Current Status" value="In Transit" />
                  <Field label="Route ETA" value="2h 05m" />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 14,
                  }}
                >
                  <Field label="Latitude" value="35.4676" />
                  <Field label="Longitude" value="-97.5164" />
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                  <button style={primaryBtnStyle}>Start Real GPS</button>
                  <button style={secondaryBtnStyle}>Advance Status</button>
                  <button style={ghostBtnStyle}>Pause Tracking</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 20 }}>
              <div style={panelStyle}>
                <div style={sectionTitleStyle}>Current Assignment</div>

                <div style={assignmentCardStyle}>
                  <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>ORD-1011</div>

                  <div style={assignmentRowStyle}>
                    <span style={assignmentLabelStyle}>Client</span>
                    <span style={assignmentValueStyle}>Retail Packaging Co</span>
                  </div>

                  <div style={assignmentRowStyle}>
                    <span style={assignmentLabelStyle}>Truck</span>
                    <span style={assignmentValueStyle}>TRK-201</span>
                  </div>

                  <div style={assignmentRowStyle}>
                    <span style={assignmentLabelStyle}>Pickup</span>
                    <span style={assignmentValueStyle}>Nashville, Tennessee</span>
                  </div>

                  <div style={assignmentRowStyle}>
                    <span style={assignmentLabelStyle}>Dropoff</span>
                    <span style={assignmentValueStyle}>Dallas Distribution Center</span>
                  </div>

                  <div style={assignmentRowStyle}>
                    <span style={assignmentLabelStyle}>Priority</span>
                    <span style={{ ...assignmentValueStyle, color: '#fca5a5' }}>Rush</span>
                  </div>
                </div>
              </div>

              <div style={panelStyle}>
                <div style={sectionTitleStyle}>Driver Timeline</div>

                <div style={{ display: 'grid', gap: 12 }}>
                  {driverTimeline.map((item) => (
                    <div key={item.time + item.event} style={timelineRowStyle}>
                      <div style={timelineTimeStyle}>{item.time}</div>
                      <div style={timelineEventStyle}>{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: 20,
              alignItems: 'start',
            }}
          >
            <div style={panelStyle}>
              <div style={sectionTitleStyle}>Driver Map Snapshot</div>

              <div style={mapCardStyle}>
                <div style={mapHeaderStyle}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>TRK-201 Live Route</div>
                    <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
                      OKC corridor tracking with active delivery telemetry
                    </div>
                  </div>

                  <span style={liveBadgeStyle}>GPS LIVE</span>
                </div>

                <div style={mapMockStyle}>
                  <div style={mapGlowStyle} />
                  <div style={truckBadgeStyle}>TRK-201</div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: 12,
                    marginTop: 14,
                  }}
                >
                  <MiniMetric label="Speed" value="62 mph" />
                  <MiniMetric label="Stop Count" value="1" />
                  <MiniMetric label="Arrival Window" value="On Time" />
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <div style={sectionTitleStyle}>Exceptions & Alerts</div>

              <div style={{ display: 'grid', gap: 12 }}>
                {alerts.map((alert) => (
                  <div key={alert.title} style={alertStyle(alert.tone)}>
                    <div style={{ fontWeight: 900, marginBottom: 6 }}>{alert.title}</div>
                    <div style={{ lineHeight: 1.5 }}>{alert.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </AuthGate>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={fieldLabelStyle}>{label}</div>
      <div style={fieldBoxStyle}>{value}</div>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div style={miniMetricCardStyle}>
      <div style={miniMetricLabelStyle}>{label}</div>
      <div style={miniMetricValueStyle}>{value}</div>
    </div>
  )
}

function alertStyle(tone: AlertItem['tone']): React.CSSProperties {
  if (tone === 'warning') {
    return {
      color: '#fef2f2',
      background: 'rgba(127,29,29,0.32)',
      border: '1px solid rgba(248,113,113,0.24)',
      borderRadius: 16,
      padding: 14,
    }
  }

  if (tone === 'success') {
    return {
      color: '#ecfdf5',
      background: 'rgba(20,83,45,0.3)',
      border: '1px solid rgba(74,222,128,0.2)',
      borderRadius: 16,
      padding: 14,
    }
  }

  return {
    color: '#eff6ff',
    background: 'rgba(30,64,175,0.28)',
    border: '1px solid rgba(96,165,250,0.2)',
    borderRadius: 16,
    padding: 14,
  }
}

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  width: 'fit-content',
  alignItems: 'center',
  gap: 8,
  padding: '8px 14px',
  borderRadius: 999,
  background: 'rgba(37,99,235,0.14)',
  border: '1px solid rgba(96,165,250,0.24)',
  color: '#93c5fd',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.9,
  textTransform: 'uppercase',
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 44,
  lineHeight: 1.02,
  fontWeight: 900,
  letterSpacing: -0.8,
}

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#94a3b8',
  fontSize: 16,
  lineHeight: 1.6,
  maxWidth: 900,
}

const statCardStyle: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(8,15,30,0.95) 100%)',
  border: '1px solid rgba(148,163,184,0.14)',
  borderRadius: 22,
  padding: 18,
}

const statLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 12,
  marginBottom: 10,
  textTransform: 'uppercase',
  letterSpacing: 0.6,
  fontWeight: 700,
}

const statValueStyle: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 900,
  marginBottom: 6,
}

const statSubStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#93c5fd',
  fontWeight: 700,
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(148,163,184,0.14)',
  borderRadius: 26,
  padding: 18,
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: 0.7,
  fontWeight: 800,
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

const primaryBtnStyle: React.CSSProperties = {
  border: '1px solid rgba(59,130,246,0.35)',
  background: '#2563eb',
  color: '#fff',
  borderRadius: 12,
  padding: '12px 18px',
  fontWeight: 800,
  cursor: 'pointer',
}

const secondaryBtnStyle: React.CSSProperties = {
  border: '1px solid rgba(59,130,246,0.25)',
  background: 'rgba(59,130,246,0.12)',
  color: '#dbeafe',
  borderRadius: 12,
  padding: '12px 18px',
  fontWeight: 800,
  cursor: 'pointer',
}

const ghostBtnStyle: React.CSSProperties = {
  border: '1px solid rgba(148,163,184,0.2)',
  background: 'rgba(2,6,23,0.32)',
  color: '#e2e8f0',
  borderRadius: 12,
  padding: '12px 18px',
  fontWeight: 700,
  cursor: 'pointer',
}

const miniBtnActive: React.CSSProperties = {
  border: '1px solid rgba(59,130,246,0.35)',
  background: '#2563eb',
  color: '#fff',
  borderRadius: 10,
  padding: '8px 12px',
  fontWeight: 800,
  cursor: 'pointer',
}

const miniBtn: React.CSSProperties = {
  border: '1px solid rgba(148,163,184,0.16)',
  background: 'rgba(2,6,23,0.4)',
  color: '#cbd5e1',
  borderRadius: 10,
  padding: '8px 12px',
  fontWeight: 700,
  cursor: 'pointer',
}

const assignmentCardStyle: React.CSSProperties = {
  color: '#cbd5e1',
  lineHeight: 1.6,
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 18,
  padding: 16,
}

const assignmentRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  padding: '10px 0',
  borderBottom: '1px solid rgba(148,163,184,0.08)',
  alignItems: 'center',
}

const assignmentLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 700,
}

const assignmentValueStyle: React.CSSProperties = {
  color: '#f8fafc',
  fontWeight: 800,
  textAlign: 'right',
}

const timelineRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '110px 1fr',
  gap: 14,
  alignItems: 'start',
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 14,
  padding: 14,
}

const timelineTimeStyle: React.CSSProperties = {
  color: '#93c5fd',
  fontWeight: 800,
  fontSize: 13,
}

const timelineEventStyle: React.CSSProperties = {
  color: '#e2e8f0',
  fontWeight: 700,
}

const mapCardStyle: React.CSSProperties = {
  color: '#cbd5e1',
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 20,
  padding: 16,
}

const mapHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  alignItems: 'start',
  marginBottom: 14,
}

const liveBadgeStyle: React.CSSProperties = {
  background: 'rgba(20,83,45,0.32)',
  border: '1px solid rgba(74,222,128,0.22)',
  color: '#bbf7d0',
  borderRadius: 999,
  padding: '6px 10px',
  fontSize: 11,
  fontWeight: 800,
}

const mapMockStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: 260,
  borderRadius: 18,
  overflow: 'hidden',
  background:
    'linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(11,18,32,0.98) 100%)',
  border: '1px solid rgba(148,163,184,0.1)',
}

const mapGlowStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(circle at 40% 45%, rgba(59,130,246,0.28), transparent 18%), linear-gradient(135deg, transparent 30%, rgba(59,130,246,0.16) 50%, transparent 70%)',
}

const truckBadgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: '42%',
  left: '46%',
  transform: 'translate(-50%, -50%)',
  background: '#2563eb',
  color: '#fff',
  borderRadius: 999,
  padding: '10px 14px',
  fontSize: 12,
  fontWeight: 900,
  boxShadow: '0 10px 24px rgba(37,99,235,0.3)',
}

const miniMetricCardStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 14,
  padding: 12,
}

const miniMetricLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 700,
  marginBottom: 6,
}

const miniMetricValueStyle: React.CSSProperties = {
  color: '#f8fafc',
  fontSize: 18,
  fontWeight: 900,
}