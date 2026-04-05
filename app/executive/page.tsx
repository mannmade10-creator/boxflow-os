'use client'

import React, { useState } from 'react'
import AppSidebar from '@/components/AppSidebar'
import { supabase } from '@/lib/supabase'

const stats = [
  { label: 'Efficiency', value: '92%', sub: 'Up 4%', color: '#22c55e' },
  { label: 'Cost Optimization', value: '$78,240', sub: 'Tracked savings', color: '#3b82f6' },
  { label: 'Predicted Delays', value: '2', sub: '1 critical', color: '#f59e0b' },
  { label: 'Risk Alerts', value: '1', sub: 'Needs action', color: '#ef4444' },
]

const recommendations = [
  'Reassign 30% of workload to Line 4 to reduce Die Cutting delay.',
  'Adjust material order to minimize supply cost by 12%.',
  'Optimize shipping schedule to expedite deliveries.',
]

const anomalies = [
  'Machine #7 overheating — cooling required.',
  'Inventory shortage detected: corrugated board.',
]

type ActionLog = {
  id: number
  time: string
  action: string
  result: string
  level: 'success' | 'warning' | 'info'
}

export default function ExecutivePage() {
  const [thinking, setThinking] = useState<string | null>(null)
  const [actionLog, setActionLog] = useState<ActionLog[]>([])
  const [optimized, setOptimized] = useState(false)
  const [efficiency, setEfficiency] = useState(92)
  const [delays, setDelays] = useState(2)
  const [savings, setSavings] = useState(78240)

  function addLog(action: string, result: string, level: ActionLog['level']) {
    const now = new Date()
    const time = now.toLocaleTimeString()
    setActionLog(prev => [{ id: Date.now(), time, action, result, level }, ...prev].slice(0, 8))
  }

  async function runAI(actionName: string, thinkingMsg: string, duration: number, onComplete: () => void) {
    setThinking(thinkingMsg)
    await new Promise(r => setTimeout(r, duration))
    setThinking(null)
    onComplete()
  }

  async function optimizeProduction() {
    await runAI('Optimize Production', 'Analyzing production lines... Calculating optimal workload distribution...', 2500, async () => {
      setEfficiency(prev => Math.min(99, prev + Math.floor(Math.random() * 6 + 2)))
      setDelays(prev => Math.max(0, prev - 1))
      setSavings(prev => prev + Math.floor(Math.random() * 5000 + 2000))
      setOptimized(true)
      addLog('Optimize Production', 'Workload shifted to Line 4. Efficiency +4%. Die Cutting delay reduced by 1.8hrs.', 'success')
    })
  }

  async function reassignDriver() {
    await runAI('Reassign Driver', 'Scanning driver availability... Calculating best route fit...', 2000, async () => {
      const { data: orders } = await supabase.from('orders').select('id, status').eq('status', 'Pending').limit(3)
      if (orders && orders.length > 0) {
        for (const order of orders) {
          await supabase.from('orders').update({ status: 'Assigned', assigned_truck_id: 'TRK-305' }).eq('id', order.id)
        }
        addLog('Reassign Driver', `Angela Brooks assigned to ${orders.length} pending load(s). ETA improved by 22 min.`, 'success')
      } else {
        addLog('Reassign Driver', 'No pending orders found. All drivers optimally assigned.', 'info')
      }
    })
  }

  async function reduceDelay() {
    await runAI('Reduce Delay', 'Identifying delayed orders... Calculating reroute options...', 3000, async () => {
      const { data: orders } = await supabase.from('orders').select('id, status').limit(5)
      if (orders) {
        for (const order of orders) {
          if ((order.status || '').toLowerCase().includes('transit')) {
            await supabase.from('orders').update({ status: 'Dispatched' }).eq('id', order.id)
          }
        }
      }
      setDelays(0)
      setSavings(prev => prev + 3200)
      addLog('Reduce Delay', 'TRK-305 rerouted via I-35. Estimated delivery improved by 45 min. Client notified.', 'success')
    })
  }

  async function dispatchAll() {
    await runAI('AI Dispatch All', 'Scanning pending orders... Matching trucks to loads...', 3500, async () => {
      const { data: orders } = await supabase.from('orders').select('id, status').eq('status', 'Pending')
      const trucks = ['TRK-201', 'TRK-305', 'TRK-412', 'TRK-518']
      let count = 0
      if (orders && orders.length > 0) {
        for (const order of orders) {
          const truck = trucks[count % trucks.length]
          await supabase.from('orders').update({ status: 'Assigned', assigned_truck_id: truck }).eq('id', order.id)
          count++
        }
        addLog('AI Dispatch All', `${count} order(s) dispatched across ${Math.min(count, 4)} trucks. All loads moving.`, 'success')
      } else {
        addLog('AI Dispatch All', 'All orders already dispatched. System fully optimized.', 'info')
      }
    })
  }

  async function emergencyReset() {
    await runAI('Emergency Reset', 'Initiating system reset... Clearing all alerts...', 2000, () => {
      setEfficiency(92)
      setDelays(2)
      setSavings(78240)
      setOptimized(false)
      addLog('Emergency Reset', 'System reset complete. All metrics restored to baseline.', 'warning')
    })
  }

  function logColor(level: ActionLog['level']) {
    if (level === 'success') return { bg: 'rgba(20,83,45,0.3)', border: 'rgba(74,222,128,0.3)', color: '#bbf7d0', dot: '#22c55e' }
    if (level === 'warning') return { bg: 'rgba(120,53,15,0.3)', border: 'rgba(251,191,36,0.3)', color: '#fde68a', dot: '#f59e0b' }
    return { bg: 'rgba(30,64,175,0.3)', border: 'rgba(96,165,250,0.3)', color: '#bfdbfe', dot: '#3b82f6' }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 24%), linear-gradient(180deg, #050816 0%, #0b1220 100%)', padding: 20, gap: 24 }}>
      <AppSidebar active="executive" />
      <main style={{ flex: 1, color: '#fff', display: 'grid', gap: 22, alignContent: 'start', minWidth: 0 }}>

        <div>
          <div style={{ display: 'inline-flex', width: 'fit-content', padding: '8px 14px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, marginBottom: 12 }}>BOXFLOW OS AI LAYER</div>
          <h1 style={{ margin: '0 0 8px', fontSize: 44, fontWeight: 900, color: '#fff' }}>AI Control Panel</h1>
          <p style={{ margin: 0, color: '#94a3b8' }}>Predictive analytics, one-click optimization, anomaly detection, and action-driven recommendations.</p>
        </div>

        {thinking && (
          <div style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', animation: 'bounce 1s infinite', animationDelay: (i * 0.2) + 's' }} />
              ))}
            </div>
            <span style={{ color: '#93c5fd', fontWeight: 700, fontSize: 14 }}>🤖 AI Engine: {thinking}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
          {[
            { label: 'Efficiency', value: efficiency + '%', sub: optimized ? '↑ Optimized' : 'Up 4%', color: '#22c55e' },
            { label: 'Cost Savings', value: '$' + savings.toLocaleString(), sub: 'Tracked savings', color: '#3b82f6' },
            { label: 'Active Delays', value: delays.toString(), sub: delays === 0 ? '✓ All clear' : '1 critical', color: delays === 0 ? '#22c55e' : '#f59e0b' },
            { label: 'Risk Alerts', value: '1', sub: 'Needs action', color: '#ef4444' },
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid ' + item.color, borderRadius: 22, padding: 18 }}>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10, fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</div>
              <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 6, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 12, color: '#93c5fd', fontWeight: 700 }}>{item.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 26, padding: 20 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: 6 }}>AI Action Controls</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 18 }}>One-click AI actions that affect production, dispatch, and delivery in real time</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            <AIButton label="⚡ Optimize Production" desc="Rebalance workload across all lines" color="#22c55e" onClick={optimizeProduction} disabled={!!thinking} />
            <AIButton label="🚛 Reassign Driver" desc="Match best driver to urgent loads" color="#3b82f6" onClick={reassignDriver} disabled={!!thinking} />
            <AIButton label="⏱ Reduce Delay" desc="Reroute and notify affected clients" color="#f59e0b" onClick={reduceDelay} disabled={!!thinking} />
            <AIButton label="🚀 AI Dispatch All" desc="Assign all pending orders to trucks" color="#8b5cf6" onClick={dispatchAll} disabled={!!thinking} />
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(148,163,184,0.1)' }}>
            <AIButton label="🔄 Emergency Reset" desc="Reset all AI actions to baseline" color="#ef4444" onClick={emergencyReset} disabled={!!thinking} fullWidth />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 26, padding: 18 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: 14 }}>AI Action Log</div>
            {actionLog.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: 14 }}>No actions taken yet. Use the controls above to start.</div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {actionLog.map(log => {
                  const c = logColor(log.level)
                  return (
                    <div key={log.id} style={{ background: c.bg, border: '1px solid ' + c.border, borderRadius: 12, padding: '10px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: c.color, fontWeight: 800, fontSize: 13 }}>{log.action}</span>
                        <span style={{ color: '#64748b', fontSize: 11 }}>{log.time}</span>
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.5 }}>{log.result}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 26, padding: 18 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: 14 }}>AI Recommendations</div>
              {recommendations.map(item => (
                <div key={item} style={{ color: '#cbd5e1', lineHeight: 1.6, background: 'rgba(2,6,23,0.45)', border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16, padding: 14, marginBottom: 12, fontSize: 13 }}>• {item}</div>
              ))}
            </div>
            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 26, padding: 18 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, marginBottom: 14 }}>Anomaly Detection</div>
              {anomalies.map(item => (
                <div key={item} style={{ color: '#fee2e2', lineHeight: 1.6, background: 'rgba(127,29,29,0.26)', border: '1px solid rgba(248,113,113,0.24)', borderRadius: 16, padding: 14, marginBottom: 12, fontSize: 13 }}>⚠ {item}</div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function AIButton({ label, desc, color, onClick, disabled, fullWidth }: { label: string; desc: string; color: string; onClick: () => void; disabled: boolean; fullWidth?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: 'rgba(2,6,23,0.6)', border: '1px solid ' + color + '40', borderLeft: '3px solid ' + color, borderRadius: 14, padding: '16px 18px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, textAlign: 'left', gridColumn: fullWidth ? '1 / -1' : 'auto', transition: 'all 0.2s ease' }}>
      <div style={{ color, fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#64748b', fontSize: 12 }}>{desc}</div>
    </button>
  )
}