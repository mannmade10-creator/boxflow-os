// app/(tabs)/maintenance.tsx — Maintenance requests with push notifications
import { useState, useEffect, useRef } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, RefreshControl, Alert, Animated, KeyboardAvoidingView, Platform
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'

const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const CATEGORIES = ['plumbing','electric','hvac','appliance','pest','general']
const PRIORITIES = [
  { value: 'low',    label: '🟢 Low — Not urgent' },
  { value: 'normal', label: '🟡 Normal' },
  { value: 'urgent', label: '🔴 Urgent — Safety issue' },
]

function statusColor(s: string) {
  if (s === 'completed')   return '#22c55e'
  if (s === 'in_progress') return '#3b82f6'
  if (s === 'open')        return '#f59e0b'
  return '#475569'
}

export default function MaintenanceScreen() {
  const [session, setSession]       = useState<any>(null)
  const [requests, setRequests]     = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [form, setForm]             = useState({ title: '', description: '', category: 'general', priority: 'normal' })
  const slideAnim = useRef(new Animated.Value(300)).current

  async function load(refresh = false) {
    if (refresh) setRefreshing(true)
    const raw = await AsyncStorage.getItem('pf_tenant_session')
    if (!raw) return
    const s = JSON.parse(raw)
    setSession(s)
    const res = await fetch(`${SB_URL}/rest/v1/pf_maintenance_requests?tenant_id=eq.${s.tenant.id}&select=*&order=created_at.desc`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    })
    const data = await res.json()
    if (Array.isArray(data)) setRequests(data)
    setLoading(false); setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  function openForm() {
    setShowForm(true)
    Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }).start()
  }

  function closeForm() {
    Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }).start(() => {
      setShowForm(false)
      setForm({ title: '', description: '', category: 'general', priority: 'normal' })
    })
  }

  async function submitRequest() {
    if (!form.title.trim() || !form.description.trim()) {
      Alert.alert('Missing Info', 'Please fill in the issue title and description.')
      return
    }
    setSubmitting(true)
    const s = session
    // Save to Supabase
    await fetch(`${SB_URL}/rest/v1/pf_maintenance_requests`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ tenant_id: s.tenant.id, unit_id: s.tenant.unit_id, org_id: s.tenant.org_id, ...form, status: 'open' })
    })
    // Add notification record
    await fetch(`${SB_URL}/rest/v1/pf_tenant_notifications`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ tenant_id: s.tenant.id, org_id: s.tenant.org_id, type: 'maintenance_update', title: 'Request Submitted', message: `"${form.title}" has been submitted. We will respond within 24 hours.`, read: false })
    })
    // Local push notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔧 Maintenance Request Submitted',
        body: `"${form.title}" has been submitted. You will be notified when it is assigned.`,
        sound: true,
      },
      trigger: null,
    })
    setSubmitting(false)
    setSubmitted(true)
    closeForm()
    setTimeout(() => setSubmitted(false), 5000)
    load()
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Maintenance</Text>
          <Text style={styles.headerSub}>You will be notified when your request is updated</Text>
        </View>
        <TouchableOpacity style={styles.newBtn} onPress={openForm} activeOpacity={0.8}>
          <Text style={styles.newBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {submitted && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✓ Request submitted! We will contact you within 24 hours.</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#4f8ef7" />}
      >
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔧</Text>
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptySubtitle}>Tap + New to submit a maintenance request</Text>
          </View>
        ) : requests.map((r: any, i: number) => (
          <View key={i} style={[styles.requestCard, { borderLeftColor: statusColor(r.status), borderLeftWidth: 3 }]}>
            <View style={styles.requestTop}>
              <Text style={styles.requestTitle}>{r.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(r.status) + '18' }]}>
                <Text style={[styles.statusText, { color: statusColor(r.status) }]}>
                  {r.status === 'in_progress' ? 'In Progress' : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={styles.requestDesc} numberOfLines={2}>{r.description}</Text>
            <View style={styles.requestMeta}>
              <Text style={styles.metaText}>
                {r.category} · {r.priority === 'urgent' ? '🔴' : r.priority === 'normal' ? '🟡' : '🟢'} {r.priority}
              </Text>
              <Text style={styles.metaText}>
                {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
              </Text>
            </View>
            {r.assigned_to && (
              <Text style={styles.assignedText}>👷 Assigned to {r.assigned_to}</Text>
            )}
            {r.completed_date && (
              <Text style={styles.completedText}>✓ Completed {new Date(r.completed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* New request slide-up form */}
      {showForm && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={closeForm} activeOpacity={1} />
          <Animated.View style={[styles.formSheet, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.formHandle} />
            <Text style={styles.formTitle}>New Maintenance Request</Text>

            <Text style={styles.label}>WHAT IS THE ISSUE?</Text>
            <TextInput style={styles.input} value={form.title} onChangeText={t => setForm(f => ({ ...f, title: t }))}
              placeholder="e.g. Kitchen faucet dripping" placeholderTextColor="#334155" />

            <Text style={[styles.label, { marginTop: 14 }]}>DESCRIBE THE PROBLEM</Text>
            <TextInput style={[styles.input, styles.textArea]} value={form.description}
              onChangeText={t => setForm(f => ({ ...f, description: t }))}
              placeholder="Describe what is happening in as much detail as possible..."
              placeholderTextColor="#334155" multiline numberOfLines={4} textAlignVertical="top" />

            <Text style={[styles.label, { marginTop: 14 }]}>CATEGORY</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={styles.chipRow}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} onPress={() => setForm(f => ({ ...f, category: c }))}
                  style={[styles.chip, form.category === c && styles.chipActive]} activeOpacity={0.8}>
                  <Text style={[styles.chipText, form.category === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.label, { marginTop: 14 }]}>PRIORITY</Text>
            {PRIORITIES.map(p => (
              <TouchableOpacity key={p.value} onPress={() => setForm(f => ({ ...f, priority: p.value }))}
                style={[styles.priorityBtn, form.priority === p.value && styles.priorityBtnActive]} activeOpacity={0.8}>
                <Text style={[styles.priorityText, form.priority === p.value && styles.priorityTextActive]}>{p.label}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.formBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeForm} activeOpacity={0.8}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                onPress={submitRequest} disabled={submitting} activeOpacity={0.8}>
                <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit Request'}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#050d1a' },
  header:          { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#070f1f', borderBottomWidth: 1, borderBottomColor: 'rgba(79,142,247,0.1)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle:     { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub:       { fontSize: 11, color: '#475569', marginTop: 2 },
  newBtn:          { backgroundColor: '#a855f7', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  newBtnText:      { fontSize: 13, fontWeight: '800', color: '#fff' },
  successBanner:   { margin: 16, padding: 14, backgroundColor: 'rgba(34,197,94,0.1)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)' },
  successText:     { fontSize: 13, color: '#22c55e', fontWeight: '600', textAlign: 'center' },
  list:            { padding: 16, gap: 12, paddingBottom: 40 },
  emptyText:       { color: '#334155', textAlign: 'center', marginTop: 40, fontSize: 14 },
  emptyState:      { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyEmoji:      { fontSize: 48 },
  emptyTitle:      { fontSize: 18, fontWeight: '700', color: '#475569' },
  emptySubtitle:   { fontSize: 13, color: '#334155', textAlign: 'center' },
  requestCard:     { backgroundColor: '#070f1f', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  requestTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 10 },
  requestTitle:    { flex: 1, fontSize: 14, fontWeight: '700', color: '#f0f6ff' },
  statusBadge:     { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusText:      { fontSize: 10, fontWeight: '700' },
  requestDesc:     { fontSize: 12, color: '#475569', marginBottom: 10, lineHeight: 18 },
  requestMeta:     { flexDirection: 'row', justifyContent: 'space-between' },
  metaText:        { fontSize: 10, color: '#334155' },
  assignedText:    { fontSize: 11, color: '#3b82f6', marginTop: 6 },
  completedText:   { fontSize: 11, color: '#22c55e', marginTop: 4 },
  overlay:         { position: 'absolute', inset: 0, justifyContent: 'flex-end' },
  overlayBg:       { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)' },
  formSheet:       { backgroundColor: '#0B1628', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, borderWidth: 1, borderColor: 'rgba(79,142,247,0.2)' },
  formHandle:      { width: 40, height: 4, backgroundColor: '#1e3a5f', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  formTitle:       { fontSize: 18, fontWeight: '800', color: '#f0f6ff', marginBottom: 20 },
  label:           { fontSize: 10, color: '#475569', letterSpacing: 1.5, fontWeight: '700', marginBottom: 8 },
  input:           { backgroundColor: '#0d1a2e', borderWidth: 1, borderColor: 'rgba(79,142,247,0.2)', borderRadius: 12, padding: 14, fontSize: 14, color: '#f0f6ff' },
  textArea:        { height: 90, textAlignVertical: 'top' },
  chipScroll:      { marginBottom: 4 },
  chipRow:         { gap: 8, paddingVertical: 4 },
  chip:            { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  chipActive:      { backgroundColor: 'rgba(79,142,247,0.15)', borderColor: '#4f8ef7' },
  chipText:        { fontSize: 12, color: '#64748b', textTransform: 'capitalize' },
  chipTextActive:  { color: '#4f8ef7', fontWeight: '700' },
  priorityBtn:     { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', marginBottom: 8, backgroundColor: '#070f1f' },
  priorityBtnActive: { borderColor: '#4f8ef7', backgroundColor: 'rgba(79,142,247,0.1)' },
  priorityText:    { fontSize: 14, color: '#64748b' },
  priorityTextActive: { color: '#f0f6ff', fontWeight: '600' },
  formBtns:        { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn:       { flex: 1, padding: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cancelBtnText:   { fontSize: 14, color: '#64748b', fontWeight: '700' },
  submitBtn:       { flex: 2, padding: 14, backgroundColor: '#a855f7', borderRadius: 12, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText:   { fontSize: 14, color: '#fff', fontWeight: '800' },
})