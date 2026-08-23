// Overleaf-Style Code-Based Resume Templates
// Users can edit these as code and see live preview

export const codeBasedResumeTemplates = [
  {
    id: 'modern-tech',
    name: 'Modern Tech Stack',
    description: 'Clean, modern design for tech professionals',
    bestFor: 'Developers, Engineers, Data Scientists',
    template: `
{
  "metadata": {
    "template": "modern-tech",
    "accent_color": "#2563eb",
    "font": "Inter"
  },
  "header": {
    "name": "Your Name",
    "email": "your.email@gmail.com",
    "phone": "+91-XXXXXXXXXX",
    "location": "City, Country",
    "links": [
      { "label": "GitHub", "url": "github.com/yourprofile" },
      { "label": "Portfolio", "url": "yourportfolio.com" },
      { "label": "LinkedIn", "url": "linkedin.com/in/yourprofile" }
    ]
  },
  "summary": "Software developer with X years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies.",
  "skills": {
    "languages": ["JavaScript", "TypeScript", "Python"],
    "frontend": ["React", "Next.js", "Tailwind CSS"],
    "backend": ["Node.js", "Express", "MongoDB"],
    "tools": ["Git", "Docker", "AWS"],
    "soft_skills": ["Leadership", "Communication", "Problem Solving"]
  },
  "experience": [
    {
      "company": "Company Name",
      "role": "Senior Developer",
      "duration": "Jan 2022 - Present",
      "location": "City",
      "achievements": [
        "Led development of X feature, improving performance by 40%",
        "Mentored 3 junior developers on React best practices",
        "Reduced API response time by 50% through optimization"
      ]
    },
    {
      "company": "Previous Company",
      "role": "Developer",
      "duration": "Jun 2020 - Dec 2021",
      "location": "City",
      "achievements": [
        "Built responsive UI components used by 100k+ users",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
        "Fixed critical bugs affecting 10% of user base"
      ]
    }
  ],
  "projects": [
    {
      "name": "Job Tracker App",
      "tech_stack": ["React", "Node.js", "MongoDB"],
      "duration": "3 months",
      "description": "Full-stack application to track job applications with real-time updates",
      "impact": "500+ users, 4.8★ rating",
      "links": {
        "github": "github.com/project",
        "live": "project-url.com"
      }
    }
  ],
  "education": [
    {
      "degree": "B.Tech in Computer Science",
      "institution": "University Name",
      "graduation": "2020",
      "cgpa": "8.5/10"
    }
  ],
  "certifications": [
    "AWS Certified Solutions Architect - Associate",
    "Google Cloud Professional Data Engineer"
  ]
}
    `,
    preview_html: `
      <div style="font-family: Inter, sans-serif; max-width: 800px; padding: 40px; background: white; color: #1f2937;">
        <div style="border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 32px;">Your Name</h1>
          <p style="margin: 5px 0; color: #6b7280;">your.email@gmail.com | +91-XXXXXXXXXX | City, Country</p>
          <div style="margin-top: 10px; font-size: 14px; color: #2563eb;">
            GitHub | Portfolio | LinkedIn
          </div>
        </div>
        
        <p style="line-height: 1.6; margin-bottom: 20px; color: #4b5563;">Professional summary about yourself...</p>
        
        <h2 style="border-left: 4px solid #2563eb; padding-left: 10px; margin-top: 20px;">Experience</h2>
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <strong>Senior Developer</strong>
            <span style="color: #6b7280;">2022 - Present</span>
          </div>
          <p style="margin: 0; color: #6b7280;">Company Name | City</p>
          <ul style="margin: 8px 0; padding-left: 20px;">
            <li>Led development of X feature, improving performance by 40%</li>
            <li>Mentored 3 junior developers on React best practices</li>
          </ul>
        </div>
        
        <h2 style="border-left: 4px solid #2563eb; padding-left: 10px; margin-top: 20px;">Skills</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div>
            <strong style="color: #2563eb;">Languages</strong><br/>
            JavaScript, TypeScript, Python
          </div>
          <div>
            <strong style="color: #2563eb;">Frontend</strong><br/>
            React, Next.js, Tailwind CSS
          </div>
        </div>
      </div>
    `,
  },

  {
    id: 'ats-optimized',
    name: 'ATS Optimized',
    description: 'Specifically designed to pass ATS scanners',
    bestFor: 'Job seekers targeting traditional companies',
    template: `
{
  "metadata": {
    "template": "ats-optimized",
    "format": "simple",
    "use_columns": false
  },
  "header": {
    "name": "YOUR NAME",
    "email": "email@gmail.com",
    "phone": "+91-XXXXXXXXXX",
    "location": "CITY, STATE"
  },
  "professional_summary": "Results-driven professional with X years of experience in [Industry]. Proficient in [Key Skills]. Proven track record of delivering high-impact solutions.",
  "core_competencies": [
    "Skill 1", "Skill 2", "Skill 3", "Skill 4",
    "Skill 5", "Skill 6", "Skill 7", "Skill 8"
  ],
  "professional_experience": [
    {
      "position": "Job Title",
      "company": "Company Name",
      "duration": "Month Year - Month Year",
      "achievements": [
        "Quantified achievement with specific numbers and results",
        "Action verb used for each achievement statement",
        "Results-oriented descriptions with business impact"
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "field": "Field of Study",
      "institution": "University Name",
      "year": "Year"
    }
  ]
}
    `,
    preview_html: `
      <div style="font-family: Arial, sans-serif; max-width: 850px; padding: 40px; line-height: 1.5;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">YOUR NAME</h1>
          <p style="margin: 5px 0; font-size: 12px;">email@gmail.com | +91-XXXXXXXXXX | CITY, STATE</p>
        </div>
        
        <div>
          <h3 style="margin-bottom: 8px; font-weight: bold;">PROFESSIONAL SUMMARY</h3>
          <p style="margin: 0; font-size: 12px;">Results-driven professional with X years of experience...</p>
        </div>
        
        <div style="margin-top: 15px;">
          <h3 style="margin-bottom: 8px; font-weight: bold;">CORE COMPETENCIES</h3>
          <p style="margin: 0; font-size: 12px;">Skill 1 • Skill 2 • Skill 3 • Skill 4 • Skill 5 • Skill 6</p>
        </div>
        
        <div style="margin-top: 15px;">
          <h3 style="margin-bottom: 8px; font-weight: bold;">PROFESSIONAL EXPERIENCE</h3>
          <p style="margin: 0; font-weight: bold; font-size: 12px;">JOB TITLE | Company Name | Month Year - Month Year</p>
          <ul style="margin: 5px 0; padding-left: 20px; font-size: 12px;">
            <li>Quantified achievement with specific numbers</li>
          </ul>
        </div>
      </div>
    `,
  },

  {
    id: 'startup-bold',
    name: 'Startup Bold',
    description: 'Eye-catching design for startup and creative roles',
    bestFor: 'Startup employees, Product managers, Designers',
    template: `
{
  "metadata": {
    "template": "startup-bold",
    "accent": "#ff6b35",
    "layout": "two_column"
  },
  "sidebar": {
    "name": "Your Name",
    "headline": "Full Stack Developer | Startup Enthusiast",
    "about": "Building products that matter. Experienced in React, Node, and scaling startups.",
    "contact": {
      "email": "contact@example.com",
      "phone": "+91-XXXXXXXXXX",
      "linkedin": "linkedin.com/in/yourprofile",
      "github": "github.com/yourprofile",
      "website": "yourportfolio.com"
    },
    "skills": ["React", "Node.js", "Product Thinking", "Leadership"],
    "tools": ["Figma", "Git", "AWS", "Notion"]
  },
  "main": {
    "achievements": [
      {
        "title": "Built SaaS Product",
        "description": "Launched web app from 0 to 1k users in 3 months",
        "metrics": "1K users, $5K MRR"
      },
      {
        "title": "Led Engineering Team",
        "description": "Managed team of 4 developers to deliver features on time",
        "metrics": "3 major features shipped"
      }
    ],
    "experience": [
      {
        "role": "Founder/Developer",
        "company": "Your Startup",
        "period": "2022 - Present",
        "highlights": ["Full product development", "Fundraising", "Team building"]
      }
    ],
    "featured_projects": [
      {
        "name": "Project Name",
        "description": "What it does",
        "impact": "500+ users"
      }
    ]
  }
}
    `,
  },

  {
    id: 'academic-cv',
    name: 'Academic CV',
    description: 'For research papers, publications, and academic roles',
    bestFor: 'Researchers, Academics, PhD students',
    template: `
{
  "metadata": {
    "template": "academic-cv"
  },
  "header": {
    "name": "Dr./Prof. Your Name",
    "position": "Assistant Professor / Research Fellow",
    "institution": "University Name",
    "contact": "email@university.edu | +91-XXXXXXXXXX"
  },
  "education": [
    {
      "degree": "Ph.D.",
      "field": "Computer Science",
      "institution": "University Name",
      "year": "2019",
      "thesis_title": "Your Thesis Title"
    }
  ],
  "publications": [
    {
      "title": "Paper Title",
      "authors": "Your Name, Co-author",
      "journal": "Journal Name",
      "year": "2023",
      "link": "doi/link",
      "citations": 15
    }
  ],
  "research_interests": ["AI/ML", "NLP", "Computer Vision"],
  "grants_and_funding": [
    {
      "name": "Grant Name",
      "amount": "Amount",
      "year": "Year"
    }
  ]
}
    `,
  },

  {
    id: 'minimal-one-page',
    name: 'Minimal One-Page',
    description: 'Strict one-page resume with maximum impact',
    bestFor: 'All professions (ATS and human friendly)',
    template: `
{
  "metadata": {
    "template": "minimal",
    "max_pages": 1,
    "font_size": 10
  },
  "header": {
    "name": "NAME",
    "title": "Software Engineer",
    "contact": "email@gmail.com | +91-XXXXXXXXXX | linkedin.com/in/profile"
  },
  "summary": "X years building scalable applications with React, Node, and AWS. Delivered 15+ projects, mentored 5+ developers.",
  "experience": [
    {
      "company": "Company",
      "role": "Engineer",
      "period": "2022-Present",
      "bullets": [
        "• Increased performance 40%, impacting 100k+ users",
        "• Led team of 3, shipped 5 features",
        "• Reduced costs by $50k/year"
      ]
    }
  ],
  "skills": "React, Node.js, TypeScript, AWS, PostgreSQL, Git",
  "education": "B.Tech CS, University - 2020"
}
    `,
  },

  {
    id: 'design-portfolio',
    name: 'Design Portfolio',
    description: 'Visual resume for designers and creatives',
    bestFor: 'UI/UX Designers, Product Designers, Illustrators',
    template: `
{
  "metadata": {
    "template": "design-portfolio",
    "layout": "portfolio_grid"
  },
  "hero": {
    "name": "Your Name",
    "tagline": "Product Designer | Creating delightful experiences",
    "cta": "View Work"
  },
  "featured_projects": [
    {
      "name": "Project 1",
      "image": "url-to-image",
      "description": "Redesigned mobile app, improved user engagement by 30%",
      "tools": ["Figma", "Prototyping", "User Research"],
      "case_study": "link-to-case-study"
    },
    {
      "name": "Project 2",
      "image": "url-to-image",
      "description": "Led design system creation for 50+ components",
      "tools": ["Design Systems", "Component Library"],
      "case_study": "link-to-case-study"
    }
  ],
  "about": "With X years of design experience, I focus on user-centered solutions.",
  "tools": ["Figma", "Adobe XD", "Sketch", "Prototype.io", "Principle"]
}
    `,
  },

  {
    id: 'data-metrics',
    name: 'Data Metrics Resume',
    description: 'Emphasize quantifiable achievements and metrics',
    bestFor: 'Data Scientists, Analysts, Product Managers',
    template: `
{
  "metadata": {
    "template": "data-metrics"
  },
  "header": {
    "name": "Your Name",
    "title": "Data Scientist / Product Manager",
    "email": "email@gmail.com"
  },
  "key_metrics": {
    "impact": "Delivered 50+ data solutions",
    "users": "100k+ users impacted",
    "revenue": "$5M+ in influenced revenue",
    "accuracy": "98% model accuracy"
  },
  "featured_projects": [
    {
      "name": "ML Model",
      "metrics": {
        "accuracy": "98%",
        "users_impacted": "500k",
        "time_saved": "40% reduction",
        "revenue_impact": "$2M/year"
      }
    }
  ],
  "skills": {
    "data_science": ["Python", "SQL", "TensorFlow", "Scikit-learn"],
    "visualization": ["Tableau", "Power BI", "Looker"],
    "tools": ["Jupyter", "Git", "AWS SageMaker"]
  }
}
    `,
  },

  {
    id: 'fresher-friendly',
    name: 'Fresher Friendly',
    description: 'Perfect for new graduates and career changers',
    bestFor: 'Fresh graduates, Career changers, Internship seekers',
    template: `
{
  "metadata": {
    "template": "fresher"
  },
  "header": {
    "name": "Your Name",
    "email": "email@gmail.com",
    "location": "City",
    "linkedin": "linkedin.com/in/profile"
  },
  "education": [
    {
      "degree": "B.Tech / Bachelor's",
      "field": "Computer Science / Related",
      "institution": "University Name",
      "year": "2024",
      "cgpa": "7.5/10",
      "relevant_coursework": ["Data Structures", "Web Development", "Database Management"]
    }
  ],
  "academic_projects": [
    {
      "name": "Project Name",
      "description": "Built a web app using React and Node.js",
      "technologies": ["React", "Node.js", "MongoDB"],
      "result": "Secured 95% marks"
    }
  ],
  "skills": [
    "Programming: JavaScript, Python, Java",
    "Frontend: React, HTML, CSS",
    "Backend: Node.js, Express",
    "Tools: Git, VS Code, Postman"
  ],
  "certifications": [
    "Google Data Analytics Professional Certificate",
    "AWS Cloud Practitioner"
  ],
  "internships": [
    {
      "role": "Intern",
      "company": "Company Name",
      "duration": "May 2023 - Jul 2023",
      "achievements": [
        "Developed responsive UI component",
        "Fixed 10+ bugs in production"
      ]
    }
  ]
}
    `,
  },
];

