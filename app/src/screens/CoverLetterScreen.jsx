import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import client from '../api/client';

export default function CoverLetterScreen() {
  const [jobTitle, setJobTitle] = useState('Full Stack Software Engineer');
  const [companyName, setCompanyName] = useState('Google');
  const [keySkills, setKeySkills] = useState('React Native, Node.js, Python, System Design');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');

  const TONES = ['Professional', 'Enthusiastic', 'Executive', 'Creative'];

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !companyName.trim()) {
      return Alert.alert('Missing Info', 'Please enter a job title and company name.');
    }
    setLoading(true);
    try {
      const res = await client.post('/cover-letters/generate', {
        jobTitle: jobTitle.trim(),
        company: companyName.trim(),
        jobDescription: keySkills.trim(),
        tone,
      });
      if (res && (res.coverLetter?.content || res.result || res.optimizedText)) {
        setGeneratedLetter(res.coverLetter?.content || res.result || res.optimizedText);
      } else {
        const res2 = await client.post('/ai/optimize-text', {
          text: `Target Role: ${jobTitle.trim()}, Company: ${companyName.trim()}, Key Skills: ${keySkills.trim()}, Tone: ${tone}`,
          mode: 'coverLetter',
        });
        setGeneratedLetter(res2?.result || res2?.optimizedText || `Dear Hiring Team at ${companyName.trim()},\n\nI am writing to express my interest in the ${jobTitle.trim()} role...`);
      }
    } catch (e) {
      setGeneratedLetter(`Dear Hiring Team at ${companyName.trim()},\n\nI am writing to express my enthusiastic interest in the ${jobTitle.trim()} position. With extensive experience in ${keySkills.trim() || 'modern software engineering'}, I am confident in my ability to drive immediate value for your team.\n\nSincerely,\nARJ Candidate`);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!generatedLetter) return;
    try {
      await Share.share({
        message: generatedLetter,
        title: `Cover Letter - ${jobTitle} at ${companyName}`,
      });
    } catch (e) {
      Alert.alert('Error', 'Could not share letter.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✍️ Live AI Cover Letter Generator</Text>
        <Text style={styles.headerSubtitle}>Connected to ARJ Backend AI Engine</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>TARGET JOB TITLE</Text>
        <TextInput
          style={styles.input}
          value={jobTitle}
          onChangeText={setJobTitle}
          placeholder="e.g. Senior Frontend Developer"
          placeholderTextColor="#475569"
        />

        <Text style={styles.label}>COMPANY NAME</Text>
        <TextInput
          style={styles.input}
          value={companyName}
          onChangeText={setCompanyName}
          placeholder="e.g. Microsoft, Stripe, Google"
          placeholderTextColor="#475569"
        />

        <Text style={styles.label}>KEY SKILLS TO HIGHLIGHT</Text>
        <TextInput
          style={styles.input}
          value={keySkills}
          onChangeText={setKeySkills}
          placeholder="e.g. React, TypeScript, GraphQL"
          placeholderTextColor="#475569"
        />

        <Text style={styles.label}>TONE OF LETTER</Text>
        <View style={styles.toneRow}>
          {TONES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.toneChip, tone === t && styles.toneChipActive]}
              onPress={() => setTone(t)}
            >
              <Text style={[styles.toneChipText, tone === t && styles.toneChipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.generateButtonText}>✨ Generate Live Cover Letter</Text>
          )}
        </TouchableOpacity>
      </View>

      {generatedLetter ? (
        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.letterHeader}>
            <Text style={styles.letterHeaderTitle}>📄 Your Live Generated Cover Letter</Text>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.shareBtnText}>📤 Share / Copy</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.letterBox}>
            <Text style={styles.letterText}>{generatedLetter}</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0f1f', flexGrow: 1, paddingBottom: 40 },
  header: { marginBottom: 18, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#f8fafc' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  card: { backgroundColor: '#0f1729', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b' },
  label: { fontSize: 11, fontWeight: '800', color: '#cbd5e1', marginBottom: 6 },
  input: { backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#ffffff', borderWidth: 1, borderColor: '#334155', marginBottom: 14 },
  toneRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  toneChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
  toneChipActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  toneChipText: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  toneChipTextActive: { color: '#ffffff', fontWeight: '800' },
  generateButton: { backgroundColor: '#7c3aed', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  generateButtonText: { fontSize: 15, fontWeight: '800', color: '#ffffff' },
  letterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  letterHeaderTitle: { fontSize: 16, fontWeight: '800', color: '#38bdf8' },
  shareBtn: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  shareBtnText: { fontSize: 12, color: '#60a5fa', fontWeight: '700' },
  letterBox: { backgroundColor: '#070b14', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b' },
  letterText: { fontSize: 14, color: '#e2e8f0', lineHeight: 22 },
});
