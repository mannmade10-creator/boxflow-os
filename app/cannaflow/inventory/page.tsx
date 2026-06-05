'use client'

import { useEffect, useState } from 'react'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import CannaLayout from '../components/CannaLayout'

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    product_name: '',
    category: '',
    quantity: '',
    retail_price: '',
    vendor: '',
    package_id: '',
    status: 'In Stock',
  })

  async function loadProducts() {
    const { data, error } = await cannaSupabase
      .from('canna_products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('cannaSupabase error:', error.message, error.code, error.details)
      setLoading(false)
      return
    }

    setProducts(data || [])
    setLoading(false)
  }

  async function addProduct() {
    const { error } = await cannaSupabase.from('canna_products').insert({
      product_name: form.product_name,
      category: form.category,
      quantity: Number(form.quantity),
      retail_price: Number(form.retail_price),
      vendor: form.vendor,
      package_id: form.package_id,
      status: form.status,
    })

    if (error) {
      alert(error.message)
      return
    }

    setForm({
      product_name: '',
      category: '',
      quantity: '',
      retail_price: '',
      vendor: '',
      package_id: '',
      status: 'In Stock',
    })

    setShowForm(false)
    loadProducts()
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <CannaLayout title="Inventory Management">
      <button onClick={() => setShowForm(!showForm)} style={addBtn}>
        {showForm ? 'Close Form' : '+ Add Product'}
      </button>

      {showForm && (
        <div style={formBox}>
          <input style={input} placeholder="Product Name" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
          <input style={input} placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input style={input} placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <input style={input} placeholder="Retail Price" value={form.retail_price} onChange={(e) => setForm({ ...form, retail_price: e.target.value })} />
          <input style={input} placeholder="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
          <input style={input} placeholder="Package ID" value={form.package_id} onChange={(e) => setForm({ ...form, package_id: e.target.value })} />

          <select style={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>

          <button onClick={addProduct} style={saveBtn}>Save Product</button>
        </div>
      )}

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={th}>Product Name</th>
                <th style={th}>Category</th>
                <th style={th}>Quantity</th>
                <th style={th}>Retail Price</th>
                <th style={th}>Vendor</th>
                <th style={th}>Package ID</th>
                <th style={th}>Status</th>
              </tr>
                <th style={th}>Actions</th>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={td}>{product.product_name}</td>
                  <td style={td}>{product.category}</td>
                  <td style={td}>{product.quantity}</td>
                  <td style={td}>${product.retail_price}</td>
                  <td style={td}>{product.vendor}</td>
                  <td style={td}>{product.package_id}</td>
                  <td style={td}>{product.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CannaLayout>
  )
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