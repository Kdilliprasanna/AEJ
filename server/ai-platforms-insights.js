// 20+ Job Platforms Integration for ARJ Career Platform

export const jobPlatforms = [
  // MAJOR PLATFORMS (1-10)
  { id: 'linkedin', name: 'LinkedIn', icon: '🔗', url: 'https://www.linkedin.com/jobs/search/?keywords={skill}', category: 'Major' },
  { id: 'indeed', name: 'Indeed', icon: '🔍', url: 'https://www.indeed.com/jobs?q={skill}', category: 'Major' },
  { id: 'naukri', name: 'Naukri (India)', icon: '🇮🇳', url: 'https://www.naukri.com/jobs-{skill}', category: 'Regional' },
  { id: 'glassdoor', name: 'Glassdoor', icon: '⭐', url: 'https://www.glassdoor.com/Job/jobs.htm?sc.keyword={skill}', category: 'Major' },
  { id: 'angel', name: 'AngelList', icon: '🚀', url: 'https://angel.co/jobs?keywords={skill}', category: 'Startups' },
  { id: 'builtin', name: 'Built In', icon: '🏗️', url: 'https://builtin.com/jobs?search={skill}', category: 'Tech' },
  { id: 'wellfound', name: 'Wellfound (Formerly Angel)', icon: '✨', url: 'https://wellfound.com/jobs?keywords={skill}', category: 'Startups' },
  { id: 'remoteok', name: 'RemoteOK', icon: '🌍', url: 'https://remoteok.com/remote-{skill}-jobs', category: 'Remote' },
  { id: 'workfromhome', name: 'We Work Remotely', icon: '💼', url: 'https://weworkremotely.com/categories/remote-{skill}-jobs', category: 'Remote' },
  { id: 'toptal', name: 'Toptal', icon: '👑', url: 'https://www.toptal.com/jobs#{skill}', category: 'Freelance' },
  
  // SPECIALIZED & REGIONAL (11-20)
  { id: 'github', name: 'GitHub Jobs', icon: '🐙', url: 'https://github.com/search?q=label:job+{skill}', category: 'Tech' },
  { id: 'stackoverflow', name: 'Stack Overflow Jobs', icon: '📚', url: 'https://stackoverflow.com/jobs?q={skill}', category: 'Tech' },
  { id: 'monster', name: 'Monster', icon: '👹', url: 'https://www.monster.com/jobs/search/?q={skill}', category: 'Major' },
  { id: 'ziprecruiter', name: 'ZipRecruiter', icon: '📋', url: 'https://www.ziprecruiter.com/Jobs/{skill}', category: 'Major' },
  { id: 'careerbuilder', name: 'CareerBuilder', icon: '🏢', url: 'https://www.careerbuilder.com/jobs/{skill}', category: 'Major' },
  { id: 'apna', name: 'Apna (India)', icon: '🇮🇳', url: 'https://apna.co/job?query={skill}', category: 'Regional' },
  { id: 'internshala', name: 'Internshala (India)', icon: '🎓', url: 'https://internshala.com/jobs?keyword={skill}', category: 'Regional' },
  { id: 'dice', name: 'Dice (Tech)', icon: '🎲', url: 'https://www.dice.com/jobs?q={skill}', category: 'Tech' },
  { id: 'hired', name: 'Hired', icon: '🤝', url: 'https://hired.com/?keywords={skill}', category: 'Tech' },
  { id: 'creativecircle', name: 'Creative Circle', icon: '🎨', url: 'https://www.creativecircle.com/jobs?role={skill}', category: 'Creative' },
  
  // ADDITIONAL PLATFORMS (21-30+)
  { id: 'flexjobs', name: 'FlexJobs', icon: '⏰', url: 'https://www.flexjobs.com/search?search={skill}', category: 'Remote' },
  { id: 'jobvite', name: 'Jobvite', icon: '🎯', url: 'https://www.jobvite.com/', category: 'ATS' },
  { id: 'lever', name: 'Lever', icon: '⚙️', url: 'https://jobs.lever.co/', category: 'ATS' },
  { id: 'workable', name: 'Workable', icon: '✅', url: 'https://www.workable.com/jobs', category: 'ATS' },
  { id: 'guidepoint', name: 'GuidePoint', icon: '📍', url: 'https://www.guidepoint.com/', category: 'Consulting' },
  { id: 'manpower', name: 'ManpowerGroup', icon: '👥', url: 'https://www.manpowergroup.com/en/careers', category: 'Staffing' },
  { id: 'peoplestrong', name: 'PeopleStrong', icon: '💪', url: 'https://www.peoplestrong.com/', category: 'HR' },
  { id: 'shine', name: 'Shine (India)', icon: '🇮🇳', url: 'https://www.shine.com/jobs/{skill}', category: 'Regional' },
  { id: 'times', name: 'Times Jobs (India)', icon: '🇮🇳', url: 'https://www.timesjobs.com/candidate/job-search.html?searched=true&qSearch={skill}', category: 'Regional' },
  { id: 'sector', name: 'Sector (Global)', icon: '🌐', url: 'https://www.sector.jobs/', category: 'Specialized' }
];

