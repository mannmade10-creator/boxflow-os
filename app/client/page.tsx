'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AppSidebar from '@/components/AppSidebar'

type ProfileRow = {
  id: string
  email?: string | null
  role?: string | null
  client_name?: string | null
}

type OrderRow = {
  id: string
  load_name?: string | null
  client_name?: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
  status?: string | null
  assigned_truck_id?: string | null
  created_at?: string | null
}

type DashboardStats = {
  total: number
  active: number
  rush: number
  delayed: number
}

function getStatusStyles(status: string) {
  const value = (status || '').toLowerCase()

  if (
    value.includes('delivered') ||
    value.includes('complete') ||
    value.includes('completed')
  ) {
    return {
      bg: 'rgba(34,197,94,0.14)',
      border: 'rgba(34,197,94,0.32)',
      color: '#86efac',
      label: status || 'Completed',
    }
  }

  if (
    value.includes('delay') ||
    value.includes('hold') ||
    value.includes('late') ||
    value.includes('issue')
  ) {
    return {
      bg: 'rgba(239,68,68,0.14)',
      border: 'rgba(239,68,68,0.32)',
      color: '#fca5a5',
      label: status || 'Delayed',
    }
  }

  if (
    value.includes('rush') ||
    value.includes('priority') ||
    value.includes('urgent')
  ) {
    return {
      bg: 'rgba(245,158,11,0.14)',
      border: 'rgba(245,158,11,0.32)',
      color: '#fcd34d',
      label: status || 'Rush',
    }
  }

  if (
    value.includes('transit') ||
    value.includes('active') ||
    value.includes('dispatch') ||
    value.includes('assigned') ||
    value.includes('in progress') ||
    value.includes('picked')
  ) {
    return {
      bg: 'rgba(59,130,246,0.14)',
      border: 'rgba(59,130,246,0.32)',
      color: '#93c5fd',
      label: status || 'Active',
    }
  }

  return {
    bg: 'rgba(148,163,184,0.14)',
    border: 'rgba(148,163,184,0.28)',
    color: '#cbd5e1',
    label: status || 'Pending',
  }
}

function buildStats(orders: OrderRow[]): DashboardStats {
  let active = 0
  let rush = 0
  let delayed = 0

  for (const order of orders) {
    const status = (order.status || '').toLowerCase()

    if (
      status.includes('transit') ||
      status.includes('active') ||
      status.includes('dispatch') ||
      status.includes('assigned') ||
      status.includes('in progress') ||
      status.includes('picked')
    ) {
      active += 1
    }

    if (
      status.includes('rush') ||
      status.includes('priority') ||
      status.includes('urgent')
    ) {
      rush += 1
    }

    if (
      status.includes('delay') ||
      status.includes('hold') ||
      status.includes('late') ||
      status.includes('issue')
    ) {
      delayed += 1
    }
  }

  return {
    total: orders.length,
    active,
    rush,
    delayed,
  }
}

function normalizeOrder(order: any): OrderRow {
  return {
    id: String(order?.id ?? ''),
    load_name:
      order?.load_name ||
      order?.order_name ||
      order?.name ||
      order?.title ||
      (order?.id ? `Order ${order.id}` : 'Unnamed Order'),
    client_name: order?.client_name || order?.client || null,
    pickup_location:
      order?.select('*') ||
      order?.select('*') ||
      order?.select('*') ||
      order?.select('*') ||
      order?.select('*') ||
      null,
    dropoff_location:
      order?.dropoff_location ||
      order?.dropoff ||
      order?.destination ||
      order?.to_location ||
      order?.delivery_location ||
      order?.dropoff_address ||
      null,
    status: order?.status || 'Pending',
    assigned_truck_id:
      order?.assigned_truck_id ||
      order?.truck_id ||
      order?.assigned_truck ||
      order?.truck ||
      null,
    created_at: order?.created_at || order?.inserted_at || null,
  }
}

