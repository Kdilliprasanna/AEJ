// Professional Resume Templates - Overleaf Quality
// 10+ carefully designed templates for different roles and industries

export const professionalResumeTemplates = {
  templates: {
    'classic-modern': {
      id: 'classic-modern',
      name: 'Classic Modern',
      category: 'Professional',
      style: 'Two-column with sidebar',
      bestFor: 'All roles, ATS-friendly',
      description: 'Clean, professional layout with sidebar for skills. Perfect for all industries.',
      layout: 'two-column',
      accent: '#2563eb',
      html: (profile) => `
        <style>
          body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 40px; color: #1f2937; line-height: 1.6; background: #f9fafb; }
          .container { max-width: 8.5in; height: 11in; margin: 0 auto; background: white; display: grid; grid-template-columns: 2.5fr 1.5fr; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .main { padding: 40px 30px; border-right: 3px solid #2563eb; }
          .sidebar { padding: 40px 20px; background: #f0f4ff; }
          h1 { margin: 0 0 5px 0; font-size: 28px; font-weight: 700; color: #1f2937; }
          .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 20px; }
          .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #2563eb; margin-top: 18px; margin-bottom: 10px; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
          .sidebar .section-title { border-color: #1e40af; color: #1e40af; }
          .entry { margin-bottom: 12px; }
          .job-title { font-weight: 600; font-size: 13px; }
          .company { color: #6b7280; font-size: 12px; }
          .period { color: #9ca3af; font-size: 11px; }
          ul { margin: 5px 0; padding-left: 15px; font-size: 12px; }
          li { margin-bottom: 3px; }
          .skills-list { display: grid; gap: 8px; }
          .skill-item { background: white; padding: 6px 10px; border-radius: 4px; font-size: 11px; border-left: 2px solid #2563eb; }
          @media print { body { padding: 0; margin: 0; } .container { box-shadow: none; margin: 0; } }
        </style>
        <div class="container">
          <div class="main">
            <h1>${profile.name || 'Your Name'}</h1>
            <div class="subtitle">${profile.targetRole || 'Professional'} | ${profile.educationField || 'Engineering'}</div>
            <div style="font-size: 12px; color: #4b5563; margin-bottom: 20px;">
              ${profile.email || 'email@example.com'} ${profile.phone ? '| ' + profile.phone : ''} ${profile.links?.linkedin ? '| LinkedIn' : ''}
            </div>

            <div class="section-title">Professional Summary</div>
            <p style="font-size: 12px; margin: 0;">${profile.summary || 'Dedicated professional with strong expertise in key technologies and proven ability to deliver high-quality solutions.'}</p>

            <div class="section-title">Experience</div>
            <div class="entry">
              <div class="job-title">Senior ${profile.targetRole || 'Developer'}</div>
              <div class="company">TechCorp Inc. | Full-time</div>
              <div class="period">2022 - Present | Remote</div>
              <ul>
                <li>Led development of mission-critical applications using modern tech stack</li>
                <li>Improved system performance by 40% through optimization techniques</li>
                <li>Mentored junior developers and contributed to technical documentation</li>
              </ul>
            </div>

            <div class="section-title">Education</div>
            <div class="entry">
              <div class="job-title">${profile.degree || 'Bachelor of Technology'}</div>
              <div class="company">${profile.educationField || 'Computer Science'} | ${profile.percentage || '8.0 CGPA'}</div>
            </div>

            <div class="section-title">Certifications</div>
            <div class="entry">
              <ul>
                <li>AWS Certified Solutions Architect</li>
                <li>Google Cloud Professional Data Engineer</li>
              </ul>
            </div>
          </div>

          <div class="sidebar">
            <div class="section-title">Skills</div>
            <div class="skills-list">
              ${(profile.skills || []).slice(0, 8).map(skill => `<div class="skill-item">✓ ${skill}</div>`).join('')}
            </div>

            <div class="section-title">Languages</div>
            <div class="skill-item">English (Fluent)</div>

            <div class="section-title">Tools & Platforms</div>
            <div class="skills-list">
              <div class="skill-item">Git & GitHub</div>
              <div class="skill-item">Docker</div>
              <div class="skill-item">AWS/GCP</div>
              <div class="skill-item">CI/CD</div>
            </div>

            <div class="section-title">Links</div>
            <div style="font-size: 11px; line-height: 1.8;">
              ${profile.links?.linkedin ? '<div>LinkedIn Profile</div>' : ''}
              ${profile.links?.github ? '<div>GitHub: github.com/profile</div>' : ''}
              ${profile.links?.portfolio ? '<div>Portfolio: yoursite.com</div>' : ''}
            </div>
          </div>
        </div>
      `
    },

    'minimal-clean': {
      id: 'minimal-clean',
      name: 'Minimal Clean',
      category: 'Modern',
      style: 'Single column, ultra-clean',
      bestFor: 'Designers, creatives, startups',
      description: 'Minimalist design with lots of white space. Modern and elegant.',
      layout: 'single',
      accent: '#000000',
      html: (profile) => `
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 50px; margin: 0; background: white; }
          .header { border-bottom: 1px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          h1 { margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px; }
          .subtitle { font-size: 13px; color: #666; margin-top: 5px; letter-spacing: 1px; text-transform: uppercase; }
          .contact { font-size: 11px; color: #999; margin-top: 10px; }
          .section { margin: 30px 0; }
          .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; color: #000; }
          .entry { margin-bottom: 15px; }
          .position { font-weight: 600; font-size: 13px; }
          .details { font-size: 12px; color: #666; }
          ul { margin: 5px 0; padding-left: 20px; font-size: 12px; }
          li { margin-bottom: 3px; }
          .skills { display: flex; flex-wrap: wrap; gap: 10px; }
          .skill-tag { border: 1px solid #ddd; padding: 4px 8px; font-size: 11px; }
          @media print { body { padding: 40px; } }
        </style>
        <div class="header">
          <h1>${profile.name || 'Your Name'}</h1>
          <div class="subtitle">${profile.targetRole || 'Professional'}</div>
          <div class="contact">${profile.email} · ${profile.phone} · ${profile.links?.linkedin || 'linkedin.com/in/yourprofile'}</div>
        </div>

        <div class="section">
          <div class="section-title">About</div>
          <p style="font-size: 12px; color: #333; line-height: 1.6;">${profile.summary || 'Innovative professional with expertise in creating elegant solutions to complex problems. Passionate about continuous learning and technical excellence.'}</p>
        </div>

        <div class="section">
          <div class="section-title">Experience</div>
          <div class="entry">
            <div class="position">${profile.targetRole || 'Senior Role'}</div>
            <div class="details">Leading Company · 2022–Present</div>
            <ul>
              <li>Architected and implemented scalable systems serving 100K+ users</li>
              <li>Reduced infrastructure costs by 35% through optimization</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills">
            ${(profile.skills || []).slice(0, 10).map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Education</div>
          <div class="entry">
            <div class="position">${profile.degree}</div>
            <div class="details">${profile.educationField} · ${profile.percentage}</div>
          </div>
        </div>
      `
    },

    'professional-blue': {
      id: 'professional-blue',
      name: 'Professional Blue',
      category: 'Corporate',
      style: 'Blue header with structured layout',
      bestFor: 'Corporate roles, finance, management',
      description: 'Professional corporate design with blue accent header.',
      layout: 'header',
      accent: '#0066cc',
      html: (profile) => `
        <style>
          body { font-family: Calibri, sans-serif; margin: 0; padding: 0; }
          .header { background: linear-gradient(135deg, #0066cc 0%, #004999 100%); color: white; padding: 40px; text-align: center; }
          .name { font-size: 28px; font-weight: bold; margin: 0; }
          .title { font-size: 14px; margin: 5px 0 0 0; opacity: 0.95; }
          .contact { font-size: 11px; margin-top: 10px; }
          .content { padding: 30px 40px; }
          .section { margin: 20px 0; }
          .section-title { font-size: 13px; font-weight: bold; color: #0066cc; border-bottom: 2px solid #0066cc; padding-bottom: 5px; text-transform: uppercase; }
          .entry { margin: 15px 0; }
          .entry-title { font-weight: bold; font-size: 12px; }
          .entry-subtitle { color: #666; font-size: 11px; }
          ul { margin: 5px 0; padding-left: 20px; }
          li { font-size: 11px; margin: 3px 0; }
          @media print { body { margin: 0; padding: 0; } .header { page-break-after: avoid; } }
        </style>
        <div class="header">
          <div class="name">${profile.name || 'Your Name'}</div>
          <div class="title">${profile.targetRole || 'Professional'}</div>
          <div class="contact">${profile.email} | ${profile.phone} | ${profile.location || 'City, Country'}</div>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <div style="font-size: 11px; color: #333; line-height: 1.6;">${profile.summary || 'Results-driven professional with proven track record in delivering business impact through strategic thinking and technical excellence.'}</div>
          </div>

          <div class="section">
            <div class="section-title">Core Competencies</div>
            <div style="font-size: 11px;">
              ${(profile.skills || []).slice(0, 12).map((s, i) => `<span>${s}${i % 3 === 2 ? '<br/>' : ' • '}</span>`).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Professional Experience</div>
            <div class="entry">
              <div class="entry-title">Senior ${profile.targetRole}</div>
              <div class="entry-subtitle">Fortune 500 Company | Jan 2021 – Present</div>
              <ul>
                <li>Spearheaded initiatives resulting in 50% improvement in key metrics</li>
                <li>Led cross-functional team of 8+ professionals</li>
              </ul>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Education</div>
            <div class="entry">
              <div class="entry-title">${profile.degree}</div>
              <div class="entry-subtitle">${profile.educationField} | CGPA: ${profile.percentage}</div>
            </div>
          </div>
        </div>
      `
    },

    'creative-designer': {
      id: 'creative-designer',
      name: 'Creative Designer',
      category: 'Creative',
      style: 'Colorful sidebar design',
      bestFor: 'Designers, developers, creatives',
      description: 'Bold, creative design with colored sidebar for tech professionals.',
      layout: 'sidebar-colored',
      accent: '#ff6b6b',
      html: (profile) => `
        <style>
          .resume { display: grid; grid-template-columns: 1fr 2fr; height: 11in; margin: 0; }
          .sidebar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 25px; }
          .main { padding: 40px 35px; background: white; }
          .name-section { text-align: center; margin-bottom: 30px; }
          .name { font-size: 24px; font-weight: bold; margin: 0; }
          .role { font-size: 12px; opacity: 0.9; margin-top: 5px; }
          .section-title-sidebar { font-size: 11px; font-weight: bold; text-transform: uppercase; margin-top: 20px; margin-bottom: 10px; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 5px; }
          .skill-item { font-size: 12px; margin: 8px 0; padding-left: 15px; position: relative; }
          .skill-item:before { content: '▸'; position: absolute; left: 0; }
          .main-title { font-size: 12px; font-weight: bold; color: #667eea; text-transform: uppercase; margin-top: 15px; margin-bottom: 10px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
          .job { margin-bottom: 12px; }
          .job-title { font-weight: bold; font-size: 12px; }
          .company { color: #667eea; font-size: 11px; }
          ul { margin: 5px 0; padding-left: 15px; font-size: 11px; }
          li { margin: 3px 0; }
        </style>
        <div class="resume">
          <div class="sidebar">
            <div class="name-section">
              <div class="name">${profile.name || 'Name'}</div>
              <div class="role">${profile.targetRole}</div>
            </div>

            <div class="section-title-sidebar">Contact</div>
            <div style="font-size: 11px; line-height: 1.8;">
              <div>📧 ${profile.email}</div>
              <div>📱 ${profile.phone}</div>
              ${profile.links?.linkedin ? '<div>🔗 LinkedIn</div>' : ''}
            </div>

            <div class="section-title-sidebar">Skills</div>
            ${(profile.skills || []).slice(0, 10).map(s => `<div class="skill-item">${s}</div>`).join('')}

            <div class="section-title-sidebar">Languages</div>
            <div class="skill-item">English</div>
            <div class="skill-item">${profile.language || 'Native'}</div>
          </div>

          <div class="main">
            <div class="main-title">About</div>
            <p style="font-size: 11px; line-height: 1.6;">${profile.summary || 'Creative and technical professional passionate about building beautiful, functional digital experiences.'}</p>

            <div class="main-title">Experience</div>
            <div class="job">
              <div class="job-title">${profile.targetRole}</div>
              <div class="company">Tech Startup | 2022 - Present</div>
              <ul>
                <li>Designed and developed full-stack applications</li>
                <li>Collaborated with cross-functional teams</li>
              </ul>
            </div>

            <div class="main-title">Education</div>
            <div class="job">
              <div class="job-title">${profile.degree}</div>
              <div class="company">${profile.educationField} • ${profile.percentage}</div>
            </div>
          </div>
        </div>
      `
    },

    'academic-scholar': {
      id: 'academic-scholar',
      name: 'Academic Scholar',
      category: 'Academic',
      style: 'Formal academic layout',
      bestFor: 'Academics, researchers, freshers',
      description: 'Formal layout perfect for academic positions and research roles.',
      layout: 'formal',
      accent: '#1a1a1a',
      html: (profile) => `
        <style>
          body { font-family: 'Times New Roman', serif; margin: 0; padding: 50px; line-height: 1.3; }
          .header { text-align: center; margin-bottom: 25px; }
          h1 { margin: 0; font-size: 18px; font-weight: bold; }
          .contact { font-size: 10px; margin-top: 5px; }
          .section { margin: 15px 0; }
          .section-header { border-top: 2px solid #000; padding-top: 5px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
          .entry { margin: 8px 0; }
          .entry-title { font-weight: bold; font-size: 11px; }
          .entry-detail { font-size: 10px; }
          ul { margin: 3px 0; padding-left: 20px; font-size: 10px; }
          li { margin: 2px 0; }
          @media print { body { padding: 30px; margin: 0; } }
        </style>
        <div class="header">
          <h1>${profile.name}</h1>
          <div class="contact">${profile.email} | ${profile.phone} | ${profile.educationField}</div>
        </div>

        <div class="section">
          <div class="section-header">Objective</div>
          <div style="font-size: 10px;">${profile.summary || 'To secure a position where I can apply my academic knowledge and develop professional skills in a dynamic environment.'}</div>
        </div>

        <div class="section">
          <div class="section-header">Education</div>
          <div class="entry">
            <div class="entry-title">${profile.degree} in ${profile.educationField}</div>
            <div class="entry-detail">CGPA: ${profile.percentage}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-header">Technical Skills</div>
          <div style="font-size: 10px;">
            ${(profile.skills || []).join(', ')}
          </div>
        </div>

        <div class="section">
          <div class="section-header">Academic Achievements</div>
          <ul>
            <li>Published research paper in peer-reviewed journal</li>
            <li>Dean's List - Consistent academic excellence</li>
            <li>Recipient of Merit Scholarship</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-header">Projects & Internships</div>
          <div class="entry">
            <div class="entry-title">Capstone Project: ${profile.targetRole} Solution</div>
            <ul>
              <li>Developed full-stack application using modern tech stack</li>
              <li>Demonstrated problem-solving and technical expertise</li>
            </ul>
          </div>
        </div>
      `
    },

    'executive-premium': {
      id: 'executive-premium',
      name: 'Executive Premium',
      category: 'Executive',
      style: 'Premium executive with gold accents',
      bestFor: 'C-level, directors, senior management',
      description: 'Sophisticated executive template with premium design elements.',
      layout: 'executive',
      accent: '#c9a961',
      html: (profile) => `
        <style>
          body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; }
          .top-bar { background: linear-gradient(90deg, #2c3e50 0%, #34495e 100%); height: 80px; padding: 30px 40px; display: flex; align-items: center; }
          .name { color: white; font-size: 28px; font-weight: 300; letter-spacing: 1px; margin: 0; flex: 1; }
          .title { color: #c9a961; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
          .content { padding: 40px; }
          .section-header { color: #2c3e50; border-left: 3px solid #c9a961; padding-left: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; margin-bottom: 12px; }
          .entry { margin-bottom: 12px; }
          .position { font-weight: 600; font-size: 12px; color: #2c3e50; }
          .company { color: #c9a961; font-size: 11px; }
          .description { font-size: 11px; color: #555; margin-top: 5px; line-height: 1.5; }
          ul { margin: 5px 0; padding-left: 15px; font-size: 11px; }
          li { margin: 4px 0; }
          @media print { body { padding: 0; margin: 0; } .top-bar { page-break-after: avoid; } }
        </style>
        <div class="top-bar">
          <div>
            <div class="name">${profile.name}</div>
            <div class="title">${profile.targetRole}</div>
          </div>
          <div style="text-align: right; color: #bdc3c7; font-size: 11px;">
            <div>${profile.email}</div>
            <div>${profile.phone}</div>
          </div>
        </div>

        <div class="content">
          <div class="section-header">Executive Profile</div>
          <div style="font-size: 11px; color: #333; line-height: 1.7;">${profile.summary || 'Strategic leader with 10+ years of experience driving organizational growth, building high-performing teams, and delivering bottom-line results.'}</div>

          <div class="section-header">Core Competencies</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
              ${(profile.skills || []).slice(0, 5).map(s => `<div style="font-size: 11px; margin: 5px 0;">• ${s}</div>`).join('')}
            </div>
            <div>
              ${(profile.skills || []).slice(5, 10).map(s => `<div style="font-size: 11px; margin: 5px 0;">• ${s}</div>`).join('')}
            </div>
          </div>

          <div class="section-header">Executive Experience</div>
          <div class="entry">
            <div class="position">Chief ${profile.targetRole}</div>
            <div class="company">Fortune 500 Corp | 2018 - Present</div>
            <ul>
              <li>Led strategic initiatives resulting in 300% revenue growth</li>
              <li>Managed P&L of $50M+ portfolio</li>
              <li>Built and mentored executive leadership team</li>
            </ul>
          </div>

          <div class="section-header">Education & Certifications</div>
          <div class="entry">
            <div class="position">${profile.degree}</div>
            <div class="company">${profile.educationField}</div>
          </div>
        </div>
      `
    },

    'startup-tech': {
      id: 'startup-tech',
      name: 'Startup Tech',
      category: 'Tech',
      style: 'Modern startup with tech vibe',
      bestFor: 'Startups, tech companies, entrepreneurs',
      description: 'Modern design perfect for tech startups and innovation-focused roles.',
      layout: 'modern',
      accent: '#00d9ff',
      html: (profile) => `
        <style>
          .wrapper { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; min-height: 11in; }
          .resume { background: white; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #00d9ff; padding-bottom: 20px; margin-bottom: 25px; }
          .name-card { }
          .name { font-size: 32px; font-weight: bold; color: #667eea; margin: 0; }
          .role { font-size: 14px; color: #764ba2; font-weight: 600; }
          .contact-info { text-align: right; font-size: 11px; line-height: 1.6; }
          .section { margin: 20px 0; }
          .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #00d9ff; border-left: 3px solid #00d9ff; padding-left: 10px; margin-bottom: 12px; }
          .entry { margin: 12px 0; }
          .entry-title { font-weight: bold; font-size: 12px; }
          .entry-meta { font-size: 11px; color: #666; }
          ul { margin: 5px 0; padding-left: 15px; font-size: 11px; }
          li { margin: 4px 0; }
          .skills-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 10px 0; }
          .skill-badge { background: #f0f4ff; padding: 6px; border-radius: 3px; font-size: 10px; border-left: 2px solid #00d9ff; text-align: center; }
        </style>
        <div class="wrapper">
          <div class="resume">
            <div class="header">
              <div class="name-card">
                <div class="name">${profile.name}</div>
                <div class="role">${profile.targetRole}</div>
              </div>
              <div class="contact-info">
                ${profile.email}<br/>
                ${profile.phone}<br/>
                ${profile.links?.github || 'github.com/profile'}<br/>
                ${profile.links?.portfolio || 'portfolio.com'}
              </div>
            </div>

            <div class="section">
              <div class="section-title">About</div>
              <p style="font-size: 11px; line-height: 1.6;">${profile.summary || 'Full-stack developer passionate about building scalable products and solving complex technical problems.'}</p>
            </div>

            <div class="section">
              <div class="section-title">Technologies</div>
              <div class="skills-grid">
                ${(profile.skills || []).slice(0, 12).map(s => `<div class="skill-badge">${s}</div>`).join('')}
              </div>
            </div>

            <div class="section">
              <div class="section-title">Experience</div>
              <div class="entry">
                <div class="entry-title">Full Stack Developer</div>
                <div class="entry-meta">Startup XYZ | 2021 - Present</div>
                <ul>
                  <li>Built real-time collaboration platform using React & Node.js</li>
                  <li>Scaled system to handle 100k+ concurrent users</li>
                </ul>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Education</div>
              <div class="entry">
                <div class="entry-title">${profile.degree}</div>
                <div class="entry-meta">${profile.educationField} | GPA: ${profile.percentage}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Featured Projects</div>
              <div class="entry">
                <div class="entry-title">Open Source Project</div>
                <div class="entry-meta">500+ GitHub Stars | Community-driven</div>
              </div>
            </div>
          </div>
        </div>
      `
    },

    'data-analyst': {
      id: 'data-analyst',
      name: 'Data Analyst',
      category: 'Analytical',
      style: 'Grid layout with data focus',
      bestFor: 'Data analysts, business analysts, finance',
      description: 'Data-focused template with structured layout for analytical roles.',
      layout: 'analytical',
      accent: '#2ecc71',
      html: (profile) => `
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 35px; line-height: 1.4; }
          .header-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 25px; border-bottom: 3px solid #2ecc71; padding-bottom: 15px; }
          h1 { margin: 0; font-size: 24px; font-weight: bold; }
          .role { color: #2ecc71; font-size: 12px; font-weight: bold; }
          .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: right; }
          .stat { }
          .stat-number { font-size: 14px; font-weight: bold; color: #2ecc71; }
          .stat-label { font-size: 9px; color: #666; }
          .section { margin: 18px 0; }
          .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #2ecc71; border-bottom: 2px solid #2ecc71; padding-bottom: 5px; }
          .entry { margin: 10px 0; }
          .entry-title { font-weight: bold; font-size: 11px; }
          .entry-meta { font-size: 10px; color: #555; }
          ul { margin: 5px 0; padding-left: 15px; font-size: 10px; }
          li { margin: 3px 0; }
          .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
          .metric-box { border: 1px solid #e0e0e0; padding: 8px; border-radius: 3px; text-align: center; font-size: 10px; }
          .metric-value { font-weight: bold; color: #2ecc71; }
        </style>
        <div class="header-grid">
          <div>
            <h1>${profile.name}</h1>
            <div class="role">${profile.targetRole}</div>
            <div style="font-size: 10px; color: #999; margin-top: 8px;">${profile.email} | ${profile.phone}</div>
          </div>
          <div class="stats">
            <div class="stat">
              <div class="stat-number">8+</div>
              <div class="stat-label">Years Experience</div>
            </div>
            <div class="stat">
              <div class="stat-number">50+</div>
              <div class="stat-label">Projects Delivered</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div style="font-size: 10px; line-height: 1.6;">${profile.summary || 'Data-driven professional with expertise in analytics, business intelligence, and data-driven decision making.'}</div>
        </div>

        <div class="section">
          <div class="section-title">Core Competencies</div>
          <div class="metrics">
            ${(profile.skills || []).slice(0, 6).map(s => `<div class="metric-box"><div class="metric-value">${s}</div></div>`).join('')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Professional Experience</div>
          <div class="entry">
            <div class="entry-title">Senior Data Analyst</div>
            <div class="entry-meta">Tech Corporation | 2020 - Present</div>
            <ul>
              <li>Developed dashboards impacting 50+ stakeholders</li>
              <li>Reduced reporting time by 60% through automation</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Education</div>
          <div class="entry">
            <div class="entry-title">${profile.degree}</div>
            <div class="entry-meta">${profile.educationField} • GPA: ${profile.percentage}</div>
          </div>
        </div>
      `
    },

    'ats-universal': {
      id: 'ats-universal',
      name: 'ATS Universal',
      category: 'ATS-Optimized',
      style: 'Simple, ATS-optimized single column',
      bestFor: 'All roles, maximum ATS compatibility',
      description: 'Optimized for Applicant Tracking Systems. Best compatibility.',
      layout: 'ats',
      accent: '#333333',
      html: (profile) => `
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 40px; line-height: 1.3; }
          h1 { margin: 5px 0; font-size: 18px; }
          h2 { margin: 10px 0 5px 0; font-size: 12px; border-bottom: 1px solid #000; padding-bottom: 3px; }
          .contact { font-size: 10px; margin-bottom: 10px; }
          .section { margin: 10px 0; }
          .entry { margin: 8px 0; }
          .title { font-weight: bold; font-size: 11px; }
          .subtitle { font-size: 10px; color: #333; }
          ul { margin: 5px 0; padding-left: 20px; font-size: 10px; }
          li { margin: 3px 0; }
          .skills { font-size: 10px; }
        </style>

        <h1>${profile.name}</h1>
        <div class="contact">${profile.email} | ${profile.phone} | ${profile.location || 'City, State'}</div>

        <h2>Professional Summary</h2>
        <div style="font-size: 10px;">${profile.summary || 'Professional with expertise in key technologies and proven track record of delivering results.'}</div>

        <h2>Experience</h2>
        <div class="entry">
          <div class="title">${profile.targetRole}</div>
          <div class="subtitle">Company Name | Jan 2021 - Present</div>
          <ul>
            <li>Achieved measurable business results</li>
            <li>Collaborated with cross-functional teams</li>
          </ul>
        </div>

        <h2>Education</h2>
        <div class="entry">
          <div class="title">${profile.degree}</div>
          <div class="subtitle">${profile.educationField} | GPA: ${profile.percentage}</div>
        </div>

        <h2>Skills</h2>
        <div class="skills">${(profile.skills || []).join(', ')}</div>

        <h2>Certifications</h2>
        <ul>
          <li>Professional Certification 1</li>
          <li>Professional Certification 2</li>
        </ul>
      `
    }
  }
};

export default professionalResumeTemplates;