// AI SKILL RECOMMENDATIONS SYSTEM
export const aiSkillRecommendations = {
  'Product Manager': {
    technical: ['SQL', 'Analytics', 'Product Management Tools', 'A/B Testing', 'Data Analysis'],
    soft: ['Leadership', 'Communication', 'Strategic Thinking', 'Cross-functional Collaboration', 'Problem Solving'],
    platforms: ['Google Analytics', 'Mixpanel', 'Amplitude', 'Figma', 'JIRA'],
    gap: ['Product Strategy', 'User Research', 'Roadmap Planning'],
    courses: ['Product School', 'Reforge', 'Maven Analytics']
  },
  'Software Engineer': {
    technical: ['JavaScript', 'Python', 'React', 'Node.js', 'Docker', 'Git', 'Databases'],
    soft: ['Problem Solving', 'Communication', 'Code Review', 'Testing', 'Documentation'],
    platforms: ['GitHub', 'Stack Overflow', 'LeetCode', 'Codewars'],
    gap: ['System Design', 'Performance Optimization', 'Security'],
    courses: ['Udacity', 'Coursera', 'Frontend Masters']
  },
  'Data Scientist': {
    technical: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'TensorFlow', 'PyTorch'],
    soft: ['Data Visualization', 'Communication', 'Storytelling', 'Experimentation'],
    platforms: ['Kaggle', 'Google Colab', 'Jupyter', 'Tableau'],
    gap: ['Deep Learning', 'NLP', 'Computer Vision'],
    courses: ['Fast.ai', 'Andrew Ng ML Course', 'DataCamp']
  },
  'UX Designer': {
    technical: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
    soft: ['Empathy', 'Communication', 'Collaboration', 'Problem Solving'],
    platforms: ['Figma', 'InVision', 'Framer'],
    gap: ['User Testing', 'Interaction Design', 'Accessibility'],
    courses: ['General Assembly', 'Interaction Design Foundation', 'Nielsen Norman Group']
  },
  'Marketing Manager': {
    technical: ['Google Analytics', 'SEO', 'Email Marketing', 'Social Media', 'Data Analysis'],
    soft: ['Creativity', 'Leadership', 'Communication', 'Strategic Planning'],
    platforms: ['HubSpot', 'Mailchimp', 'Google Ads'],
    gap: ['Marketing Automation', 'Growth Hacking', 'Brand Strategy'],
    courses: ['HubSpot Academy', 'Google Marketing Skills', 'Udemy Marketing']
  }
};

