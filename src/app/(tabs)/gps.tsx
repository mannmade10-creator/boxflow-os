// app/(tabs)/gps.tsx — Bus GPS tracker with push notifications
import { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Animated } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'

const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const SCHEDULE = [
  { time: '7:00 AM',  route: 'Penn Station → Walmart Supercenter',             days: 'Mon–Sat' },
  { time: '9:00 AM',  route: 'Penn Station → CVS → Dollar General → Return',   days: 'Mon–Sat' },
  { time: '12:00 PM', route: 'Penn Station → Walmart → Return',                days: 'Mon–Fri' },
  { time: '3:00 PM',  route: 'Penn Station → Walgreens → Return',              days: 'Mon–Sat' },
  { time: '5:30 PM',  route: 'Penn Station → Walmart Supercenter → Return',    days: 'Mon–Sat' },
  { time: '10:00 AM', route: 'Church Runs (by request — call office)',          days: 'Sunday' },
]

export default function GPSScreen() {
  const [busEvents, setBusEvents] = useState<any[]>([])
  const [arriving, setArriving]   = useState(false)
  const [eta, setEta]             = useState<number|null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const busAnim = useRef(new Animated.Value(0)).current

  async function load(refresh = false) {
    if (refresh) setRefreshing(true)
    const res = await fetch(`${SB_URL}/rest/v1/pf_bus_events?select=*&order=created_at.desc&limit=10`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    })
    const data = await res.json()
    if (Array.isArray(data)) {
      setBusEvents(data)
      const latest = data[0]
      if (latest?.event_type === 'arriving') {
        setArriving(true)
        setEta(latest.eta_minutes)
        // Push notification
        if (!latest.notified) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '🚌 Shuttle Arriving Soon!',
              body: `The shuttle is ${latest.eta_minutes} minutes away from the main entrance.`,
              sound: true,
            },
            trigger: null,
          })
        }
        // Animate bus
        Animated.loop(
          Animated.sequence([
            Animated.timing(busAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
            Animated.timing(busAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
          ])
        ).start()
      } else {
        setArriving(false); setEta(null)
      }
    }
    setRefreshing(false)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  const busX = busAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 30] })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚌 Shuttle Tracker</Text>
        <Text style={styles.headerSub}>Live position · Refreshes every 30 seconds</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#4f8ef7" />}>

        {/* Status banner */}
        <View style={[styles.statusBanner, { borderColor: arriving ? 'rgba(34,197,94,0.4)' : 'rgba(79,142,247,0.2)', backgroundColor: arriving ? 'rgba(34,197,94,0.08)' : 'rgba(79,142,247,0.06)' }]}>
          <View style={[styles.statusDot, { backgroundColor: arriving ? '#22c55e' : '#334155' }]} />
          <View style={styles.statusText}>
            <Text style={[styles.statusTitle, { color: arriving ? '#22c55e' : '#475569' }]}>
              {arriving ? `Shuttle Arriving in ${eta} minutes!` : 'Shuttle Not Currently Running'}
            </Text>
            <Text style={styles.statusSub}>
              {arriving ? 'Heading to main entrance — 1920 Heritage Park Dr' : 'Pull down to refresh for latest status'}
            </Text>
          </View>
        </View>

        {/* CSS property map */}
        <View style={styles.mapContainer}>
          {/* Roads */}
          <View style={styles.roadH} />
          <View style={styles.roadV} />
          {/* Property block */}
          <View style={styles.propertyBlock}>
            <Text style={styles.propertyLabel}>Penn Station{'\n'}Apartments</Text>
          </View>
          {/* Main entrance */}
          <View style={styles.entrancePin}>
            <View style={styles.greenDot} />
            <Text style={styles.entranceLabel}>Main Entrance</Text>
          </View>
          {/* Destinations */}
          <View style={[styles.destPin, { right: 20, top: 40 }]}>
            <View style={styles.amberDot} />
            <Text style={styles.destLabel}>Walmart</Text>
          </View>
          <View style={[styles.destPin, { right: 30, bottom: 50 }]}>
            <View style={styles.amberDot} />
            <Text style={styles.destLabel}>CVS</Text>
          </View>
          {/* Animated bus */}
          <Animated.View style={[styles.busPin, { transform: [{ translateX: busX }] }]}>
            <Text style={[styles.busEmoji, arriving && styles.busEmojiActive]}>🚌</Text>
            {arriving && eta !== null && <Text style={styles.busEta}>{eta} min</Text>}
          </Animated.View>
        </View>

        {/* Recent events */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>RECENT ACTIVITY</Text>
          {busEvents.length === 0 ? (
            <Text style={styles.emptyText}>No recent activity</Text>
          ) : busEvents.map((e: any, i: number) => (
            <View key={i} style={[styles.eventRow, i < busEvents.length - 1 && styles.eventRowBorder]}>
              <Text style={styles.eventIcon}>🚌</Text>
              <View style={styles.eventBody}>
                <Text style={[styles.eventType, { color: e.event_type === 'arriving' ? '#22c55e' : '#94a3b8' }]}>
                  {e.event_type === 'arriving' ? `Arriving in ${e.eta_minutes} min` : e.event_type === 'departed' ? 'Departed' : e.event_type}
                </Text>
                {e.location_name && <Text style={styles.eventLocation}>{e.location_name}</Text>}
              </View>
              <Text style={styles.eventTime}>
                {new Date(e.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </Text>
            </View>
          ))}
        </View>

        {/* Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>SHUTTLE SCHEDULE</Text>
          {SCHEDULE.map((s, i) => (
            <View key={i} style={[styles.scheduleRow, i < SCHEDULE.length - 1 && styles.eventRowBorder]}>
              <View style={styles.scheduleLeft}>
                <Text style={styles.scheduleTime}>{s.time}</Text>
                <Text style={styles.scheduleRoute}>{s.route}</Text>
              </View>
              <Text style={styles.scheduleDays}>{s.days}</Text>
            </View>
          ))}
          <Text style={styles.scheduleNote}>Pickup at main entrance · Call 405-755-9246 to request a special run</Text>
        </View>

        <View style={styles.notifBox}>
          <Text style={styles.notifBoxTitle}>📲 Bus Arrival Alerts</Text>
          <Text style={styles.notifBoxText}>You will receive a push notification when the shuttle is 5 minutes away — no need to wait outside.</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#050d1a' },
  header:          { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#070f1f', borderBottomWidth: 1, borderBottomColor: 'rgba(79,142,247,0.1)' },
  headerTitle:     { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub:       { fontSize: 11, color: '#475569', marginTop: 2 },
  content:         { padding: 16, gap: 14, paddingBottom: 40 },
  statusBanner:    { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, borderWidth: 1 },
  statusDot:       { width: 12, height: 12, borderRadius: 6, flexShrink: 0 },
  statusText:      { flex: 1 },
  statusTitle:     { fontSize: 14, fontWeight: '700' },
  statusSub:       { fontSize: 11, color: '#475569', marginTop: 2 },
  mapContainer:    { height: 200, backgroundColor: '#0a1628', borderRadius: 14, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: 'rgba(79,142,247,0.15)' },
  roadH:           { position: 'absolute', left: '15%', top: '48%', width: '70%', height: 8, backgroundColor: '#1e3a5f', borderRadius: 4 },
  roadV:           { position: 'absolute', left: '48%', top: '10%', width: 8, height: '80%', backgroundColor: '#1e3a5f', borderRadius: 4 },
  propertyBlock:   { position: 'absolute', left: '30%', top: '22%', width: '35%', height: '55%', backgroundColor: 'rgba(79,142,247,0.12)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(79,142,247,0.3)', alignItems: 'center', justifyContent: 'center' },
  propertyLabel:   { fontSize: 9, color: '#4f8ef7', fontWeight: '700', textAlign: 'center', lineHeight: 13 },
  entrancePin:     { position: 'absolute', left: '46%', bottom: 20, alignItems: 'center' },
  greenDot:        { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e', shadowColor: '#22c55e', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6, elevation: 4 },
  entranceLabel:   { fontSize: 8, color: '#22c55e', marginTop: 2, fontWeight: '600' },
  destPin:         { position: 'absolute', alignItems: 'center' },
  amberDot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' },
  destLabel:       { fontSize: 8, color: '#f59e0b', marginTop: 2 },
  busPin:          { position: 'absolute', left: '8%', top: '42%', alignItems: 'center' },
  busEmoji:        { fontSize: 22 },
  busEmojiActive:  { shadowColor: '#22c55e', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8 },
  busEta:          { fontSize: 9, color: '#22c55e', fontWeight: '700', marginTop: 1 },
  card:            { backgroundColor: '#070f1f', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: 'rgba(79,142,247,0.1)' },
  cardLabel:       { fontSize: 9, color: '#4f8ef7', fontWeight: '700', letterSpacing: 2, marginBottom: 14, textTransform: 'uppercase' },
  emptyText:       { color: '#334155', fontSize: 13, textAlign: 'center' },
  eventRow:        { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  eventRowBorder:  { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  eventIcon:       { fontSize: 16 },
  eventBody:       { flex: 1 },
  eventType:       { fontSize: 13, fontWeight: '600' },
  eventLocation:   { fontSize: 11, color: '#475569', marginTop: 1 },
  eventTime:       { fontSize: 10, color: '#334155' },
  scheduleRow:     { paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  scheduleLeft:    { flex: 1 },
  scheduleTime:    { fontSize: 14, fontWeight: '700', color: '#f0f6ff' },
  scheduleRoute:   { fontSize: 11, color: '#64748b', marginTop: 2 },
  scheduleDays:    { fontSize: 10, color: '#475569', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3 },
  scheduleNote:    { fontSize: 11, color: '#334155', marginTop: 12, textAlign: 'center' },
  notifBox:        { backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)' },
  notifBoxTitle:   { fontSize: 13, fontWeight: '700', color: '#22c55e', marginBottom: 6 },
  notifBoxText:    { fontSize: 12, color: '#475569', lineHeight: 18 },
})