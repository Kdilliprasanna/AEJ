// Professional Resume Templates - Code-Based like Overleaf
// Each template generates production-ready resume HTML

const professionalResumeTemplates = {
  templates: {
    'professional-ats': {
      id: 'professional-ats',
      name: 'Professional ATS',
      description: 'Clean, ATS-friendly format. Best for getting past automated scanners.',
      bestFor: 'Anyone applying to jobs',
      preview: `
        ┌─────────────────────────────────────┐
        │          JOHN DOE                   │
        │  +91-9876543210 | john@email.com  │
        │  github.com/johndoe | linkedin.com │
        └─────────────────────────────────────┘
        
        PROFESSIONAL SUMMARY
        Results-driven software engineer with 3+ years
        
        SKILLS
        Languages: Python, JavaScript, Java
        Frameworks: React, Node.js, Django
        
        EXPERIENCE
        Senior Developer | Company Name | 2023-Present
        
        EDUCATION
        B.Tech in Computer Science | University
      `,
      
      template: {
        metadata: {
          format: 'professional-ats',
          accentColor: '#1a365d',
          font: 'Arial',
          fontSize: 11
        },
        header: {
          name: 'Your Full Name',
          title: 'Your Professional Title',
          email: 'your.email@gmail.com',
          phone: '+91-9876543210',
          location: 'City, State',
          links: [
            { label: 'GitHub', url: 'github.com/yourprofile' },
            { label: 'LinkedIn', url: 'linkedin.com/in/yourprofile' },
            { label: 'Portfolio', url: 'yourportfolio.com' }
          ]
        },
        summary: 'Results-driven software engineer with proven expertise in building scalable applications. Strong track record of delivering projects on time with focus on code quality and user experience.',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Company Name',
            location: 'City, State',
            startDate: '2023-01-01',
            endDate: 'Present',
            description: 'Team Lead | Full Stack Development',
            achievements: [
              'Led team of 5 developers to build microservices architecture reducing latency by 40%',
              'Implemented CI/CD pipeline increasing deployment frequency from monthly to daily',
              'Mentored 3 junior developers, 2 got promoted within a year'
            ]
          }
        ],
        skills: {
          'Languages': ['Python', 'JavaScript', 'Java', 'SQL'],
          'Frontend': ['React', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind'],
          'Backend': ['Node.js', 'Django', 'Express', 'FastAPI'],
          'Databases': ['PostgreSQL', 'MongoDB', 'Redis'],
          'Tools': ['Git', 'Docker', 'Kubernetes', 'AWS']
        },
        education: [
          {
            degree: 'B.Tech',
            field: 'Computer Science',
            school: 'University Name',
            year: '2020',
            cgpa: '8.5/10'
          }
        ],
        certifications: [
          { name: 'AWS Solutions Architect Associate', issuer: 'Amazon', year: 2023 },
          { name: 'Google Cloud Associate Cloud Engineer', issuer: 'Google', year: 2023 }
        ],
        projects: [
          {
            name: 'E-commerce Platform',
            description: 'Built full-stack e-commerce platform using React, Node.js, MongoDB',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            link: 'github.com/project'
          }
        ]
      }
    },

    'modern-tech': {
      id: 'modern-tech',
      name: 'Modern Tech',
      description: 'Contemporary design with visual hierarchy. Great for tech companies.',
      bestFor: 'Tech roles, startups',
      template: {
        metadata: {
          format: 'modern-tech',
          accentColor: '#2563eb',
          borderLeft: true,
          font: 'Segoe UI'
        },
        header: {
          name: 'Your Full Name',
          title: 'Full Stack Developer',
          summary: 'Passionate about building scalable web applications',
          email: 'email@example.com',
          phone: '+91-9876543210',
          location: 'City'
        },
        sections: {
          experience: [
            {
              role: 'Senior Developer',
              company: 'Tech Company',
              duration: '2 years',
              highlights: ['Achievement 1', 'Achievement 2']
            }
          ],
          skills: ['React', 'Node.js', 'Python', 'AWS'],
          education: ['B.Tech Computer Science']
        }
      }
    },

    'creative-minimal': {
      id: 'creative-minimal',
      name: 'Creative Minimal',
      description: 'Minimalist design with creative touches. For design/creative roles.',
      bestFor: 'Designers, creative roles',
      template: {
        metadata: {
          format: 'creative-minimal',
          accentColor: '#f59e0b',
          spacing: 'generous',
          font: 'Poppins'
        }
      }
    },

    'data-metrics': {
      id: 'data-metrics',
      name: 'Data Metrics',
      description: 'Emphasis on quantified achievements. Perfect for data professionals.',
      bestFor: 'Data scientists, analysts',
      template: {
        metadata: {
          format: 'data-metrics',
          accentColor: '#10b981'
        }
      }
    }
  },

  // Render resume with user data
  renderResume: (templateId, userData) => {
    const template = professionalResumeTemplates.templates[templateId];
    if (!template) return null;

    // Merge user data with template
    const resume = {
      ...template.template,
      header: {
        ...template.template.header,
        ...userData.header
      },
      experience: userData.experience || template.template.experience,
      skills: userData.skills || template.template.skills,
      education: userData.education || template.template.education
    };

    return {
      template,
      data: resume,
      html: generateHTML(template, resume)
    };
  }
};

