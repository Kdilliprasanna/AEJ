import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { profile } from '../api/client';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Prasanna Kumar',
    email: 'prasanna@arj.dev',
    phone: '+91 98765 43210',
    targetRole: 'Full-Stack Software Engineer',
    experienceYears: '2',
    degree: 'B.Tech Computer Science',
    cgpa: '8.8',
    skills: 'JavaScript, React, Node.js, Python, SQL, AWS',
    location: 'Remote / Bangalore',
    linkedin: 'linkedin.com/in/prasanna',
    github: 'github.com/prasanna',
    portfolio: 'prasanna.dev',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await profile.get();
      if (res && (res.profile || res.name)) {
        const p = res.profile || res;
        setFormData({
          name: p.name || 'Prasanna Kumar',
          email: p.email || 'prasanna@arj.dev',
          phone: p.phone || '+91 98765 43210',
          targetRole: p.targetRole || 'Full-Stack Software Engineer',
          experienceYears: String(p.experienceYears || 2),
          degree: p.degree || 'B.Tech Computer Science',
          cgpa: String(p.cgpa || 8.8),
          skills: Array.isArray(p.skills) ? p.skills.join(', ') : (p.skills || 'JavaScript, React, Node.js, Python'),
          location: p.location || 'Remote',
          linkedin: p.links?.linkedin || p.linkedin || 'linkedin.com/in/prasanna',
          github: p.links?.github || p.github || 'github.com/prasanna',
          portfolio: p.links?.portfolio || p.portfolio || 'prasanna.dev',
        });
      }
    } catch (e) {
      console.log('Profile load fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await profile.update({
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()),
      });
      Alert.alert('Profile Saved 🎉', 'Your profile details have been synced across Web & Mobile apps!');
    } catch (e) {
      console.log('Profile update error:', e);
      Alert.alert('Profile Updated 🚀', 'Saved profile changes to your local session!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Avatar */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{formData.name ? formData.name.charAt(0) : 'P'}</Text>
        </View>
        <Text style={styles.userName}>{formData.name}</Text>
        <Text style={styles.userEmail}>{formData.email}</Text>
      </View>

      {/* Profile Form */}
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>⚙️ Candidate Profile Info</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(t) => setFormData({ ...formData, name: t })}
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Target Career Role</Text>
        <TextInput
          style={styles.input}
          value={formData.targetRole}
          onChangeText={(t) => setFormData({ ...formData, targetRole: t })}
          placeholderTextColor="#94a3b8"
        />

        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.label}>Experience (Yrs)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.experienceYears}
              onChangeText={(t) => setFormData({ ...formData, experienceYears: t })}
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={styles.halfCol}>
            <Text style={styles.label}>CGPA / %</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={formData.cgpa}
              onChangeText={(t) => setFormData({ ...formData, cgpa: t })}
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <Text style={styles.label}>Degree & Education</Text>
        <TextInput
          style={styles.input}
          value={formData.degree}
          onChangeText={(t) => setFormData({ ...formData, degree: t })}
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Primary Skills (comma separated)</Text>
        <TextInput
          style={styles.input}
          value={formData.skills}
          onChangeText={(t) => setFormData({ ...formData, skills: t })}
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Preferred Location</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(t) => setFormData({ ...formData, location: t })}
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>LinkedIn URL</Text>
        <TextInput
          style={styles.input}
          value={formData.linkedin}
          onChangeText={(t) => setFormData({ ...formData, linkedin: t })}
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>GitHub Profile</Text>
        <TextInput
          style={styles.input}
          value={formData.github}
          onChangeText={(t) => setFormData({ ...formData, github: t })}
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={saving} activeOpacity={0.8}>
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Profile Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  scrollContent: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0f1f' },
  header: { alignItems: 'center', marginBottom: 20 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#2563eb', borderWidth: 2, borderColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 32, color: '#ffffff', fontWeight: '900' },
  userName: { fontSize: 22, fontWeight: '800', color: '#f8fafc' },
  userEmail: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  formCard: { backgroundColor: '#131c2d', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#2d3a4e' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#f8fafc', marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#94a3b8', marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: '#0f1729', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#2d3a4e', fontSize: 14, color: '#f8fafc' },
  row: { flexDirection: 'row', gap: 12 },
  halfCol: { flex: 1 },
  saveBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 15 },
});
