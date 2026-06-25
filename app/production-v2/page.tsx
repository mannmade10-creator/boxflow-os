'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type CorrugatorOrder = {
  id?: string | number
  order_id?: string
  program?: string
  status?: string
  length?: number
  total_length?: number
  set_number?: number
  flute?: string
  roll_width?: number
  papers_required?: number
  priority?: number
}

type CorrugatorRoll = {
  id?: string | number
  station?: string
  position?: string
  rem_paper?: number
  grade?: string
  roll_id?: string
  diameter?: number
  next_splice?: number
  to_core?: number
  shortage?: number
}

type CorrugatorPerformance = {
  run_time_sec?: number
  down_time_sec?: number
  total_length?: number
  shift_number?: number
  elapsed_time_sec?: number
  flute_c_length?: number
  flute_b_length?: number
  waste_trim?: number
  waste_corrug?: number
  num_changes?: number
}

function useSupabaseTable<T extends Record<string, unknown> = Record<string, unknown>>(table: string, query = '') {
  const [data, setData] = useState<T[]>([])
  useEffect(() => {
    let q = supabase.from(table).select('*')
    // Re-apply the same ordering the page relied on
    q = q.order('priority', { ascending: true, nullsFirst: false })
    if (query.includes('order=created_at.desc')) {
      q = supabase.from(table).select('*').order('created_at', { ascending: false })
    }
    if (query.includes('limit=1')) {
      q = q.limit(1)
    }
    q.then(({ data, error }) => {
      if (error) {
        console.error(`Failed to fetch ${table}:`, error.message)
        setData([])
      } else {
        setData(data || [])
      }
    })
  }, [table, query])
  return data
}

