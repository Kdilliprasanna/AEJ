import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { dashboard, profile, resume, applications } from '../api/client';

export default function DashboardScreen({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState({
    atsScore: 88,
    applicationsCount: 12,
    mockStreak: 5,
    matchedJobsCount: 48,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profRes, appRes, resumeRes] = await Promise.allSettled([
        profile.get(),
        applications.getAll(),
        resume.getAtsReport(),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value) {
        setUserProfile(profRes.value.profile || profRes.value);
      }
      if (appRes.status === 'fulfilled' && appRes.value) {
        const apps = appRes.value.applications || appRes.value || [];
        setStats((prev) => ({ ...prev, applicationsCount: apps.length || 12 }));
      }
      if (resumeRes.status === 'fulfilled' && resumeRes.value) {
        const report = resumeRes.value;
        if (report.score) {
          setStats((prev) => ({ ...prev, atsScore: report.score }));
        }
      }
    } catch (e) {
      console.log('Dashboard load error fallback:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} tintColor="#3b82f6" />
      }
    >
      {/* Welcome Hero Banner */}
      <View style={styles.welcomeCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.proTag}>PRO CAREER SUITE</Text>
          <Text style={styles.streakBadge}>🔥 {stats.mockStreak} Day Streak</Text>
        </View>
        <Text style={styles.welcomeTitle}>
          Welcome back, {userProfile?.name || 'Prasanna'}! 👋
        </Text>
        <Text style={styles.welcomeSub}>
          Target Role: <Text style={styles.highlight}>{userProfile?.targetRole || 'Full-Stack Software Engineer'}</Text>
        </Text>
      </View>

      {/* Metrics Row */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
          <Text style={styles.statEmoji}>📈</Text>
          <Text style={[styles.statValue, { color: '#60a5fa' }]}>{stats.atsScore}%</Text>
          <Text style={styles.statLabel}>ATS Score</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
          <Text style={styles.statEmoji}>💼</Text>
          <Text style={[styles.statValue, { color: '#34d399' }]}>{stats.matchedJobsCount}</Text>
          <Text style={styles.statLabel}>Matched Jobs</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
          <Text style={styles.statEmoji}>🎯</Text>
          <Text style={[styles.statValue, { color: '#fbbf24' }]}>{stats.mockStreak} Days</Text>
          <Text style={styles.statLabel}>Quiz Streak</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: '#a855f7' }]}>
          <Text style={styles.statEmoji}>📑</Text>
          <Text style={[styles.statValue, { color: '#c084fc' }]}>{stats.applicationsCount}</Text>
          <Text style={styles.statLabel}>Applied</Text>
        </View>
      </View>

      {/* Recommended Actions */}
      <Text style={styles.sectionHeader}>⚡ Quick Actions & Modules</Text>

      <View style={styles.actionGrid}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onNavigate && onNavigate('Resume Lab')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBg, { backgroundColor: '#1e3a8a' }]}>
            <Text style={styles.actionEmoji}>📄</Text>
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>Resume ATS Lab</Text>
            <Text style={styles.actionDesc}>Check ATS score & fix missing keywords</Text>
          </View>
          <Text style={styles.chevron}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onNavigate && onNavigate('Jobs')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBg, { backgroundColor: '#064e3b' }]}>
            <Text style={styles.actionEmoji}>💼</Text>
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>Job Platform Matcher</Text>
            <Text style={styles.actionDesc}>Explore 250+ matched jobs & instant apply</Text>
          </View>
          <Text style={styles.chevron}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onNavigate && onNavigate('Templates')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBg, { backgroundColor: '#581c87' }]}>
            <Text style={styles.actionEmoji}>🎨</Text>
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>180+ Premium Templates</Text>
            <Text style={styles.actionDesc}>Executive, Tech & Creative ATS formats</Text>
          </View>
          <Text style={styles.chevron}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onNavigate && onNavigate('Mock Test')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBg, { backgroundColor: '#78350f' }]}>
            <Text style={styles.actionEmoji}>🎯</Text>
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>Daily Mock Test</Text>
            <Text style={styles.actionDesc}>Timed quizzes & streak badge rewards</Text>
          </View>
          <Text style={styles.chevron}>➔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => onNavigate && onNavigate('AI Advisor')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBg, { backgroundColor: '#312e81' }]}>
            <Text style={styles.actionEmoji}>💬</Text>
          </View>
          <View style={styles.actionTextCol}>
            <Text style={styles.actionTitle}>AI Career Advisor</Text>
            <Text style={styles.actionDesc}>Real-time interview & resume AI assistance</Text>
          </View>
          <Text style={styles.chevron}>➔</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  scrollContent: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0f1f' },
  welcomeCard: {
    backgroundColor: '#131c2d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2d3a4e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  proTag: { fontSize: 10, fontWeight: '800', color: '#60a5fa', backgroundColor: '#1e3a8a', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  streakBadge: { fontSize: 11, fontWeight: '800', color: '#fbbf24' },
  welcomeTitle: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  welcomeSub: { fontSize: 13, color: '#94a3b8', marginTop: 6 },
  highlight: { fontWeight: '700', color: '#60a5fa' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#131c2d',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d3a4e',
    borderLeftWidth: 4,
  },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '900' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 2, fontWeight: '600' },
  sectionHeader: { fontSize: 17, fontWeight: '800', color: '#f8fafc', marginBottom: 12 },
  actionGrid: { gap: 10 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131c2d',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionEmoji: { fontSize: 20 },
  actionTextCol: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  actionDesc: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  chevron: { color: '#60a5fa', fontSize: 16, fontWeight: '700' },
});
