'use client'

import { useEffect, useState } from 'react'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import CannaLayout from '../components/CannaLayout'

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    revenue: 0,
    averageSale: 0,
    inventoryValue: 0,
    lowStock: 0,
    topProduct: 'N/A',
  })

  async function loadAnalytics() {
    const [salesRes, productsRes] = await Promise.all([
      cannaSupabase.from('canna_sales').select('*'),
      cannaSupabase.from('canna_products').select('*')
    ])

    const sales = salesRes.data || []
    const products = productsRes.data || []

    const revenue = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0)
    const averageSale = sales.length ? revenue / sales.length : 0

    const inventoryValue = products.reduce(
      (sum, product) => sum + Number(product.quantity || 0) * Number(product.cost || 0),
      0
    )

    const lowStock = products.filter((product) => product.status === 'Low Stock').length

    const productCount: Record<string, number> = {}

    sales.forEach((sale) => {
      productCount[sale.product_name] = (productCount[sale.product_name] || 0) + Number(sale.quantity || 0)
    })

    const topProduct =
      Object.entries(productCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

    setStats({
      revenue,
      averageSale,
      inventoryValue,
      lowStock,
      topProduct,
    })
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  return (
    <CannaLayout title="Analytics">
      <div style={grid}>
        <div style={card}>
          <h2 style={value}>${stats.revenue}</h2>
          <p style={label}>Total Revenue</p>
        </div>

        <div style={card}>
          <h2 style={value}>${stats.averageSale.toFixed(2)}</h2>
          <p style={label}>Average Sale</p>
        </div>

        <div style={card}>
          <h2 style={value}>${stats.inventoryValue}</h2>
          <p style={label}>Inventory Cost Value</p>
        </div>

        <div style={card}>
          <h2 style={warning}>{stats.lowStock}</h2>
          <p style={label}>Low Stock Items</p>
        </div>
      </div>

      <div style={insightBox}>
        <h2 style={{ marginTop: 0 }}>Business Insights</h2>

        <div style={insightRow}>
          <strong>Top Selling Product</strong>
          <span>{stats.topProduct}</span>
        </div>

        <div style={insightRow}>
          <strong>Revenue Health</strong>
          <span>{stats.revenue > 0 ? 'Active Sales Flow' : 'No Sales Data'}</span>
        </div>

        <div style={insightRow}>
          <strong>Inventory Risk</strong>
          <span>{stats.lowStock > 0 ? `${stats.lowStock} items need reorder` : 'Inventory Stable'}</span>
        </div>
      </div>
    </CannaLayout>
  )
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

const warning = {
  color: '#fbbf24',
  fontSize: 34,
  fontWeight: 950,
  margin: 0
}

const label = {
  color: '#94a3b8',
  margin: '8px 0 0'
}

const insightBox = {
  background: '#0f172a',
  border: '1px solid rgba(16,185,129,.25)',
  borderRadius: 20,
  padding: 28
}

const insightRow = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255,255,255,.08)',
  padding: '16px 0',
  color: '#cbd5e1'
}