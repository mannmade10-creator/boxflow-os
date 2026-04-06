'use client'

import React from 'react'
import AppSidebar from '@/components/AppSidebar'

type DispatchLoad = {
  id: string
  client: string
  route: string
  priority: 'Urgent' | 'Rush' | 'Standard'
  status: 'Pending' | 'Assigned' | 'In Transit' | 'Delivered'
  truck: string
  driver: string
  eta: string
}

export default function DispatchPage() {
  const stats = [
    { label: 'Pending Loads', value: '4', sub: 'Needs assignment' },
    { label: 'Assigned Loads', value: '6', sub: 'Ready to move' },
    { label: 'In Transit', value: '8', sub: 'Live tracking active' },
    { label: 'Delivered Today', value: '11', sub: 'On-time 96%' },
  ]

  const loads: DispatchLoad[] = [
    {
      id: 'ORD-1012',
      client: 'Retail Packaging Co',
      route: 'OKC → Dallas Distribution Hub',
      priority: 'Urgent',
      status: 'Pending',
      truck: 'Unassigned',
      driver: 'Unassigned',
      eta: 'Awaiting dispatch',
    },
    {
      id: 'ORD-1011',
      client: 'Lopez Foods',
      route: 'Tulsa → Fort Worth',
      priority: 'Rush',
      status: 'Assigned',
      truck: 'TRK-305',
      driver: 'Angela Brooks',
      eta: '3h 10m',
    },
    {
      id: 'ORD-1010',
      client: 'Amazon Vendor',
      route: 'Norman → Kansas City',
      priority: 'Standard',
      status: 'In Transit',
      truck: 'TRK-201',
      driver: 'Marcus Hill',
      eta: '2h 05m',
    },
    {
      id: 'ORD-1009',
      client: 'ACME Corp',
      route: 'OKC → Little Rock',
      priority: 'Standard',
      status: 'Delivered',
      truck: 'TRK-114',
      driver: 'Derrick Stone',
      eta: 'Completed',
    },
  ]

  const aiSuggestions = [
    'Assign ORD-1012 to TRK-188 to protect delivery target.',
    'Shift one rush load from North lane to South lane to balance fleet utilization.',
    'Driver Angela Brooks has the best route fit for Tulsa → Fort Worth.',
    'Hold one non-priority load for 20 minutes until production clears Line 2 backlog.',
  ]

  const boardColumns: Array<DispatchLoad['status']> = [
    'Pending',
    'Assigned',
    'In Transit',
    'Delivered',
  ]

  return (
    <div style={pageWrapper}>
      <AppSidebar active="dispatch" />

      <main style={mainStyle}>
        <div style={{ display: 'grid', gap: 22 }}>
          <section style={{ display: 'grid', gap: 10 }}>
            <div style={pillStyle}>BoxFlow OS Dispatch</div>
            <h1 style={titleStyle}>Smart Dispatch Control</h1>
            <p style={subtitleStyle}>
              Assign trucks, manage driver flow, balance priorities, and push loads from order queue to active delivery.
            </p>
          </section>

          <section style={fourColGrid}>
            {stats.map((item) => (
              <div key={item.label} style={statCardStyle}>
                <div style={statLabelStyle}>{item.label}</div>
                <div style={statValueStyle}>{item.value}</div>
                <div style={statSubStyle}>{item.sub}</div>
              </div>
            ))}
          </section>

          <section style={twoColGrid}>
            <div style={panelStyle}>
              <div style={boardHeader}>
                <div style={sectionTitleStyle}>Dispatch Workflow Board</div>
                <div style={filterRow}>
                  <button style={miniBtnActive}>All</button>
                  <button style={miniBtn}>Urgent</button>
                  <button style={miniBtn}>Rush</button>
                  <button style={miniBtn}>Standard</button>
                </div>
              </div>

              <div style={kanbanGrid}>
                {boardColumns.map((status) => (
                  <div key={status} style={columnStyle}>
                    <div style={columnHeaderStyle}>{status}</div>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {loads
                        .filter((load) => load.status === status)
                        .map((load) => (
                          <div key={load.id} style={loadCardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                              <div style={{ fontWeight: 900, color: '#fff' }}>{load.id}</div>
                              <span style={priorityBadge(load.priority)}>{load.priority}</span>
                            </div>
                            <div style={{ color: '#cbd5e1', marginTop: 8, fontWeight: 700 }}>
                              {load.client}
                            </div>
                            <div style={{ color: '#94a3b8', marginTop: 6, fontSize: 13 }}>
                              {load.route}
                            </div>
                            <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                              <MetaRow label="Truck" value={load.truck} />
                              <MetaRow label="Driver" value={load.driver} />
                              <MetaRow label="ETA" value={load.eta} />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 20 }}>
              <div style={panelStyle}>
                <div style={sectionTitleStyle}>Dispatch Action Panel</div>
                <div style={{ display: 'grid', gap: 14, marginTop: 14 }}>
                  <Field label="Selected Load" value="ORD-1012" />
                  <Field label="Recommended Truck" value="TRK-188" />
                  <Field label="Recommended Driver" value="Angela Brooks" />
                  <div style={twoInputRow}>
                    <Field label="Priority" value="Urgent" />
                    <Field label="Target ETA" value="2h 40m" />
                  </div>
                  <div style={btnRow}>
                    <button style={primaryBtnStyle}>Assign Load</button>
                    <button style={secondaryBtnStyle}>Advance Status</button>
                    <button style={ghostBtnStyle}>Hold Load</button>
                  </div>
                </div>
              </div>

              <div style={panelStyle}>
                <div style={sectionTitleStyle}>AI Dispatch Suggestions</div>
                <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
                  {aiSuggestions.map((item) => (
                    <div key={item} style={noteCardStyle}>• {item}</div>
                  ))}
                </div>
              </div>

              <div style={panelStyle}>
                <div style={sectionTitleStyle}>Lane Summary</div>
                <div style={{ display: 'grid', marginTop: 14 }}>
                  <SummaryRow label="North Lanes" value="5 Active" />
                  <SummaryRow label="South Lanes" value="7 Active" />
                  <SummaryRow label="Average Dispatch Time" value="14 min" />
                  <SummaryRow label="Driver Availability" value="Good" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
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

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={metaRowStyle}>
      <span style={metaLabelStyle}>{label}</span>
      <span style={metaValueStyle}>{value}</span>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={summaryRowStyle}>
      <span style={summaryLabelStyle}>{label}</span>
      <span style={summaryValueStyle}>{value}</span>
    </div>
  )
}

function priorityBadge(priority: DispatchLoad['priority']): React.CSSProperties {
  if (priority === 'Urgent') return {
    background: 'rgba(127,29,29,0.35)',
    border: '1px solid rgba(248,113,113,0.24)',
    color: '#fecaca',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 800,
  }
  if (priority === 'Rush') return {
    background: 'rgba(88,28,135,0.28)',
    border: '1px solid rgba(216,180,254,0.22)',
    color: '#e9d5ff',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 800,
  }
  return {
    background: 'rgba(30,41,59,0.9)',
    border: '1px solid rgba(148,163,184,0.18)',
    color: '#cbd5e1',
    borderRadius: 999,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 800,
  }
}

const pageWrapper: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  background: 'radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 24%), linear-gradient(180deg, #050816 0%, #0b1220 100%)',
  padding: 20,
  gap: 24,
}

const mainStyle: React.CSSProperties = {
  flex: 1,
  color: '#fff',
  minWidth: 0,
}

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  width: 'fit-content',
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
  color: '#ffffff',
}

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#94a3b8',
  fontSize: 16,
  lineHeight: 1.6,
}

const fourColGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 14,
}

const twoColGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 0.9fr',
  gap: 20,
  alignItems: 'start',
}

