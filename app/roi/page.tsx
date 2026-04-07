'use client'
import React, { useState } from 'react'

export default function ROIPage() {
  const [trucks, setTrucks] = useState(20)
  const [employees, setEmployees] = useState(50)
  const [locations, setLocations] = useState(3)
  const [currentSpend, setCurrentSpend] = useState(500000)
  const [ordersPerMonth, setOrdersPerMonth] = useState(200)

  // Current software cost estimates
  const dispatchCost = trucks * 1200
  const fleetCost = trucks * 900
  const hrCost = employees * 240
  const analyticsCost = 24000
  const clientPortalCost = 18000
  const productionCost = locations * 12000
  const totalCurrentCost = dispatchCost + fleetCost + hrCost + analyticsCost + clientPortalCost + productionCost + currentSpend

  // BoxFlow OS cost
  const boxflowCost = trucks <= 10 ? 35988 : trucks <= 50 ? 119988 : 299988
  
  // Savings
  const annualSavings = totalCurrentCost - boxflowCost
  const monthlySavings = Math.round(annualSavings / 12)
  const savingsPct = Math.round((annualSavings / totalCurrentCost) * 100)
  const paybackMonths = Math.round(boxflowCost / monthlySavings)

  // Productivity gains
  const hoursPerEmployeePerDay = 1.5
  const hourlyRate = 35
  const productivitySavings = Math.round(employees * hoursPerEmployeePerDay * hourlyRate * 250)
  const totalBenefit = annualSavings + productivitySavings

  function formatMoney(n: number) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return '$' + Math.round(n / 1000) + 'K'
    return '$' + n
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(37,99,235,0.15), transparent 60%), linear-gradient(180deg, #020617 0%, #0b1220 100%)', color: '#fff', fontFamily: 'Arial, sans-serif', padding: '60px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
          <img src="/assets/logo.png" alt="BoxFlow OS" style={{ width: 36, height: 36 }} />
          <span style={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>BoxFlow OS</span>
        </a>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(96,165,250,0.24)', color: '#93c5fd', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>ROI Calculator</div>
          <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px' }}>Calculate Your Savings</h1>
          <p style={{ color: '#94a3b8', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>See exactly how much BoxFlow OS saves your operation every year.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
          
          <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 24, padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 24px', color: '#fff' }}>Tell Us About Your Operation</h2>
            
            <div style={{ display: 'grid', gap: 24 }}>
              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                  <span>Number of Trucks</span>
                  <span style={{ color: '#60a5fa', fontSize: 18, fontWeight: 900 }}>{trucks}</span>
                </label>
                <input type="range" min="1" max="200" value={trucks} onChange={e => setTrucks(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 11, marginTop: 4 }}>
                  <span>1</span><span>200</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                  <span>Number of Employees</span>
                  <span style={{ color: '#60a5fa', fontSize: 18, fontWeight: 900 }}>{employees}</span>
                </label>
                <input type="range" min="5" max="500" value={employees} onChange={e => setEmployees(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 11, marginTop: 4 }}>
                  <span>5</span><span>500</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                  <span>Number of Locations</span>
                  <span style={{ color: '#60a5fa', fontSize: 18, fontWeight: 900 }}>{locations}</span>
                </label>
                <input type="range" min="1" max="50" value={locations} onChange={e => setLocations(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 11, marginTop: 4 }}>
                  <span>1</span><span>50</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                  <span>Orders Per Month</span>
                  <span style={{ color: '#60a5fa', fontSize: 18, fontWeight: 900 }}>{ordersPerMonth}</span>
                </label>
                <input type="range" min="10" max="10000" step="10" value={ordersPerMonth} onChange={e => setOrdersPerMonth(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 11, marginTop: 4 }}>
                  <span>10</span><span>10,000</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                  <span>Other Annual Software Spend</span>
                  <span style={{ color: '#60a5fa', fontSize: 18, fontWeight: 900 }}>{formatMoney(currentSpend)}</span>
                </label>
                <input type="range" min="0" max="10000000" step="10000" value={currentSpend} onChange={e => setCurrentSpend(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563eb' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: 11, marginTop: 4 }}>
                  <span>$0</span><span>$10M</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 28, padding: 20, background: 'rgba(2,6,23,0.5)', borderRadius: 16 }}>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase' }}>Estimated Current Annual Spend</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  { label: 'Dispatch Software', value: dispatchCost },
                  { label: 'Fleet Tracking', value: fleetCost },
                  { label: 'HR Systems', value: hrCost },
                  { label: 'Analytics Tools', value: analyticsCost },
                  { label: 'Client Portal', value: clientPortalCost },
                  { label: 'Production Mgmt', value: productionCost },
                  { label: 'Other Software', value: currentSpend },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8', fontSize: 13 }}>{item.label}</span>
                    <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 13 }}>{formatMoney(item.value)}/yr</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(148,163,184,0.1)', marginTop: 4 }}>
                  <span style={{ color: '#fff', fontWeight: 800 }}>Total Current Spend</span>
                  <span style={{ color: '#ef4444', fontWeight: 900, fontSize: 16 }}>{formatMoney(totalCurrentCost)}/yr</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))', border: '2px solid rgba(34,197,94,0.4)', borderRadius: 24, padding: 32, textAlign: 'center' }}>
              <div style={{ color: '#86efac', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Your Annual Savings with BoxFlow OS</div>
              <div style={{ fontSize: 64, fontWeight: 900, color: '#22c55e', lineHeight: 1, marginBottom: 8 }}>{formatMoney(annualSavings)}</div>
              <div style={{ color: '#4ade80', fontSize: 16, fontWeight: 700 }}>Per Year • {savingsPct}% Cost Reduction</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid #3b82f6', borderRadius: 20, padding: 20, textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Monthly Savings</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6' }}>{formatMoney(monthlySavings)}</div>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid #8b5cf6', borderRadius: 20, padding: 20, textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Payback Period</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#8b5cf6' }}>{paybackMonths} mo</div>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid #f59e0b', borderRadius: 20, padding: 20, textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Productivity Gains</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b' }}>{formatMoney(productivitySavings)}</div>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderTop: '3px solid #22c55e', borderRadius: 20, padding: 20, textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Total Annual Benefit</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e' }}>{formatMoney(totalBenefit)}</div>
              </div>
            </div>

            <div style={{ background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(148,163,184,0.14)', borderRadius: 20, padding: 24 }}>
              <div style={{ color: '#64748b', fontSize: 12, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase' }}>BoxFlow OS vs Current Stack</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#94a3b8', fontSize: 13 }}>Current Software</span>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>{formatMoney(totalCurrentCost)}/yr</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(239,68,68,0.3)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '100%', background: '#ef4444', borderRadius: 999 }} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#94a3b8', fontSize: 13 }}>BoxFlow OS</span>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>{formatMoney(boxflowCost)}/yr</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(34,197,94,0.2)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: (boxflowCost / totalCurrentCost * 100) + '%', background: '#22c55e', borderRadius: 999 }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Ready to start saving {formatMoney(annualSavings)}/year?</div>
              <div style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>14-day free trial. No credit card. Full platform access.</div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/contact" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>Start Free Trial →</a>
                <a href="/contact" style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 14 }}>Talk to Sales</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}