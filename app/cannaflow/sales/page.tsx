'use client'

import { useEffect, useState } from 'react'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import CannaLayout from '../components/CannaLayout'

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    customer_name: '',
    product_name: '',
    quantity: '',
    total: '',
    payment_type: 'Cash',
  })

  async function loadSales() {
    const { data, error } = await cannaSupabase
      .from('canna_sales')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('Sales Data:', data)
    console.log('Sales Error:', error)

    if (error) {
      console.error('Sales error:', error.message)
      return
    }

    setSales(data || [])
  }

  async function addSale() {
    const { error } = await cannaSupabase.from('canna_sales').insert({
      customer_name: form.customer_name,
      product_name: form.product_name,
      quantity: Number(form.quantity),
      total: Number(form.total),
      payment_type: form.payment_type,
    })

    if (error) {
      alert(error.message)
      return
    }

    setForm({
      customer_name: '',
      product_name: '',
      quantity: '',
      total: '',
      payment_type: 'Cash',
    })

    setShowForm(false)
    loadSales()
  }

  useEffect(() => {
    loadSales()
  }, [])

  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0)
  const cashSales = sales.filter((sale) => sale.payment_type === 'Cash').length
  const cardSales = sales.filter((sale) => sale.payment_type === 'Card').length

  return (
    <CannaLayout title="Sales / POS">
      <div style={statsGrid}>
        <div style={card}>
          <h2 style={value}>${totalRevenue}</h2>
          <p style={label}>Total Revenue</p>
        </div>

        <div style={card}>
          <h2 style={value}>{sales.length}</h2>
          <p style={label}>Total Sales</p>
        </div>

        <div style={card}>
          <h2 style={value}>{cashSales}</h2>
          <p style={label}>Cash Sales</p>
        </div>

        <div style={card}>
          <h2 style={value}>{cardSales}</h2>
          <p style={label}>Card Sales</p>
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} style={addBtn}>
        {showForm ? 'Close Form' : '+ Add Sale'}
      </button>

      {showForm && (
        <div style={formBox}>
          <input style={input} placeholder="Customer Name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
          <input style={input} placeholder="Product Name" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
          <input style={input} placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <input style={input} placeholder="Total Amount" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />

          <select style={input} value={form.payment_type} onChange={(e) => setForm({ ...form, payment_type: e.target.value })}>
            <option>Cash</option>
            <option>Card</option>
            <option>Debit</option>
            <option>Other</option>
          </select>

          <button onClick={addSale} style={saveBtn}>Save Sale</button>
        </div>
      )}

      <div style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Customer</th>
              <th style={th}>Product</th>
              <th style={th}>Quantity</th>
              <th style={th}>Total</th>
              <th style={th}>Payment</th>
              <th style={th}>Date</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td style={td}>{sale.customer_name}</td>
                <td style={td}>{sale.product_name}</td>
                <td style={td}>{sale.quantity}</td>
                <td style={td}>${sale.total}</td>
                <td style={td}>{sale.payment_type}</td>
                <td style={td}>
                  {sale.created_at ? new Date(sale.created_at).toLocaleDateString() : ''}
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

const formBox = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3,1fr)',
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