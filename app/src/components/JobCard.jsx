import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';

export default function JobCard({ job, onPress }) {
  const [showPortals, setShowPortals] = useState(false);

  if (!job) return null;

  const encTitle = encodeURIComponent(job.title || 'Software Engineer');
  const encLoc   = encodeURIComponent(job.location || 'Remote');

  const portals = [
    { name: 'LinkedIn',   url: `https://www.linkedin.com/jobs/search/?keywords=${encTitle}&location=${encLoc}`, color: '#0077b5' },
    { name: 'Naukri',     url: `https://www.naukri.com/${encTitle.toLowerCase()}-jobs-in-${encLoc.toLowerCase()}`, color: '#ff7555' },
    { name: 'Indeed',     url: `https://www.indeed.com/jobs?q=${encTitle}&l=${encLoc}`, color: '#2164f3' },
    { name: 'Glassdoor',  url: `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encTitle}`, color: '#0caa41' },
    { name: 'Unstop',     url: `https://unstop.com/jobs?search=${encTitle}`, color: '#6366f1' },
    { name: 'Internshala',url: `https://internshala.com/jobs/${encTitle.toLowerCase()}-jobs/`, color: '#00a5ec' },
    { name: 'Google Jobs',url: `https://www.google.com/search?q=${encTitle}+jobs+in+${encLoc}`, color: '#ea4335' },
    { name: 'Apna',       url: `https://apna.co/jobs?q=${encTitle}`, color: '#10b981' },
    { name: 'Foundit',    url: `https://www.foundit.in/srp/results?query=${encTitle}`, color: '#9333ea' },
    { name: 'Wellfound',  url: `https://wellfound.com/jobs?q=${encTitle}`, color: '#ef4444' },
    { name: 'Jooble',     url: `https://jooble.org/search-job-${encTitle}`, color: '#f59e0b' },
    { name: 'Adzuna',     url: `https://www.adzuna.com/search?q=${encTitle}`, color: '#06b6d4' },
  ];

  const handlePortalPress = async (portalUrl, portalName) => {
    try {
      const supported = await Linking.canOpenURL(portalUrl);
      if (supported) {
        await Linking.openURL(portalUrl);
      } else {
        Alert.alert('Opening Portal', `Redirecting to ${portalName}...`);
        await Linking.openURL(portalUrl);
      }
    } catch (e) {
      Alert.alert('Redirect Error', `Could not open ${portalName}.`);
    }
  };

  const matchScore = job.matchScore || job.match || 0;
  
  // Color coding thresholds: Green (85%+), Amber (70-84%), Red (<70%)
  let badgeContainerStyle = styles.badgeGreen;
  let badgeTextStyle = styles.badgeTextGreen;

  if (matchScore >= 85) {
    badgeContainerStyle = styles.badgeGreen;
    badgeTextStyle = styles.badgeTextGreen;
  } else if (matchScore >= 70) {
    badgeContainerStyle = styles.badgeAmber;
    badgeTextStyle = styles.badgeTextAmber;
  } else {
    badgeContainerStyle = styles.badgeRed;
    badgeTextStyle = styles.badgeTextRed;
  }

  const allJobSkills = job.skills || job.requiredSkills || [];
  const matchedSkills = job.matchedSkills || [];

  const isMatched = (skillName) => {
    return matchedSkills.some((m) =>
      m.toLowerCase() === skillName.toLowerCase() ||
      skillName.toLowerCase().includes(m.toLowerCase()) ||
      m.toLowerCase().includes(skillName.toLowerCase())
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>
            {job.company ? job.company.charAt(0).toUpperCase() : '💼'}
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {job.title || job.role || 'Job Opportunity'}
          </Text>
          <Text style={styles.company} numberOfLines={1}>
            {job.company || 'Company'} {job.location ? `• ${job.location}` : ''}
          </Text>
        </View>
        {matchScore > 0 && (
          <View style={[styles.badge, badgeContainerStyle]}>
            <Text style={[styles.badgeText, badgeTextStyle]}>
              {matchScore}% Resume Match
            </Text>
          </View>
        )}
      </View>

      {/* Multi Platform Indicator */}
      <View style={styles.platformRow}>
        <Text style={styles.platformBadge}>🌐 Live across 12+ Job Platforms</Text>
        {job.jobType && <Text style={styles.tagText}>⏰ {job.jobType}</Text>}
        {job.salary && <Text style={styles.tagText}>💰 {job.salary}</Text>}
      </View>

      {/* Skills Badges - Matched vs Unmatched */}
      {allJobSkills.length > 0 && (
        <View style={styles.skillsRow}>
          {allJobSkills.slice(0, 6).map((skill, index) => {
            const matched = isMatched(skill);
            return (
              <View
                key={index}
                style={matched ? styles.matchedSkillChip : styles.unmatchedSkillChip}
              >
                <Text style={matched ? styles.matchedSkillText : styles.unmatchedSkillText}>
                  {matched ? `✓ ${skill}` : skill}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* 12-Platform Apply Quick Toggle */}
      <TouchableOpacity
        style={styles.portalToggleBtn}
        onPress={() => setShowPortals((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={styles.portalToggleText}>
          {showPortals ? '▲ Hide 12 Direct Apply Portals' : '🚀 1-Click Apply on 12+ Job Platforms ▼'}
        </Text>
      </TouchableOpacity>

      {showPortals && (
        <View style={styles.portalsContainer}>
          <Text style={styles.portalsTitle}>Select Portal to Apply Direct:</Text>
          <View style={styles.portalGrid}>
            {portals.map((p) => (
              <TouchableOpacity
                key={p.name}
                style={[styles.portalChip, { backgroundColor: p.color }]}
                onPress={() => handlePortalPress(p.url, p.name)}
                activeOpacity={0.8}
              >
                <Text style={styles.portalChipText}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {job.description && (
        <Text style={styles.description} numberOfLines={2}>
          {job.description}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131c2d',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#3b82f640',
  },
  iconText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#60a5fa',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  company: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeGreen: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
  },
  badgeAmber: {
    backgroundColor: '#78350f',
    borderColor: '#f59e0b',
  },
  badgeRed: {
    backgroundColor: '#7f1d1d',
    borderColor: '#ef4444',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  badgeTextGreen: {
    color: '#34d399',
  },
  badgeTextAmber: {
    color: '#fbbf24',
  },
  badgeTextRed: {
    color: '#fca5a5',
  },
  platformRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  platformBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34d399',
    backgroundColor: '#064e3b50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10b98150',
  },
  tagText: {
    fontSize: 11,
    color: '#cbd5e1',
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  matchedSkillChip: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  matchedSkillText: {
    fontSize: 11,
    color: '#6ee7b7',
    fontWeight: '700',
  },
  unmatchedSkillChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  unmatchedSkillText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  portalToggleBtn: {
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#3b82f640',
  },
  portalToggleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#60a5fa',
  },
  portalsContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  portalsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  portalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  portalChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  portalChipText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  description: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    lineHeight: 16,
  },
});
