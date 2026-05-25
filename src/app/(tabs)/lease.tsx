// app/(tabs)/lease.tsx
import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, RefreshControl, Share, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export default function LeaseScreen() {
  const [session, setSession] = useState<any>(null)
  const [lease, setLease]     = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load(refresh = false) {
    if (refresh) setRefreshing(true)
    const raw = await AsyncStorage.getItem('pf_tenant_session')
    if (!raw) return
    const s = JSON.parse(raw); setSession(s)
    const res = await fetch(`${SB_URL}/rest/v1/pf_leases?tenant_id=eq.${s.tenant.id}&status=eq.active&select=*&limit=1`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } })
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) setLease(data[0])
    setLoading(false); setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  async function shareLeaseSummary() {
    const t = session?.tenant; const u = session?.unit; const o = session?.org
    if (!lease) return
    const text = [
      '═══════════════════════════════',
      '     LEASE SUMMARY',
      '═══════════════════════════════',
      `Property: ${o?.name}`,
      `Tenant:   ${t?.full_name}`,
      `Unit:     ${u?.unit_number} (${u?.type} · ${u?.sqft} sqft)`,
      '───────────────────────────────',
      `Lease Start:   ${new Date(lease.lease_start).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}`,
      `Lease End:     ${new Date(lease.lease_end).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}`,
      `Monthly Rent:  $${Number(lease.monthly_rent).toFixed(2)}`,
      `Sec. Deposit:  $${Number(lease.security_deposit).toFixed(2)}`,
      '───────────────────────────────',
      'INCLUDED: Water, Trash',
      'LATE FEE: $50 if paid after 5th',
      `PET POLICY: ${lease.pet_policy ?? 'No pets without approval'}`,
      '═══════════════════════════════',
      `${o?.name} · ${o?.phone}`,
      'Generated via PropFlow Tenant App',
    ].join('\n')
    await Share.share({ message: text, title: 'Lease Summary' })
  }

  const daysLeft = lease ? Math.ceil((new Date(lease.lease_end).getTime() - Date.now()) / 86400000) : 0
  const t = session?.tenant; const u = session?.unit; const o = session?.org

  const details = !lease ? [] : [
    { label: 'Lease Start',   value: new Date(lease.lease_start).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) },
    { label: 'Lease End',     value: new Date(lease.lease_end).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) },
    { label: 'Monthly Rent',  value: `$${Number(lease.monthly_rent).toFixed(2)}` },
    { label: 'Sec. Deposit',  value: `$${Number(lease.security_deposit).toFixed(2)}` },
    { label: 'Days Remaining',value: `${daysLeft} days` },
    { label: 'Signed',        value: lease.signed_date ? new Date(lease.signed_date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—' },
  ]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#4f8ef7" />}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Lease</Text>
        <Text style={styles.headerSub}>Active lease agreement details</Text>
      </View>

      {loading ? <Text style={styles.emptyText}>Loading...</Text> : !lease ? (
        <Text style={styles.emptyText}>No active lease found. Contact your property manager.</Text>
      ) : (
        <>
          <View style={styles.statusBanner}>
            <View>
              <Text style={styles.propertyName}>{o?.name}</Text>
              <Text style={styles.unitText}>Unit {u?.unit_number} · {u?.type} · {u?.sqft} sqft</Text>
            </View>
            <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>● Active</Text></View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>LEASE DETAILS</Text>
            {details.map((d, i) => (
              <View key={i} style={[styles.row, i < details.length - 1 && styles.rowBorder]}>
                <Text style={styles.rowLabel}>{d.label}</Text>
                <Text style={[styles.rowValue, d.label === 'Days Remaining' && { color: daysLeft < 60 ? '#f59e0b' : '#22c55e' }]}>{d.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>UNIT DETAILS</Text>
            {[
              ['Unit Number', u?.unit_number], ['Type', u?.type],
              ['Square Feet', `${u?.sqft} sqft`], ['Bedrooms', u?.bedrooms], ['Bathrooms', u?.bathrooms],
            ].map(([label, value], i) => (
              <View key={i} style={[styles.row, i < 4 && styles.rowBorder]}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowValue}>{value ?? '—'}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>POLICIES</Text>
            {[
              ['Utilities Included', 'Water, Trash'],
              ['Rent Due', '1st of each month'],
              ['Late Fee', '$50 after the 5th'],
              ['Pet Policy', lease.pet_policy ?? 'No pets without written approval'],
              ['Parking', 'One assigned space per unit'],
              ['Guests', 'No overnight guests over 7 consecutive days'],
            ].map(([label, value], i) => (
              <View key={i} style={[styles.row, i < 5 && styles.rowBorder]}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={[styles.rowValue, { maxWidth: '55%', textAlign: 'right' }]}>{value}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.shareBtn} onPress={shareLeaseSummary} activeOpacity={0.8}>
            <Text style={styles.shareBtnText}>📤  Share Lease Summary</Text>
          </TouchableOpacity>

          <View style={styles.contactBox}>
            <Text style={styles.contactTitle}>📞 Questions about your lease?</Text>
            <Text style={styles.contactText}>{o?.phone ?? '—'}</Text>
            <Text style={styles.contactAddress}>{o?.address}, {o?.city}, {o?.state}</Text>
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#050d1a' },
  content:         { paddingBottom: 40 },
  header:          { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#070f1f', borderBottomWidth: 1, borderBottomColor: 'rgba(79,142,247,0.1)' },
  headerTitle:     { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub:       { fontSize: 11, color: '#475569', marginTop: 2 },
  emptyText:       { color: '#334155', textAlign: 'center', marginTop: 40, fontSize: 14, padding: 20 },
  statusBanner:    { margin: 16, padding: 18, backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  propertyName:    { fontSize: 15, fontWeight: '800', color: '#f0f6ff', marginBottom: 3 },
  unitText:        { fontSize: 12, color: '#64748b' },
  activeBadge:     { backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
  activeBadgeText: { fontSize: 11, color: '#22c55e', fontWeight: '700' },
  card:            { marginHorizontal: 16, marginBottom: 14, backgroundColor: '#070f1f', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: 'rgba(79,142,247,0.1)' },
  cardLabel:       { fontSize: 9, color: '#4f8ef7', fontWeight: '700', letterSpacing: 2, marginBottom: 14, textTransform: 'uppercase' },
  row:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10 },
  rowBorder:       { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  rowLabel:        { fontSize: 13, color: '#475569' },
  rowValue:        { fontSize: 13, color: '#94a3b8', fontWeight: '600', flex: 1, textAlign: 'right' },
  shareBtn:        { marginHorizontal: 16, marginBottom: 14, backgroundColor: 'rgba(79,142,247,0.1)', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(79,142,247,0.2)' },
  shareBtnText:    { fontSize: 14, fontWeight: '700', color: '#4f8ef7' },
  contactBox:      { marginHorizontal: 16, backgroundColor: 'rgba(79,142,247,0.06)', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: 'rgba(79,142,247,0.1)' },
  contactTitle:    { fontSize: 13, fontWeight: '700', color: '#4f8ef7', marginBottom: 8 },
  contactText:     { fontSize: 18, fontWeight: '800', color: '#4f8ef7', marginBottom: 3 },
  contactAddress:  { fontSize: 12, color: '#475569' },
})