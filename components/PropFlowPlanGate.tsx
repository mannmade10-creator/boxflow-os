// components/PropFlowPlanGate.tsx
// Wrap any PropFlow feature page with this component
// Usage:
//   <PropFlowPlanGate feature="payroll" plan={org.subscription_plan} addons={enabledAddons}>
//     <PayrollContent />
//   </PropFlowPlanGate>

'use client'
import Link from 'next/link'
import { hasFeatureAccess, ADDON_INFO, PLAN_INFO, type AddonKey, type PlanTier } from '@/lib/usePlan'

interface Props {
  feature: AddonKey
  plan: PlanTier
  addons?: AddonKey[]
  children: React.ReactNode
  orgId?: string
}

export default function PropFlowPlanGate({ feature, plan, addons = [], children, orgId }: Props) {
  const hasAccess = hasFeatureAccess(plan, feature, addons)
  if (hasAccess) return <>{children}</>

  const addon    = ADDON_INFO[feature]
  const planInfo = PLAN_INFO[plan]

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>

        {/* Icon */}
        <div style={{ fontSize: 56, marginBottom: 20 }}>{addon.icon}</div>

        {/* Heading */}
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#f0f6ff', marginBottom: 8 }}>
          {addon.label}
        </h2>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 28 }}>
          {addon.description}
        </p>

        {/* Current plan */}
        <div style={{ background: '#070f1f', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 14, padding: '18px 24px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
            Your Current Plan
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: planInfo.color }}>
            {planInfo.name} — ${planInfo.price}/mo
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
            {planInfo.description}
          </div>
        </div>

        {/* Two options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>

          {/* Add-on option */}
          {addon.price > 0 && (
            <div style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 14, padding: '18px 16px' }}>
              <div style={{ fontSize: 11, color: '#4f8ef7', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
                Add This Feature
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#f0f6ff', marginBottom: 4 }}>
                +${addon.price}/mo
              </div>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 14, lineHeight: 1.5 }}>
                Keep your current plan and add just this feature
              </div>
              <Link href={`/propflow/plans?addon=${feature}`}
                style={{ display: 'block', padding: '10px 16px', background: '#4f8ef7', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
                Add {addon.label} →
              </Link>
            </div>
          )}

          {/* Upgrade option */}
          <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 14, padding: '18px 16px' }}>
            <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
              Upgrade Plan
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#f0f6ff', marginBottom: 4 }}>
              $249/mo
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 14, lineHeight: 1.5 }}>
              Professional plan — all features included, up to 100 units
            </div>
            <Link href="/propflow/plans?upgrade=professional"
              style={{ display: 'block', padding: '10px 16px', background: 'linear-gradient(135deg,#6b21a8,#a855f7)', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: 13, textDecoration: 'none' }}>
              Upgrade to Pro →
            </Link>
          </div>
        </div>

        <Link href="/propflow/plans" style={{ fontSize: 13, color: '#334155', textDecoration: 'none' }}>
          View all plans and pricing →
        </Link>
      </div>
    </div>
  )
}