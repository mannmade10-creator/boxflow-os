'use client'

import { useEffect, useState } from 'react'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import CannaLayout from '../components/CannaLayout'

export default function CompliancePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadCompliance() {
    setLoading(true)

    const { data, error } = await cannaSupabase
      .from('canna_compliance')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Compliance error:', error.message, error.code, error.details)
      setLoading(false)
      return
    }

    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadCompliance()
  }, [])

  return (
    <CannaLayout title="Compliance Center">
      <div style={cardGrid}>
        <div style={card}>
          <h2 style={value}>Active</h2>
          <p style={label}>OMMA License</p>
        </div>

        <div style={card}>
          <h2 style={value}>Ready</h2>
          <p style={label}>Audit Status</p>
        </div>

        <div style={card}>
          <h2 style={value}>Pending</h2>
          <p style={label}>Certifications</p>
        </div>

        <div style={card}>
          <h2 style={dangerValue}>Offline</h2>
          <p style={label}>Metrc Sync</p>
        </div>
      </div>

      {loading ? (
        <p>Loading compliance records...</p>
      ) : (
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Compliance Type</th>
                <th style={th}>Status</th>
                <th style={th}>Due Date</th>
                <th style={th}>Notes</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.compliance_type}</td>
                  <td style={td}>{item.status}</td>
                  <td style={td}>{item.due_date}</td>
                  <td style={td}>{item.notes}</td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td style={td} colSpan={4}>No compliance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </CannaLayout>
  )
}

const cardGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4,1fr)',
  gap: 18,
  marginBottom: 24
}

const card = {
  background: '#0f172a',
  border: '1px solid rgba(16,185,129,.25)',
  borderRadius: 20,
  padding: 24
}

const value = {
  color: '#6ee7b7',
  margin: 0,
  fontSize: 32,
  fontWeight: 950
}

const dangerValue = {
  color: '#f87171',
  margin: 0,
  fontSize: 32,
  fontWeight: 950
}

const label = {
  color: '#94a3b8',
  margin: '8px 0 0'
}

const tableWrap = {
  background: '#0f172a',
  border: '1px solid rgba(16,185,129,.25)',
  borderRadius: 20,
  overflow: 'hidden'
}

const th = {
  textAlign: 'left' as const,
  padding: 16,
  color: '#6ee7b7',
  borderBottom: '1px solid rgba(255,255,255,.1)'
}

const td = {
  padding: 16,
  borderBottom: '1px solid rgba(255,255,255,.08)',
  color: '#cbd5e1'
}