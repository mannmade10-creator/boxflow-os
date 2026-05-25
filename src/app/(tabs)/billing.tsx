// app/(tabs)/billing.tsx — Billing statements with share/print
import { useState, useEffect } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Share, Alert
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

function statusColor(s: string) {
  if (s === 'paid')     return '#22c55e'
  if (s === 'unpaid')   return '#f59e0b'
  if (s === 'late')     return '#ef4444'
  if (s === 'upcoming') return '#3b82f6'
  return '#475569'
}
function statusLabel(s: string) {
  if (s === 'paid')     return '✓ Paid'
  if (s === 'unpaid')   return '⚠ Due'
  if (s === 'late')     return '🔴 Late'
  if (s === 'upcoming') return '○ Upcoming'
  return s
}

export default function BillingScreen() {
  const [session, setSession]       = useState<any>(null)
  const [statements, setStatements] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter]         = useState('all')

  async function load(refresh = false) {
    if (refresh) setRefreshing(true)
    const raw = await AsyncStorage.getItem('pf_tenant_session')
    if (!raw) { setLoading(false); return }
    const s = JSON.parse(raw)
    setSession(s)
    const res = await fetch(`${SB_URL}/rest/v1/pf_billing_statements?tenant_id=eq.${s.tenant.id}&select=*&order=statement_month.desc&limit=24`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    })
    const data = await res.json()
    if (Array.isArray(data)) setStatements(data)
    setLoading(false); setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  async function shareStatement(stmt: any) {
    const tenant = session?.tenant
    const unit   = session?.unit
    const org    = session?.org
    const text = [
      '═══════════════════════════════',
      `     BILLING STATEMENT`,
      '═══════════════════════════════',
      `Property: ${org?.name ?? 'My Property'}`,
      `Tenant:   ${tenant?.full_name}`,
      `Unit:     ${unit?.unit_number}`,
      `Period:   ${new Date(stmt.statement_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      `Due Date: ${new Date(stmt.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      '───────────────────────────────',
      `Base Rent:    $${Number(stmt.base_rent).toFixed(2)}`,
      stmt.late_fee > 0 ? `Late Fee:     $${Number(stmt.late_fee).toFixed(2)}` : null,
      stmt.other_charges > 0 ? `Other:        $${Number(stmt.other_charges).toFixed(2)}` : null,
      stmt.credits > 0 ? `Credits:     -$${Number(stmt.credits).toFixed(2)}` : null,
      '───────────────────────────────',
      `TOTAL DUE:    $${Number(stmt.total_due).toFixed(2)}`,
      stmt.amount_paid > 0 ? `Amount Paid: -$${Number(stmt.amount_paid).toFixed(2)}` : null,
      stmt.balance > 0 ? `Balance:      $${Number(stmt.balance).toFixed(2)}` : null,
      '───────────────────────────────',
      `Status: ${statusLabel(stmt.status)}`,
      '═══════════════════════════════',
      `${org?.name}`,
      `${org?.phone ?? ''}`,
      `Generated via PropFlow Tenant App`,
    ].filter(Boolean).join('\n')

    await Share.share({ message: text, title: 'Billing Statement' })
  }

  const currentBalance = statements.filter(s => ['unpaid','late','partial'].includes(s.status)).reduce((a, s) => a + Number(s.balance ?? s.total_due), 0)
  const filtered = filter === 'all' ? statements : statements.filter(s => s.status === filter)

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Billing Statements</Text>
        <Text style={styles.headerSub}>View and share your statements anytime</Text>
      </View>

      {/* Balance banner */}
      {currentBalance > 0 && (
        <View style={styles.balanceBanner}>
          <View>
            <Text style={styles.balanceLabel}>BALANCE DUE</Text>
            <Text style={styles.balanceAmount}>${currentBalance.toFixed(2)}</Text>
          </View>
          <Text style={styles.balanceIcon}>⚠️</Text>
        </View>
      )}

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterRow}>
        {['all','paid','unpaid','late','upcoming'].map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && { backgroundColor: statusColor(f === 'all' ? 'paid' : f), borderColor: statusColor(f === 'all' ? 'paid' : f) }]}
            activeOpacity={0.8}>
            <Text style={[styles.filterText, filter === f && { color: '#fff' }]}>
              {f === 'all' ? 'All' : statusLabel(f)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#4f8ef7" />}
      >
        {loading ? (
          <Text style={styles.emptyText}>Loading statements...</Text>
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>No statements found.</Text>
        ) : filtered.map((s: any, i: number) => (
          <View key={i} style={styles.stmtCard}>
            <View style={styles.stmtTop}>
              <View style={styles.stmtLeft}>
                <Text style={styles.stmtPeriod}>
                  {new Date(s.statement_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Text>
                <Text style={styles.stmtDue}>
                  Due {new Date(s.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {s.paid_date ? ` · Paid ${new Date(s.paid_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                </Text>
              </View>
              <View style={styles.stmtRight}>
                <Text style={styles.stmtAmount}>${Number(s.total_due).toFixed(2)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor(s.status) + '18', borderColor: statusColor(s.status) + '40' }]}>
                  <Text style={[styles.statusText, { color: statusColor(s.status) }]}>{statusLabel(s.status)}</Text>
                </View>
              </View>
            </View>

            {/* Line items */}
            <View style={styles.lineItems}>
              <View style={styles.lineItem}>
                <Text style={styles.lineLabel}>Base Rent</Text>
                <Text style={styles.lineValue}>${Number(s.base_rent).toFixed(2)}</Text>
              </View>
              {s.late_fee > 0 && (
                <View style={styles.lineItem}>
                  <Text style={[styles.lineLabel, { color: '#ef4444' }]}>Late Fee</Text>
                  <Text style={[styles.lineValue, { color: '#ef4444' }]}>+${Number(s.late_fee).toFixed(2)}</Text>
                </View>
              )}
              {s.credits > 0 && (
                <View style={styles.lineItem}>
                  <Text style={[styles.lineLabel, { color: '#22c55e' }]}>Credit</Text>
                  <Text style={[styles.lineValue, { color: '#22c55e' }]}>-${Number(s.credits).toFixed(2)}</Text>
                </View>
              )}
              {s.balance > 0 && (
                <View style={[styles.lineItem, styles.lineItemBalance]}>
                  <Text style={[styles.lineLabel, { fontWeight: '700', color: '#f59e0b' }]}>Balance Remaining</Text>
                  <Text style={[styles.lineValue, { fontWeight: '700', color: '#f59e0b' }]}>${Number(s.balance).toFixed(2)}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.shareBtn} onPress={() => shareStatement(s)} activeOpacity={0.8}>
              <Text style={styles.shareBtnText}>📤  Share / Save Statement</Text>
            </TouchableOpacity>
          </View>
        ))}
        <Text style={styles.footerNote}>Statements available 24/7 · Contact your property manager with questions</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#050d1a' },
  header:          { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#070f1f', borderBottomWidth: 1, borderBottomColor: 'rgba(79,142,247,0.1)' },
  headerTitle:     { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub:       { fontSize: 12, color: '#475569', marginTop: 2 },
  balanceBanner:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 16, padding: 16, backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(245,158,11,0.25)' },
  balanceLabel:    { fontSize: 9, color: '#f59e0b', fontWeight: '700', letterSpacing: 1.5 },
  balanceAmount:   { fontSize: 28, fontWeight: '900', color: '#f59e0b' },
  balanceIcon:     { fontSize: 28 },
  filterScroll:    { maxHeight: 52 },
  filterRow:       { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  filterBtn:       { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  filterText:      { fontSize: 12, fontWeight: '600', color: '#64748b' },
  list:            { padding: 16, gap: 12, paddingBottom: 40 },
  emptyText:       { color: '#334155', fontSize: 14, textAlign: 'center', marginTop: 40 },
  stmtCard:        { backgroundColor: '#070f1f', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  stmtTop:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  stmtLeft:        { flex: 1 },
  stmtPeriod:      { fontSize: 15, fontWeight: '800', color: '#f0f6ff', marginBottom: 3 },
  stmtDue:         { fontSize: 11, color: '#334155' },
  stmtRight:       { alignItems: 'flex-end', gap: 6 },
  stmtAmount:      { fontSize: 20, fontWeight: '900', color: '#f0f6ff' },
  statusBadge:     { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1 },
  statusText:      { fontSize: 10, fontWeight: '700' },
  lineItems:       { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 12, gap: 8, marginBottom: 14 },
  lineItem:        { flexDirection: 'row', justifyContent: 'space-between' },
  lineItemBalance: { borderTopWidth: 1, borderTopColor: 'rgba(245,158,11,0.2)', paddingTop: 8, marginTop: 4 },
  lineLabel:       { fontSize: 13, color: '#64748b' },
  lineValue:       { fontSize: 13, color: '#94a3b8', fontWeight: '600' },
  shareBtn:        { backgroundColor: 'rgba(79,142,247,0.1)', borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(79,142,247,0.2)' },
  shareBtnText:    { fontSize: 13, fontWeight: '700', color: '#4f8ef7' },
  footerNote:      { textAlign: 'center', fontSize: 11, color: '#1e293b', marginTop: 8 },
})