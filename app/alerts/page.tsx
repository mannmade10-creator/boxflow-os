'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import AuthGate from '../../components/AuthGate'

type AlertRow = {
  id: string
  title?: string | null
  message?: string | null
  severity?: string | null
  status?: string | null
  created_at?: string | null
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadAlerts() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })

      if (!mounted) return

      if (error) {
        console.error('Failed to load alerts:', error)
        setError(error.message)
        setAlerts([])
      } else {
        setAlerts((data as AlertRow[]) || [])
      }

      setLoading(false)
    }

    loadAlerts()

    const channel = supabase
      .channel('alerts-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        () => {
          loadAlerts()
        }
      )
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <AuthGate>
      <main
        style={{
          minHeight: '100vh',
          background: '#0b1220',
          color: 'white',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '32px',
                  fontWeight: 800,
                }}
              >
                Alerts Center
              </h1>
              <p
                style={{
                  marginTop: '8px',
                  color: '#94a3b8',
                }}
              >
                Live operational alerts, warnings, and system issues.
              </p>
            </div>

            <div
              style={{
                background: '#111827',
                border: '1px solid #1f2937',
                borderRadius: '12px',
                padding: '12px 16px',
                minWidth: '180px',
              }}
            >
              <div style={{ color: '#94a3b8', fontSize: '12px' }}>Total Alerts</div>
              <div style={{ fontSize: '28px', fontWeight: 800 }}>{alerts.length}</div>
            </div>
          </div>

          {loading && (
            <div
              style={{
                background: '#111827',
                border: '1px solid #1f2937',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              Loading alerts...
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                background: '#3f1d1d',
                border: '1px solid #7f1d1d',
                color: '#fecaca',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              Failed to load alerts: {error}
            </div>
          )}

          {!loading && !error && alerts.length === 0 && (
            <div
              style={{
                background: '#111827',
                border: '1px solid #1f2937',
                borderRadius: '16px',
                padding: '24px',
                color: '#94a3b8',
              }}
            >
              No alerts found in the alerts table yet.
            </div>
          )}

          {!loading && !error && alerts.length > 0 && (
            <div
              style={{
                display: 'grid',
                gap: '16px',
              }}
            >
              {alerts.map((alert) => {
                const severity = (alert.severity || 'info').toLowerCase()

                let borderColor = '#1f2937'
                let badgeBg = '#1e293b'
                let badgeColor = '#cbd5e1'

                if (severity === 'critical') {
                  borderColor = '#7f1d1d'
                  badgeBg = '#7f1d1d'
                  badgeColor = '#fecaca'
                } else if (severity === 'high' || severity === 'warning') {
                  borderColor = '#92400e'
                  badgeBg = '#78350f'
                  badgeColor = '#fde68a'
                } else if (severity === 'low' || severity === 'info') {
                  borderColor = '#1d4ed8'
                  badgeBg = '#1e3a8a'
                  badgeColor = '#bfdbfe'
                }

                return (
                  <div
                    key={alert.id}
                    style={{
                      background: '#111827',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '16px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h2
                          style={{
                            margin: 0,
                            fontSize: '20px',
                            fontWeight: 700,
                          }}
                        >
                          {alert.title || 'Untitled Alert'}
                        </h2>

                        <p
                          style={{
                            marginTop: '10px',
                            marginBottom: '14px',
                            color: '#cbd5e1',
                            lineHeight: 1.6,
                          }}
                        >
                          {alert.message || 'No message provided.'}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                            fontSize: '13px',
                            color: '#94a3b8',
                          }}
                        >
                          <span>Status: {alert.status || 'open'}</span>
                          <span>
                            Created:{' '}
                            {alert.created_at
                              ? new Date(alert.created_at).toLocaleString()
                              : 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          background: badgeBg,
                          color: badgeColor,
                          borderRadius: '999px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {severity}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </AuthGate>
  )
}