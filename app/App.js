import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import Navigation from './src/components/Navigation';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070b14" />
      <View style={styles.brandBar}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>ARJ<Text style={{ color: '#3b82f6' }}>.</Text></Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
      </View>
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b14',
  },
  brandBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#0c1322',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293d',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 3,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064e3b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#059669',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34d399',
    marginRight: 4,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#a7f3d0',
    letterSpacing: 1,
  },
});
