'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ClassFlowDashboard() {
  return (
    <div style={{ minHeight: '100vh', background: '#07080d', color: '#f1f5f9', fontFamily: 'system-ui,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>ClassFlow AI Dashboard</h1>
        <p style={{ color: '#64748b', marginBottom: 24 }}>Welcome back</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a href='/classflow/create' style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>+ New Lesson</a>
          <a href='/classflow/students' style={{ padding: '10px 20px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Students</a>
        </div>
      </div>
    </div>
  )
}