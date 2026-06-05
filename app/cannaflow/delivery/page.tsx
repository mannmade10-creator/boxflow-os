'use client'

import { useEffect, useState } from 'react'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import CannaLayout from '../components/CannaLayout'

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<any[]>([])

  async function loadDeliveries() {
    const { data, error } = await cannaSupabase
      .from('canna_deliveries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Delivery error:', error.message)
      return
    }

    setDeliveries(data || [])
  }

  useEffect(() => {
    loadDeliveries()
  }, [])

  const pending = deliveries.filter(d => d.status === 'Pending').length
  const inRoute = deliveries.filter(d => d.status === 'In Route').length
  const delivered = deliveries.filter(d => d.status === 'Delivered').length

  return (
    <CannaLayout title="Delivery Management">
      <div style={grid}>
        <div style={card}>
          <h2 style={warning}>{pending}</h2>
          <p style={label}>Pending</p>
        </div>

        <div style={card}>
          <h2 style={value}>{inRoute}</h2>
          <p style={label}>In Route</p>
        </div>

        <div style={card}>
          <h2 style={value}>{delivered}</h2>
          <p style={label}>Delivered</p>
        </div>

        <div style={card}>
          <h2 style={value}>{deliveries.length}</h2>
          <p style={label}>Total Deliveries</p>
        </div>
      </div>

      <div style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Order #</th>
              <th style={th}>Customer</th>
              <th style={th}>Driver</th>
              <th style={th}>Address</th>
              <th style={th}>Status</th>
              <th style={th}>Notes</th>
            </tr>
          </thead>

          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td style={td}>{delivery.order_number}</td>
                <td style={td}>{delivery.customer_name}</td>
                <td style={td}>{delivery.driver_name}</td>
                <td style={td}>{delivery.delivery_address}</td>
                <td style={td}>
                  <span style={getStatusStyle(delivery.status)}>
                    {delivery.status}
                  </span>
                </td>
                <td style={td}>{delivery.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CannaLayout>
  )
}

function getStatusStyle(status: string) {
  if (status === 'Delivered') return deliveredBadge
  if (status === 'In Route') return routeBadge
  return pendingBadge
}

const grid = {
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
  fontSize: 34,
  fontWeight: 950,
  margin: 0
}

const warning = {
  color: '#fbbf24',
  fontSize: 34,
  fontWeight: 950,
  margin: 0
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

const pendingBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(245,158,11,.15)',
  color: '#fbbf24',
  fontWeight: 800
}

const routeBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(59,130,246,.15)',
  color: '#93c5fd',
  fontWeight: 800
}

const deliveredBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(16,185,129,.15)',
  color: '#6ee7b7',
  fontWeight: 800
}