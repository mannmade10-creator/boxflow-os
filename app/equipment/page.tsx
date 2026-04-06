'use client'

import React, { useEffect, useMemo, useState } from 'react'
import AppSidebar from '@/components/AppSidebar'

type MachineStatus = 'RUNNING' | 'DOWN' | 'MAINTENANCE' | 'IDLE'

type MachineLine = {
  id: string
  lineName: string
  status: MachineStatus
  outputPerHour: number
  efficiency: number
  operator: string
  shift: string
  downtimeMinutes: number
  notes: string
}

const initialMachines: MachineLine[] = [
  { id: 'R8', lineName: 'Machine Line R8', status: 'RUNNING', outputPerHour: 12400, efficiency: 92, operator: 'John D.', shift: 'Day Shift', downtimeMinutes: 0, notes: 'Normal production flow' },
  { id: 'R6', lineName: 'Machine Line R6', status: 'DOWN', outputPerHour: 4300, efficiency: 41, operator: 'T. Miller', shift: 'Day Shift', downtimeMinutes: 37, notes: 'Feed issue detected' },
  { id: 'R4', lineName: 'Machine Line R4', status: 'MAINTENANCE', outputPerHour: 0, efficiency: 0, operator: 'Maintenance Team', shift: 'Night Shift', downtimeMinutes: 58, notes: 'Scheduled service window' },
  { id: 'R2', lineName: 'Machine Line R2', status: 'IDLE', outputPerHour: 0, efficiency: 0, operator: 'Unassigned', shift: 'Standby', downtimeMinutes: 12, notes: 'Awaiting next paper load' },
]

function statusColor(status: MachineStatus) {
  if (status === 'RUNNING') return '#22c55e'
  if (status === 'DOWN') return '#ef4444'
  if (status === 'MAINTENANCE') return '#f59e0b'
  return '#38bdf8'
}

export default function EquipmentPage() {
  const [machines, setMachines] = useState<MachineLine[]>(initialMachines)
  const [selectedId, setSelectedId] = useState('R8')

  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(m => {
        if (m.status === 'RUNNING') return { ...m, efficiency: Math.max(85, Math.min(99, m.efficiency + Math.floor(Math.random() * 5 - 2))), outputPerHour: Math.max(10000, m.outputPerHour + Math.floor(Math.random() * 401 - 200)) }
        if (m.status === 'DOWN') return { ...m, downtimeMinutes: m.downtimeMinutes + 1 }
        return m
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const summary = useMemo(() => ({
    running: machines.filter(m => m.status === 'RUNNING').length,
    down: machines.filter(m => m.status === 'DOWN').length,
    maintenance: machines.filter(m => m.status === 'MAINTENANCE').length,
    idle: machines.filter(m => m.status === 'IDLE').length,
  }), [machines])

  const selected = machines.find(m => m.id === selectedId) || machines[0]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'radial-gradient(circle at top, #0b1d4d 0%, #04112b 45%, #030b1d 100%)', padding: 20, gap: 24 }}>
      <AppSidebar active="equipment" />
      <main style={{ flex: 1, color: 'white', minWidth: 0 }}>
        <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 10 }}>Equipment Dashboard</div>
        <h1 style={{ fontSize: 34, marginBottom: 20, fontWeight: 800, color: '#fff' }}>Equipment Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
          <section style={{ display: 'grid', gap: 18 }}>
            {machines.map(machine => (
              <div key={machine.id} onClick={() => setSelectedId(machine.id)} style={{ background: 'linear-gradient(180deg, rgba(10,24,58,0.98) 0%, rgba(8,20,47,0.98) 100%)', padding: 18, borderRadius: 18, border: '1px solid ' + statusColor(machine.status), cursor: 'pointer', boxShadow: selectedId === machine.id ? '0 0 28px ' + statusColor(machine.status) + '45' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <img src={'/machines/' + machine.id.toLowerCase() + '.png'} alt={machine.lineName} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, border: '2px solid rgba(148,163,184,0.3)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <h3 style={{ margin: 0, fontSize: 22, color: '#fff' }}>{machine.lineName}</h3>
                </div>
                  <div style={{ background: statusColor(machine.status), color: machine.status === 'DOWN' ? 'white' : '#04112b', padding: '6px 12px', borderRadius: 999, fontWeight: 900, fontSize: 12 }}>{machine.status}</div>
                </div>
                <div style={{ lineHeight: 1.85, color: '#dbe5f4' }}>
                  <div>Operator: {machine.operator}</div>
                  <div>Shift: {machine.shift}</div>
                  <div>Output: {machine.outputPerHour.toLocaleString()} sheets/hr</div>
                  <div>Efficiency: {machine.efficiency}%</div>
                  <div>Downtime: {machine.downtimeMinutes} min</div>
                  <div>Notes: {machine.notes}</div>
                </div>
              </div>
            ))}
          </section>
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'linear-gradient(180deg, rgba(10,24,58,0.98) 0%, rgba(8,20,47,0.98) 100%)', padding: 18, borderRadius: 18, border: '1px solid #334155' }}>
              <h3 style={{ marginTop: 0, color: '#fff' }}>Equipment Summary</h3>
              <div style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #334155', background: '#08142f', color: '#dbe5f4', marginBottom: 10 }}>Running: {summary.running}</div>
              <div style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #ef4444', background: '#08142f', color: '#dbe5f4', marginBottom: 10 }}>Down: {summary.down}</div>
              <div style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #f59e0b', background: '#08142f', color: '#dbe5f4', marginBottom: 10 }}>Maintenance: {summary.maintenance}</div>
              <div style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #38bdf8', background: '#08142f', color: '#dbe5f4' }}>Idle: {summary.idle}</div>
            </div>
            <div style={{ background: 'linear-gradient(180deg, rgba(10,24,58,0.98) 0%, rgba(8,20,47,0.98) 100%)', padding: 18, borderRadius: 18, border: '1px solid #334155' }}>
              <h3 style={{ marginTop: 0, color: '#fff' }}>Selected Line</h3>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{selected.lineName}</div>
              <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: 999, background: statusColor(selected.status), color: selected.status === 'DOWN' ? 'white' : '#04112b', fontWeight: 900, marginBottom: 12 }}>{selected.status}</div>
              <div style={{ color: '#dbe5f4', lineHeight: 1.9 }}>
                <div>Operator: {selected.operator}</div>
                <div>Output: {selected.outputPerHour.toLocaleString()} sheets/hr</div>
                <div>Efficiency: {selected.efficiency}%</div>
                <div>Downtime: {selected.downtimeMinutes} min</div>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(180deg, rgba(10,24,58,0.98) 0%, rgba(8,20,47,0.98) 100%)', padding: 18, borderRadius: 18, border: '1px solid #334155' }}>
              <h3 style={{ marginTop: 0, color: '#fff' }}>System Alerts</h3>
              <div style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #22c55e', background: '#08142f', color: '#dbe5f4', marginBottom: 10 }}>R8 line stable</div>
              <div style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #ef4444', background: '#08142f', color: '#dbe5f4', marginBottom: 10 }}>R6 feed issue detected</div>
              <div style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid #f59e0b', background: '#08142f', color: '#dbe5f4' }}>R4 maintenance in progress</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}