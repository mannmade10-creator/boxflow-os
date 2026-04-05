'use client'

export default function Home() {
  return (
    <div style={container}>
      <div style={card}>
        <img
          src="/assets/logo.png"
          alt="BoxFlow OS"
          style={logo}
        />

        <h1 style={title}>BoxFlow OS</h1>

        <p style={subtitle}>
          Enterprise Operations Suite
        </p>

        <a href="/login" style={button}>
          Enter System
        </a>
      </div>
    </div>
  )
}

const container: React.CSSProperties = {
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background:
    'radial-gradient(circle at top, #0f172a, #020617)',
}

const card: React.CSSProperties = {
  textAlign: 'center',
}

const logo: React.CSSProperties = {
  width: 300,
  marginBottom: 20,
}

const title: React.CSSProperties = {
  fontSize: 72,
  fontWeight: 900,
  color: '#fff',
}

const subtitle: React.CSSProperties = {
  color: '#94a3b8',
  marginBottom: 30,
}

const button: React.CSSProperties = {
  padding: '18px 56px',
  background: '#2563eb',
  color: '#fff',
  borderRadius: 12,
  textDecoration: 'none',
  fontWeight: 700,
}