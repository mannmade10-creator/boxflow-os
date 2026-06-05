'use client'

import { useEffect, useState } from 'react'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import CannaLayout from '../components/CannaLayout'

export default function DashboardPage() {
const [metrics, setMetrics] = useState({
products: 0,
customers: 0,
sales: 0,
revenue: 0,
compliance: 0,
lowStock: 0
})

async function loadDashboard() {
const [
productsRes,
customersRes,
salesRes,
complianceRes
] = await Promise.all([
cannaSupabase.from('canna_products').select('*'),
cannaSupabase.from('canna_customers').select('*'),
cannaSupabase.from('canna_sales').select('*'),
cannaSupabase.from('canna_compliance').select('*')
])


const products = productsRes.data || []
const customers = customersRes.data || []
const sales = salesRes.data || []
const compliance = complianceRes.data || []

const revenue = sales.reduce(
  (sum, sale) => sum + Number(sale.total || 0),
  0
)

const lowStock = products.filter(
  (p) =>
    p.status === 'Low Stock' ||
    Number(p.quantity) < 10
).length

setMetrics({
  products: products.length,
  customers: customers.length,
  sales: sales.length,
  revenue,
  compliance: compliance.length,
  lowStock
})


}

useEffect(() => {
loadDashboard()
}, [])

return ( <CannaLayout title="Executive Dashboard"> <div style={grid}>
<MetricCard
title="Revenue"
value={`$${metrics.revenue}`}
/>


    <MetricCard
      title="Products"
      value={metrics.products}
    />

    <MetricCard
      title="Customers"
      value={metrics.customers}
    />

    <MetricCard
      title="Sales"
      value={metrics.sales}
    />

    <MetricCard
      title="Compliance Items"
      value={metrics.compliance}
    />

    <MetricCard
      title="Low Stock"
      value={metrics.lowStock}
    />
  </div>
</CannaLayout>


)
}

function MetricCard({
title,
value
}: {
title: string
value: string | number
}) {
return ( <div style={card}> <h2 style={valueStyle}>{value}</h2> <p style={label}>{title}</p> </div>
)
}

const grid = {
display: 'grid',
gridTemplateColumns: 'repeat(3,1fr)',
gap: 20
}

const card = {
background: '#0f172a',
border: '1px solid rgba(16,185,129,.25)',
borderRadius: 20,
padding: 28
}

const valueStyle = {
color: '#6ee7b7',
fontSize: 40,
fontWeight: 900,
margin: 0
}

const label = {
color: '#94a3b8',
marginTop: 10
}
