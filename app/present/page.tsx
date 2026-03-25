'use client'

import { useState } from 'react'

const slides = [
  {
    title: 'Executive Overview',
    text: 'BoxFlow OS gives leadership real-time visibility across operations, logistics, and production.',
    path: '/executive',
  },
  {
    title: 'Fleet Visibility',
    text: 'Track trucks live with GPS movement and real-time status updates.',
    path: '/fleet',
  },
  {
    title: 'AI Dispatch',
    text: 'Automatically assign loads, optimize routes, and reduce manual decision-making.',
    path: '/orders',
  },
  {
    title: 'Operational Intelligence',
    text: 'Monitor equipment performance and identify downtime instantly.',
    path: '/equipment',
  },
  {
    title: 'Financial Impact',
    text: 'Translate operational improvements into measurable ROI.',
    path: '/roi',
  },
  {
    title: 'Approval',
    text: 'Launch a pilot program and validate results before scaling.',
    path: '/close',
  },
]

export default function PresentationMode() {
  const [index, setIndex] = useState(0)

  const current = slides[index]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          width: '100%',
          background: '#111827',
          padding: '40px',
          borderRadius: '16px',
        }}
      >
        <div style={{ fontSize: '14px', color: '#38bdf8', marginBottom: '10px' }}>
          PRESENTATION MODE
        </div>

        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>
          {current.title}
        </h1>

        <p style={{ color: '#cbd5e1', fontSize: '18px', lineHeight: 1.6 }}>
          {current.text}
        </p>

        <div style={{ marginTop: '30px' }}>
          <a
            href={current.path}
            style={{
              display: 'inline-block',
              padding: '14px 20px',
              borderRadius: '10px',
              background: '#22c55e',
              color: 'black',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Open Live Screen
          </a>
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            style={btn}
          >
            Back
          </button>

          <div style={{ opacity: 0.6 }}>
            {index + 1} / {slides.length}
          </div>

          <button
            onClick={() => setIndex((i) => Math.min(i + 1, slides.length - 1))}
            style={btn}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

const btn: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: '8px',
  border: 'none',
  background: '#3b82f6',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 700,
}