// app/login.tsx — Multi-property login
import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SB_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SB_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

async function dbGet(table: string, params: string) {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  })
  return res.json()
}

export default function LoginScreen() {
  const [email, setEmail]     = useState('')
  const [pin, setPin]         = useState('')
  const [loading, setLoading] = useState(false)
  const [showPin, setShowPin] = useState(false)

  async function handleLogin() {
    if (!email.trim() || !pin.trim()) {
      Alert.alert('Missing Info', 'Please enter your email and portal PIN.')
      return
    }
    setLoading(true)
    try {
      // Find tenant across ALL properties
      const tenants = await dbGet('pf_tenants',
        `email=eq.${encodeURIComponent(email.trim().toLowerCase())}&portal_pin=eq.${pin.trim()}&status=eq.active&select=*&limit=1`
      )
      if (!Array.isArray(tenants) || tenants.length === 0) {
        Alert.alert('Not Found', 'Email or PIN not found. Please check your info or contact your property manager.')
        setLoading(false)
        return
      }
      const tenant = tenants[0]

      // Load their organization (property)
      let org = null
      if (tenant.org_id) {
        const orgs = await dbGet('pf_organizations', `id=eq.${tenant.org_id}&select=*&limit=1`)
        if (Array.isArray(orgs) && orgs.length > 0) org = orgs[0]
      }

      // Load their unit
      let unit = null
      if (tenant.unit_id) {
        const units = await dbGet('pf_units', `id=eq.${tenant.unit_id}&select=*&limit=1`)
        if (Array.isArray(units) && units.length > 0) unit = units[0]
      }

      // Save session
      await AsyncStorage.setItem('pf_tenant_session', JSON.stringify({ tenant, org, unit }))

      router.replace('/(tabs)/home')
    } catch (e: any) {
      Alert.alert('Error', 'Something went wrong. Please check your connection and try again.')
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>P</Text>
          </View>
          <Text style={styles.appName}>PropFlow Tenant</Text>
          <Text style={styles.appSub}>by M.A.D.E Technologies</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSub}>Access billing, lease, maintenance, GPS tracker, and community board for your property.</Text>

          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor="#334155"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={[styles.label, { marginTop: 14 }]}>PORTAL PIN</Text>
          <View style={styles.pinRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={pin}
              onChangeText={t => setPin(t.replace(/\D/g, '').slice(0, 4))}
              placeholder="4-digit PIN"
              placeholderTextColor="#334155"
              keyboardType="number-pad"
              secureTextEntry={!showPin}
              maxLength={4}
            />
            <TouchableOpacity onPress={() => setShowPin(s => !s)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showPin ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, (loading || !email || !pin) && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading || !email || !pin}
            activeOpacity={0.8}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginBtnText}>Access My Portal</Text>
            }
          </TouchableOpacity>

          <View style={styles.helpBox}>
            <Text style={styles.helpText}>
              Your portal PIN was provided by your property manager.{'\n'}
              Need help? Contact your property office directly.
            </Text>
          </View>
        </View>

        {/* PWA hint */}
        <View style={styles.downloadBox}>
          <Text style={styles.downloadTitle}>📲 Enable Push Notifications</Text>
          <Text style={styles.downloadText}>
            After signing in, tap Allow when asked for notification permissions to receive maintenance updates, rent reminders, and bus arrival alerts.
          </Text>
        </View>

        <Text style={styles.footerText}>PropFlow OS · © 2026 M.A.D.E Technologies Inc</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex:           { flex: 1, backgroundColor: '#050d1a' },
  container:      { flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 40 },
  logoSection:    { alignItems: 'center', marginBottom: 32 },
  logoBox:        { width: 72, height: 72, borderRadius: 20, backgroundColor: '#1d4ed8', alignItems: 'center', justifyContent: 'center', marginBottom: 12, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  logoLetter:     { fontSize: 36, fontWeight: '900', color: '#fff' },
  appName:        { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  appSub:         { fontSize: 10, color: '#334155', letterSpacing: 2, marginTop: 3 },
  card:           { backgroundColor: '#0B1628', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(79,142,247,0.15)', marginBottom: 16 },
  cardTitle:      { fontSize: 20, fontWeight: '800', color: '#f0f6ff', marginBottom: 6 },
  cardSub:        { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 24 },
  label:          { fontSize: 10, color: '#475569', letterSpacing: 1.5, fontWeight: '700', marginBottom: 8 },
  input:          { backgroundColor: '#0d1a2e', borderWidth: 1, borderColor: 'rgba(79,142,247,0.2)', borderRadius: 12, padding: 14, fontSize: 15, color: '#f0f6ff' },
  pinRow:         { flexDirection: 'row', gap: 10, alignItems: 'center' },
  eyeBtn:         { padding: 14, backgroundColor: '#0d1a2e', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(79,142,247,0.2)' },
  eyeText:        { fontSize: 18 },
  loginBtn:       { backgroundColor: '#2563EB', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24, shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  loginBtnDisabled: { backgroundColor: '#1e3a5f', shadowOpacity: 0 },
  loginBtnText:   { fontSize: 16, fontWeight: '800', color: '#fff' },
  helpBox:        { marginTop: 16, padding: 14, backgroundColor: 'rgba(79,142,247,0.06)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(79,142,247,0.1)' },
  helpText:       { fontSize: 12, color: '#475569', lineHeight: 18, textAlign: 'center' },
  downloadBox:    { backgroundColor: 'rgba(34,197,94,0.08)', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)', marginBottom: 24 },
  downloadTitle:  { fontSize: 13, fontWeight: '700', color: '#22c55e', marginBottom: 6 },
  downloadText:   { fontSize: 12, color: '#475569', lineHeight: 18 },
  footerText:     { fontSize: 11, color: '#1e293b', textAlign: 'center' },
})