'use client'

import { useEffect, useState } from 'react'
import { cannaSupabase } from '@/lib/cannaflowSupabase'
import CannaLayout from '../components/CannaLayout'

export default function LoyaltyPage() {
  const [rewards, setRewards] = useState<any[]>([])

  async function loadRewards() {
    const { data, error } = await cannaSupabase
      .from('canna_rewards')
      .select('*')
      .order('points', { ascending: false })

    console.log('Rewards Data:', data)
    console.log('Rewards Error:', error)

    if (error) {
      console.error('Rewards error:', error.message)
      return
    }

    setRewards(data || [])
  }

  useEffect(() => {
    loadRewards()
  }, [])

  const totalPoints = rewards.reduce((sum, r) => sum + Number(r.points || 0), 0)
  const redeemed = rewards.reduce((sum, r) => sum + Number(r.rewards_redeemed || 0), 0)
  const vipMembers = rewards.filter((r) => r.tier === 'Gold' || r.tier === 'Platinum').length

  return (
    <CannaLayout title="Loyalty & Rewards">
      <div style={grid}>
        <div style={card}>
          <h2 style={value}>{totalPoints}</h2>
          <p style={label}>Total Points</p>
        </div>

        <div style={card}>
          <h2 style={value}>{vipMembers}</h2>
          <p style={label}>VIP Members</p>
        </div>

        <div style={card}>
          <h2 style={value}>{redeemed}</h2>
          <p style={label}>Rewards Redeemed</p>
        </div>

        <div style={card}>
          <h2 style={value}>{rewards.length}</h2>
          <p style={label}>Active Members</p>
        </div>
      </div>

      <div style={catalogBox}>
        <h2 style={{ marginTop: 0 }}>Rewards Catalog</h2>

        <div style={rewardRow}>
          <strong>100 Points</strong>
          <span>10% Off Purchase</span>
        </div>

        <div style={rewardRow}>
          <strong>250 Points</strong>
          <span>Free Pre-Roll</span>
        </div>

        <div style={rewardRow}>
          <strong>500 Points</strong>
          <span>Free Product</span>
        </div>

        <div style={rewardRow}>
          <strong>1000 Points</strong>
          <span>Platinum VIP</span>
        </div>
      </div>

      <div style={tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Customer</th>
              <th style={th}>Points</th>
              <th style={th}>Tier</th>
              <th style={th}>Rewards Redeemed</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {rewards.map((reward) => (
              <tr key={reward.id}>
                <td style={td}>{reward.customer_name}</td>
                <td style={td}>{reward.points}</td>
                <td style={td}>
                  <span style={getTierStyle(reward.tier)}>
                    {reward.tier}
                  </span>
                </td>
                <td style={td}>{reward.rewards_redeemed}</td>
                <td style={td}>
                  {reward.points >= 100 ? 'Reward Eligible' : 'Keep Earning'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CannaLayout>
  )
}

function getTierStyle(tier: string) {
  if (tier === 'Platinum') return platinumBadge
  if (tier === 'Gold') return goldBadge
  if (tier === 'Silver') return silverBadge
  return bronzeBadge
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4,1fr)',
  gap: 18,
  marginBottom: 24
}

const card = {
  background: '#0f172a',
  border: '1px solid rgba(16,185,129,.25)',
  borderRadius: 20,
  padding: 24
}

const value = {
  color: '#6ee7b7',
  fontSize: 34,
  fontWeight: 950,
  margin: 0
}

const label = {
  color: '#94a3b8',
  margin: '8px 0 0'
}

const catalogBox = {
  background: '#0f172a',
  border: '1px solid rgba(16,185,129,.25)',
  borderRadius: 20,
  padding: 28,
  marginBottom: 24
}

const rewardRow = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid rgba(255,255,255,.08)',
  padding: '14px 0',
  color: '#cbd5e1'
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

const bronzeBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(180,83,9,.15)',
  color: '#f59e0b',
  fontWeight: 800
}

const silverBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(148,163,184,.15)',
  color: '#cbd5e1',
  fontWeight: 800
}

const goldBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(245,158,11,.15)',
  color: '#fbbf24',
  fontWeight: 800
}

const platinumBadge = {
  padding: '6px 10px',
  borderRadius: 999,
  background: 'rgba(59,130,246,.15)',
  color: '#93c5fd',
  fontWeight: 800
}