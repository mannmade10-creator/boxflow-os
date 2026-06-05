'use client'

import { useEffect, useState } from 'react'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import CannaLayout from '../components/CannaLayout'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    role: 'Budtender',
    status: 'Active',
  })

  async function loadUsers() {
    const { data, error } = await cannaSupabase
      .from('canna_users')
      .select('*')
      .order('created_at', { ascending: false })
console.log('Users Data:', data)
console.log('Users Error:', error)
    if (error) {
      console.error('Users error:', error.message)
      return
    }

    setUsers(data || [])
  }

  async function addUser() {
    const { error } = await cannaSupabase.from('canna_users').insert(form)

    if (error) {
      alert(error.message)
      return
    }

    setForm({
      full_name: '',
      email: '',
      role: 'Budtender',
      status: 'Active',
    })

    setShowForm(false)
    loadUsers()
  }

  async function toggleStatus(user: any) {
    const nextStatus = user.status === 'Active' ? 'Disabled' : 'Active'

    const { error } = await cannaSupabase
      .from('canna_users')
      .update({ status: nextStatus })
      .eq('id', user.id)

    if (error) {
      alert(error.message)
      return
    }

    loadUsers()
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const activeUsers = users.filter((u) => u.status === 'Active').length
  const owners = users.filter((u) => u.role === 'Owner').length
  const managers = users.filter((u) => u.role === 'Manager').length
  const budtenders = users.filter((u) => u.role === 'Budtender').length

  return (
    <CannaLayout title="Users & Roles">
      <div style={grid}>
        <div style={card}>
          <h2 style={value}>{users.length}</h2>
          <p style={label}>Total Users</p>
        </div>

        <div style={card}>
          <h2 style={value}>{activeUsers}</h2>
          <p style={label}>Active Users</p>
        </div>

        <div style={card}>
          <h2 style={value}>{owners}</h2>
          <p style={label}>Owners</p>
        </div>

        <div style={card}>
          <h2 style={value}>{managers + budtenders}</h2>
          <p style={label}>Store Staff</p>
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} style={addBtn}>
        {showForm ? 'Close Form' : '+ Add User'}
      </button>

      {showForm && (
        <div style={formBox}>
          <input
            style={input}
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />

          <input
            style={input}
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <select
            style={input}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Owner</option>
            <option>Manager</option>
            <option>Budtender</option>
            <option>Driver</option>
            <option>Compliance Officer</option>
          </select>

          <select
            style={input}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Active</option>
            <option>Disabled</option>
          </select>

          <button onClick={addUser} style={saveBtn}>
            Save User
          </button>
        </div>
      )}

      <div style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Role</th>
              <th style={th}>Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={td}>{user.full_name}</td>
                <td style={td}>{user.email}</td>
                <td style={td}>
                  <span style={getRoleStyle(user.role)}>{user.role}</span>
                </td>
                <td style={td}>
                  <span style={user.status === 'Active' ? activeBadge : disabledBadge}>
                    {user.status}
                  </span>
                </td>
                <td style={td}>
                  <button onClick={() => toggleStatus(user)} style={actionBtn}>
                    {user.status === 'Active' ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CannaLayout>
  )
}

function getRoleStyle(role: string) {
  if (role === 'Owner') return ownerBadge
  if (role === 'Manager') return managerBadge
  if (role === 'Driver') return driverBadge
  if (role === 'Compliance Officer') return complianceBadge
  return budtenderBadge
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

const label = {
  color: '#94a3b8',
  margin: '8px 0 0'
}

const addBtn = {
  background: '#10b981',
  color: '#00130c',
  border: 'none',
  borderRadius: 14,
  padding: '14px 20px',
  fontWeight: 900,
  marginBottom: 20,
  cursor: 'pointer'
}

const saveBtn = {
  background: '#22c55e',
  color: '#00130c',
  border: 'none',
  borderRadius: 14,
  padding: '14px 20px',
  fontWeight: 900,
  cursor: 'pointer'
}

const actionBtn = {
  background: '#334155',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '8px 12px',
  fontWeight: 800,
  cursor: 'pointer'
}

const formBox = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5,1fr)',
  gap: 14,
  background: '#0f172a',
  border: '1px solid rgba(16,185,129,.25)',
  borderRadius: 20,
  padding: 20,
  marginBottom: 24
}

const input = {
  background: '#020617',
  color: '#fff',
  border: '1px solid rgba(16,185,129,.25)',
  borderRadius: 12,
  padding: 14,
  outline: 'none'
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

const activeBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(16,185,129,.15)',
  color: '#6ee7b7',
  fontWeight: 800
}

const disabledBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(239,68,68,.15)',
  color: '#f87171',
  fontWeight: 800
}

const ownerBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(16,185,129,.15)',
  color: '#6ee7b7',
  fontWeight: 800
}

const managerBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(59,130,246,.15)',
  color: '#93c5fd',
  fontWeight: 800
}

const budtenderBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(245,158,11,.15)',
  color: '#fbbf24',
  fontWeight: 800
}

const driverBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(168,85,247,.15)',
  color: '#c084fc',
  fontWeight: 800
}

const complianceBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(20,184,166,.15)',
  color: '#5eead4',
  fontWeight: 800
}