export default function ProductionV2() {
  const orders = useSupabaseTable<CorrugatorOrder>('corrugator_orders', 'select=*')
  const rolls = useSupabaseTable<CorrugatorRoll>('corrugator_rolls', 'select=*')
  const perf = useSupabaseTable<CorrugatorPerformance>('corrugator_performance', 'select=*&order=created_at.desc&limit=1')

  const [now, setNow] = useState(new Date())
  const [authChecked, setAuthChecked] = useState(false)
  const [userName, setUserName] = useState('')
  const [role, setRole] = useState<'admin' | 'management' | 'production' | null>(null)
  const [station, setStation] = useState('SF1 - B Flute')
  const [downtimeReason, setDowntimeReason] = useState('')
  const [showDowntime, setShowDowntime] = useState(false)
  const [speed, setSpeed] = useState(539)
  const [activeTab, setActiveTab] = useState('queue')

  // Pull the real logged-in user and their role from profiles.
  // No name/role picker — this reflects who they actually are.
  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAuthChecked(true)
        return
      }
      setUserName(user.email || 'Unknown')
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, approved')
        .eq('id', user.id)
        .single()
      if (error || !profile || !profile.approved) {
        setRole(null)
      } else if (
        profile.role === 'admin' ||
        profile.role === 'management' ||
        profile.role === 'production'
      ) {
        setRole(profile.role)
      } else {
        setRole(null)
      }
      setAuthChecked(true)
    }
    loadUser()
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const isManager = role === 'admin' || role === 'management'
  const canViewFloor = role === 'admin' || role === 'management' || role === 'production'

  const currentPerf = perf[0] || {}
  const currentOrder = orders.find(o => o.status === 'PROC')
  const nextOrder = orders.find(o => o.status === 'XMTD' && o.priority === (currentOrder?.priority || 0) + 1)
  const remWE = rolls.find(r => r.station === 'B Flute' && r.position === 'Left')?.rem_paper || 0
  const remTM = remWE / (speed || 539) / 60

  function timeToFinish(remPaper: number) {
    const mins = (remPaper || 0) / (speed || 539)
    const h = Math.floor(mins / 60)
    const m = Math.floor(mins % 60)
    const s = Math.floor((mins * 60) % 60)
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`
  }

  function formatSeconds(totalSec: number | null | undefined) {
    if (!totalSec) return '00:00:00'
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = Math.floor(totalSec % 60)
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
  }

  const statusColor: Record<'PROC' | 'XMTD' | 'HIST' | 'RXMT', string> = {
    PROC: '#22c55e', XMTD: '#4f8ef7', HIST: '#475569', RXMT: '#f59e0b'
  }
  const fluteColor: Record<'B' | 'C' | 'BC', string> = { B: '#4f8ef7', C: '#a855f7', BC: '#f59e0b' }

  // Still checking auth/role — avoid flashing the wrong screen
  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: '#020812', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontFamily: 'Inter,Arial,sans-serif' }}>
        Loading...
      </div>
    )
  }

  // Logged in, but not an approved admin/management/production role.
  // Replaces the old name+role picker entirely — there is nothing to "pick,"
  // access is determined by the account, not by what someone types in.
  if (!canViewFloor) {
    return (
      <div style={{ minHeight: '100vh', background: '#020812', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,Arial,sans-serif' }}>
        <div style={{ background: '#070f1f', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: 40, width: 380, textAlign: 'center' as const }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#ef4444', marginBottom: 10 }}>Access Restricted</div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
            Your account isn&apos;t authorized for the Corrugator Production System. Contact a manager or admin if you believe this is incorrect.
          </div>
        </div>
      </div>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#020812', color: '#e2e8f0', fontFamily: 'Inter,Arial,sans-serif' }}>
      <header style={{ background: '#070f1f', borderBottom: '1px solid rgba(168,85,247,0.2)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>B</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#a855f7', letterSpacing: 1 }}>BoxFlow OS — Production</div>
            <div style={{ fontSize: 9, color: '#475569' }}>Oklahoma Corrugator • {station}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const }}>User</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{userName}</div>
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const }}>Role</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#a855f7' }}>{role?.toUpperCase()}</div>
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const }}>Time</div>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#4f8ef7' }}>{now.toLocaleTimeString()}</div>
          </div>
          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>● RUNNING</span>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login' }}
            style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: 20 }}>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Speed', value: `${speed} FPM`, color: '#22c55e', sub: 'DB Cruise Active' },
            { label: 'REM WE', value: remWE.toLocaleString(), color: '#4f8ef7', sub: 'Linear feet remaining' },
            { label: 'REM TM', value: remTM.toFixed(1) + ' min', color: '#f59e0b', sub: 'Time to splice' },
            { label: 'Run Time', value: formatSeconds(currentPerf.run_time_sec), color: '#22c55e', sub: 'This shift' },
            { label: 'Down Time', value: formatSeconds(currentPerf.down_time_sec), color: '#ef4444', sub: 'This shift' },
            { label: 'Total Footage', value: (currentPerf.total_length || 0).toLocaleString(), color: '#a855f7', sub: 'Linear feet today' },
          ].map(k => (
            <div key={k.label} style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 14, borderTop: `3px solid ${k.color}` }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 4 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: '#334155' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Current & Next Order */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          <div style={{ background: '#070f1f', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 12 }}>● Current Order — PROC</div>
            {currentOrder ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>#{currentOrder.program}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700, background: `${fluteColor[currentOrder.flute]}22`, color: fluteColor[currentOrder.flute] }}>{currentOrder.flute} Flute</span>
                </div>
                {[
                  ['Roll Width', `${currentOrder.roll_width}"`],
                  ['Length', currentOrder.length?.toLocaleString() + ' ft'],
                  ['Total', currentOrder.total_length?.toLocaleString() + ' ft'],
                  ['Set', `#${currentOrder.set_number}`],
                  ['Papers', currentOrder.papers_required],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                    <span style={{ fontSize: 12, color: '#475569' }}>{l}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, marginBottom: 4 }}>⏱ Estimated Completion</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>{timeToFinish(currentOrder.length)}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>Based on {speed} FPM current speed</div>
                </div>
              </>
            ) : <div style={{ color: '#475569', fontSize: 13 }}>No order in progress</div>}
          </div>

          <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.25)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 10, color: '#4f8ef7', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 12 }}>→ Next Order — XMTD</div>
            {nextOrder ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>#{nextOrder.program}</span>
                  <span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700, background: `${fluteColor[nextOrder.flute]}22`, color: fluteColor[nextOrder.flute] }}>{nextOrder.flute} Flute</span>
                </div>
                {[
                  ['Roll Width', `${nextOrder.roll_width}"`],
                  ['Length', nextOrder.length?.toLocaleString() + ' ft'],
                  ['Set', `#${nextOrder.set_number}`],
                  ['Papers', nextOrder.papers_required],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                    <span style={{ fontSize: 12, color: '#475569' }}>{l}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, color: '#4f8ef7', fontWeight: 700, marginBottom: 4 }}>⏱ Starts In</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#4f8ef7' }}>{timeToFinish(currentOrder?.length)}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>After current order completes</div>
                </div>
              </>
            ) : <div style={{ color: '#475569', fontSize: 13 }}>No next order queued</div>}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid rgba(99,132,255,0.1)', paddingBottom: 0 }}>
          {['queue', 'rolls', 'performance', 'downtime'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '10px 18px', fontSize: 11, fontWeight: 700, cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: activeTab === tab ? '2px solid #a855f7' : '2px solid transparent', color: activeTab === tab ? '#a855f7' : '#475569', textTransform: 'uppercase' as const, letterSpacing: 1 }}>
              {tab === 'queue' ? 'Order Queue' : tab === 'rolls' ? 'Roll Stock' : tab === 'performance' ? 'Performance' : 'Downtime Log'}
            </button>
          ))}
        </div>

        {/* Order Queue Tab */}
        {activeTab === 'queue' && (
          <div style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' as const }}>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' as const }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(99,132,255,0.15)' }}>
                    {['ID', 'Program', 'Status', 'Length', 'Total', 'Set', 'Flute', 'Width', 'Papers Required', 'Est. Time'].map(h => (
                      <th key={h} style={{ padding: '12px 14px', textAlign: 'left' as const, fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1, whiteSpace: 'nowrap' as const }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr><td colSpan={10} style={{ padding: 20, textAlign: 'center' as const, color: '#475569' }}>No orders in the queue.</td></tr>
                  )}
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(99,132,255,0.06)', background: o.status === 'PROC' ? 'rgba(34,197,94,0.05)' : 'transparent' }}>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>{o.order_id}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: '#fff' }}>{o.program}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${statusColor[o.status]}22`, color: statusColor[o.status] }}>{o.status}</span>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#cbd5e1', fontFamily: 'monospace' }}>{o.length?.toLocaleString()}</td>
                      <td style={{ padding: '10px 14px', color: '#cbd5e1', fontFamily: 'monospace' }}>{o.total_length?.toLocaleString()}</td>
                      <td style={{ padding: '10px 14px', color: '#64748b' }}>{o.set_number}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, background: `${fluteColor[o.flute]}22`, color: fluteColor[o.flute] }}>{o.flute}</span>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{o.roll_width}"</td>
                      <td style={{ padding: '10px 14px', color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 }}>{o.papers_required}</td>
                      <td style={{ padding: '10px 14px', color: o.status === 'PROC' ? '#22c55e' : '#475569', fontWeight: o.status === 'PROC' ? 700 : 400 }}>
                        {o.status === 'HIST' ? '—' : timeToFinish(o.length)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Roll Stock Tab */}
        {activeTab === 'rolls' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
            {rolls.length === 0 && (
              <div style={{ color: '#475569', fontSize: 13, padding: 20 }}>No roll stock data available.</div>
            )}
            {rolls.map(r => {
              const pct = Math.min(100, ((r.rem_paper || 0) / 90000) * 100)
              const timeLeft = timeToFinish(r.rem_paper)
              return (
                <div key={r.id} style={{ background: '#070f1f', border: `1px solid ${r.shortage > 0 ? 'rgba(239,68,68,0.3)' : 'rgba(99,132,255,0.15)'}`, borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#4f8ef7', marginBottom: 2 }}>{r.roll_id}</div>
                      <div style={{ fontSize: 11, color: '#475569' }}>{r.station} — {r.position}</div>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 5, fontSize: 11, fontWeight: 700, background: 'rgba(168,85,247,0.15)', color: '#a855f7' }}>{r.grade}</span>
                  </div>
                  {[
                    ['Diameter', `${r.diameter}" inches`],
                    ['Next Splice', r.next_splice?.toLocaleString() + ' ft'],
                    ['To Core', r.to_core?.toLocaleString() + ' ft'],
                    ['REM Paper', r.rem_paper?.toLocaleString() + ' ft'],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(99,132,255,0.06)' }}>
                      <span style={{ fontSize: 11, color: '#475569' }}>{l}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const }}>Remaining</span>
                      <span style={{ fontSize: 10, color: pct < 30 ? '#ef4444' : '#22c55e', fontWeight: 700 }}>{pct.toFixed(0)}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(99,132,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: pct < 30 ? '#ef4444' : pct < 60 ? '#f59e0b' : '#22c55e', borderRadius: 999 }} />
                    </div>
                    <div style={{ fontSize: 11, color: '#4f8ef7', fontWeight: 700, marginTop: 8 }}>⏱ {timeLeft} remaining at {speed} FPM</div>
                    {r.shortage > 0 && (
                      <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, fontSize: 11, color: '#ef4444', fontWeight: 700 }}>
                        ⚠ Shortage: {r.shortage?.toLocaleString()} ft
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 16 }}>Shift {currentPerf.shift_number || '—'} — Time Breakdown</div>
              {[
                { label: 'Elapsed Time', value: formatSeconds(currentPerf.elapsed_time_sec), color: '#fff' },
                { label: 'Run Time', value: formatSeconds(currentPerf.run_time_sec), color: '#22c55e' },
                { label: 'Down Time', value: formatSeconds(currentPerf.down_time_sec), color: '#ef4444' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(99,132,255,0.07)' }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{r.label}</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: r.color, fontFamily: 'monospace' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, marginBottom: 8 }}>EFFICIENCY</div>
                <div style={{ height: 10, background: 'rgba(99,132,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${currentPerf.run_time_sec && currentPerf.elapsed_time_sec
                      ? Math.min(100, (currentPerf.run_time_sec / currentPerf.elapsed_time_sec) * 100)
                      : 0}%`,
                    background: '#22c55e', borderRadius: 999
                  }} />
                </div>
                <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 700, marginTop: 6 }}>
                  {currentPerf.run_time_sec && currentPerf.elapsed_time_sec
                    ? Math.round((currentPerf.run_time_sec / currentPerf.elapsed_time_sec) * 100)
                    : 0}% Run Efficiency This Shift
                </div>
              </div>
            </div>
            <div style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 16 }}>Production Output</div>
              {[
                { label: 'Speed (FPM)', value: `${speed}`, color: '#22c55e' },
                { label: 'C Flute Length', value: (currentPerf.flute_c_length || 0).toLocaleString(), color: '#a855f7' },
                { label: 'B Flute Length', value: (currentPerf.flute_b_length || 0).toLocaleString(), color: '#4f8ef7' },
                { label: 'Total Length', value: (currentPerf.total_length || 0).toLocaleString(), color: '#fff' },
                { label: 'Waste % Trim', value: `${currentPerf.waste_trim ?? 0}%`, color: '#f59e0b' },
                { label: 'Waste % Corrug', value: `${currentPerf.waste_corrug ?? 0}%`, color: '#f59e0b' },
                { label: 'Number of Changes', value: `${currentPerf.num_changes ?? 0}`, color: '#94a3b8' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(99,132,255,0.06)' }}>
                  <span style={{ fontSize: 12, color: '#64748b' }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: r.color, fontFamily: 'monospace' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Downtime Tab */}
        {activeTab === 'downtime' && (
          <div>
            <div style={{ background: '#070f1f', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 14 }}>Log Downtime Event</div>
              <select value={downtimeReason} onChange={e => setDowntimeReason(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid rgba(99,132,255,0.2)', background: 'rgba(7,15,31,0.8)', color: '#e2e8f0', fontSize: 13, outline: 'none', marginBottom: 12 }}>
                <option value="">Select reason...</option>
                <option>Paper Break</option>
                <option>Splice</option>
                <option>Order Change</option>
                <option>Mechanical</option>
                <option>Electrical</option>
                <option>Scheduled Break</option>
                <option>Washup</option>
                <option>No Orders</option>
                <option>Quality Issue</option>
                <option>Other</option>
              </select>
              <button onClick={() => { if (downtimeReason) { setShowDowntime(true); setTimeout(() => setShowDowntime(false), 3000) } }}
                style={{ width: '100%', padding: 12, borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
                Log Downtime Event
              </button>
              {showDowntime && <div style={{ marginTop: 10, padding: '8px 14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: 12, color: '#22c55e' }}>✅ Downtime logged — {downtimeReason}</div>}
              <div style={{ marginTop: 10, fontSize: 11, color: '#475569' }}>
                Note: this currently records locally only — it does not yet save to the database.
              </div>
            </div>
            <div style={{ background: '#070f1f', border: '1px solid rgba(99,132,255,0.12)', borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 14 }}>Today&apos;s Downtime Summary</div>
              <div style={{ color: '#475569', fontSize: 12 }}>
                Downtime history will appear here once event logging is connected to the database.
              </div>
            </div>
          </div>
        )}

        {/* Speed Control — Manager/Admin Only, based on real role */}
        {isManager && (
          <div style={{ marginTop: 16, background: '#070f1f', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 14, padding: 20 }}>
            <div style={{ fontSize: 10, color: '#a855f7', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 14 }}>🔒 Manager Controls</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, marginBottom: 8 }}>DB CRUISE SPEED: {speed} FPM</div>
                <input type="range" min={200} max={800} step={10} value={speed} onChange={e => setSpeed(parseInt(e.target.value))}
                  style={{ width: '100%' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#334155', marginTop: 4 }}>
                  <span>200 FPM</span><span>500 FPM</span><span>800 FPM</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[300, 400, 500, 600].map(s => (
                  <button key={s} onClick={() => setSpeed(s)}
                    style={{ padding: '8px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: speed === s ? '#a855f7' : 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: speed === s ? '#fff' : '#a855f7' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}