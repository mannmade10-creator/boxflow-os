'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'

type FleetRow = {
  id: string
  truck_name: string
  status: string
  eta?: string | null
  current_load?: string | null
}

type OrderRow = {
  id: string
  load_name?: string | null
  status?: string | null
  assigned_truck_id?: string | null
  pickup_location?: string | null
  dropoff_location?: string | null
}

type EquipmentRow = {
  id: string
  machine_name: string
  status: string
  output_percent?: number | null
}

export default function ExecutiveDashboardPage() {
  const [fleet, setFleet] = useState<FleetRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [equipment, setEquipment] = useState<EquipmentRow[]>([])
  const [lastUpdated, setLastUpdated] = useState('Not updated yet')

  async function loadData() {
    const { data: fleetData } = await supabase.from('fleet').select('*')
    const { data: orderData } = await supabase.from('orders').select('*')
    const { data: equipmentData } = await supabase.from('equipment').select('*')

    setFleet((fleetData || []) as FleetRow[])
    setOrders((orderData || []) as OrderRow[])
    setEquipment((equipmentData || []) as EquipmentRow[])
    setLastUpdated(new Date().toLocaleTimeString())
  }

  useEffect(() => {
    loadData()

    const fleetChannel = supabase
      .channel('executive-fleet-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fleet' }, () => loadData())
      .subscribe()

    const ordersChannel = supabase
      .channel('executive-orders-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadData())
      .subscribe()

    const equipmentChannel = supabase
      .channel('executive-equipment-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, () => loadData())
      .subscribe()

    return () => {
      supabase.removeChannel(fleetChannel)
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(equipmentChannel)
    }
  }, [])

  const metrics = useMemo(() => {
    const totalFleet = fleet.length
    const deliveringFleet = fleet.filter((t) => t.status === 'delivering').length
    const delayedFleet = fleet.filter((t) => t.status === 'delayed').length
    const idleFleet = fleet.filter((t) => t.status === 'idle').length

    const totalOrders = orders.length
    const activeOrders = orders.filter(
      (o) =>
        o.status === 'assigned' ||
        o.status === 'in_transit' ||
        o.status === 'at_pickup'
    ).length
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length
    const pendingOrders = orders.filter((o) => o.status === 'pending').length

    const machinesRunning = equipment.filter((m) => m.status === 'running').length
    const machinesDown = equipment.filter((m) => m.status === 'down').length
    const avgOutput =
      equipment.length > 0
        ? Math.round(
            equipment.reduce((sum, item) => sum + (item.output_percent || 0), 0) /
              equipment.length
          )
        : 0

    const operationalHealthScore = Math.max(
      0,
      Math.min(
        100,
        100 - delayedFleet * 8 - machinesDown * 10 - pendingOrders * 2 + deliveringFleet * 2
      )
    )

    return {
      totalFleet,
      deliveringFleet,
      delayedFleet,
      idleFleet,
      totalOrders,
      activeOrders,
      deliveredOrders,
      pendingOrders,
      machinesRunning,
      machinesDown,
      avgOutput,
      operationalHealthScore,
    }
  }, [fleet, orders, equipment])

  const executiveSummary = useMemo(() => {
    if (metrics.operationalHealthScore >= 85) {
      return 'Operations appear stable with strong visibility across fleet, orders, and equipment.'
    }
    if (metrics.operationalHealthScore >= 65) {
      return 'Operations are active, but delays or downtime are creating moderate risk that should be addressed.'
    }
    return 'Operational risk is elevated. Current delays and downtime suggest a strong need for immediate intervention and process visibility.'
  }, [metrics.operationalHealthScore])

  const topRisks = useMemo(() => {
    const risks: string[] = []

    if (metrics.delayedFleet > 0) {
      risks.push(`${metrics.delayedFleet} delayed truck${metrics.delayedFleet > 1 ? 's are' : ' is'} impacting delivery reliability.`)
    }

    if (metrics.machinesDown > 0) {
      risks.push(`${metrics.machinesDown} machine${metrics.machinesDown > 1 ? 's are' : ' is'} down, increasing production risk.`)
    }

    if (metrics.pendingOrders > 3) {
      risks.push(`${metrics.pendingOrders} pending orders suggest dispatch bottlenecks or available capacity issues.`)
    }

    if (risks.length === 0) {
      risks.push('No major operational risks detected right now.')
    }

    return risks
  }, [metrics])

  const roiSnapshot = useMemo(() => {
    const downtimeCostMonthly = metrics.machinesDown * 12000
    const delayCostMonthly = metrics.delayedFleet * 6000
    const visibilityValueMonthly = metrics.activeOrders * 1800
    const estimatedMonthlyBenefit =
      downtimeCostMonthly * 0.2 +
      delayCostMonthly * 0.25 +
      visibilityValueMonthly

    const boxflowMonthlyCost = 25000
    const netMonthlyImpact = estimatedMonthlyBenefit - boxflowMonthlyCost
    const annualImpact = netMonthlyImpact * 12

    return {
      estimatedMonthlyBenefit,
      boxflowMonthlyCost,
      netMonthlyImpact,
      annualImpact,
    }
  }, [metrics])

  function money(value: number) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #020617 0%, #0b1220 45%, #111827 100%)',
        color: 'white',
        padding: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '26px',
        }}
      >
        <div>
          <div
            style={{
              color: '#38bdf8',
              fontWeight: 900,
              fontSize: '14px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Powered by MADE Inc.
          </div>

          <h1
            style={{
              fontSize: '42px',
              margin: 0,
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            Executive Dashboard
          </h1>

          <p
            style={{
              color: '#94a3b8',
              marginTop: '10px',
              fontSize: '16px',
              maxWidth: '760px',
              lineHeight: 1.7,
            }}
          >
            High-level operational visibility across fleet movement, order flow,
            production health, financial opportunity, and pilot readiness.
          </p>
        </div>

        <div
          style={{
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '14px 16px',
            minWidth: '220px',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '13px' }}>Last Updated</div>
          <div style={{ fontWeight: 800, marginTop: '6px' }}>{lastUpdated}</div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '16px',
          marginBottom: '22px',
        }}
      >
        <KpiCard
          title="Operational Health"
          value={`${metrics.operationalHealthScore}%`}
          accent="#22c55e"
          subtitle="Overall live score"
        />
        <KpiCard
          title="Active Orders"
          value={String(metrics.activeOrders)}
          accent="#38bdf8"
          subtitle={`${metrics.totalOrders} total orders`}
        />
        <KpiCard
          title="Fleet In Motion"
          value={String(metrics.deliveringFleet)}
          accent="#a855f7"
          subtitle={`${metrics.totalFleet} total fleet units`}
        />
        <KpiCard
          title="Machines Down"
          value={String(metrics.machinesDown)}
          accent="#ef4444"
          subtitle={`${metrics.machinesRunning} running`}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.85fr',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        <section style={panelStyle}>
          <div style={panelTitleStyle}>Executive Summary</div>
          <p style={bodyStyle}>{executiveSummary}</p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '14px',
              marginTop: '18px',
            }}
          >
            <MiniStat title="Delivered Orders" value={String(metrics.deliveredOrders)} />
            <MiniStat title="Pending Orders" value={String(metrics.pendingOrders)} />
            <MiniStat title="Idle Fleet" value={String(metrics.idleFleet)} />
            <MiniStat title="Average Output" value={`${metrics.avgOutput}%`} />
          </div>
        </section>

        <section style={panelStyle}>
          <div style={panelTitleStyle}>Top Risk Indicators</div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {topRisks.map((risk) => (
              <RiskRow key={risk} text={risk} />
            ))}
          </div>
        </section>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <section style={panelStyle}>
          <div style={panelTitleStyle}>Live ROI Snapshot</div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <MoneyRow label="Estimated Monthly Benefit" value={money(roiSnapshot.estimatedMonthlyBenefit)} />
            <MoneyRow label="Estimated Monthly BoxFlow Cost" value={money(roiSnapshot.boxflowMonthlyCost)} />
            <MoneyRow label="Net Monthly Impact" value={money(roiSnapshot.netMonthlyImpact)} strong />
            <MoneyRow label="Estimated Annual Impact" value={money(roiSnapshot.annualImpact)} strong />
          </div>

          <p style={{ ...bodyStyle, marginTop: '14px' }}>
            This executive estimate converts operational visibility into financial value using downtime,
            delay reduction, and improved execution assumptions.
          </p>
        </section>

        <section style={panelStyle}>
          <div style={panelTitleStyle}>Pilot Pricing Snapshot</div>

          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              padding: '14px',
            }}
          >
            <MoneyRow label="Pilot Setup Fee" value="$50,000" />
            <MoneyRow label="Pilot Monthly Fee" value="$15,000" />
            <MoneyRow label="Enterprise Rollout Range" value="$25,000+/mo" strong />
          </div>

          <p style={{ ...bodyStyle, marginTop: '14px' }}>
            Recommended approach: deploy one facility first, measure impact, then expand to additional locations.
          </p>
        </section>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <section style={panelStyle}>
          <div style={panelTitleStyle}>Presentation Jump Links</div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '12px',
            }}
          >
            <JumpLink href="/dashboard" label="Command Center" />
            <JumpLink href="/fleet" label="Fleet Map" />
            <JumpLink href="/orders" label="AI Dispatch" />
            <JumpLink href="/equipment" label="Equipment" />
            <JumpLink href="/client" label="Client Portal" />
            <JumpLink href="/roi" label="ROI Calculator" />
          </div>
        </section>

        <section style={panelStyle}>
          <div style={panelTitleStyle}>Pilot Recommendation</div>

          <p style={bodyStyle}>
            Recommended next step: run a pilot inside one facility to measure
            improvements in downtime visibility, fleet response time, dispatch
            efficiency, and order transparency.
          </p>

          <div
            style={{
              marginTop: '18px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              padding: '14px',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: '10px' }}>
              Pilot Success Metrics
            </div>

            <PilotMetric text="Reduction in operational blind spots" />
            <PilotMetric text="Improvement in order status visibility" />
            <PilotMetric text="Reduction in delay response time" />
            <PilotMetric text="Executive confidence in live decision-making" />
          </div>
        </section>
      </div>

      <div style={{ marginTop: '20px', ...panelStyle }}>
        <div style={panelTitleStyle}>Boardroom Talk Track</div>

        <p style={bodyStyle}>
          “BoxFlow OS gives leadership one place to see the health of production,
          logistics, and order execution in real time.”
        </p>

        <p style={bodyStyle}>
          “Instead of reacting late, this creates earlier visibility, faster
          decisions, and a stronger customer experience.”
        </p>

        <p style={bodyStyle}>
          “The next step is not a massive rollout. The next step is one pilot
          facility to prove value and scale from there.”
        </p>
      </div>
    </main>
  )
}

