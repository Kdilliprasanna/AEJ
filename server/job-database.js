// Comprehensive Job, Internship, Part-time, and Full-time Database
// All jobs are tagged with skills and can be filtered based on user's resume

export const comprehensiveJobDatabase = {
  // ============ FULL-TIME JOBS ============
  fullTimeJobs: [
    // Frontend Developer Roles
    {
      id: 'ft-001',
      title: 'Frontend Developer',
      company: 'Amazon',
      location: 'Bangalore',
      jobType: 'Full-time',
      salary: '₹12-20 LPA',
      description: 'Build scalable, high-performance frontend solutions for millions of users.',
      requiredSkills: ['react', 'javascript', 'html', 'css', 'git', 'api'],
      niceSkills: ['typescript', 'testing', 'redux', 'responsive design'],
      posted: '2024-01-15',
      company_website: 'https://www.amazon.jobs',
    },
    {
      id: 'ft-002',
      title: 'React Developer',
      company: 'Flipkart',
      location: 'Hyderabad',
      jobType: 'Full-time',
      salary: '₹10-18 LPA',
      description: 'Create engaging user interfaces for Flipkart\'s web applications.',
      requiredSkills: ['react', 'javascript', 'css', 'api', 'git'],
      niceSkills: ['next.js', 'tailwind', 'testing', 'performance optimization'],
      posted: '2024-01-10',
      company_website: 'https://www.flipkart.careers',
    },
    {
      id: 'ft-003',
      title: 'Full Stack Developer',
      company: 'Microsoft India',
      location: 'Pune',
      jobType: 'Full-time',
      salary: '₹14-24 LPA',
      description: 'Build end-to-end applications using React, Node.js, and cloud technologies.',
      requiredSkills: ['react', 'node.js', 'express', 'mongodb', 'javascript', 'git'],
      niceSkills: ['typescript', 'docker', 'aws', 'system design'],
      posted: '2024-01-12',
      company_website: 'https://www.microsoft.com/en-in/careers',
    },
    {
      id: 'ft-004',
      title: 'Backend Developer',
      company: 'Razorpay',
      location: 'Bangalore',
      jobType: 'Full-time',
      salary: '₹13-22 LPA',
      description: 'Design and build robust payment APIs and microservices.',
      requiredSkills: ['node.js', 'express', 'mongodb', 'postgresql', 'api', 'git'],
      niceSkills: ['typescript', 'docker', 'kubernetes', 'redis'],
      posted: '2024-01-14',
      company_website: 'https://razorpay.com/careers',
    },
    {
      id: 'ft-005',
      title: 'DevOps Engineer',
      company: 'Google Cloud',
      location: 'Remote',
      jobType: 'Full-time',
      salary: '₹15-28 LPA',
      description: 'Manage infrastructure, deployment pipelines, and cloud operations.',
      requiredSkills: ['docker', 'kubernetes', 'aws', 'linux', 'ci/cd', 'git'],
      niceSkills: ['terraform', 'jenkins', 'monitoring', 'scripting'],
      posted: '2024-01-16',
      company_website: 'https://careers.google.com',
    },
    {
      id: 'ft-006',
      title: 'Data Scientist',
      company: 'BYJU\'S',
      location: 'Bangalore',
      jobType: 'Full-time',
      salary: '₹16-30 LPA',
      description: 'Build ML models to improve learning experiences for millions.',
      requiredSkills: ['python', 'machine learning', 'sql', 'data analysis', 'statistics'],
      niceSkills: ['deep learning', 'tensorflow', 'nlp', 'tableau'],
      posted: '2024-01-13',
      company_website: 'https://careers.byjus.com',
    },
    {
      id: 'ft-007',
      title: 'Data Analyst',
      company: 'Swiggy',
      location: 'Bangalore',
      jobType: 'Full-time',
      salary: '₹8-16 LPA',
      description: 'Analyze data to drive business decisions for Swiggy\'s platform.',
      requiredSkills: ['sql', 'data analysis', 'excel', 'power bi', 'python'],
      niceSkills: ['tableau', 'statistics', 'business analysis'],
      posted: '2024-01-11',
      company_website: 'https://careers.swiggy.com',
    },
    {
      id: 'ft-008',
      title: 'Machine Learning Engineer',
      company: 'NVIDIA',
      location: 'Remote',
      jobType: 'Full-time',
      salary: '₹20-35 LPA',
      description: 'Develop and optimize ML models for AI computing platforms.',
      requiredSkills: ['python', 'machine learning', 'tensorflow', 'pytorch', 'deep learning'],
      niceSkills: ['nlp', 'computer vision', 'cuda', 'cloud'],
      posted: '2024-01-17',
      company_website: 'https://www.nvidia.com/en-in/careers',
    },
    {
      id: 'ft-009',
      title: 'Security Engineer',
      company: 'Infosys',
      location: 'Pune',
      jobType: 'Full-time',
      salary: '₹12-22 LPA',
      description: 'Protect applications and infrastructure from cyber threats.',
      requiredSkills: ['cybersecurity', 'linux', 'networking', 'compliance', 'incident response'],
      niceSkills: ['aws', 'docker', 'penetration testing', 'scripting'],
      posted: '2024-01-15',
      company_website: 'https://www.infosys.com/careers',
    },
    {
      id: 'ft-010',
      title: 'UI/UX Designer turned Developer',
      company: 'Adobe',
      location: 'Remote',
      jobType: 'Full-time',
      salary: '₹14-25 LPA',
      description: 'Build design tools and implement creative solutions.',
      requiredSkills: ['javascript', 'react', 'ui ux', 'design thinking', 'figma'],
      niceSkills: ['css', 'animation', 'design systems', 'accessibility'],
      posted: '2024-01-14',
      company_website: 'https://www.adobe.com/careers',
    },
  ],

  // ============ INTERNSHIPS ============
  internships: [
    {
      id: 'int-001',
      title: 'Frontend Development Intern',
      company: 'Zomato',
      location: 'Bangalore',
      jobType: 'Internship',
      salary: '₹15,000-25,000/month',
      duration: '6 months',
      description: 'Learn modern frontend development while building real features.',
      requiredSkills: ['react', 'javascript', 'html', 'css'],
      niceSkills: ['api', 'git', 'responsive design'],
      posted: '2024-01-16',
      perks: 'Certificate, possible full-time offer, mentorship',
    },
    {
      id: 'int-002',
      title: 'Full Stack Development Intern',
      company: 'Codeial',
      location: 'Remote',
      jobType: 'Internship',
      salary: '₹20,000-30,000/month',
      duration: '3-6 months',
      description: 'Build complete web applications from frontend to database.',
      requiredSkills: ['react', 'node.js', 'mongodb', 'javascript'],
      niceSkills: ['express', 'api', 'git'],
      posted: '2024-01-15',
      perks: 'Remote flexibility, project portfolio, letter of recommendation',
    },
    {
      id: 'int-003',
      title: 'Backend Development Intern',
      company: 'Unacademy',
      location: 'Bangalore',
      jobType: 'Internship',
      salary: '₹18,000-28,000/month',
      duration: '4-6 months',
      description: 'Work on scalable backend systems serving millions of users.',
      requiredSkills: ['node.js', 'express', 'mongodb', 'api'],
      niceSkills: ['postgresql', 'redis', 'docker'],
      posted: '2024-01-14',
      perks: 'Learning budget, mentorship, conversion opportunity',
    },
    {
      id: 'int-004',
      title: 'Data Science Intern',
      company: 'OYO Rooms',
      location: 'Gurgaon',
      jobType: 'Internship',
      salary: '₹20,000-32,000/month',
      duration: '3-6 months',
      description: 'Apply ML to improve booking predictions and recommendations.',
      requiredSkills: ['python', 'machine learning', 'sql', 'data analysis'],
      niceSkills: ['tensorflow', 'tableau', 'statistics'],
      posted: '2024-01-13',
      perks: 'Portfolio project, research paper opportunity',
    },
    {
      id: 'int-005',
      title: 'AI/ML Engineering Intern',
      company: 'IIT Delhi',
      location: 'Delhi',
      jobType: 'Internship',
      salary: 'Stipend: ₹25,000/month',
      duration: '6 months',
      description: 'Conduct research in AI and contribute to published papers.',
      requiredSkills: ['python', 'machine learning', 'deep learning', 'statistics'],
      niceSkills: ['tensorflow', 'pytorch', 'nlp'],
      posted: '2024-01-17',
      perks: 'Research publication, strong resume builder',
    },
  ],

  // ============ PART-TIME JOBS ============
  partTimeJobs: [
    {
      id: 'pt-001',
      title: 'Freelance React Developer',
      company: 'Upwork/Fiverr',
      location: 'Remote',
      jobType: 'Part-time/Freelance',
      salary: '$15-50/hour',
      description: 'Build frontend components and websites for global clients.',
      requiredSkills: ['react', 'javascript', 'html', 'css', 'api'],
      niceSkills: ['responsive design', 'figma', 'git'],
      posted: '2024-01-18',
      flexibility: 'Flexible hours, work from anywhere',
    },
    {
      id: 'pt-002',
      title: 'Content Writer - Tech Blog',
      company: 'Dev.to & Medium Publications',
      location: 'Remote',
      jobType: 'Part-time',
      salary: '$100-500/article',
      description: 'Write technical tutorials and career guides.',
      requiredSkills: ['communication', 'writing', 'technical knowledge', 'research'],
      niceSkills: ['seo', 'marketing', 'social media'],
      posted: '2024-01-16',
      flexibility: 'Set your own pace, 2-5 hrs/week',
    },
    {
      id: 'pt-003',
      title: 'Coding Mentor/Tutor',
      company: 'Chegg, Codementor, Toppr',
      location: 'Remote',
      jobType: 'Part-time',
      salary: '₹300-1000/hour',
      description: 'Help students learn programming, DSA, and system design.',
      requiredSkills: ['javascript', 'python', 'communication', 'teaching', 'problem solving'],
      niceSkills: ['dsa', 'system design', 'web development'],
      posted: '2024-01-15',
      flexibility: 'Choose your hours, earn extra income',
    },
    {
      id: 'pt-004',
      title: 'Freelance Data Analysis Project',
      company: 'Kaggle/Freelancing',
      location: 'Remote',
      jobType: 'Project-based',
      salary: '$500-2000/project',
      description: 'Analyze datasets and create dashboards for businesses.',
      requiredSkills: ['python', 'data analysis', 'sql', 'tableau', 'excel'],
      niceSkills: ['machine learning', 'statistics', 'power bi'],
      posted: '2024-01-14',
      flexibility: 'Work on your schedule',
    },
  ],

  // ============ STARTUP OPPORTUNITIES ============
  startups: [
    {
      id: 'st-001',
      title: 'Full Stack Developer',
      company: 'Dukaan',
      location: 'Remote',
      jobType: 'Full-time',
      salary: '₹10-18 LPA (+ equity)',
      description: 'Help Indian SMBs go digital with our commerce platform.',
      requiredSkills: ['react', 'node.js', 'mongodb', 'javascript'],
      niceSkills: ['typescript', 'aws', 'startup experience'],
      posted: '2024-01-16',
      funding: 'Series B funded',
      equity: 'Stock options available',
    },
    {
      id: 'st-002',
      title: 'AI/ML Engineer',
      company: 'Exoplanet',
      location: 'Bangalore',
      jobType: 'Full-time',
      salary: '₹15-25 LPA (+ equity)',
      description: 'Build AI solutions for autonomous systems.',
      requiredSkills: ['python', 'machine learning', 'deep learning', 'tensorflow'],
      niceSkills: ['nlp', 'computer vision', 'research'],
      posted: '2024-01-17',
      funding: 'Seed + Series A',
      equity: 'Significant equity',
    },
    {
      id: 'st-003',
      title: 'DevOps/Infrastructure Engineer',
      company: 'HashedIn',
      location: 'Bangalore',
      jobType: 'Full-time',
      salary: '₹12-20 LPA',
      description: 'Build infrastructure for blockchain and Web3 companies.',
      requiredSkills: ['docker', 'kubernetes', 'aws', 'linux', 'cicd'],
      niceSkills: ['terraform', 'monitoring', 'security'],
      posted: '2024-01-15',
      funding: 'Backed by Accel',
    },
  ],

  // ============ REMOTE OPPORTUNITIES ============
  remoteJobs: [
    {
      id: 'rm-001',
      title: 'Remote Frontend Engineer',
      company: 'Vercel',
      location: 'Remote (Global)',
      jobType: 'Full-time',
      salary: '$80k-130k USD',
      description: 'Build the future of frontend frameworks and deployment.',
      requiredSkills: ['react', 'javascript', 'typescript', 'nextjs', 'git'],
      niceSkills: ['performance optimization', 'open source'],
      posted: '2024-01-18',
      visaSponsorship: true,
    },
    {
      id: 'rm-002',
      title: 'Remote Full Stack Developer',
      company: 'Toptal',
      location: 'Remote (Any timezone)',
      jobType: 'Full-time Contract',
      salary: '$50k-120k USD/year',
      description: 'Work with top companies on exclusive projects.',
      requiredSkills: ['react', 'node.js', 'javascript', 'database design'],
      niceSkills: ['system design', 'communication', 'independence'],
      posted: '2024-01-17',
      platform: 'Toptal network',
    },
    {
      id: 'rm-003',
      title: 'Remote Product Engineer',
      company: 'GitLab',
      location: 'Remote (Async-first)',
      jobType: 'Full-time',
      salary: '$100k-170k USD',
      description: 'Build GitLab, the all-in-one DevOps platform.',
      requiredSkills: ['javascript', 'ruby', 'git', 'system design'],
      niceSkills: ['devops', 'open source', 'documentation'],
      posted: '2024-01-16',
      benefits: 'Health insurance, 401k, unlimited PTO',
    },
  ],

  // ============ CONSULTING & SERVICES ============
  consultingRoles: [
    {
      id: 'cs-001',
      title: 'Solutions Architect',
      company: 'Deloitte',
      location: 'Hyderabad/Bangalore',
      jobType: 'Full-time',
      salary: '₹18-30 LPA',
      description: 'Design cloud and digital transformation solutions.',
      requiredSkills: ['aws', 'architecture', 'business analysis', 'communication'],
      niceSkills: ['devops', 'database design', 'project management'],
      posted: '2024-01-15',
      clientelele: 'Fortune 500 companies',
    },
  ],

  // ============ FILTERING & MATCHING LOGIC ============
  filterJobsBySkills: function (userSkills = [], jobType = 'all') {
    const allJobs = [
      ...this.fullTimeJobs,
      ...this.internships,
      ...this.partTimeJobs,
      ...this.startups,
      ...this.remoteJobs,
    ];

    const filtered = allJobs.filter((job) => {
      // Filter by job type
      if (jobType !== 'all' && job.jobType.toLowerCase() !== jobType.toLowerCase()) {
        return false;
      }

      // Calculate skill match
      const requiredSkills = (job.requiredSkills || []).map((s) => s.toLowerCase());
      const userSkillsLower = (userSkills || []).map((s) => s.toLowerCase());
      const matchCount = requiredSkills.filter((skill) => userSkillsLower.some((us) => us.includes(skill) || skill.includes(us))).length;
      const matchPercentage = (matchCount / requiredSkills.length) * 100;

      // Include jobs with at least 40% skill match
      return matchPercentage >= 40;
    });

    // Sort by match percentage (descending)
    return filtered.sort((a, b) => {
      const matchA = calculateMatch(userSkills, a.requiredSkills);
      const matchB = calculateMatch(userSkills, b.requiredSkills);
      return matchB - matchA;
    });
  },

  filterByLocation: function (jobs = [], locations = []) {
    if (!locations || locations.length === 0) return jobs;
    const locationsLower = locations.map((l) => l.toLowerCase());
    return jobs.filter((job) => locationsLower.some((l) => job.location.toLowerCase().includes(l)));
  },

  filterBySalaryRange: function (jobs = [], minSalary, maxSalary) {
    return jobs.filter((job) => {
      const salary = job.salary || '';
      // Simplified salary parsing
      return true; // In production, parse salary properly
    });
  },
};

// Helper function to calculate skill match percentage
function calculateMatch(userSkills = [], requiredSkills = []) {
  if (requiredSkills.length === 0) return 0;
  const userSkillsLower = (userSkills || []).map((s) => s.toLowerCase());
  const matches = requiredSkills.filter((skill) => userSkillsLower.some((us) => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us)));
  return (matches.length / requiredSkills.length) * 100;
}

export { calculateMatch };
