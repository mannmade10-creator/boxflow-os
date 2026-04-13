'use client'
import React, { useState } from 'react'

const initialLeads = [
  { id: 1, company: 'International Paper', contact: 'Operations Manager', location: 'Memphis, TN', website: 'internationalpaper.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$500,000', status: 'In Progress', priority: 'HOT', notes: 'Works here — insider advantage. IP pitch sent.' },
  { id: 2, company: 'Smurfit WestRock', contact: 'VP Operations', location: 'Atlanta, GA', website: 'smurfitkappa.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$750,000', status: 'Not Contacted', priority: 'HOT', notes: '300+ facilities. Massive software spend.' },
  { id: 3, company: 'Packaging Corp of America', contact: 'CTO', location: 'Lake Forest, IL', website: 'packagingcorp.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$600,000', status: 'Not Contacted', priority: 'HOT', notes: '91 corrugated facilities nationwide.' },
  { id: 4, company: 'Georgia-Pacific', contact: 'Director of IT', location: 'Atlanta, GA', website: 'gp.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$800,000', status: 'Not Contacted', priority: 'HOT', notes: 'Koch Industries backed. Large fleet operations.' },
  { id: 5, company: 'Pratt Industries', contact: 'VP of Logistics', location: 'Conyers, GA', website: 'prattindustries.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$450,000', status: 'Not Contacted', priority: 'HIGH', notes: '47 transport facilities. Growing fast.' },
  { id: 6, company: 'Green Bay Packaging', contact: 'Operations Manager', location: 'Green Bay, WI', website: 'gbp.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$400,000', status: 'Not Contacted', priority: 'HIGH', notes: 'Vertically integrated. Multi-region.' },
  { id: 7, company: 'Sonoco Products', contact: 'CTO', location: 'Hartsville, SC', website: 'sonoco.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$350,000', status: 'Not Contacted', priority: 'HIGH', notes: 'Diversified packaging. Large fleet.' },
  { id: 8, company: 'Graphic Packaging', contact: 'VP Operations', location: 'Atlanta, GA', website: 'graphicpkg.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$500,000', status: 'Not Contacted', priority: 'HIGH', notes: '130+ facilities worldwide.' },
  { id: 9, company: 'Menasha Corporation', contact: 'Director of IT', location: 'Neenah, WI', website: 'menasha.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$300,000', status: 'Not Contacted', priority: 'HIGH', notes: 'Retail packaging and corrugated.' },
  { id: 10, company: 'WestRock', contact: 'VP of Technology', location: 'Atlanta, GA', website: 'westrock.com', tier: 1, industry: 'Paper & Packaging', estimatedDeal: '$900,000', status: 'Not Contacted', priority: 'HOT', notes: '320+ factories. 45,000 employees.' },
  { id: 11, company: 'J.B. Hunt Transport', contact: 'Fleet Manager', location: 'Lowell, AR', website: 'jbhunt.com', tier: 2, industry: 'Trucking', estimatedDeal: '$250,000', status: 'Not Contacted', priority: 'HIGH', notes: '13,000+ trucks. Close to OKC.' },
  { id: 12, company: 'Schneider National', contact: 'VP Operations', location: 'Green Bay, WI', website: 'schneider.com', tier: 2, industry: 'Trucking', estimatedDeal: '$300,000', status: 'Not Contacted', priority: 'HIGH', notes: 'One of largest US fleets.' },
  { id: 13, company: 'Knight-Swift', contact: 'CTO', location: 'Phoenix, AZ', website: 'knight-swift.com', tier: 2, industry: 'Trucking', estimatedDeal: '$400,000', status: 'Not Contacted', priority: 'HIGH', notes: '27,000+ tractors. Largest truckload carrier.' },
  { id: 14, company: 'Werner Enterprises', contact: 'Director of Technology', location: 'Omaha, NE', website: 'werner.com', tier: 2, industry: 'Trucking', estimatedDeal: '$200,000', status: 'Not Contacted', priority: 'HIGH', notes: '8,000+ tractors. Multi-service.' },
  { id: 15, company: 'Daseke Inc', contact: 'VP Fleet Operations', location: 'Addison, TX', website: 'daseke.com', tier: 2, industry: 'Trucking', estimatedDeal: '$250,000', status: 'Not Contacted', priority: 'HIGH', notes: '13,000+ trailers. Texas-based.' },
  { id: 16, company: 'ArcBest Corporation', contact: 'CTO', location: 'Fort Smith, AR', website: 'arcb.com', tier: 2, industry: 'Trucking', estimatedDeal: '$200,000', status: 'Not Contacted', priority: 'HIGH', notes: '4,000+ trucks. Arkansas close to OKC.' },
  { id: 17, company: 'XPO Logistics', contact: 'VP Technology', location: 'Greenwich, CT', website: 'xpo.com', tier: 2, industry: 'Logistics', estimatedDeal: '$350,000', status: 'Not Contacted', priority: 'HIGH', notes: '8,000+ tractor-trailers. Heavy tech investment.' },
  { id: 18, company: 'Old Dominion Freight', contact: 'Operations Director', location: 'Thomasville, NC', website: 'odfl.com', tier: 2, industry: 'Trucking', estimatedDeal: '$300,000', status: 'Not Contacted', priority: 'HIGH', notes: 'Large LTL network. Strong growth.' },
  { id: 19, company: 'Estes Express Lines', contact: 'Fleet Manager', location: 'Richmond, VA', website: 'estes-express.com', tier: 2, industry: 'Trucking', estimatedDeal: '$200,000', status: 'Not Contacted', priority: 'MEDIUM', notes: '16,000+ employees. LTL specialist.' },
  { id: 20, company: 'Landstar System', contact: 'VP Operations', location: 'Jacksonville, FL', website: 'landstar.com', tier: 2, industry: 'Logistics', estimatedDeal: '$250,000', status: 'Not Contacted', priority: 'MEDIUM', notes: '102,000+ capacity providers.' },
  { id: 21, company: 'Melton Truck Lines', contact: 'Operations Manager', location: 'Tulsa, OK', website: 'meltontrucklines.com', tier: 3, industry: 'Trucking', estimatedDeal: '$75,000', status: 'Not Contacted', priority: 'HOT', notes: 'Oklahoma-based. Easy to reach in person.' },
  { id: 22, company: 'Western Flyer Express', contact: 'Fleet Manager', location: 'OKC, OK', website: 'wfexpress.com', tier: 3, industry: 'Trucking', estimatedDeal: '$60,000', status: 'Not Contacted', priority: 'HOT', notes: 'OKC local. Refrigerated and dry van fleets.' },
  { id: 23, company: 'Mid-Con Carriers', contact: 'Owner', location: 'OKC, OK', website: 'midconcarriers.com', tier: 3, industry: 'Trucking', estimatedDeal: '$50,000', status: 'Not Contacted', priority: 'HOT', notes: 'Family-owned OKC company since 1977.' },
  { id: 24, company: 'Blue Diamond Trucking', contact: 'Operations Manager', location: 'Oklahoma', website: 'bluediamondtrucking.com', tier: 3, industry: 'Trucking', estimatedDeal: '$45,000', status: 'Not Contacted', priority: 'HIGH', notes: '25+ years. 48-state authority.' },
  { id: 25, company: 'Coweta Trucking', contact: 'Owner', location: 'Coweta, OK', website: 'cowetadrucking.com', tier: 3, industry: 'Trucking', estimatedDeal: '$40,000', status: 'Not Contacted', priority: 'HIGH', notes: 'Regional Oklahoma fleet.' },
  { id: 26, company: 'Bowers Trucking', contact: 'Operations Manager', location: 'Oklahoma', website: 'bowerstrucking.com', tier: 3, industry: 'Trucking', estimatedDeal: '$40,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'US, Canada, Mexico routes.' },
  { id: 27, company: 'SMS Logistics', contact: 'Director of Operations', location: 'San Antonio, TX', website: 'smslogistics.com', tier: 3, industry: 'Logistics', estimatedDeal: '$60,000', status: 'Not Contacted', priority: 'HIGH', notes: 'Full-service 3PL. Texas-based.' },
  { id: 28, company: 'Eagle Express', contact: 'Operations Manager', location: 'Dallas, TX', website: 'eagleexpress.com', tier: 3, industry: 'Trucking', estimatedDeal: '$50,000', status: 'Not Contacted', priority: 'HIGH', notes: '37+ years in DFW logistics.' },
  { id: 29, company: 'Prime Inc', contact: 'Fleet Manager', location: 'Springfield, MO', website: 'primeinc.com', tier: 3, industry: 'Trucking', estimatedDeal: '$150,000', status: 'Not Contacted', priority: 'HIGH', notes: '6,500+ trucks. Refrigerated specialist.' },
  { id: 30, company: 'ABF Freight', contact: 'VP Technology', location: 'Fort Smith, AR', website: 'abf.com', tier: 3, industry: 'Trucking', estimatedDeal: '$100,000', status: 'Not Contacted', priority: 'HIGH', notes: 'ArcBest subsidiary. Close to OKC.' },
  { id: 31, company: 'R&R Corrugated Packaging', contact: 'Operations Manager', location: 'Multiple US', website: 'rrcorrugated.com', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$75,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Top-ranked corrugated manufacturer.' },
  { id: 32, company: 'The BoxMaker Inc', contact: 'Plant Manager', location: 'Kent, WA', website: 'theboxmaker.com', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$60,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Custom corrugated packaging.' },
  { id: 33, company: 'Accurate Box Company', contact: 'Operations Director', location: 'Paterson, NJ', website: 'accuratebox.com', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$50,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Largest independent litho-laminated manufacturer.' },
  { id: 34, company: 'Alliance Packaging', contact: 'Plant Manager', location: 'Pacific NW', website: 'alliancepackaging.net', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$60,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Largest independent corrugated in Pacific NW.' },
  { id: 35, company: 'Packaging Fulfillment', contact: 'Owner', location: 'Nashville, TN', website: 'packagingfulfillment.com', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$40,000', status: 'Not Contacted', priority: 'MEDIUM', notes: '28+ years regional manufacturer.' },
  { id: 36, company: 'KapStone Paper', contact: 'VP Operations', location: 'Northbrook, IL', website: 'kapstone.com', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$100,000', status: 'Not Contacted', priority: 'HIGH', notes: 'Multiple US facilities.' },
  { id: 37, company: 'Moore Packaging', contact: 'Plant Manager', location: 'Multiple US', website: 'moorepackaging.com', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$50,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Regional corrugated manufacturer.' },
  { id: 38, company: 'ProtecPac', contact: 'Operations Manager', location: 'Multiple US', website: 'protecpac.com', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$50,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Protective packaging specialist.' },
  { id: 39, company: 'Corrugated Concepts', contact: 'Plant Manager', location: 'Multiple US', website: 'corrugatedconcepts.com', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$45,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Custom corrugated and specialty printing.' },
  { id: 40, company: 'Longview Fibre', contact: 'VP Operations', location: 'Longview, WA', website: 'longviewfibre.com', tier: 4, industry: 'Paper & Packaging', estimatedDeal: '$80,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Paper and packaging manufacturer.' },
  { id: 41, company: 'Ryder System', contact: 'VP of Fleet Technology', location: 'Miami, FL', website: 'ryder.com', tier: 5, industry: 'Logistics', estimatedDeal: '$500,000', status: 'Not Contacted', priority: 'HOT', notes: '$12.6B revenue. 189,800 vehicles managed.' },
  { id: 42, company: 'Penske Logistics', contact: 'CTO', location: 'Reading, PA', website: 'penskelogistics.com', tier: 5, industry: 'Logistics', estimatedDeal: '$400,000', status: 'Not Contacted', priority: 'HIGH', notes: 'Supply chain management giant.' },
  { id: 43, company: 'Hub Group', contact: 'VP Technology', location: 'Oak Brook, IL', website: 'hubgroup.com', tier: 5, industry: 'Logistics', estimatedDeal: '$250,000', status: 'Not Contacted', priority: 'HIGH', notes: '$3.7B revenue. Intermodal specialist.' },
  { id: 44, company: 'TFI International', contact: 'VP Operations', location: 'Quebec/US', website: 'tfiintl.com', tier: 5, industry: 'Trucking', estimatedDeal: '$400,000', status: 'Not Contacted', priority: 'HIGH', notes: '$8.4B revenue. 14,243 tractors.' },
  { id: 45, company: 'Saia Motor Freight', contact: 'Fleet Manager', location: 'Johns Creek, GA', website: 'saia.com', tier: 5, industry: 'Trucking', estimatedDeal: '$200,000', status: 'Not Contacted', priority: 'HIGH', notes: 'LTL carrier. $2B tech investment recently.' },
  { id: 46, company: 'R+L Carriers', contact: 'VP Technology', location: 'Wilmington, OH', website: 'rlcarriers.com', tier: 5, industry: 'Trucking', estimatedDeal: '$250,000', status: 'Not Contacted', priority: 'HIGH', notes: '21,000+ tractors and trailers.' },
  { id: 47, company: 'CRST International', contact: 'Operations Director', location: 'Cedar Rapids, IA', website: 'crst.com', tier: 5, industry: 'Trucking', estimatedDeal: '$200,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Thousands of trucks. Midwest based.' },
  { id: 48, company: 'Forward Air', contact: 'VP Technology', location: 'Greeneville, TN', website: 'forwardair.com', tier: 5, industry: 'Logistics', estimatedDeal: '$150,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Expedited LTL specialist.' },
  { id: 49, company: 'Heartland Express', contact: 'Fleet Manager', location: 'North Liberty, IA', website: 'heartlandexpress.com', tier: 5, industry: 'Trucking', estimatedDeal: '$150,000', status: 'Not Contacted', priority: 'MEDIUM', notes: 'Truckload carrier. Strong Midwest.' },
  { id: 50, company: 'Prime Inc', contact: 'VP Fleet Operations', location: 'Springfield, MO', website: 'primeinc.com', tier: 5, industry: 'Trucking', estimatedDeal: '$200,000', status: 'Not Contacted', priority: 'HIGH', notes: 'Temperature controlled specialist.' },
]

const statuses = ['Not Contacted', 'Emailed', 'Called', 'Demo Scheduled', 'Demo Done', 'Proposal Sent', 'Negotiating', 'Closed Won', 'Closed Lost']
const priorities = ['HOT', 'HIGH', 'MEDIUM', 'LOW']
const tiers = [1, 2, 3, 4, 5]

const statusColors: Record<string, string> = {
  'Not Contacted': '#64748b',
  'Emailed': '#3b82f6',
  'Called': '#8b5cf6',
  'Demo Scheduled': '#f59e0b',
  'Demo Done': '#7bd0ff',
  'Proposal Sent': '#a855f7',
  'Negotiating': '#f97316',
  'Closed Won': '#22c55e',
  'Closed Lost': '#ef4444',
}

const priorityColors: Record<string, string> = {
  'HOT': '#ef4444',
  'HIGH': '#f59e0b',
  'MEDIUM': '#3b82f6',
  'LOW': '#64748b',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState(initialLeads)
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [editNotes, setEditNotes] = useState('')
  const [emailLead, setEmailLead] = useState<typeof initialLeads[0] | null>(null)
  const [emailSending, setEmailSending] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [activeTab, setActiveTab] = useState('pipeline')

  function updateStatus(id: number, status: string) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  function updateNotes(id: number) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: editNotes } : l))
    setSelected(null)
  }

  const filtered = leads.filter(l => {
    const matchSearch = l.company.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase())
    const matchTier = filterTier ? l.tier === filterTier : true
    const matchStatus = filterStatus ? l.status === filterStatus : true
    const matchPriority = filterPriority ? l.priority === filterPriority : true
    return matchSearch && matchTier && matchStatus && matchPriority
  })

  const totalPipeline = leads.filter(l => l.status !== 'Closed Lost').reduce((sum, l) => sum + parseInt(l.estimatedDeal.replace(/[$,]/g, '')), 0)
  const hotLeads = leads.filter(l => l.priority === 'HOT').length
  const closedWon = leads.filter(l => l.status === 'Closed Won').length
  const inProgress = leads.filter(l => !['Not Contacted', 'Closed Won', 'Closed Lost'].includes(l.status)).length
  const selectedLead = leads.find(l => l.id === selected)

  const sendViaInstantly = async (lead: typeof initialLeads[0], body: string) => {
    setEmailSending(true)
    setEmailError('')
    try {
      const nameParts = (lead.contact || '').trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const payload = {
        api_key: 'N2RjYTJlOGYtMWE2NC00NGU1LTg0OTUtOThiOTA3MTkxYWU3OkZUV1hrZVhxb2dCQg==',
        campaign_id: '03855a25-fb18-40e1-9aea-dd58f4cf5a32',
        email: lead.email,
        first_name: firstName,
        last_name: lastName,
        company_name: lead.company,
        personalization: body,
      }

      const res = await fetch('https://api.instantly.ai/api/v1/lead/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        updateStatus(lead.id, 'Emailed')
        setEmailSent(true)
      } else {
        const errText = await res.text()
        setEmailError('Instantly.ai error: ' + errText)
      }
    } catch (err: any) {
      setEmailError('Network error: ' + (err?.message || String(err)))
    } finally {
      setEmailSending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0c1324', color: '#dce1fb', fontFamily: 'Inter, Arial, sans-serif', display: 'flex' }}>

      <aside style={{ width: 200, background: '#151b2d', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }} className="leads-sidebar">
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(180,197,255,0.04)' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
            <img src="/assets/logo.png" style={{ width: 28, height: 28 }} alt="logo" />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#2563eb', letterSpacing: 2, textTransform: 'uppercase' }}>BOXFLOW</span>
          </a>
          <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Sales</div>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#dce1fb', letterSpacing: 1 }}>LEAD_TRACKER</div>
        </div>
        <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { icon: '📊', label: 'DASHBOARD', href: '/dashboard' },
            { icon: '⚙️', label: 'COMMAND', href: '/command-center' },
            { icon: '🚛', label: 'FLEET', href: '/fleet-map' },
            { icon: '🏭', label: 'PRODUCTION', href: '/production' },
            { icon: '🤖', label: 'AI PANEL', href: '/executive' },
            { icon: '🎯', label: 'LEADS', href: '/leads', active: true },
            { icon: '📈', label: 'ANALYTICS', href: '/analytics' },
            { icon: '📦', label: 'ORDERS', href: '/orders' },
          ].map(item => (
            <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 2, background: item.active ? 'linear-gradient(135deg, rgba(37,99,235,0.85), rgba(29,78,216,0.75))' : 'transparent', color: item.active ? '#fff' : 'rgba(195,198,215,0.45)', textDecoration: 'none', fontWeight: item.active ? 800 : 500, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(180,197,255,0.04)' }}>
          <button onClick={async () => { const { supabase } = await import('@/lib/supabase'); await supabase.auth.signOut(); window.location.href = '/'; }} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 2, color: 'rgba(252,165,165,0.5)', fontWeight: 700, cursor: 'pointer', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>🚪 SIGN OUT</button>
        </div>
      </aside>

      <main style={{ marginLeft: 200, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="leads-main">

        <header style={{ position: 'sticky', top: 0, zIndex: 40, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(12,19,36,0.96)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(180,197,255,0.06)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 10, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>Sales Pipeline</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#dce1fb', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>LEAD_TRACKER</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 3, padding: '4px 12px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>50 TARGETS LOADED</span>
            </div>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'rgba(180,197,255,0.04)', flexShrink: 0 }}>
          {[
            { label: 'TOTAL PIPELINE', value: '$' + (totalPipeline / 1000000).toFixed(1) + 'M', color: '#b4c5ff' },
            { label: 'HOT LEADS', value: hotLeads, color: '#ef4444' },
            { label: 'IN PROGRESS', value: inProgress, color: '#f59e0b' },
            { label: 'DEMOS DONE', value: leads.filter(l => l.status === 'Demo Done').length, color: '#7bd0ff' },
            { label: 'CLOSED WON', value: closedWon, color: '#22c55e' },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: '#151b2d', padding: '16px 18px' }}>
              <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{kpi.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: kpi.color, fontFamily: 'monospace', lineHeight: 1 }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', background: '#151b2d', borderBottom: '1px solid rgba(180,197,255,0.04)', flexShrink: 0 }}>
          {[
            { id: 'pipeline', label: '🎯 PIPELINE' },
            { id: 'hot', label: '🔥 HOT LEADS' },
            { id: 'stats', label: '📊 STATS' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '14px 24px', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === tab.id ? '#b4c5ff' : 'rgba(195,198,215,0.35)', fontWeight: activeTab === tab.id ? 800 : 500, fontSize: 13, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {(activeTab === 'pipeline' || activeTab === 'hot') && (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search companies..."
                  style={{ flex: 1, minWidth: 200, padding: '10px 16px', background: '#151b2d', border: '1px solid rgba(180,197,255,0.1)', borderRadius: 3, color: '#dce1fb', fontSize: 14, outline: 'none' }}
                />
                <select value={filterTier || ''} onChange={e => setFilterTier(e.target.value ? parseInt(e.target.value) : null)} style={{ padding: '10px 16px', background: '#151b2d', border: '1px solid rgba(180,197,255,0.1)', borderRadius: 3, color: '#dce1fb', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                  <option value="">All Tiers</option>
                  {tiers.map(t => <option key={t} value={t}>Tier {t}</option>)}
                </select>
                <select value={filterStatus || ''} onChange={e => setFilterStatus(e.target.value || null)} style={{ padding: '10px 16px', background: '#151b2d', border: '1px solid rgba(180,197,255,0.1)', borderRadius: 3, color: '#dce1fb', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                  <option value="">All Statuses</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filterPriority || ''} onChange={e => setFilterPriority(e.target.value || null)} style={{ padding: '10px 16px', background: '#151b2d', border: '1px solid rgba(180,197,255,0.1)', borderRadius: 3, color: '#dce1fb', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                  <option value="">All Priorities</option>
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                {(activeTab === 'hot' ? filtered.filter(l => l.priority === 'HOT') : filtered).map(lead => (
                  <div key={lead.id} style={{ background: '#151b2d', borderRadius: 3, padding: 20, borderLeft: '3px solid ' + priorityColors[lead.priority] }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 16, alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>{lead.company}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 2, background: priorityColors[lead.priority] + '20', color: priorityColors[lead.priority] }}>{lead.priority}</span>
                          <span style={{ fontSize: 9, color: 'rgba(195,198,215,0.35)', background: 'rgba(180,197,255,0.06)', padding: '2px 6px', borderRadius: 2 }}>TIER {lead.tier}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'rgba(195,198,215,0.4)' }}>{lead.contact} · {lead.location}</div>
                        <div style={{ fontSize: 11, color: 'rgba(180,197,255,0.4)', marginTop: 2 }}>{lead.industry}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Est. Deal</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: '#22c55e', fontFamily: 'monospace' }}>{lead.estimatedDeal}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Status</div>
                        <select
                          value={lead.status}
                          onChange={e => updateStatus(lead.id, e.target.value)}
                          onClick={e => e.stopPropagation()}
                          style={{ padding: '5px 8px', background: statusColors[lead.status] + '20', border: '1px solid ' + statusColors[lead.status] + '40', borderRadius: 2, color: statusColors[lead.status], fontSize: 11, fontWeight: 700, outline: 'none', cursor: 'pointer', width: '100%' }}
                        >
                          {statuses.map(s => <option key={s} value={s} style={{ background: '#151b2d', color: '#dce1fb' }}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'rgba(195,198,215,0.35)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 }}>Website</div>
                        <a href={'https://' + lead.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#b4c5ff', textDecoration: 'none', fontFamily: 'monospace' }}>{lead.website}</a>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button onClick={() => { setEmailLead(lead); setEmailSending(false); setEmailSent(false); setEmailError(''); }} style={{ padding: '5px 10px', background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 2, color: '#b4c5ff', fontSize: 10, fontWeight: 700, letterSpacing: 1, cursor: 'pointer', width: '100%' }}>? EMAIL</button>
                        <button onClick={() => { setSelected(lead.id); setEditNotes(lead.notes); }} style={{ padding: '5px 10px', background: 'rgba(180,197,255,0.06)', border: '1px solid rgba(180,197,255,0.12)', borderRadius: 2, color: '#94a3b8', fontSize: 10, fontWeight: 700, letterSpacing: 1, cursor: 'pointer' }}>📝 NOTES</button>
                      </div>
                      <a href={'https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent(lead.contact + ' ' + lead.company)} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 12px', background: 'rgba(10,102,194,0.15)', border: '1px solid rgba(10,102,194,0.3)', borderRadius: 2, color: '#60a5fa', fontSize: 10, fontWeight: 700, letterSpacing: 1, textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        🔗 LINKEDIN
                      </a>
                    </div>
                    {lead.notes && (
                      <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(12,19,36,0.5)', borderRadius: 2, fontSize: 12, color: 'rgba(195,198,215,0.5)', borderLeft: '2px solid rgba(180,197,255,0.1)' }}>
                        {lead.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'stats' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ background: '#151b2d', borderRadius: 3, padding: 24 }}>
                <div style={{ fontSize: 12, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Pipeline by Status</div>
                {statuses.map(s => {
                  const count = leads.filter(l => l.status === s).length
                  const pct = Math.round((count / leads.length) * 100)
                  return (
                    <div key={s} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: 'rgba(195,198,215,0.6)' }}>{s}</span>
                        <span style={{ fontSize: 13, color: statusColors[s], fontWeight: 700, fontFamily: 'monospace' }}>{count} leads</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(12,19,36,0.6)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: pct + '%', background: statusColors[s], borderRadius: 999 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ background: '#151b2d', borderRadius: 3, padding: 24 }}>
                <div style={{ fontSize: 12, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Pipeline by Tier</div>
                {tiers.map(t => {
                  const tierLeads = leads.filter(l => l.tier === t)
                  const tierValue = tierLeads.reduce((sum, l) => sum + parseInt(l.estimatedDeal.replace(/[$,]/g, '')), 0)
                  const tierColors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6']
                  return (
                    <div key={t} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: 'rgba(195,198,215,0.6)' }}>Tier {t} — {tierLeads.length} companies</span>
                        <span style={{ fontSize: 13, color: tierColors[t - 1], fontWeight: 700, fontFamily: 'monospace' }}>${(tierValue / 1000000).toFixed(1)}M</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(12,19,36,0.6)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: Math.round((tierValue / totalPipeline) * 100) + '%', background: tierColors[t - 1], borderRadius: 999 }} />
                      </div>
                    </div>
                  )
                })}
                <div style={{ marginTop: 20, padding: 16, background: 'rgba(12,19,36,0.5)', borderRadius: 2 }}>
                  <div style={{ fontSize: 12, color: 'rgba(195,198,215,0.4)', marginBottom: 6 }}>Total Pipeline Value</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#22c55e', fontFamily: 'monospace' }}>${(totalPipeline / 1000000).toFixed(1)}M</div>
                </div>
              </div>
              <div style={{ background: '#151b2d', borderRadius: 3, padding: 24 }}>
                <div style={{ fontSize: 12, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Priority Breakdown</div>
                {priorities.map(p => {
                  const count = leads.filter(l => l.priority === p).length
                  return (
                    <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(180,197,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColors[p] }} />
                        <span style={{ fontSize: 13, color: 'rgba(195,198,215,0.6)' }}>{p} Priority</span>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 900, color: priorityColors[p], fontFamily: 'monospace' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
              <div style={{ background: '#151b2d', borderRadius: 3, padding: 24 }}>
                <div style={{ fontSize: 12, color: '#b4c5ff', fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Top 5 Deals by Value</div>
                {[...leads].sort((a, b) => parseInt(b.estimatedDeal.replace(/[$,]/g, '')) - parseInt(a.estimatedDeal.replace(/[$,]/g, ''))).slice(0, 5).map((lead, i) => (
                  <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(180,197,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: 'rgba(195,198,215,0.2)', fontFamily: 'monospace', minWidth: 20 }}>#{i + 1}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#dce1fb' }}>{lead.company}</div>
                        <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.35)' }}>{lead.status}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#22c55e', fontFamily: 'monospace' }}>{lead.estimatedDeal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {emailLead && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#151b2d', borderRadius: 4, padding: 32, width: 620, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#dce1fb', fontFamily: 'monospace' }}>⚡ Send via Instantly.ai</div>
                <div style={{ fontSize: 13, color: 'rgba(195,198,215,0.4)', marginTop: 4 }}>{emailLead.company} — {emailLead.contact}</div>
              </div>
              <button onClick={() => { setEmailLead(null); setEmailSent(false); setEmailError(''); }} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Success State */}
            {emailSent ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#22c55e', marginBottom: 8 }}>Lead Added to Instantly!</div>
                <div style={{ fontSize: 14, color: 'rgba(195,198,215,0.5)', marginBottom: 24 }}>
                  {emailLead.contact} at {emailLead.company} has been added to your campaign and will be emailed automatically.
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    onClick={() => { setEmailLead(null); setEmailSent(false); }}
                    style={{ padding: '10px 24px', background: '#22c55e', border: 'none', borderRadius: 3, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
                  >
                    ✓ Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* To */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>To</div>
                  <div style={{ padding: '10px 14px', background: 'rgba(12,19,36,0.5)', borderRadius: 3, fontSize: 14, color: '#dce1fb', border: '1px solid rgba(180,197,255,0.1)' }}>
                    {emailLead.contact} — <span style={{ color: '#b4c5ff' }}>{emailLead.email || <em style={{ color: '#ef4444' }}>No email on record</em>}</span>
                  </div>
                </div>

                {/* Campaign */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Campaign</div>
                  <div style={{ padding: '10px 14px', background: 'rgba(12,19,36,0.5)', borderRadius: 3, fontSize: 13, color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', fontFamily: 'monospace' }}>
                    ⚡ 03855a25-fb18-40e1-9aea-dd58f4cf5a32
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Subject (set in Instantly campaign)</div>
                  <div style={{ padding: '10px 14px', background: 'rgba(12,19,36,0.5)', borderRadius: 3, fontSize: 14, color: '#dce1fb', border: '1px solid rgba(180,197,255,0.1)', fontFamily: 'monospace' }}>
                    Cutting {emailLead.company} Software Costs by 96%
                  </div>
                </div>

                {/* Personalization Body */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'rgba(195,198,215,0.4)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Personalization / Email Body</div>
                  <textarea
                    id="emailBody"
                    rows={10}
                    defaultValue={"Hi " + emailLead.contact.split(' ')[0] + ",\n\nI want to be direct with you.\n\nThe average logistics and manufacturing company pays $10-16 million per year for disconnected software — McLeod, Samsara, SAP, Oracle, TMW, and Fishbowl — none of which talk to each other.\n\nI built BoxFlow OS to replace all of it with one platform. One login. One source of truth. Every operation on one screen.\n\nCompanies switching to BoxFlow OS save up to $14.5 million per year — a 96% cost reduction.\n\nThe platform is live right now:\nboxflow-os.vercel.app\n\nWould you be open to a 20-minute demo this week?\n\nKenneth Covington\nFounder, BoxFlow OS\nKenneth.Covington@boxflowos.com\nboxflow-os.vercel.app"}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(12,19,36,0.6)', border: '1px solid rgba(180,197,255,0.15)', borderRadius: 3, color: '#dce1fb', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Inter, Arial, sans-serif', lineHeight: 1.6 }}
                  />
                </div>

                {/* Error */}
                {emailError && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 3, color: '#ef4444', fontSize: 13 }}>
                    ⚠️ {emailError}
                  </div>
                )}

                {/* Send Button */}
                <button
                  disabled={emailSending || !emailLead.email}
                  onClick={() => {
                    const body = (document.getElementById('emailBody') as HTMLTextAreaElement)?.value || ''
                    sendViaInstantly(emailLead, body)
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: emailSending ? 'rgba(37,99,235,0.4)' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    border: 'none',
                    borderRadius: 3,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: emailSending ? 'not-allowed' : 'pointer',
                    letterSpacing: 1,
                    opacity: !emailLead.email ? 0.5 : 1,
                  }}
                >
                  {emailSending ? '⏳ Sending to Instantly...' : '⚡ ADD TO INSTANTLY CAMPAIGN'}
                </button>

                {!emailLead.email && (
                  <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: '#ef4444' }}>
                    ⚠️ This lead has no email address on record. Add one to their profile first.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {selected && selectedLead && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#151b2d', borderRadius: 4, padding: 32, width: 500, maxWidth: '90vw' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#dce1fb', marginBottom: 6, fontFamily: 'monospace' }}>{selectedLead.company}</div>
            <div style={{ fontSize: 13, color: 'rgba(195,198,215,0.4)', marginBottom: 20 }}>Edit Notes</div>
            <textarea
              value={editNotes}
              onChange={e => setEditNotes(e.target.value)}
              rows={5}
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(12,19,36,0.6)', border: '1px solid rgba(180,197,255,0.15)', borderRadius: 3, color: '#dce1fb', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'Inter, Arial, sans-serif' }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => updateNotes(selected)} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none', borderRadius: 3, color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>SAVE NOTES</button>
              <button onClick={() => setSelected(null)} style={{ padding: '12px 20px', background: 'rgba(180,197,255,0.06)', border: '1px solid rgba(180,197,255,0.12)', borderRadius: 3, color: '#94a3b8', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .leads-sidebar { display: none !important; }
          .leads-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}
