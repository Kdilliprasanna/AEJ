// Intelligent Job Matching Engine
// Matches jobs based on resume, education, and target role

const intelligentJobMatcher = {
  // Real job database (simulating real-time updates)
  jobs: [
    // TECH JOBS - Full Stack
    {
      id: 'job-001',
      title: 'Senior Full Stack Developer',
      company: 'Amazon',
      location: 'Bangalore, India',
      type: 'full-time',
      salary: '₹20-35 LPA',
      posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      requiredSkills: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
      minExperience: 3,
      education: ['B.Tech', 'B.S.', 'M.Tech'],
      description: 'Looking for experienced full stack developer to build scalable products',
      targetRoles: ['Full Stack Engineer', 'Senior Developer']
    },
    {
      id: 'job-002',
      title: 'Full Stack Developer',
      company: 'Flipkart',
      location: 'Hyderabad, India',
      type: 'full-time',
      salary: '₹12-22 LPA',
      posted: new Date(),
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      minExperience: 2,
      education: ['B.Tech', 'B.S.'],
      description: 'Build and scale e-commerce platform',
      targetRoles: ['Full Stack Engineer', 'MERN Developer']
    },
    // FRONTEND JOBS
    {
      id: 'job-003',
      title: 'React Developer',
      company: 'Microsoft',
      location: 'Remote',
      type: 'full-time',
      salary: '$80,000-$120,000 USD',
      posted: new Date(),
      requiredSkills: ['React', 'JavaScript', 'CSS', 'REST API'],
      minExperience: 2,
      education: ['B.Tech', 'Bootcamp'],
      description: 'Build next-generation productivity tools',
      targetRoles: ['Frontend Engineer', 'React Developer']
    },
    // BACKEND JOBS
    {
      id: 'job-004',
      title: 'Python Backend Developer',
      company: 'Razorpay',
      location: 'Bangalore, India',
      type: 'full-time',
      salary: '₹14-26 LPA',
      posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      requiredSkills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'AWS'],
      minExperience: 2,
      education: ['B.Tech'],
      description: 'Build payment infrastructure serving millions',
      targetRoles: ['Backend Engineer', 'Python Developer']
    },
    // DATA SCIENCE
    {
      id: 'job-005',
      title: 'Data Scientist',
      company: 'Google',
      location: 'Remote',
      type: 'full-time',
      salary: '₹18-35 LPA / $120,000-$180,000',
      posted: new Date(),
      requiredSkills: ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
      minExperience: 2,
      education: ['B.Tech', 'M.Tech', 'M.S.'],
      description: 'Work on AI/ML products serving billions',
      targetRoles: ['Data Scientist', 'ML Engineer']
    },
    // DEVOPS
    {
      id: 'job-006',
      title: 'DevOps Engineer',
      company: 'Vercel',
      location: 'Remote',
      type: 'full-time',
      salary: '₹16-30 LPA / $100,000-$160,000',
      posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
      minExperience: 2,
      education: ['B.Tech'],
      description: 'Scale deployment infrastructure for 1M+ developers',
      targetRoles: ['DevOps Engineer', 'Cloud Engineer']
    },
    // INTERNSHIPS
    {
      id: 'internship-001',
      title: 'Frontend Developer Intern',
      company: 'Zomato',
      location: 'Bangalore',
      type: 'internship',
      salary: '₹20,000-25,000/month',
      posted: new Date(),
      requiredSkills: ['React', 'JavaScript', 'HTML/CSS'],
      minExperience: 0,
      education: ['B.Tech (2nd/3rd year)', 'Any Degree'],
      description: '3-6 month internship in frontend development',
      targetRoles: ['Intern', 'Frontend Developer']
    },
    {
      id: 'internship-002',
      title: 'Backend Development Intern',
      company: 'Unacademy',
      location: 'Bangalore',
      type: 'internship',
      salary: '₹15,000-20,000/month',
      posted: new Date(),
      requiredSkills: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
      minExperience: 0,
      education: ['B.Tech', 'Any Engineering Degree'],
      description: 'Learn backend development, build real features',
      targetRoles: ['Intern', 'Backend Developer']
    },
    // STARTUP ROLES
    {
      id: 'startup-001',
      title: 'Founding Engineer - Full Stack',
      company: 'Dukaan',
      location: 'Bangalore',
      type: 'full-time',
      salary: '₹15-25 LPA + equity',
      posted: new Date(),
      requiredSkills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      minExperience: 2,
      education: ['B.Tech'],
      description: 'Be part of founding team, build from scratch',
      targetRoles: ['Full Stack Engineer', 'Founding Engineer']
    }
  ],

  // Calculate skill match percentage
  calculateSkillMatch: (userSkills, jobRequiredSkills) => {
    if (!userSkills || !jobRequiredSkills) return 0;
    
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const matchedSkills = jobRequiredSkills.filter(requiredSkill =>
      userSkillsLower.some(userSkill =>
        userSkill.includes(requiredSkill.toLowerCase()) ||
        requiredSkill.toLowerCase().includes(userSkill)
      )
    );
    
    return Math.round((matchedSkills.length / jobRequiredSkills.length) * 100);
  },

  // Calculate education match
  calculateEducationMatch: (userEducation, jobEducationRequirements) => {
    if (!userEducation || !jobEducationRequirements) return 100;
    
    const userDegrees = userEducation.map(e => e.degree.toLowerCase());
    const matched = jobEducationRequirements.some(req =>
      userDegrees.some(deg => deg.includes(req.toLowerCase()) || req.toLowerCase().includes(deg))
    );
    
    return matched ? 100 : 50; // Partial match if degree type different
  },

  // Calculate experience match
  calculateExperienceMatch: (userExperience, jobMinExperience) => {
    const yearsOfExperience = userExperience || 0;
    if (yearsOfExperience >= jobMinExperience) return 100;
    return Math.round((yearsOfExperience / jobMinExperience) * 100);
  },

  // Main matching function
  findMatchingJobs: (userProfile) => {
    const {
      skills = [],
      education = [],
      targetRole = null,
      yearsOfExperience = 0,
      minSalary = 0,
      maxSalary = Infinity,
      jobType = null,
      location = null
    } = userProfile;

    return intelligentJobMatcher.jobs
      .map(job => {
        let totalScore = 0;
        const weights = {
          skillMatch: 0.40,      // 40% weight on skill matching
          educationMatch: 0.20,  // 20% weight on education
          experienceMatch: 0.20, // 20% weight on experience
          roleMatch: 0.20        // 20% weight on target role matching
        };

        // Calculate individual scores
        const skillScore = intelligentJobMatcher.calculateSkillMatch(skills, job.requiredSkills);
        const educationScore = intelligentJobMatcher.calculateEducationMatch(education, job.education);
        const experienceScore = intelligentJobMatcher.calculateExperienceMatch(yearsOfExperience, job.minExperience);
        
        // Role matching (if user has target role, boost if job matches)
        const roleScore = targetRole && job.targetRoles?.some(r => r.toLowerCase().includes(targetRole.toLowerCase()))
          ? 100
          : 50;

        // Calculate weighted score
        totalScore = (
          (skillScore * weights.skillMatch) +
          (educationScore * weights.educationMatch) +
          (experienceScore * weights.experienceMatch) +
          (roleScore * weights.roleMatch)
        );

        // Apply filters
        let filterMatch = true;
        if (jobType && job.type !== jobType) filterMatch = false;
        if (location && !job.location.toLowerCase().includes(location.toLowerCase())) filterMatch = false;

        return {
          ...job,
          matchScore: Math.round(totalScore),
          skillMatch: skillScore,
          educationMatch: educationScore,
          experienceMatch: experienceScore,
          roleMatch: roleScore,
          filterMatch,
          missingSkills: job.requiredSkills.filter(s =>
            !skills.some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))
          )
        };
      })
      .filter(job => job.matchScore >= 40 && job.filterMatch) // Only jobs with 40%+ match
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  // Get jobs by type
  getJobsByType: (type = null) => {
    if (!type) {
      return {
        'full-time': intelligentJobMatcher.jobs.filter(j => j.type === 'full-time').length,
        'internship': intelligentJobMatcher.jobs.filter(j => j.type === 'internship').length,
        'startup': intelligentJobMatcher.jobs.filter(j => j.type === 'startup').length,
        'remote': intelligentJobMatcher.jobs.filter(j => j.location.toLowerCase().includes('remote')).length,
        'part-time': intelligentJobMatcher.jobs.filter(j => j.type === 'part-time').length
      };
    }
    
    return intelligentJobMatcher.jobs.filter(j => j.type === type);
  },

  // Add new job (for real-time updates)
  addJob: (jobData) => {
    const newJob = {
      id: `job-${Date.now()}`,
      posted: new Date(),
      ...jobData
    };
    intelligentJobMatcher.jobs.push(newJob);
    return newJob;
  },

  // Delete job
  deleteJob: (jobId) => {
    const index = intelligentJobMatcher.jobs.findIndex(j => j.id === jobId);
    if (index > -1) {
      intelligentJobMatcher.jobs.splice(index, 1);
      return true;
    }
    return false;
  }
};

export { intelligentJobMatcher };
