import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ onLogout }) {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {}
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('session');
          await AsyncStorage.removeItem('user');
          if (onLogout) onLogout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>⚙️ Settings & Preferences</Text>

      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name || 'Career Seeker'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <View style={styles.proBadge}>
            <Text style={styles.proText}>⚡ PRO SUBSCRIPTION ACTIVE</Text>
          </View>
        </View>
      </View>

      {/* App Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>APPEARANCE & NOTIFICATIONS</Text>
        
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dark Mode (Glassmorphism)</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#334155', true: '#2563eb' }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Push Notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#334155', true: '#2563eb' }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Job Match Email Alerts</Text>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: '#334155', true: '#2563eb' }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Server & API Connection */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>SHARED BACKEND ENGINE</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>API Host Address:</Text>
          <Text style={styles.infoVal}>http://172.23.50.129:4000/api</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Sync Status:</Text>
          <Text style={styles.syncStatus}>● Connected & Synced Live</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>App Version:</Text>
          <Text style={styles.infoVal}>v2.5.0 Production</Text>
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Sign Out of Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  content: { padding: 16, paddingBottom: 40 },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1729',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '800', color: '#ffffff' },
  userEmail: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  proBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#064e3b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#059669',
  },
  proText: { fontSize: 9, fontWeight: '800', color: '#6ee7b7' },
  section: {
    backgroundColor: '#0f1729',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  rowLabel: { fontSize: 14, color: '#e2e8f0', fontWeight: '600' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoKey: { fontSize: 13, color: '#94a3b8' },
  infoVal: { fontSize: 13, color: '#f1f5f9', fontWeight: '600' },
  syncStatus: { fontSize: 13, color: '#34d399', fontWeight: '700' },
  logoutButton: {
    backgroundColor: '#991b1b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: { fontSize: 15, fontWeight: '800', color: '#ffffff' },
});
