import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';

const TEMPLATE_CATEGORIES = ['All', 'Tech', 'Executive', 'Creative', 'Minimalist', 'Modern'];

const TEMPLATES_LIST = [
  { id: '1', name: 'Silicon Valley Pro', category: 'Tech', rating: '4.9 ⭐', color: '#2563eb', tag: 'Popular', desc: 'Designed for Software Engineers, Frontend, Backend & System Architects.' },
  { id: '2', name: 'Executive Suite', category: 'Executive', rating: '4.8 ⭐', color: '#0f1729', tag: 'Formal', desc: 'Sleek corporate layout suited for Engineering Managers & VPs.' },
  { id: '3', name: 'Creative Designer', category: 'Creative', rating: '4.9 ⭐', color: '#db2777', tag: 'Vibrant', desc: 'Modern high-impact design for UI/UX, Product Designers & Marketers.' },
  { id: '4', name: 'Clean Minimalist', category: 'Minimalist', rating: '4.7 ⭐', color: '#475569', tag: 'Clean', desc: 'Distraction-free single column format that maximizes ATS parser readability.' },
  { id: '5', name: 'Full-Stack Developer', category: 'Tech', rating: '5.0 ⭐', color: '#059669', tag: 'ATS Standard', desc: 'Optimized keyword grid layout for React, Node, Python & Cloud stack roles.' },
  { id: '6', name: 'Modern Specialist', category: 'Modern', rating: '4.8 ⭐', color: '#7c3aed', tag: 'Sleek', desc: 'Balanced visual hierarchy with skill badges and project timeline cards.' },
];

export default function TemplatesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTemplateModal, setSelectedTemplateModal] = useState(null);

  const filteredTemplates = selectedCategory === 'All'
    ? TEMPLATES_LIST
    : TEMPLATES_LIST.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template) => {
    setSelectedTemplateModal(null);
    Alert.alert(
      'Template Selected! 🎉',
      `"${template.name}" has been loaded into your Resume Lab builder!`
    );
  };

  const renderTemplateItem = ({ item }) => (
    <TouchableOpacity
      style={styles.templateCard}
      onPress={() => setSelectedTemplateModal(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.previewHeader, { backgroundColor: item.color }]}>
        <Text style={styles.badgeTag}>{item.tag}</Text>
        <Text style={styles.previewTitle}>RESUME</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.templateName}>{item.name}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <TouchableOpacity style={styles.useBtn} onPress={() => setSelectedTemplateModal(item)}>
          <Text style={styles.useBtnText}>Preview & Use</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎨 180+ Premium Templates</Text>
        <Text style={styles.headerSub}>Choose an ATS-optimized professional resume layout</Text>
      </View>

      {/* Category Pills */}
      <View style={styles.categoryBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryBar}
          contentContainerStyle={styles.categoryContent}
        >
          {TEMPLATE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catPill,
                selectedCategory === cat && styles.catPillActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.catText,
                  selectedCategory === cat && styles.catTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Templates Grid */}
      <FlatList
        data={filteredTemplates}
        renderItem={renderTemplateItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.gridContent}
      />

      {/* Template Details & Preview Modal */}
      {selectedTemplateModal && (
        <Modal
          visible={!!selectedTemplateModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setSelectedTemplateModal(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={[styles.modalBanner, { backgroundColor: selectedTemplateModal.color }]}>
                <Text style={styles.modalBannerTag}>{selectedTemplateModal.tag}</Text>
                <Text style={styles.modalBannerTitle}>{selectedTemplateModal.name}</Text>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.modalCategoryText}>Category: {selectedTemplateModal.category} • Rating: {selectedTemplateModal.rating}</Text>
                <Text style={styles.modalDesc}>{selectedTemplateModal.desc}</Text>

                <View style={styles.featuresList}>
                  <Text style={styles.featureItem}>✓ 100% ATS Parser Compatible</Text>
                  <Text style={styles.featureItem}>✓ One-click PDF & Docx export</Text>
                  <Text style={styles.featureItem}>✓ Dynamic color palette & typography</Text>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setSelectedTemplateModal(null)}
                >
                  <Text style={styles.cancelBtnText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => handleUseTemplate(selectedTemplateModal)}
                >
                  <Text style={styles.confirmBtnText}>Apply Template</Text>
                </TouchableOpacity>
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
  categoryBarWrapper: { backgroundColor: '#0f1729', paddingBottom: 8 },
  categoryBar: { maxHeight: 44 },
  categoryContent: { paddingHorizontal: 12, gap: 8 },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#131c2d',
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  catPillActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  catText: { fontSize: 13, color: '#94a3b8', fontWeight: '600' },
  catTextActive: { color: '#ffffff' },
  gridContent: { padding: 12 },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 12 },
  templateCard: {
    width: '48%',
    backgroundColor: '#131c2d',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  previewHeader: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  badgeTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  previewTitle: { color: '#ffffff', fontSize: 14, fontWeight: '900', letterSpacing: 2, opacity: 0.9 },
  cardBody: { padding: 10 },
  templateName: { fontSize: 13, fontWeight: '800', color: '#f8fafc' },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: 8 },
  categoryText: { fontSize: 11, color: '#94a3b8' },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#fbbf24' },
  useBtn: { backgroundColor: '#1e3a8a', paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  useBtnText: { color: '#93c5fd', fontWeight: '700', fontSize: 12 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#0f1729',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  modalBanner: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBannerTag: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  modalBannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  modalBody: {
    padding: 18,
  },
  modalCategoryText: {
    fontSize: 12,
    color: '#60a5fa',
    fontWeight: '700',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    marginBottom: 14,
  },
  featuresList: {
    gap: 6,
    backgroundColor: '#131c2d',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  featureItem: {
    fontSize: 12,
    color: '#34d399',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#94a3b8',
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#ffffff',
    fontWeight: '800',
  },
});
