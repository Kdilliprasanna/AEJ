import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import JobsScreen from '../screens/JobsScreen';
import ResumeLabScreen from '../screens/ResumeLabScreen';
import LiveInterviewerScreen from '../screens/LiveInterviewerScreen';

import TemplatesScreen from '../screens/TemplatesScreen';
import MockTestScreen from '../screens/MockTestScreen';
import AIChatScreen from '../screens/AIChatScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CoverLetterScreen from '../screens/CoverLetterScreen';
import RoadmapScreen from '../screens/RoadmapScreen';
import RoleExplorerScreen from '../screens/RoleExplorerScreen';
import SalaryCalculatorScreen from '../screens/SalaryCalculatorScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import AdminAnalyticsScreen from '../screens/AdminAnalyticsScreen';

const MAIN_TABS = [
  { id: 'Dashboard',      label: 'Home',      icon: '🏠' },
  { id: 'Jobs',           label: 'Jobs',      icon: '💼' },
  { id: 'Resume Lab',    label: 'ATS Lab',   icon: '📄' },
  { id: 'Live Interview', label: 'AI Voice',  icon: '🎙️' },
  { id: 'More',           label: 'App Hub',   icon: '🎛️' },
];

const HUB_MODULES = [
  { id: 'Dashboard',       title: 'Home Dashboard',     desc: 'Overview & career metrics', icon: '🏠', tag: 'Core' },
  { id: 'Jobs',            title: 'Live Jobs Engine',   desc: 'Skill-matched opportunities', icon: '💼', tag: 'Core' },
  { id: 'Resume Lab',      title: 'Resume ATS Scanner', desc: 'ATS score & optimization', icon: '📄', tag: 'Core' },
  { id: 'Live Interview',  title: 'AI Voice Interview', desc: '7-Stage technical practice', icon: '🎙️', tag: 'AI' },
  { id: 'Mock Test',       title: 'Daily Mock Tests',   desc: 'Non-repeating daily rounds', icon: '🎯', tag: 'Practice' },
  { id: 'Flashcards',      title: 'Interview Flashcards',desc: 'Speed recall card decks', icon: '🎴', tag: 'Practice' },
  { id: 'AI Advisor',      title: 'AI Career Chat',     desc: '24/7 AI mentor advice', icon: '💬', tag: 'AI' },
  { id: 'Templates',       title: 'Resume Templates',   desc: 'ATS battle-tested formats', icon: '🎨', tag: 'Tools' },
  { id: 'Cover Letter',    title: 'Cover Letter Gen',   desc: 'Role-custom letters', icon: '✍️', tag: 'Tools' },
  { id: 'Roadmap',         title: 'AI Skill Roadmap',   desc: 'Personalized learning path', icon: '🗺️', tag: 'Career' },
  { id: 'Role Explorer',   title: '250+ Tech Roles',    desc: 'Salary & skill breakdowns', icon: '🧭', tag: 'Career' },
  { id: 'Salary',          title: 'Salary Calculator',  desc: 'Market compensation bounds', icon: '💰', tag: 'Career' },
  { id: 'Applications',    title: 'Applied Jobs',       desc: 'Application status tracker', icon: '📊', tag: 'Tracker' },
  { id: 'Analytics',       title: 'Placement Hub',      desc: 'University statistics', icon: '🏛️', tag: 'Metrics' },
  { id: 'Notifications',   title: 'Alerts & Messages',  desc: 'Live activity feeds', icon: '🔔', tag: 'System' },
  { id: 'Profile',         title: 'My Profile',         desc: 'Resume skills & target role', icon: '👤', tag: 'Account' },
  { id: 'Settings',        title: 'App Settings',       desc: 'Theme, sync & security', icon: '⚙️', tag: 'Account' },
];