// CAREER ROADMAP TEMPLATES
export const careerRoadmaps = {
  'Software Engineer': {
    junior: {
      timeline: '0-2 years',
      focus: 'Learn fundamentals, build projects, contribute to team',
      milestones: [
        'Master one programming language',
        'Understand web development basics',
        'Contribute to open source projects',
        'Build 3+ portfolio projects'
      ]
    },
    mid: {
      timeline: '2-5 years',
      focus: 'Lead projects, mentor juniors, system design',
      milestones: [
        'Master system design patterns',
        'Lead 1-2 projects from start to finish',
        'Mentor 1-2 junior developers',
        'Learn cloud technologies (AWS/GCP/Azure)'
      ]
    },
    senior: {
      timeline: '5+ years',
      focus: 'Architecture, mentorship, strategic decisions',
      milestones: [
        'Design scalable systems for millions of users',
        'Build and manage engineering team',
        'Drive technical direction and standards',
        'Contribute to industry (conferences, open source)'
      ]
    }
  },
  'Product Manager': {
    junior: {
      timeline: '0-2 years',
      focus: 'Learn product fundamentals, manage features',
      milestones: [
        'Ship 5-10 features end-to-end',
        'Learn user research basics',
        'Master product analytics',
        'Build cross-functional relationships'
      ]
    },
    mid: {
      timeline: '2-5 years',
      focus: 'Own product area, define strategy',
      milestones: [
        'Own entire product area or line',
        'Define and execute product strategy',
        'Lead cross-functional initiatives',
        'Grow revenue or engagement by 50%+'
      ]
    },
    senior: {
      timeline: '5+ years',
      focus: 'Company strategy, multiple product areas',
      milestones: [
        'Lead multiple product areas',
        'Define company product strategy',
        'Build and mentor PM team',
        '10x product metrics'
      ]
    }
  }
};

// SALARY INSIGHTS BY ROLE & EXPERIENCE
export const salaryInsights = {
  'Software Engineer': {
    junior: { min: 80000, max: 120000, median: 100000, locations: { 'US': 100000, 'India': 8, 'UK': 40000, 'Canada': 90000 } },
    mid: { min: 120000, max: 180000, median: 150000, locations: { 'US': 150000, 'India': 16, 'UK': 70000, 'Canada': 130000 } },
    senior: { min: 180000, max: 300000, median: 240000, locations: { 'US': 250000, 'India': 25, 'UK': 120000, 'Canada': 180000 } }
  },
  'Product Manager': {
    junior: { min: 100000, max: 140000, median: 120000 },
    mid: { min: 140000, max: 200000, median: 170000 },
    senior: { min: 200000, max: 350000, median: 275000 }
  },
  'Data Scientist': {
    junior: { min: 90000, max: 140000, median: 115000 },
    mid: { min: 140000, max: 210000, median: 175000 },
    senior: { min: 210000, max: 350000, median: 280000 }
  }
};

// COMPANY INSIGHTS DATABASE
export const companyInsights = {
  'google': {
    name: 'Google',
    rating: 4.5,
    size: '150000+',
    industry: 'Technology',
    benefits: 'Free meals, fitness center, parental leave',
    culture: 'Innovation-focused, collaborative, fast-paced',
    salaryRange: '120000-350000',
    growth: 'High', // Career progression opportunity
    remote: true,
    reviews: [
      { author: 'SWE, 5 yrs', rating: 5, text: 'Great learning opportunities, excellent benefits' },
      { author: 'PM, 3 yrs', rating: 4, text: 'Fast-paced, lots of impact. Can be stressful.' }
    ]
  },
  'microsoft': {
    name: 'Microsoft',
    rating: 4.3,
    size: '200000+',
    industry: 'Technology',
    benefits: 'Cloud services, learning credits, mental health support',
    culture: 'Growth mindset, customer-focused',
    salaryRange: '110000-320000',
    growth: 'High',
    remote: true,
    reviews: []
  },
  'amazon': {
    name: 'Amazon',
    rating: 3.8,
    size: '1000000+',
    industry: 'E-commerce/Cloud',
    benefits: 'Employee discounts, career development',
    culture: 'Performance-driven, high-bar culture',
    salaryRange: '100000-300000',
    growth: 'Medium',
    remote: true,
    reviews: []
  },
  'startupxy': {
    name: 'Startup XY',
    rating: 4.7,
    size: '50-100',
    industry: 'Tech/SaaS',
    benefits: 'Equity, flexible hours, learning opportunities',
    culture: 'Fast-paced, wear-many-hats, innovative',
    salaryRange: '80000-180000',
    growth: 'Very High',
    remote: true,
    reviews: [
      { author: 'Early employee', rating: 5, text: 'Best startup experience ever!' }
    ]
  }
};

export default { jobPlatforms, aiSkillRecommendations, careerRoadmaps, salaryInsights, companyInsights };