export default function ClientPage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stats = useMemo(() => buildStats(orders), [orders])

  async function loadClientDashboard(showRefreshState = false) {
    try {
      if (showRefreshState) setRefreshing(true)
      setError(null)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError
      if (!user) throw new Error('No authenticated user found.')

      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role, client_name')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      const typedProfile = profileRow as ProfileRow
      setProfile(typedProfile)

      if (!typedProfile?.client_name) {
        setOrders([])
        setLoading(false)
        setRefreshing(false)
        return
      }

      const { data: rawOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('client_name', typedProfile.client_name)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      const normalizedOrders = ((rawOrders as any[]) || []).map(normalizeOrder)
      setOrders(normalizedOrders)
      setLoading(false)
      setRefreshing(false)
    } catch (err: any) {
      console.error('Client dashboard load error:', err)
      setError(err?.message || 'Failed to load client dashboard.')
      setOrders([])
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadClientDashboard()
  }, [])

  useEffect(() => {
    if (!profile?.client_name) return

    const channel = supabase
      .channel('client-orders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          loadClientDashboard(true)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [profile?.client_name])

  return (
    
      <main
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top left, rgba(29,78,216,0.18), transparent 22%), linear-gradient(180deg, #050816 0%, #0b1220 100%)',
          color: '#ffffff',
          padding: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 999,
                  padding: '8px 12px',
                  background: 'rgba(59,130,246,0.14)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  color: '#93c5fd',
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                }}
              >
                Client Portal
              </div>

              <h1
                style={{
                  margin: '14px 0 8px',
                  fontSize: 32,
                  lineHeight: 1.1,
                }}
              >
                Client Orders Dashboard
              </h1>

              <p
                style={{
                  margin: 0,
                  color: '#94a3b8',
                  maxWidth: 760,
                  lineHeight: 1.65,
                }}
              >
                This portal shows only the signed-in client&apos;s assigned orders,
                delivery activity, and order status.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <a
                href="/fleet-map"
                style={{
                  textDecoration: 'none',
                  background: 'rgba(15,23,42,0.88)',
                  color: '#fff',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontWeight: 700,
                }}
              >
                Fleet Map
              </a>

              <a
                href="/dispatch"
                style={{
                  textDecoration: 'none',
                  background: 'rgba(15,23,42,0.88)',
                  color: '#fff',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontWeight: 700,
                }}
              >
                Dispatch
              </a>

              <a
                href="/command-center"
                style={{
                  textDecoration: 'none',
                  background: 'rgba(15,23,42,0.88)',
                  color: '#fff',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontWeight: 700,
                }}
              >
                Command Center
              </a>

              <button
                onClick={() => loadClientDashboard(true)}
                style={{
                  border: '1px solid rgba(59,130,246,0.3)',
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              gap: 18,
              alignItems: 'start',
            }}
          >
            <section
              style={{
                background: 'rgba(15,23,42,0.86)',
                border: '1px solid rgba(148,163,184,0.16)',
                borderRadius: 24,
                padding: 18,
                boxShadow: '0 18px 48px rgba(0,0,0,0.25)',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: 0.7,
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
                Account Summary
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    background: 'rgba(2,6,23,0.5)',
                    border: '1px solid rgba(148,163,184,0.14)',
                    borderRadius: 18,
                    padding: 14,
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>
                    Signed In
                  </div>
                  <div style={{ color: '#e2e8f0', fontWeight: 700, wordBreak: 'break-word' }}>
                    {profile?.email || 'Unknown'}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(2,6,23,0.5)',
                    border: '1px solid rgba(148,163,184,0.14)',
                    borderRadius: 18,
                    padding: 14,
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>
                    Role
                  </div>
                  <div style={{ color: '#e2e8f0', fontWeight: 700 }}>
                    {profile?.role || 'Unassigned'}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(2,6,23,0.5)',
                    border: '1px solid rgba(148,163,184,0.14)',
                    borderRadius: 18,
                    padding: 14,
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 6 }}>
                    Client
                  </div>
                  <div style={{ color: '#e2e8f0', fontWeight: 700 }}>
                    {profile?.client_name || 'Not Assigned'}
                  </div>
                </div>
              </div>
            </section>

            <section
              style={{
                display: 'grid',
                gap: 18,
              }}
            >
              {!loading && profile && !profile.client_name && (
                <div
                  style={{
                    background: 'rgba(127,29,29,0.28)',
                    border: '1px solid rgba(248,113,113,0.36)',
                    color: '#fecaca',
                    borderRadius: 20,
                    padding: 18,
                  }}
                >
                  This account is not assigned to a client yet. Add a
                  <strong> client_name </strong>
                 value in the profiles table for this user, then refresh.
                </div>
              )}

              {error && (
                <div
                  style={{
                    background: 'rgba(127,29,29,0.28)',
                    border: '1px solid rgba(248,113,113,0.36)',
                    color: '#fecaca',
                    borderRadius: 20,
                    padding: 18,
                  }}
                >
                  {error}
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    background: 'rgba(15,23,42,0.86)',
                    border: '1px solid rgba(148,163,184,0.16)',
                    borderRadius: 22,
                    padding: 18,
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>
                    Total Orders
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800 }}>{stats.total}</div>
                </div>

                <div
                  style={{
                    background: 'rgba(15,23,42,0.86)',
                    border: '1px solid rgba(148,163,184,0.16)',
                    borderRadius: 22,
                    padding: 18,
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>
                    Active Orders
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800 }}>{stats.active}</div>
                </div>

                <div
                  style={{
                    background: 'rgba(15,23,42,0.86)',
                    border: '1px solid rgba(148,163,184,0.16)',
                    borderRadius: 22,
                    padding: 18,
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>
                    Rush Orders
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800 }}>{stats.rush}</div>
                </div>

                <div
                  style={{
                    background: 'rgba(15,23,42,0.86)',
                    border: '1px solid rgba(148,163,184,0.16)',
                    borderRadius: 22,
                    padding: 18,
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>
                    Delayed / Hold
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800 }}>{stats.delayed}</div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15,23,42,0.86)',
                  border: '1px solid rgba(148,163,184,0.16)',
                  borderRadius: 24,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '18px 18px 14px',
                    borderBottom: '1px solid rgba(148,163,184,0.12)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>Client Orders</div>
                    <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>
                      Only orders matching your assigned client name are shown here.
                    </div>
                  </div>

                  <div
                    style={{
                      color: '#93c5fd',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {refreshing ? 'Live updating...' : 'Realtime ready'}
                  </div>
                </div>

                {loading ? (
                  <div
                    style={{
                      padding: 24,
                      color: '#94a3b8',
                    }}
                  >
                    Loading client orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div
                    style={{
                      padding: 24,
                      color: '#94a3b8',
                    }}
                  >
                    No orders found for this client yet.
                  </div>
                ) : (
                  <div
                    style={{
                      overflowX: 'auto',
                    }}
                  >
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        minWidth: 980,
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: 'rgba(2,6,23,0.35)',
                            textAlign: 'left',
                          }}
                        >
                          <th style={thStyle}>Load</th>
                          <th style={thStyle}>Client</th>
                          <th style={thStyle}>Pickup</th>
                          <th style={thStyle}>Dropoff</th>
                          <th style={thStyle}>Truck</th>
                          <th style={thStyle}>Status</th>
                          <th style={thStyle}>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const badge = getStatusStyles(order.status || '')

                          return (
                            <tr
                              key={order.id}
                              style={{
                                borderTop: '1px solid rgba(148,163,184,0.1)',
                              }}
                            >
                              <td style={tdStyleStrong}>{order.load_name || order.id}</td>
                              <td style={tdStyle}>{order.client_name || 'N/A'}</td>
                              <td style={tdStyle}>{order.pickup_location || 'N/A'}</td>
                              <td style={tdStyle}>{order.dropoff_location || 'N/A'}</td>
                              <td style={tdStyle}>{order.assigned_truck_id || 'Unassigned'}</td>
                              <td style={tdStyle}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    borderRadius: 999,
                                    padding: '7px 11px',
                                    background: badge.bg,
                                    color: badge.color,
                                    border: `1px solid ${badge.border}`,
                                    fontSize: 12,
                                    fontWeight: 800,
                                  }}
                                >
                                  {badge.label}
                                </span>
                              </td>
                              <td style={tdStyle}>
                                {order.created_at
                                  ? new Date(order.created_at).toLocaleString()
                                  : 'N/A'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    
  )
}

const thStyle: React.CSSProperties = {
  padding: '14px 18px',
  fontSize: 12,
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: 0.7,
  fontWeight: 800,
}

const tdStyle: React.CSSProperties = {
  padding: '16px 18px',
  color: '#e2e8f0',
  fontSize: 14,
}

const tdStyleStrong: React.CSSProperties = {
  padding: '16px 18px',
  color: '#ffffff',
  fontSize: 14,
  fontWeight: 700,
}