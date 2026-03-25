'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

function getColor(status: string) {
  if (status === 'running') return '#22c55e'
  if (status === 'down') return '#ef4444'
  if (status === 'idle') return '#f59e0b'
  return '#3b82f6'
}

export default function EquipmentPage() {
  const [machines, setMachines] = useState<any[]>([])

  async function loadEquipment() {
    const { data } = await supabase.from('equipment').select('*')
    setMachines(data || [])
  }

  useEffect(() => {
    loadEquipment()

    const channel = supabase
      .channel('equipment-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'equipment' },
        () => {
          loadEquipment()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#05070b',
        color: 'white',
        padding: '24px',
      }}
    >
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
        Equipment Control Board
      </h1>

      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
        Live realtime equipment status
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        {machines.map((m) => {
          const color = getColor(m.status)

          return (
            <div
              key={m.id}
              style={{
                background: '#0b1220',
                borderRadius: '16px',
                border: `2px solid ${color}`,
                boxShadow: `0 0 20px ${color}55`,
                padding: '20px',
              }}
            >
              <h2 style={{ marginBottom: '10px' }}>{m.machine_name}</h2>

              <div
                style={{
                  height: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#020617',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  boxShadow: `inset 0 0 25px ${color}`,
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color,
                  }}
                >
                  {String(m.status).toUpperCase()}
                </span>
              </div>

              <div>
                <p>Output: {m.output_percent || 0}%</p>
                <p>Status: {m.status}</p>
              </div>

              {m.status === 'down' && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '10px',
                    background: '#ef444422',
                    borderRadius: '8px',
                    color: '#fca5a5',
                  }}
                >
                  ⚠️ Machine Down
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}