const twoInputRow: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 14,
}

const btnRow: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
}

const boardHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  marginBottom: 14,
  flexWrap: 'wrap',
}

const filterRow: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
}

const kanbanGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 14,
  alignItems: 'start',
  marginTop: 14,
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
  color: '#ffffff',
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

const columnStyle: React.CSSProperties = {
  background: 'rgba(2,6,23,0.28)',
  border: '1px solid rgba(148,163,184,0.1)',
  borderRadius: 20,
  padding: 14,
  minHeight: 420,
}

const columnHeaderStyle: React.CSSProperties = {
  color: '#f8fafc',
  fontWeight: 900,
  marginBottom: 14,
  fontSize: 14,
}

const loadCardStyle: React.CSSProperties = {
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 16,
  padding: 14,
}

const metaRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  alignItems: 'center',
}

const metaLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 700,
}

const metaValueStyle: React.CSSProperties = {
  color: '#f8fafc',
  fontWeight: 800,
  fontSize: 12,
  textAlign: 'right',
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

const noteCardStyle: React.CSSProperties = {
  color: '#cbd5e1',
  lineHeight: 1.6,
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 16,
  padding: 14,
}

const summaryRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '14px 0',
  borderBottom: '1px solid rgba(148,163,184,0.1)',
}

const summaryLabelStyle: React.CSSProperties = {
  color: '#cbd5e1',
  fontWeight: 700,
}

const summaryValueStyle: React.CSSProperties = {
  color: '#93c5fd',
  fontWeight: 900,
}