function KpiCard({
  title,
  value,
  accent,
  subtitle,
}: {
  title: string
  value: string
  accent: string
  subtitle: string
}) {
  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
        padding: '18px',
        boxShadow: `0 0 20px ${accent}18`,
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: '13px' }}>{title}</div>
      <div
        style={{
          fontSize: '34px',
          fontWeight: 900,
          color: accent,
          marginTop: '8px',
        }}
      >
        {value}
      </div>
      <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
        {subtitle}
      </div>
    </div>
  )
}

function MiniStat({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '14px',
      }}
    >
      <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>
        {title}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 800 }}>{value}</div>
    </div>
  )
}

function RiskRow({ text }: { text: string }) {
  return (
    <div
      style={{
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.22)',
        borderRadius: '12px',
        padding: '12px 14px',
        color: '#fecaca',
        lineHeight: 1.6,
      }}
    >
      {text}
    </div>
  )
}

function MoneyRow({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontWeight: strong ? 800 : 500,
      }}
    >
      <span style={{ color: strong ? 'white' : '#cbd5e1' }}>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function JumpLink({
  href,
  label,
}: {
  href: string
  label: string
}) {
  return (
    <a
      href={href}
      style={{
        textDecoration: 'none',
        color: 'white',
        background: 'rgba(37,99,235,0.16)',
        border: '1px solid rgba(59,130,246,0.35)',
        borderRadius: '12px',
        padding: '14px',
        fontWeight: 800,
        textAlign: 'center',
      }}
    >
      {label}
    </a>
  )
}

function PilotMetric({ text }: { text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '8px',
        color: '#e2e8f0',
      }}
    >
      <span style={{ color: '#38bdf8', fontWeight: 900 }}>•</span>
      <span>{text}</span>
    </div>
  )
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(15,23,42,0.92)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '18px',
  padding: '20px',
}

const panelTitleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 900,
  marginBottom: '14px',
}

const bodyStyle: React.CSSProperties = {
  color: '#cbd5e1',
  lineHeight: 1.8,
  fontSize: '16px',
}