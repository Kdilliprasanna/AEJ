import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import client from '../api/client';

export default function RoadmapScreen() {
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);

  const DEFAULT_MILESTONES = [
    { step: 1, title: 'Foundations & Language Core', duration: 'Weeks 1-3', items: ['JavaScript ES6+, TypeScript', 'HTML5 Semantic Structure & CSS Flex/Grid', 'Git, GitHub, Branching Strategy'] },
    { step: 2, title: 'Frontend Framework Mastery', duration: 'Weeks 4-6', items: ['React.js Hooks, Context, State Management', 'TailwindCSS & Glassmorphism Design Systems', 'REST API & GraphQL Data Fetching'] },
    { step: 3, title: 'Backend & Database Architecture', duration: 'Weeks 7-9', items: ['Node.js & Express.js Async Patterns', 'Relational SQLite / PostgreSQL Schemas', 'JWT Auth & Security Best Practices'] },
    { step: 4, title: 'DevOps, Testing & Deployment', duration: 'Weeks 10-12', items: ['Docker Containerization', 'CI/CD Pipelines with GitHub Actions', 'Cloud Deployment (Vercel, AWS, Render)'] },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await client.post('/career-roadmap/generate', { targetRole });
      if (res && res.roadmap && res.roadmap.milestones) {
        const formatted = res.roadmap.milestones.map((m, idx) => ({
          step: idx + 1,
          title: m.title,
          duration: m.duration || `Phase ${idx + 1}`,
          items: m.desc ? [m.desc] : (m.items || ['Master key competencies and projects']),
        }));
        setRoadmapData(formatted);
      } else {
        setRoadmapData(DEFAULT_MILESTONES);
      }
    } catch (e) {
      setRoadmapData(DEFAULT_MILESTONES);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🗺️ AI Career Roadmap</Text>
        <Text style={styles.headerSubtitle}>Personalized step-by-step learning path to land your dream role</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>TARGET CAREER GOAL</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={targetRole}
            onChangeText={setTargetRole}
            placeholder="e.g. AI Engineer, DevOps Specialist"
            placeholderTextColor="#475569"
          />
          <TouchableOpacity style={styles.btn} onPress={handleGenerate} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Generate</Text>}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📍 Learning Milestones for {targetRole}</Text>
      </View>

      {(roadmapData || DEFAULT_MILESTONES).map((item) => (
        <View key={item.step} style={styles.stepCard}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNumber}>Step {item.step}</Text>
            <Text style={styles.stepDuration}>{item.duration}</Text>
          </View>
          <Text style={styles.stepTitle}>{item.title}</Text>
          <View style={styles.itemsList}>
            {item.items.map((sub, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={styles.itemDot}>•</Text>
                <Text style={styles.itemText}>{sub}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0f1f', flexGrow: 1, paddingBottom: 40 },
  header: { marginBottom: 16, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#f8fafc' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  card: { backgroundColor: '#0f1729', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '800', color: '#cbd5e1', marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 10 },
  input: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#fff' },
  btn: { backgroundColor: '#2563eb', paddingHorizontal: 18, borderRadius: 12, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '800' },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#38bdf8' },
  stepCard: { backgroundColor: '#0f1729', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' },
  stepBadge: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stepNumber: { fontSize: 12, fontWeight: '900', color: '#60a5fa', backgroundColor: '#172554', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  stepDuration: { fontSize: 12, color: '#94a3b8' },
  stepTitle: { fontSize: 16, fontWeight: '800', color: '#ffffff', marginBottom: 10 },
  itemsList: { gap: 6 },
  itemRow: { flexDirection: 'row', gap: 8 },
  itemDot: { color: '#38bdf8', fontSize: 14 },
  itemText: { fontSize: 13, color: '#cbd5e1', flex: 1 },
});
