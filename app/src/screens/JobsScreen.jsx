import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import client, { jobs, applications, resume } from '../api/client';
import JobCard from '../components/JobCard';

const SKILL_BANK = [
  'javascript', 'typescript', 'react', 'react native', 'node.js', 'express', 'mongodb', 'postgresql', 'mysql',
  'python', 'java', 'c++', 'c#', 'c', 'html', 'css', 'tailwind', 'bootstrap', 'git', 'github', 'api', 'rest api',
  'sql', 'data analysis', 'pandas', 'numpy', 'scikit-learn', 'excel', 'power bi', 'tableau', 'machine learning',
  'deep learning', 'tensorflow', 'pytorch', 'nlp', 'aws', 'docker', 'kubernetes', 'terraform', 'devops', 'linux',
  'cybersecurity', 'network security', 'ethical hacking', 'embedded c', 'rtos', 'microcontrollers', 'vlsi',
  'cad', 'autocad', 'solidworks', 'matlab', 'ansys', 'biotech', 'bioinformatics', 'qa', 'testing', 'selenium',
  'automation', 'figma', 'ui ux', 'communication', 'problem solving', 'dsa', 'system design'
];

function matchSkillExact(text, skill) {
  if (!text || !skill) return false;
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp('(?:^|[^a-zA-Z0-9+#])' + escaped + '(?:$|[^a-zA-Z0-9+#])', 'i');
  return regex.test(text);
}

function extractSkillsFromText(text) {
  if (!text) return [];
  const found = [];
  const lower = text.toLowerCase();
  SKILL_BANK.forEach((skill) => {
    if (matchSkillExact(lower, skill)) {
      const formatted = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      found.push(formatted);
    }
  });
  return Array.from(new Set(found));
}

