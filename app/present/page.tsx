'use client'

import AuthGate from '@/components/AuthGate'

const pitchCards = [
  {
    title: 'Executive View',
    text: 'Show leadership revenue visibility, production performance, truck utilization, and operational risk in one screen.',
  },
  {
    title: 'Operations View',
    text: 'Let dispatch, production, and fleet teams work from the same live control layer without switching systems.',
  },
  {
    title: 'Client View',
    text: 'Give customers real-time order status, ETA visibility, and delay communication without exposing internal controls.',
  },
]

export default function PresentPage() {
  return (
    <AuthGate>
      <div style={page}>
        <div style={pill}>BOXFLOW OS PRESENTATION MODE</div>
        <h1 style={title}>Presentation Center</h1>
        <p style={subtitle}>
          Sales-ready overview for leadership demos, investor walkthroughs, and client presentations.
        </p>

        <div style={heroPanel}>
          <div style={heroTextWrap}>
            <div style={heroTitle}>Enterprise Operations Narrative</div>
            <div style={heroText}>
              BoxFlow OS brings production flow, dispatch control, client tracking, and AI decision support into one operating system.
            </div>

            <div style={buttonRow}>
              <a href="/command-center" style={primaryBtn}>
                Open Command Center
              </a>
              <a href="/executive" style={secondaryBtn}>
                Open AI Panel
              </a>
              <a href="/client" style={secondaryBtn}>
                Open Client View
              </a>
            </div>
          </div>

          <div style={heroImageCard}>
            <img
              src="/assets/command-center-bg.jpg"
              alt="BoxFlow OS Presentation"
              style={heroImage}
            />
          </div>
        </div>

        <div style={cardsGrid}>
          {pitchCards.map((card) => (
            <div key={card.title} style={infoCard}>
              <div style={cardTitle}>{card.title}</div>
              <div style={cardText}>{card.text}</div>
            </div>
          ))}
        </div>

        <div style={notesPanel}>
          <div style={sectionTitle}>Presentation Notes</div>
          <div style={note}>
            Lead with operational visibility: command center, production, dispatch, and fleet status on one platform.
          </div>
          <div style={note}>
            Show client trust: client portal gives external users order tracking without exposing internal controls.
          </div>
          <div style={note}>
            Close with leverage: AI layer reduces delays, improves routing, and helps leadership make faster decisions.
          </div>
        </div>
      </div>
    </AuthGate>
  )
}

const page: React.CSSProperties = {
  width: '100%',
  maxWidth: '100%',
  display: 'grid',
  gap: 22,
  background:
    'radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 24%), linear-gradient(180deg, #050816 0%, #0b1220 100%)',
  color: '#fff',
  borderRadius: 28,
  padding: 28,
  boxSizing: 'border-box',
}

const pill: React.CSSProperties = {
  display: 'inline-flex',
  width: 'fit-content',
  padding: '8px 14px',
  borderRadius: 999,
  background: 'rgba(37,99,235,0.14)',
  border: '1px solid rgba(96,165,250,0.24)',
  color: '#93c5fd',
  fontSize: 12,
  fontWeight: 800,
}

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 44,
  fontWeight: 900,
}

const subtitle: React.CSSProperties = {
  margin: 0,
  color: '#94a3b8',
  maxWidth: 900,
  lineHeight: 1.6,
}

const heroPanel: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 20,
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(148,163,184,0.14)',
  borderRadius: 26,
  padding: 20,
}

const heroTextWrap: React.CSSProperties = {
  display: 'grid',
  alignContent: 'center',
  gap: 16,
}

const heroTitle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 900,
}

const heroText: React.CSSProperties = {
  color: '#cbd5e1',
  lineHeight: 1.8,
  fontSize: 15,
}

const heroImageCard: React.CSSProperties = {
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 18,
  padding: 12,
}

const heroImage: React.CSSProperties = {
  width: '100%',
  display: 'block',
  borderRadius: 12,
}

const buttonRow: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
}

const primaryBtn: React.CSSProperties = {
  textDecoration: 'none',
  border: '1px solid rgba(59,130,246,0.35)',
  background: '#2563eb',
  color: '#fff',
  borderRadius: 12,
  padding: '12px 18px',
  fontWeight: 800,
}

const secondaryBtn: React.CSSProperties = {
  textDecoration: 'none',
  border: '1px solid rgba(59,130,246,0.25)',
  background: 'rgba(59,130,246,0.12)',
  color: '#dbeafe',
  borderRadius: 12,
  padding: '12px 18px',
  fontWeight: 800,
}

const cardsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 16,
}

const infoCard: React.CSSProperties = {
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(148,163,184,0.14)',
  borderRadius: 22,
  padding: 18,
}

const cardTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  marginBottom: 10,
}

const cardText: React.CSSProperties = {
  color: '#cbd5e1',
  lineHeight: 1.7,
}

const notesPanel: React.CSSProperties = {
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(148,163,184,0.14)',
  borderRadius: 26,
  padding: 20,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 12,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: 0.7,
  fontWeight: 800,
  marginBottom: 14,
}

const note: React.CSSProperties = {
  color: '#cbd5e1',
  lineHeight: 1.6,
  background: 'rgba(2,6,23,0.45)',
  border: '1px solid rgba(148,163,184,0.12)',
  borderRadius: 16,
  padding: 14,
  marginBottom: 12,
}