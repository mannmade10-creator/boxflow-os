// app/(tabs)/_layout.tsx — Bottom tab navigator
import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#070f1f',
        borderTopColor: 'rgba(79,142,247,0.15)',
        borderTopWidth: 1,
        height: 80,
        paddingBottom: 12,
        paddingTop: 8,
      },
      tabBarActiveTintColor: '#4f8ef7',
      tabBarInactiveTintColor: '#334155',
      tabBarShowLabel: false,
    }}>
      <Tabs.Screen name="home" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }} />
      <Tabs.Screen name="billing" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💰" label="Billing" focused={focused} /> }} />
      <Tabs.Screen name="lease" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📄" label="Lease" focused={focused} /> }} />
      <Tabs.Screen name="maintenance" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔧" label="Repair" focused={focused} /> }} />
      <Tabs.Screen name="gps" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🚌" label="Bus" focused={focused} /> }} />
      <Tabs.Screen name="community" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Board" focused={focused} /> }} />
      <Tabs.Screen name="notifications" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" label="Alerts" focused={focused} /> }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabItem:       { alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabEmoji:      { fontSize: 20, opacity: 0.4 },
  tabEmojiActive:{ opacity: 1 },
  tabLabel:      { fontSize: 9, color: '#334155', fontWeight: '600', letterSpacing: 0.3 },
  tabLabelActive:{ color: '#4f8ef7' },
})