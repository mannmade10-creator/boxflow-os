'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Profile = {
  id: string
  email: string | null
  role: string
}

type Employee = {
  id: string
  name?: string | null
  role?: string | null
  status?: string | null
  created_at?: string | null
}

type Shift = {
  id: string
  employee_id?: string | null
  shift_date?: string | null
  status?: string | null
}

export default function HRPage() {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function loadHR() {
      setLoading(true)
      setError('')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('id', user.id)
        .single<Profile>()

      if (profileError || !profile) {
        setAuthorized(false)
        setError('Profile not found or access denied.')
        setLoading(false)
        return
      }

      setUserRole(profile.role)

      if (!['admin', 'hr_manager', 'supervisor'].includes(profile.role)) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      setAuthorized(true)

      const canViewEmployees = ['admin', 'hr_manager'].includes(profile.role)

      if (canViewEmployees) {
        const { data: employeeRows, error: employeeError } = await supabase
          .from('employees')
          .select('id, name, role, status, created_at')
          .order('created_at', { ascending: false })

        if (employeeError) {
          setError('Unable to load employees.')
        } else {
          setEmployees(employeeRows || [])
        }
      }

      const { data: shiftRows, error: shiftError } = await supabase
        .from('shifts')
        .select('id, employee_id, shift_date, status')
        .order('shift_date', { ascending: true })

      if (shiftError) {
        setError((prev) => prev || 'Unable to load shifts.')
      } else {
        setShifts(shiftRows || [])
      }

      setLoading(false)
    }

    loadHR()
  }, [])

  const activeEmployees = employees.filter((e) => e.status === 'active').length
  const activeShifts = shifts.filter((s) => s.status === 'active').length

  if (loading) {
    return (
      <main style={container}>
        <div style={card}>
          <h1 style={title}>HR & Payroll</h1>
          <p style={bodyStyle}>Checking permissions...</p>
        </div>
      </main>
    )
  }

  if (!authorized) {
    return (
      <main style={container}>
        <div style={card}>
          <h1 style={title}>Access Restricted</h1>
          <p style={bodyStyle}>
            This HR area is restricted to authorized personnel only.
          </p>
          <p style={mutedStyle}>
            Allowed roles: admin, hr_manager, supervisor
          </p>
        </div>
      </main>
    )
  }

  return (
    <main style={container}>
      <div style={{ marginBottom: 22 }}>
        <div style={badgeStyle}>SECURE HR ACCESS</div>
        <h1 style={title}>HR & Payroll Dashboard</h1>
        <p style={bodyStyle}>
          Restricted workforce operations, staffing visibility, and protected HR summary data.
        </p>
        <p style={mutedStyle}>Signed in role: {userRole}</p>
      </div>

      {error ? (
        <div style={{ ...card, border: '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ color: '#fca5a5', fontWeight: 800 }}>{error}</div>
        </div>
      ) : null}

      <div style={kpiGrid}>
        <KpiCard title="Employees" value={String(employees.length)} accent="#38bdf8" />
        <KpiCard title="Active Staff" value={String(activeEmployees)} accent="#22c55e" />
        <KpiCard title="Shifts" value={String(shifts.length)} accent="#a855f7" />
        <KpiCard title="Active Shifts" value={String(activeShifts)} accent="#facc15" />
      </div>

      <div style={twoCol}>
        <section style={card}>
          <h2 style={sectionTitle}>Employee Roster</h2>
          {['admin', 'hr_manager'].includes(userRole) ? (
            employees.length > 0 ? (
              employees.map((emp) => (
                <div key={emp.id} style={rowStyle}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{emp.name || 'Unnamed Employee'}</div>
                    <div style={mutedStyle}>{emp.role || 'No role assigned'}</div>
                  </div>
                  <div
                    style={{
                      color: emp.status === 'active' ? '#22c55e' : '#f87171',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                    }}
                  >
                    {emp.status || 'unknown'}
                  </div>
                </div>
              ))
            ) : (
              <p style={bodyStyle}>No employee records available.</p>
            )
          ) : (
            <p style={bodyStyle}>
              Your role can view staffing summaries, but not full employee records.
            </p>
          )}
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Shift Overview</h2>
          {shifts.length > 0 ? (
            shifts.map((shift) => (
              <div key={shift.id} style={rowStyle}>
                <div>
                  <div style={{ fontWeight: 800 }}>
                    {shift.shift_date || 'No shift date'}
                  </div>
                  <div style={mutedStyle}>Employee ID: {shift.employee_id || 'N/A'}</div>
                </div>
                <div
                  style={{
                    color: shift.status === 'active' ? '#22c55e' : '#facc15',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  {shift.status || 'unknown'}
                </div>
              </div>
            ))
          ) : (
            <p style={bodyStyle}>No shift records available.</p>
          )}
        </section>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>Payroll Access</h2>
        <p style={bodyStyle}>
          Payroll details should only be exposed through protected HR-specific tables and
          only to admin or hr_manager users.
        </p>
        <p style={mutedStyle}>
          This page intentionally shows summary-level information only.
        </p>
      </div>
    </main>
  )
}

function KpiCard({
  title,
  value,
  accent,
}: {
  title: string
  value: string
  accent: string
}) {
  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
        padding: '18px',
        boxShadow: `0 0 20px ${accent}18`,
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: '13px' }}>{title}</div>
      <div
        style={{
          fontSize: '30px',
          fontWeight: 900,
          color: accent,
          marginTop: '8px',
        }}
      >
        {value}
      </div>
    </div>
  )
}

const container: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #020617 0%, #0b1220 45%, #111827 100%)',
  color: 'white',
  padding: '24px',
}

const card: React.CSSProperties = {
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '18px',
  padding: '20px',
}

const title: React.CSSProperties = {
  fontSize: '34px',
  fontWeight: 900,
  margin: 0,
}

const sectionTitle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 900,
  marginTop: 0,
  marginBottom: '14px',
}

const bodyStyle: React.CSSProperties = {
  color: '#cbd5e1',
  lineHeight: 1.8,
  fontSize: '16px',
}

const mutedStyle: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '14px',
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(34,197,94,0.18)',
  color: '#86efac',
  padding: '6px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 900,
  marginBottom: '12px',
}

const kpiGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '16px',
  marginBottom: '20px',
}

const twoCol: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '20px',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
}