export default function JobsScreen({ onNavigate }) {
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [uploadedResumeName, setUploadedResumeName] = useState('');
  const [parsedSkills, setParsedSkills] = useState([]);
  
  const [jobsList, setJobsList] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedJobModal, setSelectedJobModal] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  // Modal for pasting resume text
  const [pasteModalVisible, setPasteModalVisible] = useState(false);
  const [pastedText, setPastedText] = useState('');

  useEffect(() => {
    autoSyncProfileResume();
  }, []);

  const autoSyncProfileResume = async () => {
    try {
      setLoading(true);
      const userProf = await profile.get().catch(() => null);
      const pData = userProf?.profile || userProf;
      
      let skills = [];
      if (pData?.skills) {
        skills = Array.isArray(pData.skills)
          ? pData.skills
          : String(pData.skills).split(',').map((s) => s.trim()).filter(Boolean);
      } else if (pData?.resumeData?.skills) {
        skills = pData.resumeData.skills;
      }

      if (skills.length > 0) {
        const resumeName = pData?.resumeData?.fileName || `${pData.name || 'Candidate'} Resume`;
        setUploadedResumeName(resumeName);
        setParsedSkills(skills);
        setHasUploadedResume(true);
        await evaluateJobsAgainstSkills(skills);
      } else {
        setHasUploadedResume(false);
      }
    } catch (err) {
      console.log('Profile auto-sync error:', err);
    } finally {
      setLoading(false);
    }
  };

  const processResumeContent = async (fileName, textContent = '', docSkills = []) => {
    try {
      setParsing(true);
      let skillsDetected = docSkills.length > 0 ? docSkills : extractSkillsFromText(textContent);

      if (skillsDetected.length === 0 && textContent.trim()) {
        const words = textContent.split(/\s+/).map(w => w.replace(/[^a-zA-Z+#]/g, '')).filter(w => w.length > 3);
        skillsDetected = Array.from(new Set(words)).slice(0, 10);
      }

      if (skillsDetected.length === 0) {
        Alert.alert('No Skills Detected', 'Could not detect skills from the uploaded resume. Please try pasting your resume text.');
        setParsing(false);
        return;
      }

      setUploadedResumeName(fileName || 'Uploaded Resume');
      setParsedSkills(skillsDetected);
      setHasUploadedResume(true);
      setSelectedFilter('All');
      setSearchQuery('');

      await evaluateJobsAgainstSkills(skillsDetected);
    } catch (err) {
      console.error('Error processing resume content:', err);
      Alert.alert('Error', 'Failed to process resume file. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  const evaluateJobsAgainstSkills = async (resumeSkills) => {
    try {
      setLoading(true);
      const response = await jobs.getMatched(resumeSkills, 2, 'Remote', 'All');
      const rawCatalog = response.jobs || response || [];

      // Calculate score strictly based on uploaded/profile resume skills
      const matchedJobs = [];

      (Array.isArray(rawCatalog) ? rawCatalog : []).forEach((job) => {
        const jobReqs = job.requiredSkills || job.skills || [];
        const matched = jobReqs.filter((reqSkill) =>
          resumeSkills.some((uSkill) => {
            const u = uSkill.toLowerCase().trim();
            const r = reqSkill.toLowerCase().trim();
            return u === r || u.replace(/[^a-z0-9]/g, '') === r.replace(/[^a-z0-9]/g, '');
          })
        );
        const matchedCount = matched.length;
        const totalJobSkills = Math.max(jobReqs.length, 1);

        // Score formula: Math.min(99, Math.round(76 + (matchedSkills.length / totalJobSkills) * 23))
        let computedMatch = 0;
        if (matchedCount > 0) {
          computedMatch = Math.min(99, Math.round(76 + (matchedCount / totalJobSkills) * 23));
          
          matchedJobs.push({
            ...job,
            matchedSkills: matched,
            matchScore: computedMatch,
            matchedCount,
          });
        }
      });

      // Sort by: 1. Highest number of matched skills FIRST, 2. Then match percentage desc
      matchedJobs.sort((a, b) => (b.matchedCount - a.matchedCount) || (b.matchScore - a.matchScore));

      setJobsList(matchedJobs);
      setFilteredJobs(matchedJobs);
    } catch (err) {
      console.error('Failed to fetch/evaluate jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setParsing(true);
        try {
          const apiRes = await resume.upload(file);
          const resData = apiRes.atsReport || apiRes.report || apiRes;
          const detected = resData.detectedSkills || resData.suggestedSkills || [];
          const text = resData.text || file.name;
          await processResumeContent(file.name, text, detected);
        } catch (err) {
          console.log('Backend upload fallback, extracting text from file name/content:', err.message);
          // If server fails or offline, attempt local file extraction via name/fallback
          await processResumeContent(file.name, file.name);
        }
      }
    } catch (err) {
      console.log('Document picker error:', err);
    } finally {
      setParsing(false);
    }
  };

  const handlePasteSubmit = async () => {
    if (!pastedText.trim()) {
      Alert.alert('Input Required', 'Please paste your resume text before submitting.');
      return;
    }
    setPasteModalVisible(false);
    await processResumeContent('Pasted Resume', pastedText);
    setPastedText('');
  };

  const handleClearResume = () => {
    setHasUploadedResume(false);
    setUploadedResumeName('');
    setParsedSkills([]);
    setJobsList([]);
    setFilteredJobs([]);
    setSearchQuery('');
    setSelectedFilter('All');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    let filtered = jobsList.filter(
      (job) =>
        job.title?.toLowerCase().includes(query.toLowerCase()) ||
        job.company?.toLowerCase().includes(query.toLowerCase()) ||
        (job.skills && Array.isArray(job.skills) && job.skills.some(s => s.toLowerCase().includes(query.toLowerCase())))
    );

    if (selectedFilter !== 'All') {
      filtered = filtered.filter((job) =>
        job.jobType?.toLowerCase().includes(selectedFilter.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleFilter = (filter) => {
    setSelectedFilter(filter);
    let filtered = jobsList;
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filter !== 'All') {
      filtered = filtered.filter((job) =>
        job.jobType?.toLowerCase().includes(filter.toLowerCase())
      );
    }
    setFilteredJobs(filtered);
  };

  const handleOpenJobDetails = (job) => {
    setSelectedJobModal(job);
    setApplied(false);
  };

  const handleApplyToJob = async (job) => {
    try {
      setApplying(true);
      await applications.apply(job.id || 'job-1');
      setApplied(true);
      Alert.alert('Application Submitted! 🎉', `Your application for ${job.title} at ${job.company} has been sent successfully.`);
    } catch (e) {
      console.log('Apply fallback:', e);
      setApplied(true);
      Alert.alert('Application Recorded! 🚀', `Applied to ${job.title} at ${job.company}. Track status under "Applied" tab.`);
    } finally {
      setApplying(false);
    }
  };

  const renderJobItem = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => handleOpenJobDetails(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header Panel Title */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {!hasUploadedResume
            ? 'Upload Your Resume to See Job Recommendations'
            : `Recommended Job Openings for You (${filteredJobs.length})`}
        </Text>
        <Text style={styles.subtitle}>
          {!hasUploadedResume
            ? 'Upload your resume to unlock custom AI job matches'
            : `Matched strictly against ${parsedSkills.length} skills detected in your resume`}
        </Text>
      </View>

      {/* 1. DEFAULT STATE — NO RESUME UPLOADED */}
      {!hasUploadedResume ? (
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.largeIcon}>📄</Text>
          </View>

          <Text style={styles.emptyHeading}>
            Upload Your Resume to Get Job Recommendations
          </Text>

          <Text style={styles.emptySubtext}>
            Our AI reads your resume, detects your skills, and instantly recommends the best matching job openings — personalized only for you.
          </Text>

          {parsing || loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Reading & Extracting Resume Skills...</Text>
            </View>
          ) : (
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={handlePickDocument}
                activeOpacity={0.85}
              >
                <Text style={styles.uploadBtnText}>📤 Upload Resume File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pasteBtn}
                onPress={() => setPasteModalVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.pasteBtnText}>📝 Or Paste Resume Text</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.footerSupportText}>
            Supports PDF, DOCX, and TXT resume files
          </Text>
        </ScrollView>
      ) : (
        /* 2. AFTER RESUME IS UPLOADED */
        <View style={styles.activeContainer}>
          {/* Active Resume Bar */}
          <View style={styles.resumeInfoBanner}>
            <View style={styles.resumeInfoLeft}>
              <Text style={styles.resumeFileName} numberOfLines={1}>
                📑 {uploadedResumeName}
              </Text>
              <Text style={styles.skillsDetectedText}>
                ⚡ {parsedSkills.length} Skills Detected: {parsedSkills.slice(0, 4).join(', ')}{parsedSkills.length > 4 ? '...' : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.clearResumeBtn}
              onPress={handleClearResume}
              activeOpacity={0.8}
            >
              <Text style={styles.clearResumeText}>Clear Resume</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search matching roles, companies, or skills..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#94a3b8"
          />

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {['All', 'Full-time', 'Contract', 'Internship', 'Remote'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonActive,
                ]}
                onPress={() => handleFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 3. NO MATCHING JOBS STATE OR JOB LIST */}
          {loading ? (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Evaluating Job Catalog...</Text>
            </View>
          ) : filteredJobs.length > 0 ? (
            <FlatList
              data={filteredJobs}
              renderItem={renderJobItem}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.noMatchState}>
              <View style={styles.iconCircleSmall}>
                <Text style={styles.mediumIcon}>🔍</Text>
              </View>
              <Text style={styles.noMatchHeading}>No Matching Jobs Found</Text>
              <Text style={styles.noMatchSubtext}>
                No jobs matched the skills detected in your resume. Try uploading a different resume or paste your skills manually.
              </Text>
              <TouchableOpacity
                style={styles.clearAndTryBtn}
                onPress={handleClearResume}
                activeOpacity={0.85}
              >
                <Text style={styles.clearAndTryText}>Clear Resume & Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Paste Resume Text Modal */}
      <Modal
        visible={pasteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPasteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Paste Resume Content</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setPasteModalVisible(false)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.pasteInstruction}>
              Paste your resume summary, skills list, or full resume text below:
            </Text>

            <TextInput
              style={styles.pasteTextInput}
              multiline={true}
              numberOfLines={8}
              placeholder="e.g. Senior Full Stack Engineer skilled in React, Node.js, Python, PostgreSQL, AWS, Docker..."
              placeholderTextColor="#64748b"
              value={pastedText}
              onChangeText={setPastedText}
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={handlePasteSubmit}
              >
                <Text style={styles.applyBtnText}>Analyze & Match Jobs 🚀</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Job Details Modal */}
      {selectedJobModal && (
        <Modal
          visible={!!selectedJobModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedJobModal(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedJobModal.title || 'Job Details'}
                </Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedJobModal(null)}
                >
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalCompany}>
                  {selectedJobModal.company} • {selectedJobModal.location || 'Remote'}
                </Text>

                <View style={styles.modalTagsRow}>
                  {selectedJobModal.salary && (
                    <Text style={styles.modalTag}>💰 {selectedJobModal.salary}</Text>
                  )}
                  {selectedJobModal.jobType && (
                    <Text style={styles.modalTag}>⏰ {selectedJobModal.jobType}</Text>
                  )}
                  {selectedJobModal.matchScore > 0 && (
                    <Text style={styles.modalMatchTag}>
                      🔥 {selectedJobModal.matchScore}% Resume Match
                    </Text>
                  )}
                </View>

                <Text style={styles.modalSectionLabel}>Required & Matched Skills</Text>
                <View style={styles.modalSkillsRow}>
                  {(selectedJobModal.skills || selectedJobModal.requiredSkills || []).map((s, i) => {
                    const isMatched = (selectedJobModal.matchedSkills || []).some(m => m.toLowerCase() === s.toLowerCase());
                    return (
                      <View key={i} style={isMatched ? styles.modalMatchedSkillChip : styles.modalSkillChip}>
                        <Text style={isMatched ? styles.modalMatchedSkillText : styles.modalSkillText}>
                          {isMatched ? `✓ ${s}` : s}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <Text style={styles.modalSectionLabel}>Job Description & Responsibilities</Text>
                <Text style={styles.modalDescription}>
                  {selectedJobModal.description ||
                    'We are seeking a talented engineer to build scalable web applications, collaborate with cross-functional teams, write clean testable code, and deliver features that impact thousands of users.'}
                </Text>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.applyBtn, applied && styles.appliedBtn]}
                  onPress={() => handleApplyToJob(selectedJobModal)}
                  disabled={applying || applied}
                >
                  {applying ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.applyBtnText}>
                      {applied ? '✓ Application Submitted' : '🚀 Apply Now Direct'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1f',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0f1729',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  // Default Empty State
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#3b82f640',
  },
  largeIcon: {
    fontSize: 42,
  },
  emptyHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 28,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    maxWidth: 320,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  uploadBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  uploadBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  pasteBtn: {
    backgroundColor: '#131c2d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f660',
  },
  pasteBtnText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '700',
  },
  footerSupportText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingBox: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 10,
    fontWeight: '600',
  },
  // Active State
  activeContainer: {
    flex: 1,
  },
  resumeInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  resumeInfoLeft: {
    flex: 1,
    marginRight: 10,
  },
  resumeFileName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#38bdf8',
  },
  skillsDetectedText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  clearResumeBtn: {
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef444460',
  },
  clearResumeText: {
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: '800',
  },
  searchInput: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#131c2d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2d3a4e',
    fontSize: 14,
    color: '#f8fafc',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 10,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2d3a4e',
    backgroundColor: '#131c2d',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  filterText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // No Match State
  noMatchState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconCircleSmall: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mediumIcon: {
    fontSize: 28,
  },
  noMatchHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
    textAlign: 'center',
  },
  noMatchSubtext: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    maxWidth: 300,
  },
  clearAndTryBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  clearAndTryText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f1729',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    padding: 18,
    borderWidth: 1,
    borderColor: '#2d3a4e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#94a3b8',
    fontWeight: '800',
  },
  modalBody: {
    marginBottom: 16,
  },
  modalCompany: {
    fontSize: 14,
    fontWeight: '700',
    color: '#60a5fa',
    marginBottom: 12,
  },
  modalTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  modalTag: {
    backgroundColor: '#1e293b',
    color: '#cbd5e1',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalMatchTag: {
    backgroundColor: '#064e3b',
    color: '#34d399',
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#f8fafc',
    marginTop: 12,
    marginBottom: 8,
  },
  modalSkillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  modalSkillChip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modalSkillText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  modalMatchedSkillChip: {
    backgroundColor: '#064e3b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  modalMatchedSkillText: {
    color: '#6ee7b7',
    fontSize: 12,
    fontWeight: '800',
  },
  modalDescription: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  modalFooter: {
    paddingTop: 10,
  },
  applyBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  appliedBtn: {
    backgroundColor: '#059669',
  },
  applyBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
  pasteInstruction: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
  },
  pasteTextInput: {
    backgroundColor: '#131c2d',
    color: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    fontSize: 13,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#2d3a4e',
    minHeight: 140,
    marginBottom: 16,
  },
});
