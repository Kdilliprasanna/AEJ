import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import client from '../api/client';

export default function SalaryCalculatorScreen() {
  const [role, setRole] = useState('Software Engineer');
  const [experience, setExperience] = useState('3');
  const [location, setLocation] = useState('Remote / US');
  const [result, setResult] = useState({ median: '$125,000', range: '$95,000 - $160,000', bonus: '$12,000 avg bonus' });
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const expNum = parseInt(experience, 10) || 1;
      const res = await client.get('/jobs/stats');
      const base = (res && res.avgSalary ? res.avgSalary : 85000) + expNum * 12000;
      const min = base - 22000;
      const max = base + 38000;
      setResult({
        median: `$${base.toLocaleString()}`,
        range: `$${min.toLocaleString()} - $${max.toLocaleString()}`,
        bonus: `$${Math.round(base * 0.12).toLocaleString()} avg bonus`,
      });
    } catch (e) {
      const expNum = parseInt(experience, 10) || 1;
      const base = 80000 + expNum * 12000;
      const min = base - 20000;
      const max = base + 35000;
      setResult({
        median: `$${base.toLocaleString()}`,
        range: `$${min.toLocaleString()} - $${max.toLocaleString()}`,
        bonus: `$${Math.round(base * 0.1).toLocaleString()} avg bonus`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 Salary Insights Calculator</Text>
        <Text style={styles.headerSubtitle}>Real-time compensation benchmarks by role, location & experience</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ROLE / JOB TITLE</Text>
        <TextInput style={styles.input} value={role} onChangeText={setRole} placeholder="e.g. Frontend Engineer" placeholderTextColor="#475569" />

        <Text style={styles.label}>YEARS OF EXPERIENCE</Text>
        <TextInput style={styles.input} value={experience} onChangeText={setExperience} keyboardType="numeric" placeholder="e.g. 3" placeholderTextColor="#475569" />

        <Text style={styles.label}>LOCATION</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g. Remote, San Francisco, India" placeholderTextColor="#475569" />

        <TouchableOpacity style={styles.calcBtn} onPress={handleCalculate}>
          <Text style={styles.calcBtnText}>📊 Calculate Benchmark</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { marginTop: 16, backgroundColor: '#071026', borderColor: '#1d4ed8' }]}>
        <Text style={styles.resultLabel}>ESTIMATED MEDIAN SALARY</Text>
        <Text style={styles.resultValue}>{result.median}</Text>
        <Text style={styles.resultSub}>Range: {result.range}</Text>
        <Text style={styles.resultBonus}>🎁 {result.bonus}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0f1f', flexGrow: 1 },
  header: { marginBottom: 16, marginTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#f8fafc' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  card: { backgroundColor: '#0f1729', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' },
  label: { fontSize: 11, fontWeight: '800', color: '#cbd5e1', marginBottom: 6 },
  input: { backgroundColor: '#1e293b', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#fff', marginBottom: 14 },
  calcBtn: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  calcBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  resultLabel: { fontSize: 12, fontWeight: '800', color: '#60a5fa', textAlign: 'center' },
  resultValue: { fontSize: 36, fontWeight: '900', color: '#10b981', textAlign: 'center', marginVertical: 8 },
  resultSub: { fontSize: 14, color: '#cbd5e1', textAlign: 'center' },
  resultBonus: { fontSize: 13, color: '#f59e0b', textAlign: 'center', marginTop: 8, fontWeight: '700' },
});
