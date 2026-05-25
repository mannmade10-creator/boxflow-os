// app/index.tsx — Splash / onboarding screen
import { useEffect } from 'react'
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width, height } = Dimensions.get('window')

export default function SplashScreen() {
  const fadeAnim  = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.8)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start()

    async function checkSession() {
      await new Promise(r => setTimeout(r, 2200))
      try {
        const session = await AsyncStorage.getItem('pf_tenant_session')
        if (session) {
          const parsed = JSON.parse(session)
          if (parsed?.tenant?.id) {
            router.replace('/(tabs)/home')
            return
          }
        }
      } catch {}
      router.replace('/login')
    }
    checkSession()
  }, [])

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoWrap}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <View style={styles.logoDot} />
        </View>
        <Text style={styles.appName}>PropFlow</Text>
        <Text style={styles.appSub}>TENANT</Text>
        <Text style={styles.tagline}>Your home. Your lease.{'\n'}Your community. Always on.</Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>by M.A.D.E Technologies Inc</Text>
        <View style={styles.loadingDots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, { opacity: 0.3 + i * 0.3 }]} />
          ))}
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#050d1a', alignItems: 'center', justifyContent: 'center' },
  gradientTop:    { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.5, backgroundColor: 'rgba(37,99,235,0.04)' },
  gradientBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.3, backgroundColor: 'rgba(37,99,235,0.02)' },
  content:        { alignItems: 'center' },
  logoWrap:       { position: 'relative', marginBottom: 20 },
  logoBox:        { width: 88, height: 88, borderRadius: 24, backgroundColor: '#1d4ed8', alignItems: 'center', justifyContent: 'center', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 12 },
  logoText:       { fontSize: 44, fontWeight: '900', color: '#fff' },
  logoDot:        { position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#22c55e', borderWidth: 3, borderColor: '#050d1a' },
  appName:        { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 4 },
  appSub:         { fontSize: 11, color: '#4f8ef7', letterSpacing: 6, fontWeight: '700', marginBottom: 20 },
  tagline:        { fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 24 },
  footer:         { position: 'absolute', bottom: 48, alignItems: 'center', gap: 12 },
  footerText:     { fontSize: 11, color: '#1e3a5f', letterSpacing: 1 },
  loadingDots:    { flexDirection: 'row', gap: 6, marginTop: 8 },
  dot:            { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4f8ef7' },
})