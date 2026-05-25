// app/(tabs)/notifications.tsx
import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

function notifIcon(type: string) {
  const icons: Record<string,string> = {
    maintenance_update: '🔧', rent_due: '💰', rent_late: '🔴',
    bus_arriving: '🚌', community_post: '💬', management_notice: '📢',
    lease_renewal: '📋'
  }
  return icons[type] ?? '🔔'
}

function notifColor(type: string) {
  if (type === 'rent_late')    return '#ef4444'
  if (type === 'rent_due')     return '#f59e0b'
  if (type === 'bus_arriving') return '#22c55e'
  if (type === 'maintenance_update') return '#a855f7'
  return '#4f8ef7'
}

export default function NotificationsScreen() {
  const [session, setSession]   = useState<any>(null)
  const [notifs, setNotifs]     = useState<any[]>([])
  const [notices, setNotices]   = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load(refresh = false) {
    if (refresh) setRefreshing(true)
    const raw = await AsyncStorage.getItem('pf_tenant_session')
    if (!raw) return
    const s = JSON.parse(raw)
    setSession(s)
    const [n, notices] = await Promise.all([
      fetch(`${SB_URL}/rest/v1/pf_tenant_notifications?tenant_id=eq.${s.tenant.id}&select=*&order=created_at.desc&limit=40`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }).then(r => r.json()),
      fetch(`${SB_URL}/rest/v1/pf_notices?tenant_id=eq.${s.tenant.id}&select=*&order=sent_at.desc`, { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }).then(r => r.json()),
    ])
    if (Array.isArray(n)) setNotifs(n)
    if (Array.isArray(notices)) setNotices(notices)
    setLoading(false); setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  async function markAllRead() {
    const s = JSON.parse(await AsyncStorage.getItem('pf_tenant_session') ?? '{}')
    await fetch(`${SB_URL}/rest/v1/pf_tenant_notifications?tenant_id=eq.${s.tenant.id}&read=eq.false`, {
      method: 'PATCH',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ read: true })
    })
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifs.filter(n => !n.read).length

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSub}>Maintenance · Rent · Bus · Management</Text>
        </View>
        {unread > 0 && (
          <TouchableOpacity style={styles.markReadBtn} onPress={markAllRead} activeOpacity={0.8}>
            <Text style={styles.markReadText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#4f8ef7" />}>
        {notices.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>FROM MANAGEMENT</Text>
            {notices.map((n: any, i: number) => (
              <View key={i} style={[styles.notifCard, !n.read_at && styles.notifCardUnread]}>
                <Text style={styles.notifIcon}>📢</Text>
                <View style={styles.notifBody}>
                  <Text style={[styles.notifTitle, !n.read_at && styles.notifTitleUnread]}>{n.title}</Text>
                  <Text style={styles.notifMessage}>{n.message}</Text>
                  <Text style={styles.notifTime}>{new Date(n.sent_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</Text>
                </View>
                {!n.read_at && <View style={styles.unreadDot} />}
              </View>
            ))}
            <Text style={styles.sectionLabel}>ACTIVITY</Text>
          </>
        )}
        {loading ? <Text style={styles.emptyText}>Loading...</Text>
        : notifs.length === 0 ? <Text style={styles.emptyText}>No notifications yet.</Text>
        : notifs.map((n: any, i: number) => (
          <View key={i} style={[styles.notifCard, !n.read && styles.notifCardUnread]}>
            <View style={[styles.notifIconWrap, { backgroundColor: notifColor(n.type) + '15' }]}>
              <Text style={styles.notifIcon}>{notifIcon(n.type)}</Text>
            </View>
            <View style={styles.notifBody}>
              <Text style={[styles.notifTitle, !n.read && styles.notifTitleUnread]}>{n.title}</Text>
              <Text style={styles.notifMessage} numberOfLines={2}>{n.message}</Text>
              <Text style={styles.notifTime}>{new Date(n.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true})}</Text>
            </View>
            {!n.read && <View style={[styles.unreadDot, { backgroundColor: notifColor(n.type) }]} />}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#050d1a' },
  header:          { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#070f1f', borderBottomWidth: 1, borderBottomColor: 'rgba(79,142,247,0.1)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle:     { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub:       { fontSize: 11, color: '#475569', marginTop: 2 },
  markReadBtn:     { padding: 8, backgroundColor: 'rgba(79,142,247,0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(79,142,247,0.2)' },
  markReadText:    { fontSize: 11, color: '#4f8ef7', fontWeight: '700' },
  list:            { padding: 16, gap: 10, paddingBottom: 40 },
  sectionLabel:    { fontSize: 9, color: '#334155', fontWeight: '700', letterSpacing: 2, marginBottom: 6, marginTop: 8 },
  notifCard:       { flexDirection: 'row', backgroundColor: '#070f1f', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', gap: 12, alignItems: 'flex-start' },
  notifCardUnread: { backgroundColor: 'rgba(79,142,247,0.05)', borderColor: 'rgba(79,142,247,0.15)' },
  notifIconWrap:   { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifIcon:       { fontSize: 20 },
  notifBody:       { flex: 1, gap: 3 },
  notifTitle:      { fontSize: 13, fontWeight: '500', color: '#94a3b8' },
  notifTitleUnread:{ fontWeight: '700', color: '#f0f6ff' },
  notifMessage:    { fontSize: 12, color: '#475569', lineHeight: 17 },
  notifTime:       { fontSize: 10, color: '#334155' },
  unreadDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4f8ef7', flexShrink: 0, marginTop: 4 },
  emptyText:       { color: '#334155', textAlign: 'center', marginTop: 40, fontSize: 14 },
})