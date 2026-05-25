// app/(tabs)/home.tsx — Home dashboard
import { useState, useEffect, useCallback } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Alert, Platform
} from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'

const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true }),
})

async function dbGet(table: string, params: string) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  })
  return res.json()
}

async function requestNotifications(tenantId: string) {
  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') return

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'PropFlow Alerts', importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250], lightColor: '#4f8ef7',
    })
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data
  // Save push token to Supabase
  await fetch(`${SB_URL}/rest/v1/pf_push_subscriptions`, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
    body: JSON.stringify({ tenant_id: tenantId, endpoint: token, p256dh: 'expo', auth: 'expo' })
  })
}

export default function HomeScreen() {
  const [session, setSession]     = useState<any>(null)
  const [statements, setStatements] = useState<any[]>([])
  const [maintenance, setMaintenance] = useState<any[]>([])
  const [lease, setLease]         = useState<any>(null)
  const [notifs, setNotifs]       = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    try {
      const raw = await AsyncStorage.getItem('pf_tenant_session')
      if (!raw) { router.replace('/login'); return }
      const s = JSON.parse(raw)
      setSession(s)

      const [stmts, maint, leaseData, notifData] = await Promise.all([
        dbGet('pf_billing_statements', `tenant_id=eq.${s.tenant.id}&select=*&order=statement_month.desc&limit=6`),
        dbGet('pf_maintenance_requests', `tenant_id=eq.${s.tenant.id}&status=in.(open,in_progress)&select=*&limit=5`),
        dbGet('pf_leases', `tenant_id=eq.${s.tenant.id}&status=eq.active&select=*&limit=1`),
        dbGet('pf_tenant_notifications', `tenant_id=eq.${s.tenant.id}&read=eq.false&select=*&order=created_at.desc&limit=5`),
      ])
      if (Array.isArray(stmts)) setStatements(stmts)
      if (Array.isArray(maint)) setMaintenance(maint)
      if (Array.isArray(leaseData) && leaseData.length > 0) setLease(leaseData[0])
      if (Array.isArray(notifData)) setNotifs(notifData)

      // Request push notification permission
      requestNotifications(s.tenant.id)
    } catch {}
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function signOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await AsyncStorage.removeItem('pf_tenant_session')
        router.replace('/login')
      }}
    ])
  }

  const tenant = session?.tenant
  const org    = session?.org
  const unit   = session?.unit
  const currentBalance = statements.filter(s => ['unpaid','late','partial'].includes(s.status)).reduce((a, s) => a + Number(s.balance ?? s.total_due), 0)
  const daysLeft = lease ? Math.ceil((new Date(lease.lease_end).getTime() - Date.now()) / 86400000) : 0
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const quickActions = [
    { icon: '💰', label: 'Billing', route: '/(tabs)/billing', color: '#4f8ef7' },
    { icon: '📄', label: 'Lease', route: '/(tabs)/lease', color: '#22c55e' },
    { icon: '🔧', label: 'Maintenance', route: '/(tabs)/maintenance', color: '#a855f7' },
    { icon: '🚌', label: 'Bus GPS', route: '/(tabs)/gps', color: '#22c55e' },
    { icon: '💬', label: 'Community', route: '/(tabs)/community', color: '#f59e0b' },
    { icon: '🔔', label: 'Notifications', route: '/(tabs)/notifications', color: '#ef4444' },
  ]

  if (loading) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading your portal...</Text>
    </View>
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#4f8ef7" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.orgDot, { backgroundColor: org?.primary_color ?? '#4f8ef7' }]} />
          <View>
            <Text style={styles.orgName}>{org?.name ?? 'My Property'}</Text>
            <Text style={styles.unitText}>Unit {unit?.unit_number ?? '—'} · Tenant Portal</Text>
          </View>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>{greeting},{'\n'}{tenant?.full_name?.split(' ')[0]}!</Text>
      <Text style={styles.greetingSub}>{org?.app_welcome_message ?? 'Your portal is ready.'}</Text>

      {/* Unread notification banner */}
      {notifs.length > 0 && (
        <TouchableOpacity style={styles.notifBanner} onPress={() => router.push('/(tabs)/notifications')} activeOpacity={0.8}>
          <Text style={styles.notifBannerIcon}>🔔</Text>
          <Text style={styles.notifBannerText}>You have {notifs.length} new notification{notifs.length > 1 ? 's' : ''}</Text>
          <Text style={styles.notifBannerArrow}>→</Text>
        </TouchableOpacity>
      )}

      {/* Stats */}
      <View style={styles.statsGrid}>
        <TouchableOpacity style={[styles.statCard, { borderColor: (currentBalance > 0 ? '#f59e0b' : '#22c55e') + '30' }]}
          onPress={() => router.push('/(tabs)/billing')} activeOpacity={0.8}>
          <Text style={styles.statLabel}>BALANCE DUE</Text>
          <Text style={[styles.statValue, { color: currentBalance > 0 ? '#f59e0b' : '#22c55e' }]}>
            {currentBalance > 0 ? `$${currentBalance.toFixed(2)}` : 'All Clear'}
          </Text>
          <Text style={styles.statSub}>{currentBalance > 0 ? 'Tap to view' : '✓ Paid up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.statCard, { borderColor: '#4f8ef730' }]}
          onPress={() => router.push('/(tabs)/billing')} activeOpacity={0.8}>
          <Text style={styles.statLabel}>MONTHLY RENT</Text>
          <Text style={[styles.statValue, { color: '#4f8ef7' }]}>${Number(unit?.rent_amount ?? 0).toFixed(0)}</Text>
          <Text style={styles.statSub}>Due 1st of month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.statCard, { borderColor: '#22c55e30' }]}
          onPress={() => router.push('/(tabs)/lease')} activeOpacity={0.8}>
          <Text style={styles.statLabel}>LEASE ENDS</Text>
          <Text style={[styles.statValue, { color: daysLeft < 60 ? '#f59e0b' : '#22c55e' }]}>
            {daysLeft > 0 ? `${daysLeft}d` : '—'}
          </Text>
          <Text style={styles.statSub}>{lease ? new Date(lease.lease_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : 'No lease'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.statCard, { borderColor: '#a855f730' }]}
          onPress={() => router.push('/(tabs)/maintenance')} activeOpacity={0.8}>
          <Text style={styles.statLabel}>OPEN REQUESTS</Text>
          <Text style={[styles.statValue, { color: '#a855f7' }]}>{maintenance.length}</Text>
          <Text style={styles.statSub}>Maintenance</Text>
        </TouchableOpacity>
      </View>

      {/* Quick actions */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map((a, i) => (
          <TouchableOpacity key={i} style={[styles.actionCard, { borderColor: a.color + '20' }]}
            onPress={() => router.push(a.route as any)} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>{a.icon}</Text>
            <Text style={styles.actionLabel}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Property contact */}
      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>📞 Property Contact</Text>
        <Text style={styles.contactText}>{org?.name}</Text>
        <Text style={styles.contactPhone}>{org?.phone ?? '—'}</Text>
        <Text style={styles.contactAddress}>{org?.address}{org?.city ? `, ${org.city}, ${org.state}` : ''}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#050d1a' },
  content:           { padding: 20, paddingTop: 56, paddingBottom: 40 },
  loadingContainer:  { flex: 1, backgroundColor: '#050d1a', alignItems: 'center', justifyContent: 'center' },
  loadingText:       { color: '#475569', fontSize: 14 },
  header:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerLeft:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orgDot:            { width: 10, height: 10, borderRadius: 5 },
  orgName:           { fontSize: 14, fontWeight: '800', color: '#f0f6ff' },
  unitText:          { fontSize: 10, color: '#475569', marginTop: 1 },
  signOutBtn:        { padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  signOutText:       { fontSize: 11, color: '#ef4444', fontWeight: '700' },
  greeting:          { fontSize: 28, fontWeight: '900', color: '#fff', lineHeight: 34, marginBottom: 6 },
  greetingSub:       { fontSize: 13, color: '#475569', marginBottom: 20, lineHeight: 19 },
  notifBanner:       { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(79,142,247,0.1)', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: 'rgba(79,142,247,0.2)', marginBottom: 20 },
  notifBannerIcon:   { fontSize: 18 },
  notifBannerText:   { flex: 1, fontSize: 13, fontWeight: '600', color: '#4f8ef7' },
  notifBannerArrow:  { fontSize: 14, color: '#4f8ef7' },
  statsGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard:          { flex: 1, minWidth: '45%', backgroundColor: '#070f1f', borderRadius: 14, padding: 16, borderWidth: 1 },
  statLabel:         { fontSize: 9, color: '#475569', fontWeight: '700', letterSpacing: 1.5, marginBottom: 6 },
  statValue:         { fontSize: 24, fontWeight: '900', marginBottom: 3 },
  statSub:           { fontSize: 10, color: '#334155' },
  sectionTitle:      { fontSize: 13, fontWeight: '700', color: '#475569', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  actionsGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  actionCard:        { flex: 1, minWidth: '29%', backgroundColor: '#070f1f', borderRadius: 14, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1 },
  actionIcon:        { fontSize: 26 },
  actionLabel:       { fontSize: 11, fontWeight: '700', color: '#94a3b8', textAlign: 'center' },
  contactCard:       { backgroundColor: 'rgba(79,142,247,0.06)', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: 'rgba(79,142,247,0.12)' },
  contactTitle:      { fontSize: 13, fontWeight: '700', color: '#4f8ef7', marginBottom: 8 },
  contactText:       { fontSize: 14, fontWeight: '700', color: '#f0f6ff', marginBottom: 3 },
  contactPhone:      { fontSize: 16, fontWeight: '800', color: '#4f8ef7', marginBottom: 3 },
  contactAddress:    { fontSize: 12, color: '#475569' },
})