import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { rolesExplorer } from '../api/client';

const DEFAULT_ROLES = [
  { id: '1', title: 'Full Stack Engineer', category: 'Software Engineering', salary: '$110,000 - $160,000', growth: '+22%', skills: ['React', 'Node.js', 'TypeScript', 'SQL'] },
  { id: '2', title: 'AI / ML Engineer', category: 'Artificial Intelligence', salary: '$130,000 - $210,000', growth: '+35%', skills: ['Python', 'PyTorch', 'TensorFlow', 'LLMs'] },
  { id: '3', title: 'DevOps / SRE Specialist', category: 'Infrastructure', salary: '$115,000 - $175,000', growth: '+28%', skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'] },
  { id: '4', title: 'Data Scientist', category: 'Data & Analytics', salary: '$105,000 - $155,000', growth: '+20%', skills: ['Python', 'R', 'Pandas', 'Spark'] },
  { id: '5', title: 'Mobile App Developer', category: 'Mobile', salary: '$100,000 - $150,000', growth: '+18%', skills: ['React Native', 'Swift', 'Kotlin'] },
  { id: '6', title: 'Cybersecurity Analyst', category: 'Security', salary: '$110,000 - $165,000', growth: '+31%', skills: ['SIEM', 'Penetration Testing', 'Network Security'] },
];

export default function RoleExplorerScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [loading, setLoading] = useState(false);

  const CATEGORIES = ['All', 'Software Engineering', 'Artificial Intelligence', 'Infrastructure', 'Mobile'];

  useEffect(() => {
    loadLiveRoles();
  }, []);

  const loadLiveRoles = async () => {
    try {
      setLoading(true);
      const res = await rolesExplorer.getAll();
      if (res && Array.isArray(res) && res.length > 0) {
        const formatted = res.map((r, idx) => ({
          id: String(r.id || idx + 1),
          title: r.title || r.name || 'Role',
          category: r.category || 'Software Engineering',
          salary: r.salary || r.salaryRange || '$100,000 - $150,000',
          growth: r.growth || '+20%',
          skills: Array.isArray(r.skills) ? r.skills : ['React', 'Node.js', 'Python'],
        }));
        setRoles(formatted);
      }
    } catch (e) {
      console.log('Role explorer load fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || role.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🧭 Role Explorer (250+ Tech Roles)</Text>
        <Text style={styles.headerSubtitle}>Discover career paths, salaries, required skills & market demand</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Search roles (e.g. AI, DevOps, Mobile)..."
        placeholderTextColor="#475569"
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredRoles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.roleCard}>
            <View style={styles.roleHeader}>
              <Text style={styles.roleTitle}>{item.title}</Text>
              <Text style={styles.growthBadge}>{item.growth} Growth</Text>
            </View>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.salaryText}>💰 {item.salary} / year</Text>

            <View style={styles.skillsRow}>
              {item.skills.map((s, idx) => (
                <View key={idx} style={styles.skillTag}>
                  <Text style={styles.skillTagText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0a0f1f' },
  header: { marginBottom: 14, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#f8fafc' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  searchInput: { backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', marginBottom: 12 },
  categoriesScroll: { maxHeight: 40, marginBottom: 14 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e293b', marginRight: 8 },
  catChipActive: { backgroundColor: '#2563eb' },
  catText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  catTextActive: { color: '#fff', fontWeight: '800' },
  roleCard: { backgroundColor: '#0f1729', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' },
  roleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roleTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  growthBadge: { fontSize: 11, fontWeight: '800', color: '#10b981', backgroundColor: '#064e3b', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  categoryText: { fontSize: 12, color: '#94a3b8', marginVertical: 4 },
  salaryText: { fontSize: 14, fontWeight: '700', color: '#38bdf8', marginVertical: 6 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  skillTag: { backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  skillTagText: { fontSize: 11, color: '#cbd5e1' },
});
