'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Notification = {
  id: number
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  time: string
  read: boolean
}

const NOTIFICATION_EVENTS = [
  { type: 'success', message: 'Order delivered successfully — Retail Packaging Co.' },
  { type: 'warning', message: 'TRK-201 route deviation detected — 1.2 miles off course.' },
  { type: 'info', message: 'AI optimized 2 dispatch routes — saving 34 minutes total.' },
  { type: 'error', message: 'Machine R6 feed issue detected — maintenance required.' },
  { type: 'success', message: 'Driver Angela Brooks checked in — ready for dispatch.' },
  { type: 'warning', message: 'Inventory low: Corrugated board at 12% — reorder needed.' },
  { type: 'info', message: 'New order received from Amazon Vendor — ORD-1012.' },
  { type: 'success', message: 'Fleet sync complete — 8 trucks updated.' },
]

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [toasts, setToasts] = useState<Notification[]>([])
  const unread = notifications.filter(n => !n.read).length

  useEffect(() => {
    const channel = supabase.channel('notifications-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        const event = payload.eventType
        let message = 'Order updated'
        let type: Notification['type'] = 'info'

        if (event === 'INSERT') {
          message = 'New order created in the system'
          type = 'success'
        } else if (event === 'UPDATE') {
          const status = (payload.new as any)?.status || ''
          if (status.toLowerCase().includes('deliver')) {
            message = 'Order marked as delivered'
            type = 'success'
          } else if (status.toLowerCase().includes('transit')) {
            message = 'Order now in transit'
            type = 'info'
          } else {
            message = 'Order status updated to: ' + status
            type = 'info'
          }
        }

        addNotification(message, type)
      })
      .subscribe()

    const demoInterval = setInterval(() => {
      const event = NOTIFICATION_EVENTS[Math.floor(Math.random() * NOTIFICATION_EVENTS.length)]
      addNotification(event.message, event.type as Notification['type'])
    }, 25000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(demoInterval)
    }
  }, [])

  function addNotification(message: string, type: Notification['type']) {
    const notif: Notification = {
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString(),
      read: false,
    }
    setNotifications(prev => [notif, ...prev].slice(0, 20))
    setToasts(prev => [notif, ...prev].slice(0, 3))
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== notif.id))
    }, 4000)
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  function notifColor(type: Notification['type']) {
    if (type === 'success') return { bg: 'rgba(20,83,45,0.4)', border: 'rgba(74,222,128,0.3)', color: '#bbf7d0', dot: '#22c55e' }
    if (type === 'warning') return { bg: 'rgba(120,53,15,0.4)', border: 'rgba(251,191,36,0.3)', color: '#fde68a', dot: '#f59e0b' }
    if (type === 'error') return { bg: 'rgba(127,29,29,0.4)', border: 'rgba(248,113,113,0.3)', color: '#fecaca', dot: '#ef4444' }
    return { bg: 'rgba(30,64,175,0.4)', border: 'rgba(96,165,250,0.3)', color: '#bfdbfe', dot: '#3b82f6' }
  }

  return (
    <>
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
        {toasts.map(toast => {
          const c = notifColor(toast.type)
          return (
            <div key={toast.id} style={{ background: c.bg, border: '1px solid ' + c.border, borderRadius: 14, padding: '14px 18px', maxWidth: 360, display: 'flex', alignItems: 'flex-start', gap: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', animation: 'slideIn 0.3s ease' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0, marginTop: 4, boxShadow: '0 0 8px ' + c.dot }} />
              <div>
                <div style={{ color: c.color, fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>{toast.message}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>{toast.time}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(!open)} style={{ position: 'relative', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, padding: '8px 12px', cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
          🔔
          {unread > 0 && (
            <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              {unread > 9 ? '9+' : unread}
            </div>
          )}
        </button>

        {open && (
          <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 380, background: 'rgba(10,15,30,0.98)', border: '1px solid rgba(148,163,184,0.16)', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)', zIndex: 1000, overflow: 'hidden' }}>
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 15 }}>Notifications {unread > 0 && <span style={{ background: '#ef4444', color: '#fff', borderRadius: 999, padding: '2px 7px', fontSize: 11, marginLeft: 6 }}>{unread}</span>}</div>
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Mark all read</button>
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#64748b' }}>No notifications yet</div>
              ) : notifications.map(notif => {
                const c = notifColor(notif.type)
                return (
                  <div key={notif.id} style={{ padding: '14px 18px', borderBottom: '1px solid rgba(148,163,184,0.06)', background: notif.read ? 'transparent' : 'rgba(37,99,235,0.05)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0, marginTop: 5 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: notif.read ? '#94a3b8' : '#e2e8f0', fontSize: 13, lineHeight: 1.4, fontWeight: notif.read ? 400 : 600 }}>{notif.message}</div>
                      <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>{notif.time}</div>
                    </div>
                    {!notif.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 6 }} />}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}