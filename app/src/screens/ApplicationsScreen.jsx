import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { applications } from '../api/client';

const STAGE_FILTERS = ['All', 'Applied', 'In Review', 'Interviewing', 'Offered', 'Rejected'];

export default function ApplicationsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedAppModal, setSelectedAppModal] = useState(null);
  const [appList, setAppList] = useState([
    {
      id: '1',
      title: 'Senior Full-Stack Engineer',
      company: 'TechCorp Global',
      location: 'Remote',
      status: 'Interviewing',
      appliedDate: '2026-07-20',
      salary: '$135,000/yr',
      notes: 'Passed initial screening round. Technical architecture interview scheduled.',
    },
    {
      id: '2',
      title: 'React Native Developer',
      company: 'Innovate Solutions',
      location: 'Bangalore, IN',
      status: 'Applied',
      appliedDate: '2026-07-22',
      salary: '₹22,00,000/yr',
      notes: 'Applied via ARJ Instant Matcher.',
    },
    {
      id: '3',
      title: 'Frontend Lead Architect',
      company: 'CloudScale Inc',
      location: 'Hybrid',
      status: 'Offered',
      appliedDate: '2026-07-15',
      salary: '$150,000/yr',
      notes: 'Official offer letter received! Final salary negotiation in progress.',
    },
    {
      id: '4',
      title: 'Software Engineer',
      company: 'Apex Systems',
      location: 'Remote',
      status: 'In Review',
      appliedDate: '2026-07-21',
      salary: '$115,000/yr',
      notes: 'Resume submitted directly to hiring manager.',
    },
  ]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await applications.getAll();
      const list = Array.isArray(res) ? res : (res?.applications || []);
      if (list && list.length > 0) {
        setAppList(list);
      }
    } catch (e) {
      console.log('Applications load fallback:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = (app, newStatus) => {
    const updated = appList.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a));
    setAppList(updated);
    setSelectedAppModal(null);
    Alert.alert('Status Updated! 🚀', `Application for "${app.title}" moved to ${newStatus}.`);
  };

  const filteredApps = selectedStage === 'All'
    ? appList
    : appList.filter((a) => a.status?.toLowerCase() === selectedStage.toLowerCase());

  const renderAppItem = ({ item }) => {
    let statusBg = '#1e3a8a';
    let statusColor = '#93c5fd';
    let borderColor = '#3b82f6';

    if (item.status === 'Interviewing') {
      statusBg = '#78350f';
      statusColor = '#fbbf24';
      borderColor = '#f59e0b';
    } else if (item.status === 'Offered') {
      statusBg = '#064e3b';
      statusColor = '#34d399';
      borderColor = '#10b981';
    } else if (item.status === 'Rejected') {
      statusBg = '#7f1d1d';
      statusColor = '#fca5a5';
      borderColor = '#ef4444';
    } else if (item.status === 'In Review') {
      statusBg = '#581c87';
      statusColor = '#c084fc';
      borderColor = '#a855f7';
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedAppModal(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <Text style={styles.companyInitial}>
              {item.company ? item.company.charAt(0) : '💼'}
            </Text>
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.roleTitle}>{item.title}</Text>
            <Text style={styles.companySub}>{item.company} • {item.location}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor, borderWidth: 1 }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>Applied on: {item.appliedDate}</Text>
          <Text style={styles.salaryText}>{item.salary}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Applications Tracker</Text>
        <Text style={styles.headerSub}>Live pipeline tracking for all your job applications</Text>
      </View>

      {/* Stage Filters */}
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STAGE_FILTERS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterPill,
                selectedStage === item && styles.filterPillActive,
              ]}
              onPress={() => setSelectedStage(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedStage === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterContent}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredApps}
        renderItem={renderAppItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadApplications(); }}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
          />
        }
      />

      {/* Application Detail & Status Update Modal */}
      {selectedAppModal && (
        <Modal
          visible={!!selectedAppModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedAppModal(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>{selectedAppModal.title}</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedAppModal(null)}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalCompany}>{selectedAppModal.company} • {selectedAppModal.location}</Text>
              <Text style={styles.modalNotes}>Notes: {selectedAppModal.notes}</Text>

              <Text style={styles.modalSectionLabel}>Update Application Stage:</Text>
              <View style={styles.stageOptionsRow}>
                {['Applied', 'In Review', 'Interviewing', 'Offered', 'Rejected'].map((stage) => (
                  <TouchableOpacity
                    key={stage}
                    style={[
                      styles.stageBtn,
                      selectedAppModal.status === stage && styles.stageBtnActive,
                    ]}
                    onPress={() => handleUpdateStatus(selectedAppModal, stage)}
                  >
                    <Text
                      style={[
                        styles.stageBtnText,
                        selectedAppModal.status === stage && styles.stageBtnTextActive,
                      ]}
                    >
                      {stage}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  header: { padding: 16, backgroundColor: '#0f1729', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  headerSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  filterBar: { backgroundColor: '#0f1729', paddingVertical: 8 },
  filterContent: { paddingHorizontal: 12, gap: 8 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#131c2d', borderWidth: 1, borderColor: '#2d3a4e' },
  filterPillActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  filterText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  filterTextActive: { color: '#ffffff' },
  listContent: { padding: 14, gap: 10 },
  card: { backgroundColor: '#131c2d', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#2d3a4e' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#1e3a8a', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  companyInitial: { fontSize: 18, fontWeight: '800', color: '#60a5fa' },
  titleBox: { flex: 1 },
  roleTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  companySub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '800' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#1e293b' },
  footerText: { fontSize: 11, color: '#94a3b8' },
  salaryText: { fontSize: 12, fontWeight: '800', color: '#34d399' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f1729', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, borderWidth: 1, borderColor: '#2d3a4e' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#f8fafc', flex: 1 },
  closeBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  closeBtnText: { color: '#94a3b8', fontWeight: '800' },
  modalCompany: { fontSize: 13, color: '#60a5fa', fontWeight: '700', marginBottom: 8 },
  modalNotes: { fontSize: 12, color: '#cbd5e1', marginBottom: 16, lineHeight: 18 },
  modalSectionLabel: { fontSize: 14, fontWeight: '800', color: '#f8fafc', marginBottom: 10 },
  stageOptionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stageBtn: { backgroundColor: '#131c2d', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#2d3a4e' },
  stageBtnActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  stageBtnText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  stageBtnTextActive: { color: '#ffffff', fontWeight: '800' },
});
