'use client'

import { useEffect, useState } from 'react'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import CannaLayout from '../components/CannaLayout'

export default function CustomersPage() {
const [customers, setCustomers] = useState<any[]>([])

async function loadCustomers() {
const { data, error } = await cannaSupabase
.from('canna_customers')
.select('*')
.order('created_at', { ascending: false })


if (error) {
  console.error(error)
  return
}

setCustomers(data || [])


}

useEffect(() => {
loadCustomers()
}, [])

return ( <CannaLayout title="Customer CRM"> <div style={statsGrid}> <div style={card}> <h2 style={value}>{customers.length}</h2> <p style={label}>Total Customers</p> </div>


    <div style={card}>
      <h2 style={value}>
        {customers.filter(c => c.vip_status).length}
      </h2>
      <p style={label}>VIP Members</p>
    </div>

    <div style={card}>
      <h2 style={value}>
        {customers.reduce((sum,c)=>sum+(c.loyalty_points||0),0)}
      </h2>
      <p style={label}>Loyalty Points</p>
    </div>
  </div>

  <div style={tableWrap}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={th}>Customer Name</th>
          <th style={th}>Phone</th>
          <th style={th}>Email</th>
          <th style={th}>Points</th>
          <th style={th}>Status</th>
        </tr>
      </thead>

      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td style={td}>{customer.full_name}</td>
            <td style={td}>{customer.phone}</td>
            <td style={td}>{customer.email}</td>
            <td style={td}>{customer.loyalty_points}</td>
            <td style={td}>
              <span
                style={{
                  padding:'6px 10px',
                  borderRadius:999,
                  background: customer.vip_status
                    ? 'rgba(16,185,129,.15)'
                    : 'rgba(148,163,184,.15)',
                  color: customer.vip_status
                    ? '#6ee7b7'
                    : '#cbd5e1',
                  fontWeight:800
                }}
              >
                {customer.vip_status ? 'VIP' : 'Standard'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</CannaLayout>


)
}

const statsGrid = {
display:'grid',
gridTemplateColumns:'repeat(3,1fr)',
gap:18,
marginBottom:24
}

const card = {
background:'#0f172a',
border:'1px solid rgba(16,185,129,.25)',
borderRadius:20,
padding:24
}

const value = {
color:'#6ee7b7',
fontSize:36,
fontWeight:900,
margin:0
}

const label = {
color:'#94a3b8'
}

const tableWrap = {
background:'#0f172a',
border:'1px solid rgba(16,185,129,.25)',
borderRadius:20,
overflow:'hidden'
}

const th = {
textAlign:'left' as const,
padding:16,
color:'#6ee7b7',
borderBottom:'1px solid rgba(255,255,255,.1)'
}

const td = {
padding:16,
color:'#cbd5e1',
borderBottom:'1px solid rgba(255,255,255,.08)'
}