// Helper function to generate HTML from template
export function renderResumeFromTemplate(templateId, profileData) {
  const template = codeBasedResumeTemplates.find((t) => t.id === templateId);
  if (!template) return '<div>Template not found</div>';

  // Parse the template JSON
  let config = {};
  try {
    config = JSON.parse(template.template);
  } catch (e) {
    console.error('Template parsing error:', e);
  }

  // Merge with user profile data
  const merged = { ...config, ...profileData };

  // Return HTML based on template ID
  switch (templateId) {
    case 'modern-tech':
      return renderModernTech(merged);
    case 'ats-optimized':
      return renderATSOptimized(merged);
    default:
      return template.preview_html || '<div>Preview not available</div>';
  }
}

function renderModernTech(data) {
  return `
    <div style="font-family: Inter, sans-serif; max-width: 900px; padding: 40px; background: white;">
      <!-- Header -->
      <div style="border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 36px; color: #0f172a;">${data.header?.name || 'Your Name'}</h1>
        <p style="margin: 5px 0; color: #6b7280;">${data.header?.email || ''} | ${data.header?.phone || ''} | ${data.header?.location || ''}</p>
        <div style="margin-top: 10px; font-size: 14px;">
          ${
            data.header?.links
              ?.map((link) => `<a href="${link.url}" style="color: #2563eb; margin-right: 15px; text-decoration: none;">${link.label}</a>`)
              .join('')
          }
        </div>
      </div>

      <!-- Summary -->
      ${
        data.summary
          ? `
        <div style="margin-bottom: 25px; line-height: 1.6; color: #374151;">
          ${data.summary}
        </div>
      `
          : ''
      }

      <!-- Experience -->
      ${
        data.experience
          ? `
        <div style="margin-bottom: 25px;">
          <h2 style="border-left: 4px solid #2563eb; padding-left: 10px; margin-bottom: 15px; color: #0f172a;">Experience</h2>
          ${data.experience
            .map(
              (job) => `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="color: #0f172a;">${job.role || ''}</strong>
                <span style="color: #6b7280;">${job.duration || ''}</span>
              </div>
              <p style="margin: 3px 0; color: #6b7280;">${job.company || ''}</p>
              <ul style="margin: 8px 0; padding-left: 20px;">
                ${(job.achievements || []).map((a) => `<li style="margin: 4px 0; color: #374151;">${a}</li>`).join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }
    </div>
  `;
}

function renderATSOptimized(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 850px; padding: 40px; line-height: 1.5;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="margin: 0; font-size: 20px; font-weight: bold;">${data.header?.name || 'YOUR NAME'}</h1>
        <p style="margin: 5px 0; font-size: 11px;">${data.header?.email || ''} | ${data.header?.phone || ''} | ${data.header?.location || ''}</p>
      </div>

      <!-- Summary -->
      ${
        data.professional_summary
          ? `
        <div style="margin-bottom: 15px;">
          <h3 style="margin-bottom: 5px; font-weight: bold; font-size: 12px;">PROFESSIONAL SUMMARY</h3>
          <p style="margin: 0; font-size: 11px; line-height: 1.4;">${data.professional_summary}</p>
        </div>
      `
          : ''
      }

      <!-- Skills -->
      ${
        data.core_competencies
          ? `
        <div style="margin-bottom: 15px;">
          <h3 style="margin-bottom: 5px; font-weight: bold; font-size: 12px;">CORE COMPETENCIES</h3>
          <p style="margin: 0; font-size: 11px;">${data.core_competencies.join(' • ')}</p>
        </div>
      `
          : ''
      }

      <!-- Experience -->
      ${
        data.professional_experience
          ? `
        <div style="margin-bottom: 15px;">
          <h3 style="margin-bottom: 8px; font-weight: bold; font-size: 12px;">PROFESSIONAL EXPERIENCE</h3>
          ${data.professional_experience
            .map(
              (exp) => `
            <div style="margin-bottom: 10px;">
              <p style="margin: 0; font-weight: bold; font-size: 11px;">${exp.position} | ${exp.company} | ${exp.duration}</p>
              <ul style="margin: 4px 0; padding-left: 20px; font-size: 11px;">
                ${(exp.achievements || []).map((a) => `<li style="margin: 2px 0;">${a}</li>`).join('')}
              </ul>
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }
    </div>
  `;
}

export { renderModernTech, renderATSOptimized };
