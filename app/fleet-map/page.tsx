'use client'
import React, { useState } from 'react'
import FleetMapInner from './FleetMapInner'

export default function FleetMapPage() {
  const [showDriverPanel, setShowDriverPanel] = useState(false)

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#0a0f1e' }}>
      
      <FleetMapInner />

      {showDriverPanel && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
          background: 'rgba(10,15,30,0.98)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: '24px 24px 0 0',
          padding: '20px 20px 40px',
          maxHeight: '60vh',
          overflowY: 'auto',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>🚛 Live Driver Status</div>
            <button
              onClick={() => setShowDriverPanel(false)}
              style={{
                background: 'rgba(239,68,68,0.2)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: 999,
                color: '#fca5a5',
                fontWeight: 800,
                fontSize: 14,
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              ✕ Close
            </button>
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { id: 'TRK-201', driver: 'Marcus Reed', status: 'In Transit', eta: '22 min', color: '#3b82f6' },
              { id: 'TRK-305', driver: 'Angela Brooks', status: 'Delivered', eta: 'Complete', color: '#22c55e' },
              { id: 'TRK-412', driver: 'James Carter', status: 'Dispatched', eta: '45 min', color: '#f59e0b' },
              { id: 'TRK-518', driver: 'Lisa Monroe', status: 'In Transit', eta: '31 min', color: '#3b82f6' },
            ].map(truck => (
              <div key={truck.id} style={{
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(148,163,184,0.16)',
                borderRadius: 16,
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{truck.driver}</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>{truck.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: truck.color, fontWeight: 800, fontSize: 13 }}>{truck.status}</div>
                  <div style={{ color: '#94a3b8', fontSize: 12 }}>ETA: {truck.eta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        gap: 10,
        background: 'rgba(10,15,30,0.95)',
        border: '1px solid rgba(59,130,246,0.3)',
        borderRadius: 999,
        padding: '6px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
      }}>
        <a href="/dashboard" style={{
          padding: '10px 16px',
          background: 'transparent',
          border: 'none',
          borderRadius: 999,
          color: '#94a3b8',
          fontWeight: 800,
          fontSize: 13,
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
        }}>
          ← Back
        </a>
        <button
          onClick={() => setShowDriverPanel(!showDriverPanel)}
          style={{
            padding: '10px 20px',
            background: showDriverPanel ? '#ef4444' : '#2563eb',
            border: 'none',
            borderRadius: 999,
            color: '#fff',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {showDriverPanel ? '🗺️ Show Map' : '🚛 Drivers'}
        </button>
      </div>
    </div>
  )
}