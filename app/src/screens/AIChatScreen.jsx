import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { chat } from '../api/client';

const PRESET_PROMPTS = [
  'How to boost my ATS score?',
  'Top 5 Full-Stack interview questions',
  'Salary negotiation strategies',
  'Behavioral STAR method tips',
];

export default function AIChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your AI Career & Interview Advisor. Ask me anything about resume optimization, technical interview strategies, or salary negotiation!',
      timestamp: '10:00 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const res = await chat.sendMessage(query);
      const replyText = res?.reply || res?.message || 'Here is my AI recommendation based on your profile skills and target career goals.';
      
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.log('Chat API fallback:', err);
      setTimeout(() => {
        const fallbackMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Here are expert recommendations for "${query}":\n\n1. Target Role Alignment: Mirror high-frequency keywords from the job description.\n2. Quantified Impact: Detail project metrics (e.g. "Increased system throughput by 40%").\n3. STAR Method: Structure behavioral interview answers using Situation, Task, Action, and Result framework.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
        setLoading(false);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'Chat history cleared. What career or technical topic would you like assistance with today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const renderMessageItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.bubbleContainer, isUser ? styles.userBubbleAlign : styles.aiBubbleAlign]}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.aiMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestampText, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>💬 AI Career Advisor</Text>
          <Text style={styles.headerSub}>Instant AI interview coaching & career guidance</Text>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearHistory}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Preset Chips */}
      <View style={styles.presetContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetScroll}>
          {PRESET_PROMPTS.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.presetChip}
              onPress={() => handleSendMessage(prompt)}
              activeOpacity={0.7}
            >
              <Text style={styles.presetText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask AI Career Advisor..."
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => handleSendMessage()}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.sendBtnText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1f' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#0f1729', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerTextCol: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#f8fafc' },
  headerSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  clearBtn: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#2d3a4e' },
  clearBtnText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  presetContainer: { backgroundColor: '#0f1729', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  presetScroll: { paddingHorizontal: 12, gap: 8 },
  presetChip: { backgroundColor: '#131c2d', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#2d3a4e' },
  presetText: { fontSize: 11, color: '#60a5fa', fontWeight: '600' },
  listContent: { padding: 14, paddingBottom: 20 },
  bubbleContainer: { marginBottom: 12, flexDirection: 'row' },
  userBubbleAlign: { justifyContent: 'flex-end' },
  aiBubbleAlign: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '84%', borderRadius: 16, padding: 14 },
  userBubble: { backgroundColor: '#2563eb', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#131c2d', borderWidth: 1, borderColor: '#2d3a4e', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 14, lineHeight: 20 },
  userMessageText: { color: '#ffffff' },
  aiMessageText: { color: '#f8fafc' },
  timestampText: { fontSize: 10, marginTop: 6, textAlign: 'right' },
  userTimestamp: { color: '#93c5fd' },
  aiTimestamp: { color: '#94a3b8' },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#0f1729',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#131c2d',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#f8fafc',
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  sendBtn: { backgroundColor: '#2563eb', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  sendBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },
});
