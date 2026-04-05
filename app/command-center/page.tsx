'use client'

import React from 'react'
import AppSidebar from '@/components/AppSidebar'

export default function CommandCenterPage() {
  return (
    <div style={pageWrapper}>
      <AppSidebar active="command-center" />

      <main style={mainStyle}>
        <div style={pillStyle}>BoxFlow OS Command Center</div>
        <h1 style={titleStyle}>Executive Command Center</h1>
        <p style={subtitleStyle}>
          Visual operations control for logistics, production, dispatch, and AI-driven actions.
        </p>

        <div style={heroPanelStyle}>
          <div style={sectionLabelStyle}>Live Command Center View</div>
          <div style={imageFrameStyle}>
            <img
              src="/assets/command-center-bg.jpg"
              alt="Command Center"
              style={imageStyle}
            />
          </div>
        </div>

        <div style={twoColGrid}>
          <div style={panelStyle}>
            <div style={sectionLabelStyle}>Operations Snapshot</div>
            <div style={statGrid}>
              <StatCard label="Active Trucks" value="15" />
              <StatCard label="On-Time" value="12" />
              <StatCard label="Delayed" value="3" />
              <StatCard label="Production Lines" value="3" />
            </div>
          </div>

          <div style={panelStyle}>
            <div style={sectionLabelStyle}>Live Demo Notes</div>
            <div style={{ display: 'grid', gap: 12 }}>
              <NoteItem text="Lead with live operations visibility" />
              <NoteItem text="Show production and fleet on one screen" />
              <NoteItem text="Position BoxFlow OS as the control layer" />
              <NoteItem text="Explain delay alerts and AI optimization" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={statCardStyle}>
      <div style={statLabelStyle}>{label}</div>
      <div style={statValueStyle}>{value}</div>
    </div>
  )
}

function NoteItem({ text }: { text: string }) {
  return (
    <div style={noteItemStyle}>• {text}</div>
  )
}

const pageWrapper: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  background: 'radial-gradient(circle at top left, rgba(29,78,216,0.18), transparent 22%), linear-gradient(180deg, #050816 0%, #0b1220 100%)',
  padding: 20,
  gap: 24,
}

const mainStyle: React.CSSProperties = {
  flex: 1,
  display: 'grid',
  gap: 18,
  alignContent: 'start',
}

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 999,
  padding: '8px 12px',
  background: 'rgba(59,130,246,0.14)',
  border: '1px solid rgba(59,130,246,0.3)',
  color: '#93c5fd',
  fontSize: 12,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: 0.8,
}

const titleStyle: React.CSSProperties = {
  margin: '12px 0 8px',
  fontSize: 34,
  fontWeight: 900,
  color: '#ffffff',
}

const subtitleStyle: React.CSSProperties = {
  margin: 0,
  color: '#94a3b8',
  fontSize: 15,
}

const heroPanelStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.86)',
  border: '1px solid rgba(148,163,184,0.16)',
  borderRadius: 24,
  padding: 18,
  boxShadow: '0 18px 48px rgba(0,0,0,0.25)',
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.86)',
  border: '1px solid rgba(148,163,184,0.16)',
  borderRadius: 24,
  padding: 18,
  boxShadow: '0 18px 48px rgba(0,0,0,0.25)',
}

const twoColGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 18,
}

const statGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: 0.7,
  marginBottom: 14,
  fontWeight: 700,
}

const imageFrameStyle: React.CSSProperties = {
  borderRadius: 22,
  overflow: 'hidden',
  border: '1px solid rgba(148,163,184,0.14)',
}

const imageStyle: React.CSSProperties = {
  width: '100%',
  display: 'block',
}

const statCardStyle: React.CSSProperties = {
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 18,
  padding: 16,
}

const statLabelStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 12,
  marginBottom: 8,
}

const statValueStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
  color: '#ffffff',
}

const noteItemStyle: React.CSSProperties = {
  color: '#cbd5e1',
  lineHeight: 1.6,
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 16,
  padding: 14,
}