function generateHTML(template, data) {
  const { metadata, header, experience, skills, education } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${header.name} - Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: '${metadata.font || 'Arial'}', sans-serif;
      font-size: ${metadata.fontSize || 11}pt;
      line-height: 1.4;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 8.5in;
      height: 11in;
      background: white;
      margin: 0 auto;
      padding: 0.5in;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      ${metadata.borderLeft ? `border-left: 4px solid ${metadata.accentColor};` : ''}
    }
    
    header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid ${metadata.accentColor};
    }
    
    .name {
      font-size: 24pt;
      font-weight: bold;
      color: ${metadata.accentColor};
      margin-bottom: 2px;
    }
    
    .title {
      font-size: 12pt;
      color: #666;
      margin-bottom: 8px;
    }
    
    .contact {
      font-size: 9pt;
      color: #666;
    }
    
    .contact a {
      color: ${metadata.accentColor};
      text-decoration: none;
    }
    
    section {
      margin-bottom: 15px;
    }
    
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: ${metadata.accentColor};
      border-bottom: 1px solid ${metadata.accentColor};
      padding-bottom: 3px;
      margin-bottom: 8px;
    }
    
    .job, .edu, .project {
      margin-bottom: 12px;
    }
    
    .job-title, .degree {
      font-weight: bold;
      color: #333;
    }
    
    .company, .school {
      color: #666;
      font-size: 10pt;
    }
    
    .duration {
      color: #999;
      font-size: 10pt;
      float: right;
    }
    
    ul {
      margin-left: 20px;
      margin-top: 4px;
    }
    
    li {
      margin-bottom: 2px;
      font-size: 10pt;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    
    .skill-category {
      font-weight: bold;
      font-size: 10pt;
      color: ${metadata.accentColor};
    }
    
    .skill-items {
      font-size: 10pt;
      margin-left: 10px;
    }
    
    @media print {
      body { padding: 0; }
      .container { max-width: none; height: auto; padding: 0; box-shadow: none; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="name">${header.name}</div>
      <div class="title">${header.title}</div>
      <div class="contact">
        ${header.email} | ${header.phone} | ${header.location}
        ${header.links?.map(l => `<br><a href="${l.url}">${l.label}</a>`).join(' | ')}
      </div>
    </header>

    ${header.summary ? `
    <section>
      <div class="section-title">PROFESSIONAL SUMMARY</div>
      <p style="font-size: 10pt;">${header.summary}</p>
    </section>
    ` : ''}

    ${experience && experience.length > 0 ? `
    <section>
      <div class="section-title">PROFESSIONAL EXPERIENCE</div>
      ${experience.map(exp => `
        <div class="job">
          <div><span class="job-title">${exp.title}</span> <span class="duration">${exp.duration || exp.startDate}</span></div>
          <div class="company">${exp.company}${exp.location ? ` | ${exp.location}` : ''}</div>
          <ul>
            ${exp.achievements?.map(a => `<li>${a}</li>`).join('') || `<li>${exp.description || ''}</li>`}
          </ul>
        </div>
      `).join('')}
    </section>
    ` : ''}

    ${skills ? `
    <section>
      <div class="section-title">SKILLS</div>
      <div class="skills-grid">
        ${typeof skills === 'object' ? Object.entries(skills).map(([category, items]) => `
          <div>
            <div class="skill-category">${category}:</div>
            <div class="skill-items">${items.join(', ')}</div>
          </div>
        `).join('') : skills.map(s => `<div>${s}</div>`).join('')}
      </div>
    </section>
    ` : ''}

    ${education && education.length > 0 ? `
    <section>
      <div class="section-title">EDUCATION</div>
      ${education.map(edu => `
        <div class="edu">
          <div><span class="degree">${edu.degree} in ${edu.field}</span></div>
          <div class="school">${edu.school}</div>
          <div style="font-size: 9pt; color: #999;">${edu.year}${edu.cgpa ? ` | GPA: ${edu.cgpa}` : ''}</div>
        </div>
      `).join('')}
    </section>
    ` : ''}
  </div>
</body>
</html>
  `;
}

export { professionalResumeTemplates, generateHTML };
