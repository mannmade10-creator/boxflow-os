// app/(tabs)/community.tsx — Community board, privacy protected
import { useState, useEffect } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, RefreshControl, Alert, KeyboardAvoidingView, Platform
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const POST_TYPES = [
  { value: 'post',       label: '💬 General Post' },
  { value: 'event',      label: '🎉 Community Event' },
  { value: 'lost_found', label: '🔍 Lost & Found' },
  { value: 'for_sale',   label: '🏷 For Sale / Free' },
  { value: 'question',   label: '❓ Question' },
]

export default function CommunityScreen() {
  const [session, setSession]       = useState<any>(null)
  const [posts, setPosts]           = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm]             = useState({ title: '', content: '', type: 'post' })

  async function load(refresh = false) {
    if (refresh) setRefreshing(true)
    const raw = await AsyncStorage.getItem('pf_tenant_session')
    if (!raw) return
    const s = JSON.parse(raw); setSession(s)
    const res = await fetch(`${SB_URL}/rest/v1/pf_community_posts?org_id=eq.${s.tenant.org_id}&select=*&order=pinned.desc,created_at.desc&limit=30`, {
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    })
    const data = await res.json()
    if (Array.isArray(data)) setPosts(data)
    setLoading(false); setRefreshing(false)
  }

  useEffect(() => { load() }, [])

  async function submitPost() {
    if (!form.content.trim()) { Alert.alert('Empty Post', 'Please write something before posting.'); return }
    setSubmitting(true)
    const s = session
    const t = s.tenant
    const u = s.unit
    // Display name: first name + last initial + unit — NO full name, email, or phone
    const firstName = t.full_name?.split(' ')[0] ?? 'Resident'
    const lastInit  = (t.full_name?.split(' ').slice(-1)[0]?.[0] ?? '') + '.'
    const unitNum   = u?.unit_number?.replace(/[^0-9]/g, '') ?? ''
    const displayName = `${firstName} ${lastInit} · Unit ${unitNum}`

    await fetch(`${SB_URL}/rest/v1/pf_community_posts`, {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        org_id: t.org_id, author_id: t.id, author_display_name: displayName,
        author_type: 'tenant', type: form.type, category: form.type,
        title: form.title, content: form.content, body: form.content,
        is_admin_post: false, pinned: false, likes: 0
      })
    })
    setSubmitting(false); setShowForm(false)
    setForm({ title: '', content: '', type: 'post' })
    load()
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Community Board</Text>
          <Text style={styles.headerSub}>Neighbors · First name & unit only shown</Text>
        </View>
        <TouchableOpacity style={styles.postBtn} onPress={() => setShowForm(s => !s)} activeOpacity={0.8}>
          <Text style={styles.postBtnText}>{showForm ? '✕ Cancel' : '+ Post'}</Text>
        </TouchableOpacity>
      </View>

      {/* Privacy notice */}
      <View style={styles.privacyBanner}>
        <Text style={styles.privacyText}>🔒 Privacy protected — only first name and unit number are visible to neighbors. No personal info is ever shown.</Text>
      </View>

      {/* New post form */}
      {showForm && (
        <View style={styles.formCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
            {POST_TYPES.map(t => (
              <TouchableOpacity key={t.value} onPress={() => setForm(f => ({ ...f, type: t.value }))}
                style={[styles.typeChip, form.type === t.value && styles.typeChipActive]} activeOpacity={0.8}>
                <Text style={[styles.typeChipText, form.type === t.value && styles.typeChipTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput style={styles.titleInput} value={form.title} onChangeText={t => setForm(f => ({ ...f, title: t }))}
            placeholder="Title (optional)" placeholderTextColor="#334155" />
          <TextInput style={styles.contentInput} value={form.content} onChangeText={t => setForm(f => ({ ...f, content: t }))}
            placeholder="What's on your mind?" placeholderTextColor="#334155" multiline numberOfLines={3} textAlignVertical="top" />
          <TouchableOpacity style={[styles.submitPostBtn, submitting && { opacity: 0.6 }]} onPress={submitPost} disabled={submitting} activeOpacity={0.8}>
            <Text style={styles.submitPostBtnText}>{submitting ? 'Posting...' : 'Post to Community'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.list} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#4f8ef7" />}>
        {loading ? <Text style={styles.emptyText}>Loading...</Text>
        : posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to post on the community board</Text>
          </View>
        ) : posts.map((p: any, i: number) => (
          <View key={i} style={[styles.postCard, p.pinned && styles.postCardPinned]}>
            <View style={styles.postTop}>
              <View style={styles.postAuthorRow}>
                <View style={[styles.avatar, { backgroundColor: p.is_admin_post ? 'rgba(79,142,247,0.2)' : 'rgba(201,168,76,0.15)' }]}>
                  <Text style={styles.avatarText}>{p.is_admin_post ? '🏢' : (p.author_display_name?.[0] ?? '?')}</Text>
                </View>
                <View>
                  <Text style={[styles.authorName, { color: p.is_admin_post ? '#4f8ef7' : '#c9a84c' }]}>{p.author_display_name ?? 'Resident'}</Text>
                  <Text style={styles.postTime}>{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                </View>
                {p.pinned && <View style={styles.pinnedBadge}><Text style={styles.pinnedBadgeText}>📌 PINNED</Text></View>}
                {p.is_admin_post && <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>MANAGEMENT</Text></View>}
              </View>
              <View style={styles.typePill}>
                <Text style={styles.typePillText}>{p.type ?? p.category ?? 'post'}</Text>
              </View>
            </View>
            {p.title ? <Text style={styles.postTitle}>{p.title}</Text> : null}
            <Text style={styles.postContent}>{p.content ?? p.body}</Text>
            {p.likes > 0 && <Text style={styles.likesText}>❤️ {p.likes}</Text>}
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#050d1a' },
  header:            { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#070f1f', borderBottomWidth: 1, borderBottomColor: 'rgba(79,142,247,0.1)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle:       { fontSize: 20, fontWeight: '900', color: '#fff' },
  headerSub:         { fontSize: 11, color: '#475569', marginTop: 2 },
  postBtn:           { backgroundColor: '#1d4ed8', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  postBtnText:       { fontSize: 13, fontWeight: '800', color: '#fff' },
  privacyBanner:     { margin: 12, padding: 10, backgroundColor: 'rgba(34,197,94,0.06)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(34,197,94,0.15)' },
  privacyText:       { fontSize: 11, color: '#475569', lineHeight: 16 },
  formCard:          { margin: 12, marginTop: 0, backgroundColor: '#070f1f', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(79,142,247,0.2)' },
  typeRow:           { gap: 8, paddingVertical: 4, marginBottom: 12 },
  typeChip:          { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  typeChipActive:    { backgroundColor: 'rgba(79,142,247,0.15)', borderColor: '#4f8ef7' },
  typeChipText:      { fontSize: 11, color: '#64748b' },
  typeChipTextActive:{ color: '#4f8ef7', fontWeight: '700' },
  titleInput:        { backgroundColor: '#0d1a2e', borderWidth: 1, borderColor: 'rgba(79,142,247,0.15)', borderRadius: 10, padding: 12, fontSize: 14, color: '#f0f6ff', marginBottom: 10 },
  contentInput:      { backgroundColor: '#0d1a2e', borderWidth: 1, borderColor: 'rgba(79,142,247,0.15)', borderRadius: 10, padding: 12, fontSize: 14, color: '#f0f6ff', height: 80, marginBottom: 12 },
  submitPostBtn:     { backgroundColor: '#2563EB', borderRadius: 10, padding: 13, alignItems: 'center' },
  submitPostBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  list:              { padding: 12, gap: 12, paddingBottom: 40 },
  emptyText:         { color: '#334155', textAlign: 'center', marginTop: 40, fontSize: 14 },
  emptyState:        { alignItems: 'center', marginTop: 60, gap: 10 },
  emptyEmoji:        { fontSize: 48 },
  emptyTitle:        { fontSize: 18, fontWeight: '700', color: '#475569' },
  emptySubtitle:     { fontSize: 13, color: '#334155', textAlign: 'center' },
  postCard:          { backgroundColor: '#070f1f', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  postCardPinned:    { borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.04)' },
  postTop:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 },
  postAuthorRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, flexWrap: 'wrap' },
  avatar:            { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText:        { fontSize: 14 },
  authorName:        { fontSize: 12, fontWeight: '700' },
  postTime:          { fontSize: 10, color: '#334155' },
  pinnedBadge:       { backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)' },
  pinnedBadgeText:   { fontSize: 8, color: '#c9a84c', fontWeight: '700' },
  adminBadge:        { backgroundColor: 'rgba(79,142,247,0.15)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: 'rgba(79,142,247,0.3)' },
  adminBadgeText:    { fontSize: 8, color: '#4f8ef7', fontWeight: '700' },
  typePill:          { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  typePillText:      { fontSize: 9, color: '#475569', textTransform: 'capitalize' },
  postTitle:         { fontSize: 14, fontWeight: '700', color: '#f0f6ff', marginBottom: 6 },
  postContent:       { fontSize: 13, color: '#94a3b8', lineHeight: 20 },
  likesText:         { fontSize: 11, color: '#475569', marginTop: 8 },
})