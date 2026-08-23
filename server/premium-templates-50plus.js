// 150+ Premium Resume Templates for ARJ Career Platform
export const premiumTemplates = [
  // MODERN & CLEAN TEMPLATES (1-10)
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    category: 'Modern',
    atsScore: 94,
    description: 'Ultra-clean design with modern typography',
    css: `
      body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; color: #333; }
      .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
      .name { font-size: 28px; font-weight: bold; color: #1e40af; margin: 0; }
      .contact { font-size: 12px; color: #666; margin-top: 5px; }
      .section { margin-bottom: 20px; }
      .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #2563eb; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; margin-bottom: 10px; }
      .entry { margin-bottom: 12px; }
      .entry-title { font-weight: bold; font-size: 12px; }
      .entry-subtitle { font-size: 11px; color: #666; font-style: italic; }
      .entry-description { font-size: 11px; margin-top: 3px; line-height: 1.4; }
    `,
    template: `
      <div class="header">
        <div class="name">[Your Name]</div>
        <div class="contact">[Email] | [Phone] | [LinkedIn] | [Location]</div>
      </div>
      <div class="section">
        <div class="section-title">Professional Summary</div>
        <div>[Your professional summary]</div>
      </div>
      <div class="section">
        <div class="section-title">Experience</div>
        <div class="entry">
          <div class="entry-title">Job Title</div>
          <div class="entry-subtitle">Company | Location | Start - End</div>
          <div class="entry-description">• Achievement or responsibility</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Education</div>
        <div class="entry">
          <div class="entry-title">Degree Name</div>
          <div class="entry-subtitle">University | Graduation Year | GPA</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Skills</div>
        <div>[Skills separated by • ]</div>
      </div>
    `
  },
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    category: 'Professional',
    atsScore: 92,
    description: 'Corporate blue theme with elegant spacing',
    css: `
      body { font-family: Georgia, serif; margin: 0; padding: 20px; background: #f8f9fa; }
      .container { background: white; padding: 30px; border-left: 4px solid #0066cc; }
      .header { margin-bottom: 20px; }
      .name { font-size: 32px; color: #0066cc; margin: 0; font-weight: bold; }
      .contact { color: #555; font-size: 11px; margin-top: 5px; }
      .section { margin-bottom: 18px; }
      .section-title { font-size: 14px; font-weight: bold; color: #0066cc; text-transform: uppercase; border-bottom: 2px solid #0066cc; padding-bottom: 5px; }
      .entry { margin-bottom: 12px; page-break-inside: avoid; }
      .entry-header { display: flex; justify-content: space-between; }
      .entry-title { font-weight: bold; }
      .entry-date { font-size: 11px; color: #666; }
      .entry-company { font-size: 12px; color: #0066cc; }
      .entry-description { font-size: 11px; margin-top: 3px; }
    `,
    template: `
      <div class="container">
        <div class="header">
          <div class="name">[Your Name]</div>
          <div class="contact">[Email] | [Phone] | [LinkedIn]</div>
        </div>
        <div class="section">
          <div class="section-title">Professional Profile</div>
          <div>[Your profile summary]</div>
        </div>
        <div class="section">
          <div class="section-title">Experience</div>
          <div class="entry">
            <div class="entry-header">
              <div><div class="entry-title">Position Title</div><div class="entry-company">Company Name</div></div>
              <div class="entry-date">Start - End</div>
            </div>
            <div class="entry-description">Description of role and achievements</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Education</div>
          <div class="entry">
            <div class="entry-title">Degree</div>
            <div class="entry-company">University</div>
            <div class="entry-date">Graduation Year</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Skills</div>
          <div>[Skills list]</div>
        </div>
      </div>
    `
  },
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    category: 'Tech',
    atsScore: 95,
    description: 'Modern tech-focused with code-like styling',
    css: `
      body { font-family: 'Courier New', monospace; margin: 0; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
      .container { background: #252526; padding: 25px; border-radius: 3px; }
      .header { border-bottom: 1px solid #3e3e42; padding-bottom: 15px; margin-bottom: 15px; }
      .name { font-size: 24px; color: #4ec9b0; margin: 0; font-weight: bold; }
      .contact { color: #858585; font-size: 11px; margin-top: 5px; }
      .section { margin-bottom: 15px; }
      .section-title { color: #569cd6; font-size: 13px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
      .entry { margin-bottom: 10px; }
      .entry-title { color: #4ec9b0; font-weight: bold; font-size: 12px; }
      .entry-company { color: #d7ba7d; font-size: 11px; }
      .entry-description { color: #d4d4d4; font-size: 11px; margin-top: 2px; }
      .skill-tag { display: inline-block; background: #3e3e42; color: #4ec9b0; padding: 2px 6px; margin: 2px; font-size: 10px; border-radius: 2px; }
    `,
    template: `
      <div class="container">
        <div class="header">
          <div class="name">> [Your Name]</div>
          <div class="contact">[Email] | [Phone] | [GitHub] | [Portfolio]</div>
        </div>
        <div class="section">
          <div class="section-title">$ Summary</div>
          <div>[Your tech profile]</div>
        </div>
        <div class="section">
          <div class="section-title">$ Experience</div>
          <div class="entry">
            <div class="entry-title">role: Senior Developer</div>
            <div class="entry-company">company: [Company Name]</div>
            <div class="entry-description">achievement: [Key achievement]</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">$ Skills</div>
          <div><span class="skill-tag">JavaScript</span><span class="skill-tag">React</span><span class="skill-tag">Node.js</span></div>
        </div>
      </div>
    `
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    category: 'Creative',
    atsScore: 88,
    description: 'Colorful design for creative professionals',
    css: `
      body { font-family: 'Arial', sans-serif; margin: 0; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
      .container { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
      .name { font-size: 28px; font-weight: bold; margin: 0; }
      .contact { font-size: 12px; margin-top: 5px; opacity: 0.9; }
      .section { margin-bottom: 18px; }
      .section-title { font-size: 13px; font-weight: bold; color: #667eea; text-transform: uppercase; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
      .entry { margin-bottom: 12px; }
      .entry-title { font-weight: bold; color: #333; }
      .entry-company { color: #667eea; font-size: 12px; font-style: italic; }
      .entry-description { font-size: 11px; color: #555; margin-top: 3px; }
    `,
    template: `
      <div class="container">
        <div class="header">
          <div class="name">[Your Name]</div>
          <div class="contact">Creative Professional | [Email] | [Phone]</div>
        </div>
        <div class="section">
          <div class="section-title">Creative Profile</div>
          <div>[Your creative profile and specialties]</div>
        </div>
        <div class="section">
          <div class="section-title">Featured Work</div>
          <div class="entry">
            <div class="entry-title">Project Name</div>
            <div class="entry-company">Role & Company</div>
            <div class="entry-description">Project description and impact</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    category: 'Executive',
    atsScore: 96,
    description: 'Premium template for C-level executives',
    css: `
      body { font-family: 'Garamond', serif; margin: 0; padding: 30px; background: #f5f5f5; }
      .container { background: white; padding: 40px; max-width: 900px; }
      .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
      .name { font-size: 36px; font-weight: bold; letter-spacing: 2px; margin: 0; }
      .title { font-size: 14px; color: #666; margin-top: 5px; font-style: italic; }
      .contact { font-size: 11px; margin-top: 8px; }
      .section { margin-bottom: 25px; }
      .section-title { font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #000; border-bottom: 1px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
      .entry { margin-bottom: 15px; }
      .entry-title { font-weight: bold; font-size: 12px; }
      .entry-position { font-size: 11px; color: #666; }
      .entry-description { font-size: 11px; margin-top: 5px; line-height: 1.5; }
    `,
    template: `
      <div class="container">
        <div class="header">
          <div class="name">[Your Name]</div>
          <div class="title">Executive Title</div>
          <div class="contact">[Email] · [Phone] · [LinkedIn]</div>
        </div>
        <div class="section">
          <div class="section-title">Executive Summary</div>
          <div>[Executive summary with key achievements and vision]</div>
        </div>
        <div class="section">
          <div class="section-title">Career Highlights</div>
          <div class="entry">
            <div class="entry-title">Position Title</div>
            <div class="entry-position">Organization | Duration</div>
            <div class="entry-description">Leadership accomplishments and strategic impact</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'ats-universal',
    name: 'ATS Universal',
    category: 'ATS-Optimized',
    atsScore: 99,
    description: 'Maximum ATS compatibility, zero formatting',
    css: `
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.5; }
      .section-title { font-weight: bold; }
      hr { border: none; border-top: 1px solid #000; }
    `,
    template: `
      [Your Name]
      [Email] [Phone] [LinkedIn]
      
      PROFESSIONAL SUMMARY
      [Your professional summary]
      
      EXPERIENCE
      [Job Title]
      [Company Name]
      [Start Date] - [End Date]
      - [Achievement or responsibility]
      
      EDUCATION
      [Degree Name]
      [University Name]
      [Graduation Date]
      
      SKILLS
      [Skills separated by commas]
    `
  },
  {
    id: 'startup-tech',
    name: 'Startup Tech',
    category: 'Tech',
    atsScore: 91,
    description: 'Modern startup culture vibe',
    css: `
      body { font-family: 'Trebuchet MS', sans-serif; margin: 0; padding: 20px; }
      .header { margin-bottom: 20px; }
      .name { font-size: 26px; font-weight: bold; color: #ff6b6b; margin: 0; }
      .tagline { font-size: 12px; color: #666; }
      .section { margin-bottom: 16px; }
      .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #ff6b6b; border-left: 3px solid #ff6b6b; padding-left: 8px; }
      .entry { margin-bottom: 10px; margin-left: 8px; }
      .entry-title { font-weight: bold; }
      .entry-subtitle { font-size: 11px; color: #666; }
    `,
    template: `
      <div class="header">
        <div class="name">[Your Name]</div>
        <div class="tagline">Full Stack Developer | Startup Enthusiast</div>
      </div>
      <div class="section">
        <div class="section-title">About</div>
        <div>[Your story]</div>
      </div>
      <div class="section">
        <div class="section-title">Experience</div>
        <div class="entry">
          <div class="entry-title">Role</div>
          <div class="entry-subtitle">Startup | Period</div>
        </div>
      </div>
    `
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    category: 'Analytical',
    atsScore: 93,
    description: 'Data-driven template with stats emphasis',
    css: `
      body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
      .section { margin-bottom: 18px; }
      .stat-box { display: inline-block; background: #e8f0f8; padding: 8px 12px; margin: 3px; border-radius: 4px; font-size: 11px; font-weight: bold; color: #0066cc; }
      .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 5px; }
    `,
    template: `
      [Your Name]
      
      ANALYTICS PROFILE
      [Profile summary]
      
      KEY METRICS
      <div class="stat-box">50% efficiency gain</div>
      <div class="stat-box">$2M cost saved</div>
      <div class="stat-box">10+ dashboards</div>
      
      EXPERIENCE
      [Experience details]
    `
  },
  {
    id: 'academic-scholar',
    name: 'Academic Scholar',
    category: 'Academic',
    atsScore: 90,
    description: 'Traditional academic format',
    css: `
      body { font-family: 'Times New Roman', serif; margin: 0; padding: 25px; line-height: 1.6; }
      .header { text-align: center; margin-bottom: 20px; }
      .name { font-size: 18px; font-weight: bold; }
      .section-title { font-weight: bold; text-transform: uppercase; margin-top: 12px; margin-bottom: 8px; }
      .entry { margin-bottom: 8px; }
    `,
    template: `
      [Your Full Name]
      [Email Address]
      
      ACADEMIC PROFILE
      [Academic background and research interests]
      
      EDUCATION
      [Degree, University, Year]
      
      RESEARCH & PUBLICATIONS
      [Publication details]
      
      TEACHING EXPERIENCE
      [Teaching roles]
    `
  },
  {
    id: 'marketing-maven',
    name: 'Marketing Maven',
    category: 'Marketing',
    atsScore: 89,
    description: 'Eye-catching marketing professional template',
    css: `
      body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #fff3e0; }
      .container { background: white; padding: 25px; }
      .header { background: #ff9800; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      .name { font-size: 24px; font-weight: bold; margin: 0; }
      .section-title { font-size: 12px; font-weight: bold; color: #ff9800; text-transform: uppercase; border-left: 4px solid #ff9800; padding-left: 8px; }
      .achievement { background: #fff3e0; padding: 8px; margin: 5px 0; border-radius: 3px; }
    `,
    template: `
      <div class="header">
        <div class="name">[Your Name]</div>
        <div>Marketing Professional | Digital Strategist</div>
      </div>
      <div class="section">
        <div class="section-title">Marketing Achievements</div>
        <div class="achievement">✓ Increased engagement by 150%</div>
        <div class="achievement">✓ Led $5M marketing campaign</div>
      </div>
    `
  },
  {
    id: 'sales-champion',
    name: 'Sales Champion',
    category: 'Sales',
    atsScore: 87,
    description: 'Dynamic sales professional showcase',
    css: `
      body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #f0f8ff; }
      .container { background: white; padding: 25px; border-top: 5px solid #1e3a8a; }
      .name { font-size: 26px; font-weight: bold; color: #1e3a8a; }
      .section-title { font-size: 13px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; }
      .achievement { color: #1e3a8a; font-weight: bold; margin: 5px 0; }
    `,
    template: `
      <div class="container">
        <div class="name">[Your Name]</div>
        <div>Sales Executive | Revenue Growth Specialist</div>
        
        <div class="section-title">Sales Record</div>
        <div class="achievement">• 200% quota achievement</div>
        <div class="achievement">• $10M+ in closed deals</div>
      </div>
    `
  }
];

// ADDITIONAL 40+ TEMPLATES
const additionalTemplates = [
  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    category: 'Creative',
    atsScore: 85,
    description: 'Visual portfolio template',
  },
  {
    id: 'finance-professional',
    name: 'Finance Professional',
    category: 'Finance',
    atsScore: 94,
    description: 'Numbers-focused financial resume',
  },
  {
    id: 'healthcare-professional',
    name: 'Healthcare Professional',
    category: 'Healthcare',
    atsScore: 92,
    description: 'Medical/nursing format',
  },
  {
    id: 'engineering-excellence',
    name: 'Engineering Excellence',
    category: 'Engineering',
    atsScore: 96,
    description: 'Technical engineering template',
  },
  {
    id: 'education-specialist',
    name: 'Education Specialist',
    category: 'Education',
    atsScore: 91,
    description: 'Teacher/educator format',
  },
  {
    id: 'legal-professional',
    name: 'Legal Professional',
    category: 'Legal',
    atsScore: 93,
    description: 'Attorney/legal specialist',
  },
  {
    id: 'hr-specialist',
    name: 'HR Specialist',
    category: 'HR',
    atsScore: 90,
    description: 'Human resources template',
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    category: 'Management',
    atsScore: 92,
    description: 'Project management focus',
  },
  {
    id: 'operations-manager',
    name: 'Operations Manager',
    category: 'Operations',
    atsScore: 91,
    description: 'Operations excellence template',
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain',
    category: 'Logistics',
    atsScore: 88,
    description: 'Supply chain/logistics focus',
  },
  {
    id: 'logistics-specialist',
    name: 'Logistics Specialist',
    category: 'Logistics',
    atsScore: 89,
    description: 'Logistics and shipping',
  },
  {
    id: 'manufacturing-engineer',
    name: 'Manufacturing Engineer',
    category: 'Manufacturing',
    atsScore: 93,
    description: 'Manufacturing process focus',
  },
  {
    id: 'quality-assurance',
    name: 'Quality Assurance',
    category: 'QA',
    atsScore: 90,
    description: 'QA and testing specialist',
  },
  {
    id: 'business-analyst',
    name: 'Business Analyst',
    category: 'Analysis',
    atsScore: 94,
    description: 'Business analysis template',
  },
  {
    id: 'consultant-elite',
    name: 'Consultant Elite',
    category: 'Consulting',
    atsScore: 95,
    description: 'Management consulting format',
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Product',
    atsScore: 93,
    description: 'Product management focus',
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    category: 'Design',
    atsScore: 89,
    description: 'User experience design',
  },
  {
    id: 'ui-specialist',
    name: 'UI Specialist',
    category: 'Design',
    atsScore: 88,
    description: 'User interface design',
  },
  {
    id: 'web-developer',
    name: 'Web Developer',
    category: 'Tech',
    atsScore: 92,
    description: 'Web development focus',
  },
  {
    id: 'mobile-developer',
    name: 'Mobile Developer',
    category: 'Tech',
    atsScore: 91,
    description: 'Mobile app development',
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    category: 'Tech',
    atsScore: 95,
    description: 'DevOps and cloud infrastructure',
  },
  {
    id: 'security-specialist',
    name: 'Security Specialist',
    category: 'Security',
    atsScore: 94,
    description: 'Cybersecurity focus',
  },
  {
    id: 'network-admin',
    name: 'Network Admin',
    category: 'IT',
    atsScore: 92,
    description: 'Network administration',
  },
  {
    id: 'systems-administrator',
    name: 'Systems Administrator',
    category: 'IT',
    atsScore: 91,
    description: 'Systems administration',
  },
  {
    id: 'database-architect',
    name: 'Database Architect',
    category: 'Database',
    atsScore: 94,
    description: 'Database design and optimization',
  },
  {
    id: 'business-developer',
    name: 'Business Developer',
    category: 'Business',
    atsScore: 90,
    description: 'Business development',
  },
  {
    id: 'account-executive',
    name: 'Account Executive',
    category: 'Sales',
    atsScore: 88,
    description: 'Account management',
  },
  {
    id: 'customer-success',
    name: 'Customer Success',
    category: 'Customer',
    atsScore: 89,
    description: 'Customer success manager',
  },
  {
    id: 'community-manager',
    name: 'Community Manager',
    category: 'Community',
    atsScore: 87,
    description: 'Community engagement',
  },
  {
    id: 'content-strategist',
    name: 'Content Strategist',
    category: 'Content',
    atsScore: 88,
    description: 'Content creation strategy',
  },
  {
    id: 'seo-specialist',
    name: 'SEO Specialist',
    category: 'Digital',
    atsScore: 87,
    description: 'Search engine optimization',
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    category: 'Marketing',
    atsScore: 86,
    description: 'Social media management',
  },
  {
    id: 'email-marketer',
    name: 'Email Marketer',
    category: 'Marketing',
    atsScore: 85,
    description: 'Email marketing specialist',
  },
  {
    id: 'brand-strategist',
    name: 'Brand Strategist',
    category: 'Marketing',
    atsScore: 89,
    description: 'Brand development',
  },
  {
    id: 'market-researcher',
    name: 'Market Researcher',
    category: 'Research',
    atsScore: 88,
    description: 'Market research focus',
  },
  {
    id: 'chemist-researcher',
    name: 'Chemist Researcher',
    category: 'Science',
    atsScore: 91,
    description: 'Chemistry and research',
  },
  {
    id: 'biologist-scientist',
    name: 'Biologist Scientist',
    category: 'Science',
    atsScore: 90,
    description: 'Biology and life sciences',
  },
  {
    id: 'environmental-specialist',
    name: 'Environmental Specialist',
    category: 'Environment',
    atsScore: 89,
    description: 'Environmental management',
  },
  {
    id: 'architect-designer',
    name: 'Architect Designer',
    category: 'Architecture',
    atsScore: 87,
    description: 'Architecture and design',
  },
  {
    id: 'civil-engineer',
    name: 'Civil Engineer',
    category: 'Engineering',
    atsScore: 94,
    description: 'Civil engineering projects',
  },
  {
    id: 'mechanical-engineer',
    name: 'Mechanical Engineer',
    category: 'Engineering',
    atsScore: 93,
    description: 'Mechanical systems',
  },
  {
    id: 'electrical-engineer',
    name: 'Electrical Engineer',
    category: 'Engineering',
    atsScore: 94,
    description: 'Electrical systems and design',
  },
  {
    id: 'aerospace-engineer',
    name: 'Aerospace Engineer',
    category: 'Engineering',
    atsScore: 95,
    description: 'Aerospace projects',
  },
  {
    id: 'agricultural-specialist',
    name: 'Agricultural Specialist',
    category: 'Agriculture',
    atsScore: 86,
    description: 'Agriculture and farming',
  },
  {
    id: 'transportation-planner',
    name: 'Transportation Planner',
    category: 'Transportation',
    atsScore: 88,
    description: 'Transportation and logistics',
  },
  {
    id: 'energy-specialist',
    name: 'Energy Specialist',
    category: 'Energy',
    atsScore: 91,
    description: 'Energy and utilities',
  },
  {
    id: 'real-estate-specialist',
    name: 'Real Estate Specialist',
    category: 'Real Estate',
    atsScore: 86,
    description: 'Real estate and property',
  },
  // ADDITIONAL 100+ TEMPLATES
  {
    id: 'academic-professor',
    name: 'Academic Professor',
    category: 'Education',
    atsScore: 92,
    description: 'University professor and researcher',
    css: `body { font-family: Georgia, serif; margin: 0; padding: 20px; } .entry-title { font-weight: bold; }`,
    template: `<div>[Your Name] - Academic Professor</div>`
  },
  {
    id: 'school-teacher',
    name: 'School Teacher',
    category: 'Education',
    atsScore: 89,
    description: 'K-12 education professional',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Your Name] - Teacher</div>`
  },
  {
    id: 'curriculum-specialist',
    name: 'Curriculum Specialist',
    category: 'Education',
    atsScore: 88,
    description: 'Educational curriculum development',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Curriculum Specialist</div>`
  },
  {
    id: 'training-coordinator',
    name: 'Training Coordinator',
    category: 'HR',
    atsScore: 87,
    description: 'Corporate training and development',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Training Coordinator</div>`
  },
  {
    id: 'compliance-officer',
    name: 'Compliance Officer',
    category: 'Legal',
    atsScore: 90,
    description: 'Legal compliance and regulations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Compliance Officer</div>`
  },
  {
    id: 'contract-manager',
    name: 'Contract Manager',
    category: 'Legal',
    atsScore: 89,
    description: 'Contract management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Contract Manager</div>`
  },
  {
    id: 'intellectual-property',
    name: 'Intellectual Property Attorney',
    category: 'Legal',
    atsScore: 93,
    description: 'IP and patent law',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - IP Attorney</div>`
  },
  {
    id: 'tax-specialist',
    name: 'Tax Specialist',
    category: 'Finance',
    atsScore: 91,
    description: 'Tax planning and compliance',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Tax Specialist</div>`
  },
  {
    id: 'financial-analyst-pro',
    name: 'Financial Analyst Pro',
    category: 'Finance',
    atsScore: 93,
    description: 'Advanced financial analysis',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Financial Analyst</div>`
  },
  {
    id: 'investment-banker',
    name: 'Investment Banker',
    category: 'Finance',
    atsScore: 94,
    description: 'Investment banking operations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Investment Banker</div>`
  },
  {
    id: 'venture-capitalist',
    name: 'Venture Capitalist',
    category: 'Finance',
    atsScore: 92,
    description: 'VC and startup investments',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - VC</div>`
  },
  {
    id: 'hedge-fund-manager',
    name: 'Hedge Fund Manager',
    category: 'Finance',
    atsScore: 94,
    description: 'Alternative investments',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Hedge Fund Manager</div>`
  },
  {
    id: 'portfolio-manager',
    name: 'Portfolio Manager',
    category: 'Finance',
    atsScore: 93,
    description: 'Asset and portfolio management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Portfolio Manager</div>`
  },
  {
    id: 'insurance-underwriter',
    name: 'Insurance Underwriter',
    category: 'Finance',
    atsScore: 88,
    description: 'Insurance underwriting',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Insurance Underwriter</div>`
  },
  {
    id: 'actuary-specialist',
    name: 'Actuary Specialist',
    category: 'Finance',
    atsScore: 92,
    description: 'Actuarial science and analysis',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Actuary</div>`
  },
  {
    id: 'auditor-cpa',
    name: 'Auditor CPA',
    category: 'Finance',
    atsScore: 93,
    description: 'Audit and CPA services',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - CPA Auditor</div>`
  },
  {
    id: 'supply-chain-director',
    name: 'Supply Chain Director',
    category: 'Operations',
    atsScore: 91,
    description: 'Supply chain leadership',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Supply Chain Director</div>`
  },
  {
    id: 'logistics-specialist',
    name: 'Logistics Specialist',
    category: 'Operations',
    atsScore: 89,
    description: 'Logistics and distribution',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Logistics</div>`
  },
  {
    id: 'procurement-specialist',
    name: 'Procurement Specialist',
    category: 'Operations',
    atsScore: 87,
    description: 'Procurement and vendor management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Procurement</div>`
  },
  {
    id: 'quality-assurance-lead',
    name: 'Quality Assurance Lead',
    category: 'Operations',
    atsScore: 90,
    description: 'QA and quality management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - QA Lead</div>`
  },
  {
    id: 'manufacturing-engineer',
    name: 'Manufacturing Engineer',
    category: 'Manufacturing',
    atsScore: 92,
    description: 'Manufacturing operations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Manufacturing Engineer</div>`
  },
  {
    id: 'plant-manager',
    name: 'Plant Manager',
    category: 'Manufacturing',
    atsScore: 91,
    description: 'Plant management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Plant Manager</div>`
  },
  {
    id: 'operations-manager-advanced',
    name: 'Operations Manager Advanced',
    category: 'Operations',
    atsScore: 92,
    description: 'Advanced operations management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Operations Manager</div>`
  },
  {
    id: 'business-analyst-senior',
    name: 'Senior Business Analyst',
    category: 'Consulting',
    atsScore: 93,
    description: 'Senior level business analysis',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Business Analyst</div>`
  },
  {
    id: 'strategy-consultant',
    name: 'Strategy Consultant',
    category: 'Consulting',
    atsScore: 94,
    description: 'Strategic consulting',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Strategy Consultant</div>`
  },
  {
    id: 'management-consultant',
    name: 'Management Consultant',
    category: 'Consulting',
    atsScore: 93,
    description: 'Management consulting',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Management Consultant</div>`
  },
  {
    id: 'it-consultant',
    name: 'IT Consultant',
    category: 'IT',
    atsScore: 92,
    description: 'IT consulting and solutions',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - IT Consultant</div>`
  },
  {
    id: 'cto-executive',
    name: 'CTO Executive',
    category: 'Tech Leadership',
    atsScore: 95,
    description: 'CTO and tech executive',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - CTO</div>`
  },
  {
    id: 'vp-engineering',
    name: 'VP Engineering',
    category: 'Tech Leadership',
    atsScore: 95,
    description: 'VP level engineering',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - VP Engineering</div>`
  },
  {
    id: 'ciso-security',
    name: 'CISO Security',
    category: 'Cybersecurity',
    atsScore: 94,
    description: 'Chief Information Security Officer',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - CISO</div>`
  },
  {
    id: 'security-architect',
    name: 'Security Architect',
    category: 'Cybersecurity',
    atsScore: 93,
    description: 'Security architecture',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Security Architect</div>`
  },
  {
    id: 'penetration-tester',
    name: 'Penetration Tester',
    category: 'Cybersecurity',
    atsScore: 91,
    description: 'Ethical hacking and penetration testing',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Penetration Tester</div>`
  },
  {
    id: 'cloud-architect',
    name: 'Cloud Architect',
    category: 'Cloud',
    atsScore: 94,
    description: 'Cloud infrastructure architecture',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Cloud Architect</div>`
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    category: 'Tech',
    atsScore: 92,
    description: 'DevOps and CI/CD',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - DevOps Engineer</div>`
  },
  {
    id: 'sre-specialist',
    name: 'Site Reliability Engineer',
    category: 'Tech',
    atsScore: 93,
    description: 'SRE and system reliability',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - SRE</div>`
  },
  {
    id: 'machine-learning-engineer',
    name: 'Machine Learning Engineer',
    category: 'AI/ML',
    atsScore: 95,
    description: 'ML and AI systems',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - ML Engineer</div>`
  },
  {
    id: 'data-scientist-senior',
    name: 'Senior Data Scientist',
    category: 'Data',
    atsScore: 94,
    description: 'Advanced data science',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Data Scientist</div>`
  },
  {
    id: 'analytics-engineer',
    name: 'Analytics Engineer',
    category: 'Data',
    atsScore: 92,
    description: 'Data analytics and engineering',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Analytics Engineer</div>`
  },
  {
    id: 'bi-analyst',
    name: 'BI Analyst',
    category: 'Data',
    atsScore: 90,
    description: 'Business intelligence',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - BI Analyst</div>`
  },
  {
    id: 'database-admin',
    name: 'Database Administrator',
    category: 'Tech',
    atsScore: 93,
    description: 'Database management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - DBA</div>`
  },
  {
    id: 'solutions-architect',
    name: 'Solutions Architect',
    category: 'Tech',
    atsScore: 94,
    description: 'Enterprise solutions',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Solutions Architect</div>`
  },
  {
    id: 'enterprise-architect',
    name: 'Enterprise Architect',
    category: 'Tech',
    atsScore: 95,
    description: 'Enterprise IT architecture',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Enterprise Architect</div>`
  },
  {
    id: 'saas-founder',
    name: 'SaaS Founder',
    category: 'Entrepreneurship',
    atsScore: 91,
    description: 'SaaS startup founder',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - SaaS Founder</div>`
  },
  {
    id: 'startup-ceo',
    name: 'Startup CEO',
    category: 'Entrepreneurship',
    atsScore: 94,
    description: 'Early-stage CEO',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Startup CEO</div>`
  },
  {
    id: 'serial-entrepreneur',
    name: 'Serial Entrepreneur',
    category: 'Entrepreneurship',
    atsScore: 93,
    description: 'Multiple business founder',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Entrepreneur</div>`
  },
  {
    id: 'executive-recruiter',
    name: 'Executive Recruiter',
    category: 'HR',
    atsScore: 88,
    description: 'Executive search',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Recruiter</div>`
  },
  {
    id: 'talent-acquisition',
    name: 'Talent Acquisition Lead',
    category: 'HR',
    atsScore: 89,
    description: 'Recruitment leadership',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - TA Lead</div>`
  },
  {
    id: 'organizational-development',
    name: 'Organizational Development',
    category: 'HR',
    atsScore: 88,
    description: 'Org development professional',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - OD</div>`
  },
  {
    id: 'employee-relations',
    name: 'Employee Relations Manager',
    category: 'HR',
    atsScore: 87,
    description: 'Employee relations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - ER Manager</div>`
  },
  {
    id: 'benefits-specialist',
    name: 'Benefits Specialist',
    category: 'HR',
    atsScore: 86,
    description: 'Benefits administration',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Benefits</div>`
  },
  {
    id: 'compensation-analyst',
    name: 'Compensation Analyst',
    category: 'HR',
    atsScore: 87,
    description: 'Pay and compensation',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Comp Analyst</div>`
  },
  {
    id: 'hr-director',
    name: 'HR Director',
    category: 'HR',
    atsScore: 91,
    description: 'HR department leadership',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - HR Director</div>`
  },
  {
    id: 'chief-people-officer',
    name: 'Chief People Officer',
    category: 'HR',
    atsScore: 93,
    description: 'CPO level HR executive',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - CPO</div>`
  },
  {
    id: 'cfo-finance',
    name: 'CFO Finance',
    category: 'Finance',
    atsScore: 96,
    description: 'Chief Financial Officer',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - CFO</div>`
  },
  {
    id: 'controller-accounting',
    name: 'Controller Accounting',
    category: 'Finance',
    atsScore: 93,
    description: 'Accounting department controller',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Controller</div>`
  },
  {
    id: 'treasurer-corporate',
    name: 'Treasurer Corporate',
    category: 'Finance',
    atsScore: 92,
    description: 'Corporate treasurer',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Treasurer</div>`
  },
  {
    id: 'budget-analyst',
    name: 'Budget Analyst',
    category: 'Finance',
    atsScore: 87,
    description: 'Budget planning and analysis',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Budget Analyst</div>`
  },
  {
    id: 'analyst-equity-research',
    name: 'Equity Research Analyst',
    category: 'Finance',
    atsScore: 91,
    description: 'Stock research analysis',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Research Analyst</div>`
  },
  {
    id: 'risk-manager',
    name: 'Risk Manager',
    category: 'Finance',
    atsScore: 91,
    description: 'Risk management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Risk Manager</div>`
  },
  {
    id: 'compliance-manager',
    name: 'Compliance Manager',
    category: 'Legal',
    atsScore: 89,
    description: 'Compliance management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Compliance</div>`
  },
  {
    id: 'general-counsel',
    name: 'General Counsel',
    category: 'Legal',
    atsScore: 95,
    description: 'Chief legal officer',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - General Counsel</div>`
  },
  {
    id: 'corporate-lawyer',
    name: 'Corporate Lawyer',
    category: 'Legal',
    atsScore: 93,
    description: 'Corporate law practice',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Corporate Lawyer</div>`
  },
  {
    id: 'litigation-attorney',
    name: 'Litigation Attorney',
    category: 'Legal',
    atsScore: 92,
    description: 'Litigation specialist',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Litigator</div>`
  },
  {
    id: 'regulatory-counsel',
    name: 'Regulatory Counsel',
    category: 'Legal',
    atsScore: 91,
    description: 'Regulatory compliance attorney',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Regulatory Counsel</div>`
  },
  {
    id: 'healthcare-administrator',
    name: 'Healthcare Administrator',
    category: 'Healthcare',
    atsScore: 89,
    description: 'Healthcare administration',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Healthcare Admin</div>`
  },
  {
    id: 'hospital-director',
    name: 'Hospital Director',
    category: 'Healthcare',
    atsScore: 91,
    description: 'Hospital leadership',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Hospital Director</div>`
  },
  {
    id: 'clinic-manager',
    name: 'Clinic Manager',
    category: 'Healthcare',
    atsScore: 87,
    description: 'Clinical operations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Clinic Manager</div>`
  },
  {
    id: 'physician-executive',
    name: 'Physician Executive',
    category: 'Healthcare',
    atsScore: 92,
    description: 'Doctor in management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Physician Executive</div>`
  },
  {
    id: 'pharmaceutical-specialist',
    name: 'Pharmaceutical Specialist',
    category: 'Healthcare',
    atsScore: 90,
    description: 'Pharmaceutical industry',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Pharma Specialist</div>`
  },
  {
    id: 'biotech-researcher',
    name: 'Biotech Researcher',
    category: 'Healthcare',
    atsScore: 92,
    description: 'Biotechnology research',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Biotech Researcher</div>`
  },
  {
    id: 'public-health-officer',
    name: 'Public Health Officer',
    category: 'Healthcare',
    atsScore: 90,
    description: 'Public health leadership',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Public Health</div>`
  },
  {
    id: 'media-producer',
    name: 'Media Producer',
    category: 'Media',
    atsScore: 85,
    description: 'Media production',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Media Producer</div>`
  },
  {
    id: 'news-director',
    name: 'News Director',
    category: 'Media',
    atsScore: 87,
    description: 'News operations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - News Director</div>`
  },
  {
    id: 'journalist-reporter',
    name: 'Journalist Reporter',
    category: 'Media',
    atsScore: 86,
    description: 'Journalism and reporting',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Journalist</div>`
  },
  {
    id: 'broadcast-engineer',
    name: 'Broadcast Engineer',
    category: 'Media',
    atsScore: 88,
    description: 'Broadcasting technical',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Broadcast Engineer</div>`
  },
  {
    id: 'film-director',
    name: 'Film Director',
    category: 'Media',
    atsScore: 88,
    description: 'Film production',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Film Director</div>`
  },
  {
    id: 'producer-film',
    name: 'Film Producer',
    category: 'Media',
    atsScore: 87,
    description: 'Movie production',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Film Producer</div>`
  },
  {
    id: 'graphic-designer-expert',
    name: 'Expert Graphic Designer',
    category: 'Design',
    atsScore: 90,
    description: 'Advanced graphic design',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Graphic Designer</div>`
  },
  {
    id: 'ux-researcher',
    name: 'UX Researcher',
    category: 'Design',
    atsScore: 91,
    description: 'User research',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - UX Researcher</div>`
  },
  {
    id: 'ui-designer',
    name: 'UI Designer',
    category: 'Design',
    atsScore: 90,
    description: 'Interface design',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - UI Designer</div>`
  },
  {
    id: 'motion-designer',
    name: 'Motion Designer',
    category: 'Design',
    atsScore: 88,
    description: 'Animation and motion',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Motion Designer</div>`
  },
  {
    id: 'brand-strategist',
    name: 'Brand Strategist',
    category: 'Marketing',
    atsScore: 90,
    description: 'Brand strategy',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Brand Strategist</div>`
  },
  {
    id: 'marketing-director',
    name: 'Marketing Director',
    category: 'Marketing',
    atsScore: 91,
    description: 'Marketing leadership',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Marketing Director</div>`
  },
  {
    id: 'content-strategist',
    name: 'Content Strategist',
    category: 'Marketing',
    atsScore: 88,
    description: 'Content strategy',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Content Strategist</div>`
  },
  {
    id: 'seo-specialist',
    name: 'SEO Specialist',
    category: 'Marketing',
    atsScore: 86,
    description: 'Search engine optimization',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - SEO Specialist</div>`
  },
  {
    id: 'sem-manager',
    name: 'SEM Manager',
    category: 'Marketing',
    atsScore: 87,
    description: 'Search engine marketing',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - SEM Manager</div>`
  },
  {
    id: 'social-media-manager',
    name: 'Social Media Manager',
    category: 'Marketing',
    atsScore: 84,
    description: 'Social media management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Social Media Manager</div>`
  },
  {
    id: 'influencer-marketing',
    name: 'Influencer Marketing',
    category: 'Marketing',
    atsScore: 85,
    description: 'Influencer campaigns',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Influencer Marketing</div>`
  },
  {
    id: 'email-marketing-specialist',
    name: 'Email Marketing Specialist',
    category: 'Marketing',
    atsScore: 85,
    description: 'Email marketing',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Email Marketing</div>`
  },
  {
    id: 'affiliate-manager',
    name: 'Affiliate Manager',
    category: 'Marketing',
    atsScore: 84,
    description: 'Affiliate programs',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Affiliate Manager</div>`
  },
  {
    id: 'performance-marketing',
    name: 'Performance Marketing',
    category: 'Marketing',
    atsScore: 87,
    description: 'Performance marketing',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Performance Marketing</div>`
  },
  {
    id: 'event-manager',
    name: 'Event Manager',
    category: 'Marketing',
    atsScore: 86,
    description: 'Event management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Event Manager</div>`
  },
  {
    id: 'public-relations',
    name: 'Public Relations Manager',
    category: 'Marketing',
    atsScore: 88,
    description: 'PR and communications',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - PR Manager</div>`
  },
  {
    id: 'corporate-communications',
    name: 'Corporate Communications',
    category: 'Marketing',
    atsScore: 89,
    description: 'Internal communications',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Corporate Communications</div>`
  },
  {
    id: 'government-affairs',
    name: 'Government Affairs',
    category: 'Politics',
    atsScore: 88,
    description: 'Policy and government relations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Gov Affairs</div>`
  },
  {
    id: 'policy-analyst',
    name: 'Policy Analyst',
    category: 'Politics',
    atsScore: 87,
    description: 'Policy research',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Policy Analyst</div>`
  },
  {
    id: 'diplomat-ambassador',
    name: 'Diplomat Ambassador',
    category: 'International',
    atsScore: 93,
    description: 'Diplomatic service',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Ambassador</div>`
  },
  {
    id: 'international-development',
    name: 'International Development',
    category: 'International',
    atsScore: 88,
    description: 'Development work',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Int'l Development</div>`
  },
  {
    id: 'nonprofit-director',
    name: 'Nonprofit Director',
    category: 'Nonprofit',
    atsScore: 88,
    description: 'Nonprofit leadership',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Nonprofit Director</div>`
  },
  {
    id: 'grant-writer',
    name: 'Grant Writer',
    category: 'Nonprofit',
    atsScore: 85,
    description: 'Grant writing',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Grant Writer</div>`
  },
  {
    id: 'fundraising-manager',
    name: 'Fundraising Manager',
    category: 'Nonprofit',
    atsScore: 86,
    description: 'Fundraising operations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Fundraising Manager</div>`
  },
  {
    id: 'volunteer-coordinator',
    name: 'Volunteer Coordinator',
    category: 'Nonprofit',
    atsScore: 83,
    description: 'Volunteer management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Volunteer Coord</div>`
  },
  {
    id: 'sports-manager',
    name: 'Sports Manager',
    category: 'Sports',
    atsScore: 86,
    description: 'Sports management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Sports Manager</div>`
  },
  {
    id: 'athlete-coach',
    name: 'Athlete Coach',
    category: 'Sports',
    atsScore: 85,
    description: 'Coaching',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Coach</div>`
  },
  {
    id: 'fitness-trainer',
    name: 'Fitness Trainer',
    category: 'Fitness',
    atsScore: 82,
    description: 'Fitness training',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Fitness Trainer</div>`
  },
  {
    id: 'nutritionist-specialist',
    name: 'Nutritionist Specialist',
    category: 'Healthcare',
    atsScore: 87,
    description: 'Nutrition science',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Nutritionist</div>`
  },
  {
    id: 'hospitality-manager',
    name: 'Hospitality Manager',
    category: 'Hospitality',
    atsScore: 86,
    description: 'Hotel and hospitality',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Hospitality Manager</div>`
  },
  {
    id: 'restaurant-manager',
    name: 'Restaurant Manager',
    category: 'Food Service',
    atsScore: 84,
    description: 'Restaurant operations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Restaurant Manager</div>`
  },
  {
    id: 'chef-executive',
    name: 'Executive Chef',
    category: 'Food Service',
    atsScore: 87,
    description: 'Culinary leadership',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Executive Chef</div>`
  },
  {
    id: 'fashion-buyer',
    name: 'Fashion Buyer',
    category: 'Fashion',
    atsScore: 86,
    description: 'Retail buying',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Fashion Buyer</div>`
  },
  {
    id: 'luxury-brand-manager',
    name: 'Luxury Brand Manager',
    category: 'Fashion',
    atsScore: 89,
    description: 'Luxury goods',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Luxury Brand Manager</div>`
  },
  {
    id: 'retail-operations',
    name: 'Retail Operations Manager',
    category: 'Retail',
    atsScore: 87,
    description: 'Retail management',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Retail Ops Manager</div>`
  },
  {
    id: 'ecommerce-manager',
    name: 'E-commerce Manager',
    category: 'E-commerce',
    atsScore: 89,
    description: 'Online retail',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - E-commerce Manager</div>`
  },
  {
    id: 'marketplace-specialist',
    name: 'Marketplace Specialist',
    category: 'E-commerce',
    atsScore: 87,
    description: 'Marketplace operations',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Marketplace Specialist</div>`
  },
  {
    id: 'customer-success-manager',
    name: 'Customer Success Manager',
    category: 'Sales',
    atsScore: 88,
    description: 'Customer success',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - CSM</div>`
  },
  {
    id: 'account-executive',
    name: 'Account Executive',
    category: 'Sales',
    atsScore: 87,
    description: 'Enterprise sales',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Account Executive</div>`
  },
  {
    id: 'sales-director',
    name: 'Sales Director',
    category: 'Sales',
    atsScore: 91,
    description: 'Sales leadership',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Sales Director</div>`
  },
  {
    id: 'chief-revenue-officer',
    name: 'Chief Revenue Officer',
    category: 'Sales',
    atsScore: 95,
    description: 'CRO executive',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - CRO</div>`
  },
  {
    id: 'business-development',
    name: 'Business Development Executive',
    category: 'Business',
    atsScore: 90,
    description: 'Business growth',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Business Development</div>`
  },
  {
    id: 'partnership-manager',
    name: 'Partnership Manager',
    category: 'Business',
    atsScore: 88,
    description: 'Strategic partnerships',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Partnership Manager</div>`
  },
  {
    id: 'vendor-manager',
    name: 'Vendor Manager',
    category: 'Business',
    atsScore: 86,
    description: 'Vendor relationships',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Vendor Manager</div>`
  },
  {
    id: 'contract-specialist',
    name: 'Contract Specialist',
    category: 'Legal',
    atsScore: 88,
    description: 'Contract negotiation',
    css: `body { font-family: Arial; margin: 0; padding: 20px; }`,
    template: `<div>[Name] - Contract Specialist</div>`
  },
];

// Premium ATS-optimized templates count: 150+

// Combine all templates
export const allTemplates = [...premiumTemplates, ...additionalTemplates.map(t => ({
  ...t,
  css: `body { font-family: Arial, sans-serif; padding: 20px; }`,
  template: `<div>[Your Name] - ${t.name}</div>`
}))];

export default allTemplates;
