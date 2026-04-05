'use client'

import React from 'react'
import AppSidebar from '@/components/AppSidebar'

type OrderItem = {
  id: string
  client: string
  lane: string
  truck: string
  status: string
  priority: string
  eta: string
}

export default function OrdersPage() {
  const stats = [
    { label: 'Total Orders', value: '28', sub: '+4 today' },
    { label: 'Open Orders', value: '12', sub: 'Needs review' },
    { label: 'Assigned Loads', value: '9', sub: 'Dispatch ready' },
    { label: 'Rush Orders', value: '3', sub: 'Priority handling' },
  ]

  const orders: OrderItem[] = [
    {
      id: 'ORD-1007',
      client: 'Retail Packaging Co',
      lane: 'Oklahoma City → Dallas',
      truck: 'TRK-201',
      status: 'Assigned',
      priority: 'Rush',
      eta: '2h 10m',
    },
    {
      id: 'ORD-1006',
      client: 'Lopez Foods',
      lane: 'Tulsa → Fort Worth',
      truck: 'TRK-305',
      status: 'In Transit',
      priority: 'Standard',
      eta: '3h 25m',
    },
    {
      id: 'ORD-1005',
      client: 'Amazon Vendor',
      lane: 'OKC → Kansas City',
      truck: 'TRK-114',
      status: 'Pending',
      priority: 'Urgent',
      eta: 'Awaiting Dispatch',
    },
    {
      id: 'ORD-1004',
      client: 'ACME Corp',
      lane: 'Norman → Little Rock',
      truck: 'TRK-188',
      status: 'Delivered',
      priority: 'Standard',
      eta: 'Completed',
    },
  ]

  return (
    <div style={pageWrapper}>
      <AppSidebar active="orders" />

      <main style={mainStyle}>
        <div style={{ display: 'grid', gap: 22 }}>
          <section style={{ display: 'grid', gap: 10 }}>
            <div style={pillStyle}>Orders Control</div>
            <h1 style={titleStyle}>Enterprise Order System</h1>
            <p style={subtitleStyle}>
              Create, track, assign, and manage live orders across dispatch, fleet, and client flow.
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
              <div style={sectionTitleStyle}>Create / Update Order</div>

              <div style={{ display: 'grid', gap: 14, marginTop: 14 }}>
                <Field label="Load Name" value="IP Shipment Load 001" />
                <Field label="Client Name" value="Retail Packaging Co" />
                <Field label="Pickup Location" value="Oklahoma City, Oklahoma" />
                <Field label="Dropoff Location" value="Dallas Distribution Hub" />

                <div style={twoInputRow}>
                  <Field label="Status" value="Pending" />
                  <Field label="Priority" value="Rush" />
                </div>

                <div style={twoInputRow}>
                  <Field label="Assigned Truck" value="TRK-201" />
                  <Field label="ETA" value="2h 10m" />
                </div>

                <div style={btnRow}>
                  <button style={primaryBtnStyle}>Create Order</button>
                  <button style={secondaryBtnStyle}>Save Draft</button>
                  <button style={ghostBtnStyle}>Clear Form</button>
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <div style={boardHeader}>
                <div style={sectionTitleStyle}>Live Orders Board</div>
                <div style={filterRow}>
                  <button style={miniBtnActive}>All</button>
                  <button style={miniBtn}>Pending</button>
                  <button style={miniBtn}>Assigned</button>
                  <button style={miniBtn}>Delivered</button>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
                {orders.map((order) => (
                  <div key={order.id} style={orderCardStyle}>
                    <div style={orderCardGrid}>
                      <div>
                        <div style={orderIdStyle}>{order.id}</div>
                        <div style={{ color: '#cbd5e1', marginBottom: 4 }}>{order.client}</div>
                        <div style={{ color: '#94a3b8', fontSize: 13 }}>{order.lane}</div>
                      </div>
                      <InfoBlock label="Truck" value={order.truck} />
                      <InfoBlock label="Status" value={order.status} />
                      <InfoBlock label="Priority" value={order.priority} />
                      <InfoBlock label="ETA" value={order.eta} />
                    </div>
                  </div>
                ))}
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

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={infoLabelStyle}>{label}</div>
      <div style={infoValueStyle}>{value}</div>
    </div>
  )
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
  alignItems: 'center',
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
  gridTemplateColumns: '0.95fr 1.05fr',
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
  marginTop: 4,
}

const boardHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  flexWrap: 'wrap',
}

const filterRow: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
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

const orderCardStyle: React.CSSProperties = {
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 18,
  padding: 16,
}

const orderCardGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 0.8fr',
  gap: 12,
  alignItems: 'start',
}

const orderIdStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 900,
  marginBottom: 6,
  color: '#ffffff',
}

const infoLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 6,
  fontWeight: 700,
}

const infoValueStyle: React.CSSProperties = {
  color: '#f8fafc',
  fontWeight: 800,
}