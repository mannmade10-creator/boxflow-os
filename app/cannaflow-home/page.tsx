import Link from 'next/link'

export default function CannaflowHome() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#020617',
      color: '#fff',
      padding: '60px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#6ee7b7'
        }}>
          Cannaflow OS
        </h1>

        <h2 style={{
          fontSize: 32,
          marginBottom: 30
        }}>
          The Complete Operating System for Modern Dispensaries
        </h2>

        <p style={{
          fontSize: 20,
          color: '#94a3b8',
          maxWidth: 800
        }}>
          Inventory • Compliance • POS • Delivery • Loyalty • Analytics • AI
        </p>

        <div style={{
          marginTop: 40,
          display: 'flex',
          gap: 20
        }}>
          <Link href="/contact">
            <button style={button}>
              Schedule Demo
            </button>
          </Link>

          <Link href="/cannaflow-login">
            <button style={button}>
              Login
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}

const button = {
  background: '#10b981',
  color: '#00130c',
  border: 'none',
  borderRadius: 14,
  padding: '16px 24px',
  fontWeight: 900,
  cursor: 'pointer'
}