import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import client from '../api/client';

const DEFAULT_CARDS = [
  { id: 1, category: 'Frontend', question: 'What is the Virtual DOM in React and how does it improve performance?', answer: 'The Virtual DOM is a lightweight copy of the real DOM in memory. React uses a diffing algorithm to compare the Virtual DOM with the previous state and batch updates to the real DOM, minimizing expensive DOM manipulations.' },
  { id: 2, category: 'Backend', question: 'Explain the Event Loop in Node.js', answer: 'The Event Loop handles asynchronous I/O operations in Node.js using a single-threaded event loop mechanism with phases: Timers, Pending Callbacks, Poll, Check (setImmediate), and Close callbacks.' },
  { id: 3, category: 'System Design', question: 'What is the difference between Load Balancing and Reverse Proxy?', answer: 'A reverse proxy accepts requests and forwards them to backend servers (often handling SSL termination & caching). A load balancer specifically distributes incoming traffic across multiple servers to prevent overload.' },
  { id: 4, category: 'Database', question: 'What are ACID properties in Relational Databases?', answer: 'Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent transactions do not interfere), Durability (committed data persists even after crashes).' },
];

export default function FlashcardsScreen() {
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const res = await client.get('/interview/flashcards');
      if (res && res.cards && Array.isArray(res.cards) && res.cards.length > 0) {
        setCards(res.cards);
      }
    } catch (e) {
      console.log('Flashcards load fallback:', e);
    } finally {
      setLoading(false);
    }
  };

  const current = cards[currentIndex] || DEFAULT_CARDS[0];

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎴 Interview Flashcards</Text>
        <Text style={styles.headerSubtitle}>Flip cards to test core technical concepts & revision topics</Text>
      </View>

      <View style={styles.counterRow}>
        <Text style={styles.counterText}>Card {currentIndex + 1} of {cards.length}</Text>
        <View style={styles.catBadge}>
          <Text style={styles.catBadgeText}>{current.category}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => setFlipped(!flipped)}
        activeOpacity={0.9}
      >
        <Text style={styles.cardHint}>{flipped ? '💡 ANSWER' : '❓ QUESTION (Tap card to flip)'}</Text>
        <Text style={styles.cardContent}>
          {flipped ? current.answer : current.question}
        </Text>
      </TouchableOpacity>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.navBtn} onPress={handlePrev}>
          <Text style={styles.navBtnText}>← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.flipBtn} onPress={() => setFlipped(!flipped)}>
          <Text style={styles.flipBtnText}>🔄 Flip Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
          <Text style={styles.navBtnText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0a0f1f', flexGrow: 1, justifyContent: 'center' },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#f8fafc' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  counterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  counterText: { fontSize: 13, color: '#cbd5e1', fontWeight: '700' },
  catBadge: { backgroundColor: '#172554', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  catBadgeText: { fontSize: 12, color: '#60a5fa', fontWeight: '800' },
  cardContainer: {
    backgroundColor: '#0f1729',
    borderRadius: 20,
    padding: 24,
    minHeight: 220,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginBottom: 20,
  },
  cardHint: { fontSize: 11, fontWeight: '800', color: '#60a5fa', marginBottom: 12, letterSpacing: 1 },
  cardContent: { fontSize: 16, color: '#ffffff', lineHeight: 26, fontWeight: '600' },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  navBtn: { flex: 1, backgroundColor: '#1e293b', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  navBtnText: { color: '#cbd5e1', fontWeight: '700', fontSize: 13 },
  flipBtn: { flex: 1.2, backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  flipBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
});