export default function Navigation() {
  const [currentTab, setCurrentTab] = useState('Dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [hubModalVisible, setHubModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadActiveUser();
  }, []);

  const loadActiveUser = async () => {
    try {
      const uProf = await profile.get().catch(() => null);
      if (uProf && (uProf.profile || uProf.name || uProf.email)) {
        const p = uProf.profile || uProf;
        setUserProfile(p);
        await AsyncStorage.setItem('user', JSON.stringify(p));
      } else {
        const cached = await AsyncStorage.getItem('user');
        if (cached) {
          setUserProfile(JSON.parse(cached));
        }
      }
    } catch (e) {
      console.log('Error loading active user in navigation:', e);
    }
  };

  const getInitials = () => {
    if (userProfile?.name) {
      const parts = userProfile.name.trim().split(/\s+/);
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    }
    return 'PA';
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentTab('Dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleTabPress = (tabId) => {
    if (tabId === 'More') {
      setHubModalVisible(true);
    } else {
      setCurrentTab(tabId);
    }
  };

  const handleSelectHubModule = (moduleId) => {
    setHubModalVisible(false);
    setCurrentTab(moduleId);
  };

  if (!isAuthenticated && !checkingAuth) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const renderActiveScreen = () => {
    const navProps = { onNavigate: (tab) => setCurrentTab(tab) };
    switch (currentTab) {
      case 'Dashboard':      return <DashboardScreen {...navProps} />;
      case 'Jobs':           return <JobsScreen {...navProps} />;
      case 'Resume Lab':     return <ResumeLabScreen {...navProps} />;
      case 'Templates':      return <TemplatesScreen {...navProps} />;
      case 'Cover Letter':   return <CoverLetterScreen {...navProps} />;
      case 'Roadmap':        return <RoadmapScreen {...navProps} />;
      case 'Role Explorer':  return <RoleExplorerScreen {...navProps} />;
      case 'Salary':         return <SalaryCalculatorScreen {...navProps} />;
      case 'Mock Test':      return <MockTestScreen {...navProps} />;
      case 'Flashcards':     return <FlashcardsScreen {...navProps} />;
      case 'Live Interview': return <LiveInterviewerScreen {...navProps} />;
      case 'AI Advisor':     return <AIChatScreen {...navProps} />;
      case 'Applications':   return <ApplicationsScreen {...navProps} />;
      case 'Analytics':      return <AdminAnalyticsScreen {...navProps} />;
      case 'Notifications':  return <NotificationsScreen {...navProps} />;
      case 'Profile':        return <ProfileScreen {...navProps} />;
      case 'Settings':       return <SettingsScreen onLogout={handleLogout} />;
      default:               return <DashboardScreen {...navProps} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1f" />

      {/* Native App Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>🚀</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>Career AI</Text>
            <Text style={styles.brandSubtitle}>Mobile App • Sync Active</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setCurrentTab('Notifications')}
            activeOpacity={0.7}
          >
            <Text style={styles.iconBtnText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => setCurrentTab('Profile')}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Screen Content */}
      <View style={styles.content}>{renderActiveScreen()}</View>

      {/* Native 5-Tab Fixed Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        {MAIN_TABS.map((tab) => {
          const isActive = currentTab === tab.id && !hubModalVisible;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Mobile App Hub Drawer Modal */}
      <Modal
        visible={hubModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setHubModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>🎛️ App Features & Tools</Text>
              <Text style={styles.modalSubtitle}>All career tools synchronized in your mobile app</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setHubModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.hubGrid}>
            {HUB_MODULES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.hubCard,
                  currentTab === item.id && styles.hubCardActive,
                ]}
                onPress={() => handleSelectHubModule(item.id)}
                activeOpacity={0.75}
              >
                <View style={styles.hubCardTop}>
                  <Text style={styles.hubIcon}>{item.icon}</Text>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
                </View>
                <Text style={styles.hubCardTitle}>{item.title}</Text>
                <Text style={styles.hubCardDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0f1729',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1e3a8a',
    justify: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  logoText: { fontSize: 18 },
  brandTitle: { fontSize: 16, fontWeight: '900', color: '#f8fafc' },
  brandSubtitle: { fontSize: 10, color: '#38bdf8', fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnText: { fontSize: 16 },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#60a5fa',
  },
  avatarText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  content: { flex: 1 },
  bottomNavContainer: {
    flexDirection: 'row',
    backgroundColor: '#0f1729',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#1e293b',
  },
  tabIcon: { fontSize: 20, marginBottom: 2, opacity: 0.7 },
  tabIconActive: { opacity: 1, transform: [{ scale: 1.1 }] },
  tabLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  tabLabelActive: { color: '#38bdf8', fontWeight: '900' },

  // Modal styles
  modalContainer: { flex: 1, backgroundColor: '#0a0f1f' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#0f1729',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#f8fafc' },
  modalSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  hubGrid: { padding: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  hubCard: {
    width: '48%',
    backgroundColor: '#131c2d',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  hubCardActive: { borderColor: '#3b82f6', backgroundColor: '#172554' },
  hubCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  hubIcon: { fontSize: 24 },
  tagBadge: { backgroundColor: '#1e293b', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  tagText: { color: '#94a3b8', fontSize: 9, fontWeight: '800' },
  hubCardTitle: { fontSize: 13, fontWeight: '800', color: '#f8fafc', marginBottom: 4 },
  hubCardDesc: { fontSize: 11, color: '#94a3b8', lineHeight: 15 },
});
