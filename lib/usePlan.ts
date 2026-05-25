// hooks/usePlan.ts
// Drop this in: lib/usePlan.ts or hooks/usePlan.ts

export type PlanTier = 'landlord' | 'professional' | 'enterprise'

export type AddonKey =
  | 'ach_payments'
  | 'income_verification'
  | 'gps_tracker'
  | 'community_board'
  | 'accounting'
  | 'payroll'
  | 'analytics'
  | 'tenant_app'

// Features included per plan — no add-on needed
const PLAN_FEATURES: Record<PlanTier, AddonKey[]> = {
  landlord: ['tenant_app'],
  professional: [
    'ach_payments', 'income_verification', 'gps_tracker',
    'community_board', 'accounting', 'payroll', 'analytics', 'tenant_app'
  ],
  enterprise: [
    'ach_payments', 'income_verification', 'gps_tracker',
    'community_board', 'accounting', 'payroll', 'analytics', 'tenant_app'
  ],
}

export const ADDON_INFO: Record<AddonKey, { label: string; price: number; description: string; icon: string }> = {
  ach_payments:        { label: 'ACH Payments',        price: 19,  icon: '🏦', description: 'Free bank-to-bank rent collection. No transaction fees.' },
  income_verification: { label: 'Income Verification', price: 14,  icon: '📋', description: 'Document upload, 3× income check, approve or deny applicants.' },
  gps_tracker:         { label: 'GPS Bus Tracker',      price: 9,   icon: '🚌', description: 'Live shuttle tracking with push notifications for tenants.' },
  community_board:     { label: 'Community Board',      price: 9,   icon: '💬', description: 'Privacy-protected resident community for your property.' },
  accounting:          { label: 'Accounting & Insights',price: 24,  icon: '📊', description: 'P&L, NOI, collection rate, transaction ledger.' },
  payroll:             { label: 'Payroll & HR',         price: 39,  icon: '💸', description: 'Employee records, payroll runs, pay stubs, 401k, tax deductions.' },
  analytics:           { label: 'Business Analytics',   price: 19,  icon: '📈', description: 'Occupancy, lease tracking, maintenance costs, vacancy readiness.' },
  tenant_app:          { label: 'Tenant Mobile App',    price: 0,   icon: '📱', description: 'PropFlow Tenant app — included with all plans.' },
}

export const PLAN_INFO = {
  landlord: {
    name: 'Landlord',
    price: 89,
    unitLimit: 10,
    description: 'Perfect for individual landlords with a few properties.',
    color: '#4f8ef7',
    stripeMonthlyPriceId: 'price_landlord_monthly', // replace with real Stripe price ID
  },
  professional: {
    name: 'Professional',
    price: 249,
    unitLimit: 100,
    description: 'Full-featured platform for property management companies.',
    color: '#a855f7',
    stripeMonthlyPriceId: 'price_professional_monthly',
  },
  enterprise: {
    name: 'Enterprise',
    price: 0,
    unitLimit: 9999,
    description: 'Custom pricing for large portfolios and enterprise needs.',
    color: '#f59e0b',
    stripeMonthlyPriceId: '',
  },
}

// Check if an org has access to a feature
export function hasFeatureAccess(
  plan: PlanTier,
  feature: AddonKey,
  enabledAddons: AddonKey[] = []
): boolean {
  if (PLAN_FEATURES[plan]?.includes(feature)) return true
  if (enabledAddons.includes(feature)) return true
  return false
}

// Stripe add-on price IDs — replace with real ones from Stripe dashboard
export const ADDON_STRIPE_PRICE_IDS: Record<AddonKey, string> = {
  ach_payments:        'price_ach_monthly',
  income_verification: 'price_income_monthly',
  gps_tracker:         'price_gps_monthly',
  community_board:     'price_community_monthly',
  accounting:          'price_accounting_monthly',
  payroll:             'price_payroll_monthly',
  analytics:           'price_analytics_monthly',
  tenant_app:          '',
}