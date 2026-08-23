import { useState, useEffect, useRef } from 'react';
import '../../App.css';
import { apiFetch } from '../../api';

const colorSchemes = {
  'Corporate Blue': { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#0ea5e9' },
  'Ocean Blue': { primary: '#0c4a6e', secondary: '#0284c7', accent: '#06b6d4' },
  'Forest Green': { primary: '#065f46', secondary: '#10b981', accent: '#6ee7b7' },
  'Charcoal': { primary: '#1f2937', secondary: '#374151', accent: '#9ca3af' },
  'Royal Purple': { primary: '#581c87', secondary: '#a855f7', accent: '#d8b4fe' },
  'Deep Red': { primary: '#7f1d1d', secondary: '#dc2626', accent: '#fca5a5' },
  'Amber': { primary: '#92400e', secondary: '#f59e0b', accent: '#fef3c7' },
  'Teal': { primary: '#134e4a', secondary: '#14b8a6', accent: '#99f6e4' },
  'Indigo': { primary: '#312e81', secondary: '#6366f1', accent: '#a5b4fc' },
  'Turquoise': { primary: '#0f766e', secondary: '#06d6a0', accent: '#6ee7b7' }
};

const fontCombos = {
  'Clean Sans': { headingFont: 'Arial, sans-serif', bodyFont: 'Arial, sans-serif' },
  'Classic Serif': { headingFont: '"Garamond", serif', bodyFont: '"Garamond", serif' },
  'Modern': { headingFont: '"Trebuchet MS", sans-serif', bodyFont: '"Trebuchet MS", sans-serif' },
  'Professional': { headingFont: 'Calibri, sans-serif', bodyFont: 'Calibri, sans-serif' },
  'Elegant': { headingFont: '"Georgia", serif', bodyFont: '"Georgia", serif' },
  'Traditional': { headingFont: '"Times New Roman", serif', bodyFont: '"Times New Roman", serif' },
  'Technical': { headingFont: '"Courier New", monospace', bodyFont: '"Courier New", monospace' }
};

const evaluateATSScore = (resumeData, selectedTemplate) => {
  let score = 0;
  const strengths = [];
  const improvements = [];
  const foundKeywords = [];
  const missingKeywords = [];
  const details = [];

  const industries = {
    Technology: ['Software', 'Agile', 'JavaScript', 'Python', 'AWS', 'API', 'Docker', 'React', 'Node.js', 'Git'],
    Finance: ['Analysis', 'Accounting', 'Financial Modeling', 'Excel', 'Budgeting', 'Forecasting', 'Valuation', 'Risk Management'],
    Healthcare: ['Patient Care', 'HIPAA', 'EMR', 'Clinical', 'Medical', 'Nursing', 'Treatment', 'Diagnosis'],
    Marketing: ['SEO', 'Content Strategy', 'Social Media', 'Campaign', 'Google Analytics', 'Brand', 'CRM', 'Copywriting'],
    Sales: ['B2B', 'Lead Generation', 'Salesforce', 'Negotiation', 'Account Management', 'CRM', 'Cold Calling', 'Closing'],
    HR: ['Recruitment', 'Onboarding', 'Employee Relations', 'ATS', 'Payroll', 'Benefits', 'Compliance', 'Talent Acquisition']
  };

  const actionVerbs = ['Led', 'Developed', 'Managed', 'Increased', 'Designed', 'Implemented', 'Created', 'Optimized', 'Reduced', 'Achieved'];

  const experienceText = (resumeData.experience || []).map(exp => `${exp.title} ${exp.company} ${exp.bullets}`).join(' ');
  const educationText = (resumeData.education || []).map(edu => `${edu.degree} ${edu.school}`).join(' ');
  const fullText = `${resumeData.personalInfo.name} ${resumeData.personalInfo.title} ${resumeData.personalInfo.email} ${resumeData.personalInfo.phone} ${resumeData.personalInfo.linkedin} ${resumeData.personalInfo.location} ${resumeData.summary} ${experienceText} ${educationText} ${resumeData.skills}`;

  if (resumeData.experience && resumeData.experience.length > 0) {
    score += 7;
    strengths.push('Work Experience section has entries.');
    details.push('+7 Work Experience section found.');
  } else {
    improvements.push('Add work experience details.');
    details.push('- Missed Work Experience section.');
  }

  if (resumeData.education && resumeData.education.length > 0) {
    score += 7;
    strengths.push('Education section has entries.');
    details.push('+7 Education section found.');
  } else {
    improvements.push('Add education details.');
    details.push('- Missed Education section.');
  }

  if (resumeData.skills && resumeData.skills.trim().length > 0) {
    score += 6;
    strengths.push('Skills section is populated.');
    details.push('+6 Skills section found.');
  } else {
    improvements.push('Add core skills.');
    details.push('- Missed Skills section.');
  }

  if (resumeData.summary && resumeData.summary.trim().length > 10) {
    score += 5;
    strengths.push('Professional Summary is written.');
    details.push('+5 Summary section found.');
  } else {
    improvements.push('Write a short profile summary.');
    details.push('- Missed Summary section.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(resumeData.personalInfo.email)) {
    score += 5;
    details.push('+5 Email address found.');
  } else {
    improvements.push('Provide a valid email address.');
    details.push('- Missed Email address.');
  }

  if (resumeData.personalInfo.phone && resumeData.personalInfo.phone.trim().length > 5) {
    score += 5;
    details.push('+5 Phone number found.');
  } else {
    improvements.push('Add your phone number.');
    details.push('- Missed Phone number.');
  }

  if (resumeData.personalInfo.linkedin && resumeData.personalInfo.linkedin.toLowerCase().includes('linkedin.com')) {
    score += 5;
    details.push('+5 LinkedIn profile link found.');
  } else {
    improvements.push('Add a LinkedIn profile URL.');
    details.push('- Missed LinkedIn link.');
  }

  const targetIndustry = resumeData.targetIndustry || (selectedTemplate ? selectedTemplate.category : 'Technology');
  const kws = industries[targetIndustry] || [];
  kws.forEach(kw => {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(fullText)) {
      foundKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const kwScore = kws.length > 0 ? Math.min(25, (foundKeywords.length / kws.length) * 25) : 0;
  score += kwScore;
  details.push(`+${Math.round(kwScore)} Industry keywords matched (${foundKeywords.length} found).`);

  if (foundKeywords.length > 3) {
    strengths.push(`Strong keyword matches for ${targetIndustry}.`);
  } else {
    improvements.push(`Include target keywords like: ${missingKeywords.slice(0, 3).join(', ')}.`);
  }

  let verbCount = 0;
  actionVerbs.forEach(verb => {
    if (new RegExp(`\\b${verb}\\b`, 'i').test(fullText)) {
      verbCount++;
    }
  });
  const verbScore = Math.min(10, verbCount * 2.5);
  score += verbScore;
  details.push(`+${Math.round(verbScore)} Action verbs detected.`);
  if (verbCount > 2) {
    strengths.push('Used impactful action verbs.');
  } else {
    improvements.push('Begin description sentences with active verbs (e.g. Led, Optimized).');
  }

  const metricMatches = (fullText.match(/\d+%|\$\d+|\b\d+\s+percent\b/g) || []).length;
  const metricScore = Math.min(10, metricMatches * 2.5);
  score += metricScore;
  details.push(`+${Math.round(metricScore)} Quantifiable results used.`);
  if (metricMatches > 1) {
    strengths.push('Quantified achievements with metrics.');
  } else {
    improvements.push('Add quantifiable numbers/metrics to demonstrate results.');
  }

  let layoutPenalty = 0;
  if (selectedTemplate && selectedTemplate.layout === 'two-column') {
    layoutPenalty = 2;
  }
  score += (15 - layoutPenalty);
  details.push(`+${15 - layoutPenalty} Layout parsing structure.`);
  strengths.push('Standard fonts and sections structure ensures ATS compliance.');

  return {
    score: Math.min(100, Math.max(0, Math.round(score))),
    strengths,
    improvements,
    foundKeywords,
    missingKeywords,
    details
  };
};

const ResumeLab = ({ setToast, refresh }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gallery');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minAtsScore, setMinAtsScore] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return [];
    const saved = window.localStorage.getItem('favoriteTemplates');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTemplates, setCompareTemplates] = useState([]);
  const fileInputRef = useRef(null);
  const [templateData, setTemplateData] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [genuineAtsReport, setGenuineAtsReport] = useState(null);
  const [checkingAts, setCheckingAts] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: 'Alex Johnson',
      title: 'Senior Software Engineer',
      email: 'alex.johnson@email.com',
      phone: '(555) 123-4567',
      linkedin: 'linkedin.com/in/alexjohnson',
      location: 'San Francisco, CA'
    },
    summary: 'Experienced professional with a proven track record of delivering high-quality web solutions. Skilled in Agile methods, Javascript, React, and Node.js. Dedicated to writing clean code and optimizing performance.',
    experience: [
      {
        id: '1',
        title: 'Senior Engineer',
        company: 'Tech Innovations Corp',
        date: '2021 - Present',
        bullets: 'Led a team of 5 developers to create scalable React apps. Developed core APIs using Node.js and AWS. Optimized rendering, increasing web page load speed by 35%.'
      },
      {
        id: '2',
        title: 'Software Developer',
        company: 'Global Software Inc',
        date: '2018 - 2021',
        bullets: 'Created and implemented responsive web pages. Managed databases using PostgreSQL. Reduced system crashes by 15% through robust testing.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science in Computer Science',
        school: 'Stanford University',
        date: '2014 - 2018'
      }
    ],
    skills: 'JavaScript, React, Node.js, AWS, Agile, Git, Docker, Python, HTML/CSS',
    targetIndustry: 'Technology'
  });

  const TEMPLATES_PER_PAGE = 12;

  const fetchTemplates = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: TEMPLATES_PER_PAGE.toString(),
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (minAtsScore) params.append('minAts', minAtsScore);
      if (searchQuery) params.append('search', searchQuery);
      if (sortBy) params.append('sortBy', sortBy);
      if (showFavoritesOnly) params.append('favorites', favorites.join(','));

      const data = await apiFetch(`/resume/templates?${params}`);
      setTemplates(data.templates || []);
      setCurrentPage(page);
      setTotalPages(data.pages || 1);

      if (data.categories && data.categories.length) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates(1);
  }, [selectedCategory, minAtsScore, searchQuery, sortBy, showFavoritesOnly, favorites]);

  useEffect(() => {
    window.localStorage.setItem('favoriteTemplates', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (templateId) => {
    setFavorites(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const toggleCompare = (templateId) => {
    setCompareTemplates(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      } else if (prev.length < 3) {
        return [...prev, templateId];
      }
      return prev;
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', '');
      
      const response = await apiFetch('/resume/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response && response.report) {
        setAtsScore({
          score: response.report.score,
          keywords: response.report.matchedKeywords || [],
          missing: response.report.missingKeywords || [],
          feedback: response.report.scoreNote || 'Resume analysis is complete.',
          strengths: response.report.strengths || ['Good structure', 'Action verbs used'],
          improvements: response.report.formattingIssues || response.report.recommendations || []
        });

        if (setToast) {
          setToast('✅ Resume uploaded and analyzed. Your ATS score is ready.');
        }
        if (refresh) {
          await refresh();
        }
      }
    } catch (err) {
      console.error('File upload failed:', err);
      if (setToast) {
        setToast('❌ File upload failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const runGenuineAtsCheck = async () => {
    setCheckingAts(true);
    try {
      const resumeText = `
        ${resumeData.personalInfo.name}
        ${resumeData.personalInfo.title}
        ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}
        ${resumeData.personalInfo.linkedin}
        
        SUMMARY
        ${resumeData.summary}
        
        EXPERIENCE
        ${resumeData.experience.map(exp => `
          ${exp.title} at ${exp.company} (${exp.date})
          ${exp.bullets}
        `).join('\n')}
        
        EDUCATION
        ${resumeData.education.map(edu => `
          ${edu.degree} at ${edu.school} (${edu.date})
        `).join('\n')}
        
        SKILLS
        ${resumeData.skills}
      `;
      
      const response = await apiFetch('/resume/analyze', {
        method: 'POST',
        body: JSON.stringify({
          text: resumeText,
          fileName: `${resumeData.personalInfo.name}_Resume.html`,
          jobDescription: ''
        })
      });
      
      if (response && response.report) {
        setGenuineAtsReport(response.report);
        setShowAtsModal(true);
      }
    } catch (err) {
      console.error('Genuine ATS check failed:', err);
    } finally {
      setCheckingAts(false);
    }
  };

  const previewTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(templateId);
    setTemplateData(template);
    setActiveTab('preview');
  };

  const downloadTemplate = async (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template && template.preview) {
      try {
        const response = await fetch(template.preview);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = template.filename || `template_${templateId}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Failed to download template directly:', error);
        window.open(template.preview, '_blank');
      }
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const SkeletonCard = () => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      animation: 'shimmer 2s infinite',
    }}>
      <div style={{
        height: '120px',
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite',
      }} />
      <div style={{ padding: '20px' }}>
        <div style={{
          height: '16px',
          background: '#f0f0f0',
          borderRadius: '4px',
          marginBottom: '12px',
          animation: 'shimmer 2s infinite',
        }} />
        <div style={{
          height: '60px',
          background: '#f0f0f0',
          borderRadius: '4px',
          marginBottom: '12px',
          animation: 'shimmer 2s infinite',
        }} />
        <div style={{
          height: '32px',
          background: '#f0f0f0',
          borderRadius: '4px',
          animation: 'shimmer 2s infinite',
        }} />
      </div>
    </div>
  );

  const styles = {
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 20px',
      minHeight: '100vh',
    },
    header: {
      marginBottom: '40px',
      textAlign: 'center',
      animation: 'fadeIn 0.8s ease-out',
    },
    title: {
      fontSize: '48px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '12px',
      letterSpacing: '-0.8px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '30px',
      fontWeight: '500',
      lineHeight: '1.6',
    },
    tabs: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px',
      borderBottom: '2px solid #f3f4f6',
      paddingBottom: '0',
      overflowX: 'auto',
    },
    tabButton: (active) => ({
      padding: '14px 24px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '700',
      color: active ? '#667eea' : '#9ca3af',
      borderBottom: active ? '3px solid #667eea' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      marginBottom: '-2px',
      whiteSpace: 'nowrap',
    }),
    controlBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '28px',
      padding: '16px 20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      flexWrap: 'wrap',
      gap: '12px',
    },
    filterSection: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)',
      borderRadius: '12px',
      padding: '28px',
      marginBottom: '35px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      animation: 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    filterTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },
    searchInput: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: 'inherit',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
    },
    select: {
      width: '100%',
      padding: '12px 14px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '13px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
    },
    gallerygrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
      animation: 'fadeIn 0.8s ease-out 0.2s both',
    },
    card: (hovered) => ({
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: hovered 
        ? '0 25px 50px rgba(0, 0, 0, 0.15)' 
        : '0 4px 12px rgba(0, 0, 0, 0.08)',
      border: '1px solid ' + (hovered ? '#e5e7eb' : '#f0f0f0'),
      transform: hovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
      cursor: 'pointer',
    }),
    cardHeader: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px',
      color: 'white',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '8px',
      letterSpacing: '-0.3px',
      lineHeight: '1.4',
    },
    cardCategory: {
      fontSize: '12px',
      opacity: '0.9',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    cardBody: {
      padding: '20px',
    },
    atsScore: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      padding: '18px',
      borderRadius: '10px',
      marginBottom: '18px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
    },
    atsScoreValue: {
      fontSize: '32px',
      fontWeight: '900',
      letterSpacing: '-0.5px',
    },
    atsScoreLabel: {
      fontSize: '11px',
      opacity: '0.85',
      marginBottom: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: '700',
    },
    ratingDownloads: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
      color: '#4b5563',
      marginBottom: '14px',
      paddingBottom: '14px',
      borderBottom: '1px solid #f0f0f0',
      fontWeight: '700',
    },
    tagsContainer: {
      marginBottom: '16px',
    },
    tagLabel: {
      fontSize: '11px',
      fontWeight: '800',
      color: '#374151',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
    tags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
    },
    tag: {
      fontSize: '11px',
      background: '#dbeafe',
      color: '#1e40af',
      padding: '6px 12px',
      borderRadius: '6px',
      fontWeight: '700',
      boxShadow: '0 2px 4px rgba(30, 64, 175, 0.1)',
    },
    buttonGroup: {
      display: 'flex',
      gap: '8px',
    },
    button: (primary) => ({
      flex: 1,
      padding: '12px 16px',
      background: primary 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '700',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '0.3px',
      textTransform: 'uppercase',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }),
    iconButton: (active) => ({
      width: '36px',
      height: '36px',
      background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
      border: active ? 'none' : '2px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: active ? 'white' : '#9ca3af',
      boxShadow: active ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
    }),
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      padding: '24px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '30px',
      flexWrap: 'wrap',
    },
    paginationButton: (active, disabled) => ({
      padding: active ? '10px 14px' : '8px 12px',
      background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
      color: active ? 'white' : '#374151',
      border: active ? 'none' : '2px solid #e5e7eb',
      borderRadius: '6px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '12px',
      fontWeight: active ? '700' : '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: disabled ? '0.5' : '1',
      boxShadow: active ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
    }),
    noResults: {
      textAlign: 'center',
      padding: '80px 20px',
      color: '#9ca3af',
      animation: 'fadeIn 0.6s ease-out',
    },
    noResultsText: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '12px',
      color: '#374151',
    },
    noResultsIcon: {
      fontSize: '64px',
      marginBottom: '20px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>✨ Premium Resume Templates</h1>
        <p style={styles.subtitle}>
          Curated professional templates optimized for ATS systems & recruiters. Stand out with 150+ industry-specific designs.
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('gallery')}
          style={styles.tabButton(activeTab === 'gallery')}
        >
          📚 Template Gallery
        </button>
        <button
          onClick={() => setActiveTab('analyze')}
          style={styles.tabButton(activeTab === 'analyze')}
        >
          📊 ATS Analyzer
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          style={styles.tabButton(activeTab === 'favorites')}
        >
          ❤️ Favorites ({favorites.length})
        </button>
        {compareTemplates.length > 0 && (
          <button
            onClick={() => setActiveTab('compare')}
            style={styles.tabButton(activeTab === 'compare')}
          >
            🔄 Compare ({compareTemplates.length})
          </button>
        )}
        {selectedTemplate && (
          <button
            onClick={() => setActiveTab('preview')}
            style={styles.tabButton(activeTab === 'preview')}
          >
            👁️ Live Preview
          </button>
        )}
      </div>

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div>
          {/* Control Bar */}
          <div style={styles.controlBar}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280' }}>SORT BY:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  ...styles.select,
                  maxWidth: '180px',
                  padding: '10px 12px',
                  fontSize: '12px',
                }}
              >
                <option value="popular">Popular</option>
                <option value="ats_high">ATS Score (High)</option>
                <option value="ats_low">ATS Score (Low)</option>
                <option value="rating">Top Rated</option>
                <option value="downloads">Most Downloaded</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              style={{
                ...styles.iconButton(showFavoritesOnly),
                position: 'relative',
              }}
              title="Show favorites only"
            >
              ❤️
            </button>
            <button
              onClick={() => setCompareMode(!compareMode)}
              style={{
                ...styles.iconButton(compareMode),
                position: 'relative',
              }}
              title="Enable compare mode"
            >
              🔄
            </button>
          </div>

          {/* Filters */}
          <div style={styles.filterSection}>
            <div style={styles.filterTitle}>🔍 Advanced Filters</div>
            <div style={styles.filterGrid}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px' }}>
                  SEARCH
                </label>
                <input
                  type="text"
                  placeholder="Find by title or industry..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={styles.searchInput}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px' }}>
                  INDUSTRY
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={styles.select}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">All Industries ({templates.length})</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', display: 'block', marginBottom: '8px' }}>
                  ATS SCORE
                </label>
                <select
                  value={minAtsScore}
                  onChange={(e) => {
                    setMinAtsScore(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={styles.select}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Any Score</option>
                  <option value="85">85%+ Premium</option>
                  <option value="90">90%+ Excellent</option>
                  <option value="92">92%+ Elite</option>
                  <option value="95">95%+ Top Tier</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setMinAtsScore('');
                setCurrentPage(1);
              }}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                background: '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                letterSpacing: '0.3px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#6b7280';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#9ca3af';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ✕ Clear All
            </button>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div style={styles.gallerygrid}>
              {Array(12).fill(0).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div style={styles.noResults}>
              <div style={styles.noResultsIcon}>🔍</div>
              <div style={styles.noResultsText}>No templates found</div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
                Try adjusting your filters to explore more options
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setMinAtsScore('');
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '13px',
                  transition: 'all 0.3s',
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                ↻ Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div style={styles.gallerygrid}>
                {templates.map((template) => (
                  <div
                    key={template.id}
                    style={styles.card(hoveredCard === template.id)}
                    onMouseEnter={() => setHoveredCard(template.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div style={styles.cardHeader}>
                      <div>
                        <div style={styles.cardTitle}>
                          {template.name.length > 35
                            ? template.name.substring(0, 32) + '...'
                            : template.name}
                        </div>
                        <div style={styles.cardCategory}>{template.category}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(template.id);
                          }}
                          style={{
                            width: '32px',
                            height: '32px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                          onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                        >
                          {favorites.includes(template.id) ? '❤️' : '🤍'}
                        </button>
                        {compareMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCompare(template.id);
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              background: compareTemplates.includes(template.id) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                              border: compareTemplates.includes(template.id) ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.3)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.3s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: '700',
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                            onMouseOut={(e) => e.target.style.background = compareTemplates.includes(template.id) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.2)'}
                          >
                            {compareTemplates.includes(template.id) ? '✓' : '+'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={styles.cardBody}>
                      {/* ATS Score Badge */}
                      <div style={styles.atsScore}>
                        <div style={styles.atsScoreLabel}>ATS Score</div>
                        <div style={styles.atsScoreValue}>{template.atsScore}%</div>
                      </div>

                      {/* Rating & Downloads */}
                      <div style={styles.ratingDownloads}>
                        <span>⭐ {template.rating}/5.0</span>
                        <span>📥 {template.downloads}</span>
                      </div>

                      {/* Best For Tags */}
                      <div style={styles.tagsContainer}>
                        <div style={styles.tagLabel}>Best For:</div>
                        <div style={styles.tags}>
                          {template.bestFor?.slice(0, 3).map((role, idx) => (
                            <span key={idx} style={styles.tag}>
                              {role}
                            </span>
                          ))}
                          {template.bestFor?.length > 3 && (
                            <span style={styles.tag}>+{template.bestFor.length - 3}</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={styles.buttonGroup}>
                        <button
                          onClick={() => previewTemplate(template.id)}
                          style={{
                            ...styles.button(true),
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => downloadTemplate(template.id)}
                          style={{
                            ...styles.button(false),
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.paginationContainer}>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      ...styles.paginationButton(false, currentPage === 1),
                      padding: '10px 16px',
                    }}
                  >
                    ← Previous
                  </button>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let page;
                      if (totalPages <= 7) {
                        page = i + 1;
                      } else if (currentPage <= 4) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i;
                      } else {
                        page = currentPage - 3 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          style={styles.paginationButton(page === currentPage, false)}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      ...styles.paginationButton(false, currentPage === totalPages),
                      padding: '10px 16px',
                    }}
                  >
                    Next →
                  </button>

                  <div style={{ fontSize: '12px', color: '#6b7280', marginLeft: '16px', fontWeight: '700' }}>
                    Page {currentPage}/{totalPages}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ATS Analyzer Tab */}
      {activeTab === 'analyze' && (
        <div>
          <div
            style={{
              border: '3px dashed #667eea',
              borderRadius: '12px',
              padding: '60px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'fadeIn 0.6s ease-out',
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#764ba2';
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)';
              e.currentTarget.style.transform = 'scale(1)';
              if (e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '56px', marginBottom: '16px', animation: 'float 3s ease-in-out infinite' }}>📤</div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', marginBottom: '12px' }}>
              Upload Your Resume
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
              Drop your resume here or click to browse
            </p>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>
              Supported: PDF, DOCX, TXT • Max 8 MB
            </p>
          </div>

          {uploadedFile && (
            <div
              style={{
                marginTop: '24px',
                padding: '18px',
                background: '#f0fdf4',
                border: '2px solid #10b981',
                borderRadius: '10px',
                color: '#15803d',
                fontWeight: '700',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
                animation: 'slideUp 0.4s ease-out',
              }}
            >
              ✓ {uploadedFile.name}
            </div>
          )}

          {atsScore && (
            <div style={{ marginTop: '32px', animation: 'fadeIn 0.6s ease-out' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '40px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  marginBottom: '28px',
                  boxShadow: '0 10px 32px rgba(16, 185, 129, 0.2)',
                }}
              >
                <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '12px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
                  Your ATS Score
                </div>
                <div style={{ fontSize: '72px', fontWeight: '900', letterSpacing: '-2px' }}>{atsScore.score}%</div>
                <div style={{ fontSize: '13px', opacity: '0.85', marginTop: '12px' }}>
                  {atsScore.score >= 95 ? '🏆 Elite' : atsScore.score >= 90 ? '⭐ Excellent' : atsScore.score >= 85 ? '💪 Good' : '📈 Fair'}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#15803d', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ✨ Strengths
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {atsScore.strengths?.map((strength, idx) => (
                      <div key={idx} style={{
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        borderLeft: '4px solid #10b981',
                      }}>
                        ✓ {strength}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: '#fef2f2',
                    border: '2px solid #ef4444',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#991b1b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎯 Improvements
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {atsScore.improvements?.map((improvement, idx) => (
                      <div key={idx} style={{
                        background: '#fee2e2',
                        color: '#991b1b',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        borderLeft: '4px solid #ef4444',
                      }}>
                        → {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keywords Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#15803d', marginBottom: '14px' }}>
                    ✓ Found Keywords ({atsScore.keywords.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {atsScore.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          boxShadow: '0 2px 6px rgba(22, 101, 52, 0.1)',
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: '#fef2f2',
                    border: '2px solid #ef4444',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#991b1b', marginBottom: '14px' }}>
                    ⚠ Missing Keywords ({atsScore.missing.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {atsScore.missing.map((kw, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#fee2e2',
                          color: '#991b1b',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          boxShadow: '0 2px 6px rgba(153, 27, 27, 0.1)',
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div
                style={{
                  marginTop: '28px',
                  background: '#fef3c7',
                  border: '3px solid #fcd34d',
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#78350f',
                  fontSize: '13px',
                  lineHeight: '1.8',
                  boxShadow: '0 4px 12px rgba(252, 211, 77, 0.2)',
                }}
              >
                <strong style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '800' }}>💡 AI Pro Recommendation:</strong>
                {atsScore.feedback}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <div style={styles.noResults}>
              <div style={styles.noResultsIcon}>❤️</div>
              <div style={styles.noResultsText}>No Favorites Yet</div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
                Start adding templates to your favorites for quick access
              </div>
              <button
                onClick={() => setActiveTab('gallery')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '13px',
                  transition: 'all 0.3s',
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                ↻ Browse Templates
              </button>
            </div>
          ) : (
            <>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                marginBottom: '28px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Your Favorite Templates ({favorites.length})
              </h2>
              <div style={styles.gallerygrid}>
                {templates.filter(t => favorites.includes(t.id)).map((template) => (
                  <div
                    key={template.id}
                    style={styles.card(hoveredCard === template.id)}
                    onMouseEnter={() => setHoveredCard(template.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div style={styles.cardHeader}>
                      <div>
                        <div style={styles.cardTitle}>{template.name}</div>
                        <div style={styles.cardCategory}>{template.category}</div>
                      </div>
                    </div>
                    <div style={styles.cardBody}>
                      <div style={styles.atsScore}>
                        <div style={styles.atsScoreLabel}>ATS Score</div>
                        <div style={styles.atsScoreValue}>{template.atsScore}%</div>
                      </div>
                      <div style={styles.ratingDownloads}>
                        <span>⭐ {template.rating}/5.0</span>
                        <span>📥 {template.downloads}</span>
                      </div>
                      <div style={styles.buttonGroup}>
                        <button
                          onClick={() => previewTemplate(template.id)}
                          style={{
                            ...styles.button(true),
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => downloadTemplate(template.id)}
                          style={{
                            ...styles.button(false),
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          }}
                          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === 'compare' && compareTemplates.length > 0 && (
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            marginBottom: '28px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Comparing {compareTemplates.length} Templates
          </h2>
          <div style={{
            overflowX: 'auto',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '800', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Feature</th>
                  {templates.filter(t => compareTemplates.includes(t.id)).map((t) => (
                    <th key={t.id} style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '800', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {t.name.substring(0, 25)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'ATS Score', key: 'atsScore' },
                  { label: 'Rating', key: 'rating' },
                  { label: 'Downloads', key: 'downloads' },
                  { label: 'Category', key: 'category' },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                    <td style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#1f2937' }}>{row.label}</td>
                    {templates.filter(t => compareTemplates.includes(t.id)).map((t) => (
                      <td key={t.id} style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#374151' }}>
                        {row.key === 'atsScore' ? `${t[row.key]}%` : row.key === 'rating' ? `${t[row.key]}/5.0` : t[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && selectedTemplate && templateData && (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '28px',
              borderRadius: '12px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 10px 32px rgba(102, 126, 234, 0.2)',
            }}
          >
            <div>
              <h3 style={{ margin: '0', fontSize: '22px', fontWeight: '800' }}>
                {templateData.name}
              </h3>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', opacity: '0.9', fontWeight: '600' }}>
                {templateData.category} • ATS {templateData.atsScore}% • ⭐ {templateData.rating}/5.0
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const colors = colorSchemes[templateData.colorScheme] || { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#0ea5e9' };
                  const font = fontCombos[templateData.fontStyle] || { headingFont: 'Arial, sans-serif', bodyFont: 'Arial, sans-serif' };
                  const expHTML = resumeData.experience.map(exp => `
                    <div style="margin-bottom: 15px;">
                      <div style="font-weight: bold; color: ${colors.primary}; font-size: 13px;">${exp.title || 'Job Title'}</div>
                      <div style="font-size: 12px; color: ${colors.secondary}; font-style: italic; margin: 2px 0;">${exp.company || 'Company'} <span style="float: right; font-style: normal; color: #666; font-size: 11px;">${exp.date || 'Date'}</span></div>
                      <div style="font-size: 11px; color: #444; margin-top: 5px; line-height: 1.5;">${(exp.bullets || '').split('\n').map(b => b ? `• ${b}<br/>` : '').join('')}</div>
                    </div>
                  `).join('');
                  const eduHTML = resumeData.education.map(edu => `
                    <div style="margin-bottom: 12px;">
                      <div style="font-weight: bold; color: ${colors.primary}; font-size: 12px;">${edu.degree || 'Degree'}</div>
                      <div style="font-size: 11px; color: #555;">${edu.school || 'School'} <span style="float: right; color: #666;">${edu.date || 'Date'}</span></div>
                    </div>
                  `).join('');
                  
                  let bodyLayoutHTML = `
                    <div style="margin-top: 20px;">
                      <div style="margin-bottom: 20px;">
                        <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Professional Summary</h3>
                        <p style="font-size: 11px; color: #444; line-height: 1.5;">${resumeData.summary}</p>
                      </div>
                      <div style="margin-bottom: 20px;">
                        <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Experience</h3>
                        ${expHTML}
                      </div>
                      <div style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                          <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Education</h3>
                          ${eduHTML}
                        </div>
                        <div>
                          <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Skills</h3>
                          <div style="font-size: 11px; color: #444; line-height: 1.6;">
                            ${resumeData.skills.split(',').map(s => `<span style="display: inline-block; background: #f0f4f8; color: ${colors.primary}; padding: 3px 6px; border-radius: 4px; margin: 2px; font-weight: bold;">${s.trim()}</span>`).join('')}
                          </div>
                        </div>
                      </div>
                    </div>
                  `;

                  if (templateData.layout === 'modern-sidebar') {
                    bodyLayoutHTML = `
                      <div style="display: flex; gap: 20px; margin-top: 20px;">
                        <div style="flex: 1; border-right: 1px solid #eee; padding-right: 20px;">
                          <div style="margin-bottom: 20px;">
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Contact</h3>
                            <p style="font-size: 11px; color: #444; line-height: 1.6;">
                              📧 ${resumeData.personalInfo.email}<br/>
                              📱 ${resumeData.personalInfo.phone}<br/>
                              📍 ${resumeData.personalInfo.location}<br/>
                              🔗 ${resumeData.personalInfo.linkedin}
                            </p>
                          </div>
                          <div>
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Skills</h3>
                            <p style="font-size: 11px; color: #444; line-height: 1.6;">
                              ${resumeData.skills.split(',').map(s => `<span style="display: inline-block; background: #f0f4f8; color: ${colors.primary}; padding: 3px 6px; border-radius: 4px; margin: 2px; font-weight: bold;">${s.trim()}</span>`).join('')}
                            </p>
                          </div>
                        </div>
                        <div style="flex: 2;">
                          <div style="margin-bottom: 20px;">
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Profile</h3>
                            <p style="font-size: 11px; color: #444; line-height: 1.5;">${resumeData.summary}</p>
                          </div>
                          <div style="margin-bottom: 20px;">
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Experience</h3>
                            ${expHTML}
                          </div>
                          <div>
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Education</h3>
                            ${eduHTML}
                          </div>
                        </div>
                      </div>
                    `;
                  }

                  const compiledHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resumeData.personalInfo.name} - Resume</title>
  <style>
    body { font-family: ${font.bodyFont}; line-height: 1.5; color: #333; background: #fff; padding: 0.5in; margin: 0; }
    .resume-container { max-width: 8.5in; margin: 0 auto; box-sizing: border-box; }
    h1, h2, h3 { font-family: ${font.headingFont}; margin: 0; }
  </style>
</head>
<body>
  <div class="resume-container">
    <header style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); color: white; padding: 25px; border-radius: 6px; text-align: center;">
      <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 5px;">${resumeData.personalInfo.name}</h1>
      <h2 style="font-size: 14px; opacity: 0.9; margin-bottom: 10px; font-weight: 500;">${resumeData.personalInfo.title}</h2>
      <div style="font-size: 11px; opacity: 0.85; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
        <span>📧 ${resumeData.personalInfo.email}</span>
        <span>📱 ${resumeData.personalInfo.phone}</span>
        <span>📍 ${resumeData.personalInfo.location}</span>
        <span>🔗 ${resumeData.personalInfo.linkedin}</span>
      </div>
    </header>
    ${bodyLayoutHTML}
  </div>
</body>
</html>`;
                  const blob = new Blob([compiledHTML], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${(resumeData.personalInfo.name || 'My').replace(/\s+/g, '_')}_Resume.html`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                style={{
                  padding: '14px 24px',
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '13px',
                  transition: 'all 0.3s',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
                ⬇ Download HTML
              </button>

              <button
                onClick={() => {
                  const colors = colorSchemes[templateData.colorScheme] || { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#0ea5e9' };
                  const font = fontCombos[templateData.fontStyle] || { headingFont: 'Arial, sans-serif', bodyFont: 'Arial, sans-serif' };
                  const expHTML = resumeData.experience.map(exp => `
                    <div style="margin-bottom: 15px;">
                      <div style="font-weight: bold; color: ${colors.primary}; font-size: 13px;">${exp.title || 'Job Title'}</div>
                      <div style="font-size: 12px; color: ${colors.secondary}; font-style: italic; margin: 2px 0;">${exp.company || 'Company'} <span style="float: right; font-style: normal; color: #666; font-size: 11px;">${exp.date || 'Date'}</span></div>
                      <div style="font-size: 11px; color: #444; margin-top: 5px; line-height: 1.5;">${(exp.bullets || '').split('\n').map(b => b ? `• ${b}<br/>` : '').join('')}</div>
                    </div>
                  `).join('');
                  const eduHTML = resumeData.education.map(edu => `
                    <div style="margin-bottom: 12px;">
                      <div style="font-weight: bold; color: ${colors.primary}; font-size: 12px;">${edu.degree || 'Degree'}</div>
                      <div style="font-size: 11px; color: #555;">${edu.school || 'School'} <span style="float: right; color: #666;">${edu.date || 'Date'}</span></div>
                    </div>
                  `).join('');
                  
                  let bodyLayoutHTML = `
                    <div style="margin-top: 20px;">
                      <div style="margin-bottom: 20px;">
                        <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Professional Summary</h3>
                        <p style="font-size: 11px; color: #444; line-height: 1.5;">${resumeData.summary}</p>
                      </div>
                      <div style="margin-bottom: 20px;">
                        <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Experience</h3>
                        ${expHTML}
                      </div>
                      <div style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                          <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Education</h3>
                          ${eduHTML}
                        </div>
                        <div>
                          <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Skills</h3>
                          <div style="font-size: 11px; color: #444; line-height: 1.6;">
                            ${resumeData.skills.split(',').map(s => `<span style="display: inline-block; background: #f0f4f8; color: ${colors.primary}; padding: 3px 6px; border-radius: 4px; margin: 2px; font-weight: bold;">${s.trim()}</span>`).join('')}
                          </div>
                        </div>
                      </div>
                    </div>
                  `;

                  if (templateData.layout === 'modern-sidebar') {
                    bodyLayoutHTML = `
                      <div style="display: flex; gap: 20px; margin-top: 20px;">
                        <div style="flex: 1; border-right: 1px solid #eee; padding-right: 20px;">
                          <div style="margin-bottom: 20px;">
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Contact</h3>
                            <p style="font-size: 11px; color: #444; line-height: 1.6;">
                              📧 ${resumeData.personalInfo.email}<br/>
                              📱 ${resumeData.personalInfo.phone}<br/>
                              📍 ${resumeData.personalInfo.location}<br/>
                              🔗 ${resumeData.personalInfo.linkedin}
                            </p>
                          </div>
                          <div>
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Skills</h3>
                            <p style="font-size: 11px; color: #444; line-height: 1.6;">
                              ${resumeData.skills.split(',').map(s => `<span style="display: inline-block; background: #f0f4f8; color: ${colors.primary}; padding: 3px 6px; border-radius: 4px; margin: 2px; font-weight: bold;">${s.trim()}</span>`).join('')}
                            </p>
                          </div>
                        </div>
                        <div style="flex: 2;">
                          <div style="margin-bottom: 20px;">
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Profile</h3>
                            <p style="font-size: 11px; color: #444; line-height: 1.5;">${resumeData.summary}</p>
                          </div>
                          <div style="margin-bottom: 20px;">
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Experience</h3>
                            ${expHTML}
                          </div>
                          <div>
                            <h3 style="color: ${colors.primary}; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid ${colors.accent}; padding-bottom: 5px; margin-bottom: 10px;">Education</h3>
                            ${eduHTML}
                          </div>
                        </div>
                      </div>
                    `;
                  }

                  const compiledHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resumeData.personalInfo.name} - Resume</title>
  <style>
    body { font-family: ${font.bodyFont}; line-height: 1.5; color: #333; background: #fff; padding: 0.5in; margin: 0; }
    .resume-container { max-width: 8.5in; margin: 0 auto; box-sizing: border-box; }
    h1, h2, h3 { font-family: ${font.headingFont}; margin: 0; }
  </style>
</head>
<body>
  <div class="resume-container">
    <header style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); color: white; padding: 25px; border-radius: 6px; text-align: center;">
      <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 5px;">${resumeData.personalInfo.name}</h1>
      <h2 style="font-size: 14px; opacity: 0.9; margin-bottom: 10px; font-weight: 500;">${resumeData.personalInfo.title}</h2>
      <div style="font-size: 11px; opacity: 0.85; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
        <span>📧 ${resumeData.personalInfo.email}</span>
        <span>📱 ${resumeData.personalInfo.phone}</span>
        <span>📍 ${resumeData.personalInfo.location}</span>
        <span>🔗 ${resumeData.personalInfo.linkedin}</span>
      </div>
    </header>
    ${bodyLayoutHTML}
  </div>
</body>
</html>`;
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(compiledHTML);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => {
                      printWindow.print();
                    }, 500);
                  }
                }}
                style={{
                  padding: '14px 24px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '13px',
                  transition: 'all 0.3s',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)';
                }}
              >
                🖨️ Print / Save PDF
              </button>

              <button
                onClick={runGenuineAtsCheck}
                disabled={checkingAts}
                style={{
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: checkingAts ? 'not-allowed' : 'pointer',
                  fontWeight: '800',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                }}
                onMouseOver={(e) => {
                  if (!checkingAts) {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!checkingAts) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                  }
                }}
              >
                {checkingAts ? '⏳ Scanning...' : '🔍 Genuine ATS Check'}
              </button>
            </div>
          </div>

          {/* Split Screen Editor & Live Preview */}
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', textAlign: 'left' }}>
            
            {/* Left side: Inputs */}
            <div style={{ flex: 1.2, minWidth: '400px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1f2937', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '8px' }}>Resume Customizer</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Target Industry */}
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: '#4b5563', display: 'block', marginBottom: '6px' }}>Target Industry (Keyword Matcher)</label>
                  <select 
                    value={resumeData.targetIndustry || templateData.category}
                    onChange={(e) => setResumeData(prev => ({ ...prev, targetIndustry: e.target.value }))}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#f9fafb', fontSize: '13px', color: '#374151' }}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                {/* Personal Information */}
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: '#4b5563', display: 'block', marginBottom: '10px' }}>Personal Info</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={resumeData.personalInfo.name}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, name: e.target.value } }))}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Title" 
                      value={resumeData.personalInfo.title}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, title: e.target.value } }))}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
                    />
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: e.target.value } }))}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Phone" 
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone: e.target.value } }))}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="LinkedIn URL" 
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, linkedin: e.target.value } }))}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Location" 
                      value={resumeData.personalInfo.location}
                      onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, location: e.target.value } }))}
                      style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: '#4b5563' }}>Professional Summary</label>
                    <button 
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await apiFetch('/ai/optimize-text', {
                            method: 'POST',
                            body: JSON.stringify({ text: resumeData.summary, type: 'summary', role: resumeData.personalInfo.title })
                          });
                          if (res.optimized) {
                            setResumeData(prev => ({ ...prev, summary: res.optimized }));
                          }
                        } catch (err) {
                          console.error('AI optimization failed:', err);
                        }
                      }}
                      style={{ padding: '3px 8px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      ✨ Optimize
                    </button>
                  </div>
                  <textarea 
                    rows="3" 
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px', resize: 'vertical' }}
                  />
                </div>

                {/* Skills */}
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: '#4b5563', display: 'block', marginBottom: '6px' }}>Skills (comma separated)</label>
                  <input 
                    type="text" 
                    value={resumeData.skills}
                    onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value }))}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px' }}
                  />
                </div>

                {/* Work Experience */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: '#4b5563' }}>Work Experience</label>
                    <button 
                      onClick={() => setResumeData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now().toString(), title: '', company: '', date: '', bullets: '' }] }))}
                      style={{ padding: '4px 8px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      + Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {resumeData.experience.map(exp => (
                      <div key={exp.id} style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                          <button 
                            onClick={() => setResumeData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== exp.id) }))}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          <input 
                            type="text" 
                            placeholder="Title" 
                            value={exp.title}
                            onChange={(e) => setResumeData(prev => ({ ...prev, experience: prev.experience.map(item => item.id === exp.id ? { ...item, title: e.target.value } : item) }))}
                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '11px' }}
                          />
                          <input 
                            type="text" 
                            placeholder="Company" 
                            value={exp.company}
                            onChange={(e) => setResumeData(prev => ({ ...prev, experience: prev.experience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item) }))}
                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '11px' }}
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Dates" 
                          value={exp.date}
                          onChange={(e) => setResumeData(prev => ({ ...prev, experience: prev.experience.map(item => item.id === exp.id ? { ...item, date: e.target.value } : item) }))}
                          style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '11px', width: '100%', marginBottom: '8px', boxSizing: 'border-box' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <textarea 
                            placeholder="Bullet Achievements (one per line)" 
                            value={exp.bullets}
                            onChange={(e) => setResumeData(prev => ({ ...prev, experience: prev.experience.map(item => item.id === exp.id ? { ...item, bullets: e.target.value } : item) }))}
                            rows="2"
                            style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '11px', boxSizing: 'border-box' }}
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const res = await apiFetch('/ai/optimize-text', {
                                  method: 'POST',
                                  body: JSON.stringify({ text: exp.bullets, type: 'bullet', role: exp.title || resumeData.personalInfo.title })
                                });
                                if (res.optimized) {
                                  setResumeData(prev => ({
                                    ...prev,
                                    experience: prev.experience.map(item => item.id === exp.id ? { ...item, bullets: res.optimized } : item)
                                  }));
                                }
                              } catch (err) {
                                console.error('AI optimization failed:', err);
                              }
                            }}
                            style={{ alignSelf: 'flex-end', padding: '3px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            ✨ Optimize Bullets
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: '#4b5563' }}>Education</label>
                    <button 
                      onClick={() => setResumeData(prev => ({ ...prev, education: [...prev.education, { id: Date.now().toString(), degree: '', school: '', date: '' }] }))}
                      style={{ padding: '4px 8px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      + Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {resumeData.education.map(edu => (
                      <div key={edu.id} style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                          <button 
                            onClick={() => setResumeData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <input 
                            type="text" 
                            placeholder="Degree" 
                            value={edu.degree}
                            onChange={(e) => setResumeData(prev => ({ ...prev, education: prev.education.map(item => item.id === edu.id ? { ...item, degree: e.target.value } : item) }))}
                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '11px' }}
                          />
                          <input 
                            type="text" 
                            placeholder="School" 
                            value={edu.school}
                            onChange={(e) => setResumeData(prev => ({ ...prev, education: prev.education.map(item => item.id === edu.id ? { ...item, school: e.target.value } : item) }))}
                            style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '11px' }}
                          />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Dates" 
                          value={edu.date}
                          onChange={(e) => setResumeData(prev => ({ ...prev, education: prev.education.map(item => item.id === edu.id ? { ...item, date: e.target.value } : item) }))}
                          style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '11px', width: '100%', marginTop: '8px', boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right side: Live Preview & Score analysis */}
            <div style={{ flex: 1.5, minWidth: '450px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* ATS Score Indicator */}
              {(() => {
                const analysis = evaluateATSScore(resumeData, templateData);
                return (
                  <div style={{ background: '#1e293b', color: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `conic-gradient(#10b981 0% ${analysis.score}%, #334155 ${analysis.score}% 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                          {analysis.score}%
                        </div>
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '15px' }}>ATS Real-Time Compliance</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                          As you modify your details, our genuine ATS scoring algorithm analyzes layout, content, action verbs, and matching keywords.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#10b981', display: 'block', marginBottom: '6px' }}>✓ Strengths</span>
                        <div style={{ fontSize: '10px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {analysis.strengths.slice(0, 3).map((s, idx) => <span key={idx}>• {s}</span>)}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f87171', display: 'block', marginBottom: '6px' }}>⚠ Suggestions</span>
                        <div style={{ fontSize: '10px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {analysis.improvements.length > 0 ? (
                            analysis.improvements.slice(0, 3).map((imp, idx) => <span key={idx}>• {imp}</span>)
                          ) : (
                            <span>Perfect score compatibility!</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '14px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Keywords Analysis:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {analysis.foundKeywords.map((kw, idx) => (
                          <span key={idx} style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: '9px', padding: '3px 6px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.2)' }}>
                            ✓ {kw}
                          </span>
                        ))}
                        {analysis.missingKeywords.map((kw, idx) => (
                          <span key={idx} style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: '9px', padding: '3px 6px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)' }}>
                            + Add {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Rendered Resume Document */}
              <div style={{
                background: 'white',
                color: '#333',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                padding: '24px',
                minHeight: '600px',
                fontFamily: fontCombos[templateData.fontStyle]?.bodyFont || 'Arial, sans-serif'
              }}>
                {/* Header */}
                <div style={{
                  background: `linear-gradient(135deg, ${colorSchemes[templateData.colorScheme]?.primary || '#1e3a8a'} 0%, ${colorSchemes[templateData.colorScheme]?.secondary || '#3b82f6'} 100%)`,
                  color: 'white',
                  padding: '20px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont || 'Arial, sans-serif' }}>
                    {resumeData.personalInfo.name || 'Alex Johnson'}
                  </h1>
                  <h2 style={{ fontSize: '13px', opacity: 0.9, margin: '0 0 10px 0', fontWeight: 'normal', fontFamily: fontCombos[templateData.fontStyle]?.headingFont || 'Arial, sans-serif' }}>
                    {resumeData.personalInfo.title || 'Senior Software Engineer'}
                  </h2>
                  <div style={{ fontSize: '10px', opacity: 0.85, display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span>📧 {resumeData.personalInfo.email}</span>
                    <span>📱 {resumeData.personalInfo.phone}</span>
                    <span>📍 {resumeData.personalInfo.location}</span>
                  </div>
                </div>

                {/* Body Details */}
                {templateData.layout === 'modern-sidebar' ? (
                  <div style={{ display: 'flex', gap: '20px', textAlign: 'left' }}>
                    {/* Sidebar */}
                    <div style={{ flex: 1, borderRight: '1px solid #eee', paddingRight: '15px' }}>
                      <div style={{ marginBottom: '15px' }}>
                        <h3 style={{ color: colorSchemes[templateData.colorScheme]?.primary, fontSize: '11px', textTransform: 'uppercase', borderBottom: `2px solid ${colorSchemes[templateData.colorScheme]?.accent}`, paddingBottom: '3px', margin: '0 0 8px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont }}>Contact</h3>
                        <p style={{ fontSize: '10px', color: '#444', margin: 0, lineHeight: '1.5' }}>
                          📧 {resumeData.personalInfo.email}<br/>
                          📱 {resumeData.personalInfo.phone}<br/>
                          📍 {resumeData.personalInfo.location}<br/>
                          🔗 {resumeData.personalInfo.linkedin}
                        </p>
                      </div>
                      <div>
                        <h3 style={{ color: colorSchemes[templateData.colorScheme]?.primary, fontSize: '11px', textTransform: 'uppercase', borderBottom: `2px solid ${colorSchemes[templateData.colorScheme]?.accent}`, paddingBottom: '3px', margin: '0 0 8px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont }}>Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {resumeData.skills.split(',').map((s, idx) => (
                            <span key={idx} style={{ background: '#f3f4f6', color: colorSchemes[templateData.colorScheme]?.primary, padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold' }}>
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div style={{ flex: 2.2 }}>
                      <div style={{ marginBottom: '15px' }}>
                        <h3 style={{ color: colorSchemes[templateData.colorScheme]?.primary, fontSize: '11px', textTransform: 'uppercase', borderBottom: `2px solid ${colorSchemes[templateData.colorScheme]?.accent}`, paddingBottom: '3px', margin: '0 0 8px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont }}>Profile</h3>
                        <p style={{ fontSize: '10px', color: '#444', margin: 0, lineHeight: '1.4' }}>{resumeData.summary}</p>
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <h3 style={{ color: colorSchemes[templateData.colorScheme]?.primary, fontSize: '11px', textTransform: 'uppercase', borderBottom: `2px solid ${colorSchemes[templateData.colorScheme]?.accent}`, paddingBottom: '3px', margin: '0 0 8px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont }}>Experience</h3>
                        {resumeData.experience.map(exp => (
                          <div key={exp.id} style={{ marginBottom: '10px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '11px', color: colorSchemes[templateData.colorScheme]?.primary }}>{exp.title || 'Title'}</div>
                            <div style={{ fontSize: '10px', color: colorSchemes[templateData.colorScheme]?.secondary, fontStyle: 'italic' }}>{exp.company || 'Company'} <span style={{ float: 'right', fontStyle: 'normal', color: '#777' }}>{exp.date || 'Date'}</span></div>
                            <div style={{ fontSize: '10px', color: '#444', marginTop: '3px', lineHeight: '1.4' }}>
                              {(exp.bullets || '').split('\n').map((b, idx) => b ? <div key={idx}>• {b}</div> : null)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h3 style={{ color: colorSchemes[templateData.colorScheme]?.primary, fontSize: '11px', textTransform: 'uppercase', borderBottom: `2px solid ${colorSchemes[templateData.colorScheme]?.accent}`, paddingBottom: '3px', margin: '0 0 8px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont }}>Education</h3>
                        {resumeData.education.map(edu => (
                          <div key={edu.id} style={{ marginBottom: '8px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '10px', color: colorSchemes[templateData.colorScheme]?.primary }}>{edu.degree || 'Degree'}</div>
                            <div style={{ fontSize: '9px', color: '#555' }}>{edu.school || 'School'} <span style={{ float: 'right', color: '#777' }}>{edu.date || 'Date'}</span></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '15px' }}>
                      <h3 style={{ color: colorSchemes[templateData.colorScheme]?.primary, fontSize: '11px', textTransform: 'uppercase', borderBottom: `2px solid ${colorSchemes[templateData.colorScheme]?.accent}`, paddingBottom: '3px', margin: '0 0 8px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont }}>Professional Summary</h3>
                      <p style={{ fontSize: '10px', color: '#444', margin: 0, lineHeight: '1.4' }}>{resumeData.summary}</p>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <h3 style={{ color: colorSchemes[templateData.colorScheme]?.primary, fontSize: '11px', textTransform: 'uppercase', borderBottom: `2px solid ${colorSchemes[templateData.colorScheme]?.accent}`, paddingBottom: '3px', margin: '0 0 8px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont }}>Experience</h3>
                      {resumeData.experience.map(exp => (
                        <div key={exp.id} style={{ marginBottom: '12px' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '11px', color: colorSchemes[templateData.colorScheme]?.primary }}>{exp.title || 'Title'}</div>
                          <div style={{ fontSize: '10px', color: colorSchemes[templateData.colorScheme]?.secondary, fontStyle: 'italic' }}>{exp.company || 'Company'} <span style={{ float: 'right', fontStyle: 'normal', color: '#777' }}>{exp.date || 'Date'}</span></div>
                          <div style={{ fontSize: '10px', color: '#444', marginTop: '3px', lineHeight: '1.4' }}>
                            {(exp.bullets || '').split('\n').map((b, idx) => b ? <div key={idx}>• {b}</div> : null)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <h3 style={{ color: colorSchemes[templateData.colorScheme]?.primary, fontSize: '11px', textTransform: 'uppercase', borderBottom: `2px solid ${colorSchemes[templateData.colorScheme]?.accent}`, paddingBottom: '3px', margin: '0 0 8px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont }}>Education</h3>
                        {resumeData.education.map(edu => (
                          <div key={edu.id} style={{ marginBottom: '8px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '10px', color: colorSchemes[templateData.colorScheme]?.primary }}>{edu.degree || 'Degree'}</div>
                            <div style={{ fontSize: '9px', color: '#555' }}>{edu.school || 'School'} <span style={{ float: 'right', color: '#777' }}>{edu.date || 'Date'}</span></div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h3 style={{ color: colorSchemes[templateData.colorScheme]?.primary, fontSize: '11px', textTransform: 'uppercase', borderBottom: `2px solid ${colorSchemes[templateData.colorScheme]?.accent}`, paddingBottom: '3px', margin: '0 0 8px 0', fontFamily: fontCombos[templateData.fontStyle]?.headingFont }}>Skills</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {resumeData.skills.split(',').map((s, idx) => (
                            <span key={idx} style={{ background: '#f3f4f6', color: colorSchemes[templateData.colorScheme]?.primary, padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold' }}>
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {showAtsModal && genuineAtsReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '650px',
            width: '90%',
            maxHeight: '85vh',
            overflowY: 'auto',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            textAlign: 'left'
          }}>
            <button 
              onClick={() => setShowAtsModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                fontSize: '56px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px'
              }}>
                {genuineAtsReport.score}%
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Genuine AI ATS Analysis</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                Calculated by CareerAI's core weighted analysis engine.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Scoring details breakdown */}
              <div style={{ background: '#0f172a', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', marginTop: 0, marginBottom: '10px', textTransform: 'uppercase' }}>
                  Section Strength Breakdown
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
                  {genuineAtsReport.sections && Object.entries(genuineAtsReport.sections).map(([sect, val]) => (
                    <div key={sect} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
                      <span style={{ textTransform: 'capitalize', color: '#cbd5e1' }}>{sect}:</span>
                      <span style={{ fontWeight: 'bold', color: val >= 80 ? '#10b981' : val >= 60 ? '#f59e0b' : '#ef4444' }}>{val}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#10b981', marginTop: 0, marginBottom: '10px' }}>✓ Key Strengths</h4>
                  <ul style={{ fontSize: '11px', color: '#cbd5e1', paddingLeft: '16px', margin: 0 }}>
                    {genuineAtsReport.recommendations?.filter(r => r.includes('good') || r.includes('Keep')).map((s, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{s}</li>
                    ))}
                    {(!genuineAtsReport.recommendations || genuineAtsReport.recommendations.filter(r => r.includes('good') || r.includes('Keep')).length === 0) && (
                      <li>Structure and layout format are clean.</li>
                    )}
                  </ul>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#f87171', marginTop: 0, marginBottom: '10px' }}>⚠ Recommendations</h4>
                  <ul style={{ fontSize: '11px', color: '#cbd5e1', paddingLeft: '16px', margin: 0 }}>
                    {genuineAtsReport.formattingIssues && genuineAtsReport.formattingIssues.slice(0, 3).map((issue, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{issue}</li>
                    ))}
                    {genuineAtsReport.recommendations?.filter(r => !r.includes('good') && !r.includes('Keep')).slice(0, 2).map((rec, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Keywords */}
              <div style={{ background: '#0f172a', padding: '16px', borderRadius: '10px', border: '1px solid #334155' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#fbbf24', marginTop: 0, marginBottom: '10px' }}>Keywords Analysis</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {genuineAtsReport.matchedKeywords?.map((kw, idx) => (
                    <span key={idx} style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: '9px', padding: '3px 6px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.2)' }}>
                      ✓ {kw}
                    </span>
                  ))}
                  {genuineAtsReport.missingKeywords?.slice(0, 8).map((kw, idx) => (
                    <span key={idx} style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: '9px', padding: '3px 6px', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)' }}>
                      + Add {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowAtsModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#475569',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeLab;
