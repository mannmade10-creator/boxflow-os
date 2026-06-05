'use client'

import { useRouter } from 'next/navigation'

export default function CannaflowHome() {
  const router = useRouter()

  return (
    <main style={{ minHeight: '100vh', background: '#020617', color: '#fff', padding: 24 }}>
      <section style={{ maxWidth: 1180, margin: '0 auto', paddingTop: 60 }}>
        <div style={heroBox}>
          <p style={{ color: '#34d399', fontWeight: 800, margin: 0 }}>Made Technologies Inc.</p>

          <img
            src="/assets/cannaflow-logo.png"
            alt="Cannaflow OS"
            style={{
              width: 220,
              height: 220,
              objectFit: 'contain',
              marginTop: 22,
              marginBottom: 18,
              filter: 'drop-shadow(0 0 25px rgba(16,185,129,.6))'
            }}
          />

          <h1 style={{ fontSize: 84, lineHeight: 1, margin: 0, fontWeight: 950 }}>
            Cannaflow OS
          </h1>

          <p style={{ color: '#6ee7b7', fontSize: 24, fontWeight: 800, marginTop: 14 }}>
            Powered by Compliance. Built for Growth.
          </p>

          <p style={{ color: '#cbd5e1', fontSize: 18, maxWidth: 760, lineHeight: 1.6 }}>
            Cannabis compliance, inventory, sales, delivery, CRM, and analytics in one operating system built for modern dispensaries.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 28 }}>
            <button onClick={() => router.push('/cannaflow/dashboard')} style={btnPrimary}>
              Open Dashboard
            </button>

            <button onClick={() => router.push('/cannaflow/inventory')} style={btnSecondary}>
              View Inventory
            </button>

            <button onClick={() => router.push('/cannaflow/compliance')} style={btnSecondary}>
              Compliance Center
            </button>
          </div>

          <div style={statsGrid}>
            <div style={statCard}>
              <h2 style={statNumber}>$148K</h2>
              <p style={statText}>Monthly Revenue</p>
            </div>

            <div style={statCard}>
              <h2 style={statNumber}>3,241</h2>
              <p style={statText}>Products Tracked</p>
            </div>

            <div style={statCard}>
              <h2 style={statNumber}>99.8%</h2>
              <p style={statText}>Compliance Score</p>
            </div>

            <div style={statCard}>
              <h2 style={statNumber}>1,842</h2>
              <p style={statText}>Customers</p>
            </div>
          </div>
        </div>

        <div style={featureGrid}>
          <div style={card}>
            <h3 style={{ margin: 0, fontSize: 20 }}>OMMA Ready Workflows</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>
              Track licenses, audits, transfers, waste logs, and compliance activity.
            </p>
          </div>

          <div style={card}>
            <h3 style={{ margin: 0, fontSize: 20 }}>Inventory Control</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>
              Manage products, categories, batches, vendors, package IDs, and low-stock alerts.
            </p>
          </div>

          <div style={card}>
            <h3 style={{ margin: 0, fontSize: 20 }}>Growth Dashboard</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.5 }}>
              See revenue, customers, loyalty, product performance, and business trends.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

const heroBox = {
  border: '1px solid rgba(16,185,129,.35)',
  borderRadius: 28,
  padding: 60,
  background: 'linear-gradient(135deg, #02140d, #020617 45%, #064e3b)',
  boxShadow: '0 30px 80px rgba(16,185,129,.15)'
}

const btnPrimary = {
  background: '#10b981',
  color: '#00130c',
  border: 'none',
  borderRadius: 14,
  padding: '14px 22px',
  fontWeight: 900,
  cursor: 'pointer'
}

const btnSecondary = {
  background: 'rgba(15,23,42,.75)',
  color: '#6ee7b7',
  border: '1px solid rgba(16,185,129,.45)',
  borderRadius: 14,
  padding: '14px 22px',
  fontWeight: 900,
  cursor: 'pointer'
}

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 16,
  marginTop: 40
}

const statCard = {
  background: 'rgba(15,23,42,.7)',
  border: '1px solid rgba(16,185,129,.25)',
  borderRadius: 18,
  padding: 20,
  textAlign: 'center' as const
}

const statNumber = {
  margin: 0,
  fontSize: 30,
  color: '#6ee7b7',
  fontWeight: 950
}

const statText = {
  margin: '8px 0 0',
  color: '#94a3b8',
  fontSize: 14
}

const featureGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 18,
  marginTop: 26
}

const card = {
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: 22,
  background: '#0f172a',
  padding: 24
}

