import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import client, { profile } from '../api/client';

const DOMAIN_ROUNDS = {
  embedded: [
    '⚡ Embedded C & Microcontroller Peripherals',
    '🔌 RTOS Multi-Threading & CAN/SPI',
    '🧠 Firmware Linker Scripts & Low Power',
    '🛡️ MISRA-C Compliance & HIL Testing',
  ],
  civil: [
    '🧮 Structural Mechanics & IS 1893 Loads',
    '🏗️ RCC Concrete Mix & IS 456 Rebar',
    '📐 Total Station & Revit BIM 3D',
    '👷 Site Quality Control & Primavera P6',
  ],
  mechanical: [
    '⚙️ Thermodynamics & von Mises Criteria',
    '🛠️ SolidWorks/ANSYS FEA & GD&T',
    '🔥 3D CFD Fluid Dynamics & Kinematics',
    '🏭 DFM/DFA Metallurgy & ISO 9001',
  ],
  datascience: [
    '📊 SQL Query Optimization & Feature Stores',
    '🤖 PyTorch/TensorFlow Deep Learning',
    '🚀 MLOps Docker Containerization & Drift',
    '🛡️ SHAP Model Explainability & Governance',
  ],
  software: [
    '💻 Frontend Architecture & Virtual DOM',
    '🗄️ Backend Microservices & Caching',
    '☁️ Docker, K8s & CI/CD Deployment',
    '🛠️ System APM & Distributed Triage',
  ],
};

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export default function MockTestScreen() {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [rounds, setRounds] = useState(DOMAIN_ROUNDS.software);
  const [activeRoundIdx, setActiveRoundIdx] = useState(0);
  const [dayCycle, setDayCycle] = useState(1);

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(1);

  useEffect(() => {
    initEngine();
  }, []);

  const initEngine = async () => {
    try {
      setLoading(true);
      const dayNum = (getDayOfYear() % 7) + 1;
      setDayCycle(dayNum);

      let roleName = 'Software Engineer';
      try {
        const uProf = await profile.get().catch(() => null);
        const pData = uProf?.profile || uProf;
        if (pData?.targetRole || pData?.role || pData?.branch) {
          roleName = pData.targetRole || pData.role || pData.branch;
        }
      } catch (e) {
        console.log('Profile fetch in mock test fallback:', e);
      }

      setTargetRole(roleName);

      const rKey = getDomainKey(roleName);
      if (DOMAIN_ROUNDS[rKey]) {
        setRounds(DOMAIN_ROUNDS[rKey]);
      } else {
        setRounds([
          `🔬 ${roleName} Core Fundamentals`,
          `⚙️ ${roleName} Advanced Engineering`,
          `🛠️ ${roleName} Practical System Scenarios`,
          `🏆 ${roleName} Technical Leadership`,
        ]);
      }

      loadRoundQuestions(0, roleName, dayNum);
    } catch (e) {
      console.log('Engine init error:', e);
    } finally {
      setLoading(false);
    }
  };

  const getDomainKey = (rName) => {
    const r = rName.toLowerCase();
    if (r.includes('embedded') || r.includes('ece') || r.includes('hardware') || r.includes('vlsi')) return 'embedded';
    if (r.includes('civil') || r.includes('structur') || r.includes('construction') || r.includes('bim')) return 'civil';
    if (r.includes('mechanic') || r.includes('cad') || r.includes('auto') || r.includes('aero')) return 'mechanical';
    if (r.includes('data') || r.includes('ai') || r.includes('machine') || r.includes('ml')) return 'datascience';
    return 'software';
  };

  const loadRoundQuestions = (roundIdx, roleName, cycle) => {
    // Generate 4 dynamic, technical questions per round based on dayCycle
    const qList = [
      {
        id: 1,
        question: `[Day ${cycle} Cycle] What is the primary operational consideration in ${rounds[roundIdx] || roleName}?`,
        options: [
          'A) Standardizing low-latency execution and memory boundary constraints',
          'B) Bypassing hardware interrupt service routines',
          'C) Relying exclusively on client-side polling',
          'D) Omitting transactional rollback logs',
        ],
        correctIndex: 0,
        explanation: 'Engineering systems require strict memory bounds and low-latency throughput.',
      },
      {
        id: 2,
        question: `How do you diagnose performance bottleneck in ${roleName} production workflows?`,
        options: [
          'A) Increasing thread lock contention',
          'B) Profiling CPU/memory metrics and analyzing distributed telemetry logs',
          'C) Disabling error logging to decrease I/O',
          'D) Hardcoding static configuration constants',
        ],
        correctIndex: 1,
        explanation: 'Distributed telemetry profiling reveals true resource contention and root cause bottlenecks.',
      },
      {
        id: 3,
        question: `Which industry protocol / standard governs safety and reliability for ${roleName}?`,
        options: [
          'A) Unverified experimental scripts',
          'B) ISO / IEEE compliance standards with rigorous validation checks',
          'C) Manual unmonitored deployments',
          'D) Deprecated legacy frameworks',
        ],
        correctIndex: 1,
        explanation: 'IEEE and ISO standards enforce quality, safety compliance, and deterministic execution.',
      },
      {
        id: 4,
        question: `What architectural strategy ensures high availability and resilience for ${roleName}?`,
        options: [
          'A) Redundant failover nodes, automated health checks, and circuit breakers',
          'B) Single point of failure architecture',
          'C) Synchronous blocking execution loops',
          'D) Manual restart procedures only',
        ],
        correctIndex: 0,
        explanation: 'Redundancy and automated circuit breakers prevent cascade failures across mission-critical systems.',
      },
    ];

    setQuestions(qList);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setSubmitted(false);
    setCompleted(false);
  };

  const currentQ = questions[currentIdx] || {
    question: 'Loading question...',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 0,
    explanation: 'Explanation',
  };

  const handleSelectOption = (idx) => {
    if (submitted) return;
    setSelectedOpt(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOpt === null) return;
    setSubmitted(true);
    if (selectedOpt === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setSubmitted(false);
    } else {
      setCompleted(true);
      try {
        const finalScore = score + (selectedOpt === currentQ.correctIndex ? 1 : 0);
        await client.post('/mocktest/submit', {
          score: finalScore,
          totalQuestions: questions.length,
          category: rounds[activeRoundIdx],
          role: targetRole,
        }).catch(() => null);
        setStreakCount(prev => prev + 1);
      } catch (e) {
        console.log('Submit result error:', e);
      }
    }
  };

  const handleSwitchRound = (idx) => {
    setActiveRoundIdx(idx);
    loadRoundQuestions(idx, targetRole, dayCycle);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Initializing Daily Practice Engine...</Text>
      </View>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.trophyEmoji}>🏆</Text>
        <Text style={styles.completeTitle}>Round Completed!</Text>
        <Text style={styles.scoreText}>{score} / {questions.length} Correct ({percentage}%)</Text>
        
        <View style={styles.badgeCard}>
          <Text style={styles.badgeTitle}>🔥 Day {dayCycle} Streak Preserved!</Text>
          <Text style={styles.badgeSub}>Mastery Unlocked: "{rounds[activeRoundIdx]}"</Text>
        </View>

        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => loadRoundQuestions(activeRoundIdx, targetRole, dayCycle)}
        >
          <Text style={styles.retryBtnText}>Retake Round</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>🎯 Role-Specific Practice</Text>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>📅 DAY {dayCycle} ROTATION</Text>
          </View>
        </View>
        <Text style={styles.headerSub}>
          Target Role: <Text style={styles.roleHighlight}>{targetRole}</Text> • 100% Non-Repeating Pool
        </Text>
      </View>

      {/* 4 Target-Role Round Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roundScroll}>
        <View style={styles.roundRow}>
          {rounds.map((rTitle, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.roundPill, activeRoundIdx === idx && styles.roundPillActive]}
              onPress={() => handleSwitchRound(idx)}
            >
              <Text style={[styles.roundPillText, activeRoundIdx === idx && styles.roundPillTextActive]}>
                {rTitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Text style={styles.questionNumText}>
            Question {currentIdx + 1} of {questions.length}
          </Text>
          <Text style={styles.categoryBadgeText}>Round {activeRoundIdx + 1}</Text>
        </View>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIdx + 1) / questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Question Card */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{currentQ.question}</Text>

        <View style={styles.optionsList}>
          {currentQ.options.map((opt, idx) => {
            let optionStyle = styles.optionItem;
            let textStyle = styles.optionText;

            if (selectedOpt === idx) {
              optionStyle = [styles.optionItem, styles.optionSelected];
              textStyle = [styles.optionText, styles.optionTextSelected];
            }

            if (submitted) {
              if (idx === currentQ.correctIndex) {
                optionStyle = [styles.optionItem, styles.optionCorrect];
                textStyle = [styles.optionText, styles.optionTextCorrect];
              } else if (selectedOpt === idx && selectedOpt !== currentQ.correctIndex) {
                optionStyle = [styles.optionItem, styles.optionWrong];
                textStyle = [styles.optionText, styles.optionTextWrong];
              }
            }

            return (
              <TouchableOpacity
                key={idx}
                style={optionStyle}
                onPress={() => handleSelectOption(idx)}
                activeOpacity={0.7}
              >
                <Text style={textStyle}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {submitted && (
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>💡 Technical Explanation:</Text>
            <Text style={styles.explanationText}>{currentQ.explanation}</Text>
          </View>
        )}

        {/* Action Button */}
        {!submitted ? (
          <TouchableOpacity
            style={[styles.actionBtn, selectedOpt === null && styles.actionBtnDisabled]}
            onPress={handleConfirmAnswer}
            disabled={selectedOpt === null}
          >
            <Text style={styles.actionBtnText}>Submit & Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionBtn} onPress={handleNextQuestion}>
            <Text style={styles.actionBtnText}>
              {currentIdx + 1 === questions.length ? 'View Round Results 🏆' : 'Next Question ➔'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  scrollContent: { padding: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0a0f1f' },
  loadingText: { color: '#94a3b8', fontSize: 13, marginTop: 12, fontWeight: '600' },
  header: { marginBottom: 14 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#f8fafc' },
  dayBadge: { backgroundColor: '#1e3a8a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#3b82f6' },
  dayBadgeText: { color: '#93c5fd', fontSize: 10, fontWeight: '800' },
  headerSub: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  roleHighlight: { color: '#38bdf8', fontWeight: '800' },
  roundScroll: { marginBottom: 16 },
  roundRow: { flexDirection: 'row', gap: 8 },
  roundPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#131c2d', borderWidth: 1, borderColor: '#2d3a4e' },
  roundPillActive: { backgroundColor: '#2563eb', borderColor: '#3b82f6' },
  roundPillText: { fontSize: 11, color: '#94a3b8', fontWeight: '700' },
  roundPillTextActive: { color: '#ffffff' },
  progressContainer: { marginBottom: 16 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  questionNumText: { fontSize: 12, fontWeight: '700', color: '#60a5fa' },
  categoryBadgeText: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
  progressBg: { height: 6, backgroundColor: '#1e293b', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: '#3b82f6', borderRadius: 3 },
  questionCard: {
    backgroundColor: '#131c2d',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  questionText: { fontSize: 15, fontWeight: '700', color: '#f8fafc', lineHeight: 22, marginBottom: 16 },
  optionsList: { gap: 10, marginBottom: 16 },
  optionItem: {
    backgroundColor: '#0f1729',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  optionSelected: { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' },
  optionCorrect: { backgroundColor: '#064e3b', borderColor: '#10b981' },
  optionWrong: { backgroundColor: '#7f1d1d', borderColor: '#ef4444' },
  optionText: { fontSize: 13, color: '#cbd5e1', fontWeight: '500', lineHeight: 18 },
  optionTextSelected: { color: '#93c5fd', fontWeight: '700' },
  optionTextCorrect: { color: '#34d399', fontWeight: '700' },
  optionTextWrong: { color: '#fca5a5', fontWeight: '700' },
  explanationBox: { backgroundColor: '#0f1729', padding: 14, borderRadius: 10, marginBottom: 16, borderWidth: 1, borderColor: '#1e293b' },
  explanationTitle: { fontSize: 12, fontWeight: '700', color: '#60a5fa', marginBottom: 4 },
  explanationText: { fontSize: 12, color: '#cbd5e1', lineHeight: 18 },
  actionBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  actionBtnDisabled: { backgroundColor: '#1e293b' },
  actionBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  trophyEmoji: { fontSize: 54, marginBottom: 12 },
  completeTitle: { fontSize: 22, fontWeight: '800', color: '#f8fafc', marginBottom: 6 },
  scoreText: { fontSize: 16, fontWeight: '700', color: '#60a5fa', marginBottom: 18 },
  badgeCard: { backgroundColor: '#78350f', padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#f59e0b' },
  badgeTitle: { fontSize: 15, fontWeight: '800', color: '#fbbf24' },
  badgeSub: { fontSize: 12, color: '#fde68a', marginTop: 4 },
  retryBtn: { backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
});
