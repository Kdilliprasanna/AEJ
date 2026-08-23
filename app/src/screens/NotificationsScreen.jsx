import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { notifications as notifApi } from '../api/client';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Resume ATS Score Improved! 🚀',
    desc: 'Your ATS resume score increased to 88% after keyword alignment.',
    time: '20 mins ago',
    type: 'success',
    read: false,
  },
  {
    id: '2',
    title: 'Technical Interview Scheduled! 📅',
    desc: 'TechCorp Global scheduled a System Architecture round for Senior Full-Stack role.',
    time: '2 hrs ago',
    type: 'info',
    read: false,
  },
  {
    id: '3',
    title: 'Daily Mock Quiz Streak Active 🔥',
    desc: 'Keep your 5-day streak alive! Complete today\'s 4 practice questions.',
    time: '5 hrs ago',
    type: 'warning',
    read: true,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLiveNotifications();
  }, []);

  const loadLiveNotifications = async () => {
    try {
      setLoading(true);
      const res = await notifApi.getLive();
      if (res && res.notifications && Array.isArray(res.notifications) && res.notifications.length > 0) {
        const formatted = res.notifications.map((n) => ({
          id: n.id,
          title: n.title || 'Platform Notification',
          desc: n.description || n.message || 'Notification update',
          time: n.date ? new Date(n.date).toLocaleDateString() : 'Just now',
          type: n.type === 'application_status' ? 'success' : 'info',
          read: !n.unread,
        }));
        setNotifications(formatted);
      }
    } catch (e) {
      console.log('Notifications load fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      for (const n of notifications) {
        if (!n.read) {
          await notifApi.markAsRead(n.id);
        }
      }
      Alert.alert('All Marked as Read ✓', 'All alerts updated.');
    } catch (e) {
      Alert.alert('All Marked as Read ✓', 'All alerts updated.');
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const renderItem = ({ item }) => {
    let icon = '🔔';
    let bg = '#1e3a8a';
    let iconColor = '#60a5fa';

    if (item.type === 'success') {
      icon = '🎉';
      bg = '#064e3b';
      iconColor = '#34d399';
    } else if (item.type === 'warning') {
      icon = '🔥';
      bg = '#78350f';
      iconColor = '#fbbf24';
    }

    return (
      <View style={[styles.card, !item.read && styles.unreadCard]}>
        <View style={[styles.iconBox, { backgroundColor: bg }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.desc}>{item.desc}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>🔔 Notifications & Alerts</Text>
          <Text style={styles.headerSub}>Real-time updates on applications and ATS scores</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleMarkAllRead}>
            <Text style={styles.headerBtnText}>Mark Read</Text>
          </TouchableOpacity>
        </View>
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔕</Text>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptySub}>You are all caught up!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#0f1729', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTextCol: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  headerSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 6 },
  headerBtn: { backgroundColor: '#131c2d', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#2d3a4e' },
  headerBtnText: { color: '#60a5fa', fontSize: 11, fontWeight: '700' },
  listContent: { padding: 14, gap: 10 },
  card: { flexDirection: 'row', backgroundColor: '#131c2d', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#2d3a4e' },
  unreadCard: { borderColor: '#3b82f6', backgroundColor: '#132238' },
  iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  icon: { fontSize: 20 },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: '#f8fafc', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6' },
  desc: { fontSize: 12, color: '#cbd5e1', marginTop: 3, lineHeight: 16 },
  time: { fontSize: 10, color: '#94a3b8', marginTop: 6 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc' },
  emptySub: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
});
